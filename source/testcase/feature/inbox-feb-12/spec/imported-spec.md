### Acceptance Criteria

**US1 - As a user, I want to switch between an "All Chats" view and an "Unread" view, so that I can focus exclusively on pending items when needed.**

| AC ID | Description | Given | When | Then |
|-------|-------------|-------|------|------|
| AC1 | Switching to Unread View | I am on the main chat dashboard in the "All Chats" view | I select the "Unread" category filter | The UI should transition to the filtered view and display only messages with an "Unread" status. |
| AC2 | Switching back to All Chats | I am currently viewing the "Unread" filtered list | I select the "All Chats" category view | The filter should be removed, and I should see all messages (Read and Unread) in chronological order. |

**US2 - As a user, I want the "Unread" view to filter out all read messages and only display those with an active unread status.**

| AC ID | Description | Given | When | Then |
|-------|-------------|-------|------|------|
| AC1 | Filtering logic application | I have a total of 10 messages (7 Read, 3 Unread) | I apply the "Unread" filter | The system should hide the 7 "Read" messages and only the 3 "Unread" messages should be visible in the list. |
| AC2 | Empty state for Unread filter | I have no messages with an "Unread" status | I click on the "Unread" filter | The system should display a "No unread messages" empty state or placeholder. |

**US3 - As a user, I want the message I am currently reading to remain visible in the "Unread" list, so that I don't lose my place or feel disoriented by the list shifting immediately while I am viewing it.**

| AC ID | Description | Given | When | Then |
|-------|-------------|-------|------|------|
| AC1 | Opening an unread message (Sticky View) | I am in the "Unread" filter view | I click on an unread message (Message A) | The status of Message A should change to "Read". <br> The Unread Count should decrement by 1. <br> Message A must remain visible in the current list view. |
| AC2 | Removing previously read message upon new selection | I am in the "Unread" filter view and have just read Message A (which is still visible) | I click on a different unread message (Message B) | Message A should be immediately removed from the "Unread" list. <br> Message B should now become the active "Read" message but remain visible. |
| AC3 | Cleanup upon navigation | I have read a message in the "Unread" view but it is still visible due to the sticky logic | I navigate away to "All Chats" and then click back into the "Unread" filter | The previously read message should no longer be visible in the "Unread" list. |

### Requirements

| REQ-ID | Description | User Story |
|--------|-------------|------------|
| REQ-1 | User can switch between "All Chats" and "Unread" views. | US1 |
| REQ-2 | "Unread" view filters messages to only show those with an unread status. | US2 |
| REQ-3 | "Unread" view shows an empty state when no unread messages exist. | US2 |
| REQ-4 | The message currently being read remains visible in the "Unread" list. | US3 |
| REQ-5 | When a new message is selected, the previously read message is removed from the "Unread" list. | US3 |
| REQ-6 | Navigating away and back to "Unread" view removes previously read messages. | US3 |