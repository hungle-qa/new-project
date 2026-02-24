# Testcase Workflow

**Command:** `/testcase <operation> <feature-name>`
**Agent:** `testcase-writer` (skill-based: write / write-lite / update)

---

## Operation Router

### 1. Parse Arguments

```
Input: "<operation> <feature-name>"
operation = first word, feature-name = remaining
```

### 2. Validate

- Valid operations: `write`, `write-lite`, `update`
- feature-name: REQUIRED for both
- Invalid → "Unknown operation '{op}'. Use: write, write-lite, update"
- Missing name → "Please provide feature name: /testcase {op} {feature-name}"

### 3. Check Prerequisites

| Operation | Check | Error |
|-----------|-------|-------|
| `write` | Template at `source/testcase/template/template.json` (or rules fallback) | "No template. Add via Web UI or rules." |
| `write` | Spec in `source/testcase/{feature}/spec/` | "No spec. Import via Web UI first." |
| `write` | Rules at `source/testcase/rule/test-rules.md` (global default) or `source/testcase/{feature}/rules.md` (per-feature, includes Scope) | "No rules. Add to source/testcase/rule/test-rules.md" |
| `write` | Strategy in config (optional) | Proceed without — uses balanced approach. Recommend setting via Testcase Manager > Strategy tab. |
| `write-lite` | Spec in `source/testcase/{feature}/spec/` | "No spec. Import via Web UI first." |
| `write-lite` | Rules at `source/testcase/rule/test-rules.md` or `source/testcase/{feature}/rules.md` (optional — proceeds with defaults if missing) | Warning only, not blocking. |
| `update` | CSV at `source/testcase/{feature}/result/` | "Run `/testcase write {feature}` first." |

### 4. Route to Skill

Read `.claude/agents/testcase-writer.md`, then load matching skill.

---

## Approval Gates

| Operation | Gate |
|-----------|------|
| `write` | Full set preview → before writing CSV |
| `write-lite` | **NONE** — writes immediately, shows summary after |
| `update` | Before/after diff → before writing CSV |

---

## Related Files

| File | Purpose |
|------|---------|
| `.claude/agents/testcase-writer.md` | Agent hub — role + skill routing |
| `.claude/agents/skills/testcase-writer/digest-system.md` | Context digest system (freshness check, generation format) |
| `.claude/agents/skills/testcase-writer/write.md` | Write skill (full) |
| `.claude/agents/skills/testcase-writer/write-lite.md` | Write-lite skill (spec-only, no digest) |
| `.claude/agents/skills/testcase-writer/update.md` | Update skill |
| `.claude/commands/testcase.md` | Command entry point |
| `source/testcase/rule/test-rules.md` | Global default rules |
| `source/testcase/{feature}/rules.md` | Per-feature rules (includes Scope section) |
| `source/testcase/template/template.json` | Template columns |
| `source/testcase/{feature}/context-digest.md` | Cached context per feature |
| `source/testcase/strategy/*.md` | Strategy guides (spec-driven, scenario-based, component-testing) |
