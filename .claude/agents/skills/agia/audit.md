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
1. Find all chains containing target agent (from Chain Registry)
2. Validate I/O compatibility with upstream agent
3. Validate I/O compatibility with downstream agent
4. Verify agent's tools support chain operations
5. Check no circular dependencies
6. Report chain issues in audit output

---

## System File Audit

### When to Audit System Files

| Trigger | Files to Check |
|---------|----------------|
| New agent created | README.md (agents table), user-guide.md (agent reference), agia-workflow.md (Chain Registry) |
| Agent modified | user-guide.md (capabilities), workflows referencing agent, agia-workflow.md (Chain Registry I/O contracts) |
| Agent I/O changed | data-contracts.md, all workflows containing agent, downstream agent files |
| New workflow created | CLAUDE.md (workflow list), README.md (workflows section), agia-workflow.md (Chain Registry) |
| New command created | user-guide.md (command reference), README.md (if major) |
| Tech stack change | development-rules.md, README.md (tech stack table) |
| API endpoint added | README.md (API table), user-guide.md (if user-facing) |

### Workflow

**Phase 1: DISCOVER**
```
Glob: .claude/**/*.md
Glob: docs/**/*.md
Read: README.md
Read: CLAUDE.md
```

**Phase 2: EXTRACT REFERENCES**
For each file, extract:
- Agent names mentioned
- Workflow paths referenced
- Command names listed
- File paths stated

**Phase 3: VERIFY**

| Check | Method |
|-------|--------|
| Agent exists | Glob `.claude/agents/{name}.md` |
| Workflow exists | Glob `.claude/workflows/{name}.md` |
| Command exists | Glob `.claude/commands/{name}.md` |
| Path valid | Read file, check not error |

**Phase 4: REPORT INCONSISTENCIES** (use output format below)

**Phase 5: UPDATE (with approval)**
1. Show planned changes
2. Use AskUserQuestion for approval
3. Apply edits only after "Yes"

---

## Output Format

### Agent Audit Report

```markdown
## Audit Report: {agent-name}

### Target Agent
- **Name:** {agent_name}
- **Location:** `.claude/agents/{filename}.md`
- **Purpose:** {brief description}

### Weaknesses Identified
| # | Weakness | Severity | Location |
|---|----------|----------|----------|
| 1 | {issue} | HIGH/MEDIUM/LOW | Line/Section |

### Logic Gaps
| # | Gap Description | Risk | Mitigation |
|---|-----------------|------|------------|
| 1 | {gap} | {what could go wrong} | {fix} |

### Chain Validation
| # | Workflow | Position | Upstream OK | Downstream OK | Tools OK | Contract OK | Status |
|---|----------|----------|-------------|---------------|----------|-------------|--------|
| 1 | {workflow} | {N of M} | {yes/no} | {yes/no} | {yes/no} | {yes/no} | PASS/FAIL |

### Chain Issues (if any)
| # | Chain | Issue | Recommended Fix |
|---|-------|-------|-----------------|
| 1 | {workflow} | {issue description} | {fix} |

### Recommendations
- {fix 1}
- {fix 2}
```

### System File Audit Report

```markdown
## System Consistency Audit

### Audit Scope
- Files checked: {count}
- Trigger: {what prompted this audit}

### File Status
| File | Status | Issues |
|------|--------|--------|
| README.md | OK / Needs Update | {description} |

### Inconsistencies Found
| # | Location | Issue | Fix |
|---|----------|-------|-----|
| 1 | README.md:L{n} | {description} | {action} |

### Recommended Changes
{diff blocks per file}

### Approval Required
- [ ] {file} changes
```

### System File Templates

**Adding Agent to README.md:**
```markdown
| `{agent-name}` | {brief purpose} |
```

**Adding Agent to user-guide.md:**
```markdown
| `{agent-name}` | {purpose} | `{output location}` |
```

**Adding Workflow to CLAUDE.md:**
```markdown
- {Workflow name}: `./.claude/workflows/{name}.md`
```
