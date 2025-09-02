import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PromptsModule } from './prompts/prompts.module';

import { AppService } from './app.service';
import { AppController } from './app.controller';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: ['.env', '.env.local'],
  }), PromptsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
