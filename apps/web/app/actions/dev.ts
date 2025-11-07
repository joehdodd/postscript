'use server';
import { generateMagicLinkToken } from '@/lib/auth';
import { prisma } from '@repo/prisma';

/**
 * Development-only helper to generate test magic link tokens
 * DO NOT USE IN PRODUCTION
 */
export async function generateTestToken(email: string, promptId?: string) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('This function is only available in development');
  }

  // Ensure user exists
  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        frequency: 'daily',
      },
    });
  }

  // Generate token
  const token = await generateMagicLinkToken(email, {
    promptId,
    purpose: promptId ? 'entry' : 'auth',
  });

  return {
    token,
    userId: user.id,
    testUrl: `http://localhost:3001/entry?token=${token}`,
  };
}

/**
 * Development-only helper to create a test prompt
 */
export async function createTestPrompt(userId: string, content: string = 'What made you smile today?') {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('This function is only available in development');
  }

  const prompt = await prisma.prompt.create({
    data: {
      content,
      userId,
      frequency: 'daily',
      isOpen: true,
    },
  });

  return prompt;
}
