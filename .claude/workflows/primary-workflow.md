# Primary Workflow

**Purpose:** Build and enhance the main BA Demo Tool application (React + Express).

**Target:** TypeScript code in `client/src/` and `server/src/`

**NEVER:** Update `.md` files directly. This workflow builds the app only.

## Scope

- React components in `client/src/`
- Express routes in `server/src/`
- TypeScript services, hooks, utils
- Bug fixes in app code
- New features and enhancements

## Clarification Check

**If task is ambiguous (could mean app UI OR documentation), ASK user first:**

| Ambiguous Task | Clarify |
|----------------|---------|
| "Update User Guide" | App UI or docs/user-guide.md? |
| "Add help section" | React component or README? |
| "Update about content" | AboutPage.tsx or docs? |

**If clearly app-related → proceed. If unclear → ask.**

---

## Quick Mode (Simple Tasks)

**For SIMPLE tasks** (single file, clear change, bug fix with known location):

- ❌ Skip scout (file is known)
- ❌ Skip planner (no plan file needed)
- ❌ Skip designer (no UI decisions)
- ✅ Go direct to implementer

**Trigger conditions:**
- User specifies exact file path
- Keywords: "fix", "typo", "rename", "change text"
- Single component/file change
- No new files needed

**Chain:** `implementer` only

---

## Medium Mode (Clear Scope Tasks)

**For MEDIUM tasks** (2-3 files, clear feature, no architecture decisions):

- ✅ quick-scout (find files + inline plan)
- ❌ Skip planner file creation
- ❌ Skip designer
- ✅ implementer

**Trigger conditions:**
- Clear feature scope (e.g., "add search to X")
- 2-3 files affected
- No architectural decisions needed

**Chain:** `quick-scout → implementer`

**Inline Plan Format** (shown in console, no file):
```
📋 Inline Plan:
- Edit: `client/src/pages/DesignSystemPage.tsx`
- Add: Search input + filter state + filter logic
Proceed? [Yes/Modify/Cancel]
```

---

## Full Mode (Complex Tasks)

**For COMPLEX tasks** (multi-file, unclear scope, architectural):

## Agent Chain

```
scout → planner → [USER APPROVAL] → designer → [USER APPROVAL] → implementer
```

| Step | Agent | Purpose | Output | User Approval |
|------|-------|---------|--------|---------------|
| 1 | `scout` | Search codebase | File references | No |
| 2 | `planner` | Create plan | `plans/{feature}-plan.md` | **YES** |
| 3 | `designer` | Suggest UI/UX | Wireframe + components | **YES** |
| 4 | `implementer` | Write code | TypeScript files | No |

## Orchestration

### Step 1: Scout

Call `.claude/agents/scout.md` with:
- **workflow**: "primary"
- **scope**: `client/src/`, `server/`, `source/` (references only)
- **skip**: `source/demo/` (demos handled by separate workflow)
- **task**: User's feature description

**Output**: File paths, existing patterns, relevant code

### Step 2: Planner

Call `.claude/agents/planner.md` with:
- **scout_findings**: Output from scout
- **task**: User's feature description
- **workflow**: "primary"

**Output**: `plans/{feature}-plan.md`

**⏸️ PAUSE: Ask user to approve plan before continuing.**

### Step 3: Designer (if UI involved)

**Skip if**: No UI changes needed (backend-only work)

Call `.claude/agents/designer.md` with:
- **plan**: Output from planner
- **workflow**: "primary"

**Output**: ASCII wireframe + component recommendations

**⏸️ PAUSE: Ask user to approve design before continuing.**

### Step 4: Implementer

Call `.claude/agents/implementer.md` with:
- **plan**: Output from planner
- **designer_suggestions**: Output from designer (if any)
- **workflow**: "primary"

**Output**: TypeScript files in `client/src/` and/or `server/`

## File Targets

| Feature Area | Files |
|--------------|-------|
| Design System | `client/src/pages/DesignSystemPage.tsx`, `server/src/routes/design-system.ts` |
| Spec Templates | `client/src/pages/SpecTemplatePage.tsx`, `server/src/routes/spec-template.ts` |
| Product Ideas | `client/src/pages/ProductIdeasPage.tsx`, `server/src/routes/product-idea.ts` |
| Demo Projects | `client/src/pages/DemoProjectsPage.tsx`, `server/src/routes/demo.ts` |
| Import Features | `client/src/components/Import*.tsx`, `server/src/services/*Service.ts` |

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + TypeScript |
| Backend | Express + TypeScript |
| Styling | Tailwind CSS |
| Storage | File-based (markdown) |

## Examples (Tier-Based)

### SIMPLE Tier Examples
```
/start Fix typo in Button.tsx
```
**Flow:** implementer only (direct fix)
**Savings:** 75% fewer agents

```
/start Rename variable in DesignSystemPage.tsx
```
**Flow:** implementer only
**Why:** Single file, exact path given

### MEDIUM Tier Examples
```
/start Add search to design system page
```
**Flow:** quick-scout → implementer
**Savings:** 50% fewer agents, no plan file

```
/start Add filter dropdown to component list
```
**Flow:** quick-scout → implementer
**Why:** Clear scope, 2-3 files, no architecture decisions

### COMPLEX Tier Examples
```
/start Rebuild entire navigation system
```
**Flow:** scout → planner → [APPROVAL] → designer → [APPROVAL] → implementer
**Why:** Multi-file, architectural changes, unclear scope

```
/start Add new authentication module
```
**Flow:** Full workflow with approvals
**Why:** New feature, multiple components/services

### Backend-Only Example
```
/start Add pagination to spec template API
```
**Flow:** quick-scout → implementer (skip designer - no UI)

## Rules

1. **Always proceed**: Execute workflow for all `/start` tasks
2. **Tier detection FIRST**: Classify as SIMPLE/MEDIUM/COMPLEX before proceeding
3. **Match tier to chain**: Use appropriate agent chain for complexity level
4. **Minimize overhead**: Don't use full workflow for simple tasks
5. **Designer optional**: Skip if no UI changes needed (any tier)
6. **File-based storage**: No database, use markdown files
