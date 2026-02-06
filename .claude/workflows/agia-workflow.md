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
  │  AUDIT   │  UPDATE   │  TEST    │  OPTIMIZE     │  CREATE-SKILL        │
  ├──────────┼───────────┼──────────┼───────────────┼──────────────────────┤
  │📥 Agent  │📥 Agent   │📥 Agent  │📥 Agent file  │📥 Agent file         │
  │⚙️ Analyze │⚙️ Refactor │⚙️ 5 tests│⚙️ Reduce tokens│⚙️ Split to skills     │
  │📤 Report │📤 Updated │📤 Report │📤 Optimized   │📤 Skill files        │
  │ (console)│   file    │(console) │  (30-50% less)│  + updated master    │
  └──────────┴───────────┴──────────┴───────────────┴──────────────────────┘
```

---

## Agent Chain Registry

**Source of truth for all workflow chains.** Used by AUDIT and UPDATE operations to validate agent chaining.

### Known Chains

| Workflow | Chain | File |
|----------|-------|------|
| Primary (full) | `scout → planner → designer → implementer` | `primary-workflow.md` |
| Primary (medium) | `quick-scout → implementer` | `primary-workflow.md` |
| Primary (simple) | `implementer` | `primary-workflow.md` |
| Create Demo | `demo-folder-creator → scout → planner → designer → implementer → write-spec` | `create-demo-workflow.md` |
| Fix Demo | `scout → planner → designer → implementer` | `fix-demo-workflow.md` |
| Import Design (all modes) | `import-design` (skill-based: validate/single/multi/update) | `import-design-by-image-workflow.md` |
| AGIA | `agia` (skill-based: audit/update/test/optimize/create-skill) | `agia-workflow.md` |

### I/O Contracts Between Chained Agents

| From Agent | To Agent | Output Format | Key Fields |
|------------|----------|---------------|------------|
| `scout` | `planner` | JSON `.agent-output/scout-{ts}.json` | `task`, `scope`, `files`, `patterns_found` |
| `planner` | `designer` | MD `plans/{slug}-plan.md` | frontmatter: `title`, `status`, `module`, `target`, `scout_output` |
| `designer` | `implementer` | JSON `.agent-output/designer-{ts}.json` | `feature`, `plan_file`, `layout`, `components` |
| `planner` | `implementer` | MD `plans/{slug}-plan.md` | (same as planner → designer) |
| `quick-scout` | `implementer` | Inline (console) | File list + inline plan |
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

**Execution:** Read the skill file at `.claude/agents/{skill path}` → Follow its steps → Apply shared validation from master agent.

---

## Chain Validation Step

**Reusable procedure** called by AUDIT (in audit skill) and UPDATE (in update skill).

### Inputs

- `agent-name`: The agent being validated
- `agent-file`: The agent's `.md` file content (current or updated)

### Procedure

```
1. DISCOVER chains containing this agent
   → Scan Chain Registry (above) for agent-name in any chain
   → If agent not in any chain → report "standalone agent, no chain validation needed"
   → If found → collect all chains

2. For EACH chain containing the agent:
   a. IDENTIFY position
      → Find agent's index in chain array
      → Determine upstream agent (index - 1) or "none" if first
      → Determine downstream agent (index + 1) or "none" if last

   b. VALIDATE upstream compatibility (if upstream exists)
      → Read upstream agent file
      → Extract output format from upstream's I/O Summary or Output section
      → Extract input format from target agent's I/O Summary or Input section
      → Check: Does upstream output match target's expected input?

   c. VALIDATE downstream compatibility (if downstream exists)
      → Read downstream agent file
      → Extract input format from downstream's I/O Summary or Input section
      → Extract output format from target agent's I/O Summary or Output section
      → Check: Does target output match downstream's expected input?

   d. VALIDATE tools sufficiency
      → Extract agent's tools from frontmatter
      → Check: Can agent READ upstream output with its tools?
      → Check: Can agent WRITE output for downstream?

   e. CHECK data contracts
      → Read .claude/agents/data-contracts.md
      → Verify agent's output matches schema defined in contracts

3. COMPILE results into Chain Validation table
```

### Checks Summary

| # | Check | Method | PASS Condition |
|---|-------|--------|----------------|
| 1 | Agent in chain | Registry lookup | Found in ≥1 chain OR standalone |
| 2 | Upstream I/O match | Compare output→input formats | Formats compatible |
| 3 | Downstream I/O match | Compare output→input formats | Formats compatible |
| 4 | Tools sufficient | Frontmatter tools vs required ops | All required tools present |
| 5 | Data contract compliance | Compare vs data-contracts.md | Schema fields present |
| 6 | No circular deps | Trace chain for loops | No agent appears twice |
| 7 | Workflow file references | Check workflow .md references agent | Agent name matches |

### Output

```markdown
### Chain Validation: {agent-name}

**Chains found:** {count}

| # | Chain | Position | Upstream → Agent | Agent → Downstream | Tools OK | Contract OK | Status |
|---|-------|----------|------------------|--------------------|----------|-------------|--------|

**Issues:** {none | list of issues}
```

---

## Error Handling

| Error | Response |
|-------|----------|
| Agent not found | "Agent '{name}' not found at .claude/agents/{name}.md" |
| Invalid operation | "Unknown operation. Use: audit, update, test, optimize, create-skill" |
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
| `.claude/commands/agent-audit.md` | Command entry point |
| `.claude/agents/*.md` | Target agents for operations |
| `.claude/agents/data-contracts.md` | I/O schema definitions for agent chains |
| `.claude/workflows/primary-workflow.md` | Primary chain: scout → planner → designer → implementer |
| `.claude/workflows/create-demo-workflow.md` | Demo chain: demo-folder-creator → ... → write-spec |
| `.claude/workflows/fix-demo-workflow.md` | Fix chain: scout → planner → designer → implementer |
