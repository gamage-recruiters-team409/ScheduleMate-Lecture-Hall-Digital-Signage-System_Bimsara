# ScheduleMate — Postman Collection

> Complete API testing collection for the **ScheduleMate Lecture Hall Digital Signage System**
> Built for Sparkline Academy · Backend: NestJS + Prisma · Base URL: `http://localhost:3001/api`

---

## 📁 Files in This Folder

| File | Description |
|------|-------------|
| `ScheduleMate-API.postman_collection.json` | Main collection — 40+ requests across 10 groups, each with automated test assertions |
| `ScheduleMate-Local.postman_environment.json` | Environment file pre-configured for local development |
| `README.md` | This file |

---

## 📥 How to Import into Postman

1. Open **Postman** (desktop app or web)
2. Click **Import** button (top-left toolbar)
3. Drag and drop **both** files at the same time:
   - `ScheduleMate-API.postman_collection.json`
   - `ScheduleMate-Local.postman_environment.json`
4. Click **Import** to confirm
5. In the top-right corner, open the environment dropdown and select **ScheduleMate — Local**

> ⚠️ Make sure you select the environment — without it, `{{baseUrl}}` and `{{token}}` will not resolve.

---

## 🚀 Quick Start (Recommended Order)

Run these requests in order on your first session. Each one auto-saves an ID to the collection variables, which are reused by later requests.

| Step | Request | What it saves |
|------|---------|---------------|
| 1 | 🔐 **Auth → Login** | `token` (JWT) |
| 2 | 🏢 **Buildings → List All Buildings** | `buildingId` |
| 3 | 🏗️ **Floors → List All Floors** | `floorId` |
| 4 | 🗂️ **Sides → List All Sides** | `sideId` |
| 5 | 🚪 **Rooms → List All Rooms** | `roomId` |
| 6 | 👨‍🏫 **Lecturers → List All Lecturers** | `lecturerId` |
| 7 | 📚 **Academic Modules → List All Modules** | `moduleId` |
| 8 | 📅 **Sessions → Create Session** | `sessionId` |
| 9 | 📺 **Display Configs → List All Display Configs** | `displayConfigId` |

---

## 🔐 Authentication

### How it works
- The backend uses **JWT stored in HTTP-only cookies** for the browser, and also returns the token in the response body for API clients like Postman.
- The collection is configured at the **collection level** to send `Authorization: Bearer {{token}}` on every request.
- The **Login** request has a test script that automatically captures the `accessToken` from the response and saves it to the `token` collection variable.

### Default Admin Credentials
```
Email:    admin@sparkline.ac
Password: Admin@123
```

### Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/login` | ❌ Public | Login and receive JWT |
| `GET` | `/api/auth/me` | ✅ Required | Get current user profile |
| `POST` | `/api/auth/logout` | ✅ Required | Logout and clear token |

### Login Response Example
```json
{
  "message": "Login successful",
  "accessToken": "eyJhbGci...",
  "user": {
    "id": "cmtv9q...",
    "fullName": "Sparkline Admin",
    "email": "admin@sparkline.ac",
    "role": "ADMIN"
  }
}
```

---

## 🏗️ Campus Hierarchy

The data model follows this hierarchy:

```
Building
  └── Floor
        └── Side (Wing/Section)
              └── Room (Lecture Hall / Lab / Classroom)
```

Each level supports: **List**, **Get by ID**, **Create**, **Update (PATCH)**, and **Toggle Active Status**.

---

## 🏢 Buildings (`/api/buildings`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/buildings` | List all buildings |
| `GET` | `/api/buildings/:id` | Get a single building |
| `POST` | `/api/buildings` | Create a building |
| `PATCH` | `/api/buildings/:id` | Update a building |
| `PATCH` | `/api/buildings/:id/status` | Toggle `isActive` |

### Create Building — Request Body
```json
{
  "name": "Main Academic Block",
  "code": "MAB",
  "description": "Primary teaching building"
}
```
> `name` and `code` must each be **globally unique**.

---

