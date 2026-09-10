export type UserRole = 'ADMIN';

export type RoomType = 'LECTURE_HALL' | 'LABORATORY' | 'CLASSROOM' | 'AUDITORIUM' | 'OTHER';

export type SessionType =
  | 'LECTURE'
  | 'TUTORIAL'
  | 'PRACTICAL'
  | 'LABORATORY'
  | 'EXAM'
  | 'MEETING'
  | 'EVENT'
  | 'OTHER';

export type SessionStatus = 'SCHEDULED' | 'CANCELLED';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Building {
  id: string;
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  floors?: Floor[];
  _count?: { floors: number };
}

export interface Floor {
  id: string;
  buildingId: string;
  name: string;
  floorNumber: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  building?: Building;
  sides?: Side[];
  _count?: { sides: number };
}

export interface Side {
  id: string;
  floorId: string;
  name: string;
  code?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  floor?: Floor;
  rooms?: Room[];
  _count?: { rooms: number };
}

export interface Room {
  id: string;
  sideId: string;
  name: string;
  code: string;
  capacity?: number;
  roomType: RoomType;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  side?: Side;
  _count?: { sessions: number };
}

export interface Lecturer {
  id: string;
  fullName: string;
  employeeCode?: string;
  email?: string;
  phone?: string;
  department?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: { sessions: number };
}

export interface AcademicModule {
  id: string;
  code: string;
  name: string;
  description?: string;
  department?: string;
  level?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: { sessions: number };
}

export interface ScheduledSession {
  id: string;
  roomId: string;
  moduleId: string;
  lecturerId: string;
  title: string;
  sessionType: SessionType;
  startDateTime: string;
  endDateTime: string;
  notes?: string;
  status: SessionStatus;
  createdAt: string;
  updatedAt: string;
  room?: Room;
  module?: AcademicModule;
  lecturer?: Lecturer;
}

export interface DisplayConfiguration {
  id: string;
  name: string;
  displayKey: string;
  roomId?: string;
  buildingId?: string;
  floorId?: string;
  sideId?: string;
  isActive: boolean;
  refreshIntervalSeconds: number;
  createdAt: string;
  updatedAt: string;
  room?: Room;
  building?: Building;
  floor?: Floor;
  side?: Side;
}

export interface SignageDisplayData {
  display: {
    id: string;
    name: string;
    displayKey: string;
    refreshIntervalSeconds: number;
    scopeType: 'ROOM' | 'BUILDING_OR_AREA';
  };
  serverTime: string;
  room?: Room;
  occupancyStatus?: 'OCCUPIED' | 'AVAILABLE' | 'UPCOMING_SOON';
  currentSession?: ScheduledSession | null;
  nextSession?: ScheduledSession | null;
  recentlyCompletedSessions?: ScheduledSession[];
  rooms?: Array<{
    room: Room;
    occupancyStatus: 'OCCUPIED' | 'AVAILABLE' | 'UPCOMING_SOON';
    currentSession?: ScheduledSession | null;
    nextSession?: ScheduledSession | null;
    recentlyCompletedSessions?: ScheduledSession[];
  }>;
}
