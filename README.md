# BA Demo Tool

Create demo pages from product ideas and generate specs. All data is stored as markdown files (no database).

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

## Two Workflows

| Workflow | Purpose | Command |
|----------|---------|---------|
| **Primary Workflow** | Code the main app (React + Express) | `/start` |
| **Create Demo Workflow** | Build demo projects in `source/demo/` | `/create-demo` |

---

## Primary Workflow

**Purpose:** Build and enhance the main BA Demo Tool application.

### Agent Chain
```
scout.md → planner.md → designer.md → implementer.md
```

| Step | Agent | What It Does | Output |
|------|-------|--------------|--------|
| 1 | `scout` | Search `client/src/`, `server/` | File references, patterns |
| 2 | `planner` | Create implementation plan | `plans/{feature}-plan.md` |
| 3 | `designer` | Suggest UI/UX (if needed) | Component recommendations |
| 4 | `implementer` | Write production code | TypeScript files |

### How to Run

```
/start {feature description}
```

### Scope

Use Primary Workflow for:
- Design System management UI
- Spec Template management UI
- Product Ideas management UI
- Demo Projects management UI
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

## Create Demo Workflow

**Purpose:** Build demo projects with HTML pages in `source/demo/`.

### Agent Chain
```
demo-folder-creator.md → scout.md → planner.md → designer.md → implementer.md → write-spec.md
```

| Step | Agent | What It Does | Output |
|------|-------|--------------|--------|
| 1 | `demo-folder-creator` | Create folder structure | `source/demo/{name}/` |
| 2 | `scout` | Scout demo + design-system only | Available components |
| 3 | `planner` | Plan demo pages | Page structure |
| 4 | `designer` | Suggest UI composition | Layout recommendations |
| 5 | `implementer` | Build HTML pages | `pages/*.html` |
| 6 | `write-spec` | Generate specification | `spec/{name}.md` |

### How to Run
```
/create-demo
/create-demo {project-name}
/create-demo from @product-idea {idea-name}
```

### Scope

Use Create Demo Workflow for:
- Create new demo project folders
- Build demo pages using design system
- Generate spec from demo

### Examples
```
/create-demo client-portal
/create-demo from @product-idea fitness-tracker
```

### Fix Existing Demo
```
/fix-demo {project-name}
/fix-demo {project-name}: {issue description}
```

**Examples:**
```
/fix-demo client-portal
/fix-demo hello-world-page: button not aligned
```

---

## Import Commands

Import source materials (independent of workflows):

| Command | Purpose | Output |
|---------|---------|--------|
| `@import-design` | Import HTML/CSS component | `source/design-system/{name}.md` |
| `/import-design-by-image` | Convert UI image(s) to component | `source/design-system/{name}.md` |
| `@import-idea` | Import product idea | `source/product-idea/{name}.md` |
| `@import-spec-template` | Import spec template | `source/spec-template/{name}.md` |

### Import Design By Image (Mode Detection)

The `/import-design-by-image` command auto-detects single vs multi-image mode:

| Mode | Detection | Agent |
|------|-----------|-------|
| SINGLE | 1 image attached | `import-design-by-image-single` |
| MULTI | 2+ images (states) | `import-design-by-image-multi` |

**Usage:**
```
/import-design-by-image [attach 1 image]      → Single mode
/import-design-by-image [attach 2+ images]    → Multi mode (states)
```

---

## Project Structure

```
BA kit_v1/
├── source/                    # All content (file-based storage)
│   ├── demo/                  # Demo projects (create-demo workflow)
│   │   └── {project-name}/
│   │       ├── README.md
│   │       ├── components/
│   │       ├── pages/
│   │       ├── assets/
│   │       └── spec/
│   ├── design-system/         # HTML/CSS components (.md)
│   ├── product-idea/          # Product ideas (.md)
│   └── spec-template/         # Spec templates (.md)
│
├── client/                    # React Frontend (primary workflow)
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── hooks/
│       └── utils/
│
├── server/                    # Express Backend (primary workflow)
│   ├── routes/
│   ├── services/
│   └── utils/
│
└── .claude/                   # Workflow configuration
    ├── agents/                # Agent definitions (pure executors)
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
| GET | /api/product-idea | List all product ideas |
| GET | /api/product-idea/:name | Get idea by name |
| GET | /api/demo | List all demos |
| GET | /api/demo/:name | Get demo details |

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
| `scout` | Search codebase for context | Both workflows |
| `planner` | Create implementation plans | Both workflows |
| `designer` | Suggest UI composition | Both workflows |
| `implementer` | Write code | Both workflows |
| `write-spec` | Generate spec from demo | Demo workflow |
| `demo-folder-creator` | Create demo folder structure | Demo workflow |

### Import Agents
| Agent | Purpose |
|-------|---------|
| `import-design` | Import HTML/CSS components |
| `import-design-by-image-single` | Convert single UI image to HTML/CSS |
| `import-design-by-image-multi` | Convert multiple state images to HTML/CSS |
| `import-idea` | Import product ideas |
| `import-spec-template` | Import spec templates |

### Meta Agents
| Agent | Purpose |
|-------|---------|
| `agia` | Audit and improve agents and system files |
| `doc-writer` | Create user-friendly documentation for end users |

---

## File Reference

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Project instructions for Claude |
| `.claude/workflows/primary-workflow.md` | Main app coding workflow |
| `.claude/workflows/create-demo-workflow.md` | Create demo workflow |
| `.claude/workflows/fix-demo-workflow.md` | Fix demo workflow |
| `.claude/workflows/development-rules.md` | Coding standards |
| `.claude/agents/*.md` | Agent definitions |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Wrong workflow | Use `/start` for app code, `/create-demo` for demo |
| Scout finds nothing | Try different keywords |
| Demo files in wrong place | Check you're using `/create-demo` |
