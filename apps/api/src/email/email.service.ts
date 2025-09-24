import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import { AuthService } from 'src/auth/auth.service';
import { PromptsService } from 'src/prompts/prompts.service';

@Injectable()
export class EmailService {
  constructor(
    private readonly promptsService: PromptsService,
    private readonly authService: AuthService,
  ) {}
  private resend = new Resend(process.env.RESEND_API_KEY);

  async sendPrompt(email: string, prompt: string) {
    const generatedPrompt = await this.promptsService.createPrompt(
      prompt,
      email,
    );
    const magicLinkToken = await this.authService.generateToken(
      email,
      generatedPrompt.id,
    );
    const magicLink = `${process.env.WEB_APP_URL}/entry?token=${magicLinkToken}`;
    await this.resend.emails.send({
      from: 'P.s. <noreply@prompts.postscript.ink>',
      to: [email],
      subject: 'Your Prompt for Today',
      html: `<p>${generatedPrompt.content}</p><p><a href="${magicLink}">Click here</a> to access your prompt.</p>`,
    });
  }
}
