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

## Workflow

**Reference:** `.claude/agents/doc-writer.md`

Read agent file first, then follow skill routing to the matching skill file. All parsing, validation, and routing is handled by the agent.

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
