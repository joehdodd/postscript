import { Controller, Get, Post, Body } from '@nestjs/common';
import { PromptsService } from './prompts.service';

@Controller('prompts')
export class PromptsController {
  constructor(private readonly promptsService: PromptsService) {}

  @Get('daily')
  async getDailyPrompt(): Promise<{ prompt: string }> {
    const prompt = await this.promptsService.generateDailyPrompt();
    return { prompt };
  }

  @Post()
  async createPrompt(@Body() body: { content: string; userId: string }) {
    return this.promptsService.createPrompt(body.content, body.userId);
  }
}
