import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { EmailModule } from './email/email.module';
import { SchedulerModule } from './scheduler/scheduler.module';

import { AppService } from './app.service';
import { AppController } from './app.controller';

/**
 * Simplified NestJS app - scheduler only
 * All user-facing operations now handled by Next.js with direct Prisma access
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
    ScheduleModule.forRoot(),
    EmailModule,
    SchedulerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
