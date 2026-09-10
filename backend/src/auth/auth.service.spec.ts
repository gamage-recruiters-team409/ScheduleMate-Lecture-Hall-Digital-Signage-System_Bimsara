import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  const mockUser = {
    id: 'user-123',
    fullName: 'Admin User',
    email: 'admin@sparkline.ac',
    passwordHash: '$2b$10$e7W...hash',
    role: 'ADMIN' as const,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockPrisma = {
      user: {
        findUnique: jest.fn(),
      },
    };

    const mockJwt = {
      sign: jest.fn().mockReturnValue('mock-jwt-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwt },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should validate and return user without passwordHash if credentials are valid', async () => {
      const plainPassword = 'StrongPassword123!';
      const hash = await bcrypt.hash(plainPassword, 10);
      const userWithRealHash = { ...mockUser, passwordHash: hash };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(userWithRealHash);

      const result = await service.validateUser('admin@sparkline.ac', plainPassword);

      expect(result).toBeDefined();
      expect(result.email).toBe('admin@sparkline.ac');
      expect((result as any).passwordHash).toBeUndefined();
    });

    it('should throw UnauthorizedException if user does not exist', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      await expect(service.validateUser('nonexistent@sparkline.ac', 'password')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if user is inactive', async () => {
      const inactiveUser = { ...mockUser, isActive: false };
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(inactiveUser);

      await expect(service.validateUser('admin@sparkline.ac', 'password')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      const hash = await bcrypt.hash('CorrectPassword123!', 10);
      const userWithHash = { ...mockUser, passwordHash: hash };
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(userWithHash);

      await expect(service.validateUser('admin@sparkline.ac', 'WrongPassword')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('login', () => {
    it('should return user and accessToken on successful login', async () => {
      const plainPassword = 'StrongPassword123!';
      const hash = await bcrypt.hash(plainPassword, 10);
      const userWithHash = { ...mockUser, passwordHash: hash };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(userWithHash);

      const result = await service.login({
        email: 'admin@sparkline.ac',
        password: plainPassword,
      });

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('accessToken', 'mock-jwt-token');
      expect((result.user as any).passwordHash).toBeUndefined();
    });
  });
});
