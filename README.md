# ScheduleMate — Lecture Hall Digital Signage System

**Sparkline Academy | Individual Software Engineering Assignment**

ScheduleMate is a centralized lecture hall scheduling and digital display platform. It provides:

1. **Admin management interface** (`/admin`) — Authenticated CRUD for buildings, floors, sides, rooms, lecturers, modules, sessions, and display devices.
2. **Public digital signage** (`/display/:key`) — Read-only full-screen display that auto-refreshes every 30 seconds. No login required.

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS |
| Backend | NestJS 10, Node.js, TypeScript, REST API |
| ORM | Prisma |
| Database | PostgreSQL 16 |
| Auth | JWT in HTTP-only cookies, bcrypt |

---

## Repository Structure

```
.
├── docker-compose.yml        # Local PostgreSQL
├── backend/                  # NestJS REST API (port 3001)
│   ├── src/
│   │   ├── auth/
│   │   ├── prisma/
│   │   ├── common/
│   │   └── ...modules
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── .env.example
└── frontend/                 # Next.js App Router (port 3000)
    └── .env.local.example
```

---

## Prerequisites

- Node.js v20+
- Docker Desktop (for local PostgreSQL) **or** any PostgreSQL 14+ instance

---

## Quick Start

### 1. Clone

```bash
git clone https://github.com/gamage-recruiters-team409/ScheduleMate-Lecture-Hall-Digital-Signage-System_Bimsara.git
cd ScheduleMate-Lecture-Hall-Digital-Signage-System_Bimsara
```

### 2. Start PostgreSQL (Docker)

```bash
docker compose up -d
# PostgreSQL is now available at localhost:5432
# User: schedulemate | Password: schedulemate | DB: schedulemate
```

> **Without Docker**: Set `DATABASE_URL` in `backend/.env` to point to your existing PostgreSQL instance.

### 3. Configure backend environment

```bash
cd backend
cp .env.example .env
# Edit .env:
#   - JWT_SECRET must be at least 32 random characters
#   - SEED_ADMIN_PASSWORD must be changed from the placeholder
```

### 4. Install backend dependencies

```bash
cd backend
npm install
```

### 5. Generate Prisma client

```bash
npx prisma generate
```

### 6. Create and apply database migration

```bash
# Generate migration SQL without applying (so we can add raw CHECK constraints)
npx prisma migrate dev --name init --create-only

# Append database-level CHECK constraints to the generated migration file
MIGRATION_DIR=$(ls -dt prisma/migrations/*/  | head -1)
cat >> "${MIGRATION_DIR}migration.sql" << 'ENDSQL'

-- Raw CHECK constraints (not expressible in Prisma schema DSL)
ALTER TABLE "ScheduledSession"
  ADD CONSTRAINT "end_after_start"
  CHECK ("endDateTime" > "startDateTime");

ALTER TABLE "DisplayConfiguration"
  ADD CONSTRAINT "min_refresh_interval"
  CHECK ("refreshIntervalSeconds" >= 30);

ALTER TABLE "DisplayConfiguration"
  ADD CONSTRAINT "exactly_one_scope" CHECK (
    (CASE WHEN "roomId"     IS NOT NULL THEN 1 ELSE 0 END +
     CASE WHEN "sideId"     IS NOT NULL THEN 1 ELSE 0 END +
     CASE WHEN "floorId"    IS NOT NULL THEN 1 ELSE 0 END +
     CASE WHEN "buildingId" IS NOT NULL THEN 1 ELSE 0 END) = 1
  );
ENDSQL

# Apply the migration (with constraints)
npx prisma migrate dev
```

### 7. Seed the database

```bash
npx prisma db seed
```

### 8. Run the backend

```bash
npm run start:dev
# API: http://localhost:3001/api
```

---

## Environment Variables

### `backend/.env.example`

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | ≥32 random characters — never commit |
| `JWT_EXPIRES_IN` | Token lifetime (default `8h`) |
| `BCRYPT_SALT_ROUNDS` | Password hashing cost (default `12`) |
| `PORT` | Backend port (default `3001`) |
| `FRONTEND_URL` | CORS origin (default `http://localhost:3000`) |
| `APP_TIMEZONE` | Display timezone (default `Asia/Colombo`) |
| `SEED_ADMIN_EMAIL` | Seeded admin email |
| `SEED_ADMIN_PASSWORD` | Seeded admin password — **change before seeding** |

---

## Security Notes

- Passwords are hashed with bcrypt (salt rounds configurable).
- JWT tokens are stored in **HTTP-only cookies** — not accessible to JavaScript.
- Public signage endpoints (`/api/public/*`) require no authentication and return minimal data only.
- Never commit `.env` or `.env.local` files (covered by `.gitignore`).

---

## Demo Credentials (after seeding)

Set in `backend/.env`:

```
SEED_ADMIN_EMAIL=admin@sparkline.ac
SEED_ADMIN_PASSWORD=<your chosen password>
```

---

## API Base

`http://localhost:3001/api`

### Auth endpoints (Phase 2)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/login` | No | Sets HTTP-only cookie |
| POST | `/api/auth/logout` | No | Clears cookie |
| GET | `/api/auth/me` | Cookie | Returns current admin |
