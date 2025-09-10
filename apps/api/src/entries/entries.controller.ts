import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { EntriesService } from './entries.service';

@Controller('entries')
export class EntriesController {
  constructor(
    private readonly entriesService: EntriesService,
  ) {}

  @Post()
  async createEntry(@Body() body: any) {
    console.log('Received entry creation request:', body);
    // return this.entriesService.createEntry(body.content, body.userId, body.promptId);
  }

  @Get('user/:userId')
  async getEntriesByUser(@Param('userId') userId: string) {
    return this.entriesService.getEntriesByUser(userId);
  }

  @Get('prompt/:promptId')
  async getEntriesByPrompt(@Param('promptId') promptId: string) {
    return this.entriesService.getEntriesByPrompt(promptId);
  }
}
