# ScheduleMate — Postman Collection

Complete API test collection for the ScheduleMate backend.

## Files

| File | Description |
|------|-------------|
| `ScheduleMate-API.postman_collection.json` | Main collection with all 40+ requests and automated tests |
| `ScheduleMate-Local.postman_environment.json` | Local development environment variables |

## How to Import

1. Open **Postman**
2. Click **Import** (top left)
3. Drag & drop **both** files, or select them via the file picker
4. Select the **ScheduleMate — Local** environment from the top-right dropdown

## Quick Start

Run these in order:

1. **🔐 Auth → Login** — saves your JWT token automatically
2. **🏢 Buildings → List All Buildings** — saves a `buildingId`
3. **🏗️ Floors → List All Floors** — saves a `floorId`
4. **🗂️ Sides → List All Sides** — saves a `sideId`
5. **🚪 Rooms → List All Rooms** — saves a `roomId`
6. **👨‍🏫 Lecturers → List All Lecturers** — saves a `lecturerId`
7. **📚 Academic Modules → List All Modules** — saves a `moduleId`
8. **📅 Sessions → Create Session** — creates a session using the IDs above

## API Coverage

| Group | Endpoints |
|-------|-----------|
| 🔐 Auth | Login, Get Profile, Logout |
| 🏢 Buildings | List, Get, Create, Update, Toggle Status |
| 🏗️ Floors | List, List by Building, Get, Create, Update, Toggle Status |
| 🗂️ Sides | List, List by Floor, Get, Create, Update, Toggle Status |
| 🚪 Rooms | List, List by Side, Get, Daily Schedule, Create, Update, Toggle Status |
| 👨‍🏫 Lecturers | List, Search, Get, Create, Update, Toggle Status |
| 📚 Modules | List, Search, Get, Create, Update, Toggle Status |
| 📅 Sessions | List, Filter (room/lecturer/date/status), Get, Create, Conflict Test, Update, Cancel |
| 📺 Display Configs | List, Get, Create (Room scope), Create (Floor scope), Update, Toggle Status |
| 🖥️ Public Signage | Get by Display Key, Area Scope, Room Status by Code, 404 Error test |

## Authentication

- All admin endpoints use **Bearer token** authentication
- After **Login**, the token is auto-saved to the `token` collection variable
- The collection is configured to send `Authorization: Bearer {{token}}` on all protected requests
- Public signage endpoints (`/api/public/*`) are **completely open** — no token needed

## Conflict Testing

The **Sessions** folder includes a pre-built conflict test:
- First create a session with `Create Session`
- Then send `Create Session — Conflict Test (same room)`
- Expected result: **409 Conflict**

## Base URL

`http://localhost:3001/api`

> Ensure the backend is running on port **3001** before using the collection.

