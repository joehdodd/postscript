'use server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import {
  validateTokenWithUser,
  getUserIdFromToken,
  generateMagicLinkToken,
} from '@/lib/auth';
import { sendMagicLinkEmail } from '@/lib/email';
import { prisma } from '@repo/prisma';

export async function requireAuth(): Promise<{
  valid: boolean;
  userId?: string;
  email?: string;
}> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/');
  }

  const result = await validateTokenWithUser(token);
  if (!result.valid || !result.userId) {
    redirect('/');
  }
  return {
    valid: true,
    userId: result.userId,
    email: result.email,
  };
}

export async function getCurrentUserId(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return null;
    }

    return getUserIdFromToken(token);
  } catch {
    return null;
  }
}

export async function sendMagicLink(
  email: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const token = await generateMagicLinkToken(email);
    if (!token) {
      return { success: false, error: 'There was an issue generating the magic link.' };
    }
    const url = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://postscript.ink'}/prompt?token=${token}`;
    console.log('Generated magic link URL:', url);
    await sendMagicLinkEmail(email, url);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error.',
    };
  }
}

export async function signupUser(
  email: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          frequency: 'daily', // default frequency
        },
      });
    }

    const token = await generateMagicLinkToken(email);
    if (!token) {
      return { success: false, error: 'Failed to generate magic link.' };
    }

    const url = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://postscript.ink'}/prompt?token=${token}`;
    console.log('Generated signup magic link URL:', url);
    await sendMagicLinkEmail(email, url);
    return { success: true };
  } catch (error) {
    console.error('Signup error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error.',
    };
  }
}
