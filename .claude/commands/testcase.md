---
description: Manage QA testcases - write, write-lite, and update testcases
argument-hint: <operation> <feature-name>
---

**Purpose:** Generate and manage QA testcases from feature specs using templates and rules.

**Agent:** Uses `testcase-writer` agent for all operations.

---

## Operations

| Operation | Usage | Description |
|-----------|-------|-------------|
| `write` | `/testcase write {feature}` | Generate testcases from spec + template + rules |
| `write-lite` | `/testcase write-lite {feature}` | Generate spec-driven testcases (lean — spec + rules only, no digest) |
| `update` | `/testcase update {feature}` | Update existing testcases (add, edit, remove) |

---

## Workflow

**Reference:** `.claude/agents/testcase-writer.md`

Delegates all parsing, validation, prerequisite checks, and skill routing to the `testcase-writer` agent.

---

## Quick Reference

```
/testcase write {feature}           -> Generate testcases (full)
/testcase write-lite {feature}      -> Generate testcases (lean, spec-only)
/testcase update {feature}          -> Update existing testcases
```

---

Task: $ARGUMENTS
