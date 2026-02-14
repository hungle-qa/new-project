---
description: Review, create, and update project documentation
argument-hint: <operation> [doc-type]
---

**Purpose:** Manage project documentation — review freshness, create new docs, update existing docs.

**Agent:** Uses `doc-writer` agent for all operations.

---

## Operations

| Operation | Usage | Description |
|-----------|-------|-------------|
| `review` | `/doc review` | Audit all docs (freshness + accuracy) |
| `review` | `/doc review {doc-type}` | Audit single doc |
| `create` | `/doc create {doc-type}` | Generate doc from codebase context |
| `update` | `/doc update {doc-type}` | Update existing doc with latest changes |

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

## Argument Parsing

**Format:** `<operation> [doc-type]`

- `operation` — REQUIRED (review, create, update)
- `doc-type` — OPTIONAL for review (audits all), REQUIRED for create/update

**Examples:**
- `/doc review` -> Audit all docs
- `/doc review context` -> Audit context-summary.md only
- `/doc create codebase-summary` -> Generate codebase-summary.md
- `/doc update system-architecture` -> Update system-architecture.md

---

## Prerequisite Checks

| Operation | Prerequisites |
|-----------|---------------|
| `review` | `docs/` folder exists (or report all missing) |
| `create` | doc-type valid + doc does NOT already exist |
| `update` | doc-type valid + doc exists at `docs/{doc-type}.md` |

---

## Workflow

**Reference:** `.claude/workflows/doc-workflow.md`

**Execution:**
1. Parse operation and doc-type from arguments
2. Validate operation is valid (review/create/update)
3. Validate doc-type is one of 5 valid types (when required)
4. Check prerequisites for the operation
5. Route to `doc-writer` agent with matching skill
6. Return results

---

## Quick Reference

```
/doc review                         -> Audit all docs
/doc review {doc-type}              -> Audit single doc
/doc create {doc-type}              -> Generate doc from context
/doc update {doc-type}              -> Update existing doc
```

---

Task: $ARGUMENTS
