Create a complete HIGH-FIDELITY UI DESIGN set for a web-based system named:

“ScheduleMate – Lecture Hall Digital Signage System”

Scenario: Sparkline Academy, an educational institute with two buildings:
- Main Building: Floors 1–10, A Side and B Side.
- New Building: Floors 1–14, G Side and F Side.
- Full-lab floors exist in both buildings.
- New Building Floor 14 has one large lecture hall per side.
- Each digital signage monitor is configured for one Building–Floor–Side and must show only information relevant to that location.

IMPORTANT:
This must be HIGH-FIDELITY, polished, professional, and implementation-ready.
Create each screen as a separate Figma desktop frame.
Create Admin pages at 1440 × 1024.
Create Digital Signage pages at 1920 × 1080 landscape.
Keep the Admin Management side and Digital Signage side visually connected through one shared design system, but optimize them for different use cases.

VISUAL DESIGN DIRECTION:
- Professional academic operations platform.
- Modern, minimal, clean, confident, and easy to scan.
- Use a calm navy/slate foundation with white or very light gray surfaces.
- Use one primary blue accent for navigation, primary actions, and selection.
- Use semantic status colors:
  - Ongoing Now: green.
  - Available: neutral teal or gray-green.
  - Upcoming Soon: amber.
  - Cancelled: red.
  - Rescheduled: blue or purple-blue.
  - Completed / Session Finished: muted gray.
- Never rely on color alone; every status must include an explicit text label.
- Use accessible high-contrast text.
- Use a clean modern sans-serif such as Inter, Manrope, or Plus Jakarta Sans.
- Admin layout should feel structured and calm, similar to a modern university operations dashboard.
- Signage design should feel like an airport/departure-board-inspired academic information display: high contrast, large typography, clear cards, visible from 3–5 metres.
- Avoid gradients, excessive decorative illustrations, overly rounded cards, neon colors, or consumer-app visual styles.
- Use consistent spacing, 8px grid, subtle shadows, thin borders, and restrained rounded corners.
- Use realistic content, not lorem ipsum.

Create the following ADMIN-SIDE high-fidelity frames:

1. Admin Login
- ScheduleMate wordmark/logo.
- Sign in title and concise supporting text.
- Email/username field and password field.
- Primary Sign In button.
- Accessible validation state for invalid credentials.
- Clean dark navy accent and light background.

2. Admin Dashboard
- Persistent left sidebar with ScheduleMate logo and navigation:
  Dashboard, Locations, Rooms & Labs, Modules, Lecturers, Schedules, Live Status, Displays, Audit Log.
- Top bar with page title, global search, notification icon, admin profile.
- KPI cards:
  Total Rooms, Today’s Sessions, Ongoing Now, Available Rooms, Cancelled Today, Active Displays.
- Today’s Schedule table.
- Live Room Status panel with compact status cards.
- Recent Changes panel for cancellations/reschedules.
- Quick actions: Create Session, Add Room, Configure Display.

3. Building, Floor and Side Management
- Building selector cards for Main Building and New Building.
- Floor list with numbered floor rows and floor-type badges.
- Side tabs/controls:
  A Side / B Side for Main Building;
  G Side / F Side for New Building.
- Clearly show special floors:
  Main Building Floors 3, 5, 6 as Full Lab Floors;
  New Building Floors 3, 10, 12, 13 as Full Lab Floors;
  New Building Floor 14 as Large Lecture Hall Floor.
- Add/Edit controls.

4. Rooms and Laboratories Management
- Filter toolbar.
- Refined data table.
- Room type badges: Lecture Room, Laboratory, Large Lecture Hall.
- Example records:
  5A01 Lecture Room;
  5A04 Laboratory;
  12G01 Laboratory;
  14F01 Large Lecture Hall.
- Add Room button.
- High-fidelity Add/Edit Room modal.

5. Module Management
- Search and filter controls.
- Data table.
- Add Module button.
- High-fidelity add/edit module modal.
- Include realistic module examples:
  SE1010 Introduction to Programming;
  IT1130 Web Application Development;
  SE2040 Database Systems;
  CS3050 Artificial Intelligence.

6. Lecturer Management
- Search and filter controls.
- Lecturer table.
- Add Lecturer button.
- Add/Edit Lecturer modal.
- Use realistic lecturer profile details and departmental labels.

