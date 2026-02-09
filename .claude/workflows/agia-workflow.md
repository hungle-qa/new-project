# AGIA Workflow

**Purpose:** Execute agent audit, update, test, optimize, and create-skill operations.

**Agent:** `agia` (Agent Intelligence Architect) — skill-based architecture

**Command:** `/agent-audit <operation> <agent-name>`

---

## Operation Data Flow

```
[User Request: /agent-audit {operation} {agent-name}]
      ↓
  ┌──────────────────┐
  │ Parse Arguments  │
  └──────────────────┘
  📥 "<operation> <agent-name>"
  ⚙️ Extract operation + agent-name
  📤 Validated params
      ↓
  ┌──────────────────┐
  │ Validate Agent   │
  └──────────────────┘
  📥 agent-name
  ⚙️ Check .claude/agents/{name}.md exists
  📤 Agent file path OR error
      ↓
  ┌──────────────────────────────────────────────────────────────────────────┐
  │                         Route by Operation                              │
  │                  (Read matching skill file → Execute)                    │
  ├──────────┬───────────┬──────────┬───────────────┬──────────────────────┤
  │  AUDIT   │  UPDATE   │  TEST    │  OPTIMIZE     │  CREATE-SKILL  │ SYSTEM-AUDIT   │
  ├──────────┼───────────┼──────────┼───────────────┼────────────────┼────────────────┤
  │📥 Agent  │📥 Agent   │📥 Agent  │📥 Agent file  │📥 Agent file   │📥 (no agent)   │
  │⚙️ Analyze │⚙️ Refactor │⚙️ 5 tests│⚙️ Reduce tokens│⚙️ Split to skills│⚙️ Check docs    │
  │📤 Report │📤 Updated │📤 Report │📤 Optimized   │📤 Skill files  │📤 Consistency  │
  │ (console)│   file    │(console) │  (30-50% less)│  + master      │   report       │
  └──────────┴───────────┴──────────┴───────────────┴────────────────┴────────────────┘
```

---

## Agent Chain Registry

**Source of truth for all workflow chains.** Used by AUDIT and UPDATE operations to validate agent chaining.

### Known Chains

| Workflow | Chain | File |
|----------|-------|------|
| Build App (full) | `scout(built-in) → planner(built-in) → implementer` | `build-app-workflow.md` |
| Build App (medium) | `scout(built-in) → implementer` | `build-app-workflow.md` |
| Build App (simple) | `implementer` | `build-app-workflow.md` |
| Testcase | `testcase-writer` (skill-based: init/import-spec/write/update) | `testcase-workflow.md` |
| Create Demo | `demo-folder-creator → scout → planner → designer → implementer → write-spec` | `create-demo-workflow.md` |
| Fix Demo | `scout → planner → designer → implementer` | `fix-demo-workflow.md` |
| Import Design (all modes) | `import-design` (skill-based: validate/single/multi/update) | `import-design-by-image-workflow.md` |
| AGIA | `agia` (skill-based: audit/update/test/optimize/create-skill) | `agia-workflow.md` |

### I/O Contracts Between Chained Agents

| From Agent | To Agent | Output Format | Key Fields |
|------------|----------|---------------|------------|
| `scout(built-in)` | `planner(built-in)` | Context (inline) | File paths, patterns, relevant code |
| `planner(built-in)` | `implementer` | Context (inline) | Implementation plan |
| `scout(built-in)` | `implementer` | Context (inline) | File paths + inline plan |
| `testcase-writer` | (standalone) | CSV `source/testcase/{feature}/result/` | Testcase CSV matching template |
| `demo-folder-creator` | `scout` | Folder path | `source/demo/{name}/` exists |
| `implementer` | `write-spec` | HTML files | `source/demo/{name}/pages/*.html` |

### Contract Reference

Full schema definitions: `.claude/agents/data-contracts.md`

---

## Operation Router

### Step 1: Parse Arguments

```
Input: "<operation> <agent-name>"
Extract: operation = first word
Extract: agent-name = second word
```

### Step 2: Validate Agent Exists

```
Check: .claude/agents/{agent-name}.md exists
If NOT exists → Error: "Agent '{agent-name}' not found"
If exists → Continue
```

### Step 3: Route to Skill

| Operation | Skill File | AGIA Phases |
|-----------|------------|-------------|
| `audit` | `skills/agia/audit.md` | Deconstruct + Audit |
| `update` | `skills/agia/update.md` | Synthesize + Iterate |
| `test` | `skills/agia/test.md` | Simulate |
| `optimize` | `skills/agia/optimize.md` | Techniques |
| `create-skill` | `skills/agia/create-skill.md` | Analyze + Generate |
| `system-audit` | `skills/agia/system-audit.md` | Discover + Verify docs |

**Execution:** Read the skill file at `.claude/agents/{skill path}` → Follow its steps → Apply shared validation from master agent.

**Note:** Chain validation procedure is defined in `agia.md` `[CHAIN_VALIDATION]` section. Not duplicated here.

---

## Error Handling

| Error | Response |
|-------|----------|
| Agent not found | "Agent '{name}' not found at .claude/agents/{name}.md" |
| Invalid operation | "Unknown operation. Use: audit, update, test, optimize, create-skill, system-audit" |
| No agent name | "Please provide agent name: /agent-audit {op} <agent-name>" |
| Update rejected | "Update cancelled. No changes made." |
| Optimize rejected | "Optimization cancelled. Original preserved." |
| Chain break detected | "WARNING: Update breaks chain '{chain}'. Downstream agent '{name}' expects {format}." |
| I/O contract mismatch | "Agent output schema does not match data-contracts.md. Fields missing: {fields}" |

---

## Success Criteria

| Operation | Success Condition |
|-----------|-------------------|
| audit | Report generated with ≥1 finding + chain validation completed |
| update | Agent file updated + chain validation PASS (or user acknowledged warnings) |
| test | 5/5 tests executed, results reported |
| optimize | ≥30% token reduction achieved |
| create-skill | Skill files created + master updated + no chain breaks |
| system-audit | Consistency report generated, inconsistencies listed with fixes |

---

## Related Files

| File | Purpose |
|------|---------|
| `.claude/agents/agia.md` | AGIA master agent (shared logic + routing) |
| `.claude/agents/skills/agia/audit.md` | Audit operation skill |
| `.claude/agents/skills/agia/update.md` | Update operation skill |
| `.claude/agents/skills/agia/test.md` | Test operation skill |
| `.claude/agents/skills/agia/optimize.md` | Optimize operation skill |
| `.claude/agents/skills/agia/create-skill.md` | Create-skill operation skill |
| `.claude/agents/skills/agia/system-audit.md` | System-audit operation skill |
| `.claude/commands/agent-audit.md` | Command entry point |
| `.claude/agents/*.md` | Target agents for operations |
| `.claude/agents/data-contracts.md` | I/O schema definitions for agent chains |
| `.claude/workflows/build-app-workflow.md` | Build App chain: scout(built-in) → planner(built-in) → implementer |
| `.claude/workflows/testcase-workflow.md` | Testcase chain: testcase-writer (skill-based) |
| `.claude/workflows/create-demo-workflow.md` | Demo chain: demo-folder-creator → ... → write-spec |
| `.claude/workflows/fix-demo-workflow.md` | Fix chain: scout → planner → designer → implementer |
