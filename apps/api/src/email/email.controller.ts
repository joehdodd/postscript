import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  /**
   * Manually send a prompt email to a user
   * POST /email/send-prompt
   * Body: { email: string, prompt?: string }
   */
  @Post('send-prompt')
  @HttpCode(HttpStatus.OK)
  async sendPrompt(
    @Body() body: { email: string; prompt?: string },
  ) {
    const { email, prompt } = body;

    if (!email) {
      return {
        success: false,
        error: 'Email is required',
      };
    }

    try {
      // Use provided prompt or generate a default one
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
