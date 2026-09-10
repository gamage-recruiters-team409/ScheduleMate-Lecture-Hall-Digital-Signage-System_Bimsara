import { IsOptional, IsString, IsDateString, IsEnum } from 'class-validator';
import { SessionStatus } from '@prisma/client';

export class QuerySessionDto {
  @IsString()
  @IsOptional()
  roomId?: string;

  @IsString()
  @IsOptional()
  moduleId?: string;

  @IsString()
  @IsOptional()
  lecturerId?: string;

  @IsString()
  @IsOptional()
  buildingId?: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsEnum(SessionStatus)
  @IsOptional()
  status?: SessionStatus;

  @IsString()
  @IsOptional()
  search?: string;
}