## 🏗️ Floors (`/api/floors`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/floors` | List all floors |
| `GET` | `/api/floors?buildingId=` | List floors for a specific building |
| `GET` | `/api/floors/:id` | Get a single floor |
| `POST` | `/api/floors` | Create a floor |
| `PATCH` | `/api/floors/:id` | Update a floor |
| `PATCH` | `/api/floors/:id/status` | Toggle `isActive` |

### Create Floor — Request Body
```json
{
  "buildingId": "{{buildingId}}",
  "name": "Ground Floor",
  "floorNumber": 0
}
```
> `[buildingId, floorNumber]` combination must be **unique** — no two floors on the same building can share a floor number.

---

## 🗂️ Sides (`/api/sides`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/sides` | List all sides |
| `GET` | `/api/sides?floorId=` | List sides on a specific floor |
| `GET` | `/api/sides/:id` | Get a single side |
| `POST` | `/api/sides` | Create a side |
| `PATCH` | `/api/sides/:id` | Update a side |
| `PATCH` | `/api/sides/:id/status` | Toggle `isActive` |

### Create Side — Request Body
```json
{
  "floorId": "{{floorId}}",
  "name": "North Wing",
  "code": "NW"
}
```
> `[floorId, name]` combination must be **unique**.

---

## 🚪 Rooms (`/api/rooms`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/rooms` | List all rooms |
| `GET` | `/api/rooms?sideId=` | List rooms on a specific side |
| `GET` | `/api/rooms/:id` | Get a single room |
| `GET` | `/api/rooms/:id/schedule?date=YYYY-MM-DD` | Get all sessions for a room on a date |
| `POST` | `/api/rooms` | Create a room |
| `PATCH` | `/api/rooms/:id` | Update a room |
| `PATCH` | `/api/rooms/:id/status` | Toggle `isActive` |

### Create Room — Request Body
```json
{
  "sideId": "{{sideId}}",
  "name": "Lecture Hall 101",
  "code": "LH-101",
  "capacity": 120,
  "roomType": "LECTURE_HALL"
}
```

### Room Types
| Value | Meaning |
|-------|---------|
| `LECTURE_HALL` | Large lecture hall |
| `LABORATORY` | Science/computer lab |
| `CLASSROOM` | Standard classroom |
| `AUDITORIUM` | Large auditorium |
| `OTHER` | Miscellaneous |

### Daily Schedule Response
```json
{
  "room": { "id": "...", "name": "Lecture Hall 101", "code": "LH-101" },
  "date": "2025-09-15",
  "sessions": [
    {
      "id": "...",
      "title": "Introduction to Programming",
      "startDateTime": "2025-09-15T08:00:00.000Z",
      "endDateTime": "2025-09-15T10:00:00.000Z",
      "sessionType": "LECTURE",
      "status": "SCHEDULED",
      "lecturer": { "fullName": "Dr. Nimal Silva" },
      "module": { "code": "CS1001", "name": "Introduction to Programming" }
    }
  ]
}
```

---

## 👨‍🏫 Lecturers (`/api/lecturers`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/lecturers` | List all lecturers |
| `GET` | `/api/lecturers?search=name` | Search by name, email, or department |
| `GET` | `/api/lecturers/:id` | Get a single lecturer |
| `POST` | `/api/lecturers` | Create a lecturer |
| `PATCH` | `/api/lecturers/:id` | Update a lecturer |
| `PATCH` | `/api/lecturers/:id/status` | Toggle `isActive` |

### Create Lecturer — Request Body
```json
{
  "fullName": "Dr. Nimal Silva",
  "employeeCode": "EMP-101",
  "email": "nimal.silva@sparkline.ac",
  "phone": "+94771234567",
  "department": "Computer Science"
}
```
> `email` must be **unique** if provided. `employeeCode` is optional.

---

## 📚 Academic Modules (`/api/modules`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/modules` | List all modules |
| `GET` | `/api/modules?search=` | Search by code, name, or department |
| `GET` | `/api/modules/:id` | Get a single module |
| `POST` | `/api/modules` | Create a module |
| `PATCH` | `/api/modules/:id` | Update a module |
| `PATCH` | `/api/modules/:id/status` | Toggle `isActive` |

