import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend = new Resend(process.env.RESEND_API_KEY);

  async sendPrompt(email: string, prompt: string) {
    await this.resend.emails.send({
      from: 'P.s. <noreply@prompts.postscript.ink>',
      to: [email],
      subject: 'Your Prompt for Today',
      html: `<p>${prompt}</p>`,
    });
  }
}
