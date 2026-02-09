# Skill: INIT

**Purpose:** First-time setup — import CSV template + define testcase rules.

**Trigger:** `init` keyword (no feature-name required)

---

## Steps

### Step 1: Create Folder Structure

Create the following if not exists:
```
source/testcase/
  rule/
  template/
```

### Step 2: Import CSV Template

1. Ask user for CSV template file path using AskUserQuestion:
   - Option A: "Provide CSV file path"
   - Option B: "Use default template"
2. If user provides path -> Read the CSV file -> Parse columns -> Save to `source/testcase/template/`
3. If user chooses default -> Create default template with standard columns:
   - `ID, Module, Test Type, Scope, Title, Preconditions, Steps, Expected Result, Priority, Status`
4. Display parsed column names for confirmation

### Step 3: Define Testcase Rules

1. Check if `source/testcase/rule/test-rules.md` already exists
2. If exists -> Show current rules, ask if user wants to update
3. If not exists -> Ask user for rules using AskUserQuestion:
   - Option A: "Define custom rules"
   - Option B: "Use default rules"
4. If custom -> Guide user through rule definition (scope levels, case types, priority mapping)
5. If default -> Create `test-rules.md` with default rule structure

### Step 4: Show Summary

Display:
- Template columns imported
- Rules defined
- Folder structure created
- Next step: `/testcase import-spec {feature-name}`

### Step 5: Confirm

Use AskUserQuestion to confirm setup is complete and correct.

---

## Validation

| Check | Condition |
|-------|-----------|
| Folders exist | `source/testcase/rule/` and `source/testcase/template/` created |
| Template saved | At least one `.csv` file in `source/testcase/template/` |
| Rules saved | `source/testcase/rule/test-rules.md` exists and is non-empty |
| User confirmed | AskUserQuestion approval received |

---

## Error Handling

| Error | Response |
|-------|----------|
| CSV file not found | "File not found at {path}. Please provide a valid CSV file path." |
| CSV parse failure | "Could not parse CSV. Ensure file has header row with column names." |
| Folder creation failure | "Could not create folder. Check file system permissions." |
