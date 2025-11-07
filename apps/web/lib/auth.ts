'use server';
import jwt from 'jsonwebtoken';
import { prisma } from '@repo/prisma';

const MAGIC_LINK_SECRET = process.env.MAGIC_LINK_SECRET || 'supersecret';
const MAGIC_LINK_EXPIRY = '8h';

interface TokenPayload {
  userId: string;
  promptId?: string;
  purpose: 'entry' | 'auth';
}

export async function generateMagicLinkToken(
  email: string,
  options: { promptId?: string; purpose?: 'entry' | 'auth' } = {}
): Promise<string | null> {
  const { promptId, purpose = 'auth' } = options;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    const payload: TokenPayload = {
      userId: user.id,
      purpose,
      ...(promptId && { promptId }),
    };

    return jwt.sign(payload, MAGIC_LINK_SECRET, { expiresIn: MAGIC_LINK_EXPIRY });
  } catch (error) {
    console.error('Error generating token:', error);
    return null;
  }
}

export async function validateMagicLinkToken(token: string): Promise<TokenPayload | null> {
  try {
    const payload = jwt.verify(token, MAGIC_LINK_SECRET) as TokenPayload;
    return payload;
  } catch (error) {
    console.error('Error validating token:', error);
    return null;
  }
}

export async function getUserIdFromToken(token: string): Promise<string | null> {
  const payload = await validateMagicLinkToken(token);
  return payload?.userId || null;
}

export async function validateTokenWithUser(token: string): Promise<{
  valid: boolean;
  userId?: string;
  promptId?: string;
  purpose?: 'entry' | 'auth';
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
    ...(payload.promptId && { promptId: payload.promptId }),
    purpose: payload.purpose,
  };
}
