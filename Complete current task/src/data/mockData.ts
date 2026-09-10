export type Building = { id: string; name: string; floors: number; sides: string[] };
export type Room = { id: string; floor: number; side: string; building: string; type: RoomType; capacity: number; active: boolean };
export type RoomType = 'Lecture Room' | 'Laboratory' | 'Large Lecture Hall';
export type SessionStatus = 'ongoing' | 'upcoming' | 'available' | 'cancelled' | 'rescheduled' | 'completed' | 'scheduled';
export type Module = { code: string; name: string; dept: string; credits: number; level: number };
export type Lecturer = { id: string; name: string; title: string; dept: string; email: string; phone: string; active: boolean };
export type Session = {
  id: string; module: string; moduleName: string; lecturer: string; lecturerId: string;
  room: string; building: string; buildingShort: string; floor: number; side: string;
  date: string; start: string; end: string; type: string; status: SessionStatus;
  cancelReason?: string; rescheduleFrom?: string; newRoom?: string; newStart?: string; newEnd?: string; newDate?: string;
};
export type Display = {
  id: string; name: string; code: string; building: string; floor: number; side: string;
  resolution: string; active: boolean; lastSeen: string; ip: string;
};

export const buildings: Building[] = [
  { id: 'main', name: 'Main Building', floors: 10, sides: ['A', 'B'] },
  { id: 'new', name: 'New Building', floors: 14, sides: ['G', 'F'] },
];

export const fullLabFloors: Record<string, number[]> = {
  main: [3, 5, 6],
  new: [3, 10, 12, 13],
};

export const largeHallFloors: Record<string, number[]> = {
  new: [14],
};

export const rooms: Room[] = [
  { id: '5A01', floor: 5, side: 'A', building: 'main', type: 'Lecture Room', capacity: 40, active: true },
  { id: '5A02', floor: 5, side: 'A', building: 'main', type: 'Lecture Room', capacity: 40, active: true },
  { id: '5A03', floor: 5, side: 'A', building: 'main', type: 'Lecture Room', capacity: 40, active: true },
  { id: '5A04', floor: 5, side: 'A', building: 'main', type: 'Laboratory', capacity: 30, active: true },
  { id: '5B01', floor: 5, side: 'B', building: 'main', type: 'Lecture Room', capacity: 40, active: true },
  { id: '5B02', floor: 5, side: 'B', building: 'main', type: 'Lecture Room', capacity: 40, active: true },
  { id: '3A01', floor: 3, side: 'A', building: 'main', type: 'Laboratory', capacity: 30, active: true },
  { id: '3A02', floor: 3, side: 'A', building: 'main', type: 'Laboratory', capacity: 30, active: true },
  { id: '3B01', floor: 3, side: 'B', building: 'main', type: 'Laboratory', capacity: 30, active: true },
  { id: '8A01', floor: 8, side: 'A', building: 'main', type: 'Lecture Room', capacity: 50, active: true },
  { id: '8A02', floor: 8, side: 'A', building: 'main', type: 'Lecture Room', capacity: 50, active: true },
  { id: '12G01', floor: 12, side: 'G', building: 'new', type: 'Laboratory', capacity: 30, active: true },
  { id: '12G02', floor: 12, side: 'G', building: 'new', type: 'Laboratory', capacity: 30, active: true },
  { id: '10F01', floor: 10, side: 'F', building: 'new', type: 'Laboratory', capacity: 30, active: true },
  { id: '7G01', floor: 7, side: 'G', building: 'new', type: 'Lecture Room', capacity: 45, active: true },
  { id: '7G02', floor: 7, side: 'G', building: 'new', type: 'Lecture Room', capacity: 45, active: true },
  { id: '14G01', floor: 14, side: 'G', building: 'new', type: 'Large Lecture Hall', capacity: 220, active: true },
  { id: '14F01', floor: 14, side: 'F', building: 'new', type: 'Large Lecture Hall', capacity: 200, active: true },
];

export const modules: Module[] = [
  { code: 'SE1010', name: 'Introduction to Programming', dept: 'Software Engineering', credits: 3, level: 1 },
  { code: 'IT1130', name: 'Web Application Development', dept: 'Information Technology', credits: 3, level: 1 },
  { code: 'SE2040', name: 'Database Systems', dept: 'Software Engineering', credits: 3, level: 2 },
  { code: 'CS3050', name: 'Artificial Intelligence', dept: 'Computer Science', credits: 3, level: 3 },
  { code: 'IT2020', name: 'Operating Systems', dept: 'Information Technology', credits: 3, level: 2 },
  { code: 'SE3010', name: 'Software Architecture', dept: 'Software Engineering', credits: 3, level: 3 },
  { code: 'CS2010', name: 'Data Structures & Algorithms', dept: 'Computer Science', credits: 3, level: 2 },
  { code: 'IT3040', name: 'Network Security', dept: 'Information Technology', credits: 3, level: 3 },
  { code: 'SE4010', name: 'Final Year Project', dept: 'Software Engineering', credits: 6, level: 4 },
  { code: 'CS1020', name: 'Discrete Mathematics', dept: 'Computer Science', credits: 3, level: 1 },
];

