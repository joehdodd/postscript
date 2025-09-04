import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PromptsModule } from './prompts/prompts.module';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { EmailModule } from './email/email.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: ['.env', '.env.local'],
  }), PromptsModule, EmailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
