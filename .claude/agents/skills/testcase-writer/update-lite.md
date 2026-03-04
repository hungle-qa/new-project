# Skill: update-lite

Lightweight update — reads only the existing CSV and approved corner cases. No digest, no spec, no rules.

---

## Step 1: Load Inputs

**Existing CSV:**

Glob `source/testcase/feature/{feature}/result/*.csv` — take the most recent file (by modification time).

If none found: STOP → "No CSV found. Run `/testcase write-lite-v2 {feature}` first."

Read the CSV content. Parse rows to determine the last ID used.

**Approved corner case questions:**

Read `source/testcase/feature/{feature}/corner-case-questions.json`.

Filter to items where `approved: true`.

If no approved items: STOP → "No approved corner cases found. Approve questions in the Corner Cases tab first."

---

## Step 2: Generate Rows for Approved Questions

For each approved question (`id`, `question`, `note`):

- Generate 1–3 testcase rows.
- Use `question` text as the scenario context.
- Use `note` as additional guidance if non-empty.
- Follow write-lite Rules A–F for formatting (ID, Priority, Tags, etc.):
  - **Priority:** Default to "Medium" unless the question implies Critical or High risk.
  - **Tags:** Assign at least one of `corner`, `negative`, `state`.
  - **IDs:** Sequential, continuing from the last row ID in the existing CSV.

---

## Step 3: Show Diff and Approve

Use `AskUserQuestion` to confirm:

```
Add {N} corner case rows to {feature}?

Rows to add:
{preview of new rows — ID, Scenario summary, Priority}
```

Options:
- **"Approve and write"** → proceed to Step 4
- **"Cancel"** → stop, no file written

---

## Step 4: Write Updated CSV (JSON-first)

1. Parse existing CSV into JSON rows.
2. Append new rows.
3. Build full updated JSON array.
4. Use Node.js (Bash) to convert JSON → CSV:

```bash
node -e "
const rows = $(cat /tmp/{feature}_updated_rows.json);
const header = Object.keys(rows[0]);
const escape = v => '\"' + String(v).replace(/\"/g, '\"\"') + '\"';
const csv = [header.map(escape).join(','), ...rows.map(r => header.map(h => escape(r[h] ?? '')).join(','))].join('\n');
require('fs').writeFileSync('source/testcase/feature/{feature}/result/{feature}-testcase-lite-{timestamp}.csv', csv);
"
```

Output to a NEW timestamped file (do NOT overwrite the existing CSV):

```
source/testcase/feature/{feature}/result/{feature}-testcase-lite-{timestamp}.csv
```

Write metadata sidecar:

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

## Step 5: Confirm

Report success:

```
Done! {N} corner cases added → source/testcase/feature/{feature}/result/{feature}-testcase-lite-{timestamp}.csv
```

---

## Key Design

| Aspect | Value |
|--------|-------|
| Reads spec | No |
| Reads rules | No |
| Reads digest | No |
| Inputs | Existing CSV + `corner-case-questions.json` (approved only) |
| Output | New timestamped CSV (does not overwrite existing) |
| Approval gate | Yes (AskUserQuestion before write) |
