import { Controller, Get } from '@nestjs/common';
import { PromptsService } from './prompts.service';

@Controller('prompts')
export class PromptsController {
  constructor(private readonly promptsService: PromptsService) {}

  @Get('daily')
  async getDailyPrompt(): Promise<{ prompt: string }> {
    const prompt = await this.promptsService.generateDailyPrompt();
    return { prompt };
  }
}
