# QA-kit

QA testcase generation platform. Import components (AI learns UI), import testcase templates + rules, then generate testcases from feature specs. All data is stored as markdown files (no database).

## Quick Start

### 1. Install dependencies
```bash
npm run install:all
```

### 2. Run development server
```bash
npm run dev
```

This starts:
- **Client**: http://localhost:3000
- **Server**: http://localhost:3001

### 3. Open browser
Navigate to http://localhost:3000

---

## Workflows

| Workflow | Purpose | Command |
|----------|---------|---------|
| **Build App Workflow** | Code the main app (React + Express) | `/start` |
| **Testcase Workflow** | Generate QA testcases from specs | `/testcase` |
| **Doc Workflow** | Manage project documentation | `/doc` |

---

## Build App Workflow

**Purpose:** Build and enhance the main QA-kit application.

### Agent Chain
```
scout(built-in) -> planner(built-in) -> [APPROVAL] -> implementer
```

| Step | Agent | What It Does | Output |
|------|-------|--------------|--------|
| 1 | `scout (built-in)` | Search `client/src/`, `server/` via Task tool | File references, patterns |
| 2 | `planner (built-in)` | Create implementation plan via Task tool | Implementation plan |
| 3 | `implementer` | Write production code | TypeScript files |

### How to Run

```
/start {feature description}
```

### Scope

Use Build App Workflow for:
- Design System management UI
- Testcase Manager management UI

- Import features
- Backend API enhancements
- Bug fixes in `client/` or `server/`

### Examples
```
/start Add search to design system page
/start Add pagination to API
/start Fix status toggle
```

---

## Testcase Workflow

**Purpose:** Generate and manage QA testcases from feature specs using templates and rules.

### Agent Chain
```
testcase-writer (skill-based: write / update)
```

### Operations

| Operation | Usage | Description |
|-----------|-------|-------------|
| `write` | `/testcase write {feature}` | Generate testcases from spec + template + rules |
| `write-lite` | `/testcase write-lite {feature}` | Lean testcases — spec + rules only, no digest |
| `update` | `/testcase update {feature}` | Update existing testcases (add, edit, remove) |

### How to Run

```
/testcase write {feature}           # Generate testcases (full)
/testcase write-lite {feature}      # Generate testcases (lean, spec-only)
/testcase update {feature}          # Update existing testcases
```

### Prerequisites

Before running `/testcase write` or `/testcase write-lite`, ensure:
1. Template CSV exists in `source/testcase/template/` (write only)
2. Rules exist at `source/testcase/rule/test-rules.md`
3. Feature spec imported via the Web UI (Testcase Manager > Import Spec tab)

### Examples
```
/testcase write login-page
/testcase write-lite login-page
/testcase update login-page
```

---

## Doc Workflow

**Purpose:** Review, create, and update project documentation from codebase context.

### Agent Chain
```
doc-writer (skill-based: review / create / update)
```

### How to Run

```
/doc review                         # Audit all docs
/doc review {doc-type}              # Audit single doc
/doc create {doc-type}              # Generate doc from context
/doc update {doc-type}              # Update existing doc
```

### Doc Types

| Doc Type | File | Content |
|----------|------|---------|
| `context` | `docs/context-summary.md` | CLAUDE.md + README + workflows + agents |
| `project-overview` | `docs/project-overview.md` | Purpose, goals, scope |
| `codebase-summary` | `docs/codebase-summary.md` | Tech stack, structure, API endpoints |
| `design-guidelines` | `docs/design-guidelines.md` | UI patterns, Tailwind, shadcn/ui |
| `system-architecture` | `docs/system-architecture.md` | Agents, workflows, data flow |

### Examples
```
/doc review
/doc create context
/doc update codebase-summary
```

---

## Import Commands

Import source materials (independent of workflows):

| Command | Purpose | Output |
|---------|---------|--------|
| `@import-design` | Import HTML/CSS component | `source/design-system/{name}.md` |
| `/import-design-by-image` | Convert UI image(s) to component | `source/design-system/{name}.md` |

### Import Design By Image (Mode Detection)

The `/import-design-by-image` command auto-detects mode via the unified `import-design` agent:

| Mode | Detection | Skill Loaded |
|------|-----------|--------------|
| VALIDATE | HTML/CSS code pasted | `skills/import-design/validate.md` |
| SINGLE | 1 image attached | `skills/import-design/single.md` |
| MULTI | 2+ images (states) | `skills/import-design/multi.md` |
| UPDATE | No image + component name | `skills/import-design/update.md` |

**Usage:**
```
/import-design-by-image [attach 1 image]      -> Single mode
/import-design-by-image [attach 2+ images]    -> Multi mode (states)
/import-design-by-image update {Name}          -> Update mode
```

