# Lite Shared Rules

Shared rules for write-lite, write-lite-v2, and update-lite skills.

---

## P0 - PLACEHOLDERS

Substitute ALL before any path/command executes:
- `{feature}` = feature-name at invocation
- `{timestamp}` = captured from `date +"%Y%m%d-%H%M%S"` at CSV write time (format `YYYYMMDD-HHmmss`)
- `{project_root}` = `pwd` output. Never leave literals in executed paths.

## P0 - CLARIFICATION GATE

Ask ONE question (AskUserQuestion) ONLY when ALL true: (1) US/AC structurally incomplete (blank description, undefined ID), (2) unresolvable from context, (3) proceeding yields blank Title or Expectation. Otherwise proceed. Never ask about subjective interpretation, edge cases, or priority.

---

## GENERATION RULES

### A. Ordering

Lifecycle order per AC and per sub-component:
1. Empty/default state (before interaction)
2. Change/action — invalid FIRST, then valid
3. Progress after action (loading, state changes)
4. End action (Save/Cancel/Close/Submit)
5. Verify result (toast, UI updates, persistence)

- Group ALL sub-component rows together — never interleave.
- Parent-before-child (CRITICAL): verify container exists before any child element.
- Close/dismiss: group all together; merge identical expectations into ONE slash-variant row; never separate with unrelated rows.

### B. Coverage

- Every AC → at least one row.
- Every AC behavior statement MUST have explicit rows. Never substitute with "same as ACX" — expand all.
- NO edge/corner cases unless spec contains a concrete behavior statement for that case. Implied or inferable → OMIT. When uncertain → treat as implied → OMIT.
- Spec-only granularity (STRICT): one spec behavior = one row. Do NOT decompose into sub-element checks. Split ONLY when spec explicitly describes distinct verifiable outcomes.
- IDs sequential from 1.
- Priority mapping:

| Priority | Criteria |
|----------|----------|
| **Critical** | Core functionality, data loss risk |
| **High** | Main user flow, frequent use case, business-critical |
| **Medium** | Secondary flow, edge case with moderate impact |
| **Low** | Cosmetic, rare edge case, nice-to-have validation |

### C. Title

- Never empty — blank Title = bug; fix before writing.
- Short noun-phrase, NOT steps. Max ~8 words, unique per row. Describes WHAT, not HOW.
- No AC prefix repetition: Title differentiates rows WITHIN the group — do not repeat AC context.
- Examples: "button disabled with upgrade icon", "Owner/Admin click navigates to billing", "Pro plan display option"

### D. Steps

- GWT mapping: Given → first step(s) if unique context, DROP if obvious. When → numbered steps. Then → `- SHOULD ...` in Expectation.
- High-level steps only: "Login as Admin", not detailed login steps. Detail only feature-specific actions.
- Session prerequisite (MANDATORY): Write session setup (login + entry point) in full ONCE on the first row where that context appears. All subsequent rows with the SAME role + entry point start at the first unique action. New session context (different role OR entry point) → write in full once, then skip for that group. Session context resets ONLY when role or entry point explicitly changes — NOT at US boundaries.
- Prerequisite skip (MANDATORY): Applies globally across ALL ACs. If the row immediately above already contains a step that sets up the same context (login, navigation, open modal), do NOT repeat it — start at the first UNIQUE action for that row. Prerequisites are implied from context, not scoped per AC.
- Step numbering (MANDATORY): Restart at 1 on every row.
- Verify step (MANDATORY): Every testcase ends with `{N}. Verify {component/element}`. Exception: rows with blank steps (deduped from prior row).
- Same-position dedup (CRITICAL): Multiple rows verifying different aspects of the SAME element at the SAME verify step → Steps on FIRST row only; subsequent rows → Steps `null`. Differentiate via Title + Expectation only.

### E. Expectation

- Never reference AC: NEVER write "same as ACX" or "refer to ACX". Every row MUST have explicit standalone text.
- Merging (COMPLEXITY-BASED): Merge WITHIN a single spec behavior only. If both expectations are <15 words AND verify the same component/action → merge. If either is ≥15 words OR tests different components → separate rows.
  - MERGE: "- SHOULD display top 5 items\n- SHOULD sort by usage descending" → one row.
  - SPLIT: "- SHOULD block function and redirect to billing page with error message" → separate rows (complex, separate concerns).

