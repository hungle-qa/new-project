# Learn from Testcase — Skill

## Purpose
Analyze an existing spec + testcase CSV pair to reverse-engineer template column rules and QA rules (ordering, coverage). Saves as new named global template and rule files.

## Input
- Feature name (required) — must have a spec and at least one result CSV, OR a learn session file

## Workflow

### Step 1: Load Data

**Check for learn session first:**
1. Check if `source/testcase/feature/{name}/_learn-session.json` exists
2. If it exists, read it — contains `{ csv: "...", spec: "...", createdAt: "..." }`
   - Use `csv` as the testcase CSV content
   - Use `spec` as the spec content (may be null)
   - If `spec` is null, try reading `source/testcase/feature/{name}/spec/imported-spec.md`

**If no session file:**
1. Read the spec from `source/testcase/feature/{name}/spec/imported-spec.md`
2. Find the most recent CSV in `source/testcase/feature/{name}/result/` (sort by filename timestamp)
3. Read the CSV content

If neither session nor CSV is available, stop and inform the user.

### Step 2: Analyze Patterns
Analyze the CSV columns and rows against the spec. For each column, identify:
- **Name** and suggested display style (bold, mono, normal, bold center)
- **Column rules** — formatting patterns, verb conventions, value constraints

For overall rules, identify:
- **Order of Case** — how cases are sequenced (UI first? functional first? by module? lifecycle order?)
- **Coverage** — what types of cases are present (happy, corner, negative, boundary) and distribution
- **Priority Mapping** — criteria for Critical/High/Medium/Low
- **Constraints** — structural rules (single-assertion per row, tag conventions, etc.)
- **Business Rules** — domain-specific patterns
- **Consolidation Strategy** — MUST analyze merge vs split patterns:
  - Count avg steps per test. If 5-8 → workflow-oriented (consolidated). If 2-3 → atomic (granular).
  - Detect MERGE patterns: entry point + defaults in one test, progressive field behavior (counter→block), identical dismiss behaviors combined, edit+apply as one flow
  - Detect SPLIT patterns: different views/outcomes/preconditions/components each get own test
  - Record the observed pattern as a rule (e.g., "MERGE when same component progressive behavior")
- **Multi-AC Mapping** — check if tests map to single or multiple ACs:
  - If most tests have multi-AC (e.g., `US{N} / AC1, AC2`) → record as "prefer multi-AC for sequential workflows"
  - If most tests are single-AC → record as "one AC per test"
- **Boundary Testing Strategy** — check if boundaries use exhaustive or representative approach:
  - Count tests per boundary category. If 3 representative values → representative strategy. If every value tested → exhaustive.
  - Record the observed strategy
- **Cancel/Discard Patterns** — count states tested for cancel/discard flows:
  - If 3 states (no changes→close, changes→discard, changes→stay) → record as "mandatory 3-state cancel"
  - If fewer → record what's present and flag missing states

### Step 3: Present for Review
Present the analysis to the user in a clear format:

```
## Column Analysis
| Column | Style | Rules |
|--------|-------|-------|
| ... | ... | ... |

## Rules Analysis
### Order of Case
...
### Coverage & Scope
...
### Consolidation Strategy
MERGE when: ...
SPLIT when: ...
Avg steps/test: N | Style: workflow-oriented / atomic
### Multi-AC Mapping
Pattern: multi-AC / single-AC | Format: ...
### Boundary Testing Strategy
Approach: representative / exhaustive
### Cancel/Discard Patterns
States found: N/3 (close, discard, stay)
### Priority Mapping
...
### Constraints
...
### Business Rules
...
```

**Dedup rule:** Column-specific rules (formatting, verbs, value style) → template `columnRules` ONLY. Structural rules (ordering, consolidation, scope, business logic) → rules file ONLY. No duplication between the two.

Ask: "Does this analysis look correct? Any edits before I save?"

### Step 4: Save
After user approval:
1. Ask for template name and rule name (suggest `learned-{feature-name}`)
2. Save template as JSON to `source/testcase/template/{name}.json` using TemplateColumn format:
   ```json
   [{ "id": "col_1", "name": "...", "width": "200px", "style": "...", "columnRules": "..." }]
   ```
3. Save rules as markdown to `source/testcase/rule/{name}.md` with sections:
   - `# Learned Rules`
   - `## Order of Case`
   - `## Consolidation Strategy` (MERGE/SPLIT rules, step target)
   - `## Multi-AC Mapping` (single vs multi-AC preference, format)
   - `## Boundary Testing Strategy` (representative vs exhaustive, cancel/discard states)
   - `## Scope`
   - `## Priority Mapping`
   - `## Constraints` (structural only — no column-format items; include Column Content Integrity)
   - `## Business Rules`
   **Do NOT include `## Column Format`** — all column-specific rules go in template `columnRules` only.

### Step 5: Cleanup & Confirm
1. **Delete the session file** if it was used: remove `source/testcase/feature/{name}/_learn-session.json`
2. Report: "Saved template '{name}' and rule '{name}'. You can now select them in feature configs."
