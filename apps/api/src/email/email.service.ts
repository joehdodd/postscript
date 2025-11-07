import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { prisma } from '@repo/prisma';
import * as jwt from 'jsonwebtoken';

const MAGIC_LINK_SECRET = process.env.MAGIC_LINK_SECRET || 'supersecret';
const MAGIC_LINK_EXPIRY = '8h';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private resend = new Resend(process.env.RESEND_API_KEY);

  /**
   * Send a prompt email with magic link
   * Now self-contained with direct Prisma access
   */
  async sendPrompt(email: string, promptContent: string) {
    try {
      // Get user
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new Error(`User not found: ${email}`);
      }

      // Create prompt in database
      const prompt = await prisma.prompt.create({
        data: {
          content: promptContent,
          frequency: user.frequency,
          userId: user.id,
          sentAt: new Date(),
          isOpen: true,
        },
      });

      // Generate magic link token
      const token = jwt.sign(
        { 
          userId: user.id, 
          promptId: prompt.id,
          purpose: 'entry',
          email: user.email,
        },
        MAGIC_LINK_SECRET,
        { expiresIn: MAGIC_LINK_EXPIRY }
      );

      const magicLink = `${process.env.WEB_APP_URL}/entry?token=${token}`;

      // Send email
      console.log(process.env.RESEND_API_KEY);
      const sender = await this.resend.emails.send({
        from: 'P.s. <noreply@prompts.postscript.ink>',
        to: [email],
        subject: 'Your Prompt for Today',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #334155;">Your prompt for today</h2>
            <p style="font-size: 18px; color: #475569; line-height: 1.6;">${prompt.content}</p>
            <p style="margin-top: 32px;">
              <a href="${magicLink}" 
                 style="background-color: #1e293b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Write your entry
              </a>
            </p>
            <p style="font-size: 14px; color: #94a3b8; margin-top: 32px;">
              This link will expire in 8 hours.
            </p>
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
