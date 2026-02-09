# AGIA Skill: SYSTEM-AUDIT

> Loaded by master agent when operation = `system-audit`
> Checks consistency of system documentation files (README, CLAUDE.md, user-guide, workflows).

---

## When to Audit System Files

| Trigger | Files to Check |
|---------|----------------|
| New agent created | README.md (agents table), user-guide.md (agent reference), agia-workflow.md (Chain Registry) |
| Agent modified | user-guide.md (capabilities), workflows referencing agent, agia-workflow.md (Chain Registry) |
| Agent I/O changed | data-contracts.md, all workflows containing agent, downstream agent files |
| New workflow created | CLAUDE.md (workflow list), README.md (workflows section), agia-workflow.md (Chain Registry) |
| New command created | user-guide.md (command reference), README.md (if major) |
| Tech stack change | development-rules.md, README.md (tech stack table) |
| API endpoint added | README.md (API table), user-guide.md (if user-facing) |

---

## Procedure

**Phase 1: DISCOVER**
```
Glob: .claude/**/*.md
Read: README.md
Read: CLAUDE.md
Read: docs/user-guide.md
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

**Phase 4: REPORT** (use output format below)

**Phase 5: UPDATE (with approval)**
1. Show planned changes
2. Use AskUserQuestion for approval
3. Apply edits only after "Yes"

---

## Output Format

```markdown
## System Consistency Audit

### Scope
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
