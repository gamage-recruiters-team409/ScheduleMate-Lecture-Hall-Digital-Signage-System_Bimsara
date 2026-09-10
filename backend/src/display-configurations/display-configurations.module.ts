import { Module } from '@nestjs/common';
import { DisplayConfigurationsService } from './display-configurations.service';
import { DisplayConfigurationsController } from './display-configurations.controller';

@Module({
  providers: [DisplayConfigurationsService],
  controllers: [DisplayConfigurationsController],
  exports: [DisplayConfigurationsService],
})
export class DisplayConfigurationsModule {}
