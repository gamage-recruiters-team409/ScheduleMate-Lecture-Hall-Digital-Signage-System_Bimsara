import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLecturerDto } from './dto/create-lecturer.dto';
import { UpdateLecturerDto } from './dto/update-lecturer.dto';

@Injectable()
export class LecturersService {
  constructor(private prisma: PrismaService) {}

  async findAll(search?: string) {
    return this.prisma.lecturer.findMany({
      where: search
        ? {
            OR: [
              { fullName: { contains: search } },
              { email: { contains: search } },
              { employeeCode: { contains: search } },
              { department: { contains: search } },
            ],
          }
        : {},
      include: {
        _count: { select: { sessions: true } },
      },
      orderBy: { fullName: 'asc' },
    });
  }

  async findOne(id: string) {
    const lecturer = await this.prisma.lecturer.findUnique({
      where: { id },
      include: {
        sessions: {
          take: 10,
          orderBy: { startDateTime: 'desc' },
          include: {
            room: true,
            module: true,
          },
        },
      },
    });

    if (!lecturer) {
      throw new NotFoundException(`Lecturer with ID "${id}" not found`);
    }

    return lecturer;
  }

  async create(dto: CreateLecturerDto) {
    if (dto.email) {
      const existing = await this.prisma.lecturer.findUnique({
        where: { email: dto.email },
      });
      if (existing) {
        throw new ConflictException(`Lecturer with email "${dto.email}" already exists`);
      }
    }

    return this.prisma.lecturer.create({
      data: dto,
    });
  }

  async update(id: string, dto: UpdateLecturerDto) {
    await this.findOne(id);

    if (dto.email) {
      const existing = await this.prisma.lecturer.findFirst({
        where: { email: dto.email, NOT: { id } },
      });
      if (existing) {
        throw new ConflictException(`Lecturer with email "${dto.email}" already exists`);
      }
    }

    return this.prisma.lecturer.update({
      where: { id },
      data: dto,
    });
  }

  async toggleStatus(id: string) {
    const lecturer = await this.findOne(id);
    return this.prisma.lecturer.update({
      where: { id },
      data: { isActive: !lecturer.isActive },
    });
  }
}
