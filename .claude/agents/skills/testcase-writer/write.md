# Skill: WRITE

**Purpose:** Generate testcases from spec + template + rules + component knowledge + feature knowledge.

**Trigger:** `write` keyword + feature-name

---

## Prerequisites

- Spec exists at `source/testcase/{feature-name}/spec/` (import spec via the Web UI first)
- Rules exist at `source/testcase/rule/test-rules.md`
- Template: JSON file at `source/testcase/template/template.json` OR fallback to column definitions in rules

---

## Steps

### Step 1: Validate Prerequisites

1. Check spec exists: Glob `source/testcase/{feature-name}/spec/*.md` -> If no files found: "No spec found for '{feature-name}'. Import a spec via the Web UI first."
2. Check rules exist at `source/testcase/rule/test-rules.md` -> If not: "No rules found. Add rules to `source/testcase/rule/test-rules.md`."
3. Check template: Read `source/testcase/template/template.json` -> If not found: use column definitions from rules file as fallback (see "Column Format" section in rules).

### Step 2: Read All Context

**IMPORTANT:** Show progress messages to the user at each step so they know AI is working.

Read files in this order:

1. **Config**: `source/testcase/{feature-name}/config.md` — parse YAML frontmatter for:
   - `levels` — component hierarchy for module assignment
   - `scope.happy_case` — user-defined happy path guidance
   - `scope.corner_case` — user-defined edge case guidance
   - `components` — mapped design-system components
   - `knowledge_files` — uploaded knowledge files
   - `linked_knowledge` — linked Feature Knowledge items
   > Progress: "Reading feature config..."

2. **Feature Knowledge** (from config `linked_knowledge`): For each entry, read from `source/feature-knowledge/{name}/config.md`. This provides domain context and should be read FIRST before rules/spec.
   > Progress: "Reading linked feature knowledge ({N} items)..."

3. **Knowledge files** (from config `knowledge_files`): For each entry, read from `source/testcase/{feature-name}/knowledge/{filename}`. If file not found, log warning and continue.
   > Progress: "Reading uploaded knowledge files..."

4. **Rules**: `source/testcase/rule/test-rules.md`
   > Progress: "Reading testcase rules..."

5. **Template**: Read `source/testcase/template/template.json` (JSON array of column objects with `id`, `name`, `width`, `style`, `writingStyle`). If not found, use rules column definitions as fallback.
   > Progress: "Reading testcase template..."

6. **Spec**: All `.md` files from `source/testcase/{feature-name}/spec/`
   > Progress: "Reading feature spec..."

7. **Mapped components**: For each component in config `components`, read from `source/design-system/{ComponentName}.md`
   > Progress: "Reading design-system components ({N} components)..."

> Progress: "All context loaded. Generating testcases..."

### Step 3: Generate 5 Example Testcases for Review

**Before generating the full testcase set, create 5 representative example testcases for user review.**

> Progress: "Generating 5 example testcases for your review..."

Generate 5 testcases that represent the variety of the full set:
- 2 happy path cases (from spec acceptance criteria + config `scope.happy_case`)
- 2 corner/edge cases (from rules + config `scope.corner_case`)
- 1 integration or E2E case

Use the template column structure (from `template.json` or rules fallback) to format them.

**Show the 5 examples to the user** as a formatted table and ask:
- Use AskUserQuestion: "Here are 5 example testcases. Review them before I generate the full set."
  - Option A: "Approve style - generate full set"
  - Option B: "Adjust (specify changes to style/format/coverage)"
  - Option C: "Cancel"

If user selects "Adjust", apply their feedback and regenerate 5 examples. Repeat until approved.

### Step 4: Generate Full Testcase Matrix

> Progress: "Generating full testcase set..."

Generate testcases using ALL loaded context:

**Happy path cases** (from spec acceptance criteria + config `scope.happy_case`):
- Each acceptance criterion -> at least 1 happy path testcase
- Normal user flow from start to completion
- All valid input combinations
- Apply user-defined happy case hints from config

**Corner/edge cases** (from rules + config `scope.corner_case`):
- Boundary values (min, max, empty, null)
- Invalid inputs (wrong type, format, length)
- State transitions (loading, error, success)
- Component-specific edge cases (from design-system knowledge)
- Apply user-defined corner case hints from config

**Module assignment** (from config `levels`):
- Use `levels` hierarchy to assign Module column values
- Level 1 = top-level component, Level 2 = sub-component, Level 3 = function

**Scope levels** (from rules):
- Unit: Individual component behavior
- Integration: Component interactions
- E2E: Full user flow

**Writing style** (from template `writingStyle` field):
- Each column has a `writingStyle` instruction — follow it precisely when writing cell content

### Step 5: Format as CSV

1. Use template column structure from `template.json` (or rules fallback columns)
2. Map each testcase to columns EXACTLY, following each column's `writingStyle` instruction
3. Generate unique IDs per testcase (e.g., `{FEATURE}-TC-001`)
4. Assign priority based on rules priority mapping
5. Set initial status to "Not Executed"

### Step 6: Preview and Approve

> Progress: "Generation complete. Preparing preview..."

1. Show preview: first 10 rows of generated CSV
2. Show total count: "Generated {N} testcases ({X} happy path, {Y} edge cases)"
3. Show breakdown by scope: "{A} unit, {B} integration, {C} e2e"
4. Use AskUserQuestion: "Approve testcase generation?"
   - Option A: "Approve and write"
   - Option B: "Modify (specify changes)"
   - Option C: "Cancel"

### Step 7: Write CSV

> Progress: "Writing testcase CSV file..."

1. Write to `source/testcase/{feature-name}/result/{feature-name}-testcase.csv`
2. Confirm file written with path and testcase count

> Progress: "Done! {N} testcases written to {path}"

---

## Validation

| Check | Condition |
|-------|-----------|
| Prerequisites met | Spec and rules exist; template loaded or fallback used |
| All context loaded | Config, feature knowledge, knowledge files, rules, template, spec, components read |
| 5-example review | User approved example testcases before full generation |
| CSV format correct | Columns match template.json (or rules fallback) exactly |
| Writing style applied | Each column follows its `writingStyle` instruction |
| Coverage complete | Happy path + edge cases + all scope levels |
| User approved | AskUserQuestion confirmation received |
| File written | CSV exists at expected path |

---

## Error Handling

| Error | Response |
|-------|----------|
| Missing spec | "No spec found for '{feature}'. Import a spec via the Web UI first." |
| Missing rules | "No rules found. Add rules to `source/testcase/rule/test-rules.md`." |
| No template (not error) | Use rules column definitions as fallback. Log: "No template.json found, using rules column format." |
| Component not found | "Design-system component '{name}' not found. Proceeding without component knowledge." |
| Knowledge file not found | "Knowledge file '{name}' not found. Proceeding without it." |
| Feature knowledge not found | "Feature knowledge '{name}' not found. Proceeding without it." |
| Testcase file exists | Ask user: "Testcases already exist. Overwrite or use `/testcase update`?" |
