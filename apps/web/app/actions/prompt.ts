'use server';
import { prisma } from '@repo/prisma';

interface Prompt {
  id: string;
  content: string;
  isOpen: boolean;
  createdAt: Date;
  sentAt: Date | null;
}

/**
 * Fetch a specific prompt by ID
 * Now uses direct Prisma access instead of calling NestJS API
 */
export async function fetchPrompt(promptId: string): Promise<Prompt | null> {
  try {
    return await prisma.prompt.findUnique({
      where: { id: promptId },
    });
  } catch {
    return null;
  }
}

/**
 * Fetch the latest open prompt for a user
 * Used when user accesses /entry directly (not from email)
 * Now uses direct Prisma access instead of calling NestJS API
 */
export async function fetchLatestOpenPrompt(userId: string): Promise<Prompt | null> {
  try {
    return await prisma.prompt.findFirst({
      where: {
        userId,
        isOpen: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  } catch {
    return null;
  }
}

/**
 * Fetch all prompts for a user (for history/review page)
 * Now uses direct Prisma access instead of calling NestJS API
 */
export async function fetchUserPrompts(userId: string): Promise<Prompt[]> {
  try {
    return await prisma.prompt.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  } catch {
    return [];
  }
}
