import { PrismaClient, RoomType, SessionType, SessionStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const PLACEHOLDER_PASSWORD = 'CHANGE_THIS_TO_A_STRONG_LOCAL_PASSWORD';

async function main() {
  console.log('🌱 Starting database seed with comprehensive test dataset...');

  const seedEmail = process.env.SEED_ADMIN_EMAIL || 'admin@sparkline.ac';
  const seedPassword = process.env.SEED_ADMIN_PASSWORD || 'StrongAdminPassword123!';

  if (!seedPassword || seedPassword === PLACEHOLDER_PASSWORD) {
    throw new Error(
      `❌ SEED ERROR: SEED_ADMIN_PASSWORD environment variable is using placeholder or missing!\n` +
      `Please set a secure SEED_ADMIN_PASSWORD in backend/.env before running seed.`
    );
  }

  if (seedPassword.length < 8) {
    throw new Error(`❌ SEED ERROR: SEED_ADMIN_PASSWORD must be at least 8 characters long.`);
  }

  // 1. Seed Admin User
  const passwordHash = await bcrypt.hash(seedPassword, 10);
  const admin = await prisma.user.upsert({
    where: { email: seedEmail },
    update: {
      fullName: process.env.SEED_ADMIN_NAME || 'Sparkline Admin',
      passwordHash,
      isActive: true,
    },
    create: {
      email: seedEmail,
      fullName: process.env.SEED_ADMIN_NAME || 'Sparkline Admin',
      passwordHash,
      role: 'ADMIN',
      isActive: true,
    },
  });
  console.log(`✅ Admin user seeded: ${admin.email}`);

  // 2. Seed Campus Hierarchy (Buildings)
  const mainBuilding = await prisma.building.upsert({
    where: { code: 'MAIN' },
    update: {},
    create: {
      name: 'Main Academic Building',
      code: 'MAIN',
      description: 'Primary lecture building for undergraduate software & computing programs',
      isActive: true,
    },
  });

  const techBuilding = await prisma.building.upsert({
    where: { code: 'TECH' },
    update: {},
    create: {
      name: 'New Technology Complex',
      code: 'TECH',
      description: 'Advanced computing research laboratories and grand auditorium halls',
      isActive: true,
    },
  });

  // Floors
  const mainFloor1 = await prisma.floor.upsert({
    where: { buildingId_floorNumber: { buildingId: mainBuilding.id, floorNumber: 1 } },
    update: {},
    create: {
      buildingId: mainBuilding.id,
      name: 'Ground Floor (Level 1)',
      floorNumber: 1,
      isActive: true,
    },
  });

  const mainFloor3 = await prisma.floor.upsert({
    where: { buildingId_floorNumber: { buildingId: mainBuilding.id, floorNumber: 3 } },
    update: {},
    create: {
      buildingId: mainBuilding.id,
      name: 'Third Floor (Full Lab Floor)',
      floorNumber: 3,
      isActive: true,
    },
  });

  const mainFloor5 = await prisma.floor.upsert({
    where: { buildingId_floorNumber: { buildingId: mainBuilding.id, floorNumber: 5 } },
    update: {},
    create: {
      buildingId: mainBuilding.id,
      name: 'Fifth Floor (Level 5)',
      floorNumber: 5,
      isActive: true,
    },
  });

  const techFloor12 = await prisma.floor.upsert({
    where: { buildingId_floorNumber: { buildingId: techBuilding.id, floorNumber: 12 } },
    update: {},
    create: {
      buildingId: techBuilding.id,
      name: 'Twelfth Floor (AI & Robotics Labs)',
      floorNumber: 12,
      isActive: true,
    },
  });

  const techFloor14 = await prisma.floor.upsert({
    where: { buildingId_floorNumber: { buildingId: techBuilding.id, floorNumber: 14 } },
    update: {},
    create: {
      buildingId: techBuilding.id,
      name: 'Fourteenth Floor (Auditoriums)',
      floorNumber: 14,
      isActive: true,
    },
  });

  // Sides
  const eastWing = await prisma.side.upsert({
    where: { floorId_name: { floorId: mainFloor1.id, name: 'East Wing' } },
    update: {},
    create: {
      floorId: mainFloor1.id,
      name: 'East Wing',
      code: 'EW',
      isActive: true,
    },
  });

  const westWing = await prisma.side.upsert({
    where: { floorId_name: { floorId: mainFloor1.id, name: 'West Wing' } },
    update: {},
    create: {
      floorId: mainFloor1.id,
      name: 'West Wing',
      code: 'WW',
      isActive: true,
    },
  });

  const mainSide3B = await prisma.side.upsert({
    where: { floorId_name: { floorId: mainFloor3.id, name: 'B Side (Systems Lab)' } },
    update: {},
    create: {
      floorId: mainFloor3.id,
      name: 'B Side (Systems Lab)',
      code: '3B',
      isActive: true,
    },
  });

  const mainSide5A = await prisma.side.upsert({
    where: { floorId_name: { floorId: mainFloor5.id, name: 'A Side' } },
    update: {},
    create: {
      floorId: mainFloor5.id,
      name: 'A Side',
      code: '5A',
      isActive: true,
    },
  });

  const techSide12G = await prisma.side.upsert({
    where: { floorId_name: { floorId: techFloor12.id, name: 'G Side (AI Hub)' } },
    update: {},
    create: {
      floorId: techFloor12.id,
      name: 'G Side (AI Hub)',
      code: '12G',
      isActive: true,
    },
  });

  const techSide14F = await prisma.side.upsert({
    where: { floorId_name: { floorId: techFloor14.id, name: 'F Side (Grand Hall)' } },
    update: {},
    create: {
      floorId: techFloor14.id,
      name: 'F Side (Grand Hall)',
      code: '14F',
      isActive: true,
    },
  });

  // Rooms
  const room101 = await prisma.room.upsert({
    where: { code: 'LH-101' },
    update: {},
    create: {
      sideId: eastWing.id,
      name: 'Lecture Hall 101',
      code: 'LH-101',
      capacity: 120,
      roomType: RoomType.LECTURE_HALL,
      isActive: true,
    },
  });

  const room102 = await prisma.room.upsert({
    where: { code: 'LH-102' },
    update: {},
    create: {
      sideId: westWing.id,
      name: 'Lecture Hall 102',
      code: 'LH-102',
      capacity: 80,
      roomType: RoomType.LECTURE_HALL,
      isActive: true,
    },
  });

  const room5A01 = await prisma.room.upsert({
    where: { code: '5A01' },
    update: {},
    create: {
      sideId: mainSide5A.id,
      name: 'Classroom 5A01',
      code: '5A01',
      capacity: 60,
      roomType: RoomType.CLASSROOM,
      isActive: true,
    },
  });

  const room5A02 = await prisma.room.upsert({
    where: { code: '5A02' },
    update: {},
    create: {
      sideId: mainSide5A.id,
      name: 'Classroom 5A02',
      code: '5A02',
      capacity: 60,
      roomType: RoomType.CLASSROOM,
      isActive: true,
    },
  });

  const room5A04 = await prisma.room.upsert({
    where: { code: '5A04' },
    update: {},
    create: {
      sideId: mainSide5A.id,
      name: 'Software Engineering Laboratory',
      code: '5A04',
      capacity: 45,
      roomType: RoomType.LABORATORY,
      isActive: true,
    },
  });

  const room3B02 = await prisma.room.upsert({
    where: { code: '3B02' },
    update: {},
    create: {
      sideId: mainSide3B.id,
      name: 'Cloud Infrastructure Lab',
      code: '3B02',
      capacity: 40,
      roomType: RoomType.LABORATORY,
      isActive: true,
    },
  });

  const room12G01 = await prisma.room.upsert({
    where: { code: '12G01' },
    update: {},
    create: {
      sideId: techSide12G.id,
      name: 'AI & Robotics Research Lab',
      code: '12G01',
      capacity: 50,
      roomType: RoomType.LABORATORY,
      isActive: true,
    },
  });

  const room14F01 = await prisma.room.upsert({
    where: { code: '14F01' },
    update: {},
    create: {
      sideId: techSide14F.id,
      name: 'Grand Auditorium',
      code: '14F01',
      capacity: 250,
      roomType: RoomType.AUDITORIUM,
      isActive: true,
    },
  });

  console.log('✅ Campus hierarchy seeded (2 Buildings, 5 Floors, 6 Sides, 8 Rooms)');

  // 3. Seed Lecturers
  const lecturer1 = await prisma.lecturer.upsert({
    where: { email: 'aruni.p@sparkline.ac' },
    update: {},
    create: {
      fullName: 'Dr. Aruni Perera',
      employeeCode: 'LEC-001',
      email: 'aruni.p@sparkline.ac',
      phone: '+94771234567',
      department: 'Software Engineering',
      isActive: true,
    },
  });

  const lecturer2 = await prisma.lecturer.upsert({
    where: { email: 'sithum.s@sparkline.ac' },
    update: {},
    create: {
      fullName: 'Prof. Sithum Silva',
      employeeCode: 'LEC-002',
      email: 'sithum.s@sparkline.ac',
      phone: '+94777654321',
      department: 'Computer Science',
      isActive: true,
    },
  });

  const lecturer3 = await prisma.lecturer.upsert({
    where: { email: 'kasun.g@sparkline.ac' },
    update: {},
    create: {
      fullName: 'Dr. Kasun Gamage',
      employeeCode: 'LEC-003',
      email: 'kasun.g@sparkline.ac',
      phone: '+94778899001',
      department: 'Information Technology',
      isActive: true,
    },
  });

  const lecturer4 = await prisma.lecturer.upsert({
    where: { email: 'dilani.w@sparkline.ac' },
    update: {},
    create: {
      fullName: 'Ms. Dilani Wickramasinghe',
      employeeCode: 'LEC-004',
      email: 'dilani.w@sparkline.ac',
      phone: '+94775566778',
      department: 'Data Science',
      isActive: true,
    },
  });

  const lecturer5 = await prisma.lecturer.upsert({
    where: { email: 'nuwan.f@sparkline.ac' },
    update: {},
    create: {
      fullName: 'Dr. Nuwan Fernando',
      employeeCode: 'LEC-005',
      email: 'nuwan.f@sparkline.ac',
      phone: '+94772233445',
      department: 'Cybersecurity',
      isActive: true,
    },
  });

  console.log('✅ 5 Lecturers seeded');

  // 4. Seed Academic Modules
  const module1 = await prisma.academicModule.upsert({
    where: { code: 'SE1010' },
    update: {},
    create: {
      code: 'SE1010',
      name: 'Software Engineering Fundamentals',
      description: 'Introduction to SE principles, lifecycle models, and git workflow',
      department: 'Software Engineering',
      level: 1,
      isActive: true,
    },
  });

  const module2 = await prisma.academicModule.upsert({
    where: { code: 'CS1020' },
    update: {},
    create: {
      code: 'CS1020',
      name: 'Data Structures & Algorithms',
      description: 'Arrays, Trees, Graphs, Sorting algorithms and asymptotic analysis',
      department: 'Computer Science',
      level: 1,
      isActive: true,
    },
  });

  const module3 = await prisma.academicModule.upsert({
    where: { code: 'IT1130' },
    update: {},
    create: {
      code: 'IT1130',
      name: 'Web Application Development',
      description: 'Full-stack web architecture, React, Next.js, and REST APIs',
      department: 'Information Technology',
      level: 1,
      isActive: true,
    },
  });

  const module4 = await prisma.academicModule.upsert({
    where: { code: 'SE2040' },
    update: {},
    create: {
      code: 'SE2040',
      name: 'Database Management Systems',
      description: 'Relational data modeling, SQL optimization, and NoSQL fundamentals',
      department: 'Software Engineering',
      level: 2,
      isActive: true,
    },
  });

  const module5 = await prisma.academicModule.upsert({
    where: { code: 'CS3050' },
    update: {},
    create: {
      code: 'CS3050',
      name: 'Artificial Intelligence & Machine Learning',
      description: 'Supervised learning, deep neural networks, and computer vision',
      department: 'Computer Science',
      level: 3,
      isActive: true,
    },
  });

  const module6 = await prisma.academicModule.upsert({
    where: { code: 'CY3010' },
    update: {},
    create: {
      code: 'CY3010',
      name: 'Network Security & Cryptography',
      description: 'Public-key cryptography, TLS/SSL, firewall architecture, and threat mitigation',
      department: 'Cybersecurity',
      level: 3,
      isActive: true,
    },
  });

  console.log('✅ 6 Academic modules seeded');

  // 5. Seed Display Configurations
  const displays = [
    {
      name: 'LH 101 Entrance Screen',
      displayKey: 'LH-101-MAIN',
      roomId: room101.id,
      buildingId: null,
      floorId: null,
      sideId: null,
      refreshIntervalSeconds: 30,
    },
    {
      name: 'LH 102 Entrance Screen',
      displayKey: 'LH-102-MAIN',
      roomId: room102.id,
      buildingId: null,
      floorId: null,
      sideId: null,
      refreshIntervalSeconds: 30,
    },
    {
      name: 'SE Lab 5A04 Screen',
      displayKey: 'LAB-5A04',
      roomId: room5A04.id,
      buildingId: null,
      floorId: null,
      sideId: null,
      refreshIntervalSeconds: 30,
    },
    {
      name: 'Grand Auditorium 14F01 Display',
      displayKey: 'AUD-14F01',
      roomId: room14F01.id,
      buildingId: null,
      floorId: null,
      sideId: null,
      refreshIntervalSeconds: 30,
    },
    {
      name: 'Main Academic Building Lobby',
      displayKey: 'MAIN-BUILDING-LOBBY',
      roomId: null,
      buildingId: mainBuilding.id,
      floorId: null,
      sideId: null,
      refreshIntervalSeconds: 30,
    },
    {
      name: 'Technology Complex Lobby Display',
      displayKey: 'TECH-COMPLEX-LOBBY',
      roomId: null,
      buildingId: techBuilding.id,
      floorId: null,
      sideId: null,
      refreshIntervalSeconds: 30,
    },
    {
      name: 'Floor 5 Side A Hallway Monitor',
      displayKey: 'FLOOR-5A-HALLWAY',
      roomId: null,
      buildingId: null,
      floorId: null,
      sideId: mainSide5A.id,
      refreshIntervalSeconds: 30,
    },
  ];

  for (const disp of displays) {
    await prisma.displayConfiguration.upsert({
      where: { displayKey: disp.displayKey },
      update: {
        name: disp.name,
        roomId: disp.roomId,
        buildingId: disp.buildingId,
        floorId: disp.floorId,
        sideId: disp.sideId,
        refreshIntervalSeconds: disp.refreshIntervalSeconds,
        isActive: true,
      },
      create: {
        ...disp,
        isActive: true,
      },
    });
  }

  console.log(`✅ ${displays.length} Digital Signage display configurations seeded`);

  // 6. Seed Scheduled Sessions (Dynamic Timestamps for Realistic Live Status)
  const now = new Date();

  // Clear existing sessions to reload fresh dummy dataset
  await prisma.scheduledSession.deleteMany({});

  const sampleSessions = [
    // 1. LH-101: Ongoing Now (Started 30m ago, ends in 60m)
    {
      roomId: room101.id,
      moduleId: module1.id,
      lecturerId: lecturer1.id,
      title: 'Software Architecture Principles',
      sessionType: SessionType.LECTURE,
      startDateTime: new Date(now.getTime() - 30 * 60 * 1000),
      endDateTime: new Date(now.getTime() + 60 * 60 * 1000),
      notes: 'Bring laptops with Docker pre-installed for architectural analysis',
      status: SessionStatus.SCHEDULED,
    },
    // 2. LH-101: Up Next Later Today (Starts in 90m, ends in 3h)
    {
      roomId: room101.id,
      moduleId: module2.id,
      lecturerId: lecturer2.id,
      title: 'Tree Traversal & BST Deep Dive',
      sessionType: SessionType.LECTURE,
      startDateTime: new Date(now.getTime() + 90 * 60 * 1000),
      endDateTime: new Date(now.getTime() + 180 * 60 * 1000),
      notes: 'Preparation for Lab Test 1 next week',
      status: SessionStatus.SCHEDULED,
    },
    // 3. LH-101: Recently Completed (Ended 45m ago)
    {
      roomId: room101.id,
      moduleId: module1.id,
      lecturerId: lecturer1.id,
      title: 'Object-Oriented Design Patterns',
      sessionType: SessionType.LECTURE,
      startDateTime: new Date(now.getTime() - 150 * 60 * 1000),
      endDateTime: new Date(now.getTime() - 45 * 60 * 1000),
      notes: 'Session slides published on portal',
      status: SessionStatus.SCHEDULED,
    },

    // 4. 5A04 (Software Lab): Ongoing Now (Started 45m ago, ends in 45m)
    {
      roomId: room5A04.id,
      moduleId: module3.id,
      lecturerId: lecturer3.id,
      title: 'Full-Stack Web Dev Practicum: Next.js & NestJS',
      sessionType: SessionType.LABORATORY,
      startDateTime: new Date(now.getTime() - 45 * 60 * 1000),
      endDateTime: new Date(now.getTime() + 45 * 60 * 1000),
      notes: 'Submit Git commit SHA on assignment portal before leaving',
      status: SessionStatus.SCHEDULED,
    },

    // 5. LH-102: Upcoming Soon (Starts in 10 minutes! Triggers UPCOMING_SOON status)
    {
      roomId: room102.id,
      moduleId: module4.id,
      lecturerId: lecturer1.id,
      title: 'Relational Schema Normalization (3NF & BCNF)',
      sessionType: SessionType.LECTURE,
      startDateTime: new Date(now.getTime() + 10 * 60 * 1000),
      endDateTime: new Date(now.getTime() + 120 * 60 * 1000),
      notes: 'Bring graph paper or tablet for ER diagrams',
      status: SessionStatus.SCHEDULED,
    },

    // 6. 14F01 (Grand Auditorium): Ongoing Now (Started 20m ago, ends in 70m)
    {
      roomId: room14F01.id,
      moduleId: module5.id,
      lecturerId: lecturer2.id,
      title: 'Keynote: Ethics & Scalability in Modern AI',
      sessionType: SessionType.LECTURE,
      startDateTime: new Date(now.getTime() - 20 * 60 * 1000),
      endDateTime: new Date(now.getTime() + 70 * 60 * 1000),
      notes: 'Open to all faculties; live stream available on portal',
      status: SessionStatus.SCHEDULED,
    },

    // 7. 12G01 (AI Hub Lab): Upcoming Later Today (Starts in 2 hours)
    {
      roomId: room12G01.id,
      moduleId: module5.id,
      lecturerId: lecturer4.id,
      title: 'Neural Network Hyperparameter Fine-Tuning',
      sessionType: SessionType.LABORATORY,
      startDateTime: new Date(now.getTime() + 120 * 60 * 1000),
      endDateTime: new Date(now.getTime() + 240 * 60 * 1000),
      notes: 'GPU cluster access credentials will be distributed in lab',
      status: SessionStatus.SCHEDULED,
    },

    // 8. 5A01: Upcoming Later Today (Starts in 3 hours)
    {
      roomId: room5A01.id,
      moduleId: module6.id,
      lecturerId: lecturer5.id,
      title: 'Zero Trust Security Architectures',
      sessionType: SessionType.LECTURE,
      startDateTime: new Date(now.getTime() + 180 * 60 * 1000),
      endDateTime: new Date(now.getTime() + 270 * 60 * 1000),
      notes: 'Module review session',
      status: SessionStatus.SCHEDULED,
    },

    // 9. LH-102: Cancelled Session (For testing cancellation display and admin status)
    {
      roomId: room102.id,
      moduleId: module2.id,
      lecturerId: lecturer2.id,
      title: 'Data Structures Tutorial 04',
      sessionType: SessionType.TUTORIAL,
      startDateTime: new Date(now.getTime() + 300 * 60 * 1000),
      endDateTime: new Date(now.getTime() + 360 * 60 * 1000),
      notes: 'CANCELLED: Rescheduled to Friday due to faculty colloquium',
      status: SessionStatus.CANCELLED,
    },

    // 10. 5A02: Cancelled Session (For testing room availability when cancelled)
    {
      roomId: room5A02.id,
      moduleId: module4.id,
      lecturerId: lecturer3.id,
      title: 'Database SQL Queries Workshop',
      sessionType: SessionType.PRACTICAL,
      startDateTime: new Date(now.getTime() - 15 * 60 * 1000),
      endDateTime: new Date(now.getTime() + 60 * 60 * 1000),
      notes: 'CANCELLED: Emergency AV projector maintenance',
      status: SessionStatus.CANCELLED,
    },
  ];

  await prisma.scheduledSession.createMany({
    data: sampleSessions,
  });

  console.log(`✅ ${sampleSessions.length} Scheduled Sessions created (Ongoing, Upcoming, Completed, and Cancelled)`);
  console.log('🎉 Extended Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
