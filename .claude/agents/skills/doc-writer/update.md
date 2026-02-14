# Skill: UPDATE

**Purpose:** Update an existing project doc with latest codebase changes.
**Trigger:** `update` keyword + doc-type

---

## Valid Doc Types

| Doc Type | File |
|----------|------|
| `context` | `docs/context-summary.md` |
| `project-overview` | `docs/project-overview.md` |
| `codebase-summary` | `docs/codebase-summary.md` |
| `design-guidelines` | `docs/design-guidelines.md` |
| `system-architecture` | `docs/system-architecture.md` |

---

## Prerequisites

- doc-type is one of 5 valid types
- Doc exists at `docs/{doc-type}.md` (if not → "Doc not found. Use `/doc create {type}` first.")

---

## Steps

### Step 1: Validate & Load

1. Validate doc-type is valid
2. Check `docs/{doc-type}.md` exists
   - If not → "Doc not found at `docs/{doc-type}.md`. Use `/doc create {doc-type}` first."
3. Read existing doc content

### Step 2: Read Source Files

Read all source files for the doc type from Context Source Registry (`doc-writer.md` → `[CONTEXT_SOURCE_REGISTRY]`).

Show progress: "Reading {file}..." for each source.

### Step 3: Compare and Identify Changes

Compare existing doc against current source files:

1. **Section-by-section analysis:**
   - Which sections are still accurate?
   - Which sections have outdated info?
   - What new content should be added?
   - What removed content should be deleted?

2. **Categorize changes:**
   - `UNCHANGED` — section is current
   - `UPDATED` — section needs content changes
   - `NEW` — new section needed (topic exists in sources but not doc)
   - `REMOVED` — section references things no longer in sources

### Step 4: Generate Updated Doc

- Preserve existing structure where content is still accurate
- Update stale sections with current source info
- Add new sections for new topics
- Remove sections for removed content
- Follow doc-writer formatting rules (bullets, active voice, visual hierarchy)

### Step 5: Show Diff and Approve

Show change summary:
- Sections unchanged: {N}
- Sections updated: {N} (list which ones)
- Sections added: {N} (list which ones)
- Sections removed: {N} (list which ones)

AskUserQuestion: "Apply these updates?"
- "Apply updates"
- "Modify (specify changes)"
- "Cancel"

### Step 6: Write Updated File

1. Write to `docs/{doc-type}.md`
2. Confirm: "Done! Updated `docs/{doc-type}.md` — {U} updated, {A} added, {R} removed"

---

## Error Handling

| Error | Response |
|-------|----------|
| Invalid doc-type | "Unknown doc type. Valid: context, project-overview, codebase-summary, design-guidelines, system-architecture" |
| Doc not found | "Doc not found. Use `/doc create {type}` first." |
| No changes detected | "Doc is up to date. No changes needed." |
| Source file not found | Log warning, proceed with available sources. Note gap in output. |
| User cancels | "Cancelled. No changes made." |
