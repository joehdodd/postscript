import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class EntriesService {
  async createEntry(content: string, userId: string, promptId: string) {
    return prisma.entry.create({
      data: {
        content,
        userId,
        promptId,
      },
    });
  }

  async getEntriesByUser(userId: string) {
    return prisma.entry.findMany({ where: { userId } });
  }

  async getEntriesByPrompt(promptId: string) {
    return prisma.entry.findMany({ where: { promptId } });
  }
}
