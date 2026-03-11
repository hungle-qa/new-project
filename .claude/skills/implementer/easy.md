# EASY Skill Rules

**Scope:** 1 file — bug fix, typo, CSS tweak, config change
**Tool Budget:** 2 max (1 Read + 1 Edit)

---

## Workflow

1. **Read** the target file
2. **Edit** to apply the fix
3. **Report** (see below)

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
