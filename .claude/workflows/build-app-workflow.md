# Build App Workflow

**Purpose:** Build and enhance the main QA-kit application (React + Express).

**Target:** TypeScript code in `client/src/` and `server/src/`

**NEVER:** Update `.md` files directly. This workflow builds the app only.

---

## Agent Data Flow

```
[User Request]
      |
  ┌─────────────┐
  │ implementer  │
  └─────────────┘
  .claude/agents/implementer.md
  Read context → Show plan → Wireframe (if UI) → Ask approval → Write code
  TypeScript files in client/src/, server/
```

---

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

**If clearly app-related -> proceed. If unclear -> ask.**

---

## Execution

**IMPORTANT:** Read and follow `.claude/agents/implementer.md` for ALL tasks.

**All tasks go through the implementer agent:**

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

## File Targets

| Feature Area | Files |
|--------------|-------|
| Design System | `client/src/pages/DesignSystemPage.tsx`, `server/src/routes/design-system.ts` |
| Feature Knowledge | `client/src/pages/FeatureKnowledgePage.tsx`, `server/src/routes/feature-knowledge.ts` |
| Testcase Manager | `client/src/pages/TestcaseManagerPage.tsx`, `server/src/routes/testcase.ts` |
| Import Features | `client/src/components/Import*.tsx`, `server/src/services/*Service.ts` |

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + TypeScript |
| Backend | Express + TypeScript |
| Styling | Tailwind CSS |
| Storage | File-based (markdown) |

## Examples

```
/start Fix typo in Button.tsx
/start Add search to design system page
/start Rebuild entire navigation system
```

All go through implementer. Implementer handles context reading, planning, wireframe, approval, and coding.

## Rules

1. **Always proceed**: Execute workflow for all `/start` tasks
2. **Read implementer agent**: Follow `.claude/agents/implementer.md` instructions
3. **Wireframe for UI**: Any task with UI changes MUST show wireframe before approval
4. **File-based storage**: No database, use markdown files
