import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { RoomType } from '@prisma/client';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty({ message: 'Side ID is required' })
  sideId: string;

  @IsString()
  @IsNotEmpty({ message: 'Room name is required' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Room code is required' })
  code: string;

  @IsInt()
  @IsOptional()
  capacity?: number;

  @IsEnum(RoomType)
  @IsOptional()
  roomType?: RoomType;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
