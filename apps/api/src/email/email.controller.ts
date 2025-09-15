import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post()
  async sendPrompt(@Body() body: { email: string; prompt: string }) {
    return this.emailService.sendPrompt(body.email, body.prompt);
  }
}
