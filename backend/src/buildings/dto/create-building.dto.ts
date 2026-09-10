import { IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';

export class CreateBuildingDto {
  @IsString()
  @IsNotEmpty({ message: 'Building name is required' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Building code is required' })
  code: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
