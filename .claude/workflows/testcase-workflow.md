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
| `write` | Rules at `source/testcase/rule/test-rules.md` (global default) or `source/testcase/{feature}/rules.md` (per-feature, includes Scope) | "No rules. Add to source/testcase/rule/test-rules.md" |
| `write` | Strategy in config (optional) | Proceed without — uses balanced approach. Recommend setting via Testcase Manager > Strategy tab. |
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
| `write` | Full set preview → before writing CSV |
| `update` | Before/after diff → before writing CSV |

---

## Structure Integration

The agent reads the `structure` field from the feature's `config.md` frontmatter. Structure is a tree of nodes defining the module hierarchy.

| Structure State | Behavior |
|----------------|----------|
| **Has nodes** | STRICTLY follow the tree. Replace template's Module column with Level 1...N columns. Write test cases ONLY for leaf nodes. |
| **Empty** | Freestyle — AI groups by spec content using single Module column. |

Structure is set via the Testcase Manager web UI (Template tab → Module Structure section).

---

## Scope Integration

Scope hints (happy case / corner case guidance) are stored in the per-feature rules file (`source/testcase/{feature}/rules.md` → `## Scope` section). When a feature has custom scope values in `config.md`, they are auto-migrated into the rules file on first Rules load.

The agent reads scope hints from the rules (via digest) to guide testcase generation balance between happy paths and edge cases.

---

## Strategy Integration

The agent reads the `strategy` field from the feature's `config.md` frontmatter. Available strategies:

| Strategy | File | Approach |
|----------|------|----------|
| `spec-driven` | `source/testcase/strategy/spec-driven.md` | Follow spec exactly: US=Level 1, AC=Level 2, Given/When=Steps, Then=Expected |
| `scenario-based` | `source/testcase/strategy/scenario-based.md` | EP, BVA, E2E Pathing — minimize cases, maximize coverage |
| `component-testing` | `source/testcase/strategy/component-testing.md` | Atomic-to-Flow framework + CRUD/Persona/State lenses |

Strategy is set via the Testcase Manager web UI (Strategy tab). If no strategy selected, uses a balanced default approach.

---

## Context Digest

The agent uses a **context-digest** system (defined in `testcase-writer.md`) to cache compiled context per feature. On re-runs, it checks freshness via file timestamps and only re-reads sources if changed. The digest includes the strategy guide content when a strategy is selected. This saves tokens by avoiding redundant file reads.

---

## Related Files

| File | Purpose |
|------|---------|
| `.claude/agents/testcase-writer.md` | Master agent + digest system |
| `.claude/agents/skills/testcase-writer/write.md` | Write skill |
| `.claude/agents/skills/testcase-writer/update.md` | Update skill |
| `.claude/commands/testcase.md` | Command entry point |
| `source/testcase/rule/test-rules.md` | Global default rules |
| `source/testcase/{feature}/rules.md` | Per-feature rules (includes Scope section) |
| `source/testcase/template/template.json` | Template columns |
| `source/testcase/{feature}/context-digest.md` | Cached context per feature |
| `source/testcase/strategy/spec-driven.md` | Spec-driven strategy guide |
| `source/testcase/strategy/scenario-based.md` | Scenario-based strategy guide |
| `source/testcase/strategy/component-testing.md` | Component-testing strategy guide |
