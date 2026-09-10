import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBuildingDto } from './dto/create-building.dto';
import { UpdateBuildingDto } from './dto/update-building.dto';

@Injectable()
export class BuildingsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.building.findMany({
      include: {
        _count: {
          select: { floors: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const building = await this.prisma.building.findUnique({
      where: { id },
      include: {
        floors: {
          include: {
            sides: {
              include: {
                rooms: true,
              },
            },
          },
          orderBy: { floorNumber: 'asc' },
        },
      },
    });

    if (!building) {
      throw new NotFoundException(`Building with ID "${id}" not found`);
    }

    return building;
  }

  async create(dto: CreateBuildingDto) {
    const existingName = await this.prisma.building.findUnique({
      where: { name: dto.name },
    });
    if (existingName) {
      throw new ConflictException(`Building name "${dto.name}" already exists`);
    }

    const existingCode = await this.prisma.building.findUnique({
      where: { code: dto.code },
    });
    if (existingCode) {
      throw new ConflictException(`Building code "${dto.code}" already exists`);
    }

    return this.prisma.building.create({
      data: dto,
    });
  }

  async update(id: string, dto: UpdateBuildingDto) {
    await this.findOne(id);

    if (dto.name) {
      const existingName = await this.prisma.building.findFirst({
        where: { name: dto.name, NOT: { id } },
      });
      if (existingName) {
        throw new ConflictException(`Building name "${dto.name}" already exists`);
      }
    }

    if (dto.code) {
      const existingCode = await this.prisma.building.findFirst({
        where: { code: dto.code, NOT: { id } },
      });
      if (existingCode) {
        throw new ConflictException(`Building code "${dto.code}" already exists`);
      }
    }

    return this.prisma.building.update({
      where: { id },
      data: dto,
    });
  }

  async toggleStatus(id: string) {
    const building = await this.findOne(id);
    return this.prisma.building.update({
      where: { id },
      data: { isActive: !building.isActive },
    });
  }
}
