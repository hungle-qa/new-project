# EASY Skill Rules

**Scope:** 1 file — bug fix, typo, CSS tweak, config change
**Tool Budget:** 2 max (1 Read + 1 Edit)

---

## Workflow

1. **Code Rules** — Read `.claude/rules/code-rules.md`, match task keywords, read matched rule files, display summary (see agent's `[CODE_RULES_CHECK]`)
2. **Read** the target file
3. **Edit** to apply the fix (respect matched code rules)
4. **Report** (see below)

**Skip:** Plan, wireframe, approval, verification — change is trivial.

## Guardrails

- If task needs 2+ files → ERROR: "Reclassify as MEDIUM"
- If file path unknown → ERROR: "File path required for EASY"
- If change is unclear → ERROR: "Clarify before proceeding"
- Forbidden: Grep, Glob (path must be provided)

## Report Format

```
### Implementation Report (EASY)
**File:** {path}
**Change:** {1 sentence}
```
