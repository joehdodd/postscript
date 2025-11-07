import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getStatus() {
    return {
      service: 'postscript-scheduler',
      status: 'running',
      description: 'Background email scheduler for daily prompts',
      timestamp: new Date().toISOString(),
    };
  }
}
