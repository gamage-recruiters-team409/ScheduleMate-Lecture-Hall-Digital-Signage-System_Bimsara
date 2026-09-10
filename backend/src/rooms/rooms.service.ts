import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}

  async findAll(sideId?: string) {
    return this.prisma.room.findMany({
      where: sideId ? { sideId } : {},
      include: {
        side: {
          select: {
            id: true,
            name: true,
            floor: {
              select: {
                id: true,
                name: true,
                floorNumber: true,
                building: { select: { id: true, name: true, code: true } },
              },
            },
          },
        },
        _count: { select: { sessions: true } },
      },
      orderBy: { code: 'asc' },
    });
  }

  async findOne(id: string) {
    const room = await this.prisma.room.findUnique({
      where: { id },
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
    });

    if (!room) {
      throw new NotFoundException(`Room with ID "${id}" not found`);
    }

    return room;
  }

  async findByCode(code: string) {
    const room = await this.prisma.room.findUnique({
      where: { code },
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
    });

    if (!room) {
      throw new NotFoundException(`Room with code "${code}" not found`);
    }

    return room;
  }

  async create(dto: CreateRoomDto) {
    const side = await this.prisma.side.findUnique({
      where: { id: dto.sideId },
    });
    if (!side) {
      throw new NotFoundException(`Side with ID "${dto.sideId}" not found`);
    }

    const existingCode = await this.prisma.room.findUnique({
      where: { code: dto.code },
    });
    if (existingCode) {
      throw new ConflictException(`Room code "${dto.code}" already exists`);
    }

    return this.prisma.room.create({
      data: dto,
      include: {
        side: {
          select: {
            id: true,
            name: true,
            floor: {
              select: {
                id: true,
                name: true,
                building: { select: { id: true, name: true, code: true } },
              },
            },
          },
        },
      },
    });
  }

  async update(id: string, dto: UpdateRoomDto) {
    await this.findOne(id);

    if (dto.code) {
      const existingCode = await this.prisma.room.findFirst({
        where: { code: dto.code, NOT: { id } },
      });
      if (existingCode) {
        throw new ConflictException(`Room code "${dto.code}" already exists`);
      }
    }

    return this.prisma.room.update({
      where: { id },
      data: dto,
      include: {
        side: {
          select: {
            id: true,
            name: true,
            floor: {
              select: {
                id: true,
                name: true,
                building: { select: { id: true, name: true, code: true } },
              },
            },
          },
        },
      },
    });
  }

  async toggleStatus(id: string) {
    const room = await this.findOne(id);
    return this.prisma.room.update({
      where: { id },
      data: { isActive: !room.isActive },
    });
  }

  async getDailySchedule(roomId: string, dateStr: string) {
    await this.findOne(roomId);

    // Parse date (YYYY-MM-DD)
    const targetDate = dateStr ? new Date(dateStr) : new Date();
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    return this.prisma.scheduledSession.findMany({
      where: {
        roomId,
        status: 'SCHEDULED', // requirement 4: exclude cancelled sessions
        startDateTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        module: { select: { id: true, code: true, name: true } },
        lecturer: { select: { id: true, fullName: true, email: true } },
      },
      orderBy: { startDateTime: 'asc' },
    });
  }
}
