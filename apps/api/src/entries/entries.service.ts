import { Injectable } from '@nestjs/common';
import { prisma } from '@repo/prisma';

@Injectable()
export class EntriesService {
  async createEntry(content: string, userId: string, promptId: string) {
    const entry = await prisma.entry.create({
      data: {
        content,
        userId,
        promptId,
      },
    });
    if (entry) {
      await prisma.prompt.update({
        where: { id: promptId },
        data: { isOpen: false },
      });
    }
    return entry;
  }

  async getEntriesByUser(userId: string) {
    return prisma.entry.findMany({ where: { userId } });
  }

  async getEntriesByPrompt(promptId: string) {
    return prisma.entry.findMany({ where: { promptId } });
  }

  async getEntryByPromptAndUser(promptId: string, userId: string) {
    return prisma.entry.findFirst({ where: { promptId, userId } });
  }
}
