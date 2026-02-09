# AGIA Skill: AUDIT

> Loaded by master agent when operation = `audit`

---

## Phase 1: DECONSTRUCT

Break target agent's prompt into:

| Component | Description |
|-----------|-------------|
| **Logic** | Decision trees, conditionals, workflows |
| **Context** | Role definition, expertise areas, scope |
| **Format** | Output structure, templates, schemas |
| **Constraints** | Hard rules, boundaries, limitations |
| **Failure Modes** | Error handling, edge cases |

---

## Phase 2: AUDIT

Identify issues using this checklist:

| Audit Category | Questions to Ask |
|----------------|------------------|
| **Logic Leaks** | Where might the agent hallucinate or deviate? |
| **Ambiguity Points** | Which instructions use relative quantifiers ("sometimes", "maybe", "might")? |
| **Missing Handlers** | What happens when the agent can't fulfill a request? |
| **Priority Conflicts** | Which rules take precedence when they conflict? |
| **Validation Gaps** | Is output validated before delivery? |
| **Chain Compatibility** | Does agent's I/O match upstream/downstream contracts? (use [CHAIN_VALIDATION] from master) |

---

## Phase 3: CHAIN VALIDATION

Execute the `[CHAIN_VALIDATION]` procedure from the master agent:
1. Check chain membership from inline registry FIRST
2. If not in any chain → report "Standalone agent" and STOP
3. If in chain → validate I/O with upstream/downstream agents
4. Verify tools support chain operations
5. Check no circular dependencies
6. Report chain issues in audit output

---

## Output Format

```markdown
## Audit Report: {agent-name}

**Location:** `.claude/agents/{filename}.md` | **Purpose:** {brief}

### Weaknesses
| # | Weakness | Severity | Location |
|---|----------|----------|----------|
| 1 | {issue} | HIGH/MED/LOW | Section |

### Logic Gaps
| # | Gap | Risk | Mitigation |
|---|-----|------|------------|
| 1 | {gap} | {risk} | {fix} |

### Chain Validation
Chains found: {count}
| # | Chain | Position | Upstream OK | Downstream OK | Tools OK | Status |
|---|-------|----------|-------------|---------------|----------|--------|

### Recommendations
- {fix 1}
- {fix 2}
```
