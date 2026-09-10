import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { SessionType, SessionStatus } from '@prisma/client';

export class CreateSessionDto {
  @IsString()
  @IsNotEmpty({ message: 'Room ID is required' })
  roomId: string;

  @IsString()
  @IsNotEmpty({ message: 'Module ID is required' })
  moduleId: string;

  @IsString()
  @IsNotEmpty({ message: 'Lecturer ID is required' })
  lecturerId: string;

  @IsString()
  @IsNotEmpty({ message: 'Session title is required' })
  title: string;

  @IsEnum(SessionType)
  @IsOptional()
  sessionType?: SessionType;

  @IsDateString({}, { message: 'startDateTime must be a valid ISO date string' })
  @IsNotEmpty({ message: 'startDateTime is required' })
  startDateTime: string;

  @IsDateString({}, { message: 'endDateTime must be a valid ISO date string' })
  @IsNotEmpty({ message: 'endDateTime is required' })
  endDateTime: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsEnum(SessionStatus)
  @IsOptional()
  status?: SessionStatus;
}