7. Schedule Management
- Page heading: “Schedule Management”.
- Filter bar with date, building, floor, side, room, lecturer, module, and status.
- Primary Create Session button.
- Professional schedule table with rows showing real sample data.
- Status badges: Scheduled, Cancelled, Rescheduled, Completed.
- Row actions: View, Edit, Cancel, Reschedule.
- Include a compact calendar/list view toggle.

8. Create/Edit Session
- Elegant multi-section form:
  Academic Details, Time Details, Location Details, Session Details.
- Fields: module, lecturer, date, start/end time, building, floor, side, room, session type, notes.
- Contextual room-availability panel.
- Green success state for an available room.
- Red conflict warning state for overlapping time.
- Clear Save Session and Cancel actions.

9. Cancel Session
- Confirmation modal.
- Prominent warning icon and explanation.
- Session summary card.
- Required reason field.
- Secondary back/cancel action and red Confirm Cancellation action.
- Note that the session will be removed from ongoing/upcoming signage.

10. Reschedule Session
- Side-by-side “Original Session” and “New Schedule” panels.
- New location and time controls.
- Availability validation panel.
- Reschedule reason field.
- Clear visual marker showing schedule changed.
- Confirm Reschedule action.

11. Live Room Status Monitor
- Building/floor/side filters.
- Grid of refined room cards.
- Each card includes Room Code, Room Type, current session, next session, status, and time until next change.
- Use status chips with text and color.
- Example:
  5A01 — Ongoing Now;
  5A02 — Available;
  5A04 — Upcoming Soon.

12. Display Device Configuration
- Display-device table.
- Device health / last seen indicator.
- Add Display Device button.
- Configuration drawer or modal.
- Fields: display name, device code, building, floor, side, resolution, active status.
- Include a “Preview Signage” action.

Create the following DIGITAL SIGNAGE-SIDE high-fidelity frames:

13. Signage: Ongoing Lectures & Labs
- Full-screen 1920 × 1080 landscape display.
- Dark navy or charcoal background with very high-contrast white text.
- Large header:
  ScheduleMate logo;
  “Main Building – Floor 5 – A Side”;
  current date;
  very large live clock.
- Heading: “Ongoing Lectures & Labs”.
- Large cards across the screen, suitable for TV viewing.
- Each card includes:
  room code prominently;
  Ongoing Now status;
  module code and name;
  lecturer;
  start-end time;
  room type.
- Include example sessions for 5A01, 5A02, and 5A04.
- Add a small footer with “Automatically updates every 30 seconds”.

14. Signage: Upcoming Lectures & Labs
- Same header and design system.
- Heading: “Upcoming Lectures & Labs”.
- Large cards sorted by start time.
- Include an “Upcoming Soon” status badge where relevant.
- Clearly show room code, start time, module, lecturer, and room type.

15. Signage: Cancelled Lectures & Labs
- Same header.
- Heading: “Cancelled Lectures & Labs”.
- Use restrained red status treatment.
- Cards show cancelled session details and original timing.
- Add small footer message: “This slide appears only when cancellations are available.”

16. Signage: Rescheduled Lectures & Labs
- Same header.
- Heading: “Rescheduled Lectures & Labs”.
- Use blue/purple-blue rescheduled treatment.
- Cards present original details with subtle strikethrough and replacement schedule prominently displayed.
- Clearly state “New Time” and “New Room” where applicable.
- Add small footer message: “This slide appears only when rescheduled sessions are available.”

17. Signage: No Ongoing Sessions
- Same location header and live clock.
- Large reassuring message: “No Ongoing Sessions Right Now”.
- Show room availability summary cards such as “8 Rooms Available”.
- Maintain the polished signage layout.

18. Signage: Updating / Offline Fallback
- Same header.
- Large message: “Updating Schedule Information”.
- Show last successful update timestamp.
- Calm neutral visual treatment, no alarming red error design.
- Message: “The latest schedule will appear shortly.”

FRAME ORGANIZATION:
- Create one clearly labeled section: “Admin Management Side – High-Fidelity Screens”.
- Create a separate clearly labeled section: “Digital Signage Side – High-Fidelity Screens”.
- Keep every screen clearly named.
- Do not combine low-fidelity wireframes with these high-fidelity frames.
- Use real UI components, aligned spacing, realistic sample academic data, and consistent status styling.
