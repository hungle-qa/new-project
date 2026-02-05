---
description: Audit, update, test, or optimize agents using AGIA
argument-hint: <operation> <agent-name>
---

**Purpose:** Manage and improve AI agents using the AGIA (Agent Intelligence Architect) system.

**Agent:** Uses `agia` agent for all operations.

---

## Operations

| Operation | Usage | Description |
|-----------|-------|-------------|
| `audit` | `/agent-audit audit scout` | Analyze agent, identify weaknesses, report issues |
| `update` | `/agent-audit update scout` | Apply fixes from audit, refactor (requires approval) |
| `test` | `/agent-audit test scout` | Run 5 simulation tests against agent |
| `optimize` | `/agent-audit optimize scout` | Reduce tokens 30-50% via Chain-of-Density & Entropy Reduction |

---

## Argument Parsing

**Format:** `<operation> <agent-name>`

**Examples:**
- `/agent-audit audit import-design` → Audit the import-design agent
- `/agent-audit update scout` → Update scout with fixes
- `/agent-audit test planner` → Run tests on planner agent
- `/agent-audit optimize implementer` → Optimize implementer for token efficiency

---

## Workflow

**Reference:** `.claude/workflows/agia-workflow.md`

**Execution:**
1. Parse operation and agent-name from arguments
2. Validate agent exists at `.claude/agents/{agent-name}.md`
3. Route to appropriate workflow phase
4. Execute using `agia` agent
5. Return formatted report

---

## Quick Reference

```
/agent-audit audit <agent>     → Get weakness report
/agent-audit update <agent>    → Fix issues (with approval)
/agent-audit test <agent>      → Run simulation tests
/agent-audit optimize <agent>  → Reduce token count 30-50%
```

---

Task: $ARGUMENTS
