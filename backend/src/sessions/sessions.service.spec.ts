import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, BadRequestException } from '@nestjs/common';
import { SessionStatus, SessionType } from '@prisma/client';
import { SessionsService } from './sessions.service';
import { PrismaService } from '../prisma/prisma.service';

describe('SessionsService', () => {
  let service: SessionsService;
  let prismaService: PrismaService;

  const mockRoom = { id: 'room-1', name: 'LH 101', code: 'LH-101' };
  const mockModule = { id: 'mod-1', name: 'SE Fundamentals', code: 'SE1010' };
  const mockLecturer = { id: 'lec-1', fullName: 'Dr. Aruni Perera' };

  beforeEach(async () => {
    const mockPrisma = {
      scheduledSession: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      room: { findUnique: jest.fn().mockResolvedValue(mockRoom) },
      academicModule: { findUnique: jest.fn().mockResolvedValue(mockModule) },
      lecturer: { findUnique: jest.fn().mockResolvedValue(mockLecturer) },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<SessionsService>(SessionsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create session successfully when no conflict exists', async () => {
      const dto = {
        roomId: 'room-1',
        moduleId: 'mod-1',
        lecturerId: 'lec-1',
        title: 'Clean Code Lecture',
        startDateTime: '2026-09-10T10:00:00.000Z',
        endDateTime: '2026-09-10T12:00:00.000Z',
      };

      jest.spyOn(prismaService.scheduledSession, 'findFirst').mockResolvedValue(null);
      jest.spyOn(prismaService.scheduledSession, 'create').mockResolvedValue({
        id: 'session-1',
        ...dto,
        sessionType: SessionType.LECTURE,
        notes: null,
        status: SessionStatus.SCHEDULED,
        startDateTime: new Date(dto.startDateTime),
        endDateTime: new Date(dto.endDateTime),
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      const result = await service.create(dto);
      expect(result).toHaveProperty('id', 'session-1');
      expect(prismaService.scheduledSession.create).toHaveBeenCalled();
    });

    it('should throw ConflictException when session overlaps with an existing SCHEDULED session for the room', async () => {
      const dto = {
        roomId: 'room-1',
        moduleId: 'mod-1',
        lecturerId: 'lec-1',
        title: 'Overlapping Lecture',
        startDateTime: '2026-09-10T10:30:00.000Z',
        endDateTime: '2026-09-10T11:30:00.000Z',
      };

      const existingConflictingSession = {
        id: 'session-existing',
        title: 'Existing Lecture',
        startDateTime: new Date('2026-09-10T10:00:00.000Z'),
        endDateTime: new Date('2026-09-10T11:00:00.000Z'),
        room: mockRoom,
        module: mockModule,
      };

      jest
        .spyOn(prismaService.scheduledSession, 'findFirst')
        .mockResolvedValueOnce(existingConflictingSession as any);

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException when lecturer has an overlapping session in another room', async () => {
      const dto = {
        roomId: 'room-2',
        moduleId: 'mod-1',
        lecturerId: 'lec-1',
        title: 'Another Lecture',
        startDateTime: '2026-09-10T10:30:00.000Z',
        endDateTime: '2026-09-10T11:30:00.000Z',
      };

      const conflictingLecturerSession = {
        id: 'session-lecturer',
        title: 'Existing Lecture',
        startDateTime: new Date('2026-09-10T10:00:00.000Z'),
        endDateTime: new Date('2026-09-10T11:00:00.000Z'),
        room: mockRoom,
        module: mockModule,
        lecturer: mockLecturer,
      };

      // Room check returns null (room is free)
      // Lecturer check returns conflicting session
      jest
        .spyOn(prismaService.scheduledSession, 'findFirst')
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(conflictingLecturerSession as any);

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });

    it('should throw BadRequestException if endDateTime is equal or before startDateTime', async () => {
      const dto = {
        roomId: 'room-1',
        moduleId: 'mod-1',
        lecturerId: 'lec-1',
        title: 'Invalid Time Session',
        startDateTime: '2026-09-10T12:00:00.000Z',
        endDateTime: '2026-09-10T10:00:00.000Z',
      };

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('cancelSession', () => {
    it('should update session status to CANCELLED', async () => {
      const existingSession = {
        id: 'session-1',
        title: 'Session to Cancel',
        status: SessionStatus.SCHEDULED,
      };

      jest
        .spyOn(prismaService.scheduledSession, 'findUnique')
        .mockResolvedValue(existingSession as any);

      jest.spyOn(prismaService.scheduledSession, 'update').mockResolvedValue({
        ...existingSession,
        status: SessionStatus.CANCELLED,
      } as any);

      const result = await service.cancelSession('session-1');
      expect(result.status).toBe(SessionStatus.CANCELLED);
      expect(prismaService.scheduledSession.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'session-1' },
          data: { status: SessionStatus.CANCELLED },
        }),
      );
    });
  });
});