export const lecturers: Lecturer[] = [
  { id: 'L001', name: 'Dr. Amara Patel', title: 'Dr.', dept: 'Software Engineering', email: 'a.patel@sparkline.ac', phone: '+94 11 234 5001', active: true },
  { id: 'L002', name: 'Prof. James Chen', title: 'Prof.', dept: 'Computer Science', email: 'j.chen@sparkline.ac', phone: '+94 11 234 5002', active: true },
  { id: 'L003', name: 'Ms. Sarah Okonkwo', title: 'Ms.', dept: 'Information Technology', email: 's.okonkwo@sparkline.ac', phone: '+94 11 234 5003', active: true },
  { id: 'L004', name: 'Dr. Rajan Mehta', title: 'Dr.', dept: 'Computer Science', email: 'r.mehta@sparkline.ac', phone: '+94 11 234 5004', active: true },
  { id: 'L005', name: 'Dr. Nadia Fernandez', title: 'Dr.', dept: 'Information Technology', email: 'n.fernandez@sparkline.ac', phone: '+94 11 234 5005', active: true },
  { id: 'L006', name: 'Mr. Kevin Lim', title: 'Mr.', dept: 'Software Engineering', email: 'k.lim@sparkline.ac', phone: '+94 11 234 5006', active: true },
  { id: 'L007', name: 'Prof. Elena Vasquez', title: 'Prof.', dept: 'Computer Science', email: 'e.vasquez@sparkline.ac', phone: '+94 11 234 5007', active: false },
];

export const sessions: Session[] = [
  {
    id: 'S001', module: 'SE1010', moduleName: 'Introduction to Programming',
    lecturer: 'Dr. Amara Patel', lecturerId: 'L001',
    room: '5A01', building: 'Main Building', buildingShort: 'Main', floor: 5, side: 'A',
    date: '2026-09-07', start: '08:00', end: '10:00', type: 'Lecture', status: 'ongoing',
  },
  {
    id: 'S002', module: 'CS3050', moduleName: 'Artificial Intelligence',
    lecturer: 'Prof. James Chen', lecturerId: 'L002',
    room: '5A02', building: 'Main Building', buildingShort: 'Main', floor: 5, side: 'A',
    date: '2026-09-07', start: '08:30', end: '10:30', type: 'Lecture', status: 'ongoing',
  },
  {
    id: 'S003', module: 'IT1130', moduleName: 'Web Application Development',
    lecturer: 'Ms. Sarah Okonkwo', lecturerId: 'L003',
    room: '5A04', building: 'Main Building', buildingShort: 'Main', floor: 5, side: 'A',
    date: '2026-09-07', start: '09:00', end: '11:00', type: 'Lab', status: 'ongoing',
  },
  {
    id: 'S004', module: 'SE2040', moduleName: 'Database Systems',
    lecturer: 'Dr. Amara Patel', lecturerId: 'L001',
    room: '5A01', building: 'Main Building', buildingShort: 'Main', floor: 5, side: 'A',
    date: '2026-09-07', start: '10:30', end: '12:30', type: 'Lecture', status: 'upcoming',
  },
  {
    id: 'S005', module: 'CS2010', moduleName: 'Data Structures & Algorithms',
    lecturer: 'Dr. Rajan Mehta', lecturerId: 'L004',
    room: '5A02', building: 'Main Building', buildingShort: 'Main', floor: 5, side: 'A',
    date: '2026-09-07', start: '11:00', end: '13:00', type: 'Lecture', status: 'upcoming',
  },
  {
    id: 'S006', module: 'IT2020', moduleName: 'Operating Systems',
    lecturer: 'Dr. Nadia Fernandez', lecturerId: 'L005',
    room: '8A01', building: 'Main Building', buildingShort: 'Main', floor: 8, side: 'A',
    date: '2026-09-07', start: '08:00', end: '10:00', type: 'Lecture', status: 'cancelled',
    cancelReason: 'Lecturer unwell – medical leave',
  },
  {
    id: 'S007', module: 'SE3010', moduleName: 'Software Architecture',
    lecturer: 'Mr. Kevin Lim', lecturerId: 'L006',
    room: '7G01', building: 'New Building', buildingShort: 'New', floor: 7, side: 'G',
    date: '2026-09-07', start: '09:00', end: '11:00', type: 'Lecture', status: 'rescheduled',
    rescheduleFrom: '2026-09-06', newDate: '2026-09-07', newStart: '13:00', newEnd: '15:00', newRoom: '7G02',
  },
  {
    id: 'S008', module: 'CS3050', moduleName: 'Artificial Intelligence',
    lecturer: 'Prof. James Chen', lecturerId: 'L002',
    room: '14G01', building: 'New Building', buildingShort: 'New', floor: 14, side: 'G',
    date: '2026-09-07', start: '14:00', end: '17:00', type: 'Lecture', status: 'scheduled',
  },
  {
    id: 'S009', module: 'IT3040', moduleName: 'Network Security',
    lecturer: 'Dr. Nadia Fernandez', lecturerId: 'L005',
    room: '12G01', building: 'New Building', buildingShort: 'New', floor: 12, side: 'G',
    date: '2026-09-07', start: '13:00', end: '15:00', type: 'Lab', status: 'scheduled',
  },
  {
    id: 'S010', module: 'SE1010', moduleName: 'Introduction to Programming',
    lecturer: 'Dr. Amara Patel', lecturerId: 'L001',
    room: '3A01', building: 'Main Building', buildingShort: 'Main', floor: 3, side: 'A',
    date: '2026-09-07', start: '13:30', end: '15:30', type: 'Lab', status: 'scheduled',
  },
  {
    id: 'S011', module: 'IT1130', moduleName: 'Web Application Development',
    lecturer: 'Ms. Sarah Okonkwo', lecturerId: 'L003',
    room: '8A02', building: 'Main Building', buildingShort: 'Main', floor: 8, side: 'A',
    date: '2026-09-06', start: '08:00', end: '10:00', type: 'Lecture', status: 'completed',
  },
];

