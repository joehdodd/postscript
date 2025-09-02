import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { LinksModule } from './links/links.module';
import { PromptsModule } from './prompts/prompts.module';

import { AppService } from './app.service';
import { AppController } from './app.controller';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: ['.env', '.env.local'],
  }), LinksModule, PromptsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
