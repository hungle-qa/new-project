---
description: Start primary workflow for main app development
argument-hint: [feature description]
---

**Purpose:** Build and enhance the main BA Demo Tool application.

**Target:** TypeScript code in `client/src/` and `server/src/`

**NEVER:** Update `.md` files directly. This workflow is for building the app only.

---

## Clarification Check (REQUIRED)

**If task could mean EITHER app UI OR documentation, ASK user:**

Example ambiguous tasks:
- "Update User Guide section" → App UI or docs/user-guide.md?
- "Add help content" → App component or README?
- "Update about page" → React page or docs?

**Ask using AskUserQuestion:**
```
"Do you want to update the APP (React component) or the DOCUMENTATION (.md file)?"
Options:
- "App (client/src/)" → Proceed with workflow
- "Documentation (.md file)" → Exit workflow, do directly
```

**If clearly app-related, proceed without asking.**

---

## Tier Detection

**BEFORE running workflow, classify task complexity:**

| Tier | Detection Criteria | Agent Chain |
|------|-------------------|-------------|
| **SIMPLE** | Single file, bug fix, typo, rename | implementer only |
| **MEDIUM** | 2-3 files, clear scope, known feature | quick-scout → implementer |
| **COMPLEX** | Multi-file, unclear scope, new architecture | Full workflow |

### SIMPLE Task Indicators
- User specifies exact file path
- Keywords: "fix", "typo", "rename", "change text", "update string"
- Single component change
- No new files needed
- Bug fix with known location

### MEDIUM Task Indicators
- Clear feature scope (e.g., "add search to X page")
- 2-3 files affected
- No architectural decisions
- Feature addition to existing page/route

### COMPLEX Task Indicators
- New feature with unclear scope
- Multiple components/services involved
- User explicitly asks for plan
- Architectural changes
- New pages or routes
- Keywords: "rebuild", "refactor", "redesign", "implement new"

---

## Execution

**SIMPLE tasks:**
```
→ implementer (direct)
```
No scout, no plan file, no approval needed.

**MEDIUM tasks:**
```
→ quick-scout → implementer
```
Inline plan shown (no file), no approval needed.

**COMPLEX tasks:**
```
→ scout → planner → [APPROVAL] → designer → [APPROVAL] → implementer
```
Full workflow per `.claude/workflows/primary-workflow.md`.

---

Task: $ARGUMENTS