---

## Project Structure

```
QA-kit/
├── source/                    # All content (file-based storage)
│   ├── testcase/              # QA testcase data (testcase workflow)
│   │   ├── rule/              # test-rules.md (testcase generation rules)
│   │   ├── template/          # Imported CSV templates
│   │   ├── strategy/          # Strategy guides (spec-driven, scenario-based, etc.)
│   │   └── feature/           # All user-created feature folders
│   │       └── {feature-name}/    # Per-feature testcase data
│   │           ├── config.md      # Feature config (levels, scope, components)
│   │           ├── spec/          # Extracted spec from PDF
│   │           ├── knowledge/     # Knowledge files (PDF/MD/TXT)
│   │           └── result/        # Generated testcase CSVs
│   └── design-system/         # HTML/CSS components (.md)
│
├── client/                    # React Frontend (build-app workflow)
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── hooks/
│       └── utils/
│
├── server/                    # Express Backend (build-app workflow)
│   ├── routes/
│   ├── services/
│   └── utils/
│
└── .claude/                   # Workflow configuration
    ├── agents/                # Agent definitions (pure executors)
    │   └── skills/            # Skill files for skill-based agents
    ├── commands/              # Slash commands (thin routing)
    └── workflows/             # Workflow docs (orchestration)
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + TypeScript |
| Backend | Express + TypeScript |
| Styling | Tailwind CSS |
| Storage | File-based (markdown) |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/design-system | List all components |
| GET | /api/design-system/:name | Get component by name |
| GET | /api/testcase | List all features |
| GET | /api/testcase/:feature | Get feature config |
| POST | /api/testcase | Create feature |
| PUT | /api/testcase/:feature | Update feature config |
| DELETE | /api/testcase/:feature | Delete feature |
| GET | /api/testcase/strategies | List available strategies |
| GET | /api/testcase/strategies/:name | Get strategy content |
| POST | /api/testcase/:feature/import-spec | Import spec via AI |
| GET | /api/testcase/:feature/spec | Get imported spec |
| POST | /api/testcase/:feature/knowledge | Upload knowledge file |
| DELETE | /api/testcase/:feature/knowledge/:filename | Delete knowledge file |
| GET | /api/testcase/:feature/results | List result CSVs |
| GET | /api/testcase/:feature/results/:filename | Get/download result CSV |

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Run both client and server |
| `npm run dev:client` | Run client only |
| `npm run dev:server` | Run server only |
| `npm run build` | Build for production |
| `npm run install:all` | Install all dependencies |

---

## Agents Reference

### Core Agents (Pure Executors)
| Agent | Purpose | Used By |
|-------|---------|---------|
| `implementer` | Write code | Build App workflow |

### Skill-Based Agents
| Agent | Purpose | Skills |
|-------|---------|--------|
| `testcase-writer` | Generate and manage QA testcases | write, update |
| `import-design` | Unified import agent (validate code, single/multi image, update existing) | validate, single, multi, update |
| `doc-writer` | Manage project documentation | review, create, update |
| `agia` | Audit and improve agents and system files | audit, update, test, optimize, create-skill, system-audit |

### Commands (Slash Commands)
| Command | Purpose |
|---------|---------|
| `/start` | Start build-app workflow for main app development |
| `/testcase` | Manage QA testcases (write, write-lite, update) |
| `/doc` | Manage project documentation (review, create, update) |

| `/import-design-by-image` | Convert UI images to design system components |
| `/agent-audit` | Audit, update, test, or optimize agents via AGIA |

### Meta Agents
| Agent | Purpose |
|-------|---------|
| `agia` | Audit and improve agents and system files (skill-based: audit/update/test/optimize/create-skill/system-audit) |

---

## File Reference

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Project instructions for Claude |
| `.claude/agents/implementer.md` | Build app workflow |
| `.claude/agents/testcase-writer.md` | QA testcase generation workflow |
| `.claude/agents/doc-writer.md` | Documentation management workflow |
| `.claude/agents/import-design.md` | Import design components workflow |
| `.claude/agents/agia.md` | Agent audit + improvement workflow |
| `.claude/workflows/development-rules.md` | Coding standards |
| `.claude/agents/skills/` | Skill files for skill-based agents |
| `.claude/commands/*.md` | Slash command definitions |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Wrong workflow | Use `/start` for app code, `/testcase` for testcases |
| Spec not imported | Import spec via Web UI (Testcase Manager > Import Spec tab) before write |
| Template missing | Add CSV template to `source/testcase/template/` |
| Rules missing | Add rules to `source/testcase/rule/test-rules.md` |
