import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSideDto } from './dto/create-side.dto';
import { UpdateSideDto } from './dto/update-side.dto';

@Injectable()
export class SidesService {
  constructor(private prisma: PrismaService) {}

  async findAll(floorId?: string) {
    return this.prisma.side.findMany({
      where: floorId ? { floorId } : {},
      include: {
        floor: {
          select: {
            id: true,
            name: true,
            floorNumber: true,
            building: { select: { id: true, name: true, code: true } },
          },
        },
        _count: { select: { rooms: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const side = await this.prisma.side.findUnique({
      where: { id },
      include: {
        floor: {
          include: { building: true },
        },
        rooms: true,
      },
    });

    if (!side) {
      throw new NotFoundException(`Side with ID "${id}" not found`);
    }

    return side;
  }

  async create(dto: CreateSideDto) {
    const floor = await this.prisma.floor.findUnique({
      where: { id: dto.floorId },
    });
    if (!floor) {
      throw new NotFoundException(`Floor with ID "${dto.floorId}" not found`);
    }

    const existingSide = await this.prisma.side.findUnique({
      where: {
        floorId_name: {
          floorId: dto.floorId,
          name: dto.name,
        },
      },
    });

    if (existingSide) {
      throw new ConflictException(
        `Side name "${dto.name}" already exists on floor "${floor.name}"`,
      );
    }

    return this.prisma.side.create({
      data: dto,
      include: {
        floor: {
          select: {
            id: true,
            name: true,
            floorNumber: true,
            building: { select: { id: true, name: true, code: true } },
          },
        },
      },
    });
  }

  async update(id: string, dto: UpdateSideDto) {
    const existing = await this.findOne(id);
    const floorId = dto.floorId || existing.floorId;
    const name = dto.name || existing.name;

    if (dto.floorId || dto.name) {
      const duplicate = await this.prisma.side.findFirst({
        where: {
          floorId,
          name,
          NOT: { id },
        },
      });
      if (duplicate) {
        throw new ConflictException(
          `Side name "${name}" already exists on this floor`,
        );
      }
    }

    return this.prisma.side.update({
      where: { id },
      data: dto,
      include: {
        floor: {
          select: {
            id: true,
            name: true,
            floorNumber: true,
            building: { select: { id: true, name: true, code: true } },
          },
        },
      },
    });
  }

  async toggleStatus(id: string) {
    const side = await this.findOne(id);
    return this.prisma.side.update({
      where: { id },
      data: { isActive: !side.isActive },
    });
  }
}
