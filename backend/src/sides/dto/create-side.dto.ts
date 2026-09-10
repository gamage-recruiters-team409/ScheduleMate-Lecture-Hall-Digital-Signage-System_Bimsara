import { IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';

export class CreateSideDto {
  @IsString()
  @IsNotEmpty({ message: 'Floor ID is required' })
  floorId: string;

  @IsString()
  @IsNotEmpty({ message: 'Side name is required' })
  name: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
