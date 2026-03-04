# Skill: write-lite-v2

Extends write-lite with rules reading and an approval gate for corner cases.

---

## Step 1: Load Spec

Glob `source/testcase/feature/{feature}/spec/*.md` — read all files found.

If no spec files found: STOP → "No spec found. Import via Web UI first."

Store combined content as `{spec_content}`.

---

## Step 2: Load Rules

Read `source/testcase/feature/{feature}/rules.md`.

If not found, fall back to `source/testcase/rule/test-rules.md` (global default).

If neither found: proceed without rules (note this in output).

Store as `{rules_content}`.

---

## Step 3: Parse US/AC/GWT

Same as write-lite Step 2:

- Extract User Stories (US), Acceptance Criteria (AC), Given/When/Then blocks from `{spec_content}`.
- Group by feature area / user story.
- Identify Happy, Corner, Negative scenarios per AC.

---

## Step 4: Generate Spec-Driven Base Matrix

Same as write-lite Step 3 (Rules A–F) — generate testcase rows from spec ACs only. No rule-based extras yet.

Store resulting rows as `{base_matrix}`.

---

## Step 5: Derive Corner Case Questions from Rules

Analyze `{rules_content}`. Identify behaviors mandated by rules that are NOT already covered by spec ACs in `{base_matrix}`.

Focus on:
- Scope rules (Happy / Corner / Negative coverage ratios)
- Constraint rules (field limits, state restrictions, permission boundaries)
- Priority rules (Critical / High / Medium / Low assignment criteria)

Generate a numbered question list:

```
Based on your rules, should I also test:
1. [specific corner/edge case question derived from a rule]
2. [specific corner/edge case question derived from a rule]
...
```

**Save ALL questions to `source/testcase/feature/{feature}/corner-case-questions.json` BEFORE asking the user:**

```json
[
  { "id": 1, "question": "...", "approved": false, "note": "" },
  { "id": 2, "question": "...", "approved": false, "note": "" }
]
```

---

## Step 6: Ask User to Approve

Use `AskUserQuestion` to present the question list. Options:

- **"Approve all"** → set all `approved: true`
- **"Select specific"** → user picks by number (e.g., "1,3,4") → set those to `approved: true`
- **"Skip — spec only"** → all remain `approved: false`, write base matrix only

After user selection: update `corner-case-questions.json` with the approved state.

---

## Step 7: Generate Corner Cases (if any approved)

For each question where `approved: true`:

- Generate 1–3 testcase rows.
- Use question text as the scenario context.
- Use the `note` field as additional guidance if non-empty.
- Follow write-lite Rules A–F for formatting (ID, Priority, Tags, etc.).
- Append generated rows to `{base_matrix}`.

---

## Step 8: Write CSV (JSON-first, same as write-lite)

1. Build a JSON array of all rows (base + corner cases).
2. Use Node.js (Bash) to convert JSON → CSV:

```bash
node -e "
const rows = $(cat /tmp/{feature}_rows.json);
const header = Object.keys(rows[0]);
const escape = v => '\"' + String(v).replace(/\"/g, '\"\"') + '\"';
const csv = [header.map(escape).join(','), ...rows.map(r => header.map(h => escape(r[h] ?? '')).join(','))].join('\n');
require('fs').writeFileSync('source/testcase/feature/{feature}/result/{feature}-testcase-lite-{timestamp}.csv', csv);
"
```

3. Write metadata sidecar (same as write-lite):

```
source/testcase/feature/{feature}/result/{feature}-testcase-lite-{timestamp}.csv.metadata.json
```

Contents:
```json
{
  "test_count": N,
  "est_input_tokens": null,
  "est_output_tokens": null,
  "est_total_tokens": null,
  "rows_per_token": null
}
```

---

## Key Differences from write-lite

| Aspect | write-lite | write-lite-v2 |
|--------|-----------|---------------|
| Reads rules | No | Yes |
| Corner case questions | No | Derived from rules, saved to JSON |
| Approval gate | No | Yes (AskUserQuestion before CSV write) |
| Corner case rows | No | Yes, for approved questions only |
| Output file pattern | `*-testcase-lite-*.csv` | `*-testcase-lite-*.csv` (same) |
