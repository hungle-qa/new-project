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
