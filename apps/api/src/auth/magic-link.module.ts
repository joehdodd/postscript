import { Module } from '@nestjs/common';
import { MagicLinkService } from './magic-link.service';

@Module({
  providers: [MagicLinkService],
  exports: [MagicLinkService],
})
export class MagicLinkModule {}
