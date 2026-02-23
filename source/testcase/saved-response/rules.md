# Testcase Rules

Default rule definitions for testcase generation. Customize per project needs.

---

## Column Format

All generated testcases MUST use the CSV template columns defined in `source/testcase/template/`. 

---

## Order of case

SHOULD check UI first, and then the function.
Each component/sub-component SHOULD combine all UI cases in one case.

---

## Scope
### Platform: Web app.

### Happy Case
Normal user flows, valid inputs, expected outcomes.

### Corner Case
Boundary values, invalid inputs, edge cases with moderate impact.

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
- **Single-assertion rule:** Each row MUST have exactly one verification in Expected Result. If a scenario has multiple SHOULD statements, split into separate rows (same Steps, different Expected Result per row).
- **Tag assignment:** Every testcase MUST have at least one tag from: `happy`, `corner`, `negative`, `state`, `ui`, `a11y`, `perf`. Multiple tags are comma-separated.
- **Data Variants:** Use `key=value | key=value` format in the Data Variants column. Reference keys as `{key}` placeholders in Steps. Leave Data Variants empty if the case has no parameterized data.
