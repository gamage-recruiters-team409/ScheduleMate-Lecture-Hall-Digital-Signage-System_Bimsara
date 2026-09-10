import { Injectable, NotFoundException } from '@nestjs/common';
import { SessionStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SignageService {
  constructor(private prisma: PrismaService) {}

  async getDisplayData(displayKey: string) {
    let config = await this.prisma.displayConfiguration.findUnique({
      where: { displayKey },
      include: {
        room: true,
        building: true,
        floor: true,
        side: true,
      },
    });

    if (!config) {
      config = await this.prisma.displayConfiguration.findFirst({
        where: {
          OR: [
            { displayKey },
            { displayKey: displayKey.toUpperCase() },
            { displayKey: displayKey.toLowerCase() },
          ],
        },
        include: {
          room: true,
          building: true,
          floor: true,
          side: true,
        },
      });
    }

    if (!config || !config.isActive) {
      throw new NotFoundException(
        `Digital signage display configuration for key "${displayKey}" not found or inactive`,
      );
    }

    const now = new Date();

    // If configured specifically for a single room
    if (config.roomId) {
      const roomStatus = await this.getRoomStatus(config.roomId, now);
      return {
        display: {
          id: config.id,
          name: config.name,
          displayKey: config.displayKey,
          refreshIntervalSeconds: config.refreshIntervalSeconds,
          scopeType: 'ROOM',
        },
        serverTime: now.toISOString(),
        room: config.room,
        ...roomStatus,
      };
    }

    // Building/Floor/Side scope fallback: fetch summary of all rooms under that scope
    const roomWhere: any = { isActive: true };
    if (config.buildingId) {
      roomWhere.side = { floor: { buildingId: config.buildingId } };
    } else if (config.floorId) {
      roomWhere.side = { floorId: config.floorId };
    } else if (config.sideId) {
      roomWhere.sideId = config.sideId;
    }

    const rooms = await this.prisma.room.findMany({
      where: roomWhere,
      include: {
        side: {
          include: {
            floor: {
              include: { building: true },
            },
          },
        },
      },
    });

    const roomStatuses = await Promise.all(
      rooms.map(async (room) => {
        const status = await this.getRoomStatus(room.id, now);
        return {
          room,
          ...status,
        };
      }),
    );

    return {
      display: {
        id: config.id,
        name: config.name,
        displayKey: config.displayKey,
        refreshIntervalSeconds: config.refreshIntervalSeconds,
        scopeType: 'BUILDING_OR_AREA',
      },
      serverTime: now.toISOString(),
      rooms: roomStatuses,
    };
  }

  async getRoomStatusByCode(roomCode: string) {
    const room = await this.prisma.room.findUnique({
      where: { code: roomCode },
    });

    if (!room) {
      throw new NotFoundException(`Room with code "${roomCode}" not found`);
    }

    const now = new Date();
    const status = await this.getRoomStatus(room.id, now);

    return {
      serverTime: now.toISOString(),
      room,
      ...status,
    };
  }

  private async getRoomStatus(roomId: string, now: Date) {
    const publicSessionSelect = {
      id: true,
      title: true,
      sessionType: true,
      startDateTime: true,
      endDateTime: true,
      notes: true,
      status: true,
      module: {
        select: {
          id: true,
          code: true,
          name: true,
          department: true,
        },
      },
      lecturer: {
        select: {
          fullName: true,
          department: true,
        },
      },
    };

    // 1. Current Session: status SCHEDULED, start <= now, end > now
    const currentSession = await this.prisma.scheduledSession.findFirst({
      where: {
        roomId,
        status: SessionStatus.SCHEDULED, // exclude CANCELLED per Requirement 4
        startDateTime: { lte: now },
        endDateTime: { gt: now },
      },
      select: publicSessionSelect,
    });

    // 2. Next Session: status SCHEDULED, start > now
    const nextSession = await this.prisma.scheduledSession.findFirst({
      where: {
        roomId,
        status: SessionStatus.SCHEDULED, // exclude CANCELLED per Requirement 4
        startDateTime: { gt: now },
      },
      select: publicSessionSelect,
      orderBy: { startDateTime: 'asc' },
    });

    // 3. Recently Completed Sessions (ended in the last 2 hours)
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
    const recentlyCompletedSessions = await this.prisma.scheduledSession.findMany({
      where: {
        roomId,
        status: SessionStatus.SCHEDULED,
        endDateTime: { gte: twoHoursAgo, lte: now },
      },
      select: publicSessionSelect,
      orderBy: { endDateTime: 'desc' },
      take: 3,
    });

    // Calculate occupancy status
    let occupancyStatus: 'OCCUPIED' | 'AVAILABLE' | 'UPCOMING_SOON' = 'AVAILABLE';
    if (currentSession) {
      occupancyStatus = 'OCCUPIED';
    } else if (nextSession) {
      const minutesUntilNext = Math.floor(
        (nextSession.startDateTime.getTime() - now.getTime()) / (1000 * 60),
      );
      if (minutesUntilNext <= 15) {
        occupancyStatus = 'UPCOMING_SOON';
      }
    }

    return {
      occupancyStatus,
      currentSession: currentSession || null,
      nextSession: nextSession || null,
      recentlyCompletedSessions,
    };
  }
}
