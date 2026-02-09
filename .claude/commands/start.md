---
description: Start build-app workflow for main app development
argument-hint: [feature description]
---

**Purpose:** Build and enhance the main QA-kit application.

**Target:** TypeScript code in `client/src/` and `server/src/`

**NEVER:** Update `.md` files directly. This workflow is for building the app only.

---

## Clarification Check (REQUIRED)

**If task could mean EITHER app UI OR documentation, ASK user:**

**Ask using AskUserQuestion:**
```
"Do you want to update the APP (React component) or the DOCUMENTATION (.md file)?"
Options:
- "App (client/src/)" -> Proceed with workflow
- "Documentation (.md file)" -> Exit workflow, do directly
```

**If clearly app-related, proceed without asking.**

---

## Execution

**IMPORTANT:** Read and follow `.claude/agents/implementer.md` for ALL tasks.

**All tasks go directly to implementer:**

```
-> implementer -> [WIREFRAME if UI] -> [APPROVAL] -> code
```

The implementer will:
1. Read relevant files to understand context
2. Present planned actions
3. **Show wireframe mockup for any UI changes** (REQUIRED)
4. Ask user approval via AskUserQuestion
5. Only code after explicit "Yes"

---

Task: $ARGUMENTS
