---
name: BOOKING
category: product-idea
created: 2026-02-06
status: draft
priority: medium
---

---

# Coach Booking System

---

## 1. Executive Summary

### Vision
The Coach Booking System empowers coaches to efficiently manage their schedules, service offerings, and client bookings, both through the web workspace and mobile app, while providing clients with a seamless self-service booking experience.

### User Persona
- **Role:** Coach/Trainer
- **Need:** Streamline scheduling processes, avoid double-bookings, and offer flexible booking options to clients.
- **Goal:** Efficiently manage their schedule, maximize booking potential, and deliver a seamless experience for clients.

### Core Value
Provides a comprehensive and integrated solution for coaches to manage their schedules, services, and client bookings, leading to increased efficiency, reduced administrative overhead, and improved client satisfaction.

---

## 2. Functional Requirements (User Stories)

### Feature 1: Service Menu Management

**As a** Coach
**I want to** create and manage various 1:1 session types (e.g., Initial Consultation, PT Session)
**So that** I can clearly define my service offerings to clients.

**Acceptance Criteria:**
- Ability to create new session types with descriptions and pricing.
- Ability to edit existing session types.
- Ability to categorize and organize session types.

### Feature 2: Bi-Directional Google Calendar Sync

**As a** Coach
**I want to** sync my Google Calendar with the Coach Booking System
**So that** appointments in my Google Calendar are automatically blocked in the system to prevent double-booking.

**Acceptance Criteria:**
- System automatically imports appointments from Google Calendar.
- "Busy" slots in Google Calendar are reflected as unavailable slots in the Coach Booking System.
- System supports bi-directional sync, meaning changes in one calendar are reflected in the other.

### Feature 3: Client Self-Service Booking

**As a** Coach
**I want to** allow clients to book sessions themselves via the mobile app or web link
**So that** clients can easily schedule appointments without my direct involvement, saving me time and effort.

**Acceptance Criteria:**
- Clients can view available session types and time slots.
- Clients can select a session type and time slot and book the appointment.
- Clients receive confirmation notifications after booking.

---

## 3. User Interface (UI) & Layout

### Structure Breakdown

#### Calendar View

**Purpose:** To provide an overview of the coach's schedule and availability.

**Elements:**
- Day/Week/Month view options
- Time slots for each day
- Appointment details (session type, client name, duration)

**Interactions:**
- Clicking on a time slot to create a new appointment.
- Dragging and dropping appointments to reschedule.
- Clicking on an appointment to view/edit details.

#### Session Settings

**Purpose:** Allows coaches to manage the operational rules for their session types.

**Elements:**
- Booking window input fields
- Modification window input fields
- Automated buffer time selection

**Interactions:**
- Setting the number of days/hours in advance a client can book
- Setting the number of days/hours before start a client can modify
- Selecting automated buffer times between sessions

### Design Language

| Aspect | Specification |
|--------|---------------|
| **Style** | Modern |
| **Tone** | Clean and simple |
| **Primary Colors** | Blue and White |
| **Typography** | Sans-serif |
| **Layout** | Grid-based |
| **Spacing** | Generous whitespace |

---

## 4. Logic & Data Behavior

### Core Entities

#### Entity 1: Session

**Properties:**
- `session_id`: integer - Unique identifier for the session
- `session_type`: string - Type of session (e.g., Initial Consultation, PT Session)
- `coach_id`: integer - ID of the coach associated with the session
- `client_id`: integer - ID of the client associated with the session
- `start_time`: datetime - Date and time the session starts
- `end_time`: datetime - Date and time the session ends
- `status`: string - Status of the session (e.g., Scheduled, Completed, Cancelled)

**Relationships:**
- Belongs to Coach, Belongs to Client

#### Entity 2: Coach

**Properties:**
- `coach_id`: integer - Unique identifier for the coach
- `name`: string - Name of the coach
- `email`: string - Email address of the coach
- `google_calendar_id`: string - Google Calendar ID for syncing

**Relationships:**
- Has many Sessions, Belongs to Team

### Business Logic

#### Rule 1: Double Booking Prevention

**Trigger:** When a new session is created or an existing session is rescheduled.
**Condition:** The requested time slot overlaps with an existing session in the coach's calendar (either from this system or Google Calendar).
**Action:** The system prevents the new session from being created or the existing session from being rescheduled.

**Example:**
- **If:** Coach attempts to schedule a session from 2:00 PM to 3:00 PM on a day when their Google Calendar already has an event from 2:30 PM to 3:30 PM.
- **Then:** The system displays an error message indicating a scheduling conflict.

#### Rule 2: Booking Window Enforcement

**Trigger:** When a client attempts to book a session.
**Condition:** The requested session start time is outside the allowed booking window (defined by the coach).
**Action:** The system prevents the booking and displays an error message to the client.

**Example:**
- **If:** A coach set the booking window to a maximum of 7 days in advance, and a client tries to book a session 10 days from now.
- **Then:** The system displays an error message: "You can only book appointments up to 7 days in advance."

---

## 5. Constraints & Edge Cases

### Strict Rules

