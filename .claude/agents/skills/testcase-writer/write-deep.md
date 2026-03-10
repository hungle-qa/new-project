# Skill: WRITE-DEEP

**Purpose:** 2-pass testcase generation for maximum quality. Pass 1 generates a scaffold (test plan), validates it, then Pass 2 fills in the full matrix.
**Trigger:** `write-deep` keyword + feature-name

---

## Steps

### Step 1: Load Context Digest

1. **Always regenerate** the context digest to ensure latest rules/spec/template:
```bash
curl -s -X POST http://localhost:3001/api/testcase/{feature}/context-digest
```
2. Read the regenerated digest: `source/testcase/feature/{feature}/context-digest.md`. Show: "Context digest regenerated."

**The digest is the SINGLE source of truth.** Do NOT read individual source files.

### Step 2: Note Existing Testcases

- Glob `source/testcase/feature/{feature}/result/*.csv`
- If exists → Show: "Found {N} existing testcase file(s). A new file will be created alongside them."

### Step 3: Pass 1 — Generate Scaffold

Focus on the digest's `## Rules Summary` (consolidation, multi-AC mapping, boundary testing, scope) and `## Test Scope`. Generate a **test scaffold** — a lightweight plan of WHAT to test, not HOW.

Output scaffold as a numbered list:

```
## Scaffold ({N} tests)

| # | ID | Title | AC Mapping | Scope Note |
|---|-----|-------|------------|------------|
| 1 | US10-1 | Open popup via CTA and verify defaults | US10 / AC1 | entry + defaults merge |
| 2 | US10-2 | Open popup via Day view time slot | US10 / AC1 | time slot prefill |
| ... | ... | ... | ... | ... |
```

**Scaffold rules:**
- Apply Consolidation Strategy: merge/split per rules
- Apply Multi-AC Mapping: list all ACs each test covers
- Apply Boundary Testing: representative categories, not exhaustive
- Apply Scope ratios: ~60% happy, ~25% edge, ~10% negative, ~5% visual
- Include US header rows (empty ID, title only)
- Step target: 5-8 steps per test — if scope note suggests 2-3 steps, consider merging

### Step 4: Validate Scaffold

Self-check the scaffold before proceeding:

1. **AC Coverage:** Every AC in `## Test Scope > ### TESTABLE` has at least 1 test
2. **Count Check:** Total tests should be reasonable for the spec size (typically 8-15 tests per US with 4-5 ACs)
3. **Merge/Split:** No test with only 2-3 implied steps (should merge). No test with 10+ implied steps (should split)
4. **Cancel/Discard:** If spec has cancel/discard flows, verify 3 mandatory states exist (no changes→close, changes→discard via button, changes→discard via X)
5. **Required Patterns:** Check rules for any required pattern checklist items

If any check fails → fix the scaffold before proceeding. Show: "Scaffold validated: {N} tests, all ACs covered."

### Step 5: Pass 2 — Generate Full Matrix (JSON)

Using the scaffold as the outline, generate the complete testcase matrix. For each scaffold row, fill in ALL columns following `## Template Columns` rules.

**Column Content Integrity (CRITICAL):** Each column must contain ONLY its designated content type. After generating each row, self-check:
- **Step column**: only numbered action steps (1. Navigate, 2. Click, etc.). Never put expected outcomes or test data here.
- **Test Data column**: only preconditions and input values. Never put action steps or assertions here.
- **Expected column**: only observable outcomes as bullet assertions (`- `). Must be COMPLETE — never truncate to a single word (e.g., "Pending" alone or "duration" alone is WRONG). Write the full assertion sentence.
- **Verify**: could someone read each column independently and it makes sense on its own? If not, content is in the wrong column.

**IMPORTANT:** Follow the scaffold order and count exactly. Do NOT add or remove tests in this pass — only fill in the details.

