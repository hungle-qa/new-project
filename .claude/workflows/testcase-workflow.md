# Testcase Workflow

**Purpose:** Execute QA testcase operations — write and update testcases.

**Agent:** `testcase-writer` (skill-based architecture)

**Command:** `/testcase <operation> <feature-name>`

---

## Operation Data Flow

```
[User Request: /testcase {operation} {feature-name}]
      |
  +-----------------------+
  |   Parse Arguments     |
  +-----------------------+
  Input: "<operation> <feature-name>"
  Extract: operation + feature-name
  Output: Validated params
      |
  +-----------------------+
  |  Validate Operation   |
  +-----------------------+
  Input: operation
  Check: is valid (write/update)
  Output: Valid operation OR error
      |
  +-----------------------+
  | Check Prerequisites   |
  +-----------------------+
  Input: operation + feature-name
  Check: template/spec/rules/testcases exist (per operation)
  Output: Ready OR error with guidance
      |
  +-------------------------------+
  |     Route by Operation        |
  | (Read skill file -> Execute)  |
  +----------+----------+
  |  WRITE   |  UPDATE  |
  +----------+----------+
  | Generate | Modify   |
  | testcase | existing |
  | CSV      | testcases|
  +----------+----------+
```

---

## Agent Chain

```
testcase-writer (skill-based: write / update)
```

Single agent with skill routing. No chaining required.

---

## Operation Router

### Step 1: Parse Arguments

```
Input: "<operation> <feature-name>"
Extract: operation = first word
Extract: feature-name = remaining words
```

### Step 2: Validate Operation

```
Valid operations: write, update
If invalid -> Error: "Unknown operation '{op}'. Use: write, update"
```

### Step 3: Validate Feature-Name

```
Required for: write, update
If missing -> Error: "Please provide feature name: /testcase {operation} {feature-name}"
```

### Step 4: Check Prerequisites

| Operation | Check | Error Message |
|-----------|-------|---------------|
| `write` | Template at `source/testcase/template/template.json` (or rules fallback) | "No template found. Add template via the Web UI or add rules column definitions." |
| `write` | Spec in `source/testcase/{feature}/spec/` | "No spec found. Import spec via the Web UI first" |
| `write` | Rules at `source/testcase/rule/test-rules.md` | "No rules found. Add rules to source/testcase/rule/test-rules.md" |
| `update` | Testcase at `source/testcase/{feature}/result/` | "Run `/testcase write {feature}` first" |

### Step 5: Route to Skill

Read the testcase-writer agent file at `.claude/agents/testcase-writer.md`, then load the matching skill:

| Operation | Skill File |
|-----------|------------|
| `write` | `.claude/agents/skills/testcase-writer/write.md` |
| `update` | `.claude/agents/skills/testcase-writer/update.md` |

---

## Approval Gates

| Operation | Gate | Trigger |
|-----------|------|---------|
| `write` | Approve generation | Before writing CSV (show preview) |
| `update` | Approve changes | Before applying changes (show diff) |

---

## Error Handling

| Error | Response |
|-------|----------|
| Invalid operation | "Unknown operation '{op}'. Valid: write, update" |
| Missing feature-name | "Please provide feature name: `/testcase {op} {feature-name}`" |
| Template not found | "No template found. Add template via the Web UI or add rules column definitions." |
| Spec not found | "No spec found for '{feature}'. Import spec via the Web UI first." |
| Rules not found | "No rules found. Add rules to source/testcase/rule/test-rules.md" |
| Testcase not found | "No testcases for '{feature}'. Run `/testcase write {feature}` first." |

---

## Success Criteria

| Operation | Success Condition |
|-----------|-------------------|
| `write` | CSV generated matching template format, user approved, file written |
| `update` | Changes applied, format preserved, user approved, file updated |

---

## Related Files

| File | Purpose |
|------|---------|
| `.claude/agents/testcase-writer.md` | Testcase-writer master agent (shared logic + routing) |
| `.claude/agents/skills/testcase-writer/write.md` | Write operation skill |
| `.claude/agents/skills/testcase-writer/update.md` | Update operation skill |
| `.claude/commands/testcase.md` | Command entry point |
| `source/testcase/rule/test-rules.md` | Testcase rule definitions |
| `source/testcase/template/template.json` | JSON template (column definitions with writingStyle) |
