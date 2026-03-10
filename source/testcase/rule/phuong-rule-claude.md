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