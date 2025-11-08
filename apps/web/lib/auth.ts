'use server';
import jwt from 'jsonwebtoken';
import { prisma } from '@repo/prisma';

const MAGIC_LINK_EXPIRY = '8h';

interface TokenPayload {
  userId: string;
  email: string;
}

function getMagicLinkSecret(): string {
  const secret = process?.env?.MAGIC_LINK_SECRET;
  if (!secret) {
    throw new Error('MAGIC_LINK_SECRET environment variable is not set');
  }
  return secret;
}

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
}
