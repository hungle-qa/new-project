---
description: Manage QA testcases - write, write-deep, write-lite, write-lite-v2, update, and update-lite
argument-hint: <operation> <feature-name>
---

**Purpose:** Generate and manage QA testcases from feature specs using templates and rules.

**Agent:** Uses `testcase-writer` agent for all operations.

---

## Operations

| Operation | Usage | Description |
|-----------|-------|-------------|
| `write` | `/testcase write {feature}` | Generate testcases from spec + template + rules |
| `write-deep` | `/testcase write-deep {feature}` | 2-pass generation: scaffold → validate → full matrix (quality-first) |
| `write-lite` | `/testcase write-lite {feature}` | Generate spec-driven testcases (lean — spec + rules only, no digest) |
| `write-lite-v2` | `/testcase write-lite-v2 {feature}` | Generate testcases with corner-case discovery (spec + rules, no digest) |
| `update` | `/testcase update {feature}` | Update existing testcases (add, edit, remove) |
| `update-lite` | `/testcase update-lite {feature}` | Update testcases from approved corner-case questions |

---

## Workflow

**Reference:** `.claude/agents/testcase-writer.md`

---

Task: $ARGUMENTS
