import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { PromptsService } from 'src/prompts/prompts.service';
import { AuthService } from 'src/auth/auth.service';

@Module({
  controllers: [EmailController],
  providers: [EmailService, PromptsService, AuthService],
  exports: [EmailService],
})
export class EmailModule {}
