# Skill: UPDATE

**Purpose:** Update existing testcases — add, edit, or remove cases.
**Trigger:** `update` keyword + feature-name

---

## Prerequisites

- CSV at `source/testcase/{feature}/result/{feature}-testcase.csv`
- Spec at `source/testcase/{feature}/spec/`
- Rules at `source/testcase/rule/test-rules.md`
- Strategy in `config.md` frontmatter (optional — used to maintain consistent generation approach)
- Structure in `config.md` frontmatter (optional — if defined, new cases must follow the structure strictly). Set via Template tab > Module Structure section.
- Scope hints in per-feature rules (`## Scope` section) — used for happy/corner case guidance

---

## Steps

### Step 1: Validate & Load Context

1. Check CSV exists → if not: "No testcases found. Run `/testcase write {feature}` first."
2. Read existing CSV
3. Run **Digest Freshness Check** from master agent (`testcase-writer.md` → Context Digest System)
   - If `FRESH` → Read only `source/testcase/{feature}/context-digest.md`
     - **Scope guard:** If cached digest lacks `## Test Scope` or `digest-version: 2` (legacy digest) → treat as STALE, regenerate using digest-version 2 format.
   - If `STALE` → Read all sources, generate digest (digest-version 2 format)
4. Show: "Loaded {N} existing testcases + context."

### Step 2: Ask Update Intent

AskUserQuestion: "What would you like to update?"
- "Add new testcases" → describe new requirements
- "Modify existing testcases" → specify which cases + changes
- "Remove testcases" → specify which to remove
- "Re-generate from updated spec" → diff spec vs existing

### Step 3: Apply Changes

**Add new:**
1. Generate new cases following template `writingStyle`, **the selected strategy approach**, and **structure** (if defined, new cases MUST use Level columns matching the tree; if empty, freestyle module assignment)
2. Sequential IDs continuing from last existing
3. Append to set

**Modify existing:**
1. Identify targets by ID or description
2. Apply changes, preserve format

**Remove:**
1. Identify targets, remove from set
2. IDs NOT reassigned (gaps OK)

**Re-generate from spec:**
1. Diff spec vs existing testcases
2. Add cases for new requirements, flag removed ones
3. Apply the selected strategy when generating new cases (read from digest/config)

### Step 4: Show Diff and Approve

Show BEFORE/AFTER summary:
- Before: {N}, Added: {A}, Modified: {M}, Removed: {R}, After: {total}
- Show changed rows as table

AskUserQuestion: "Apply these changes?"
- "Apply changes"
- "Modify further"
- "Cancel"

### Step 5: Write Updated CSV

1. Write to `source/testcase/{feature}/result/{feature}-testcase.csv`
2. Confirm: "Done! {A} added, {M} modified, {R} removed."

---

## Error Handling

| Error | Response |
|-------|----------|
| No existing CSV | "Run `/testcase write {feature}` first." |
| Invalid testcase ID | "ID '{id}' not found in CSV." |
| Format mismatch | "CSV format mismatch. Re-read template and fix." |
| Knowledge not found | Proceed without, log warning. |
