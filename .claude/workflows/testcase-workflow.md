# Testcase Workflow

**Purpose:** Execute QA testcase operations — init, import specs, write and update testcases.

**Agent:** `testcase-writer` (skill-based architecture)

**Command:** `/testcase <operation> [feature-name]`

---

## Operation Data Flow

```
[User Request: /testcase {operation} {feature-name}]
      |
  +-----------------------+
  |   Parse Arguments     |
  +-----------------------+
  Input: "<operation> [feature-name]"
  Extract: operation + feature-name
  Output: Validated params
      |
  +-----------------------+
  |  Validate Operation   |
  +-----------------------+
  Input: operation
  Check: is valid (init/import-spec/write/update)
  Output: Valid operation OR error
      |
  +-----------------------+
  | Check Prerequisites   |
  +-----------------------+
  Input: operation + feature-name
  Check: template/spec/rules/testcases exist (per operation)
  Output: Ready OR error with guidance
      |
  +------------------------------------------------------------------------+
  |                       Route by Operation                               |
  |              (Read matching skill file -> Execute)                     |
  +----------+--------------+----------+----------+
  |   INIT   | IMPORT-SPEC  |  WRITE   |  UPDATE  |
  +----------+--------------+----------+----------+
  | Setup    | PDF -> spec  | Generate | Modify   |
  | template | + component  | testcase | existing |
  | + rules  | mapping      | CSV      | testcases|
  +----------+--------------+----------+----------+
```

---

## Agent Chain

```
testcase-writer (skill-based: init / import-spec / write / update)
```

Single agent with skill routing. No chaining required.

---

## Operation Router

### Step 1: Parse Arguments

```
Input: "<operation> [feature-name]"
Extract: operation = first word
Extract: feature-name = remaining words (if any)
```

### Step 2: Validate Operation

```
Valid operations: init, import-spec, write, update
If invalid -> Error: "Unknown operation '{op}'. Use: init, import-spec, write, update"
```

### Step 3: Validate Feature-Name (if required)

```
Required for: import-spec, write, update
If missing -> Error: "Please provide feature name: /testcase {operation} {feature-name}"
NOT required for: init
```

### Step 4: Check Prerequisites

| Operation | Check | Error Message |
|-----------|-------|---------------|
| `init` | None | — |
| `import-spec` | Feature-name provided | "Provide feature name" |
| `write` | Template in `source/testcase/template/` | "Run `/testcase init` first" |
| `write` | Spec in `source/testcase/{feature}/spec/` | "Run `/testcase import-spec {feature}` first" |
| `write` | Rules at `source/testcase/rule/test-rules.md` | "Run `/testcase init` first" |
| `update` | Testcase at `source/testcase/{feature}/result/` | "Run `/testcase write {feature}` first" |

### Step 5: Route to Skill

Read the testcase-writer agent file at `.claude/agents/testcase-writer.md`, then load the matching skill:

| Operation | Skill File |
|-----------|------------|
| `init` | `.claude/agents/skills/testcase-writer/init.md` |
| `import-spec` | `.claude/agents/skills/testcase-writer/import-spec.md` |
| `write` | `.claude/agents/skills/testcase-writer/write.md` |
| `update` | `.claude/agents/skills/testcase-writer/update.md` |

---

## Approval Gates

| Operation | Gate | Trigger |
|-----------|------|---------|
| `init` | Confirm setup | After template + rules imported |
| `import-spec` | Confirm extraction | After spec extracted from PDF |
| `write` | Approve generation | Before writing CSV (show preview) |
| `update` | Approve changes | Before applying changes (show diff) |

---

## Error Handling

| Error | Response |
|-------|----------|
| Invalid operation | "Unknown operation '{op}'. Valid: init, import-spec, write, update" |
| Missing feature-name | "Please provide feature name: `/testcase {op} {feature-name}`" |
| Template not found | "No template found. Run `/testcase init` first." |
| Spec not found | "No spec found for '{feature}'. Run `/testcase import-spec {feature}` first." |
| Rules not found | "No rules found. Run `/testcase init` first." |
| Testcase not found | "No testcases for '{feature}'. Run `/testcase write {feature}` first." |
| PDF parse failure | "Could not parse PDF. Ensure file is a valid PDF document." |

---

## Success Criteria

| Operation | Success Condition |
|-----------|-------------------|
| `init` | Template + rules saved, folders created, user confirmed |
| `import-spec` | Spec extracted, config saved, user approved extraction |
| `write` | CSV generated matching template format, user approved, file written |
| `update` | Changes applied, format preserved, user approved, file updated |

---

## Related Files

| File | Purpose |
|------|---------|
| `.claude/agents/testcase-writer.md` | Testcase-writer master agent (shared logic + routing) |
| `.claude/agents/skills/testcase-writer/init.md` | Init operation skill |
| `.claude/agents/skills/testcase-writer/import-spec.md` | Import-spec operation skill |
| `.claude/agents/skills/testcase-writer/write.md` | Write operation skill |
| `.claude/agents/skills/testcase-writer/update.md` | Update operation skill |
| `.claude/commands/testcase.md` | Command entry point |
| `source/testcase/rule/test-rules.md` | Testcase rule definitions |
| `source/testcase/template/` | CSV template files |
