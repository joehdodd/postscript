import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend = new Resend(process.env.RESEND_API_KEY);

  async sendPrompt(email: string, prompt: string) {
    return this.resend.emails.send({
      from: 'noreply@yourdomain.com',
      to: email,
      subject: 'Your Journaling Prompt',
      html: `<p>${prompt}</p>`,
    });
  }
}
