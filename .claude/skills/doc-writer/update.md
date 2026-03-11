# Skill: UPDATE

**Purpose:** Update an existing project doc with latest codebase changes.
**Trigger:** `update` keyword + doc-type

---

## Steps

### Step 1: Validate & Load

1. Validate doc-type against agent's `[CONTEXT_SOURCE_REGISTRY]`
2. Check `docs/{doc-type}.md` exists
   - If not → "Doc not found at `docs/{doc-type}.md`. Use `/doc create {doc-type}` first."
3. Read existing doc content

### Step 2: Read Source Files

Read all sources for the doc type from agent's `[CONTEXT_SOURCE_REGISTRY]`.
Show progress: "Reading {file}..." for each source.

### Step 3: Compare and Identify Changes

Compare existing doc against current sources:
- `UNCHANGED` — section is current
- `UPDATED` — section needs content changes
- `NEW` — topic in sources but not in doc
- `REMOVED` — section references things no longer in sources

### Step 4: Generate Updated Doc

- Preserve accurate sections
- Update stale sections with current info
- Add new sections, remove obsolete ones
- Follow agent's `[WRITING_RULES]`

### Step 5: Show Diff and Approve

Show change summary:
- Sections unchanged / updated / added / removed (with names)

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
