import { Controller, Post, Body, Get, Param, HttpException } from '@nestjs/common';
import { EntriesService } from './entries.service';

@Controller('entries')
export class EntriesController {
  constructor(private readonly entriesService: EntriesService) {}

  @Post()
  async createEntry(
    @Body() body: { content: string; userId: string; promptId: string },
  ) {
    return this.entriesService.createEntry(
      body.content,
      body.userId,
      body.promptId,
    );
  }

  @Get('user/:userId')
  async getEntriesByUser(@Param('userId') userId: string) {
    return this.entriesService.getEntriesByUser(userId);
  }

  @Get('prompt/:promptId')
  async getEntriesByPrompt(@Param('promptId') promptId: string) {
    return this.entriesService.getEntriesByPrompt(promptId);
  }

  @Get('prompt/:promptId/user/:userId')
  async getEntryByPromptAndUser(
    @Param('promptId') promptId: string,
    @Param('userId') userId: string,
  ) {
    const entry = await this.entriesService.getEntryByPromptAndUser(promptId, userId);
    if (!entry) {
      return new HttpException('No entry found for this user and prompt.', 404);
    }
    return entry;
  }
}
