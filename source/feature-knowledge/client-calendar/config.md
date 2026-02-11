---
name: client-calendar
created: '2026-02-09'
updated: '2026-02-09'
source_files:
  - Client calendar.pdf
prompt: >-
  Keep the original content exactly as-is. Only convert to clean, well-formatted
  markdown that is easy to read. Do not rewrite, or omit any content. SHOULD
  list out Terminology. SHOULD summarize at the end.
---

<!-- source: Client calendar.pdf -->

# Core System Overview

*   **Purpose:** Centralized hub for scheduling, assigning, and tracking workout programs and single sessions. Facilitates the interaction between Coach programming and Client execution.
*   **Primary User Personas:**
    *   **Coaches:** Assign workouts/programs to specific dates, customize schedules (drag/drop), and monitor completion status (Completed/Missed).
    *   **Clients:** View daily assignments via mobile app, execute workouts (logging sets/reps), and track history.

# System Constraints & Global Rules

*   **Modification Rules:**
    *   **Library Isolation:** Editing a Section/Workout in the Library does **not** update workouts already assigned to a calendar; it only affects future assignments.
    *   **Hiding:** Coaches can Hide workouts to pre-schedule content without client visibility.

# Key Workflows & Logic

1.  **Assigning Content (Web)**
    *   **Step 1:** Navigate to `Client Profile` → `Training Tab` OR click Dumbbell icon.
    *   **Step 2:** Click **+ icon** on a specific day.
    *   **Step 3:** Select **Add Workout** (single) or **Add Program** (multi-day sequence).
    *   **Step 4 (Optional):** Click `+ Create New` to build a workout on the fly (option to "Save to Library" available).
    *   **Output:** Workout appears on the specific date; Client sees it in "Today" view.

2.  **Calendar Customization (Web)**
    *   **Step 1:** Select view duration (1 week, 2 weeks, 4 weeks).
    *   **Step 2:** Use **Drag and Drop** to reschedule workouts.
    *   **Step 3:** Use **Copy and Paste** to duplicate workouts to new dates.

3.  **Client Execution (App)**
    *   **Step 1:** Open `Today` screen.
    *   **Step 2:** Tap **Start Workout** on the assigned card.
    *   **Step 3:** Input data (Weight/Reps/Time) per set. (Note: **Freestyle** sections require no data entry).
    *   **Step 4:** Tap **Mark All** or check off individual sets to complete.
    *   **Output:** Workout marked as "Completed"; data syncs to **Workout History**.

# Data Entities & Relationships

*   **Calendar Entry:** A specific instance of a Workout assigned to a Date. Can be status **Completed** or **Missed**.
*   **Program:** A container of multiple workouts spanning days/weeks, assigned in a single click.

# Edge Cases & Error Handling

*   **Library Updates vs. Assigned:** Changes to a "Master" workout in the library do not propagate to calendars. The workout must be deleted and re-assigned to reflect library changes.

# Technical References

*   **Coach Entry Points:**
    *   `Client Name > Dumbbell Icon`.
    *   `Client Profile > Training Tab`.
    *   `Training Tab > History Button`.
*   **Client App Entry Points:**
    *   `Today > Start Workout`.
    *   `Coaching > Training`.
    *   `You > Activity history`.

# Terminology
*   **Workout:** A single exercise routine or session.
*   **Program:** A sequence of workouts scheduled over multiple days or weeks.
*   **Section:** A component or part of a workout.
*   **Library:** A repository of workouts and programs that can be assigned to clients.
*   **Calendar Entry:** An instance of a workout assigned to a specific date on a client's training calendar.
*   **Freestyle:** A type of workout section that does not require specific data entry for sets and reps.
*   **Coach:** A user who creates and assigns workouts and programs to clients.
*   **Client:** A user who receives and executes workouts assigned by a coach.
*   **Today:** The current date, often used as a view in the client app to show the assigned workout for the day.
*   **Completed:** The status of a calendar entry or workout that has been finished by the client.
*   **Missed:** The status of a calendar entry or workout that was not completed by the client.

In summary, this document outlines the core functionality of a workout scheduling and tracking system, detailing user roles, workflows, data entities, and technical references. It covers how coaches assign content and customize schedules, and how clients execute workouts and track their progress. The document also highlights important constraints and edge cases, such as the isolation of library updates and the ability to hide workouts from client view.
