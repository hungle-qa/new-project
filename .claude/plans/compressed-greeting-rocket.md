# Plan: Learn from Testcase Workflow

## Context

Currently, templates (column rules) and rules (ordering, coverage) are manually authored. When a QA lead has existing high-quality testcases (from another tool or previous work), there's no way to extract their conventions automatically. This workflow lets AI reverse-engineer patterns from a spec + testcase CSV pair, then save them as reusable named templates and rules. Full mode only.

---

## Architecture: 2-Step API + 3-Step UI Wizard

```
CSV + Spec upload → POST /learn/analyze (AI extracts patterns)
                         ↓
              Interactive Review in UI (user edits)
                         ↓
                  POST /learn/save (writes files)
                         ↓
         New named template.json + rules.md appear in dropdowns
```

---

## Implementation Steps

### Step 1: Server — TestcaseLearnService

**New file:** `server/src/services/TestcaseLearnService.ts`

- `parseCsv(csvContent: string)` — Parse CSV into headers + rows using `csv-parse/sync`
- `buildAnalysisPrompt(headers, rows, spec)` — Single prompt requesting structured JSON
- `analyzeTestcase(headers, rows, spec, aiConfig)` — Call Gemini (reuse AIService pattern) to extract:
  - Per-column: name, width, style, columnRules, reasoning
  - Overall rules: columnFormat, orderOfCase, scope, priorityMapping, constraints, businessRules
- `analysisToTemplate(analysis)` — Convert to `TemplateColumn[]`
- `analysisToRules(analysis)` — Convert to rules markdown string

**AI Prompt strategy:** Single call, not multi-step. If CSV > 30 rows, sample first 10 + middle 10 + last 10 rows.

**Dependency:** `npm install csv-parse` (server package)

### Step 2: Server — API Routes

**File:** `server/src/routes/testcase-global.ts` (add 2 endpoints)

**`POST /learn/analyze`** (multipart/form-data)
- Fields: `file` (CSV), `spec` (string, optional), `feature` (string, optional — loads spec from feature)
- Headers: `x-ai-api-key`, `x-ai-model`
- Returns: `{ columns: [...], rules: {...}, metadata: { rowCount, columnCount, sampleRows } }`

**`POST /learn/save`** (JSON)
- Body: `{ templateName, ruleName, columns: TemplateColumn[], rulesContent: string }`
- Reuses `TestcaseConfigService.saveTemplateByName()` and `TestcaseConfigService.saveRule()`
- Returns: `{ template: string, rule: string }`

Separate multer instance for CSV (`.csv` file filter).

### Step 3: Client — Types Update

**File:** `client/src/pages/testcase-manager/types.ts`

- Add `'learn'` to `TabType` union
- Add to `globalTabs` array: `{ id: 'learn', label: 'Learn', icon: GraduationCap }`
- Learn tab only visible in Full mode (filter in `TestcaseManagerPage`)

### Step 4: Client — LearnTab Component

**New file:** `client/src/components/testcase/LearnTab.tsx`

3-step wizard (state managed internally):

**Step 1 — Upload**
- CSV file upload (drag-and-drop area, reuse ImportSpecTab pattern)
- Optional spec input: paste markdown OR select existing feature from dropdown
- "Analyze" button (requires AI settings)

**Step 2 — Review Analysis**
- Column analysis: editable table showing name, style, detected columnRules, AI reasoning (collapsible)
- Rules analysis: editable markdown sections (Order of Case, Coverage/Scope, Priority Mapping, Constraints)
- Sample preview: 3 rows from CSV for reference
- "Back" and "Save" buttons

**Step 3 — Save**
- Name inputs: template name + rule name (pre-filled as `learned-{date}`)
- Duplicate check via `listTemplates()`/`listRules()` before save
- Success: links to view saved items in Default Template / Default Rules tabs

### Step 5: Client — Wire into GlobalTabsPanel

**File:** `client/src/pages/testcase-manager/GlobalTabsPanel.tsx`

- Import `LearnTab`
- When `activeTab === 'learn'`, render `<LearnTab />` (no sidebar list needed — it's a wizard, not CRUD)

### Step 6: Agent — Slash Command Skill

**New file:** `.claude/agents/skills/testcase-writer/learn.md`

- Usage: `/testcase learn <feature-name>`
- Reads spec from `source/testcase/feature/{name}/spec/imported-spec.md`
- Reads most recent CSV from `source/testcase/feature/{name}/result/`
- Claude analyzes patterns (same logic as API prompt)
- Presents analysis via conversation, user approves/tweaks
- Saves via file write to `source/testcase/template/` and `source/testcase/rule/`

**Update:** `.claude/agents/testcase-writer.md` — add `learn` to routing table

---

## Critical Files

| File | Action |
|------|--------|
| `server/src/services/TestcaseLearnService.ts` | **Create** — CSV parsing + AI analysis |
| `server/src/routes/testcase-global.ts` | **Edit** — Add /learn/analyze and /learn/save |
| `server/src/services/AIService.ts` | **Reference** — Reuse Gemini call pattern |
| `client/src/pages/testcase-manager/types.ts` | **Edit** — Add 'learn' tab type |
| `client/src/components/testcase/LearnTab.tsx` | **Create** — Wizard component |
| `client/src/pages/testcase-manager/GlobalTabsPanel.tsx` | **Edit** — Wire LearnTab |
| `.claude/agents/skills/testcase-writer/learn.md` | **Create** — CLI skill |
| `.claude/agents/testcase-writer.md` | **Edit** — Add learn to routing |

## Existing Functions to Reuse

- `TestcaseConfigService.saveTemplateByName(name, columns)` — save template
- `TestcaseConfigService.saveRule(name, content)` — save rule
- `TestcaseConfigService.listTemplates()` / `listRules()` — duplicate check
- `AIService` Gemini call pattern with retry logic (`server/src/services/AIService.ts`)
- ImportSpecTab drag-and-drop upload pattern (`client/src/components/testcase/ImportSpecTab.tsx`)

## Error Handling

| Scenario | Response |
|----------|----------|
| No headers in CSV | 400: "CSV must have a header row" |
| < 2 data rows | 400: "Need ≥2 rows to detect patterns" |
| AI returns invalid JSON | Retry once with stricter prompt, then 500 |
| Name already exists | Client warns, offers rename or overwrite |
| No AI key | Show "Configure AI Settings" (same as ImportSpecTab) |
| CSV > 500 rows | Sample 30 representative rows |

## Verification

1. Start server (`npm run dev` in server/)
2. Upload a spec + CSV via the Learn tab in Full mode
3. Verify analysis shows reasonable column rules and ordering patterns
4. Edit analysis, save with custom name
5. Confirm new template appears in Default Template tab, new rule in Default Rules tab
6. Test `/testcase learn <feature>` CLI command with an existing feature
7. Switch to Lite mode — verify Learn tab is hidden
