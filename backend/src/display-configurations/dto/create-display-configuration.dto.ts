import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  IsBoolean,
  Min,
} from 'class-validator';

export class CreateDisplayConfigurationDto {
  @IsString()
  @IsNotEmpty({ message: 'Display name is required' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Display key is required' })
  displayKey: string;

  @IsString()
  @IsOptional()
  roomId?: string;

  @IsString()
  @IsOptional()
  buildingId?: string;

  @IsString()
  @IsOptional()
  floorId?: string;

  @IsString()
  @IsOptional()
  sideId?: string;

  @IsInt()
  @Min(5, { message: 'Refresh interval must be at least 5 seconds' })
  @IsOptional()
  refreshIntervalSeconds?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
