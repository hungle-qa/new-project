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
