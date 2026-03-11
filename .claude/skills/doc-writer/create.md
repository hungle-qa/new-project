# Skill: CREATE

**Purpose:** Generate a new project doc from codebase context.
**Trigger:** `create` keyword + doc-type

---

## Steps

### Step 1: Validate

1. Validate doc-type against agent's `[CONTEXT_SOURCE_REGISTRY]`
2. Check `docs/{doc-type}.md` does not exist
   - If exists → "Doc already exists at `docs/{doc-type}.md`. Use `/doc update {doc-type}` instead."
3. Ensure `docs/` directory exists (create if needed)

### Step 2: Read Source Files

Read all sources for the doc type from agent's `[CONTEXT_SOURCE_REGISTRY]`.
Show progress: "Reading {file}..." for each source.

### Step 3: Generate Doc

Synthesize content from source files following agent's `[WRITING_RULES]`:
- Structure with H2/H3 headings matching the doc type's natural sections
- Use bullets, tables, and visual breaks throughout
- Active voice, present tense, action-first instructions

### Step 4: Preview and Approve

Show summary:
- Doc type being created
- Number of source files read
- Section outline (H2 headings)
- Estimated word count

AskUserQuestion: "Create this document?"
- "Approve and write"
- "Modify (specify changes)"
- "Cancel"

### Step 5: Write File

1. Write to `docs/{doc-type}.md`
2. Confirm: "Done! Created `docs/{doc-type}.md` ({N} words, {M} sections)"

---

## Error Handling

| Error | Response |
|-------|----------|
| Invalid doc-type | "Unknown doc type. Valid: context, project-overview, codebase-summary, design-guidelines, system-architecture" |
| Doc already exists | "Doc exists. Use `/doc update {type}` instead." |
| Source file not found | Log warning, proceed with available sources. Note gap in output. |
| User cancels | "Cancelled. No file created." |
