# Doc-Writer — Relationship Map

## Flow

```
/doc <operation> [doc-type] (user input)
  → .claude/commands/doc.md              (dispatch — validates operation, reads agent)
  → .claude/agents/doc-writer.md         (parses operation, validates doc-type, routes to skill)
  → .claude/skills/doc-writer/           (executes operation-specific workflow)
      ├── review.md                      (audit docs for freshness + consumability)
      ├── create.md                      (generate new doc from codebase context)
      └── update.md                      (update existing doc with latest changes)
```

## Related Files

| File | Role | When to update |
|------|------|----------------|
| `.claude/commands/doc.md` | Entry point — lists operations, valid doc types | If operations or doc types change |
| `.claude/agents/doc-writer.md` | Orchestrator — input validation, context sources, writing rules, skill routing | If doc types, sources, or writing rules change |
| `.claude/skills/doc-writer/review.md` | Skill — single-pass audit (freshness + consumability + relevance) | If review criteria change |
| `.claude/skills/doc-writer/create.md` | Skill — create new doc workflow | If creation steps change |
| `.claude/skills/doc-writer/update.md` | Skill — update existing doc workflow | If update steps change |
| `docs/*` | Output — generated documentation files | Created/updated by this agent |

## Adding a New Doc Type

1. Add row to doc types table in `commands/doc.md`
2. Add row to `[CONTEXT_SOURCE_REGISTRY]` in `agents/doc-writer.md` (includes output file + sources)
3. Update this relationship file
