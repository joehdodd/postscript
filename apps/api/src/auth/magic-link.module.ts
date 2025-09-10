
import { Module } from '@nestjs/common';
import { MagicLinkService } from './magic-link.service';
import { MagicLinkController } from './magic-link.controller';

@Module({
  providers: [MagicLinkService],
  controllers: [MagicLinkController],
  exports: [MagicLinkService],
})
export class MagicLinkModule {}
