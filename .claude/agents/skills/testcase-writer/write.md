# Skill: WRITE

**Purpose:** Generate testcases from spec + template + rules + knowledge.
**Trigger:** `write` keyword + feature-name

---

## Prerequisites

- Spec at `source/testcase/feature/{feature}/spec/*.md`
- Rules (cascading): `source/testcase/feature/{feature}/rules.md` (per-feature, if exists) OR `source/testcase/rule/test-rules.md` (global fallback)
- Template at `source/testcase/template/template.json` (or rules fallback)
- Strategy in `config.md` frontmatter (optional but recommended — set via Web UI Strategy tab)
- Structure in `config.md` frontmatter (optional — if defined, strictly controls module hierarchy; if empty, AI freestyles). Set via Template tab > Module Structure section.
- Scope hints in per-feature rules (`source/testcase/feature/{feature}/rules.md` → `## Scope` section). Auto-migrated from config on first Rules load.

---

## Steps

### Step 1: Load Context (Digest System)

1. Read `.claude/agents/skills/testcase-writer/digest-system.md` for digest freshness check and generation format.
2. Run the **Digest Freshness Check** (defined in digest-system.md)
3. If `FRESH` → Read only `source/testcase/feature/{feature}/context-digest.md`. Show: "Using cached context digest."
   - **Scope guard:** If cached digest lacks `## Test Scope` or `digest-version: 2` → treat as STALE, regenerate.
4. If `STALE` → Read all source files in order, then generate digest:
   - Config → Spec → Feature Knowledge → Knowledge files → Rules → Template → Components
   - **Build Test Scope:** Diff spec user stories/ACs against feature knowledge topics. Topics referenced in spec ACs → TESTABLE. Topics NOT referenced → OUT OF SCOPE.
   - Write digest to `source/testcase/feature/{feature}/context-digest.md` (using digest-version 2 format)
   - Show progress at each step: "Reading config...", "Reading spec...", etc.

### Step 2: Note Existing Testcases

- Glob `source/testcase/feature/{feature}/result/*.csv`
- If exists → Show: "Found {N} existing testcase file(s). A new file will be created alongside them."
- Always continue — each run creates a new timestamped file, never overwrites.

### Step 3: Generate Full Testcase Matrix

**Scope guard:** Generate testcases ONLY for items listed in `## Test Scope > ### TESTABLE`. If a feature/topic appears in `### OUT OF SCOPE`, do NOT create testcases for it — even if it appears in Terminology & Context.

Generate all testcases from digest, **guided by selected strategy** (detailed in digest):

**Strategy guide:** Follow the approach detailed in the digest's Strategy Guide section.
- **spec-driven:** US→Level 1, AC→Level 2, Given/When→Steps, Then→Expected Result
- **scenario-based:** EP, BVA, E2E Pathing
- **component-testing:** Atomic→Composite→Flow + CRUD/Persona/State lenses
- **None:** Balanced (happy paths + edge cases)

**Coverage targets:**
- Happy paths: normal flows, valid inputs (apply Scope Happy Case hints from digest)
- Edge cases: boundaries, empty/null, invalid inputs (apply Scope Corner Case hints from digest)

**Single-assertion rule (MANDATORY):** Each row MUST have exactly one verification in Expected Result. If a scenario produces multiple SHOULD statements, split into separate rows sharing the same Steps but each with a single Expected Result line.

**Tags (MANDATORY):** Assign at least one tag per testcase from: `happy`, `corner`, `negative`, `state`, `ui`, `a11y`, `perf`. Comma-separate multiple tags. Tag assignment guide:
- `happy` — normal flow, valid input
- `corner` — boundary, edge case
- `negative` — invalid input, error path
- `state` — state transition verification
- `ui` — visual/layout check
- `a11y` — accessibility
- `perf` — performance-sensitive

**Data Variants:** For parameterized scenarios, populate the Data Variants column with `key=value | key=value` pairs and use `{key}` placeholders in the Steps column. Each variant combination becomes its own row. Leave Data Variants empty if the case has no parameterized data.

**Module assignment:**
- **Structure defined:** STRICTLY follow tree (from digest). Test ONLY leaf nodes. Replace Module column with Level 1..N columns.
- **Structure empty:** AI freestyles grouping. Use single Module column.

**Writing style:** Follow each column's `writingStyle` (from digest) exactly.

**Multi-line formatting (MANDATORY):** Every line break inside a CSV cell MUST be prefixed with a bullet or number:
- **Steps:** `Precondition: ...` on first line, then numbered steps (`1. `, `2. `, ...).
- **Expected Result:** Each expectation on its own line prefixed with `- ` bullet (e.g., `- SHOULD ...`).
- **Any other column:** If content spans multiple lines, each line MUST start with `- ` or a number. No bare line breaks.

