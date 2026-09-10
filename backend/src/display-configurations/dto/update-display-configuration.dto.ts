import { PartialType } from '@nestjs/swagger';
import { CreateDisplayConfigurationDto } from './create-display-configuration.dto';

export class UpdateDisplayConfigurationDto extends PartialType(CreateDisplayConfigurationDto) {}
