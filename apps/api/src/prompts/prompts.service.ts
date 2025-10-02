import { Injectable } from '@nestjs/common';
import { prisma } from '@repo/prisma';
import { ConfigService } from '@nestjs/config';
import { OpenAI } from 'openai';

@Injectable()
export class PromptsService {
  constructor(private configService: ConfigService) {}

  async generateDailyPrompt(): Promise<string> {
    const openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Generate a unique daily journaling prompt.' },
      ],
      max_tokens: 50,
    });

    return response.choices[0].message?.content ?? 'Write about your day.';
  }

  async getPromptById(id: string) {
    return prisma.prompt.findUnique({
      where: { id },
    });
  }

  async getPromptsByUserId(userId: string) {
    return prisma.prompt.findMany({
      where: { userId },
    });
  }

  async createPrompt(content: string, email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return prisma.prompt.create({
      data: {
        content,
        frequency: 'daily',
        user: { connect: { id: user.id } },
      },
    });
  }
}
