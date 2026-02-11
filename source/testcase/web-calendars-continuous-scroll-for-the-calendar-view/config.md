---
name: '-web--calendars---continuous-scroll-for-the-calendar-view'
created: '2026-02-09'
updated: '2026-02-09'
levels:
  - level: 1
    type: function
    value: ''
    values:
      - 'New function: scroll'
      - Regression old function
scope:
  happy_case: 'Normal user flow, validate, all success states/messages are verified.'
  corner_case: |-
    Empty states, many data, scroll quickly. 
    - Wrong data type (string in number field)
    - Special characters
    - Unicode/emoji characters
linked_knowledge:
  - client-calendar
components:
  - name: Calendar
    usage: CRUD workout follow the week view.
  - name: MoreOptionsHorizontal
    usage: Action button of workout.
  - name: ItemInCalendar
    usage: This is workout
---

## Mapped Components
- Calendar: CRUD workout follow the week view.
- MoreOptionsHorizontal: Action button of workout.
- ItemInCalendar: This is workout