export const displays: Display[] = [
  { id: 'D001', name: 'Main Bldg Floor 5 – A Side', code: 'DSP-MB-05A', building: 'Main Building', floor: 5, side: 'A', resolution: '1920×1080', active: true, lastSeen: '2026-09-07 09:41', ip: '192.168.1.101' },
  { id: 'D002', name: 'Main Bldg Floor 5 – B Side', code: 'DSP-MB-05B', building: 'Main Building', floor: 5, side: 'B', resolution: '1920×1080', active: true, lastSeen: '2026-09-07 09:40', ip: '192.168.1.102' },
  { id: 'D003', name: 'Main Bldg Floor 8 – A Side', code: 'DSP-MB-08A', building: 'Main Building', floor: 8, side: 'A', resolution: '1920×1080', active: true, lastSeen: '2026-09-07 09:39', ip: '192.168.1.103' },
  { id: 'D004', name: 'New Bldg Floor 7 – G Side', code: 'DSP-NB-07G', building: 'New Building', floor: 7, side: 'G', resolution: '1920×1080', active: true, lastSeen: '2026-09-07 09:41', ip: '192.168.2.101' },
  { id: 'D005', name: 'New Bldg Floor 12 – G Side', code: 'DSP-NB-12G', building: 'New Building', floor: 12, side: 'G', resolution: '1920×1080', active: false, lastSeen: '2026-09-06 17:23', ip: '192.168.2.102' },
  { id: 'D006', name: 'New Bldg Floor 14 – G Side', code: 'DSP-NB-14G', building: 'New Building', floor: 14, side: 'G', resolution: '1920×1080', active: true, lastSeen: '2026-09-07 09:38', ip: '192.168.2.103' },
  { id: 'D007', name: 'New Bldg Floor 14 – F Side', code: 'DSP-NB-14F', building: 'New Building', floor: 14, side: 'F', resolution: '1920×1080', active: true, lastSeen: '2026-09-07 09:41', ip: '192.168.2.104' },
];

export const auditLog = [
  { id: 1, action: 'Session Cancelled', detail: 'S006 – IT2020 Operating Systems (8A01)', user: 'admin@sparkline.ac', time: '2026-09-07 07:45' },
  { id: 2, action: 'Session Rescheduled', detail: 'S007 – SE3010 Software Architecture moved to 7G02 13:00', user: 'admin@sparkline.ac', time: '2026-09-07 07:30' },
  { id: 3, action: 'Session Created', detail: 'S008 – CS3050 Artificial Intelligence (14G01)', user: 'admin@sparkline.ac', time: '2026-09-06 16:20' },
  { id: 4, action: 'Display Offline', detail: 'DSP-NB-12G last seen 17:23', user: 'system', time: '2026-09-06 17:24' },
  { id: 5, action: 'Room Updated', detail: '14F01 – capacity updated to 200', user: 'admin@sparkline.ac', time: '2026-09-06 15:10' },
];
