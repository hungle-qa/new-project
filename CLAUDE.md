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

## Efficiency Report

**MANDATORY:** At the end of every task or major response, append an Efficiency Report:

```
---
Efficiency Report
- Est. tokens this turn: {N}
- Suggestion: {e.g. "Reset chat recommended" | "Context healthy" | "Consider /clear before next task"}
```

Rules:
- Estimate tokens from response length + files read/written this turn (~4 chars/token)
- Suggestion is actionable: recommend reset when context is high or task is complete

### Token Cost Reference

| Action | Est. Tokens | Notes |
|--------|-------------|-------|
| Read small file (<100 lines) | ~500 | e.g. config, types |
| Read medium file (100–300 lines) | ~1,500 | e.g. component, service |
| Read large file (300–600 lines) | ~3,000 | e.g. page, agent |
| Read very large file (600+ lines) | ~5,000+ | avoid if possible |
| Write/Edit small change | ~200 | 1–10 lines changed |
| Write/Edit medium change | ~800 | 10–50 lines changed |
| Write/Edit large change | ~2,000 | 50+ lines changed |
| Bash command + output | ~300–1,000 | depends on stdout size |
| Grep/Glob search | ~200 | file list only |
| Grep content mode | ~500–2,000 | depends on matches |
| Agent spawn (sub-agent) | ~3,000–10,000 | full sub-context overhead |
| User message (short) | ~100 | <50 words |
| User message (long/pasted) | ~1,000+ | code dumps, long specs |
| LLM response (this turn) | ~500–3,000 | depends on output length |

## Server Configuration Rules

**MANDATORY:** Always use `localhost` for server URLs. Never use `127.0.0.1` or other IP addresses.
- Proxy target: `http://localhost:3001`
- API calls: `http://localhost:3001/api/*`
- Client dev server: `http://localhost:3000`