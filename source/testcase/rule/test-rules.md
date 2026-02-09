# Testcase Rules

Default rule definitions for testcase generation. Customize per project needs.

---

## Column Format

All generated testcases MUST use the CSV template columns defined in `source/testcase/template/`. If no template is imported, the default columns are:

| Column | Description | Required |
|--------|-------------|----------|
| ID | Unique testcase identifier (e.g., `LOGIN-TC-001`) | Yes |
| Module | Feature module name | Yes |
| Test Type | Functional, UI, API, Security, Performance | Yes |
| Scope | Unit, Integration, E2E | Yes |
| Title | Short descriptive title | Yes |
| Preconditions | Setup required before execution | Yes |
| Steps | Numbered test steps | Yes |
| Expected Result | Expected outcome | Yes |
| Priority | Critical, High, Medium, Low | Yes |
| Status | Not Executed, Pass, Fail, Blocked | Yes |

---

## Happy Path Criteria

Generate happy path testcases when:
- Each acceptance criterion has at least 1 corresponding testcase
- Normal user flow from start to completion is covered
- All valid input combinations are tested
- All success states/messages are verified

---

## Corner/Edge Case Criteria

Generate edge case testcases for:

### Input Boundaries
- Empty/null values
- Minimum length values
- Maximum length values
- Boundary values (min-1, min, min+1, max-1, max, max+1)

### Data Type Validation
- Wrong data type (string in number field)
- Special characters
- Unicode/emoji characters
- SQL injection patterns
- XSS patterns

### State Transitions
- Loading states
- Error states
- Empty states (no data)
- Timeout scenarios
- Concurrent operations

### Component-Specific
- Use design-system component knowledge from config.md
- Test component variants (hover, focus, disabled, active)
- Test responsive behavior if applicable

---

## Scope Level Definitions

### Unit
- Single component or function behavior
- Isolated from dependencies
- Input -> output verification
- Example: "Button click triggers callback"

### Integration
- Multiple component interaction
- API call + UI response
- Form submission + validation + feedback
- Example: "Login form submits to API and shows success"

### E2E
- Full user journey
- Multi-step workflow
- Cross-page navigation
- Example: "User registers, logs in, completes onboarding"

---

## Priority Mapping

| Priority | Criteria |
|----------|----------|
| **Critical** | Core functionality, data loss risk, security vulnerability |
| **High** | Main user flow, frequent use case, business-critical |
| **Medium** | Secondary flow, edge case with moderate impact |
| **Low** | Cosmetic, rare edge case, nice-to-have validation |

---

## Severity Mapping

| Severity | Description |
|----------|-------------|
| **Blocker** | System unusable, no workaround |
| **Major** | Feature broken, workaround exists |
| **Minor** | Feature works but with issues |
| **Trivial** | Cosmetic issue, no functional impact |
