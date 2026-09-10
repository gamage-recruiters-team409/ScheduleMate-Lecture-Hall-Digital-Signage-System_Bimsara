import { Module } from '@nestjs/common';
import { SidesService } from './sides.service';
import { SidesController } from './sides.controller';

@Module({
  providers: [SidesService],
  controllers: [SidesController],
  exports: [SidesService],
})
export class SidesModule {}
