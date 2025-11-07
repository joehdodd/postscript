'use server';
import { prisma } from '@repo/prisma';
import { revalidatePath } from 'next/cache';

/**
 * Create a new entry for a prompt
 * Now uses direct Prisma access instead of calling NestJS API
 */
export async function createEntry(
  data: FormData,
  userId: string,
  promptId: string,
) {
  try {
    const content = data.get('content') as string;
    
    if (!content || !content.trim()) {
      throw new Error('Content is required');
    }

    // Create the entry
    await prisma.entry.create({
      data: {
        content: content.trim(),
        userId,
        promptId,
      },
    });

    // Close the prompt after entry is created
    await prisma.prompt.update({
      where: { id: promptId },
      data: { isOpen: false },
    });

    // Revalidate the entry page
    revalidatePath('/entry');
    
    return { success: true };
  } catch (error) {
    console.error('Error creating entry:', error);
    throw new Error('Failed to create entry');
  }
}

/**
 * Fetch an entry by prompt and user
 * Now uses direct Prisma access instead of calling NestJS API
 */
export async function fetchEntryByPromptAndUser(
  promptId: string,
  userId: string,
) {
  try {
    return await prisma.entry.findFirst({
      where: {
        promptId,
        userId,
      },
    });
  } catch (error) {
    console.error('Error fetching entry:', error);
    return null;
  }
}
