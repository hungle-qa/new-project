# System Architecture

How the agent system works — from the command you type to the code that gets written.

---

## The three layers

Every workflow in this project follows the same pattern:

```
You type a command
       |
       v
  +---------+       +--------+       +--------+
  | Command | ----> | Agent  | ----> | Skill  |
  | (route) |       | (plan) |       | (do)   |
  +---------+       +--------+       +--------+
```

- **Commands** receive your input and pass it to the right agent. They contain no logic.
- **Agents** read your input, classify the task, and decide which skill to run.
- **Skills** execute the actual work — reading files, writing code, generating docs.

This separation means each layer has one job. Commands never write code. Agents never execute directly. Skills never decide what to do — they follow the agent's classification.

---

## Agents

Three agents handle different types of work.

### Brainstorm

Plans features before any code is written.

| Step | What happens | Stops? |
|------|-------------|--------|
| 1 | Classifies your idea as `app-build`, `ai-workflow`, or `hybrid` | No |
| 2 | Asks 3-5 clarification questions | Yes — waits for your answers |
| 3 | Lists blind spots and asks which ones to address | Yes — waits for your selection |
| 4 | Delivers architecture, MVP scope, tech stack, and next steps | No |

The agent has two skill files it can read depending on your domain:
- **app-build** — UI/UX, backend, frontend, database design
- **ai-workflow** — prompt chaining, RAG, LLM pipelines, cost estimation

For `hybrid` ideas, it reads both.

### Implementer

Builds and modifies application code.

| Step | What happens |
|------|-------------|
| 1 | Classifies your task by complexity |
| 2 | Reads the matching skill file |
| 3 | Gathers context from the codebase |
| 4 | Plans the implementation (medium/hard only) |
| 5 | Gets your approval before coding (medium/hard only) |
| 6 | Writes code and verifies with TypeScript compiler |

Classification determines the workflow:

| Level | Scope | Approval needed? | Tool budget |
|-------|-------|-------------------|-------------|
| **Easy** | 1 file — typo, CSS fix, config change | No | 2 tools max |
| **Medium** | 2-3 files — small feature, UI pattern | Yes | 10 tools max |
| **Hard** | 4+ files — new API, refactor, complex feature | Yes | Unlimited |

If a task is classified wrong (e.g., easy but needs 2 files), the skill raises an error and asks for reclassification.

### Doc-writer

Creates and maintains project documentation.

| Operation | What it does | Writes files? |
|-----------|-------------|---------------|
| **review** | Audits docs for freshness and accuracy, scores consumability 0-10 | No — console only |
| **create** | Generates a new doc from codebase context | Yes — after your approval |
| **update** | Updates an existing doc with latest changes | Yes — after your approval |

Five doc types are supported:

| Type | Output file |
|------|------------|
| `context` | `docs/context-summary.md` |
| `project-overview` | `docs/project-overview.md` |
| `codebase-summary` | `docs/codebase-summary.md` |
| `design-guidelines` | `docs/design-guidelines.md` |
| `system-architecture` | `docs/system-architecture.md` |

Each doc type has a predefined list of source files that the agent reads before writing.

---

## Direct commands

Three commands run without an agent. They contain their own logic.

### /ship

Commits your work and merges it to main:

1. Stages and commits all changes
2. Pushes your branch
3. Merges into main (no force-push allowed)
4. Switches back to your branch

Stops on merge conflicts or push failures.

### /rulecode

Captures a coding mistake into the knowledge base:

1. Analyzes the conversation for what went wrong
2. Finds the matching category in `.claude/code-rules/`
3. Appends the rule (Mistake / Fix / Example format)
4. Updates the keyword index if needed

### /ruleagent

Same as `/rulecode` but for agent-authoring mistakes. Adds one extra step: checks for overlap with existing rules before saving.

---

## Knowledge base

Two keyword-indexed knowledge bases prevent the same mistakes from repeating.

### Code rules

Stored in `.claude/code-rules/`. Loaded automatically when task keywords match.

| Category | Covers |
|----------|--------|
| csv-parsing | CSV alignment, JSON-to-CSV, column counting |
| react-state | Stale closures, re-renders, controlled components |
| file-io | Path handling, race conditions, temp file cleanup |
| typescript-types | Type narrowing, `any` escapes, import types |
| tailwind-styling | Class ordering, shadcn/ui overrides, scrollbar layout shift |
| ui-keyboard | Keyboard shortcuts for popups, modals, dialogs |
| node-eval | Why `node -e` fails in zsh — use temp files instead |

### Agent rules

Stored in `.claude/agent-rules/`. Loaded when editing files in `.claude/commands/`, `.claude/agents/`, or `.claude/skills/`.

| Category | Covers |
|----------|--------|
| separation-of-concerns | Commands dispatch, agents orchestrate, skills execute |
| workflow-execution | Step sequencing, STOP conditions, user interaction gates |
| file-conventions | Directory layout, naming standards, metadata format |
| prompt-engineering | Writing clear instructions that Claude follows reliably |
| content-lifecycle | Avoiding duplicates, deprecating stale rules |

---

## Relationship mapping

Every file in `.claude/` has a relationship map that lists what depends on it. The central index lives in `.claude/CLAUDE.md`.

When you update any file:

1. Check `CLAUDE.md` to find the matching relationship file
2. Read the relationship file to see all connected files
3. Verify those files are still consistent
4. Update the relationship file if the connection changed

Six relationship maps exist:

| Map | Tracks |
|-----|--------|
| `brainstorm.md` | Brainstorm command + agent + skills |
| `implementer.md` | Start command + agent + skills + dev rules |
| `doc-writer.md` | Doc command + agent + skills + output files |
| `direct-commands.md` | Ship, rulecode, ruleagent commands |
| `rules.md` | Both knowledge bases + rule indexes + dev rules |
| `app-module.md` | Vertical slice pattern for app features |

---

## Application architecture

When you build features with `/start`, the app follows a vertical slice pattern.

```
source/{module}/          Markdown data files (your "database")
       |
       v
server/src/services/      File-based service (reads/writes markdown)
       |
       v
server/src/routes/        Express API endpoints
       |
       v
client/src/pages/         React page components
       |
       v
client/src/components/    Module-specific UI components
```

Each feature is a self-contained module:
- **No cross-module imports** — modules talk through the API only
- **Module-specific components** live in `components/{module}/`, not in shared folders
- **New feature** = new service + route + page + components folder

Shared code (hooks, utilities) lives in `client/src/hooks/` and `client/src/utils/`.

---

## Approval gates

The system uses explicit approval points to keep you in control.

| Where | When |
|-------|------|
| Brainstorm Step 2 | Before proceeding past clarification questions |
| Brainstorm Step 3 | Before proceeding past blind spot selection |
| Implementer (medium) | Before writing any code |
| Implementer (hard) | Before writing any code |
| Doc-writer (create) | Before writing the file |
| Doc-writer (update) | Before writing the file |

Easy implementations and doc reviews skip approval — they are low-risk operations.

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | React + TypeScript |
| Backend | Express + TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Storage | File-based markdown with gray-matter frontmatter |

No database. All data is stored as markdown files in `source/{module}/`, parsed with gray-matter for frontmatter metadata.
