---
description: Manage QA testcases - init, import specs, write and update testcases
argument-hint: <operation> [feature-name]
---

**Purpose:** Generate and manage QA testcases from feature specs using templates and rules.

**Agent:** Uses `testcase-writer` agent for all operations.

---

## Operations

| Operation | Usage | Description |
|-----------|-------|-------------|
| `init` | `/testcase init` | First-time setup: import CSV template + define rules |
| `import-spec` | `/testcase import-spec {feature}` | Import PDF spec, extract requirements, map components |
| `write` | `/testcase write {feature}` | Generate testcases from spec + template + rules |
| `update` | `/testcase update {feature}` | Update existing testcases (add, edit, remove) |

---

## Argument Parsing

**Format:** `<operation> [feature-name]`

- `operation` — REQUIRED (init, import-spec, write, update)
- `feature-name` — REQUIRED for import-spec, write, update; NOT required for init

**Examples:**
- `/testcase init` -> Setup template and rules
- `/testcase import-spec login-page` -> Import spec for login-page feature
- `/testcase write login-page` -> Generate testcases for login-page
- `/testcase update login-page` -> Update existing testcases for login-page

---

## Prerequisite Checks

| Operation | Prerequisites |
|-----------|---------------|
| `init` | None |
| `import-spec` | Feature-name provided |
| `write` | Template exists + spec exists + rules exist |
| `update` | Testcase CSV exists for feature |

---

## Workflow

**Reference:** `.claude/workflows/testcase-workflow.md`

**Execution:**
1. Parse operation and feature-name from arguments
2. Validate operation is valid (init/import-spec/write/update)
3. Check prerequisites for the operation
4. Route to `testcase-writer` agent with matching skill
5. Return results

---

## Quick Reference

```
/testcase init                      -> Setup template + rules
/testcase import-spec {feature}     -> Import PDF spec for feature
/testcase write {feature}           -> Generate testcases
/testcase update {feature}          -> Update existing testcases
```

---

## Typical Workflow Order

```
1. /testcase init                        -> One-time setup
2. /testcase import-spec {feature}       -> Per feature
3. /testcase write {feature}             -> Generate testcases
4. /testcase update {feature}            -> Iterate as needed
```

---

Task: $ARGUMENTS
