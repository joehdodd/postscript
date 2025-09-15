import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { OpenAI } from 'openai';

@Injectable()
export class PromptsService {
  private prisma = new PrismaClient();
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

  async createPrompt(content: string, email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return this.prisma.prompt.create({
      data: {
        content,
        frequency: 'daily',
        user: { connect: { id: user.id } },
      },
    });
  }
}
