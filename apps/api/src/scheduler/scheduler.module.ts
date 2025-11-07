import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [EmailModule],
  providers: [SchedulerService],
})
export class SchedulerModule {}
