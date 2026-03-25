# Agent Rules — Mistake-Driven Knowledge Base

**MANDATORY**: Before creating or editing any file in `.claude/commands/`, `.claude/agents/`, or `.claude/skills/`, scan the task description for keywords matching the index below. Read ALL matching files from `.claude/agent-rules/` before proceeding. This prevents repeating known agent-authoring mistakes.

**SCOPE**: This rule applies ONLY to agent infrastructure files (commands, agents, skills), NOT to web app code (React/Express). For web app code, see `.claude/rules/code-rules.md` instead.

## Index

| File | Keywords | Description |
|---|---|---|
| separation-of-concerns.md | command, agent, skill, delegate, duplicate, routing, dispatch, role, tone | Single responsibility: command dispatches, agent orchestrates, skill executes |
| workflow-execution.md | step, WAIT, AskUserQuestion, multi-step, sequential, STOP, proceed, workflow | Step sequencing, STOP conditions, user interaction gates |
| file-conventions.md | file, path, location, naming, directory, structure, metadata, tools, frontmatter | Directory layout, naming, metadata requirements |
| prompt-engineering.md | instruction, prompt, ambiguous, enforce, mandatory, constraint, rule, clarity, intent, disambiguate, start, build, run | Writing clear, unambiguous instructions that Claude reliably follows; disambiguate skill triggers from literal commands |
| content-lifecycle.md | create, update, delete, duplicate, stale, outdated, version, deprecate | Rule hygiene: avoid duplicates, deprecate stale content, review periodically |

## How to use

1. Confirm the file being edited is in `.claude/commands/`, `.claude/agents/`, or `.claude/skills/`
2. Parse task for keywords
3. Match against the **Keywords** column above
4. Read matched files from `.claude/agent-rules/{file}`
5. Apply all rules found before writing any agent infrastructure
6. If no keywords match, proceed normally
