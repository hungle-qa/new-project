# Build App Workflow

**Purpose:** Classify task complexity, inform user, then dispatch to implementer agent with the right skill.

**Entry Point:** `/start` command

**Target:** TypeScript code in `client/src/` and `server/src/`

**NEVER:** Update `.md` files directly. This workflow builds the app only.

---

## Step 1: Clarification Check

**If task could mean EITHER app UI OR documentation, ASK user:**

| Ambiguous Task | Clarify |
|----------------|---------|
| "Update User Guide" | App UI or docs/user-guide.md? |
| "Add help section" | React component or README? |

**If clearly app-related → proceed. If unclear → ask.**

---

## Step 2: Classify Task

Match user's task against this table:

| Level | Signals | Examples |
|-------|---------|----------|
| **EASY** | 1 file, specific fix, path known | Fix typo, update label, CSS tweak, remove import |
| **MEDIUM** | 2-3 files, standard UI pattern, props/state addition | Add search bar, new modal, form with validation |
| **HARD** | 4+ files, new API, refactoring, complex data flow | New module, auth system, multi-step wizard |

**Output format (display to user):**

```
**Classification:** EASY / MEDIUM / HARD
**Scope:** {estimated file count}
**Rationale:** {1 sentence}
```

---

## Step 3: Load Skill & Dispatch

1. Read the matching skill file:
   - EASY → `.claude/agents/skills/implementer/easy.md`
   - MEDIUM → `.claude/agents/skills/implementer/medium.md`
   - HARD → `.claude/agents/skills/implementer/hard.md`

2. Call implementer agent via `Task` tool with this prompt:

```
Task: {user's original request}

Classification: {EASY/MEDIUM/HARD}

## Skill Rules
{paste entire skill file content here}

Execute according to the Skill Rules above.
```

3. When implementer finishes, relay its report to user.

---

## Validation Before Dispatch

- [ ] Classification is one of: EASY, MEDIUM, HARD
- [ ] Skill file was read successfully
- [ ] User saw classification message

If any fails → stop and report error.

---

## Example Full Flow

```
User: "/start Add search to design system"
  ↓
Step 1: Clearly app-related → proceed
  ↓
Step 2: Classification: MEDIUM — 2-3 files, standard UI pattern
  ↓
Step 3: Read medium.md → call Task(implementer) with embedded skill rules
  ↓
Implementer executes → returns report → relay to user
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + TypeScript |
| Backend | Express + TypeScript |
| Styling | Tailwind CSS |
| Storage | File-based (markdown) |

## File Targets

| Feature Area | Files |
|--------------|-------|
| Design System | `client/src/pages/DesignSystemPage.tsx`, `server/src/routes/design-system.ts` |
| Feature Knowledge | `client/src/pages/FeatureKnowledgePage.tsx`, `server/src/routes/feature-knowledge.ts` |
| Testcase Manager | `client/src/pages/TestcaseManagerPage.tsx`, `server/src/routes/testcase.ts` |
| Import Features | `client/src/components/Import*.tsx`, `server/src/services/*Service.ts` |

## Rules

1. **Always classify first**: Never skip classification step
2. **Message user**: User must see classification BEFORE implementer runs
3. **Read implementer agent**: Follow `.claude/agents/implementer.md` instructions
4. **File-based storage**: No database, use markdown files
