---
name: inbox---unread-messages---add-a-filter-unread-messages-only
created: '2026-02-09'
updated: '2026-02-11'
strategy: scenario-based
levels:
  - level: 1
    type: function
    value: ''
    values:
      - only show unread
      - Mark as unread
      - search chat room
      - send message
scope:
  happy_case: 'Normal user flow, user input, All success states/messages are verified'
  corner_case: 'Empty states, more than 20 chat rooms.'
linked_knowledge:
  - inbox
components: []
---

## Mapped Components

