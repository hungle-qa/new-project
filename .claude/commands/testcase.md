---
description: Manage QA testcases - write and update testcases
argument-hint: <operation> <feature-name>
---

**Purpose:** Generate and manage QA testcases from feature specs using templates and rules.

**Agent:** Uses `testcase-writer` agent for all operations.

---

## Operations

| Operation | Usage | Description |
|-----------|-------|-------------|
| `write` | `/testcase write {feature}` | Generate testcases from spec + template + rules |
| `update` | `/testcase update {feature}` | Update existing testcases (add, edit, remove) |

---

## Argument Parsing

**Format:** `<operation> <feature-name>`

- `operation` — REQUIRED (write, update)
- `feature-name` — REQUIRED for both operations

**Examples:**
- `/testcase write login-page` -> Generate testcases for login-page
- `/testcase update login-page` -> Update existing testcases for login-page

---

## Prerequisite Checks

| Operation | Prerequisites |
|-----------|---------------|
| `write` | Template exists + spec exists + rules exist |
| `update` | Testcase CSV exists for feature |

---

## Workflow

**Reference:** `.claude/workflows/testcase-workflow.md`

**Execution:**
1. Parse operation and feature-name from arguments
2. Validate operation is valid (write/update)
3. Check prerequisites for the operation
4. Route to `testcase-writer` agent with matching skill
5. Return results

---

## Quick Reference

```
/testcase write {feature}           -> Generate testcases
/testcase update {feature}          -> Update existing testcases
```

---

Task: $ARGUMENTS
