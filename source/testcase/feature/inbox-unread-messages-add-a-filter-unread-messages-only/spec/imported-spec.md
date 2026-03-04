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