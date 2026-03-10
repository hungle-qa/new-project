# Skill: WRITE

**Purpose:** Generate testcases from context-digest (contains spec + template + rules + knowledge).
**Trigger:** `write` keyword + feature-name

---

## Steps

### Step 1: Load Context Digest

1. **Always regenerate** the context digest to ensure latest rules/spec/template:
```bash
curl -s -X POST http://localhost:3001/api/testcase/{feature}/context-digest
```
2. Read the regenerated digest: `source/testcase/feature/{feature}/context-digest.md`. Show: "Context digest regenerated."

**The digest is the SINGLE source of truth.** It contains spec, rules, template columns, strategy, terminology, and components. Do NOT read individual source files.

### Step 2: Note Existing Testcases

- Glob `source/testcase/feature/{feature}/result/*.csv`
- If exists → Show: "Found {N} existing testcase file(s). A new file will be created alongside them."

### Step 3: Generate Testcase Matrix (JSON)

Generate testcases using ONLY the digest content. Follow these rules:

**Coverage:** Generate testcases for items in `## Test Scope > ### TESTABLE`. Follow strategy from `## Strategy Guide`.

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

### Step 4: Write CSV (JSON-first via Node.js)

**Why JSON-first:** LLMs cannot reliably count consecutive CSV commas — output JSON, convert deterministically.

1. Run `date +"%Y%m%d-%H%M%S"` and capture output as `{timestamp}`. Use exact captured value.
2. Write JSON array from Step 3 to: `source/testcase/feature/{feature}/result/_temp.json`
3. Run Node.js conversion:

```bash
node -e "
process.chdir('$(pwd)');
const fs = require('fs');
const path = require('path');
const data = JSON.parse(fs.readFileSync('source/testcase/feature/{feature}/result/_temp.json', 'utf-8'));
const tplPath = fs.existsSync('source/testcase/feature/{feature}/template.json')
  ? 'source/testcase/feature/{feature}/template.json'
  : 'source/testcase/template/template.json';
const tpl = JSON.parse(fs.readFileSync(tplPath, 'utf-8'));
const colNames = tpl.map(c => c.name);
const quote = (v) => {
  if (v === null || v === undefined) return '';
  const s = String(v);
  if (s.includes(',') || s.includes('\"') || s.includes('\n')) return '\"' + s.replace(/\"/g, '\"\"') + '\"';
  return s;
};
const header = colNames.map(quote).join(',');
const rows = data.map(r => {
  if (r._header) {
    const cells = colNames.map((c, i) => i === 1 ? quote(r._header) : '');
    return cells.join(',');
  }
  return colNames.map(c => quote(r[c] !== undefined ? r[c] : null)).join(',');
});
const csv = header + '\n' + rows.join('\n') + '\n';
const outPath = 'source/testcase/feature/{feature}/result/{feature}-testcase-{timestamp}.csv';
fs.writeFileSync(outPath, csv);
const testCount = data.filter(r => !r._header).length;
fs.writeFileSync(outPath + '.metadata.json', JSON.stringify({ test_count: testCount }, null, 2));
"
```
   - IF `node -e` exits with error: run `rm -f source/testcase/feature/{feature}/result/_temp.json`. Report: "CSV conversion failed: {error output}. Temp file removed." STOP.

4. Delete temp file: `rm source/testcase/feature/{feature}/result/_temp.json`
   - IF delete fails: Report: "Warning: temp file `_temp.json` could not be deleted. Remove it manually."
5. Confirm: "Done! {N} testcases written to {path}"

**CRITICAL:** Write the exact matrix from Step 3. Do NOT regenerate. Always create a NEW timestamped file.

---

## Error Handling

| Error | Response |
|-------|----------|
| Missing spec | "No spec found. Import via Web UI first." |
| Missing rules | "No rules found (checked per-feature and global fallback)." |
| Digest regeneration fails | Show error, suggest checking server is running. |
