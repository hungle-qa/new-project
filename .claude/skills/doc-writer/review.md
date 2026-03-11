# Skill: REVIEW

**Purpose:** Audit project docs for freshness, accuracy, and downstream consumability — ensure docs provide structured context that AI consumers (agents, workflows) can use without re-reading source files.

**Trigger:** `review` keyword, optionally with doc-type

---

## Steps

### Step 1: Determine Scope

- If doc-type provided → audit single doc
- If no doc-type → audit all 5 doc types

### Step 2: Audit Each Doc (Single Pass)

For each doc type in scope, check all dimensions at once:

#### 2a: Existence

- Glob `docs/{doc-type}.md`
- If not found → status = `MISSING`, skip to next doc

#### 2b: Freshness

1. Read doc content and all sources from agent's `[CONTEXT_SOURCE_REGISTRY]`
2. Compare: does doc cover key topics from sources? Any outdated/missing sections?
3. Assign status:
   - `FRESH` — covers current source content accurately
   - `STALE` — has outdated or missing sections
   - `PARTIAL` — significant gaps vs sources

#### 2c: Consumability Score (0-10)

| Check | Criteria | Score |
|-------|----------|-------|
| Scannable structure | H2/H3 headings, bullets, tables (not paragraphs) | 0-2 |
| Exact terminology | Names, paths, fields match codebase exactly | 0-2 |
| Behavioral detail | States, rules, error conditions documented | 0-2 |
| Testable boundaries | Inputs, outputs, edge cases listed | 0-2 |
| No ambiguity | No vague terms ("some", "various", "etc.") | 0-2 |

- 8-10 → `OPTIMIZED`
- 5-7 → `USABLE`
- 0-4 → `POOR`

#### 2d: Relevance

Check that the doc covers all major topics from its source files. Flag any source topic not represented in the doc.

### Step 3: Generate Report

Show report (console only, no file write):

```
## Doc Review Report

### Results
| Doc Type | File | Freshness | Score | Rating | Key Gaps |
|----------|------|-----------|-------|--------|----------|
| context | docs/context-summary.md | FRESH/STALE/PARTIAL/MISSING | 7/10 | USABLE | Brief note |
| ... | ... | ... | ... | ... | ... |

### Recommendations
- {doc-type}: {action + specific improvement}
- ...

### Summary
- Total: {N} docs checked
- Freshness: {N} Fresh | {N} Stale | {N} Missing | {N} Partial
- Consumability: {N} Optimized | {N} Usable | {N} Poor
```

### Step 4: Suggest Actions

For each non-optimal doc:
- `MISSING` → "Run `/doc create {type}`"
- `STALE` / `PARTIAL` → "Run `/doc update {type}` to refresh"
- `USABLE` → "Run `/doc update {type}` — add: {specific missing elements}"
- `POOR` → "Run `/doc update {type}` — restructure: {specific fixes}"

---

## Error Handling

| Error | Response |
|-------|----------|
| Invalid doc-type | "Unknown doc type. Valid: context, project-overview, codebase-summary, design-guidelines, system-architecture" |
| No docs/ folder | Report all 5 as MISSING |
| Source file missing | Note in report: "Source {file} not found — cannot verify accuracy" |
