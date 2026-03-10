# Skill: WRITE

**Purpose:** Generate testcases from context-digest (contains spec + template + rules + knowledge).
**Trigger:** `write` keyword + feature-name

---

## Steps

### Step 1: Load Context Digest

1. Check digest freshness:
```bash
curl -s http://localhost:3001/api/testcase/{feature}/digest-status
```
2. If `FRESH` → Read `source/testcase/feature/{feature}/context-digest.md`. Show: "Using cached context digest."
3. If `STALE` → Call regenerate endpoint, then read the digest:
```bash
curl -s -X POST http://localhost:3001/api/testcase/{feature}/context-digest
```
   Then read `source/testcase/feature/{feature}/context-digest.md`.

**The digest is the SINGLE source of truth.** It contains spec, rules, template columns, strategy, terminology, and components. Do NOT read individual source files.

### Step 2: Note Existing Testcases

- Glob `source/testcase/feature/{feature}/result/*.csv`
- If exists → Show: "Found {N} existing testcase file(s). A new file will be created alongside them."

### Step 3: Generate Testcase Matrix

Generate testcases using ONLY the digest content. Follow these rules:

**Column order:** Use the digest's `## Merged Column Order` as CSV header. Write each column following the rules in `## Template Columns` and `## Rules Summary`.

**Coverage:** Generate testcases for items in `## Test Scope > ### TESTABLE`. Follow strategy from `## Strategy Guide`.

**Column mapping (GWT):** For each testcase, map as follows BEFORE writing:
- **Given → Test Data** as "Precondition: ...". If context is obvious from prior row, omit.
- **When → Steps**: numbered action verbs only (Navigate, Click, Type, Select, Enter, Hover, Scroll). Last step always: `{N}. Verify {component/element}`.
- **Then → Expected**: `- ` bullets, each an observable state. Never describe a user action here.


### Step 4: Write CSV

1. Run `date +"%Y%m%d-%H%M%S"` and capture output as `{timestamp}`.
2. Write CSV content **from Step 3** to `source/testcase/feature/{feature}/result/{feature}-testcase-{timestamp}.csv`
3. Write metadata sidecar:

```bash
node -e "
process.chdir('$(pwd)');
const fs = require('fs');
const csv = fs.readFileSync('source/testcase/feature/{feature}/result/{feature}-testcase-{timestamp}.csv', 'utf-8');
let rows = 0, inQuote = false;
for (let i = 0; i < csv.length; i++) {
  if (csv[i] === '\"') inQuote = !inQuote;
  else if (csv[i] === '\n' && !inQuote) rows++;
}
const testCount = Math.max(0, rows - 1);
fs.writeFileSync('source/testcase/feature/{feature}/result/{feature}-testcase-{timestamp}.csv.metadata.json', JSON.stringify({ test_count: testCount }, null, 2));
"
```

4. Confirm: "Done! {N} testcases written to {path}"

**CRITICAL:** Write the exact matrix from Step 3. Do NOT regenerate. Always create a NEW timestamped file.

---

## Error Handling

| Error | Response |
|-------|----------|
| Missing spec | "No spec found. Import via Web UI first." |
| Missing rules | "No rules found (checked per-feature and global fallback)." |
| Digest regeneration fails | Show error, suggest checking server is running. |