### Create Module — Request Body
```json
{
  "code": "CS1001",
  "name": "Introduction to Programming",
  "description": "Fundamentals of programming using Python",
  "department": "Computer Science",
  "level": 1
}
```
> `code` must be **globally unique**.

---

## 📅 Sessions (`/api/sessions`)

Sessions are the core scheduling entity. Both **room** and **lecturer** conflicts are enforced.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/sessions` | List all sessions |
| `GET` | `/api/sessions?roomId=` | Filter by room |
| `GET` | `/api/sessions?lecturerId=` | Filter by lecturer |
| `GET` | `/api/sessions?moduleId=` | Filter by module |
| `GET` | `/api/sessions?buildingId=` | Filter by building |
| `GET` | `/api/sessions?startDate=&endDate=` | Filter by date range |
| `GET` | `/api/sessions?status=SCHEDULED` | Filter by status |
| `GET` | `/api/sessions?search=` | Full-text search on title |
| `GET` | `/api/sessions/:id` | Get a single session |
| `POST` | `/api/sessions` | Create a session |
| `PATCH` | `/api/sessions/:id` | Update a session |
| `PATCH` | `/api/sessions/:id/cancel` | Cancel a session |

### Create Session — Request Body
```json
{
  "roomId": "{{roomId}}",
  "moduleId": "{{moduleId}}",
  "lecturerId": "{{lecturerId}}",
  "title": "Introduction to Programming — Week 3",
  "sessionType": "LECTURE",
  "startDateTime": "2025-09-20T08:00:00.000Z",
  "endDateTime": "2025-09-20T10:00:00.000Z",
  "notes": "Bring your laptops"
}
```

### Session Types
| Value | Meaning |
|-------|---------|
| `LECTURE` | Regular lecture |
| `TUTORIAL` | Small group tutorial |
| `PRACTICAL` | Practical session |
| `LABORATORY` | Lab session |
| `EXAM` | Examination |
| `MEETING` | Staff/faculty meeting |
| `EVENT` | Special event |
| `OTHER` | Miscellaneous |

### Session Status
| Value | Meaning |
|-------|---------|
| `SCHEDULED` | Active — shown on signage |
| `CANCELLED` | Cancelled — hidden from all public signage |

### ⚠️ Conflict Detection Rules
The backend enforces **two independent conflict checks**:

1. **Room conflict** — A room cannot have two `SCHEDULED` sessions with overlapping times
2. **Lecturer conflict** — A lecturer cannot be scheduled in two places at the same time

If either check fails, the API returns:
```json
HTTP 409 Conflict
{
  "statusCode": 409,
  "message": "Room is already booked during this time slot"
}
```

The collection includes a pre-built **Conflict Test** request that demonstrates this — send it after creating a session to see the 409 response.

---

## 📺 Display Configurations (`/api/display-configurations`)

Each display has a unique `displayKey` and is scoped to one of: Room, Side, Floor, or Building.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/display-configurations` | List all display configs |
| `GET` | `/api/display-configurations/:id` | Get a single config |
| `POST` | `/api/display-configurations` | Create a display config |
| `PATCH` | `/api/display-configurations/:id` | Update a display config |
| `PATCH` | `/api/display-configurations/:id/status` | Toggle `isActive` |

### Create Display Config — Room Scope
```json
{
  "name": "Lecture Hall 101 Display",
  "displayKey": "LH-101-MAIN",
  "roomId": "{{roomId}}",
  "refreshIntervalSeconds": 30,
  "isActive": true
}
```

### Create Display Config — Floor Scope
```json
{
  "name": "Floor 2 Overview",
  "displayKey": "FLOOR-2-HALLWAY",
  "floorId": "{{floorId}}",
  "refreshIntervalSeconds": 60,
  "isActive": true
}
```

### Scope Options (provide exactly one)
| Field | Scope |
|-------|-------|
| `roomId` | Single room — shows current/next session |
| `sideId` | All rooms on a wing/side |
| `floorId` | All rooms on a floor |
| `buildingId` | All rooms in a building |

---

## 🖥️ Public Signage Endpoints (No Auth Required)

