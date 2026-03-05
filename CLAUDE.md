# CLAUDE.md — Project Instructions

## Project

QA-kit is a testcase generation platform. Import UI components and specs, generate testcases from rules and templates. File-based storage (no database).

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + TypeScript |
| Backend | Express + TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Storage | File-based (no DB) |

## Workflows

| Workflow | Agent | Command |
|----------|-------|---------|
| Build App | `.claude/agents/implementer.md` | `/start` |
| Testcase (write, write-lite, update) | `.claude/agents/testcase-writer.md` | `/testcase` |
| Doc | `.claude/agents/doc-writer.md` | `/doc` |
| Import Design | `.claude/agents/import-design.md` | `/import-design-by-image` |
| Agent Audit | `.claude/agents/agia.md` | `/agent-audit` |

- Development rules: `.claude/workflows/development-rules.md`
- Slash commands: `.claude/commands/*.md`
- Lite skill shared rules: `.claude/agents/skills/testcase-writer/lite-shared.md`

## Rules

- Follow `.claude/workflows/development-rules.md` strictly for coding standards
- Keep docs in `./docs` folder updated
- Always use `localhost` for server URLs — never `127.0.0.1`
- Sacrifice grammar for concision in reports
- List unresolved questions at end of reports, if any

## Server URLs

- Client dev server: `http://localhost:3000`
- API / proxy target: `http://localhost:3001`
