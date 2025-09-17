import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { PromptsModule } from './prompts/prompts.module';
import { EmailModule } from './email/email.module';
import { EntriesModule } from './entries/entries.module';

import { AppService } from './app.service';
import { AppController } from './app.controller';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: ['.env', '.env.local'],
  }), AuthModule, PromptsModule, EmailModule, EntriesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
