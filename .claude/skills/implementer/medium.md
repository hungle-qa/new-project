# MEDIUM Skill Rules

**Scope:** 2-3 files — small feature, standard UI pattern, props/state addition
**Tool Budget:** 10 max

---

## Workflow

1. **Gather** — Grep/Glob to find files, Read target files (max 5). Use Common Patterns from agent, not source reads
2. **Plan** — 3-line compressed plan:
   ```
   1. {Action for file 1}
   2. {Action for file 2}
   3. {Action for file 3}
   ```
3. **Wireframe** — Minimal ASCII wireframe if UI changes (skip for backend-only)
4. **Approve** — Use AskUserQuestion: "Plan and wireframe above. Proceed?"
5. **Code** — Only after user says "Yes"
6. **Verify** — `cd client && npx tsc --noEmit` (and server if backend changed)

## Guardrails

- If task needs 4+ files → ERROR: "Reclassify as HARD"
- Do NOT skip approval step
- Max 2 fix attempts if verification fails

## Report Format

```
### Implementation Report (MEDIUM)
**Files Modified:** {count}
- {path 1}
- {path 2}

**Summary:** {1-2 sentences}
**Verification:** {Pass/Fail}
```
