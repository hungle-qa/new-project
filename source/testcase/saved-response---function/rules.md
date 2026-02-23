# Testcase Rules

Default rule definitions for testcase generation. Customize per project needs.

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
- **Data Variants:** Use `key=value | key=value` format in the Data Variants column. Reference keys as `{key}` placeholders in Steps. Leave Data Variants empty if the case has no parameterized data.
