import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDisplayConfigurationDto } from './dto/create-display-configuration.dto';
import { UpdateDisplayConfigurationDto } from './dto/update-display-configuration.dto';

@Injectable()
export class DisplayConfigurationsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.displayConfiguration.findMany({
      include: {
        room: { select: { id: true, name: true, code: true } },
        building: { select: { id: true, name: true, code: true } },
        floor: { select: { id: true, name: true, floorNumber: true } },
        side: { select: { id: true, name: true, code: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const config = await this.prisma.displayConfiguration.findUnique({
      where: { id },
      include: {
        room: true,
        building: true,
        floor: true,
        side: true,
      },
    });

    if (!config) {
      throw new NotFoundException(`Display Configuration with ID "${id}" not found`);
    }

    return config;
  }

  async findByKey(displayKey: string) {
    const config = await this.prisma.displayConfiguration.findUnique({
      where: { displayKey },
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
        building: true,
        floor: true,
        side: true,
      },
    });

    if (!config) {
      throw new NotFoundException(`Display Configuration for key "${displayKey}" not found`);
    }

    return config;
  }

  async create(dto: CreateDisplayConfigurationDto) {
    if (!dto.roomId && !dto.buildingId && !dto.floorId && !dto.sideId) {
      throw new BadRequestException(
        'Display configuration must target at least one scope (room, building, floor, or side)',
      );
    }

    const existingKey = await this.prisma.displayConfiguration.findUnique({
      where: { displayKey: dto.displayKey },
    });
    if (existingKey) {
      throw new ConflictException(`Display key "${dto.displayKey}" already exists`);
    }

    return this.prisma.displayConfiguration.create({
      data: dto,
      include: {
        room: { select: { id: true, name: true, code: true } },
        building: { select: { id: true, name: true, code: true } },
        floor: { select: { id: true, name: true } },
        side: { select: { id: true, name: true } },
      },
    });
  }

  async update(id: string, dto: UpdateDisplayConfigurationDto) {
    await this.findOne(id);

    if (dto.displayKey) {
      const existingKey = await this.prisma.displayConfiguration.findFirst({
        where: { displayKey: dto.displayKey, NOT: { id } },
      });
      if (existingKey) {
        throw new ConflictException(`Display key "${dto.displayKey}" already exists`);
      }
    }

    return this.prisma.displayConfiguration.update({
      where: { id },
      data: dto,
      include: {
        room: { select: { id: true, name: true, code: true } },
        building: { select: { id: true, name: true, code: true } },
        floor: { select: { id: true, name: true } },
        side: { select: { id: true, name: true } },
      },
    });
  }

  async toggleStatus(id: string) {
    const config = await this.findOne(id);
    return this.prisma.displayConfiguration.update({
      where: { id },
      data: { isActive: !config.isActive },
    });
  }
}
