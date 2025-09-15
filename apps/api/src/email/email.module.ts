import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { PromptsService } from 'src/prompts/prompts.service';
import { MagicLinkService } from 'src/auth/magic-link.service';

@Module({
  controllers: [EmailController],
  providers: [EmailService, PromptsService, MagicLinkService],
  exports: [EmailService],
})
export class EmailModule {}