**Output format:** JSON array. Column keys = exact column names from digest's `## Merged Column Order`. Omit Empty/spacer columns from JSON (Node.js injects them during conversion).

**US header rows:** `{ "_header": "US10. As a coach I can book a session..." }`

**Data rows example:**
```json
[
  { "_header": "US10. As a coach I can book a session..." },
  { "ID": "US10-1", "Test Scenarios": "Open popup via CTA", "Items for Pivot Table": "US10 / AC1", "Step": "1. Navigate...\n2. Click...", "Test Data": "Logged in as Owner.", "Expected": "- Popup opens\n- Fields visible" }
]
```

Rules:
- Keys = exact column names from `## Merged Column Order`
- `_header` rows = US group headers (content goes to 2nd column in CSV)
- Omit Empty/spacer columns — Node.js fills them
- Multiline fields use `\n`
- Valid JSON — parseable, no trailing commas

### Step 6: Write CSV (JSON-first via Node.js)

**Why JSON-first:** LLMs cannot reliably count consecutive CSV commas — output JSON, convert deterministically.

1. Run `date +"%Y%m%d-%H%M%S"` and capture output as `{timestamp}`. Use exact captured value.
2. Write JSON array from Step 5 to: `source/testcase/feature/{feature}/result/_temp.json`
3. Write conversion script to `source/testcase/feature/{feature}/result/_convert.js`:

```js
const fs = require("fs");
const data = JSON.parse(fs.readFileSync("source/testcase/feature/{feature}/result/_temp.json", "utf-8"));
const configRaw = fs.readFileSync("source/testcase/feature/{feature}/config.md", "utf-8");
const tplMatch = configRaw.match(/template:\s*(.+)/);
const tplName = (tplMatch ? tplMatch[1].trim() : "template");
const tpl = JSON.parse(fs.readFileSync("source/testcase/template/" + tplName + ".json", "utf-8"));
const colNames = tpl.map(c => c.name);
const quote = (v) => {
  if (v === null || v === undefined) return "";
  const s = String(v);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) return '"' + s.replace(/"/g, '""') + '"';
  return s;
};
const header = colNames.map(quote).join(",");
const rows = data.map(r => {
  if (r._header) {
    const cells = colNames.map((c, i) => i === 1 ? quote(r._header) : "");
    return cells.join(",");
  }
  return colNames.map(c => quote(r[c] !== undefined ? r[c] : null)).join(",");
});
const csv = header + "\n" + rows.join("\n") + "\n";
const outPath = "source/testcase/feature/{feature}/result/{feature}-testcase-{timestamp}.csv";
fs.writeFileSync(outPath, csv);
const testCount = data.filter(r => !r._header).length;
fs.writeFileSync(outPath + ".metadata.json", JSON.stringify({ test_count: testCount }, null, 2));
console.log("CSV written: " + testCount + " tests");
```

4. Run: `node source/testcase/feature/{feature}/result/_convert.js`
   - IF node exits with error: run `rm -f source/testcase/feature/{feature}/result/_temp.json source/testcase/feature/{feature}/result/_convert.js`. Report: "CSV conversion failed: {error output}. Temp files removed." STOP.

5. Delete temp files: `rm source/testcase/feature/{feature}/result/_temp.json source/testcase/feature/{feature}/result/_convert.js`
   - IF delete fails: Report: "Warning: temp files could not be deleted. Remove `_temp.json` and `_convert.js` manually."
6. Confirm: "Done! {N} testcases written to {path}"

**CRITICAL:** Write the exact matrix from Step 5. Do NOT regenerate. Always create a NEW timestamped file.

---

## Error Handling

| Error | Response |
|-------|----------|
| Missing spec | "No spec found. Import via Web UI first." |
| Missing rules | "No rules found (checked per-feature and global fallback)." |
| Digest regeneration fails | Show error, suggest checking server is running. |
| Scaffold validation fails | Fix scaffold, re-validate, then proceed to Pass 2. |
