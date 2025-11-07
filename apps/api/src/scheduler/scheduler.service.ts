import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EmailService } from '../email/email.service';
import { prisma } from '@repo/prisma';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(private readonly emailService: EmailService) {}

  /**
   * Send daily prompts to all users with 'daily' frequency
   * Runs every day at 9:00 AM
   */
  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async sendDailyPrompts() {
    this.logger.log('Starting daily prompt job...');

    try {
      // Get all users with daily frequency
      const users = await prisma.user.findMany({
        where: { frequency: 'daily' },
      });

      this.logger.log(`Found ${users.length} users to send prompts to`);

      // Send prompts to each user
      for (const user of users) {
        try {
          // Get a prompt (for now using a simple placeholder)
          // TODO: Implement prompt generation strategy
          const promptContent = this.getPromptForToday();
          
          await this.emailService.sendPrompt(user.email, promptContent);
          this.logger.log(`Sent prompt to ${user.email}`);
        } catch (error) {
          this.logger.error(`Failed to send prompt to ${user.email}:`, error);
        }
      }

      this.logger.log('Daily prompt job completed');
    } catch (error) {
      this.logger.error('Daily prompt job failed:', error);
    }
  }

  /**
   * Placeholder for prompt generation
   * TODO: Replace with actual prompt generation strategy
   */
  private getPromptForToday(): string {
    const prompts = [
      'What made you smile today?',
      'What are you grateful for right now?',
      'What challenged you today and how did you respond?',
      'What did you learn today?',
      'What brought you peace today?',
      'What are you looking forward to tomorrow?',
      'What was the most meaningful part of your day?',
    ];
    
    // Simple rotation based on day of year
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    return prompts[dayOfYear % prompts.length];
  }
}
