import { Controller, Post, Body, Get, Query, HttpException } from '@nestjs/common';
import { MagicLinkService } from './magic-link.service';

@Controller('auth')
export class MagicLinkController {
  constructor(private readonly magicLinkService: MagicLinkService) {}

  // Endpoint to generate a magic link token
  @Post()
  generateMagicLink(@Body() body: { userId: string; promptId: string }) {
    const token = this.magicLinkService.generateToken(body.userId, body.promptId);
    return { token };
  }

  // Endpoint to validate a magic link token and get user/prompt info
  @Get()
  validateMagicLink(@Query('token') token: string) {
    const payload = this.magicLinkService.validateToken(token);
    console.log('Validated payload:', payload);
    if (!payload) {
      throw new HttpException('Invalid or expired token', 400); 
    }
    return { valid: true, ...payload };
  }
}
