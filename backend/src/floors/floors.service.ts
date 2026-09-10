import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFloorDto } from './dto/create-floor.dto';
import { UpdateFloorDto } from './dto/update-floor.dto';

@Injectable()
export class FloorsService {
  constructor(private prisma: PrismaService) {}

  async findAll(buildingId?: string) {
    return this.prisma.floor.findMany({
      where: buildingId ? { buildingId } : {},
      include: {
        building: { select: { id: true, name: true, code: true } },
        _count: { select: { sides: true } },
      },
      orderBy: [{ buildingId: 'asc' }, { floorNumber: 'asc' }],
    });
  }

  async findOne(id: string) {
    const floor = await this.prisma.floor.findUnique({
      where: { id },
      include: {
        building: true,
        sides: {
          include: { rooms: true },
        },
      },
    });

    if (!floor) {
      throw new NotFoundException(`Floor with ID "${id}" not found`);
    }

    return floor;
  }

  async create(dto: CreateFloorDto) {
    // Check building exists
    const building = await this.prisma.building.findUnique({
      where: { id: dto.buildingId },
    });
    if (!building) {
      throw new NotFoundException(`Building with ID "${dto.buildingId}" not found`);
    }

    const existingFloor = await this.prisma.floor.findUnique({
      where: {
        buildingId_floorNumber: {
          buildingId: dto.buildingId,
          floorNumber: dto.floorNumber,
        },
      },
    });

    if (existingFloor) {
      throw new ConflictException(
        `Floor number ${dto.floorNumber} already exists in building "${building.name}"`,
      );
    }

    return this.prisma.floor.create({
      data: dto,
      include: { building: { select: { id: true, name: true, code: true } } },
    });
  }

  async update(id: string, dto: UpdateFloorDto) {
    const existing = await this.findOne(id);
    const buildingId = dto.buildingId || existing.buildingId;
    const floorNumber = dto.floorNumber !== undefined ? dto.floorNumber : existing.floorNumber;

    if (dto.buildingId || dto.floorNumber !== undefined) {
      const duplicate = await this.prisma.floor.findFirst({
        where: {
          buildingId,
          floorNumber,
          NOT: { id },
        },
      });
      if (duplicate) {
        throw new ConflictException(
          `Floor number ${floorNumber} already exists in building`,
        );
      }
    }

    return this.prisma.floor.update({
      where: { id },
      data: dto,
      include: { building: { select: { id: true, name: true, code: true } } },
    });
  }

  async toggleStatus(id: string) {
    const floor = await this.findOne(id);
    return this.prisma.floor.update({
      where: { id },
      data: { isActive: !floor.isActive },
    });
  }
}
