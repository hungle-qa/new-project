# Skill: UPDATE

**Purpose:** Update existing testcases — add, edit, or remove cases.

**Trigger:** `update` keyword + feature-name

---

## Prerequisites

- Testcase CSV exists at `source/testcase/{feature-name}/result/{feature-name}-testcase.csv`
- Spec exists at `source/testcase/{feature-name}/spec/`
- Rules exist at `source/testcase/rule/test-rules.md`

---

## Steps

### Step 1: Validate Testcase Exists

1. Check CSV exists at `source/testcase/{feature-name}/result/{feature-name}-testcase.csv`
2. If not -> Error: "No testcases found for '{feature-name}'. Run `/testcase write {feature-name}` first."

### Step 2: Read Current State

**IMPORTANT:** Show progress messages to the user at each step so they know AI is working.

Read files in this order:

1. **Existing CSV**: `source/testcase/{feature-name}/result/{feature-name}-testcase.csv`
   > Progress: "Reading existing testcases..."

2. **Config**: `source/testcase/{feature-name}/config.md` — parse YAML frontmatter for `levels`, `scope`, `components`, `knowledge_files`, `linked_knowledge`
   > Progress: "Reading feature config..."

3. **Feature Knowledge** (from config `linked_knowledge`): For each entry, read from `source/feature-knowledge/{name}/config.md`. This provides domain context and should be read early.
   > Progress: "Reading linked feature knowledge ({N} items)..."

4. **Knowledge files** (from config `knowledge_files`): For each entry, read from `source/testcase/{feature-name}/knowledge/{filename}`. If file not found, log warning and continue.
   > Progress: "Reading uploaded knowledge files..."

5. **Rules**: `source/testcase/rule/test-rules.md`
   > Progress: "Reading testcase rules..."

6. **Template**: Read `source/testcase/template/template.json` (JSON array of column objects with `id`, `name`, `width`, `style`, `writingStyle`). If not found, use rules column definitions as fallback.
   > Progress: "Reading testcase template..."

7. **Spec**: All `.md` files from `source/testcase/{feature-name}/spec/`
   > Progress: "Reading feature spec..."

8. **Mapped components**: For each component in config `components`, read from `source/design-system/{ComponentName}.md`
   > Progress: "Reading design-system components..."

> Progress: "All context loaded. Ready for update."

### Step 3: Ask Update Intent

Use AskUserQuestion to determine what to update:
- Option A: "Add new testcases" -> Describe new cases or requirements
- Option B: "Modify existing testcases" -> Specify which cases and changes
- Option C: "Remove invalid testcases" -> Specify which cases to remove
- Option D: "Re-generate from updated spec" -> Re-read spec and regenerate

### Step 4: Apply Changes

> Progress: "Applying changes..."

Based on user selection:

**Add new cases:**
1. Read user's description of new requirements/cases
2. Generate new testcases following rules and template format (including `writingStyle` per column)
3. Assign sequential IDs continuing from last existing ID
4. Append to existing testcase set

**Modify existing:**
1. Identify target testcases by ID or description
2. Apply requested modifications
3. Preserve CSV format and template compliance

**Remove cases:**
1. Identify target testcases by ID or description
2. Remove from testcase set
3. Note: IDs are NOT reassigned (gaps are acceptable)

**Re-generate from spec:**
1. Re-read spec file and config (scope hints, components, knowledge, linked_knowledge)
2. Diff against existing testcases
3. Add cases for new requirements
4. Flag cases for removed requirements

### Step 5: Show Diff and Approve

> Progress: "Changes prepared. Showing diff..."

1. Show BEFORE vs AFTER summary:
   - Total before: {N} testcases
   - Added: {A} new cases
   - Modified: {M} cases
   - Removed: {R} cases
   - Total after: {N + A - R} testcases
2. Show changed rows (first 10 if many)
3. Use AskUserQuestion: "Apply these changes?"
   - Option A: "Apply changes"
   - Option B: "Modify further"
   - Option C: "Cancel"

### Step 6: Write Updated CSV

> Progress: "Writing updated testcase CSV..."

1. Write updated CSV to same location: `source/testcase/{feature-name}/result/{feature-name}-testcase.csv`
2. Confirm with change summary

> Progress: "Done! Updated {path} — {A} added, {M} modified, {R} removed."

---

## Validation

| Check | Condition |
|-------|-----------|
| Existing testcases found | CSV file exists and is readable |
| All context loaded | CSV, config, feature knowledge, knowledge files, rules, template, spec, components |
| CSV format preserved | Columns still match template.json after changes |
| Writing style applied | Each column follows its `writingStyle` instruction |
| Changes are minimal | Only requested changes applied |
| IDs consistent | No duplicate IDs, sequential for new cases |
| User approved | AskUserQuestion confirmation received |
| File updated | CSV written successfully |

---

## Error Handling

| Error | Response |
|-------|----------|
| No existing testcases | "No testcases found. Run `/testcase write {feature}` first." |
| Invalid testcase ID | "Testcase ID '{id}' not found in existing CSV." |
| Format corruption | "CSV format mismatch detected. Re-read template and fix format before changes." |
| Component not found | "Design-system component '{name}' not found. Proceeding without it." |
| Knowledge file not found | "Knowledge file '{name}' not found. Proceeding without it." |
| Feature knowledge not found | "Feature knowledge '{name}' not found. Proceeding without it." |
| Update cancelled | "Update cancelled. No changes made to testcase file." |
