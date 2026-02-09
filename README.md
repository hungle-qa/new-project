# QA-kit

QA testcase generation platform. Import components (AI learns UI), import testcase templates + rules, then generate testcases from feature specs. Also creates demo pages from product ideas. All data is stored as markdown files (no database).

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
| **Create Demo Workflow** | Build demo projects in `source/demo/` | `/create-demo` |

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
- Spec Template management UI
- Review Testcase management UI
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

## Testcase Workflow

**Purpose:** Generate and manage QA testcases from feature specs using templates and rules.

### Agent Chain
```
testcase-writer (skill-based: init / import-spec / write / update)
```

### How to Run

```
/testcase init                      # One-time setup: template + rules
/testcase import-spec {feature}     # Import PDF spec for a feature
/testcase write {feature}           # Generate testcases
/testcase update {feature}          # Update existing testcases
```

### Typical Workflow Order
```
1. /testcase init                    -> Setup template + rules
2. /testcase import-spec login-page  -> Import spec from PDF
3. /testcase write login-page        -> Generate testcase CSV
4. /testcase update login-page       -> Iterate as needed
```

### Examples
```
/testcase init
/testcase import-spec login-page
/testcase write login-page
/testcase update login-page
```

---

## Create Demo Workflow

**Purpose:** Build demo projects with HTML pages in `source/demo/`.

### Agent Chain (COMPLEX Tier)
```
demo-folder-creator.md -> scout.md -> planner.md -> designer.md -> implementer.md
```

| Step | Agent | What It Does | Output |
|------|-------|--------------|--------|
| 1 | `demo-folder-creator` | Create folder structure | `source/demo/{name}/` |
| 2 | `scout` | Scout demo + design-system only | Available components |
| 3 | `planner` | Plan demo pages | Page structure |
| 4 | `designer` | Suggest UI composition | Layout recommendations |
| 5 | `implementer` | Build HTML pages | `pages/*.html` |

**Tiered execution:** SIMPLE skips scout/planner/designer. MEDIUM uses `quick-scout` instead of full scout+planner+designer.

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
│   │   └── {feature-name}/    # Per-feature testcase data
│   │       ├── config.md      # Feature config (levels, scope, components)
│   │       ├── spec/          # Extracted spec from PDF
│   │       ├── knowledge/     # Knowledge files (PDF/MD/TXT)
│   │       └── result/        # Generated testcase CSVs
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
| GET | /api/review-testcase | List all features |
| GET | /api/review-testcase/:feature | Get feature config |
| POST | /api/review-testcase | Create feature |
| PUT | /api/review-testcase/:feature | Update feature config |
| DELETE | /api/review-testcase/:feature | Delete feature |
| POST | /api/review-testcase/:feature/import-spec | Import spec via AI |
| GET | /api/review-testcase/:feature/spec | Get imported spec |
| POST | /api/review-testcase/:feature/knowledge | Upload knowledge file |
| DELETE | /api/review-testcase/:feature/knowledge/:filename | Delete knowledge file |
| GET | /api/review-testcase/:feature/results | List result CSVs |
| GET | /api/review-testcase/:feature/results/:filename | Get/download result CSV |
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
| `implementer` | Write code | Build App workflow |

### Skill-Based Agents
| Agent | Purpose | Skills |
|-------|---------|--------|
| `testcase-writer` | Generate and manage QA testcases | init, import-spec, write, update |
| `import-design` | Unified import agent (validate code, single/multi image, update existing) | validate, single, multi, update |
| `agia` | Audit and improve agents and system files | audit, update, test, optimize, create-skill, system-audit |

### Import Agents
| Agent | Purpose |
|-------|---------|
| `import-idea` | Import product ideas |
| `import-spec-template` | Import spec templates |

### Commands (Slash Commands)
| Command | Purpose |
|---------|---------|
| `/start` | Start build-app workflow for main app development |
| `/testcase` | Manage QA testcases (init, import-spec, write, update) |
| `/create-demo` | Create a demo project with tiered execution |
| `/fix-demo` | Fix issues in an existing demo project |
| `/import-design-by-image` | Convert UI images to design system components |
| `/agent-audit` | Audit, update, test, or optimize agents via AGIA |

### Meta Agents
| Agent | Purpose |
|-------|---------|
| `agia` | Audit and improve agents and system files (skill-based: audit/update/test/optimize/create-skill/system-audit) |
| `doc-writer` | Create user-friendly documentation for end users |

---

## File Reference

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Project instructions for Claude |
| `.claude/workflows/build-app-workflow.md` | Main app coding workflow |
| `.claude/workflows/testcase-workflow.md` | QA testcase generation workflow |
| `.claude/workflows/create-demo-workflow.md` | Create demo workflow |
| `.claude/workflows/fix-demo-workflow.md` | Fix demo workflow |
| `.claude/workflows/development-rules.md` | Coding standards |
| `.claude/agents/*.md` | Agent definitions |
| `.claude/agents/skills/` | Skill files for skill-based agents |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Wrong workflow | Use `/start` for app code, `/testcase` for testcases, `/create-demo` for demo |
| Scout finds nothing | Try different keywords |
| Demo files in wrong place | Check you're using `/create-demo` |
| Testcase init missing | Run `/testcase init` before write/update |
| Spec not imported | Run `/testcase import-spec {feature}` before write |
