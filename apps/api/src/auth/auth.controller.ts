import { Controller, Post, Body, Get, Query, HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Endpoint to generate a magic link token
  @Post()
  async generateMagicLink(@Body() body: { email: string; promptId: string }) {
    const token = await this.authService.generateToken(body.email, body.promptId);
    return { token };
  }

  // Endpoint to validate a magic link token and get user/prompt info
  @Get()
  validateMagicLink(@Query('token') token: string) {
    const payload = this.authService.validateToken(token);
    if (!payload) {
      throw new HttpException('Invalid or expired token', 400); 
    }
    return { valid: true, ...payload };
  }
}
