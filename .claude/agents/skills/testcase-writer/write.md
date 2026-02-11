# Skill: WRITE

**Purpose:** Generate testcases from spec + template + rules + knowledge.
**Trigger:** `write` keyword + feature-name

---

## Prerequisites

- Spec at `source/testcase/{feature}/spec/*.md`
- Rules at `source/testcase/rule/test-rules.md`
- Template at `source/testcase/template/template.json` (or rules fallback)

---

## Steps

### Step 1: Load Context (Digest System)

1. Run the **Digest Freshness Check** from the master agent (`testcase-writer.md` → Context Digest System)
2. If `FRESH` → Read only `source/testcase/{feature}/context-digest.md`. Show: "Using cached context digest."
3. If `STALE` → Read all source files in order, then generate digest:
   - Config → Feature Knowledge → Knowledge files → Rules → Template → Spec → Components
   - Write digest to `source/testcase/{feature}/context-digest.md`
   - Show progress at each step: "Reading config...", "Reading spec...", etc.

### Step 2: Check for Existing Testcases

- Glob `source/testcase/{feature}/result/*.csv`
- If exists → AskUserQuestion: "Testcases already exist. Overwrite or use `/testcase update`?"
  - "Overwrite" → continue
  - "Cancel" → stop

### Step 3: Generate 5 Example Testcases

Generate 5 representative testcases for user review:
- 2 happy path (from spec ACs + config `scope.happy_case`)
- 2 corner/edge (from rules + config `scope.corner_case`)
- 1 integration/E2E

**Format as markdown table** using template columns. Follow each column's `writingStyle` precisely.

AskUserQuestion: "Here are 5 example testcases. Review before I generate the full set."
- "Approve style - generate full set"
- "Adjust (specify changes)"
- "Cancel"

If "Adjust" → apply feedback, regenerate 5, re-ask. Repeat until approved.

### Step 4: Generate Full Testcase Matrix

Generate all testcases from digest context:

**Happy path** (each AC → at least 1 case):
- Normal user flows, valid inputs, success states
- Apply config `scope.happy_case` hints

**Corner/edge cases:**
- Boundary values, empty/null states, invalid inputs
- State transitions, component-specific edges
- Apply config `scope.corner_case` hints

**Module assignment:** Use config `levels` hierarchy (L1=component, L2=sub-component, L3=function)

**Writing style:** Follow each template column's `writingStyle` instruction exactly.

### Step 5: Format as CSV

1. Match template column structure exactly
2. Generate unique IDs: `{MODULE_CODE}-{NNN}` (e.g., INBOX-001)
3. Assign priority per rules mapping (Critical/High/Medium/Low)

### Step 6: Preview and Approve

Show **full testcase set as markdown table** + summary:
- Total: {N} testcases ({X} happy, {Y} edge, {Z} integration)
- Priority breakdown: {Critical}, {High}, {Medium}, {Low}

AskUserQuestion: "Approve testcase generation?"
- "Approve and write"
- "Modify (specify changes)"
- "Cancel"

### Step 7: Write CSV

1. Write to `source/testcase/{feature}/result/{feature}-testcase.csv`
2. Confirm: "Done! {N} testcases written to {path}"

---

## Error Handling

| Error | Response |
|-------|----------|
| Missing spec | "No spec found. Import via Web UI first." |
| Missing rules | "No rules found at `source/testcase/rule/test-rules.md`." |
| No template | Use rules column fallback. Log: "No template.json, using rules format." |
| Knowledge not found | Proceed without it, log warning. |
| File exists | Ask overwrite or cancel. |
