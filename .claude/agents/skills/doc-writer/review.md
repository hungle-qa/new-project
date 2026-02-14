# Skill: REVIEW

**Purpose:** Audit project docs for freshness, accuracy, and **testcase-writer consumability** — ensure docs provide structured context that enables the testcase agent to write/update testcases faster and more accurately without re-reading dozens of source files.

**Trigger:** `review` keyword, optionally with doc-type

---

## Primary Consumer

The **testcase-writer agent** is the primary AI consumer of these docs. It needs:
- Structured, scannable sections (not prose)
- Exact terminology (component names, API endpoints, field names)
- Behavioral constraints (validation rules, state transitions, error conditions)
- Bullet-first format for fast token parsing

Every review check evaluates: **"Can the testcase agent use this doc to generate accurate testcases without reading the original source files?"**

---

## Valid Doc Types

| Doc Type | File | Testcase Agent Uses It For |
|----------|------|---------------------------|
| `context` | `docs/context-summary.md` | Understand project scope, avoid out-of-scope testcases |
| `project-overview` | `docs/project-overview.md` | Know domain terminology, user personas, business rules |
| `codebase-summary` | `docs/codebase-summary.md` | Reference API endpoints, data shapes, file paths for testcase targets |
| `design-guidelines` | `docs/design-guidelines.md` | Know UI component states, interactions, Tailwind patterns for UI testcases |
| `system-architecture` | `docs/system-architecture.md` | Understand data flow, agent boundaries, integration points for E2E testcases |

---

## Steps

### Step 1: Determine Scope

- If doc-type provided → audit single doc
- If no doc-type → audit all 5 doc types

### Step 2: Check Each Doc

For each doc type in scope, run **3 audit passes**:

#### Pass 1: Existence & Freshness

1. **Check existence:** Glob `docs/{doc-type}.md`
   - If not found → status = `MISSING`, skip remaining passes
   - If found → continue

2. **Read doc content:** Read `docs/{doc-type}.md`

3. **Read source files:** Read all sources for this doc type (from Context Source Registry in `doc-writer.md`)

4. **Compare content:**
   - Check if doc covers key topics from sources
   - Identify sections referencing outdated info (removed files, old structure, wrong names)
   - Check for missing topics sources now contain

5. **Assign freshness status:**
   - `FRESH` — covers current source content accurately
   - `STALE` — has outdated or missing sections
   - `PARTIAL` — significant gaps vs sources

#### Pass 2: Testcase-Writer Consumability

Evaluate whether the doc is **structured for fast AI consumption**:

| Check | Criteria | Score |
|-------|----------|-------|
| **Scannable structure** | Uses H2/H3 headings, bullets, tables (not paragraphs) | 0-2 |
| **Exact terminology** | Component names, API paths, field names match codebase exactly | 0-2 |
| **Behavioral detail** | States, transitions, validation rules, error conditions documented | 0-2 |
| **Testable boundaries** | Inputs, outputs, edge cases, constraints explicitly listed | 0-2 |
| **No ambiguity** | No vague terms ("some", "various", "etc.") — specific lists only | 0-2 |

- Score 8-10 → `OPTIMIZED` (testcase agent can consume directly)
- Score 5-7 → `USABLE` (works but causes extra source reads)
- Score 0-4 → `POOR` (testcase agent must fall back to raw source files)

#### Pass 3: Per-Doc-Type Testcase Relevance

Check doc-type-specific requirements the testcase agent needs:

**context:**
- [ ] Lists all workflows with trigger commands
- [ ] Lists all agents with their skills
- [ ] Project structure tree with file purpose annotations

**project-overview:**
- [ ] Domain terminology glossary (exact terms testcases should use)
- [ ] User personas/roles listed
- [ ] Business rules that constrain valid test scenarios

**codebase-summary:**
- [ ] API endpoints table (method, path, params, response shape)
- [ ] Component inventory with file paths
- [ ] Data model / file storage schema

**design-guidelines:**
- [ ] Component state matrix (default, hover, active, disabled, error)
- [ ] Interaction patterns (click, drag, input validation)
- [ ] Responsive breakpoints and behavior differences

**system-architecture:**
- [ ] Data flow diagram (input → processing → output per workflow)
- [ ] Agent I/O contracts (what each agent reads/writes)
- [ ] Integration points and failure modes

### Step 3: Generate Report

Show report to user (console only, no file write):

```
## Doc Review Report

### Freshness
| Doc Type | File | Status | Notes |
|----------|------|--------|-------|
| context | docs/context-summary.md | MISSING/FRESH/STALE/PARTIAL | Brief note |
| ... | ... | ... | ... |

### Testcase-Writer Consumability
| Doc Type | Score | Rating | Gap |
|----------|-------|--------|-----|
| context | 7/10 | USABLE | Missing agent skills list |
| ... | ... | ... | ... |

### Testcase Relevance Checklist
{Per doc: list of checks with PASS/FAIL}

### Recommendations
- {doc-type}: {action + specific improvement for testcase agent}
- ...

### Summary
- Total: {N} docs checked
- Freshness: {N} Fresh | {N} Stale | {N} Missing | {N} Partial
- Consumability: {N} Optimized | {N} Usable | {N} Poor
```

### Step 4: Suggest Actions

For each non-optimal doc:
- `MISSING` → "Run `/doc create {type}` to generate"
- `STALE` → "Run `/doc update {type}` to refresh"
- `PARTIAL` → "Run `/doc update {type}` to fill gaps"
- `USABLE` → "Run `/doc update {type}` — add: {specific missing elements}"
- `POOR` → "Run `/doc update {type}` — restructure for AI consumption: {specific fixes}"

---

## Error Handling

| Error | Response |
|-------|----------|
| Invalid doc-type | "Unknown doc type. Valid: context, project-overview, codebase-summary, design-guidelines, system-architecture" |
| No docs/ folder | Report all 5 as MISSING, suggest creating docs/ folder |
| Source file missing | Note in report: "Source {file} not found — cannot verify accuracy" |
