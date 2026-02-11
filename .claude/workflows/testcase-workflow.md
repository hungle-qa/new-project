# Testcase Workflow

**Command:** `/testcase <operation> <feature-name>`
**Agent:** `testcase-writer` (skill-based: write / update)

---

## Operation Router

### 1. Parse Arguments

```
Input: "<operation> <feature-name>"
operation = first word, feature-name = remaining
```

### 2. Validate

- Valid operations: `write`, `update`
- feature-name: REQUIRED for both
- Invalid → "Unknown operation '{op}'. Use: write, update"
- Missing name → "Please provide feature name: /testcase {op} {feature-name}"

### 3. Check Prerequisites

| Operation | Check | Error |
|-----------|-------|-------|
| `write` | Template at `source/testcase/template/template.json` (or rules fallback) | "No template. Add via Web UI or rules." |
| `write` | Spec in `source/testcase/{feature}/spec/` | "No spec. Import via Web UI first." |
| `write` | Rules at `source/testcase/rule/test-rules.md` | "No rules. Add to source/testcase/rule/test-rules.md" |
| `update` | CSV at `source/testcase/{feature}/result/` | "Run `/testcase write {feature}` first." |

### 4. Route to Skill

Read `.claude/agents/testcase-writer.md`, then load matching skill:

| Operation | Skill File |
|-----------|------------|
| `write` | `.claude/agents/skills/testcase-writer/write.md` |
| `update` | `.claude/agents/skills/testcase-writer/update.md` |

---

## Approval Gates

| Operation | Gate |
|-----------|------|
| `write` | 5-example review → full set preview → before writing CSV |
| `update` | Before/after diff → before writing CSV |

---

## Context Digest

The agent uses a **context-digest** system (defined in `testcase-writer.md`) to cache compiled context per feature. On re-runs, it checks freshness via file timestamps and only re-reads sources if changed. This saves tokens by avoiding redundant file reads.

---

## Related Files

| File | Purpose |
|------|---------|
| `.claude/agents/testcase-writer.md` | Master agent + digest system |
| `.claude/agents/skills/testcase-writer/write.md` | Write skill |
| `.claude/agents/skills/testcase-writer/update.md` | Update skill |
| `.claude/commands/testcase.md` | Command entry point |
| `source/testcase/rule/test-rules.md` | Rules |
| `source/testcase/template/template.json` | Template columns |
| `source/testcase/{feature}/context-digest.md` | Cached context per feature |
