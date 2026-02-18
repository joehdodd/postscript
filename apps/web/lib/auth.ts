'use server';
import jwt from 'jsonwebtoken';
import { prisma } from '@repo/prisma';
import crypto from 'crypto';

const ACCESS_TOKEN_EXPIRY = '1h';  // Shorter access token
const REFRESH_TOKEN_EXPIRY = '7d'; // Longer refresh token
const MAGIC_LINK_EXPIRY = '8h';    // Magic link remains the same

interface TokenPayload {
  userId: string;
  email: string;
  type?: 'access' | 'refresh' | 'magic';
}

function getMagicLinkSecret(): string {
  const secret = process?.env?.MAGIC_LINK_SECRET;
  if (!secret) {
    throw new Error('MAGIC_LINK_SECRET environment variable is not set');
  }
  return secret;
}

// Generate access token (short-lived)
export async function generateAccessToken(
  userId: string,
  email: string,
): Promise<string> {
  const payload: TokenPayload = {
    userId,
    email,
    type: 'access',
  };

  const secret = getMagicLinkSecret();
  return jwt.sign(payload, secret, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
}

// Generate refresh token (long-lived, stored in database)
export async function generateRefreshToken(
  userId: string,
): Promise<{ token: string; id: string }> {
  const tokenValue = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

  // Store refresh token in database
  const refreshToken = await prisma.refreshToken.create({
    data: {
      userId,
      token: tokenValue,
      expiresAt,
    },
  });

  return { token: tokenValue, id: refreshToken.id };
}

// Validate and refresh access token using refresh token
export async function refreshAccessToken(
  refreshToken: string,
): Promise<{ accessToken: string; newRefreshToken: string } | null> {
  try {
    // Find refresh token in database
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      // Clean up expired token
      if (storedToken) {
        await prisma.refreshToken.delete({ where: { id: storedToken.id } });
      }
      return null;
    }

    // Generate new tokens
    const newAccessToken = await generateAccessToken(
      storedToken.userId,
      storedToken.user.email,
    );
    
    const { token: newRefreshTokenValue } = await generateRefreshToken(
      storedToken.userId,
    );

    // Remove old refresh token
    await prisma.refreshToken.delete({ where: { id: storedToken.id } });

    return {
      accessToken: newAccessToken,
      newRefreshToken: newRefreshTokenValue,
    };
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
}

// Revoke refresh token (for logout)
export async function revokeRefreshToken(token: string): Promise<boolean> {
  try {
    await prisma.refreshToken.deleteMany({
      where: { token },
    });
    return true;
  } catch (error) {
    console.error('Error revoking refresh token:', error);
    return false;
  }
}

// Clean up expired refresh tokens
export async function cleanupExpiredTokens(): Promise<void> {
  try {
    await prisma.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  } catch (error) {
    console.error('Error cleaning up expired tokens:', error);
  }
}

// Existing magic link functions (backwards compatibility)
export async function generateMagicLinkToken(
  email: string,
): Promise<string | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      type: 'magic',
    };

    const secret = getMagicLinkSecret();

    return jwt.sign(payload, secret, {
      expiresIn: MAGIC_LINK_EXPIRY,
    });
  } catch (error) {
    console.error('Error generating token:', error);
    return null;
  }
}

export async function validateMagicLinkToken(
  token: string,
): Promise<TokenPayload | null> {
  try {
    const secret = getMagicLinkSecret();

    const payload = jwt.verify(token, secret) as TokenPayload;
    return payload;
  } catch (error) {
    console.error('Error validating token:', error);
    return null;
  }
}

export async function getUserIdFromToken(
  token: string,
): Promise<string | null> {
  const payload = await validateMagicLinkToken(token);
  return payload?.userId || null;
}

export async function validateTokenWithUser(token: string): Promise<{
  valid: boolean;
  userId?: string;
  email?: string;
}> {
  const payload = await validateMagicLinkToken(token);

  if (!payload) {
    return { valid: false };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      return { valid: false };
    }

    return {
      valid: true,
      userId: payload.userId,
      email: payload.email,
    };
  } catch (error) {
    console.error('Database error during token validation:', error);
    return { valid: false };
  }
}