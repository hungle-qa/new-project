# new-project

A Claude Code starter kit that gives you a ready-made agent workflow for building full-stack web applications. Clone it, open it in Claude Code, and use the built-in commands to go from idea to shipped product.

---

## What this is

This repo is a pre-configured `.claude/` folder — no application code included. It provides **agents, commands, and a knowledge base** that guide Claude through planning, building, documenting, and shipping your project.

You bring the idea. The agents handle the workflow.

---

## Commands

| Command | What it does |
|---------|-------------|
| `/brainstorm {idea}` | Strategic product session — Claude acts as a technical co-founder, stress-tests your plan, and outputs a structured spec |
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

- **code-rules/** — coding patterns (React state, TypeScript types, file I/O, Tailwind, etc.)
- **agent-rules/** — agent-authoring patterns (separation of concerns, prompt engineering, workflow execution, etc.)

Claude reads matching rules **before** writing any code or editing any agent file. When you hit a new mistake, `/rulecode` or `/ruleagent` saves it so it only happens once.

---

## Getting started

1. Clone this repo
2. Open the folder in Claude Code
3. `/brainstorm {your idea}` — plan your first feature
4. `/start {feature}` — build it
5. `/doc create project-overview` — generate docs
6. `/ship` — commit and merge

---

## Tech stack (when building)

| Layer | Technology |
|-------|------------|
| Frontend | React + TypeScript |
| Backend | Express + TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Storage | File-based markdown (no database) |

---

## Project structure

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
