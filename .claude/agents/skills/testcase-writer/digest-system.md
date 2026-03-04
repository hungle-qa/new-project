# Context Digest System

**Purpose:** Avoid re-reading 7+ files on every run. Pre-compile all context into one digest file per feature.

**Digest location:** `source/testcase/feature/{feature}/context-digest.md`

**Note:** `write-lite` does NOT use digest — reads spec + rules directly. Skip digest for `write-lite`.

---

## Digest Freshness Check

Call the server API to check if digest needs regenerating:

```bash
curl -s http://localhost:3001/api/testcase/{feature-name}/digest-status
```

Response: `{"status":"FRESH"}` or `{"status":"STALE","reason":"source/testcase/feature/{feature}/config.md"}`

- If `status` is `STALE` → regenerate digest (read all sources, write digest)
- If `status` is `FRESH` → read only the digest file, skip all individual reads

---

## Digest Generation

When STALE, read sources and write to `source/testcase/feature/{feature}/context-digest.md`:

```markdown
---
digest-version: 2
generated: {ISO timestamp}
feature: {feature-name}
sources: [list all read files]
---

## Config
strategy: {id or "none"}
structure: {tree or "empty"}
components: {list}
linked_knowledge: {list}

<!-- [REQUIREMENTS — Generate testcases from this] -->

## Spec Summary
{User stories, acceptance criteria as bullets, key requirements}

## Test Scope

### TESTABLE (generate testcases for these)
{List each User Story with its Acceptance Criteria:}
- US1: {title}
  - AC1: {criterion}
  - AC2: {criterion}
- US2: ...

### OUT OF SCOPE (in knowledge but NOT in spec — do NOT test)
{List feature-knowledge functions/topics NOT referenced in any spec AC}
- {Function/topic name}
- ...

### Scope Hints
**Happy Case:** {from per-feature rules ## Scope, or "Standard happy paths"}
**Corner Case:** {from per-feature rules ## Scope, or "Standard edge cases"}

## Structure
{If non-empty: render tree. Example:}
- Pop-up
  - Header
  - Footer

{If empty: "No structure — AI freestyles."}

**RULE:** Structure defined → MUST follow tree, replace Module with Level 1..N, test ONLY leaf nodes. Empty → freestyle.

## Strategy Guide
{If strategy set: strategy name + 1-line summary + path reference}
{If none: "No strategy — balanced approach"}
{Agent reads full strategy from source/testcase/strategy/{name}.md if needed}

<!-- [FORMAT — How to write testcases] -->

## Template Columns
{For each column with writingStyle: name + 1-line hint (condensed from full writingStyle)}
{Agent reads full writingStyle from per-feature template.json if needed}
Full order: {comma-separated}

## Merged Column Order
{Structure defined: show merged with Level 1..N replacing Module}
{Structure empty: same as template order}

## Rules Summary
{Condensed rules: priority map, constraints, column format}

<!-- [REFERENCE — Terminology only, do NOT generate testcases from this] -->

## Terminology & Context
{Extract ONLY these from feature knowledge — omit full prose/function details:}

**Glossary:** {term → definition table, only terms referenced in spec}
**UI Elements:** {button/panel/screen names referenced in spec}
**User Roles:** {roles and access levels relevant to spec}
**Preconditions:** {plans, settings, conditions required for testing}
**Test Accounts:** {if available in knowledge}

## Component Knowledge
{Behavior, states, interactions — only for components listed in config}
```

---

## Digest Generation Rules

1. Spec Summary MUST appear before any other content section — agent reads requirements FIRST
2. Test Scope MUST list every spec US/AC under TESTABLE and every knowledge topic not in spec under OUT OF SCOPE
3. Terminology & Context MUST contain only glossary/UI/roles/preconditions — never full feature prose
4. All 3 zone comment markers MUST be present in every digest

**CRITICAL:** Preserve ALL acceptance criteria, rule constraints, writingStyle, and terminology. Summarize for brevity but omit nothing testable.
