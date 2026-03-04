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
| `create-skill` | `/agent-audit create-skill planner` | Split agent into skill-based architecture |
| `system-audit` | `/agent-audit system-audit` | Check system docs consistency (README, CLAUDE.md, user-guide) |

---

## Workflow

**Reference:** `.claude/agents/agia.md`

Read agent file first, then follow skill routing to the matching skill file. All parsing, validation, and routing is handled by the agent.

---

## Quick Reference

```
/agent-audit audit <agent>          → Get weakness report
/agent-audit update <agent>         → Fix issues (with approval)
/agent-audit test <agent>           → Run simulation tests
/agent-audit optimize <agent>       → Reduce token count 30-50%
/agent-audit create-skill <agent>   → Split into skill-based architecture
/agent-audit system-audit           → Check system docs consistency
```

---

Task: $ARGUMENTS
