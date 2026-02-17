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

## Argument Parsing

**Format:** `<operation> <feature-name>`

- `operation` — REQUIRED (write, write-lite, update)
- `feature-name` — REQUIRED for both operations

**Examples:**
- `/testcase write login-page` -> Generate testcases for login-page
- `/testcase write-lite login-page` -> Generate lean spec-driven testcases for login-page
- `/testcase update login-page` -> Update existing testcases for login-page

---

## Prerequisite Checks

| Operation | Prerequisites |
|-----------|---------------|
| `write` | Template exists + spec exists + rules exist |
| `write-lite` | Spec exists (rules optional — defaults used if missing) |
| `update` | Testcase CSV exists for feature |

---

## Workflow

**Reference:** `.claude/workflows/testcase-workflow.md`

**Execution:**
1. Parse operation and feature-name from arguments
2. Validate operation is valid (write/write-lite/update)
3. Check prerequisites for the operation
4. Route to `testcase-writer` agent with matching skill
5. Return results

---

## Quick Reference

```
/testcase write {feature}           -> Generate testcases (full)
/testcase write-lite {feature}      -> Generate testcases (lean, spec-only)
/testcase update {feature}          -> Update existing testcases
```

---

Task: $ARGUMENTS
