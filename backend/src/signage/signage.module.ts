import { Module } from '@nestjs/common';
import { SignageService } from './signage.service';
import { SignageController } from './signage.controller';

@Module({
  providers: [SignageService],
  controllers: [SignageController],
  exports: [SignageService],
})
export class SignageModule {}
