---
digest-version: 2
generated: 2026-02-12T11:12:57.212Z
feature: inbox-feb-12
sources:
  - source/testcase/inbox-feb-12/config.md
  - source/testcase/inbox-feb-12/spec/*.md
  - source/testcase/inbox-feb-12/rules.md
  - source/testcase/inbox-feb-12/template.json
  - source/testcase/rule/test-rules.md
  - source/testcase/strategy/spec-driven.md
  - source/feature-knowledge/inbox/config.md
---

## Config
strategy: spec-driven
structure: defined (see below)
components: (none)
linked_knowledge: inbox (5 sections)

<!-- [REQUIREMENTS — Generate testcases from this] -->

## Spec Summary
### US1 - As a user, I want to switch between an "All Chats" view and an "Unread" view, so that I can focus exclusively on pending items when needed.
- **AC1: Switching to Unread View**
  - Given: I am on the main chat dashboard in the "All Chats" view
  - When: I select the "Unread" category filter
  - Then: The UI should transition to the filtered view and display only messages with an "Unread" status.
- **AC2: Switching back to All Chats**
  - Given: I am currently viewing the "Unread" filtered list
  - When: I select the "All Chats" category view
  - Then: The filter should be removed, and I should see all messages (Read and Unread) in chronological order.
### US2 - As a user, I want the "Unread" view to filter out all read messages and only display those with an active unread status.
- **AC1: Filtering logic application**
  - Given: I have a total of 10 messages (7 Read, 3 Unread)
  - When: I apply the "Unread" filter
  - Then: The system should hide the 7 "Read" messages and only the 3 "Unread" messages should be visible in the list.
- **AC2: Empty state for Unread filter**
  - Given: I have no messages with an "Unread" status
  - When: I click on the "Unread" filter
  - Then: The system should display a "No unread messages" empty state or placeholder.
### US3 - As a user, I want the message I am currently reading to remain visible in the "Unread" list, so that I don't lose my place or feel disoriented by the list shifting immediately while I am viewing it.
- **AC1: Opening an unread message (Sticky View)**
  - Given: I am in the "Unread" filter view
  - When: I click on an unread message (Message A)
  - Then: The status of Message A should change to "Read". <br> The Unread Count should decrement by 1. <br> Message A must remain visible in the current list view.
- **AC2: Removing previously read message upon new selection**
  - Given: I am in the "Unread" filter view and have just read Message A (which is still visible)
  - When: I click on a different unread message (Message B)
  - Then: Message A should be immediately removed from the "Unread" list. <br> Message B should now become the active "Read" message but remain visible.
- **AC3: Cleanup upon navigation**
  - Given: I have read a message in the "Unread" view but it is still visible due to the sticky logic
  - When: I navigate away to "All Chats" and then click back into the "Unread" filter
  - Then: The previously read message should no longer be visible in the "Unread" list.

## Test Scope

### TESTABLE (generate testcases for these)
- US1 - As a user, I want to switch between an "All Chats" view and an "Unread" view, so that I can focus exclusively on pending items when needed.
  - AC1: Switching to Unread View
  - AC2: Switching back to All Chats
- US2 - As a user, I want the "Unread" view to filter out all read messages and only display those with an active unread status.
  - AC1: Filtering logic application
  - AC2: Empty state for Unread filter
- US3 - As a user, I want the message I am currently reading to remain visible in the "Unread" list, so that I don't lose my place or feel disoriented by the list shifting immediately while I am viewing it.
  - AC1: Opening an unread message (Sticky View)
  - AC2: Removing previously read message upon new selection
  - AC3: Cleanup upon navigation

### OUT OF SCOPE (in knowledge but NOT in spec — do NOT test)
- I. Overview
- II. Admin Convo Mode
- VII. Mark as Unread / Archive Room
- Terminology
- Summary

### Scope Hints
**Happy Case:** Normal user flows, valid inputs, expected outcomes.
**Corner Case:** Boundary values, invalid inputs, edge cases with moderate impact.

---

## Structure
- US1
  - AC1
  - AC2
- US2
  - AC1
  - AC2
- US3
  - AC1
  - AC2
  - AC3

**RULE:** Structure defined → MUST follow tree, replace Module with Level 1..N, test ONLY leaf nodes. Empty → freestyle.

## Strategy Guide
# Spec-Driven Testing

**Philosophy:** Follow the spec exactly. Every User Story becomes a module, every Acceptance Criteria becomes a test case group, and Given/When/Then maps directly to columns.

## Core Approach

### Structure Mapping

The spec's structure drives the testcase hierarchy:

| Spec Element | Maps To |
|-------------|---------|
| User Story (US) | Level 1 column (top-level module) |
| Acceptance Criteria (AC) | Level 2 column (sub-module under US) |
| Given + When | Steps column (preconditions + action steps) |
| Then | Expected Result column |

### Column Conversion Rules

#### Given + When -> Steps Column

1. **Given** statements become preconditions (setup state before testing)
2. **When** statements become action steps (what the user does)
3. Combine into a single Steps cell:
   - Precondition: {Given text}
   - 1. {When step 1}
   - 2. {When step 2}

#### Then -> Expected Result Column

1. **Then** statements become expected results
2. Each "Then" maps to a SHOULD statement:
   - Then the user sees a success message -> SHOULD display success message
3. Multiple "Then" clauses -> multiple SHOULD lines in one cell

## When to Use

- Specs written in Given/When/Then (BDD/Gherkin) format
- Specs with clearly defined User Stories and Acceptance Criteria
- When 1:1 traceability between spec and testcases is required
- Compliance or audit scenarios where every AC must be covered

## Approach Summary

1. **Parse spec** - Identify all User Stories and Acceptance Criteria
2. **Map structure** - US -> Level 1, AC -> Level 2
3. **Convert Given/When** - Extract preconditions and steps
4. **Convert Then** - Extract expected results as SHOULD statements
5. **Ensure full coverage** - Every AC gets at least one testcase


<!-- [FORMAT — How to write testcases] -->

## Template Columns
- **ID**: ### Numbers like 001.
- **Title**: ### [Action] + [Object] + [Context] (e.g., CLICK Submit Button with Empty Fields).
- **Steps**: ### Use **Step-by-Step** numbering within the "Steps" cell.

### To maintain consistency, use ONLY these verbs for the 'Steps' column:
- **NAVIGATE**: Moving to a URL or main menu.
- **CLICK**: Interaction with buttons, checkboxes, or radio buttons.
- **INPUT**: Typing text into a field.
- **SELECT**: Choosing an option from a dropdown/combobox.
- **VERIFY**: Checking a condition (used in Expected Results).
- **HOVER**: Moving the mouse over an element.

### Wrap all UI elements in **Bold** and [Brackets] (e.g., CLICK **[Submit]** button).
- **Description**: ### This is a keyword to describe the expected (Like: UI, component name, field name, State...). Example: 
* SHOULD show the warning message "xyz...." -> keyword = warning message.
* Hover SHOULD show blue highlight -> keyword = UI.
* SHOULD send the payment successful email -> keyword = Email.
- **Expected Result**: ### Use a bullet within the "Expected" cell.
### Start by SHOULD or SHOULD NOT.
### Must break a new line if there are many expectations.

Full column order: ID, Module, Title, Steps, Description, Expected Result, Priority

## Merged Column Order
ID, Level 1, Level 2, Title, Steps, Description, Expected Result, Priority

## Rules Summary
### Priority Mapping
| Priority | Criteria |
|----------|----------|
| **Critical** | Core functionality, data loss risk |
| **High** | Main user flow, frequent use case, business-critical |
| **Medium** | Secondary flow, edge case with moderate impact |
| **Low** | Cosmetic, rare edge case, nice-to-have validation |

---

### Constraints
- Ensure all terminology matches the terminology that define in the [feature knowledge].
- If a step/component or word is repeated across cases, keep the wording 100% identical.

### Order
SHOULD check UI first, and then the function.
Each component/sub-component SHOULD combine all UI cases in one case.

---

**Platform:** Web app.

<!-- [REFERENCE — Terminology only, do NOT generate testcases from this] -->

## Terminology & Context
(knowledge linked but no extractable terminology found)

## Component Knowledge
(no components linked)
