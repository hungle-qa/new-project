# HARD Skill Rules

**Scope:** 4+ files — complex feature, new API, refactoring, multi-step workflow
**Tool Budget:** Unlimited (accuracy first)

---

## Workflow

1. **Code Rules** — Read `.claude/rules/code-rules.md`, match task keywords, read matched rule files, display summary (see agent's `[CODE_RULES_CHECK]`)
2. **Deep Scan** — Grep/Glob/Read to understand architecture, related modules, patterns. Justify each read beyond 5 files
3. **Full Plan** — Detailed step-by-step:
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
5. **Approve** — Use AskUserQuestion: "Plan and wireframe above. Proceed?"
6. **Code in phases** — Backend first, then frontend. Respect matched code rules. Verify after each phase
7. **Full Verify** — `cd server && npx tsc --noEmit` + `cd client && npx tsc --noEmit`

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