| Rule | Description | Impact |
|------|-------------|--------|
| No Double Booking | The system must prevent double-booking of time slots, considering both internal sessions and synced Google Calendar events. | Potential scheduling conflicts, coach unavailability. |
| Booking Window Enforcement | Clients must not be able to book sessions outside the allowed booking window defined by the coach. | Unexpected booking scenarios, incorrect scheduling. |
| Modification Window Enforcement | Clients must not be able to cancel or reschedule within the set modification window. | Disruptions to coach's schedule, late cancellations. |

### Validation Requirements

#### Start Time

- **Type:** Datetime
- **Required:** Yes
- **Constraints:**
  - Must be in the future.
  - Must be within the booking window.
  - Must not overlap with existing appointments.
- **Error Messages:**
  - Invalid Date: "Please select a valid date and time."
  - Time Conflict: "This time slot is already booked. Please select a different time."
  - Outside Booking Window: "This time is outside the allowed booking window. Please select a time within the allowed range."

#### Session Type

- **Type:** String
- **Required:** Yes
- **Constraints:**
  - Must be a valid session type defined by the coach.
- **Error Messages:**
  - Invalid Session Type: "Please select a valid session type."

### Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Google Calendar sync fails | System should continue to function and provide a warning message to the coach. |
| Client cancels a session close to start time (violating modification window) | System displays an error preventing this, and notifies the coach. |
| Multiple clients try to book the same slot simultaneously | The system should allow only one booking to proceed and inform other clients that the slot is no longer available. |
| Coach updates availability while clients are actively booking | Display a real-time update message and stop the process if new conflicts are found |

---

## 6. Export & Integration

### Output Formats

#### Format 1: Session Report (CSV)

- **Type:** CSV
- **Use Case:** For coaches to analyze session data and track client progress.
- **Structure:**
  ```csv
  session_id,session_type,client_name,start_time,end_time,status
  123,PT Session,John Doe,2024-03-15 10:00,2024-03-15 11:00,Completed
  456,Initial Consultation,Jane Smith,2024-03-16 14:00,2024-03-16 15:00,Scheduled
  ```

#### Format 2: Calendar Export (ICS)

- **Type:** ICS
- **Use Case:** For coaches to export their schedule to other calendar applications.
- **Structure:**
  ```ics
  BEGIN:VCALENDAR
  VERSION:2.0
  BEGIN:VEVENT
  UID:123
  SUMMARY:PT Session with John Doe
  DTSTART:20240315T100000Z
  DTEND:20240315T110000Z
  END:VEVENT
  END:VCALENDAR
  ```

### Third-Party Integration Needs

| Integration | Purpose | Data Flow |
|-------------|---------|-----------|
| Google Calendar | Sync coach's calendar to prevent double-booking. | Two-way sync of appointment data. |
| Zoom | Automatically generate meeting links for virtual coaching sessions. | System generates Zoom meeting link and adds it to session details. |
| Google Meet | Automatically generate meeting links for virtual coaching sessions. | System generates Google Meet meeting link and adds it to session details. |

---

## 7. Success Criteria (Definition of Done)

### Must Have (MVP)

1. Ability for coaches to create and manage different session types.
2. Bi-directional Google Calendar sync to prevent double-booking.
3. Ability for coaches to define their working hours and availability.
4. Capability for coaches to book sessions on behalf of clients via the Workspace or Coach App.
5. Client self-service booking via the mobile app or a dedicated web link.

### Should Have (Enhanced)

1. Support for recurring sessions.
2. Native integration with Zoom and Google Meet for virtual coaching.
3. Appointment modification tools to reschedule, cancel, or update session details in real-time.

### Could Have (Future)

1. Batch booking functionality.
2. Team routing logic for multi-coach environments.
3. Support for group dynamics, including attendance counts and waitlists.

### User Testing Scenarios

#### Scenario 1: Schedule Consultation

**Given:** Coach has configured a "Consultation" session type and has synced their Google Calendar.
**When:** Client attempts to book a "Consultation" on a day that is marked as busy in Google Calendar.
**Then:** Client should not be able to book the consultation, and a clear error message should appear to explain that time slot is unavailable

#### Scenario 2: Create Booking

**Given:** Coach needs to create a new booking with a current client.
**When:** Coach creates a new booking within the application.
**Then:** The new booking event is saved in the system, and new event block is added to the calendar view.

#### Scenario 3: Self Service Booking

**Given:** The coach has enabled "Client Self-Service" via a shareable link.
**When:** Client visits the link and chooses a session.
**Then:** Client should be able to successfully schedule a new appointment.

---

## Notes & Considerations

### Open Questions

- How should payment and billing mechanics be integrated in future?
- What level of customization should be provided for the branded web booking interface?
- How should time zones be handled for coaches and clients in different locations?

### Assumptions

- Coaches have a Google Calendar account.
- Clients have access to the mobile app or web link.
- The core focus is on 1:1 sessions, with group sessions being a future enhancement.

### Dependencies

- Access to Google Calendar API.
- Integration with Zoom and Google Meet APIs.
- Stable and reliable internet connection for real-time calendar synchronization.

### Risks & Mitigations

| Risk | Impact | Mitigation Strategy |
|------|--------|---------------------|
| Google Calendar API changes | High | Monitor Google Calendar API updates and proactively adapt the integration. |
| Time zone discrepancies | Medium | Implement robust time zone handling and testing. |
| Security vulnerabilities | High | Conduct regular security audits and penetration testing. |

---

## Revision History

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2026-02-05 | 1.0 | Initial draft | Bard |