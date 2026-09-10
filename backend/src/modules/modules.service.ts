import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';

@Injectable()
export class ModulesService {
  constructor(private prisma: PrismaService) {}

  async findAll(search?: string) {
    return this.prisma.academicModule.findMany({
      where: search
        ? {
            OR: [
              { code: { contains: search } },
              { name: { contains: search } },
              { department: { contains: search } },
            ],
          }
        : {},
      include: {
        _count: { select: { sessions: true } },
      },
      orderBy: { code: 'asc' },
    });
  }

  async findOne(id: string) {
    const moduleItem = await this.prisma.academicModule.findUnique({
      where: { id },
      include: {
        sessions: {
          take: 10,
          orderBy: { startDateTime: 'desc' },
          include: {
            room: true,
            lecturer: true,
          },
        },
      },
    });

    if (!moduleItem) {
      throw new NotFoundException(`Academic Module with ID "${id}" not found`);
    }

    return moduleItem;
  }

  async create(dto: CreateModuleDto) {
    const existing = await this.prisma.academicModule.findUnique({
      where: { code: dto.code },
    });
    if (existing) {
      throw new ConflictException(`Academic Module with code "${dto.code}" already exists`);
    }

    return this.prisma.academicModule.create({
      data: dto,
    });
  }

  async update(id: string, dto: UpdateModuleDto) {
    await this.findOne(id);

    if (dto.code) {
      const existing = await this.prisma.academicModule.findFirst({
        where: { code: dto.code, NOT: { id } },
      });
      if (existing) {
        throw new ConflictException(`Academic Module with code "${dto.code}" already exists`);
      }
    }

    return this.prisma.academicModule.update({
      where: { id },
      data: dto,
    });
  }

  async toggleStatus(id: string) {
    const moduleItem = await this.findOne(id);
    return this.prisma.academicModule.update({
      where: { id },
      data: { isActive: !moduleItem.isActive },
    });
  }
}
