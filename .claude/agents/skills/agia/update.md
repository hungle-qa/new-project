# AGIA Skill: UPDATE

> Loaded by master agent when operation = `update`

---

## Pre-requisite

Run AUDIT first if not already done. The audit report informs what needs fixing.

---

## Phase 1: SYNTHESIZE

Rewrite the target agent prompt using AI-Native Structural Format:

```markdown
## [IDENTIFICATION]
- Role and expertise clearly defined
- Scope explicitly bounded

## [CONSTRAINTS]
- Hard boundaries (MUST/NEVER)
- Soft guidelines (SHOULD/PREFER)
- Negative constraints (DO NOT)

## [WORKFLOW_LOGIC]
- Step-by-step execution protocol
- Decision trees with explicit conditions
- Failure handling at each step

## [VALIDATION_GATE]
- Self-check requirements before output
- Quality criteria checklist
- Error detection patterns
```

---

## Phase 2: SHOW DIFF

Display before/after changes:
```diff
- Old instruction
+ New instruction
```

---

## Phase 3: APPROVAL

Ask using AskUserQuestion:
```
"Apply these changes to {agent-name}?"
Options: "Yes, update" | "No, cancel"
```

- If **approved**: Write updated agent file
- If **rejected**: Output "Update cancelled. No changes made."

---

## Phase 4: POST-UPDATE CHAIN VALIDATION (MANDATORY)

After writing the updated file:

1. Re-run `[CHAIN_VALIDATION]` procedure (from master) against the UPDATED agent
2. If chain breaks detected → WARN user and list broken chains
3. If I/O contract changed → list affected downstream agents that may need updates
4. Include chain status in output summary

---

## Phase 5: ITERATE

If simulation failures or chain breaks found:
1. Identify failure pattern
2. Trace to source instruction
3. Strengthen with explicit handling
4. Re-test until PASS

---

## Output Format

```markdown
## Update Complete: {agent-name}

### Changes Applied
- {change 1}
- {change 2}

### Before/After
| Metric | Before | After |
|--------|--------|-------|
| Ambiguous terms | {count} | 0 |
| Failure handlers | {count} | {new count} |
| Validation checks | {count} | {new count} |

### Chain Validation (Post-Update)
| Chain | Status | Notes |
|-------|--------|-------|
| {workflow} | PASS/FAIL | {any issues} |

### Affected Downstream Agents
- {agent-name}: {impact description} (if any I/O changes)
```
