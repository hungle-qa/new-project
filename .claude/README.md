# .claude — Claude Code Configuration

This folder configures Claude Code for your project. It gives Claude a structured workflow for planning, building, documenting, and shipping — and a self-correcting knowledge base that grows over time.

---

## Folder Structure

```
.claude/
├── CLAUDE.md               ← Relationship index (read this first)
├── agents/                 ← Orchestrator agents
├── commands/               ← Slash commands you type in Claude Code
├── skills/                 ← Step-by-step logic used by agents
├── rules/                  ← Rule indexes (code + agent rules)
├── code-rules/             ← Coding mistake knowledge base
├── agent-rules/            ← Agent-authoring mistake knowledge base
├── workflows/              ← Development standards
└── relationships/          ← File dependency maps
```

---

## Commands

Type these directly in Claude Code:

| Command | What it does |
|---------|-------------|
| `/brainstorm {idea}` | Strategic session — stress-tests your plan, outputs a structured spec |
| `/start {feature}` | Builds or enhances a feature — auto-picks the right workflow |
| `/doc {operation} {type}` | Creates, reviews, or updates project documentation |
| `/ship [message]` | Commits all changes and pushes to main |
| `/rulecode` | Saves a new coding lesson to `code-rules/` |
| `/ruleagent` | Saves a new agent-authoring lesson to `agent-rules/` |

---

## Agents

Agents orchestrate multi-step work. Claude picks the right one based on your command.

| Agent | Role |
|-------|------|
| `implementer` | Plans and builds features — routes to easy/medium/hard skills |
| `brainstorm` | Product strategy and devil's advocate analysis |
| `doc-writer` | Turns technical content into clear user-facing documentation |

---

## Knowledge Bases

Two self-growing mistake libraries prevent Claude from repeating errors:

- **`code-rules/`** — coding patterns: React state, TypeScript, file I/O, Tailwind, CSV parsing, etc.
- **`agent-rules/`** — agent-authoring patterns: separation of concerns, prompt engineering, workflow execution, etc.

Claude scans these **before writing any code or agent file**. When a new mistake happens, `/rulecode` or `/ruleagent` saves it permanently.

---

## Relationship System

`CLAUDE.md` is the master index. Every file maps to a **relationship file** in `relationships/` that lists all related files to check when making a change.

**How it works:**
1. You edit a file
2. Claude reads `CLAUDE.md` → finds the matching relationship file
3. Reads it → checks and updates all related files listed there

This keeps connected files in sync automatically.

---

## Adding to a New Project

Use the Electron app (`npm start`) or shell script (`bash integrate.command`) to copy this `.claude/` folder into any existing project.
