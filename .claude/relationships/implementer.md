# Implementer — Relationship Map

## Flow

```
/start (user input)
  → .claude/commands/start.md            (dispatch — reads agent, passes $ARGUMENTS)
  → .claude/agents/implementer.md        (classifies EASY/MEDIUM/HARD, routes to skill)
  → .claude/skills/implementer/          (executes level-specific workflow)
      ├── easy.md                        (1 file — read → edit → report)
      ├── medium.md                      (2-3 files — plan → wireframe → approve → code → verify)
      └── hard.md                        (4+ files — deep scan → full plan → wireframe → approve → code → verify)
```

## Related Files

| File | Role | When to update |
|------|------|----------------|
| `.claude/commands/start.md` | Entry point — dispatch to agent | If agent file moves or args format changes |
| `.claude/agents/implementer.md` | Orchestrator — classification, tech context, patterns, architecture | If classification signals change, new modules added, or patterns updated |
| `.claude/skills/implementer/easy.md` | Skill — EASY tasks (1 file) | If easy workflow steps change |
| `.claude/skills/implementer/medium.md` | Skill — MEDIUM tasks (2-3 files) | If medium workflow steps change |
| `.claude/skills/implementer/hard.md` | Skill — HARD tasks (4+ files) | If hard workflow steps change |
| `.claude/workflows/development-rules.md` | Shared — tech stack, code standards, patterns | If tech stack or coding patterns change (agent references these) |

## Key Contracts

- Command dispatches only — no classification or workflow logic
- Agent classifies BEFORE reading skill file
- MEDIUM/HARD require user approval via AskUserQuestion before coding
- Agent contains tech context (stack, architecture, patterns) — skills reference it
- Development-rules.md defines shared standards that agent enforces
- Model: `sonnet`

## Module Architecture

Follows the generic vertical slice pattern. See `relationships/app-module.md` for the full template.

When a new module is added, update the agent's module table and add file patterns to `.claude/CLAUDE.md` index.
