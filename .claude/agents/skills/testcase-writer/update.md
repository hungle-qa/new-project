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

Read files:
1. **Existing CSV**: `source/testcase/{feature-name}/result/{feature-name}-testcase.csv`
2. **Spec**: `source/testcase/{feature-name}/spec/{feature-name}-spec.md`
3. **Rules**: `source/testcase/rule/test-rules.md`
4. **Template**: `source/testcase/template/` (for format reference)

### Step 3: Ask Update Intent

Use AskUserQuestion to determine what to update:
- Option A: "Add new testcases" -> Describe new cases or requirements
- Option B: "Modify existing testcases" -> Specify which cases and changes
- Option C: "Remove invalid testcases" -> Specify which cases to remove
- Option D: "Re-generate from updated spec" -> Re-read spec and regenerate

### Step 4: Apply Changes

Based on user selection:

**Add new cases:**
1. Read user's description of new requirements/cases
2. Generate new testcases following rules and template format
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
1. Re-read spec file
2. Diff against existing testcases
3. Add cases for new requirements
4. Flag cases for removed requirements

### Step 5: Show Diff and Approve

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

1. Write updated CSV to same location: `source/testcase/{feature-name}/result/{feature-name}-testcase.csv`
2. Confirm with change summary

---

## Validation

| Check | Condition |
|-------|-----------|
| Existing testcases found | CSV file exists and is readable |
| CSV format preserved | Columns still match template after changes |
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
| Update cancelled | "Update cancelled. No changes made to testcase file." |