**Format as CSV** using digest's Merged Column Order. IDs: `{MODULE_CODE}-{NNN}`. Priority: per rules mapping.

**Output deduplication (merged-cell style):**
1. **Group** all testcases by Level 1 → Level 2 before output (sort order = Level 1 → Level 2, not raw ID sequence — IDs may be non-sequential within a group).
2. **Level columns:** If same as previous row → blank. Show value only on first row of each group.
3. **Steps column:** If same precondition AND same steps as previous row in same Level 2 group → blank (row adds only a new Description + Expected Result verification). If precondition or steps differ → show full Steps.

**IMPORTANT — Store matrix for Step 5:** Hold the complete CSV content (header + all rows) in memory after generation. Do NOT discard it. Step 5 will write this directly to file.

### Step 4: Preview and Approve

Show **summary only** (no full markdown table):
- Strategy used + grouping approach chosen
- Per-group breakdown: Level 1 → Level 2 → testcase count per group
- Total: {N} testcases ({X} happy, {Y} edge)
- Priority breakdown: {Critical}, {High}, {Medium}, {Low}
- Tag distribution: {N} happy, {N} corner, {N} negative, {N} state, {N} ui, {N} a11y, {N} perf
- Data Variants: {N} parameterized rows (with variants), {N} static rows (no variants)
- Dedup stats: {N} Level 1 blanked, {N} Level 2 blanked, {N} Steps blanked

AskUserQuestion: "Approve testcase generation?"
- "Approve and write"
- "Modify (specify changes)"
- "Cancel"

### Step 5: Write CSV

1. Generate timestamp: `YYYYMMDD-HHmmss` (e.g., `20260211-143000`)
2. Write the CSV content **stored from Step 3** directly to `source/testcase/feature/{feature}/result/{feature}-testcase-{timestamp}.csv`
3. Write metadata sidecar (MANDATORY — run via Bash immediately after CSV is written):

```bash
node -e "
process.chdir('$(pwd)');
const fs = require('fs');
const path = require('path');

// Fix test_count: quoted-field-aware row counter
const csv = fs.readFileSync('source/testcase/feature/{feature}/result/{feature}-testcase-{timestamp}.csv', 'utf-8');
let rows = 0, inQuote = false;
for (let i = 0; i < csv.length; i++) {
  if (csv[i] === '\"') inQuote = !inQuote;
  else if (csv[i] === '\n' && !inQuote) rows++;
}
const testCount = Math.max(0, rows - 1);

// Token estimation
const specDir = 'source/testcase/feature/{feature}/spec';
let specChars = 0;
try {
  fs.readdirSync(specDir).filter(f => f.endsWith('.md')).forEach(f => {
    specChars += fs.readFileSync(path.join(specDir, f), 'utf-8').length;
  });
} catch(e) {}
let skillChars = 0;
try { skillChars = fs.readFileSync('.claude/agents/skills/testcase-writer/write.md', 'utf-8').length; } catch(e) {}
const csvChars = csv.length;

const estInput = Math.ceil((specChars + skillChars) / 4);
const estOutput = Math.ceil(csvChars / 4);
const estTotal = estInput + estOutput;
const rowsPerToken = estTotal > 0 ? Math.round((testCount / estTotal) * 10000) / 10000 : null;

const metadata = { test_count: testCount, est_input_tokens: estInput, est_output_tokens: estOutput, est_total_tokens: estTotal, rows_per_token: rowsPerToken };
fs.writeFileSync('source/testcase/feature/{feature}/result/{feature}-testcase-{timestamp}.csv.metadata.json', JSON.stringify(metadata, null, 2));
"
```
   - IF metadata write fails: Log warning only. Do NOT stop. The CSV is already saved.

4. Confirm: "Done! {N} testcases written to {path}"

**CRITICAL — Do NOT regenerate:** Write the exact CSV matrix produced in Step 3. Do NOT re-read the digest, do NOT re-derive testcases. The content is already approved from Step 4.

**IMPORTANT:** Always create a NEW file with timestamp. Never overwrite existing result files. Users can delete old files via the Testcase Manager > Review & Export tab.

---

## Error Handling

| Error | Response |
|-------|----------|
| Missing spec | "No spec found. Import via Web UI first." |
| Missing rules (both per-feature and global) | "No rules found (checked per-feature and global fallback)." |
| No template | Use rules column fallback. Log: "No template.json, using rules format." |
| Knowledge not found | Proceed without it, log warning. |
