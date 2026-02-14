# Skill: CREATE

**Purpose:** Generate a new project doc from codebase context.
**Trigger:** `create` keyword + doc-type

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
- Doc does NOT already exist at `docs/{doc-type}.md` (if exists → "Doc already exists. Use `/doc update {type}` instead.")

---

## Steps

### Step 1: Validate

1. Validate doc-type is valid
2. Check `docs/{doc-type}.md` does not exist
   - If exists → "Doc already exists at `docs/{doc-type}.md`. Use `/doc update {doc-type}` instead."
3. Ensure `docs/` directory exists (create if needed)

### Step 2: Read Source Files

Read all source files for the doc type from Context Source Registry (`doc-writer.md` → `[CONTEXT_SOURCE_REGISTRY]`):

| Doc Type | Sources to Read |
|----------|----------------|
| `context` | `CLAUDE.md`, `README.md`, `.claude/workflows/*.md`, `.claude/agents/*.md`, project structure via Glob |
| `project-overview` | `README.md`, `CLAUDE.md`, `package.json` |
| `codebase-summary` | `README.md`, `.claude/workflows/development-rules.md`, `client/src/` structure, `server/src/` structure, API routes |
| `design-guidelines` | `source/design-system/*.md`, `client/src/components/` structure, Tailwind config |
| `system-architecture` | `.claude/agents/*.md`, `.claude/workflows/*.md`, `CLAUDE.md` |

Show progress: "Reading {file}..." for each source.

### Step 3: Generate Doc

Generate the documentation following:
- **doc-writer formatting rules** (from master agent: bullets first, active voice, visual hierarchy)
- **Doc type template** (see below)
- Content synthesized from source files read in Step 2

#### Doc Type Templates

**context:**
```markdown
# Context Summary
## Project Overview
## Workflows
## Agent System
## Project Structure
## Key Files
```

**project-overview:**
```markdown
# Project Overview
## Purpose
## Goals
## Scope
## Quick Start
## Tech Stack
```

**codebase-summary:**
```markdown
# Codebase Summary
## Tech Stack
## Project Structure
## API Endpoints
## Key Files
## Scripts
```

**design-guidelines:**
```markdown
# Design Guidelines
## UI Framework
## Component Library
## Styling Patterns
## Component Conventions
## Examples
```

**system-architecture:**
```markdown
# System Architecture
## Agent System
## Workflow Chains
## Data Flow
## File Storage
## Integration Points
```

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
