# new-project

A Claude Code configuration toolkit. It gives you a ready-made agent workflow for planning, building, documenting, and shipping full-stack web applications — and a script to copy that setup into any project you already have.

---

## What this is

This repo contains a pre-configured `.claude/` folder — no application code included. It provides **agents, commands, skills, and a knowledge base** that guide Claude through the full development cycle.

You bring the project. The agents handle the workflow.

---

## How to integrate into another project

Use `integrate.sh` to copy the `.claude/` folder from this repo into any target project on your machine.

### Run directly

```bash
# Pass the target path as an argument
./integrate.sh ~/projects/my-app

# Or run it with no arguments — it will prompt you
./integrate.sh
```

### Run via npm

```bash
npm run integrate
```

You can also double-click `integrate.sh` in macOS Finder to run it interactively.

### What it does, step by step

1. Asks for a target project path (or reads it from the argument you passed)
2. Checks that the path exists
3. Creates a timestamped backup of any existing `.claude/` folder — for example, `.claude.bak.20260316_143022`
4. Walks every file in the source `.claude/` and copies it to the target
5. If a file already exists in the target, it asks: **overwrite? (y/n)**
6. Prints a summary: how many files were copied and how many were skipped

---

## Conflict handling

When a file already exists at the destination, the script pauses and asks you what to do:

```
Conflict: agents/implementer.md — overwrite? (y/n):
```

- Enter `y` to replace the file in the target project
- Enter `n` to keep the existing file

The backup created in step 3 means you can always restore the original state.

---

## Commands

Once integrated, these commands are available in Claude Code:

| Command | What it does |
|---------|-------------|
| `/brainstorm {idea}` | Strategic product session — stress-tests your plan and outputs a structured spec |
| `/start {feature}` | Builds or enhances features — auto-classifies task complexity and follows the right workflow |
| `/doc {operation} {type}` | Creates, reviews, or updates project documentation |
| `/ship [message]` | Commits all changes, merges to main, and returns to your branch |
| `/rulecode` | Captures a coding mistake so it never repeats |
| `/ruleagent` | Captures an agent-authoring mistake so it never repeats |

---

## Agent flow

```
You ──> Command ──> Agent ──> Skill
         │            │          │
      dispatch    orchestrate   execute
```

- **Commands** receive your input and route to the right agent
- **Agents** decide what to do — classify the task, pick a workflow, sequence the steps
- **Skills** do the actual work — read files, write code, generate docs

Three agents are included:

| Agent | Role |
|-------|------|
| **brainstorm** | Product architect — plans features, evaluates trade-offs, plays devil's advocate |
| **implementer** | Full-stack developer — writes React + Express code following project patterns |
| **doc-writer** | Documentation writer — creates user-facing guides from codebase context |

---

## Knowledge base

The `.claude/` folder includes two mistake-driven knowledge bases:

- **code-rules/** — coding patterns (React state, TypeScript types, file I/O, Tailwind, CSV parsing, etc.)
- **agent-rules/** — agent-authoring patterns (separation of concerns, prompt engineering, workflow execution, etc.)

Claude reads matching rules **before** writing any code or editing any agent file. When you hit a new mistake, `/rulecode` or `/ruleagent` saves it permanently.

---

## What gets integrated

```
.claude/
├── CLAUDE.md               # Relationship index — tracks file dependencies
├── agents/                 # Agent definitions (brainstorm, implementer, doc-writer)
├── commands/               # User-facing commands (brainstorm, start, doc, ship, ...)
├── skills/                 # Execution logic for each agent
├── agent-rules/            # Lessons learned — agent authoring
├── code-rules/             # Lessons learned — coding
├── relationships/          # File dependency maps
├── rules/                  # Rule indexes
└── workflows/              # Development standards
```

---

## Tech stack (when building)

| Layer | Technology |
|-------|------------|
| Frontend | React + TypeScript |
| Backend | Express + TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Storage | File-based markdown (no database) |
