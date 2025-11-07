import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

/**
 * Simple health check endpoint for the scheduler service
 */
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getStatus() {
    return this.appService.getStatus();
  }
}
