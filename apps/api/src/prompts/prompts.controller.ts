import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PromptsService } from './prompts.service';

@Controller('prompts')
export class PromptsController {
  constructor(private readonly promptsService: PromptsService) {}

  @Get('daily')
  async getDailyPrompt(): Promise<{ prompt: string }> {
    const prompt = await this.promptsService.generateDailyPrompt();
    return { prompt };
  }

  @Get(':id')
  async getPromptById(@Param('id') id: string) {
    return this.promptsService.getPromptById(id);
  }

  @Post()
  async createPrompt(@Body() body: { content: string; userId: string }) {
    return this.promptsService.createPrompt(body.content, body.userId);
  }
}
