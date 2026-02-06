# AGIA Skill: CREATE-SKILL

> Loaded by master agent when operation = `create-skill`

**Purpose:** Automate skill file creation for any agent, following the established skill-based architecture pattern.

---

## Input

- **Agent name**: Target agent to split into skills
- **Skill description**: Specific skill to extract, OR "analyze and suggest" for auto-detection

---

## Step 1: Analyze Agent

1. Read target agent file: `.claude/agents/{agent-name}.md`
2. Count total lines and approximate word count
3. Identify logical sections:
   - **Shared logic**: Sections used by ALL operations (identification, constraints, validation)
   - **Operation-specific logic**: Sections used by only ONE operation (workflow steps, output templates)
4. Calculate potential token savings

---

## Step 2: Propose Skill Split

Present table showing section distribution:

| Section | Current Lines | Destination | Reason |
|---------|--------------|-------------|--------|
| [IDENTIFICATION] | {N} | Master | Shared by all |
| [CONSTRAINTS] | {N} | Master | Shared by all |
| [WORKFLOW Phase X] | {N} | Skill: {name} | Operation-specific |
| [OUTPUT_FORMAT Y] | {N} | Skill: {name} | Operation-specific |

Include estimated impact:

| Metric | Before | After |
|--------|--------|-------|
| Master lines | {current} | {reduced} |
| Per-invocation load | {current} | {master + 1 skill} |
| Token savings | - | ~{X}% |

---

## Step 3: Approval

Ask using AskUserQuestion:
```
"Create skill files for {agent-name}? {N} skills proposed."
Options: "Yes, create skills" | "No, cancel" | "Show me details first"
```

If "Show me details first" → display full proposed content for each skill file.

---

## Step 4: Generate Skill Files

For each skill file:

1. Create directory: `.claude/agents/skills/{agent-name}/`
2. Write skill file with header:
   ```markdown
   # AGIA Skill: {OPERATION_NAME}

   > Loaded by master agent when operation = `{operation}`

   ---
   ```
3. Move operation-specific sections from master into skill
4. Add output format template specific to this operation

---

## Step 5: Update Master Agent

1. Remove extracted sections from master
2. Add Skill Routing Table:
   ```markdown
   ## [SKILL_ROUTING]

   | Operation | Condition | Skill File |
   |-----------|-----------|------------|
   | {op} | `{keyword}` keyword | `.claude/agents/skills/{agent}/{op}.md` |
   ```
3. Add routing instruction: "After detecting operation: Read the matching skill file. Execute its steps."

---

## Step 6: Update Workflow

1. Read corresponding workflow file
2. Remove inline operation sections (now in skill files)
3. Add skill reference table in Operation Router
4. Keep shared sections (Chain Registry, Error Handling, Success Criteria)

---

## Step 7: Update Documentation

| File | Update |
|------|--------|
| README.md | Update agent description if listed in agents table |
| docs/user-guide.md | Update agent section if exists |
| agia-workflow.md | Update Chain Registry if agent is in chains |

---

## Step 8: Verify

1. Read master → verify no operation-specific templates remain
2. Read each skill → verify only unique logic (no duplication)
3. Read workflow → confirm skill references replace inline operations
4. Grep `.claude/` for orphan references to old section names

---

## Output Format

```markdown
## Skill Creation Report: {agent-name}

### Files Created
| File | Lines | Purpose |
|------|-------|---------|
| `skills/{agent}/{op}.md` | {N} | {operation description} |

### Sections Moved
| Section | From | To |
|---------|------|----|
| {section name} | Master | `skills/{agent}/{op}.md` |

### Token Impact
| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Master lines | {X} | {Y} | -{Z}% |
| Per-invocation load | {X} | {Y} | -{Z}% |

### Chain Integrity
- Chain breaks: {none / list}
- I/O contracts: unchanged
```
