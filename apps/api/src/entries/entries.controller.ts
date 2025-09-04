import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { EntriesService } from './entries.service';
import { MagicLinkService } from '../auth/magic-link.service';

@Controller('entries')
export class EntriesController {
  constructor(
    private readonly entriesService: EntriesService,
    private readonly magicLinkService: MagicLinkService,
  ) {}

  @Post()
  async createEntry(@Body() body: { content: string; userId: string; promptId: string }) {
    return this.entriesService.createEntry(body.content, body.userId, body.promptId);
  }

  @Get('user/:userId')
  async getEntriesByUser(@Param('userId') userId: string) {
    return this.entriesService.getEntriesByUser(userId);
  }

  @Get('prompt/:promptId')
  async getEntriesByPrompt(@Param('promptId') promptId: string) {
    return this.entriesService.getEntriesByPrompt(promptId);
  }

  // Endpoint to generate a magic link token
  @Post('magic-link')
  generateMagicLink(@Body() body: { userId: string; promptId: string }) {
    const token = this.magicLinkService.generateToken(body.userId, body.promptId);
    return { token };
  }

  // Endpoint to validate a magic link token and get user/prompt info
  @Get('validate-magic-link')
  validateMagicLink(@Query('token') token: string) {
    const payload = this.magicLinkService.validateToken(token);
    if (!payload) {
      return { valid: false };
    }
    return { valid: true, ...payload };
  }
}
