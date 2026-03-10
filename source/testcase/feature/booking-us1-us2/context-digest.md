---
digest-version: 3
generated: 2026-03-10T08:13:24.714Z
feature: booking-us1-us2
sources:
  - source/testcase/feature/booking-us1-us2/config.md
  - source/testcase/feature/booking-us1-us2/spec/*.md
  - source/testcase/rule/phuong-rule-claude.md
  - source/testcase/template/phuong-temp-claude.json
---

## Config
strategy: (none)
components: (none)
linked_knowledge: (none)

<!-- [FORMAT — Read these rules FIRST before reading the spec] -->

## Template Columns
### ID
Format: US{N}-{N} (e.g., US10-1, US11-5). Sequential within each User Story. Empty for US header rows.

### Test Scenarios
Descriptive test title. Starts with action verb or noun phrase. Max ~80 chars. US header rows use format 'US{N}. {Title}' with no ID.

### Empty
Just keep the column empty.

### Items for Pivot Table
AC traceability. Format: US{N} / AC{N} or US{N} / AC{N}, AC{N} for multi-AC coverage. Links testcase to spec. Prefer multi-AC mapping when workflow spans entry point + field behavior. Every test maps to ALL ACs it verifies.

### Step
Numbered steps: 1. Action\n2. Action\n... Actions use verbs: Navigate, Click, Verify, Type, Enter, Select, Wait, Ensure, Hover, Create. Steps include both actions AND verifications inline. UI elements not wrapped in brackets. Target 5-8 steps. Chain progressive verifications into one test rather than splitting.

### Test Data
Only show input data (not precondition). Free text with specific concrete values (names, dates, times, counts). Use \n for multi-line. Include exact test values, not abstract placeholders.

### Expected
Bullet list starting with '- '. Each bullet is one assertion. Multiple assertions per row allowed. Describes observable outcomes with concrete values matching test data. Typically 4-8 assertions for consolidated tests. Include assertions for ALL mapped ACs.
Full column order: ID, Test Scenarios, Empty, Items for Pivot Table, Step, Test Data, Expected

## Merged Column Order
ID, Test Scenarios, Empty, Items for Pivot Table, Step, Test Data, Expected

## Rules Summary
## Order of Case

- Group by User Story (US10, US11, ...) with a header row per US
- Within each US, follow lifecycle order:
  1. Entry point / navigation
  2. Field input and validation (each field)
  3. Search and selection flows
  4. Edge cases per field (empty results, no data, limits)
  5. Submit / confirm action
  6. Business logic (overlap, past date, status rules)
  7. Cancel / discard flows — mandatory 3 states: no changes→close, changes→discard, changes→stay
- Positive cases before negative/edge cases within each functional group
- UI navigation first, then data input, then validation, then business logic

## Consolidation Strategy

- **MERGE when:**
  - Entry point + defaults in one test (multi-AC: navigation AC + display AC)
  - Progressive field behavior: counter appears → input blocks → all in one test
  - Identical dismiss behavior: Cancel button and X icon do the same thing → one test covers both
  - Edit + apply as one flow (don't split "open edit" from "save edit")
  - Output is the same across inputs (e.g., search valid name + search valid email → same result list → one test with multiple inputs)
  - Same view variant with minor differences (e.g., calendar Day view and Week view share identical behavior → one test covers both)
- **SPLIT when:**
  - Structurally different views (e.g., Day/Week vs Month when Month has distinct display rules)
  - Different outcomes for the same trigger (overlap detected vs no overlap)
  - Different preconditions (new session vs editing existing)
  - Different components (date picker vs time picker vs note field)
- **Step target:** 5-8 steps per test. If only 2-3 steps → likely should merge with a related test. If >10 steps → consider splitting.

## Multi-AC Mapping

- Prefer multi-AC when workflow naturally spans entry point + field behavior
- Format: `US{N} / AC{N}, AC{N}` — list ALL ACs the test verifies
- Never create a test that only verifies defaults without also verifying the entry point
- A single test covering 2-3 ACs is preferred over 3 single-AC tests when the behaviors are sequential

## Boundary Testing Strategy

- Use **representative categories**, not exhaustive enumeration
- For display thresholds with 3+ tiers: test smallest, middle, largest — skip intermediates unless they have distinct behavior
- For character limits: ONE progressive test (counter appears at threshold → input blocks at limit)
- For input methods: keyboard entry = 1 test, picker interaction = separate test, range limits = separate test
- For duration/height display: pick 3 representative values (short, medium, long) — not every possible duration

## Scope

- Happy path: ~60% — standard flows, field inputs, selections, successful operations
- Edge cases: ~25% — empty search, no data states, past dates, overlapping sessions, long text
- Negative cases: ~10% — missing required fields, out-of-range dates, input blocked at limit
- UI/visual: ~5% — color coding, timezone display, responsive height, horizontal stacking
- Every AC must have at least 1 testcase
- Multi-AC testcases explicitly list all covered ACs in Items for Pivot Table
- Cancel/discard: mandatory 3 states (no changes→close, changes→discard, changes→stay)
- Required patterns checklist: close via X icon, long text wrapping, timezone conversion, custom mode e2e, picker + keyboard input tests

## Priority Mapping

- No explicit Priority column — priority implied by ordering
- Critical flows (core booking, viewing) come first in the sequence
- Edge cases and visual checks come later
- If Priority column is added: Critical = data loss/core flow, High = main user flow, Medium = edge cases, Low = visual/cosmetic

## Constraints

- No Tags column used — no tag classification

## Business Rules

- Overlap checking: applied for future sessions only; past sessions skip overlap check
- Session status lifecycle: Scheduled → Completed (past) or Canceled (Early/Late)
- Canceled sessions cannot be edited; show visual indicators (dashed border, strikethrough, 'i' icon for late cancel)
- Timezone-aware: sessions display in coach's current timezone
- Character limits: Note field counter appears at 450 chars, input blocked at 500
- Search debounce: 200ms before triggering
- Calendar views: Day/Week/Month each have distinct display rules for session blocks
- Session block height: calculated as duration/60 of 1-hour slot; sessions ≤15min get fixed 1/4 height
- Unsaved changes: prompt Discard confirmation only when data has been entered

## Strategy Guide
No strategy selected — use default balanced approach.

<!-- [REQUIREMENTS — Generate testcases from this, following the rules above] -->

## Spec Summary
## Permissions / Business Rules
- Trainer role is out of scope in P1.0.
- We don't need to handle hiding the Booking Feature from Trainer role because we intend to only enable Booking feature for WS which only has Owner/Admin in P1.
- We also don't need to consider how Booking feature looks like from the Trainer account for now - will take care later on.

## US1: As an Everfit Admin/Employee, I want to enable or disable the Booking feature for specific workspaces so that I can manage feature access in the first stage

### AC1: Add Booking Toggle to Workspace Features
- Given: I am on the Workspace Detail page in the CMS
- When: I scroll in the "Features" grid section
- Then:
  - I should see a new toggle card labeled "Booking" at the bottom of the grid.

### AC2: Toggle State Change (ON)
- Given: The "Booking" toggle is currently [OFF]
- When: I click the toggle to [ON]
- Then:
  - I can be able to click on the toggle button to turn it ON or OFF
  - The toggle button should be displayed as "ON"
  - The system immediately updates the Workspace configuration and a "Success" toast appears.
  - The "Booking" menu becomes visible to all Coaches in that Workspace.

### AC3: Persisted State on Refresh
- Given: I have changed the toggle state
- When: I refresh the CMS page or navigate away and back
- Then:
  - The toggle should reflect the updated state.

### AC4: Toggle State Change (OFF)
- Given: A workspace had Booking feature turned ON and they had related data
- When: The feature toggle is OFF
- Then:
  - The Booking feature on Coach Web App should be hidden.
  - The WS data in Booking scope should be persisted in our database.

## US2: As a Owner or Admin of a Workspace that has Booking feature enabled, I want to access to Booking feature so that I can use this feature

### AC1: Eligibility & Access Control
- Given: I am a Workspace Owner or Admin and the Booking feature is enabled for my workspace
- When: I am logged into the system
- Then:
  - The system should display the Booking item in the left-side navigation
  - The Booking label should display a "BETA” tag next to it
  - On hover:
    - Should display background highlight
    - Should display the contextual dropdown menu:
      - Calendar
      - Session Type
  - On click:
    - Given I am using a browser where no Booking navigation history has been stored (no relevant browser cookie exists)
    - When I click on the Booking menu in the left navigation
    - Then:
      - The system should navigate me to the Calendar page by default
      - The system should mark Calendar as the active menu item within Booking
      - The system should expand the Booking submenu and visually highlight Calendar
      - The system should store the visited page (Calendar) as the last visited Booking page in a browser cookie
    - Given I am a coach who has previously visited a Booking sub-page And a valid last-visited Booking page is stored in the browser cookie
    - When I click on the Booking menu
    - Then:
      - The system should automatically navigate me to the last visited Booking page
      - The system should expand the Booking submenu
      - The system should visually highlight the restored page as active
  - Page URL:
    - Calendar: /home/booking/calendar?mode=(day|week|month)&start-date=YYYY-MM-DD&end-date=YYYY-MM-DD
    - Session type: / Active tab: app.everfit.io/booking/session-types?tab=active / Archived tab: app.everfit.io/booking/session-types?tab=archived
  - On the bottom of the lefthand side sub menu:
    - Display button “Learn more about Booking"
    - On click:
      - Should open Booking help article page on the new tab (TBD)

### AC2: Disabled / Hidden State
- Given: I am a Workspace Owner/Admin and the Booking feature is not enabled for my workspace
- When: I am logged into the system
- Then:
  - Booking menu navigation item should NOT visible
  - I should NOT be able to access to any pages inside Booking feature via URL

### AC3: Mapping user's terminology for Booking feature
- Given: I am a Workspace Owner or Admin and the Booking feature is enabled for my workspace
- When: I access and use the Booking feature on Coach Web App
- Then:
  - The system should apply the User Terminology settings configured in My Account to all text displayed within the Booking feature
  - Replace all occurrences of the terms "client" and "clients" with the value defined in [Client Terminology]
  - Replace all occurrences of the terms "coach" and "coaches" with the value defined in [Coach Terminology]
  - The system should apply the configured terminology consistently across:
    - Labels
    - Field placeholders
    - Helper text
    - Empty states
    - Tooltips
    - Notifications and messages related to Booking
  - When I update the Client Terminology or Coach Terminology in My Account
  - Then:
    - The system should reflect the updated terminology immediately in the Booking feature without requiring a page reload

## Test Scope

### TESTABLE (generate testcases for these)
- US1: As an Everfit Admin/Employee, I want to enable or disable the Booking feature for specific workspaces so that I can manage feature access in the first stage
  - AC1: Add Booking Toggle to Workspace Features
  - AC2: Toggle State Change (ON)
  - AC3: Persisted State on Refresh
  - AC4: Toggle State Change (OFF)
- US2: As a Owner or Admin of a Workspace that has Booking feature enabled, I want to access to Booking feature so that I can use this feature
  - AC1: Eligibility & Access Control
  - AC2: Disabled / Hidden State
  - AC3: Mapping user's terminology for Booking feature

## Component Knowledge
(no components linked)
