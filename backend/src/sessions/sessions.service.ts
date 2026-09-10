import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { SessionStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { QuerySessionDto } from './dto/query-session.dto';

@Injectable()
export class SessionsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QuerySessionDto) {
    const {
      roomId,
      moduleId,
      lecturerId,
      buildingId,
      startDate,
      endDate,
      status,
      search,
    } = query;

    const where: any = {};

    if (roomId) where.roomId = roomId;
    if (moduleId) where.moduleId = moduleId;
    if (lecturerId) where.lecturerId = lecturerId;
    if (status) where.status = status;

    if (buildingId) {
      where.room = {
        side: {
          floor: {
            buildingId,
          },
        },
      };
    }

    if (startDate || endDate) {
      where.startDateTime = {};
      if (startDate) where.startDateTime.gte = new Date(startDate);
      if (endDate) where.startDateTime.lte = new Date(endDate);
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { module: { name: { contains: search } } },
        { module: { code: { contains: search } } },
        { lecturer: { fullName: { contains: search } } },
        { room: { name: { contains: search } } },
        { room: { code: { contains: search } } },
      ];
    }

    return this.prisma.scheduledSession.findMany({
      where,
      include: {
        room: {
          include: {
            side: {
              include: {
                floor: {
                  include: {
                    building: true,
                  },
                },
              },
            },
          },
        },
        module: true,
        lecturer: true,
      },
      orderBy: { startDateTime: 'asc' },
    });
  }

  async findOne(id: string) {
    const session = await this.prisma.scheduledSession.findUnique({
      where: { id },
      include: {
        room: {
          include: {
            side: {
              include: {
                floor: {
                  include: {
                    building: true,
                  },
                },
              },
            },
          },
        },
        module: true,
        lecturer: true,
      },
    });

    if (!session) {
      throw new NotFoundException(`Session with ID "${id}" not found`);
    }

    return session;
  }

  private async checkConflict(
    roomId: string,
    lecturerId: string,
    startDateTime: Date,
    endDateTime: Date,
    excludeSessionId?: string,
  ) {
    if (endDateTime <= startDateTime) {
      throw new BadRequestException('Session end time must be after start time');
    }

    // 1. Check Room Conflict
    const conflictingRoomSession = await this.prisma.scheduledSession.findFirst({
      where: {
        roomId,
        status: SessionStatus.SCHEDULED, // Ignore CANCELLED sessions
        ...(excludeSessionId ? { NOT: { id: excludeSessionId } } : {}),
        AND: [
          { startDateTime: { lt: endDateTime } },
          { endDateTime: { gt: startDateTime } },
        ],
      },
      include: {
        room: true,
        module: true,
      },
    });

    if (conflictingRoomSession) {
      const formattedStart = conflictingRoomSession.startDateTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      const formattedEnd = conflictingRoomSession.endDateTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });

      throw new ConflictException(
        `Schedule conflict detected: Room "${conflictingRoomSession.room.code}" is already booked by "${conflictingRoomSession.title}" (${conflictingRoomSession.module.code}) from ${formattedStart} to ${formattedEnd}.`,
      );
    }

    // 2. Check Lecturer Conflict
    const conflictingLecturerSession = await this.prisma.scheduledSession.findFirst({
      where: {
        lecturerId,
        status: SessionStatus.SCHEDULED, // Ignore CANCELLED sessions
        ...(excludeSessionId ? { NOT: { id: excludeSessionId } } : {}),
        AND: [
          { startDateTime: { lt: endDateTime } },
          { endDateTime: { gt: startDateTime } },
        ],
      },
      include: {
        lecturer: true,
        room: true,
        module: true,
      },
    });

    if (conflictingLecturerSession) {
      const formattedStart = conflictingLecturerSession.startDateTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      const formattedEnd = conflictingLecturerSession.endDateTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });

      throw new ConflictException(
        `Schedule conflict detected: Lecturer "${conflictingLecturerSession.lecturer.fullName}" is already scheduled for "${conflictingLecturerSession.title}" (${conflictingLecturerSession.module.code}) in Room "${conflictingLecturerSession.room.code}" from ${formattedStart} to ${formattedEnd}.`,
      );
    }
  }

  async create(dto: CreateSessionDto) {
    const start = new Date(dto.startDateTime);
    const end = new Date(dto.endDateTime);

    // Validate entities exist
    const room = await this.prisma.room.findUnique({ where: { id: dto.roomId } });
    if (!room) throw new NotFoundException(`Room with ID "${dto.roomId}" not found`);

    const moduleItem = await this.prisma.academicModule.findUnique({ where: { id: dto.moduleId } });
    if (!moduleItem) throw new NotFoundException(`Module with ID "${dto.moduleId}" not found`);

    const lecturer = await this.prisma.lecturer.findUnique({ where: { id: dto.lecturerId } });
    if (!lecturer) throw new NotFoundException(`Lecturer with ID "${dto.lecturerId}" not found`);

    // Conflict check for both room and lecturer
    await this.checkConflict(dto.roomId, dto.lecturerId, start, end);

    return this.prisma.scheduledSession.create({
      data: {
        ...dto,
        startDateTime: start,
        endDateTime: end,
      },
      include: {
        room: true,
        module: true,
        lecturer: true,
      },
    });
  }

  async update(id: string, dto: UpdateSessionDto) {
    const existing = await this.findOne(id);

    const roomId = dto.roomId || existing.roomId;
    const lecturerId = dto.lecturerId || existing.lecturerId;
    const start = dto.startDateTime ? new Date(dto.startDateTime) : existing.startDateTime;
    const end = dto.endDateTime ? new Date(dto.endDateTime) : existing.endDateTime;

    if (dto.roomId || dto.lecturerId || dto.startDateTime || dto.endDateTime) {
      await this.checkConflict(roomId, lecturerId, start, end, id);
    }

    return this.prisma.scheduledSession.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.startDateTime ? { startDateTime: start } : {}),
        ...(dto.endDateTime ? { endDateTime: end } : {}),
      },
      include: {
        room: true,
        module: true,
        lecturer: true,
      },
    });
  }

  async cancelSession(id: string) {
    await this.findOne(id);
    return this.prisma.scheduledSession.update({
      where: { id },
      data: { status: SessionStatus.CANCELLED },
      include: {
        room: true,
        module: true,
        lecturer: true,
      },
    });
  }
}
