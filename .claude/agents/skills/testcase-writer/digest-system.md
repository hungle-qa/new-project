# Context Digest System

**Purpose:** Avoid re-reading 7+ files on every run. Pre-compile all context into one digest file per feature.

**Digest location:** `source/testcase/feature/{feature}/context-digest.md`

**Note:** `write-lite` and `write-lite-v2` do NOT use digest — they read spec + rules directly.

---

## Digest Freshness Check

Call the server API to check if digest needs regenerating:

```bash
curl -s http://localhost:3001/api/testcase/{feature-name}/digest-status
```

Response: `{"status":"FRESH"}` or `{"status":"STALE","reason":"..."}`

- If `STALE` → regenerate via `POST /api/testcase/{feature}/digest`
- If `FRESH` → read only the digest file

---

## Digest Format

The server generates the digest with this structure:

```markdown
---
digest-version: 2
generated: {ISO timestamp}
feature: {feature-name}
sources: [list all read files]
---

## Config
strategy: {id or "none"}
linked_knowledge: {list}
components: {list}

<!-- [REQUIREMENTS — Generate testcases from this] -->

## Spec Summary
{Full spec content}

## Test Scope

### TESTABLE (generate testcases for these)
{US/AC list from spec}

## Strategy Guide
{Strategy name + summary, or "No strategy — balanced approach"}

<!-- [FORMAT — How to write testcases] -->

## Template Columns
{Full column rules per column}
Full column order: {comma-separated}

## Merged Column Order
{Column order with Level 1..N if structure defined}

## Rules Summary
{Full rules content}

<!-- [REFERENCE — Terminology only, do NOT generate testcases from this] -->

## Terminology & Context
{Full linked knowledge content — only present if knowledge is linked}

## Component Knowledge
{Component behavior and usage}
```

---

## Key Rules

1. The digest is the **single source of truth** for the write skill — no need to read individual files
2. Spec Summary contains full spec content — all requirements are here
3. Rules Summary contains full rules — all generation rules are here
4. Template Columns contains full column rules — all formatting rules are here
5. Terminology section is reference only — do NOT generate testcases from it
