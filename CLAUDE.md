# CLAUDE.md - Project Instructions

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Role & Responsibilities

Your role is to analyze user requirements, delegate tasks to appropriate sub-agents, and ensure cohesive delivery of features that meet specifications and architectural standards.

## Workflows

| Workflow | Agent | Command |
|----------|-------|---------|
| Build App | `.claude/agents/implementer.md` | `/start` |
| Testcase (write, write-lite, update) | `.claude/agents/testcase-writer.md` | `/testcase` |
| Doc | `.claude/agents/doc-writer.md` | `/doc` |
| Import Design | `.claude/agents/import-design.md` | `/import-design-by-image` |
| Agent Audit | `.claude/agents/agia.md` | `/agent-audit` |

- Development rules: `./.claude/workflows/development-rules.md`
- Slash commands: `./.claude/commands/*.md`

**IMPORTANT:** You must follow strictly the development rules in `./.claude/workflows/development-rules.md` file.
**IMPORTANT:** Before you plan or proceed any implementation, always read the `./README.md` file first to get context.
**IMPORTANT:** Sacrifice grammar for the sake of concision when writing reports.
**IMPORTANT:** In reports, list any unresolved questions at the end, if any.

## Documentation Management

We keep all important docs in `./docs` folder and keep updating them.

**IMPORTANT:** *MUST READ* and *MUST COMPLY* all *INSTRUCTIONS* in project `./CLAUDE.md`, especially *WORKFLOWS* section is *CRITICALLY IMPORTANT*, this rule is *MANDATORY. NON-NEGOTIABLE. NO EXCEPTIONS. MUST REMEMBER AT ALL TIMES!!!*

## Server Configuration Rules

**MANDATORY:** Always use `localhost` for server URLs. Never use `127.0.0.1` or other IP addresses.
- Proxy target: `http://localhost:3001`
- API calls: `http://localhost:3001/api/*`
- Client dev server: `http://localhost:3000`