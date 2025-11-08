import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { prisma } from '@repo/prisma';
import * as jwt from 'jsonwebtoken';

const MAGIC_LINK_EXPIRY = '8h';

function getMagicLinkSecret(): string {
  const secret = process.env.MAGIC_LINK_SECRET;
  if (!secret) {
    throw new Error('MAGIC_LINK_SECRET environment variable is not set');
  }
  return secret;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private resend = new Resend(process.env.RESEND_API_KEY);

  async sendPrompt(email: string, promptContent: string) {
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new Error(`User not found: ${email}`);
      }

      const prompt = await prisma.prompt.create({
        data: {
          content: promptContent,
          frequency: user.frequency,
          userId: user.id,
          sentAt: new Date(),
          isOpen: true,
        },
      });

      const secret = getMagicLinkSecret();

      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
        },
        secret,
        { expiresIn: MAGIC_LINK_EXPIRY },
      );

      const magicLink = `${process.env.WEB_APP_URL}/entry/${prompt.id}?token=${token}`;

      const sender = await this.resend.emails.send({
        from: '_postscript <noreply@prompts.postscript.ink>',
        to: [email],
        subject: 'Your Prompt for Today',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #f8fafc;">
            <div style="background-color: #ffffff; padding: 32px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
              <h1 style="color: #1e293b; font-size: 28px; font-weight: 700; margin: 0 0 8px 0; text-align: center;">_postscript</h1>
              <h2 style="color: #334155; font-size: 20px; font-weight: 600; margin: 24px 0 16px 0;">Your prompt for today</h2>
              <p style="font-size: 18px; color: #475569; line-height: 1.6; margin: 0 0 32px 0; padding: 20px; background-color: #f1f5f9; border-radius: 8px; border-left: 4px solid #3b4dd8;">"${prompt.content}"</p>
              <div style="text-align: center; margin: 32px 0;">
                <a href="${magicLink}" 
                   style="background: linear-gradient(135deg, #3b4dd8 0%, #2d3ba3 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(59, 77, 216, 0.3);">
                  Write your entry →
                </a>
              </div>
              <div style="border-top: 1px solid #e2e8f0; padding-top: 24px; margin-top: 32px;">
                <p style="font-size: 14px; color: #64748b; margin: 0; text-align: center;">
                  This link will expire in 8 hours. Take a moment to reflect and capture your thoughts.
                </p>
                <p style="font-size: 12px; color: #94a3b8; margin: 16px 0 0 0; text-align: center;">
                  Sent with ❤️ from the Postscript team
                </p>
              </div>
            </div>
          </div>
        `,
      });

      console.log('Email sent:', sender);

      this.logger.log(`Sent prompt to ${email} (prompt ID: ${prompt.id})`);
      return prompt;
    } catch (error) {
      this.logger.error(`Failed to send prompt to ${email}:`, error);
      throw error;
    }
  }
}
