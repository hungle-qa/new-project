---
description: Start build-app workflow for main app development
argument-hint: [feature description]
---

**Purpose:** Entry point for building/enhancing the QA-kit application.

**Target:** TypeScript code in `client/src/` and `server/src/`

**NEVER:** Update `.md` files directly. This command is for building the app only.

---

## Execution

Read and follow `.claude/workflows/build-app-workflow.md` — it handles:
1. Clarification (app vs docs)
2. Task classification (EASY / MEDIUM / HARD)
3. User messaging (show classification before coding)
4. Skill loading + implementer dispatch

**Classification happens in the workflow, NOT here. This command is a thin router.**

---

Task: $ARGUMENTS
