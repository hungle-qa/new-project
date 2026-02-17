# Skill: WRITE-LITE

**Purpose:** Generate spec-driven testcases from spec + rules only. No digest, no extras.
**Trigger:** `write-lite` keyword + feature-name

## CRITICAL EXECUTION RULES

**NO approval.** Flow: Read → Parse → Generate → Write → Report. One pass, no stopping.

**Progress (MANDATORY):** Show status before each action: `Reading spec...` → `Reading rules... (per-feature|global)` → `Parsing {N} US / {N} AC...` → `Generating matrix...` → `Writing CSV to {path}...` → `Done. {N} testcases.`

## Prerequisites

- Spec: `source/testcase/{feature}/spec/*.md` (REQUIRED)
- Rules: `source/testcase/{feature}/rules.md` first → if not exists → `source/testcase/rule/test-rules.md`

## Fixed Columns

`No., US, AC, Step, Title, Expectation, Priority`

## Steps

### Step 1: Load Context

1. **Check digest-lite** — Read `source/testcase/{feature}/context-digest-lite.md`
   - If exists → use ONLY this file. Skip spec + rules. Show: `Using cached context (lite digest).`
   - If NOT exists → fall back to step 1b/1c below.
2. **Spec (fallback)** — Glob `source/testcase/{feature}/spec/*.md`, read all
3. **Rules (fallback)** — Check per-feature first → if exists, read ONLY it. If not → read global.

### Step 2: Parse US/AC/GWT

**If using digest-lite:** GWT is already pre-parsed — skip parsing, go straight to Step 3.

**If using raw spec:** Extract every US (id + title), AC (id + description), Given/When/Then. Every AC MUST be captured.

### Step 3: Generate Testcase Matrix

**GWT Mapping:** Given → first step(s) IF unique context, DROP if obvious. When → numbered steps. Then → `- SHOULD ...` in Expectation.

**Title (NEVER empty):** Short noun-phrase label, NOT steps. Max ~8 words, unique per row. Describes WHAT, not HOW. Example: "Pro plan", "Free plan - hover tooltip"

**Rules:**
1. Every AC → at least one row
2. NO corner/edge cases unless explicitly in spec
3. **Single-assertion (STRICT):** Each row = exactly ONE `- SHOULD ...`. NEVER multiple SHOULD in one row. Split multi-verification into separate rows with same Steps (or blank) but different Title.
4. Priority: rules mapping if available; default High (main) / Medium (secondary)

**Ordering:** E2E flow within each AC: setup → action → verify.

**High-level steps:** "Login as Admin" not detailed login steps. Detail only feature-specific actions.

**Dedup (merged-cell):** Group by US → AC. US/AC/Steps → blank if same as previous row. Title NEVER blanked.

**Variant dedup (CRITICAL):**
- **Case A — Same expectation:** Merge into ONE row. Title = "Trial / Pro / Studio / Bundle plan", Steps use `{plan}` placeholder.
- **Case B — Different expectation:** Row 1 = full Steps + variant Title. Row 2+ = Steps blank, variant Title, specific Expectation.

**IDs:** Sequential from 1. **CSV columns:** `No., US, AC, Step, Title, Expectation, Priority`

### Step 4: Write CSV

1. Timestamp `YYYYMMDD-HHmmss`, write to `source/testcase/{feature}/result/{feature}-testcase-lite-{timestamp}.csv`
2. Summary: US count, AC count, total testcases, per-AC breakdown, completeness check, priority breakdown, output path

**Do NOT regenerate.** Write exact matrix from Step 3. Always NEW timestamped file (`-lite-` suffix).

## Error Handling

| Error | Response |
|-------|----------|
| No spec | "No spec found. Import via Web UI first." |
| No rules | "No rules found. Using default priority (High/Medium)." |
| Empty GWT | "AC {id} missing Given/When/Then. Add structured criteria." |
