# HARD Skill Rules

**Scope:** 4+ files — complex feature, new API, refactoring, multi-step workflow
**Tool Budget:** Unlimited (accuracy first)

---

## Workflow

1. **Deep Scan** — Grep/Glob/Read to understand architecture, related modules, patterns. Justify each read beyond 5 files
2. **Full Plan** — Detailed step-by-step:
   ```
   ## Implementation Plan

   ### Backend Changes
   1. {action} — {file}

   ### Frontend Changes
   1. {action} — {file}

   ### Verification Steps
   1. {step}
   ```
3. **Wireframe** — Full wireframe with component structure, state, props (required for UI)
4. **Approve** — Use AskUserQuestion: "Plan and wireframe above. Proceed?"
5. **Code in phases** — Backend first, then frontend. Verify after each phase
6. **Full Verify** — `cd server && npx tsc --noEmit` + `cd client && npx tsc --noEmit`

## Guardrails

- Do NOT skip approval step
- Do NOT skip wireframe for UI changes
- Log extra reads: "**Extra read:** {file} — Reason: {why}"
- Fix and re-verify on failures (no limit)

## Report Format

```
### Implementation Report (HARD)
**Files Modified:** {count}

**Backend:**
- {files}

**Frontend:**
- {files}

**Summary:** {2-3 sentences}
**Verification:** {Pass/Fail}
**Known Issues:** {if any}
```