### F. Dedup & Merge

- Wording consistency: repeated step/component/word → 100% identical phrasing.
- Merged-cell: group by US → AC. US/AC/Steps → `null` if same as previous row. Title NEVER `null`.
- Variant Case A (same expectation): ONE row, slash title (e.g., "Trial / Pro / Studio plan"), `{key}` placeholder steps.
- Variant Case B (different expectation): Row 1 = full Steps + variant Title. Row 2+ = Steps `null`, variant Title, specific Expectation.
- Identical expectation (STRICT): same text (exact or semantic) → MUST merge into one row. Covers: different triggers (click/Enter/Esc), different input methods (type/paste). Use slash Title + `{method}` placeholder steps.
- Element existence + function: ONE row, combined expectation bullets (e.g., "- SHOULD display X button\n- SHOULD close modal on X click or Esc").
- Same-component validation methods: ONE row, `{method}` placeholder, method-specific expectation bullets.

---

## OUTPUT FORMAT

### JSON Schema

Output testcase matrix as a **JSON array** with short keys:

`n` = No, `u` = US, `a` = AC, `s` = Step, `t` = Title, `e` = Expectation, `p` = Priority

```json
[
  { "n": 1, "u": "US1: title", "a": "AC1: desc", "s": "1. Login as {role}\n2. Navigate to {page}\n3. Click {button}\n4. Verify {component}", "t": "component shown on click", "e": "- SHOULD display component", "p": "High" },
  { "n": 2, "u": null, "a": null, "s": null, "t": "component variant", "e": "- SHOULD handle variant case", "p": "Medium" }
]
```

Rules:
- Deduped blank fields = `null` (same as above)
- `t` is NEVER `null`
- `s` and `e` may contain `\n` for multiline
- `n` sequential from 1

### Self-Check (all must pass before writing)

1. Valid JSON — parseable, no trailing commas
2. Every object has non-null `t`
3. `n` sequential from 1, no gaps
4. Expectation merging follows complexity rule
5. Sub-components grouped, parent-before-child ordering
6. Close/dismiss merged (identical expectation) or adjacent
7. No duplicate expectations — identical ones merged
8. No AC references — all expectations explicit and standalone
9. Session prerequisites written once per session context — not repeated across AC boundaries

### CSV Conversion (JSON-first via Node.js)

**Why JSON-first:** LLMs cannot reliably count consecutive CSV commas — output JSON, convert deterministically.

1. Run `date +"%Y%m%d-%H%M%S"` and capture output as `{timestamp}`. Use exact captured value. Never infer or hallucinate it.
2. Write JSON array to: `source/testcase/feature/{feature}/result/_temp.json`
3. Run Node.js conversion:

```bash
node -e "
process.chdir('$(pwd)');
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('source/testcase/feature/{feature}/result/_temp.json', 'utf-8'));
const quote = (v) => {
  if (v === null || v === undefined) return '';
  const s = String(v);
  if (s.includes(',') || s.includes('\"') || s.includes('\n')) return '\"' + s.replace(/\"/g, '\"\"') + '\"';
  return s;
};
const header = 'No.,US,AC,Step,Title,Expectation,Priority';
const rows = data.map(r => [r.n, r.u, r.a, r.s, r.t, r.e, r.p].map(quote).join(','));
fs.writeFileSync('source/testcase/feature/{feature}/result/{feature}-testcase-lite-{timestamp}.csv', header + '\n' + rows.join('\n') + '\n');
"
```
   - IF `node -e` exits with error: run `rm -f source/testcase/feature/{feature}/result/_temp.json`. Report: "CSV conversion failed: {error output}. Temp file removed. Check Node.js is available and the JSON is valid." STOP — do NOT write a partial CSV.

4. Delete temp file: `rm source/testcase/feature/{feature}/result/_temp.json`
   - IF delete fails: Report: "Warning: temp file `_temp.json` could not be deleted. Remove it manually."
5. Do NOT regenerate. Write exact matrix from the generation step. Always NEW timestamped file (`-lite-` suffix).
