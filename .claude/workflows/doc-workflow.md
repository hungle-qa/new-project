# Doc Workflow

**Command:** `/doc <operation> [doc-type]`
**Agent:** `doc-writer` (skill-based: review / create / update)

---

## Valid Doc Types

| Doc Type | File | Content Source |
|----------|------|----------------|
| `context` | `docs/context-summary.md` | Digest of CLAUDE.md + README + workflows + agents + project structure |
| `project-overview` | `docs/project-overview.md` | High-level project purpose, goals, scope |
| `codebase-summary` | `docs/codebase-summary.md` | Tech stack, folder structure, API endpoints, key files |
| `design-guidelines` | `docs/design-guidelines.md` | UI patterns, Tailwind usage, shadcn/ui components |
| `system-architecture` | `docs/system-architecture.md` | Agent system, workflow chains, data flow, file storage |

---

## Operation Router

### 1. Parse Arguments

```
Input: "<operation> [doc-type]"
operation = first word
doc-type = second word (optional for review)
```

### 2. Validate

- Valid operations: `review`, `create`, `update`
- doc-type: OPTIONAL for `review` (audits all), REQUIRED for `create`/`update`
- Invalid operation → "Unknown operation '{op}'. Use: review, create, update"
- Missing doc-type (for create/update) → "Please provide doc type: /doc {op} {doc-type}"
- Invalid doc-type → "Unknown doc type '{type}'. Valid: context, project-overview, codebase-summary, design-guidelines, system-architecture"

### 3. Check Prerequisites

| Operation | Check | Error |
|-----------|-------|-------|
| `review` | (none — reports missing docs as part of audit) | — |
| `create` | Doc does NOT exist at `docs/{doc-type}.md` | "Doc already exists. Use `/doc update {type}` instead." |
| `create` | Source files for doc type are accessible | "Source files not found for {type}." |
| `update` | Doc exists at `docs/{doc-type}.md` | "Doc not found. Use `/doc create {type}` first." |

### 4. Route to Skill

Read `.claude/agents/doc-writer.md`, then load matching skill:

| Operation | Skill File |
|-----------|------------|
| `review` | `.claude/agents/skills/doc-writer/review.md` |
| `create` | `.claude/agents/skills/doc-writer/create.md` |
| `update` | `.claude/agents/skills/doc-writer/update.md` |

---

## Context Source Registry

Which files to read for each doc type:

| Doc Type | Sources to Read |
|----------|----------------|
| `context` | `CLAUDE.md`, `README.md`, `.claude/workflows/*.md`, `.claude/agents/*.md`, project structure (Glob) |
| `project-overview` | `README.md`, `CLAUDE.md`, `package.json` |
| `codebase-summary` | `README.md`, `.claude/workflows/development-rules.md`, `client/src/` structure, `server/src/` structure, API routes |
| `design-guidelines` | `source/design-system/*.md`, `client/src/components/` structure, Tailwind config |
| `system-architecture` | `.claude/agents/*.md`, `.claude/workflows/*.md`, `CLAUDE.md` |

---

## Approval Gates

| Operation | Gate |
|-----------|------|
| `review` | No write needed — report only |
| `create` | Summary preview → AskUserQuestion approval → write file |
| `update` | Diff summary → AskUserQuestion approval → write file |

---

## Error Handling

| Error | Response |
|-------|----------|
| Invalid operation | "Unknown operation. Use: review, create, update" |
| Invalid doc-type | "Unknown doc type. Valid: context, project-overview, codebase-summary, design-guidelines, system-architecture" |
| Missing doc-type | "Please provide doc type: /doc {op} {doc-type}" |
| Doc already exists (create) | "Doc exists. Use `/doc update {type}` instead." |
| Doc not found (update) | "Doc not found. Use `/doc create {type}` first." |
| Source files missing | "Cannot read source files for {type}. Check project structure." |

---

## Success Criteria

| Operation | Success Condition |
|-----------|-------------------|
| `review` | Freshness report generated for all (or specified) docs |
| `create` | Doc written to `docs/{doc-type}.md` after user approval |
| `update` | Doc updated at `docs/{doc-type}.md` after user approval |

---

## Related Files

| File | Purpose |
|------|---------|
| `.claude/agents/doc-writer.md` | Master agent + context source registry |
| `.claude/agents/skills/doc-writer/review.md` | Review skill |
| `.claude/agents/skills/doc-writer/create.md` | Create skill |
| `.claude/agents/skills/doc-writer/update.md` | Update skill |
| `.claude/commands/doc.md` | Command entry point |
| `docs/*.md` | Generated documentation files |
