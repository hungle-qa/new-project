# Skill: WRITE

**Purpose:** Generate testcases from spec + template + rules + component knowledge.

**Trigger:** `write` keyword + feature-name

---

## Prerequisites

- Template exists in `source/testcase/template/` (run `/testcase init` first)
- Spec exists at `source/testcase/{feature-name}/spec/` (run `/testcase import-spec` first)
- Rules exist at `source/testcase/rule/test-rules.md` (run `/testcase init` first)

---

## Steps

### Step 1: Validate Prerequisites

1. Check template exists in `source/testcase/template/` -> If not: "No template found. Run `/testcase init` first."
2. Check spec exists at `source/testcase/{feature-name}/spec/{feature-name}-spec.md` -> If not: "No spec found. Run `/testcase import-spec {feature-name}` first."
3. Check rules exist at `source/testcase/rule/test-rules.md` -> If not: "No rules found. Run `/testcase init` first."

### Step 2: Read All Context

Read files in this order:
1. **Rules**: `source/testcase/rule/test-rules.md`
2. **Template**: CSV file(s) from `source/testcase/template/`
3. **Spec**: `source/testcase/{feature-name}/spec/{feature-name}-spec.md`
4. **Config**: `source/testcase/{feature-name}/config.md`
5. **Mapped components**: For each component in config, read from `source/design-system/{ComponentName}.md`

### Step 3: Generate Testcase Matrix

Generate testcases covering:

**Happy path cases** (from acceptance criteria):
- Each acceptance criterion -> at least 1 happy path testcase
- Normal user flow from start to completion
- All valid input combinations

**Corner/edge cases** (from rules definition):
- Boundary values (min, max, empty, null)
- Invalid inputs (wrong type, format, length)
- State transitions (loading, error, success)
- Component-specific edge cases (from design-system knowledge)

**Scope levels** (from rules):
- Unit: Individual component behavior
- Integration: Component interactions
- E2E: Full user flow

### Step 4: Format as CSV

1. Read template column structure
2. Map each testcase to template columns EXACTLY
3. Generate unique IDs per testcase (e.g., `{FEATURE}-TC-001`)
4. Assign priority based on rules priority mapping
5. Set initial status to "Not Executed"

### Step 5: Preview and Approve

1. Show preview: first 5-10 rows of generated CSV
2. Show total count: "Generated {N} testcases ({X} happy path, {Y} edge cases)"
3. Show breakdown by scope: "{A} unit, {B} integration, {C} e2e"
4. Use AskUserQuestion: "Approve testcase generation?"
   - Option A: "Approve and write"
   - Option B: "Modify (specify changes)"
   - Option C: "Cancel"

### Step 6: Write CSV

1. Write to `source/testcase/{feature-name}/result/{feature-name}-testcase.csv`
2. Confirm file written with path and testcase count

---

## Validation

| Check | Condition |
|-------|-----------|
| Prerequisites met | Template, spec, rules all exist |
| All context loaded | Rules, template, spec, config, components read |
| CSV format correct | Columns match template exactly |
| Coverage complete | Happy path + edge cases + all scope levels |
| User approved | AskUserQuestion confirmation received |
| File written | CSV exists at expected path |

---

## Error Handling

| Error | Response |
|-------|----------|
| Missing template | "No template found. Run `/testcase init` first." |
| Missing spec | "No spec found for '{feature}'. Run `/testcase import-spec {feature}` first." |
| Missing rules | "No rules found. Run `/testcase init` first." |
| Component not found | "Design-system component '{name}' not found. Proceeding without component knowledge." |
| Testcase file exists | Ask user: "Testcases already exist. Overwrite or use `/testcase update`?" |
