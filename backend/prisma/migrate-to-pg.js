#!/usr/bin/env node
/**
 * Migrate data from SQLite dev.db → PostgreSQL (Docker)
 */

const { execSync } = require('child_process');
const Database = require('better-sqlite3');
const { Client } = require('pg');
const path = require('path');

const PG_URL = 'postgresql://schedulemate:schedulemate@localhost:5433/schedulemate';
const DB_PATH = path.join(__dirname, '../prisma/dev.db');

async function migrate() {
  console.log('📦 Opening SQLite DB...');
  const sqlite = new Database(DB_PATH);

  console.log('🐘 Connecting to PostgreSQL...');
  const pg = new Client({ connectionString: PG_URL });
  await pg.connect();

  // Helper: insert rows from SQLite table to PG
  async function migrateTable(tableName, transformRow) {
    const rows = sqlite.prepare(`SELECT * FROM "${tableName}"`).all();
    console.log(`  → ${tableName}: ${rows.length} rows`);
    for (const row of rows) {
      const r = transformRow ? transformRow(row) : row;
      const cols = Object.keys(r).map(k => `"${k}"`).join(', ');
      const vals = Object.values(r);
      const placeholders = vals.map((_, i) => `$${i + 1}`).join(', ');
      await pg.query(
        `INSERT INTO "${tableName}" (${cols}) VALUES (${placeholders}) ON CONFLICT DO NOTHING`,
        vals
      );
    }
  }

  // SQLite stores booleans as 0/1, dates as epoch ms → convert
  const toDate = (ms) => ms ? new Date(ms).toISOString() : null;
  const toBool = (v) => v === 1 || v === true;

  try {
    console.log('\n🔄 Migrating tables...');

    // Users
    const users = sqlite.prepare('SELECT * FROM User').all();
    for (const u of users) {
      await pg.query(
        `INSERT INTO "User" (id, "fullName", email, "passwordHash", role, "isActive", "createdAt", "updatedAt")
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT DO NOTHING`,
        [u.id, u.fullName, u.email, u.passwordHash, u.role,
         toBool(u.isActive), toDate(u.createdAt), toDate(u.updatedAt)]
      );
    }
    console.log(`  → User: ${users.length} rows`);

    // Buildings
    const buildings = sqlite.prepare('SELECT * FROM Building').all();
    for (const b of buildings) {
      await pg.query(
        `INSERT INTO "Building" (id, name, code, description, "isActive", "createdAt", "updatedAt")
         VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT DO NOTHING`,
        [b.id, b.name, b.code, b.description, toBool(b.isActive), toDate(b.createdAt), toDate(b.updatedAt)]
      );
    }
    console.log(`  → Building: ${buildings.length} rows`);

    // Floors
    const floors = sqlite.prepare('SELECT * FROM Floor').all();
    for (const f of floors) {
      await pg.query(
        `INSERT INTO "Floor" (id, "buildingId", name, "floorNumber", "isActive", "createdAt", "updatedAt")
         VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT DO NOTHING`,
        [f.id, f.buildingId, f.name, f.floorNumber, toBool(f.isActive), toDate(f.createdAt), toDate(f.updatedAt)]
      );
    }
    console.log(`  → Floor: ${floors.length} rows`);

    // Sides
    const sides = sqlite.prepare('SELECT * FROM Side').all();
    for (const s of sides) {
      await pg.query(
        `INSERT INTO "Side" (id, "floorId", name, code, "isActive", "createdAt", "updatedAt")
         VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT DO NOTHING`,
        [s.id, s.floorId, s.name, s.code, toBool(s.isActive), toDate(s.createdAt), toDate(s.updatedAt)]
      );
    }
    console.log(`  → Side: ${sides.length} rows`);

    // Rooms
    const rooms = sqlite.prepare('SELECT * FROM Room').all();
    for (const r of rooms) {
      await pg.query(
        `INSERT INTO "Room" (id, "sideId", name, code, capacity, "roomType", "isActive", "createdAt", "updatedAt")
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) ON CONFLICT DO NOTHING`,
        [r.id, r.sideId, r.name, r.code, r.capacity, r.roomType, toBool(r.isActive), toDate(r.createdAt), toDate(r.updatedAt)]
      );
    }
    console.log(`  → Room: ${rooms.length} rows`);

    // Lecturers
    const lecturers = sqlite.prepare('SELECT * FROM Lecturer').all();
    for (const l of lecturers) {
      await pg.query(
        `INSERT INTO "Lecturer" (id, "fullName", "employeeCode", email, phone, department, "isActive", "createdAt", "updatedAt")
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) ON CONFLICT DO NOTHING`,
        [l.id, l.fullName, l.employeeCode, l.email, l.phone, l.department, toBool(l.isActive), toDate(l.createdAt), toDate(l.updatedAt)]
      );
    }
    console.log(`  → Lecturer: ${lecturers.length} rows`);

    // AcademicModules
    const modules = sqlite.prepare('SELECT * FROM AcademicModule').all();
    for (const m of modules) {
      await pg.query(
        `INSERT INTO "AcademicModule" (id, code, name, description, department, level, "isActive", "createdAt", "updatedAt")
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) ON CONFLICT DO NOTHING`,
        [m.id, m.code, m.name, m.description, m.department, m.level, toBool(m.isActive), toDate(m.createdAt), toDate(m.updatedAt)]
      );
    }
    console.log(`  → AcademicModule: ${modules.length} rows`);

    // ScheduledSessions
    const sessions = sqlite.prepare('SELECT * FROM ScheduledSession').all();
    for (const s of sessions) {
      await pg.query(
        `INSERT INTO "ScheduledSession" (id, "roomId", "moduleId", "lecturerId", title, "sessionType", "startDateTime", "endDateTime", notes, status, "createdAt", "updatedAt")
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) ON CONFLICT DO NOTHING`,
        [s.id, s.roomId, s.moduleId, s.lecturerId, s.title, s.sessionType,
         toDate(s.startDateTime), toDate(s.endDateTime), s.notes, s.status,
         toDate(s.createdAt), toDate(s.updatedAt)]
      );
    }
    console.log(`  → ScheduledSession: ${sessions.length} rows`);

    // DisplayConfigurations
    const displays = sqlite.prepare('SELECT * FROM DisplayConfiguration').all();
    for (const d of displays) {
      await pg.query(
        `INSERT INTO "DisplayConfiguration" (id, name, "displayKey", "roomId", "buildingId", "floorId", "sideId", "isActive", "refreshIntervalSeconds", "createdAt", "updatedAt")
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) ON CONFLICT DO NOTHING`,
        [d.id, d.name, d.displayKey, d.roomId, d.buildingId, d.floorId, d.sideId,
         toBool(d.isActive), d.refreshIntervalSeconds, toDate(d.createdAt), toDate(d.updatedAt)]
      );
    }
    console.log(`  → DisplayConfiguration: ${displays.length} rows`);

    console.log('\n✅ Migration complete!');
  } catch (err) {
    console.error('❌ Migration error:', err.message);
    process.exit(1);
  } finally {
    sqlite.close();
    await pg.end();
  }
}

migrate();
