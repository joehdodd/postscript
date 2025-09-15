import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import { MagicLinkService } from 'src/auth/magic-link.service';
import { PromptsService } from 'src/prompts/prompts.service';

@Injectable()
export class EmailService {
  constructor(
    private readonly promptsService: PromptsService,
    private readonly magicLinkService: MagicLinkService,
  ) {}
  private resend = new Resend(process.env.RESEND_API_KEY);

  async sendPrompt(email: string, prompt: string) {
    const generatedPrompt = await this.promptsService.createPrompt(
      prompt,
      email,
    );
    const magicLinkToken = await this.magicLinkService.generateToken(
      email,
      generatedPrompt.id,
    );
    const magicLink = `http://localhost:3001/entry?token=${magicLinkToken}`;
    await this.resend.emails.send({
      from: 'P.s. <noreply@prompts.postscript.ink>',
      to: [email],
      subject: 'Your Prompt for Today',
      html: `<p>${generatedPrompt.content}</p><p><a href="${magicLink}">Click here</a> to access your prompt.</p>`,
    });
  }
}
