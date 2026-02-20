import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Headers, UnauthorizedException } from '@nestjs/common';
import { EmailService } from './email.service';

// Simple API key guard for internal service communication
class ApiKeyGuard {
  canActivate(context: any): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['authorization']?.replace('Bearer ', '');
    const expectedKey = process.env.API_KEY_SECRET;

    if (!expectedKey) {
      throw new Error('API_KEY_SECRET not configured');
    }

    return apiKey === expectedKey;
  }
}

@UseGuards(ApiKeyGuard)
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) { }

  @Post('send-prompt')
  @HttpCode(HttpStatus.OK)
  async sendPrompt(
    @Body() body: { email: string; prompt?: string; userId?: string },
  ) {
    const { email, prompt } = body;

    // Validate required fields
    if (!email) {
      throw new UnauthorizedException('Email is required');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new UnauthorizedException('Valid email is required');
    }

    const user = await this.emailService['prisma'].user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    };

    try {
      const promptContent = prompt || this.getDefaultPrompt();

      const result = await this.emailService.sendPrompt(email, promptContent);

      return {
        success: true,
        message: `Prompt sent to ${email}`,
        promptId: result.id,
        promptContent: result.content,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send prompt',
      };
    }
  }

  /**
   * Get a default prompt if none provided
   */
  private getDefaultPrompt(): string {
    const prompts = [
      'What made you smile today?',
      'What are you grateful for right now?',
      'What challenged you today and how did you respond?',
      'What did you learn today?',
      'What brought you peace today?',
      'What are you looking forward to tomorrow?',
      'What was the most meaningful part of your day?',
    ];

    return prompts[Math.floor(Math.random() * prompts.length)];
  }
}
