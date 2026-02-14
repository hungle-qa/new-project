---
generated: 2026-02-12T10:00:00.000Z
feature: inbox-unread-messages-add-a-filter-unread-messages-only
sources:
  - source/testcase/inbox-unread-messages-add-a-filter-unread-messages-only/config.md
  - source/testcase/inbox-unread-messages-add-a-filter-unread-messages-only/rules.md
  - source/testcase/rule/test-rules.md
  - source/testcase/inbox-unread-messages-add-a-filter-unread-messages-only/template.json
  - source/testcase/inbox-unread-messages-add-a-filter-unread-messages-only/spec/*.md
  - source/testcase/strategy/spec-driven.md
  - source/feature-knowledge/inbox/config.md
---

## Config
strategy: spec-driven
structure: defined (see below)
components: (none)
linked_knowledge: inbox

## Structure
- US1
  - AC1
  - AC2...
- US2
  - AC1
  - AC2...
- US3
  - AC1
  - AC2
  - AC3

**CRITICAL STRUCTURE RULE:**
- **Structure defined** -> MUST follow strictly. Replace the template's Module column with Level 1, Level 2 columns (one per tree depth). Write test cases ONLY for leaf nodes. Parent nodes fill Level columns. Each leaf gets detailed test cases.

**Note:** Structure is configured via Testcase Manager > Template tab (Module Structure section).

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

## Template Columns
- **ID**: [Module_Code]-[Sequence] (e.g., AUTH-001).
- **Module**: This is Test Hierarchy. Example:
- Component (page, screen, pop-up) -> Sub component -> Element.
- Scenario -> Case.
- Module -> Function.
- User Story (US) -> Acceptance Criteria (AC).
- **Steps**: ## Use **Step-by-Step** numbering within the "Steps" cell.

## To maintain consistency, use ONLY these verbs for the 'Steps' column:
- **NAVIGATE**: Moving to a URL or main menu.
- **CLICK**: Interaction with buttons, checkboxes, or radio buttons.
- **INPUT**: Typing text into a field.
- **SELECT**: Choosing an option from a dropdown/combobox.
- **VERIFY**: Checking a condition (used in Expected Results).
- **HOVER**: Moving the mouse over an element.

## Wrap all UI elements in **Bold** and [Brackets] (e.g., CLICK **[Submit]** button).
- **Description**: This is a keyword (Like: component name, field name, State...) included in the expected. Example:
* SHOULD show the warning message "xyz...." -> keyword = warning message.
* Hover SHOULD show blue highlight -> keyword = Hover state.
* SHOULD send the payment successful email -> keyword = Email.
- **Expected Result**: Start by SHOULD or SHOULD NOT.
Must break a new line if there are many expectations.
Full column order: ID, Module, Steps, Description, Expected Result, Priority

## Merged Column Order
ID, Level 1, Level 2, Steps, Description, Expected Result, Priority

## Rules Summary
# Testcase Rules

Default rule definitions for testcase generation. Customize per project needs - Inbox

---

## Column Format

All generated testcases MUST use the CSV template columns defined in `source/testcase/template/`. If no template is imported, the default columns are:

| Column | Description | Required |
|--------|-------------|----------|
| ID | Unique testcase identifier (e.g., `LOGIN-TC-001`) | Yes |
| Module | Feature module name | Yes |
| Title | Short descriptive title | Yes |
| Steps | Numbered test steps | Yes |
| Expected Result | Expected outcome | Yes |
| Priority | Critical, High, Medium, Low | Yes |

---

## Priority Mapping

| Priority | Criteria |
|----------|----------|
| **Critical** | Core functionality, data loss risk |
| **High** | Main user flow, frequent use case, business-critical |
| **Medium** | Secondary flow, edge case with moderate impact |
| **Low** | Cosmetic, rare edge case, nice-to-have validation |

---

## CONSTRAINTS
- Ensure all terminology matches the terminology that define in the [feature knowledge].
- If a step/component or word is repeated across cases, keep the wording 100% identical.


## Scope

### Happy Case
Normal user flows, valid inputs, expected outcomes. Make sure all expectations in the spec are covered.

### Corner Case
Empty states, more than 20 chat rooms, check side effect other functions of inbox.


## Feature Knowledge
### inbox
---
name: inbox
created: '2026-02-09'
updated: '2026-02-09'
source_files:
  - EV-Handbook inbox-090226-101139.pdf
prompt: >-
  Keep the original content exactly as-is. Only convert to clean, well-formatted
  markdown that is easy to read. Do not rewrite, or omit any content. SHOULD
  list out Terminology. SHOULD summarize at the end.
---

<!-- source: EV-Handbook inbox-090226-101139.pdf -->

# Handbook Inbox

## I. Overview Feature
## II. Related Documents
*   **Feature Name:** Inbox
*   **Production Item:** N/A
*   **Module / Page:**
*   **Purpose & value of the feature:** An in-app messaging system so you can receive and send replies to your coach instantaneously.
*   **User Roles:** All roles
    *   (Which roles can use it (Owner, Admin, Trainer, Client ...)
*   **Preconditions:** All plans
    *   (Conditions required before using the feature)

**Related Documents Table:**

| Title                                   | Type    | Link                                                                                                               | Confirmation |
| :-------------------------------------- | :------ | :----------------------------------------------------------------------------------------------------------------- | :----------- |
| Spec                                    | Inbox V1 | https://dev.everfit.io/home/inbox/6954f8b1b994e5bab5eb21d3                                                       | N/A          |
| Inbox - Trainer App                     | Figma   |                                                                                                                    | N/A          |
|                                         | Help Article | https://help.everfit.io/en/?q=inbox                                                                                       | N/A          |

## III. Function Details

### UI overview
1.  Change to Admin convo mode.
2.  Open AI setting for auto generate the message.
3.  Broadcast: Send message to many clients.
4.  Create new private chat or group chat.
5.  Left side bar: List room chat.
6.  Middle: Conversation view
    *   a. Header: Client name or group name.
    *   b. Conversation View: store chat history.
    *   c. Chat box and action send:
        *   i. Media
        *   ii. Voice chat
        *   iii. GIF
        *   iv. Saved response
7.  Right panel: View and Edit the client profile (Note) or Group info (Name, Avatar, Search/Add/Remove clients to Group chat).

**Function Details Table:**

| Function                                                                                    | Description                                                                                                                                                                                                                                                                                                                                                            | Note                                                                                                                                                                                                  |
| :------------------------------------------------------------------------------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Admin convo                                                                                 | As an Owner, Admin, or Manager, you want to make sure your team delivers a consistent training quality to your clients during onboarding or customer support. We make it super easy to view your Coaches' inbox and conversations with their clients to help you with quality control. Go to Inbox > Click on the dropdown > Choose the Coach you want to view the inbox | [Admin Inbox: Access to your workspace's inbox \| Everfit Help Center](https://help.everfit.io/en/articles/8483463-admin-inbox-access-to-your-workspace-s-inbox)                                       |
| AI setting (Smart response)                                                                 | Smart Responses help you respond to client messages more efficiently by providing AI-generated draft replies based on the current chat context, giving you full control to review and edit before sending.                                                                                                                                                                | [Smart Response (Beta Testing) \| Everfit Help Center](https://help.everfit.io/en/articles/8193308-smart-response-beta-testing)                                                                      |
| **1/ How Smart Responses Work**                                                             |                                                                                                                                                                                                                                                                                                                                                                       |                                                                                                                                                                                                      |
| Smart Responses can be generated in several situations:                                     |                                                                                                                                                                                                                                                                                                                                                                       |                                                                                                                                                                                                      |
| *   Scenario 1: For New (Unopened) Conversations*                                           |                                                                                                                                                                                                                                                                                                                                                                       |                                                                                                                                                                                                      |
| 1.  Auto-Generate: Smart Response creates a draft reply as soon as a message arrives.       |                                                                                                                                                                                                                                                                                                                                                                       |                                                                                                                                                                                                      |
| 2.  Notification: A "Draft" badge appears in your Inbox list.                               |                                                                                                                                                                                                                                                                                                                                                                       |                                                                                                                                                                                                      |
| 3.  Auto-Fill: Open the conversation to see the AI draft already filled in the chat box, ready to edit or send. |                                                                                                                                                                                                                                                                                                                                                                       |                                                                                                                                                                                                      |
| *   Scenario 2: While Actively Chatting*                                                    |                                                                                                                                                                                                                                                                                                                                                                       |                                                                                                                                                                                                      |
| 1.  Trigger: Smart Response drafts a reply for the first incoming message of an active session. |                                                                                                                                                                                                                                                                                                                                                                       |                                                                                                                                                                                                      |
| 2.  Suggestion: The draft appears as a preview above the chat box.                          |                                                                                                                                                                                                                                                                                                                                                                       |                                                                                                                                                                                                      |
| 3.  Apply: Click the draft to move it into the chat box and clear the suggestion.            |                                                                                                                                                                                                                                                                                                                                                                       |                                                                                                                                                                                                      |
| **2/ Manually Generate a Smart Response**                                                    |                                                                                                                                                                                                                                                                                                                                                                       |                                                                                                                                                                                                      |
| You can generate a Smart Response anytime for any text message from a client.               |                                                                                                                                                                                                                                                                                                                                                                       |                                                                                                                                                                                                      |
| *   Web app*                                                                                |                                                                                                                                                                                                                                                                                                                                                                       |                                                                                                                                                                                                      |
| 1.  Hover over a clientʼs text message                                                       |                                                                                                                                                                                                                                                                                                                                                                       |                                                                                                                                                                                                      |
| 2.  Click Reply with AI                                                                     |                                                                                                                                                                                                                                                                                                                                                                       |                                                                                                                                                                                                      |
| 3.  Wait for the draft to appear                                                            |                                                                                                                                                                                                                                                                                                                                                                       |                                                                                                                                                                                                      |
| 4.  Click the generated draft to insert it into the chat box, where itʼs ready for you to review, edit, and send |                                                                                                                                                                                                                                                                                                                                                                       |                                                                                                                                                                                                      |
| *   Mobile app*                                                                             |                                                                                                                                                                                                                                                                                                                                                                       |                                                                                                                                                                                                      |
| 1.  Long-press a client message                                                              |                                                                                                                                                                                                                                                                                                                                                                       |                                                                                                                                                                                                      |
| 2.  Tap Reply with AI                                                                       |                                                                                                                                                                                                                                                                                                                                                                       |                                                                                                                                                                                                      |
| 3.  Wait for the draft to generate                                                          |                                                                                                                                                                                                                                                                                                                                                                       |                                                                                                                                                                                                      |
| 4.  Tap the draft to insert it into the message box                                         |                                                                                                                                                                                                                                                                                                                                                                       |                                                                                                                                                                                                      |
| 5.  Review, edit, and send                                                                 |                                                                                                                                                                                                                                                                                                                                                                       |                                                                                                                                                                                                      |
| BroadCast                                                                                   | The broadcast message feature is exclusively available to Studio plan users, allowing coaches to effortlessly send messages to multiple clients simultaneously.                                                                                                                                                                                                         | [Inbox: Broadcast Messages \| Everfit Help Center](https://help.everfit.io/en/articles/7858992-inbox-broadcast-messages) This functionality is accessible only with the Studio plan.                 |
| Create new chat - Group chat                                                                | The group chat functionality is specifically offered to all Studio plan users, enabling coaches and clients to maintain seamless communication and participate in real-time discussions on both web and mobile app interfaces.                                                                                                                                         | [Group Messaging \| Everfit Help Center](https://help.everfit.io/en/articles/7819230-group-messaging) Available on Studio plans only                                                                  |
| Reply message                                                                               | On Web app: Hover over the message you want to respond to for the 'Reply' option to appear On mobile app: Select the message you want to respond to and either swipe left or press hold for the 'Reply' option to appear                                                                                                                                                 | [How to Reply to Inbox Messages \| Everfit Help Center](https://help.everfit.io/en/articles/5698383-how-to-reply-to-inbox-messages)                                                                |
| Mark as unread Archive room                                                                 | If you would like to remind yourself to check back on a conversation, click on the "..." button and select Mark as unread either in the list of conversations, or the button at the top right corner of the selected conversation. You can archive a chat by clicking on the "..." button at the top right corner. Once a conversation is archived, you can always use the Compose option to look for the client and start chatting with them again. | [Private Messaging \| Everfit Help Center](https://help.everfit.io/en/articles/5698374-private-messaging)                                                                                       |
| Voice chat                                                                                  | On web: you can click on the microphone icon to send voice messages to clients from the web app. On mobile: From the Inbox of the coach app, you will see the microphone icon to send your client a voice message.                                                                                                                                                   | [How to Send Voice Messages \| Everfit Help Center](https://help.everfit.io/en/articles/5698438-how-to-send-voice-messages) Turn off Voice Messages for specific clients Voice chat is enabled for all your clients by default. If you want to turn it off, you can head to the client's settings page on the web and uncheck the "Allow client to send voice messages" option under "Messages". |
| Save response                                                                               | This feature helps coaches save frequently used messages and quickly reuse them in chats. Instead of typing the same replies over and over, you can insert a saved message with just a click or shortcut - saving time and keeping your communication consistent.                                                                                                     | [Saved Responses \| Everfit Help Center](https://help.everfit.io/en/articles/5698442-saved-responses) This feature is available on the Pro plan and above.                                       |
| *   Web app*                                                                                |                                                                                                                                                                                                                                                                                                                                                                       |                                                                                                                                                                                                      |
| 1.  Open a conversation in the Inbox                                                        |                                                                                                                                                                                                                                                                                                                                                                       |                                                                                                                                                                                                      |
| 2.  Click the Saved Responses button (or use the shortcut)                                  |                                                                                                                                                                                                                                                                                                                                                                       |                                                                                                                                                                                                      |
| 3.  Select a saved response from the list                                                    |                                                                                                                                                                                                                                                                                                                                                                       |                                                                                                                                                                                                      |
| 4.  The full message will be inserted into your chat box, after any existing text           |                                                                                                                                                                                                                                                                                                                                                                       |                                                                                                                                                                                                      |
| 5.  Edit the message if needed, then send                                                  |                                                                                                                                                                                                                                                                                                                                                                       |                                                                                                                                                                                                      |
| *   Mobile app*                                                                             |                                                                                                                                                                                                                                                                                                                                                                       |                                                                                                                                                                                                      |
| 1.  Open a conversation in the Inbox                                                        |                                                                                                                                                                                                                                                                                                                                                                       |                                                                                                                                                                                                      |
| 2.  Tap the Saved Responses icon in the chat input                                          |                                                                                                                                                                                                                                                                                                                                                                       |                                                                                                                                                                                                      |
| 3.  Search or scroll to find the response you want                                          |                                                                                                                                                                                                                                                                                                                                                                       |                                                                                                                                                                                                      |
| 4.  Tap the response to insert it into the message field                                   |                                                                                                                                                                                                                                                                                                                                                                       |                                                                                                                                                                                                      |
| 5.  Edit if needed, then send                                                              |                                                                                                                                                                                                                                                                                                                                                                       |                                                                                                                                                                                                      |

## IV. Hard-to-remember Logic / Confusing Logic / Known Issues
## V. Guide for Difficult Test Cases
## VI. Test Accounts (Special Accounts)

**Test Accounts Table:**

| Email                      | Role (Owner, Admin, Trainer, Client...) | What scenarios this account is used for |
| :------------------------- | :-------------------------------------- | :---------------------------------------- |
| hungle+a1@everfit.io       | Owner                                 | Can chat with all clients.                |
| hungle+ada1@everfit.io     | Admin                                 | Can chat with all clients.                |
| hungle+tra1@everfit.io     | Trainer                               | Don't allow chat with other coaches' clients. |

## VII. Cheat logic (N/A)
## VIII. cURL command (N/A)
## IX. Need to update system document (upcoming)

**Notifications:**

| Type                | Document | Link | Status |
| :------------------ | :------- | :--- | :----- |
| Push notification on the mobile | N/A      |      |        |
| In-app notification         | N/A      |      |        |
| Notification center       | N/A      |      |        |

**Type Documents**

| Type|Document|Link|Status|
|:---|:---|:---|:---|
|Main feature|[Update client] section in the client overview|N/A|No|
|Main feature|How to Archive a client|N/A|In-progress|
|Main feature|How to assign/remove the client to the asset (Autoflow, program, studio program, Resource collection, workout collection, recipe book, onboarding flow...)|N/A|Done|
|App integration|Handbook app integration|||
|Landing page|Handbook landing page|||
|Multiple workspace|Handbook Multiple workspace|||
|Billing|Handbook Billing|||
|Payment|Handbook Payment|||

## Terminology

*   **Inbox:** An in-app messaging system for instant communication with coaches.
*   **Smart Responses:** AI-generated draft replies to client messages.
*   **Broadcast Message:** Sending messages to multiple clients simultaneously (Studio plan only).
*   **Group Chat:** Real-time discussions between coaches and clients (Studio plan only).
*   **Saved Responses:** Pre-written messages for quick reuse in chats (Pro plan and above).

## Summary

This document details the Inbox feature within the Everfit platform, covering its purpose, user roles, related documents, and functional specifics. It includes information on admin conversation mode, AI-powered smart replies, broadcast messaging, group chats, message replies, voice chat, and saving responses. Additionally, it provides test accounts and highlights areas needing system documentation updates.


## Spec Summary
# Feature Specification

## Overview

This document outlines the feature specification for adding an "Unread" filter to the Inbox, allowing users to easily focus on pending items. This feature addresses the issue of important conversations being "buried" due to chronological sorting.

**Document Status:** IN-PROGRESS
**Document Owner:** @Trang Doan
**Epic:** PLAN-1209: Inbox | Unread Messages | Add a filter unread messages only

## Objectives

*   Ensure important conversations remain visible and are not buried by chronological sorting.
*   Enable users to filter chats by categories such as All chats and Unread for efficient follow-up.
*   Improve focus and response efficiency for critical client conversations.

## Related Documents

*   Web + App Design (Figma)
*   Workflow - Link

## User Flows

**1. Switching to Unread View:**

*   User starts on the main chat dashboard in the "All Chats" view.
*   User selects the "Unread" category filter.
*   The UI transitions to the filtered view, displaying only messages with an "Unread" status.

**2. Switching back to All Chats:**

*   User is currently viewing the "Unread" filtered list.
*   User selects the "All Chats" category view.
*   The filter is removed, and the user sees all messages (Read and Unread) in chronological order.

**3. Interacting with Messages in Unread View:**

*   User is in the "Unread" filter view.
*   User clicks on an unread message (Message A).
*   The status of Message A changes to "Read".
*   The Unread Count decrements by 1.
*   Message A remains visible in the current list view (sticky view).
*   User clicks on a different unread message (Message B).
*   Message A is immediately removed from the "Unread" list.
*   Message B becomes the active "Read" message but remains visible.
*   User navigates away to "All Chats" and then clicks back into the "Unread" filter.
*   The previously read message is no longer visible in the "Unread" list.

## Requirements

**Functional Requirements:**

*   The system shall provide a filter option to switch between "All Chats" and "Unread" views.
*   The "Unread" view shall display only messages with an active unread status.
*   When the "Unread" filter is applied, the system must hide "Read" messages from the inbox view.
*   If there are no unread messages, the "Unread" view shall display a "No unread messages" empty state or placeholder.
*   When an unread message is opened in the "Unread" view, it should initially remain visible (sticky view) even after its status changes to "Read."
*   After reading one message in the "Unread" view and selecting another, the previously read message should be removed from the list.
*   Upon navigating away from the "Unread" view (e.g., switching to "All Chats") and then returning, previously read messages should no longer be visible in the "Unread" list.
*   The Unread Count (if displayed) should decrement by 1 when an unread message is opened.

**Non-Functional Requirements:**

*   The transition between "All Chats" and "Unread" views should be seamless and responsive.
*   Filtering logic should be efficient to avoid performance issues, especially with a large number of messages.
*   The UI should be intuitive and easy to use.

## Acceptance Criteria

**US1: As a user, I want to switch between an "All Chats" view and an "Unread" view, so that I can focus exclusively on pending items when needed.**

| AC # | Description                      | Given                                                        | When                                            | Then                                                                                            |
|------|----------------------------------|--------------------------------------------------------------|-------------------------------------------------|-------------------------------------------------------------------------------------------------|
| AC1  | Switching to Unread View         | I am on the main chat dashboard in the "All Chats" view      | I select the "Unread" category filter           | The UI should transition to the filtered view and display only messages with an "Unread" status. |
| AC2  | Switching back to All Chats      | I am currently viewing the "Unread" filtered list            | I select the "All Chats" category view         | The filter should be removed, and I should see all messages (Read and Unread) in chronological order. |

**US2: As a user, I want the "Unread" view to filter out all read messages and only display those with an active unread status.**

| AC # | Description                  | Given                                               | When                      | Then                                                                           |
|------|------------------------------|-----------------------------------------------------|---------------------------|--------------------------------------------------------------------------------|
| AC1  | Filtering logic application  | I have a total of 10 messages (7 Read, 3 Unread)    | I apply the "Unread" filter | The system should hide the 7 "Read" messages and only the 3 "Unread" messages should be visible in the list. |
| AC2  | Empty state for Unread filter | I have no messages with an "Unread" status         | I click on the "Unread" filter | The system should display a "No unread messages" empty state or placeholder.       |

**US3: As a user, I want the message I am currently reading to remain visible in the "Unread" list, so that I don't lose my place or feel disoriented by the list shifting immediately while I am viewing it.**

| AC # | Description                       | Given                                                   | When                                                     | Then                                                                                                                                                                                                                                |
|------|-----------------------------------|---------------------------------------------------------|----------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| AC1  | Opening an unread message (Sticky View) | I am in the "Unread" filter view                     | I click on an unread message (Message A)                | The status of Message A should change to "Read". The Unread Count should decrement by 1. Message A must remain visible in the current list view.                                                                                |
| AC2  | Removing previously read message upon new selection | I am in the "Unread" filter view and have just read Message A (which is still visible) | I click on a different unread message (Message B)        | Message A should be immediately removed from the "Unread" list. Message B should now become the active "Read" message but remain visible.                                                                     |
| AC3  | Cleanup upon navigation             | I have read a message in the "Unread" view but it is still visible due to the sticky logic | I navigate away to "All Chats" and then click back into the "Unread" filter | The previously read message should no longer be visible in the "Unread" list.                                                                                                                                   |