These endpoints power the physical digital displays. **No JWT or authentication needed.**

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/public/displays/:displayKey` | Get signage data by display key |
| `GET` | `/api/public/rooms/:roomCode/status` | Get room occupancy by room code |

### Room-Scope Response (single room display)
```json
{
  "display": {
    "name": "Lecture Hall 101 Display",
    "displayKey": "LH-101-MAIN",
    "refreshIntervalSeconds": 30,
    "scopeType": "ROOM"
  },
  "serverTime": "2025-09-11T10:00:00.000Z",
  "room": { "id": "...", "name": "Lecture Hall 101", "code": "LH-101" },
  "occupancyStatus": "OCCUPIED",
  "currentSession": {
    "title": "Introduction to Programming",
    "startDateTime": "2025-09-11T08:00:00.000Z",
    "endDateTime": "2025-09-11T10:00:00.000Z",
    "sessionType": "LECTURE",
    "module": { "code": "CS1001", "name": "Introduction to Programming" },
    "lecturer": { "fullName": "Dr. Nimal Silva", "department": "Computer Science" }
  },
  "nextSession": { ... },
  "recentlyCompletedSessions": [ ... ]
}
```

### Occupancy Status Values
| Value | Meaning |
|-------|---------|
| `OCCUPIED` | A session is currently running |
| `UPCOMING_SOON` | Next session starts within 15 minutes |
| `AVAILABLE` | Room is free |

### Area-Scope Response (floor/side/building display)
```json
{
  "display": {
    "name": "Floor 2 Overview",
    "displayKey": "FLOOR-2-HALLWAY",
    "scopeType": "BUILDING_OR_AREA"
  },
  "serverTime": "2025-09-11T10:00:00.000Z",
  "rooms": [
    {
      "room": { "id": "...", "name": "Lecture Hall 201", "code": "LH-201" },
      "occupancyStatus": "AVAILABLE",
      "currentSession": null,
      "nextSession": { ... }
    },
    ...
  ]
}
```

---

## 🌍 Environment Variables

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `baseUrl` | `http://localhost:3001/api` | API base URL |
| `token` | *(auto-set after login)* | JWT access token |
| `adminEmail` | `admin@sparkline.ac` | Default admin email |
| `adminPassword` | `Admin@123` | Default admin password |
| `buildingId` | *(auto-set by List requests)* | Last fetched building ID |
| `floorId` | *(auto-set by List requests)* | Last fetched floor ID |
| `sideId` | *(auto-set by List requests)* | Last fetched side ID |
| `roomId` | *(auto-set by List requests)* | Last fetched room ID |
| `lecturerId` | *(auto-set by List requests)* | Last fetched lecturer ID |
| `moduleId` | *(auto-set by List requests)* | Last fetched module ID |
| `sessionId` | *(auto-set by Create/List)* | Last created/fetched session ID |
| `displayConfigId` | *(auto-set by List requests)* | Last fetched display config ID |

---

## 🧪 Automated Tests

Every request in the collection includes test assertions that run automatically. Examples:

- **Login** — asserts `200 OK`, checks `accessToken` exists, saves token
- **Create requests** — assert `201 Created`, save the new ID
- **List requests** — assert `200 OK`, verify response is an array, save first item's ID
- **Cancel Session** — asserts `status === "CANCELLED"` in response
- **Conflict Test** — asserts `409 Conflict` is returned

To run all tests at once: click the **collection name → Run collection** button in Postman.

---

## ⚡ Common Errors

| Status | Cause | Fix |
|--------|-------|-----|
| `401 Unauthorized` | Token missing or expired | Run **Auth → Login** again |
| `404 Not Found` | ID doesn't exist in DB | Run a List request first to populate the variable |
| `409 Conflict` | Overlapping session (room or lecturer) | Change the time or use a different room/lecturer |
| `400 Bad Request` | Validation error (missing field, wrong type) | Check the request body against the schema above |
| `503 / Connection refused` | Backend not running | Run `npm run start:dev` in the `backend/` folder |

---

## 🖥️ Prerequisites

Make sure these are running before using the collection:

```bash
# Terminal 1 — Backend (port 3001)
cd backend && npm run start:dev

# Terminal 2 — Frontend (port 3000)
cd frontend && npm run dev
```

The Postman collection only talks to the **backend** on port `3001`.
