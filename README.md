# ScheduleMate — Lecture Hall Digital Signage System

> **Sparkline Academy** · Modern Campus Digital Signage & Scheduling Platform  
> Full-stack centralized lecture hall scheduling system with real-time digital display monitors and an authenticated administration portal.

[![Next.js](https://img.shields.io/badge/Next.js-15.1-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![NestJS](https://img.shields.io/badge/NestJS-10.0-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.0-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Architecture & Hierarchy](#-architecture--hierarchy)
- [Technology Stack](#-technology-stack)
- [Repository Structure](#-repository-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#1-backend-setup)
  - [Frontend Setup](#2-frontend-setup)
- [Database Configuration](#-database-configuration)
  - [Option A: SQLite (Default Development)](#option-a-sqlite-default-zero-config)
  - [Option B: PostgreSQL with Docker](#option-b-postgresql-with-docker-port-5433)
  - [Opening in pgAdmin](#opening-in-pgadmin-4)
  - [Opening in Prisma Studio](#opening-in-prisma-studio)
- [Default Credentials](#-default-credentials)
- [Digital Signage Display URLs](#-digital-signage-display-urls)
- [Complete REST API Reference](#-complete-rest-api-reference)
- [Conflict Detection & Business Rules](#-conflict-detection--business-rules)
- [Postman API Testing](#-postman-api-testing)
- [Environment Variables Reference](#-environment-variables-reference)

---

## 🌟 Overview

**ScheduleMate** is a unified campus management and digital signage platform built for universities and educational institutions. It replaces static paper schedules and fragmented timetables with an automated, synchronized workflow:

1. **Authenticated Admin Portal (`/admin`)**: A centralized dashboard for campus administrators to manage the physical hierarchy (Buildings, Floors, Sides, Rooms), faculty members (Lecturers), course offerings (Academic Modules), session scheduling with conflict detection, and signage display keys.
2. **Public Digital Signage Engine (`/display/:key`)**: High-contrast, wall-mounted display monitors designed for tablets and 4K displays outside lecture halls. Features automated 30-second silent polling, live occupancy badges (`OCCUPIED`, `UPCOMING SOON`, `AVAILABLE`), offline banners, real-time clock, current lecture progress, and upcoming session schedules. Requires zero authentication.

---

## ✨ Key Features

### 🖥️ Public Digital Signage
- **High-Contrast Dark Theme**: Designed specifically for wall-mounted TV screens, tablets, and kiosks outside lecture halls.
- **Real-Time Status Indicator**:
  - 🔴 **OCCUPIED**: Live session in progress with subject code, topic, lecturer, department, and remaining time.
  - 🟡 **UPCOMING SOON**: Highlighted when a session is starting within 15 minutes.
  - 🟢 **AVAILABLE**: Room is currently unoccupied with time remaining until next schedule.
- **Silent Auto-Refresh**: Polls `/api/public/display/:key` every 30 seconds with automatic recovery and an **Offline Alert Banner** if network connectivity drops.
- **Multiple Scope Types**:
  - **Room-Level Displays** (e.g. `/display/LH-101-MAIN`): Displays live schedule, today's upcoming agenda, and recently completed lectures for a specific hall.
  - **Area/Floor Overview Displays** (e.g. `/display/FLOOR-1-HALLWAY`): Displays a multi-room grid overview of all rooms on a floor or wing.

### 🛡️ Admin Management Portal
- **Dashboard Analytics**: Quick stats on total buildings, active rooms, today's sessions, and active signage devices.
- **4-Level Hierarchy Management**: Full CRUD + Active/Inactive toggle for Buildings → Floors → Sides → Rooms.
- **Intelligent Session Scheduler**:
  - Date & time validation (`startDateTime` must precede `endDateTime`).
  - Strict **double-booking prevention**: detects room conflicts and lecturer schedule collisions across overlapping periods.
  - Session lifecycle management (`SCHEDULED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED` with mandatory cancellation reason).
- **Lecturer & Module Management**: Manage faculty profiles and course catalog codes.
- **Display Configuration Registry**: Associate unique, human-friendly hardware display keys (e.g., `LH-101-MAIN`, `AUD-MAIN`) with specific rooms or campus zones.

---

## 🏛️ Architecture & Hierarchy

The campus is modeled as a strictly scoped, four-tier physical hierarchy:

```mermaid
graph TD
    B[🏢 Building] --> F[🏗️ Floor]
    F --> S[🗂️ Side / Wing]
    S --> R[🚪 Room / Lecture Hall]
    R --> SS[📅 Scheduled Session]
    M[📚 Academic Module] --> SS
    L[👨‍🏫 Lecturer] --> SS
    DC1[📺 Room Display Config] -.-> R
    DC2[📺 Area Display Config] -.-> F
```

### Display Scoping Rules
- Every `DisplayConfiguration` has a unique `displayKey` used in the signage URL (`/display/:displayKey`).
- Exactly **one** scope target must be assigned: `roomId`, `sideId`, `floorId`, or `buildingId`.

---

## 🧱 Technology Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 15.1 (App Router) | React server/client framework |
| **React** | 19.0 | UI component library |
| **TypeScript** | 5.7 | End-to-end type safety |
| **Tailwind CSS** | 3.4 | Utility-first responsive design & high-contrast signage styling |
| **Lucide React** | 0.474 | Unified modern icon set |
| **date-fns** | 4.1 | Date calculations and localized formatting |
| **clsx + tailwind-merge** | — | Dynamic CSS class composition |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| **NestJS** | 10.0 | Enterprise-grade modular TypeScript API framework |
| **Node.js** | 20+ | Server runtime environment |
| **Prisma ORM** | 6.0 | Type-safe database queries, schema migrations, and seeding |
| **Passport & JWT** | — | Stateless authentication with HTTP-only cookies and Bearer tokens |
| **bcrypt** | — | Secure salted password hashing |
| **class-validator / class-transformer** | — | Automatic DTO request validation and payload transformation |

### Database & Dev Tools
| Tool | Purpose |
|---|---|
| **SQLite** | Instant local development database (`backend/prisma/dev.db`) |
| **PostgreSQL 16** | Production-ready SQL engine running via Docker container |
| **Docker Compose** | Containerized PostgreSQL service (configured on host port `5433`) |
| **Postman** | 40+ automated test requests with assertions and dynamic variables (`postman/`) |
| **Prisma Studio** | Web-based visual GUI database browser on port `5555` |

---

## 📁 Repository Structure

```
ScheduleMate-Lecture-Hall-Digital-Signage-System_Bimsara/
├── docker-compose.yml              # PostgreSQL 16 Docker service (port 5433)
├── backend/                        # NestJS API Application
│   ├── prisma/
│   │   ├── schema.prisma           # Active Prisma Schema (SQLite / Postgres)
│   │   ├── schema.postgres.prisma  # PostgreSQL Schema variant
│   │   ├── migrate-to-pg.js        # SQLite-to-PostgreSQL data sync utility
│   │   ├── seed.ts                 # Database seeder (Campus hierarchy, sessions, displays)
│   │   └── dev.db                  # Local SQLite database file
│   ├── src/
│   │   ├── auth/                   # JWT Auth, guards, strategies, cookies
│   │   ├── buildings/              # Building entity CRUD
│   │   ├── floors/                 # Floor entity CRUD
│   │   ├── sides/                  # Side / Wing entity CRUD
│   │   ├── rooms/                  # Room entity CRUD + daily schedule lookup
│   │   ├── lecturers/              # Lecturer entity CRUD
│   │   ├── modules/                # Course Module entity CRUD
│   │   ├── sessions/               # Scheduling engine with conflict validation
│   │   ├── display-configurations/ # Display configuration & keys CRUD
│   │   ├── signage/                # Public signage aggregation endpoint
│   │   ├── common/                 # Guards, decorators, filters, interceptors
│   │   └── prisma/                 # Prisma client service
│   ├── package.json
│   └── .env.example
├── frontend/                       # Next.js 15 Web Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── admin/              # Authenticated Admin Portal
│   │   │   │   ├── dashboard/      # Admin overview with metrics
│   │   │   │   ├── buildings/      # Buildings management
│   │   │   │   ├── floors/         # Floors management
│   │   │   │   ├── sides/          # Sides management
│   │   │   │   ├── rooms/          # Rooms management
│   │   │   │   ├── lecturers/      # Lecturers management
│   │   │   │   ├── modules/        # Academic modules management
│   │   │   │   ├── sessions/       # Session scheduling & conflict alerts
│   │   │   │   └── displays/       # Digital display keys management
│   │   │   ├── display/[key]/      # Full-screen public digital signage view
│   │   │   └── login/              # Admin login interface
│   │   ├── components/             # Reusable UI components & layouts
│   │   └── lib/                    # API client utilities & helpers
│   ├── package.json
│   └── .env.local.example
└── postman/                        # Postman Collection & Environment
    ├── ScheduleMate-API.postman_collection.json
    ├── ScheduleMate-Local.postman_environment.json
    └── README.md                   # Comprehensive Postman user guide
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v20.x or higher
- **npm**: v10.x or higher
- **Docker Desktop** (optional, only needed for PostgreSQL container)

---

### 1. Backend Setup

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure the environment file**:
   ```bash
   cp .env.example .env
   ```
   *Default values in `.env` are ready for instant development with SQLite.*

4. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

5. **Initialize and seed the database**:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

6. **Start the backend development server**:
   ```bash
   npm run start:dev
   ```
   *The API will be live at `http://localhost:3001/api`.*

---

### 2. Frontend Setup

1. **Open a new terminal and navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure frontend environment**:
   ```bash
   cp .env.local.example .env.local
   ```
   Verify that `.env.local` contains:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

4. **Start the Next.js development server**:
   ```bash
   npm run dev
   ```
   *The web application is accessible at `http://localhost:3000`.*

---

## 🗄️ Database Configuration

### Option A: SQLite (Default, Zero-Config)
The project is pre-configured to run on SQLite out-of-the-box (`backend/prisma/dev.db`). No database server installation is required.

---

### Option B: PostgreSQL with Docker (Port 5433)
If you prefer running against PostgreSQL:

1. **Start the PostgreSQL Docker container**:
   ```bash
   docker compose up -d
   ```
   > ℹ️ *Note: The host port is mapped to `5433` (`5433:5432`) to prevent conflicts with any local PostgreSQL instance already running on your machine.*

2. **Connection Parameters**:
   | Parameter | Value |
   |---|---|
   | **Host** | `localhost` |
   | **Port** | `5433` |
   | **Database** | `schedulemate` |
   | **Username** | `schedulemate` |
   | **Password** | `schedulemate` |
   | **Connection URL** | `postgresql://schedulemate:schedulemate@localhost:5433/schedulemate` |

3. **Sync Data to PostgreSQL**:
   To push the schema and copy all seeded rows into PostgreSQL:
   ```bash
   cd backend
   node prisma/migrate-to-pg.js
   ```

---

### Opening in pgAdmin 4

1. Open **pgAdmin 4** on your computer.
2. Right-click **Servers** → **Register** → **Server...**
3. **General Tab**:
   - Name: `ScheduleMate (Docker)`
4. **Connection Tab**:
   - Host name/address: `localhost`
   - Port: `5433`
   - Maintenance database: `schedulemate`
   - Username: `schedulemate`
   - Password: `schedulemate`
   - Check *Save password*
5. Click **Save**.
6. Expand **Servers** → **ScheduleMate (Docker)** → **Databases** → **schedulemate** → **Schemas** → **public** → **Tables**.
7. Right-click any table (e.g. `ScheduledSession`) → **View/Edit Data** → **All Rows**.

---

### Opening in Prisma Studio
To inspect the database in a web GUI directly in your browser:
```bash
cd backend
npx prisma studio
```
Visit: **`http://localhost:5555`**

---

## 🔑 Default Credentials

The database seeder provisions an administrator account:

| Attribute | Value |
|---|---|
| **Login URL** | `http://localhost:3000/login` |
| **Email** | `admin@sparkline.ac` |
| **Password** | `Admin@123` |
| **Role** | `ADMIN` |

---

## 📺 Digital Signage Display URLs

The public signage displays require **no authentication** and are accessible directly:

| Display Screen | URL | Purpose |
|---|---|---|
| **Lecture Hall 101** | [http://localhost:3000/display/LH-101-MAIN](http://localhost:3000/display/LH-101-MAIN) | Main door display for Hall 101 |
| **Lecture Hall 102** | [http://localhost:3000/display/LH-102-MAIN](http://localhost:3000/display/LH-102-MAIN) | Door display for Hall 102 |
| **Computer Lab 1** | [http://localhost:3000/display/LAB-1-MAIN](http://localhost:3000/display/LAB-1-MAIN) | Door display for Lab 1 |
| **Auditorium** | [http://localhost:3000/display/AUD-MAIN](http://localhost:3000/display/AUD-MAIN) | Main Auditorium entrance |
| **Floor 1 Hallway** | [http://localhost:3000/display/FLOOR-1-HALLWAY](http://localhost:3000/display/FLOOR-1-HALLWAY) | Multi-room hallway overview |

---

## 🔌 Complete REST API Reference

Base URL: `http://localhost:3001/api`

### 1. Authentication
| Method | Endpoint | Auth Required | Description |
|---|---|:---:|---|
| `POST` | `/api/auth/login` | ❌ Public | Authenticate admin, returns JWT & sets HTTP-only cookie |
| `GET` | `/api/auth/me` | ✅ Bearer / Cookie | Fetch profile of currently authenticated user |
| `POST` | `/api/auth/logout` | ✅ Bearer / Cookie | Clear auth session |

### 2. Campus Hierarchy (Buildings, Floors, Sides, Rooms)
| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `GET` | `/api/buildings` | ✅ | List all buildings with floor counts |
| `GET` | `/api/buildings/:id` | ✅ | Retrieve building details |
| `POST` | `/api/buildings` | ✅ | Create a new building |
| `PATCH` | `/api/buildings/:id` | ✅ | Update building name or code |
| `PATCH` | `/api/buildings/:id/toggle-status` | ✅ | Toggle building active/inactive state |
| `GET` | `/api/floors` | ✅ | List all floors |
| `GET` | `/api/floors?buildingId=:id` | ✅ | List floors filtered by building |
| `POST` | `/api/floors` | ✅ | Create a floor in a building |
| `PATCH` | `/api/floors/:id` | ✅ | Update floor number or name |
| `PATCH` | `/api/floors/:id/toggle-status` | ✅ | Toggle floor active status |
| `GET` | `/api/sides` | ✅ | List all sides / wings |
| `GET` | `/api/sides?floorId=:id` | ✅ | List sides for a specific floor |
| `POST` | `/api/sides` | ✅ | Create a new side / wing |
| `PATCH` | `/api/sides/:id` | ✅ | Update side name |
| `PATCH` | `/api/sides/:id/toggle-status` | ✅ | Toggle side active status |
| `GET` | `/api/rooms` | ✅ | List all rooms / lecture halls |
| `GET` | `/api/rooms?sideId=:id` | ✅ | List rooms in a specific wing |
| `GET` | `/api/rooms/:id` | ✅ | Get full room details with hierarchy |
| `POST` | `/api/rooms` | ✅ | Create a room (name, code, type, capacity) |
| `PATCH` | `/api/rooms/:id` | ✅ | Update room metadata |
| `PATCH` | `/api/rooms/:id/toggle-status` | ✅ | Toggle room active status |
| `GET` | `/api/rooms/:id/schedule?date=YYYY-MM-DD` | ✅ | Fetch room's daily schedule |

### 3. Faculty & Curriculum (Lecturers & Academic Modules)
| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `GET` | `/api/lecturers` | ✅ | List all lecturers |
| `GET` | `/api/lecturers/:id` | ✅ | Get lecturer profile |
| `POST` | `/api/lecturers` | ✅ | Create lecturer (name, email, department) |
| `PATCH` | `/api/lecturers/:id` | ✅ | Update lecturer details |
| `PATCH` | `/api/lecturers/:id/toggle-status` | ✅ | Toggle lecturer active status |
| `GET` | `/api/academic-modules` | ✅ | List all course modules |
| `GET` | `/api/academic-modules/:id` | ✅ | Get module by ID |
| `POST` | `/api/academic-modules` | ✅ | Create module (code, name, credits) |
| `PATCH` | `/api/academic-modules/:id` | ✅ | Update module information |
| `PATCH` | `/api/academic-modules/:id/toggle-status` | ✅ | Toggle module active status |

### 4. Scheduling & Sessions
| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `GET` | `/api/sessions` | ✅ | List all sessions with filters (`roomId`, `date`, `status`) |
| `GET` | `/api/sessions/:id` | ✅ | Get session details |
| `POST` | `/api/sessions` | ✅ | Schedule new session (**triggers conflict check**) |
| `PATCH` | `/api/sessions/:id` | ✅ | Update session timings or details |
| `PATCH` | `/api/sessions/:id/cancel` | ✅ | Cancel session with required `cancellationReason` |

### 5. Display Configurations & Public Signage
| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `GET` | `/api/display-configurations` | ✅ | List all registered digital signage devices |
| `GET` | `/api/display-configurations/:id` | ✅ | Get display config details |
| `POST` | `/api/display-configurations` | ✅ | Register a new display with unique `displayKey` |
| `PATCH` | `/api/display-configurations/:id` | ✅ | Update display configuration |
| `PATCH` | `/api/display-configurations/:id/toggle-status` | ✅ | Toggle display device active status |
| `GET` | `/api/public/display/:displayKey` | ❌ **Public** | **Signage feed**: returns live occupancy, current, and upcoming sessions |

---

## ⚡ Conflict Detection & Business Rules

When scheduling a session via `POST /api/sessions`, ScheduleMate enforces atomic integrity rules:

```mermaid
flowchart TD
    Req[POST /api/sessions] --> Check1{startDateTime < endDateTime?}
    Check1 -- No --> Err1[400 Bad Request: Invalid Time Range]
    Check1 -- Yes --> Check2{Room Available in Time Window?}
    Check2 -- Conflict --> Err2[409 Conflict: Room is already booked]
    Check2 -- Free --> Check3{Lecturer Available in Time Window?}
    Check3 -- Conflict --> Err3[409 Conflict: Lecturer has another lecture]
    Check3 -- Free --> Save[201 Created: Session Saved]
```

### Double-Booking Overlap Formula
A conflict occurs if an existing active session satisfies:
$$\text{Existing.start} < \text{New.end} \quad \text{AND} \quad \text{Existing.end} > \text{New.start}$$

Cancelled sessions (`status = "CANCELLED"`) are automatically excluded from collision detection.

---

## 🧪 Postman API Testing

A complete Postman collection is included in the [`postman/`](./postman) directory:

- **`postman/ScheduleMate-API.postman_collection.json`**: 40+ configured requests with pre-request scripts and automated test assertions.
- **`postman/ScheduleMate-Local.postman_environment.json`**: Environment variables (`baseUrl`, `token`, entity IDs).
- **`postman/README.md`**: Detailed instructions on running collection tests and automated conflict assertion scenarios.

### Quick Import:
1. Open **Postman** → Click **Import**.
2. Drag and drop both JSON files from the `postman/` folder.
3. Select the **ScheduleMate — Local** environment in the top-right corner.
4. Execute **Auth → Login** to automatically populate the `token` variable.

---

## ⚙️ Environment Variables Reference

### Backend (`backend/.env`)
| Variable | Description | Default |
|---|---|---|
| `DATABASE_URL` | Prisma DB connection URL | `file:./dev.db` |
| `PORT` | NestJS HTTP server port | `3001` |
| `FRONTEND_URL` | Allowed CORS origin | `http://localhost:3000` |
| `JWT_SECRET` | Secret key for signing JWT tokens | *(auto-generated string)* |
| `JWT_EXPIRES_IN` | Token validity duration | `8h` |
| `BCRYPT_SALT_ROUNDS`| Hash calculation cost | `12` |
| `APP_TIMEZONE` | Institution timezone | `Asia/Colombo` |
| `SEED_ADMIN_EMAIL` | Default administrator email | `admin@sparkline.ac` |
| `SEED_ADMIN_PASSWORD` | Default administrator password | `Admin@123` |

### Frontend (`frontend/.env.local`)
| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Base endpoint of backend REST API | `http://localhost:3001/api` |

---

## 👥 Authors & License

Developed for **Sparkline Academy** Lecture Hall Digital Signage System.  
All rights reserved.
