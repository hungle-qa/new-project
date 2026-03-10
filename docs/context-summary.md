# Context Summary

## Project Overview

QA-kit is a testcase generation platform. You import UI components and specs, then generate testcases using rules and templates.

- **Frontend:** React + TypeScript
- **Backend:** Express + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Storage:** File-based (no database)
- **Client:** http://localhost:3000
- **API:** http://localhost:3001

---

## Workflows

| Workflow | Command | Agent |
|----------|---------|-------|
| Build App | `/start` | `implementer.md` |
| Testcase (write, write-lite, update) | `/testcase` | `testcase-writer.md` |
| Documentation | `/doc` | `doc-writer.md` |
| Import Design | `/import-design-by-image` | `import-design.md` |
| Agent Audit | `/agent-audit` | `agia.md` |
| Brainstorm | `/brainstorm` | `brainstorm.md` |

---

## Agent System

6 agents live in `.claude/agents/`. Each agent uses skill-based routing — the master agent reads a skill file from `.claude/agents/skills/{agent-name}/` and executes its steps.

- **implementer** — full-stack code generation
- **testcase-writer** — QA testcase generation with 5 operations (write, write-lite, write-lite-v2, update, update-lite); shared rules in `lite-shared.md` and `digest-system.md`
- **doc-writer** — documentation creation, updates, and review
- **import-design** — 4 modes: validate, single, multi, update; plus `shared.md`
- **agia** — audits and refactors agent files
- **brainstorm** — product strategy and ideation

---

## Project Structure

**Pages:**
- `HomePage`
- `DesignSystemPage`
- `FeatureKnowledgePage`
- `TestcaseManagerPage`
- `UserGuidePage`

**Client components** organized by feature:
- `design-system/`
- `feature-knowledge/`
- `testcase/`

**Server routes:**
- `ai`
- `design-system`
- `feature-knowledge`
- `testcase`
- `testcase-global`

**Server services:**
- `AIService`
- `DesignSystem*`
- `FeatureKnowledge*`
- `Testcase*`
- `PdfParsers`

**Source content** (file-based storage):
- `source/design-system/` — UI components

---

## Key Files

| File / Path | Purpose |
|-------------|---------|
| `CLAUDE.md` | Project instructions and rules |
| `.claude/workflows/development-rules.md` | Coding standards (YAGNI, KISS, DRY) |
| `.claude/agents/*.md` | Agent definitions |
| `.claude/agents/skills/` | Skill files per agent |
| `.claude/commands/*.md` | Slash command definitions |
| `source/` | Content storage — design system, specs, templates |
| `client/src/` | React frontend source |
| `server/src/` | Express backend source |
