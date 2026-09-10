import { IsNotEmpty, IsOptional, IsString, IsInt, IsBoolean } from 'class-validator';

export class CreateFloorDto {
  @IsString()
  @IsNotEmpty({ message: 'Building ID is required' })
  buildingId: string;

  @IsString()
  @IsNotEmpty({ message: 'Floor name is required' })
  name: string;

  @IsInt()
  @IsNotEmpty({ message: 'Floor number is required' })
  floorNumber: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
