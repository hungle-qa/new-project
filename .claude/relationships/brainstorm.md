# Brainstorm — Relationship Map

## Flow

```
/brainstorm (user input)
  → .claude/commands/brainstorm.md       (dispatch only — reads agent, passes $ARGUMENTS)
  → .claude/agents/brainstorm.md         (classifies domain, routes to skill, enforces 4-step workflow)
  → .claude/skills/brainstorm/           (executes domain-specific workflow)
      ├── app-build.md                   (UI/UX, backend/frontend, database, web/mobile)
      └── ai-workflow.md                 (prompt chaining, RAG, agentic, LLM, AI pipeline)
```

## Related Files

| File | Role | When to update |
|------|------|----------------|
| `.claude/commands/brainstorm.md` | Entry point — dispatch to agent | If agent file moves or args format changes |
| `.claude/agents/brainstorm.md` | Orchestrator — role, tone, classification, step sequencing | If domains change, steps change, or new skills added |
| `.claude/skills/brainstorm/app-build.md` | Skill — app-build domain workflow | If step content changes for app-build domain |
| `.claude/skills/brainstorm/ai-workflow.md` | Skill — ai-workflow domain workflow | If step content changes for ai-workflow domain |

## Key Contracts

- Command MUST only dispatch (read agent + pass args) — no workflow logic
- Agent classifies domain BEFORE reading any skill file
- Agent defines the 4-step table with STOP conditions
- Skills define step content but follow the agent's step structure
- Step 2 MUST use AskUserQuestion + STOP (wait for user response)
- Step 3 MUST list blind spots as numbered checklist + use AskUserQuestion + STOP (wait for user to pick which to address/skip)
- `hybrid` domain reads BOTH skill files

## Adding a New Domain

1. Create `.claude/skills/brainstorm/{domain}.md`
2. Add domain row to classification table in `agents/brainstorm.md`
3. Update this relationship file
4. Update `.claude/CLAUDE.md` index if new file pattern
