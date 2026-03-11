# Relationship Index

> **When updating ANY file, read this index → find matching relationship file → read it → x2 check & update all related files listed there. If the relationship itself changed, update the relationship file too.**

---

## Index: File Path → Relationship File

| File pattern | Relationship file |
|---|---|
| `.claude/agents/brainstorm.md` | `relationships/brainstorm.md` |
| `.claude/commands/brainstorm.md` | `relationships/brainstorm.md` |
| `.claude/skills/brainstorm/*` | `relationships/brainstorm.md` |
| `.claude/agents/implementer.md` | `relationships/implementer.md` |
| `.claude/commands/start.md` | `relationships/implementer.md` |
| `.claude/skills/implementer/*` | `relationships/implementer.md` |
| `.claude/agents/doc-writer.md` | `relationships/doc-writer.md` |
| `.claude/commands/doc.md` | `relationships/doc-writer.md` |
| `.claude/skills/doc-writer/*` | `relationships/doc-writer.md` |
| `.claude/commands/ship.md` | `relationships/direct-commands.md` |
| `.claude/commands/rulecode.md` | `relationships/direct-commands.md` |
| `.claude/commands/ruleagent.md` | `relationships/direct-commands.md` |
| `.claude/rules/*` | `relationships/rules.md` |
| `.claude/code-rules/*` | `relationships/rules.md` |
| `.claude/agent-rules/*` | `relationships/rules.md` |
| `.claude/workflows/*` | `relationships/rules.md` |
| `.claude/CLAUDE.md` | `relationships/rules.md` |
| `source/{module}/**` | `relationships/app-module.md` |
| `server/src/services/*Service.ts` | `relationships/app-module.md` |
| `server/src/routes/*.ts` | `relationships/app-module.md` |
| `client/src/pages/*/` | `relationships/app-module.md` |
| `client/src/components/{module}/*` | `relationships/app-module.md` |

## Update Rules

1. **Before editing:** Read this index → find matching relationship file → read it
2. **After editing:** x2 check all related files listed in the relationship file
3. **If relationship changed:** Update the relationship file
4. **If new file/flow added:** Add entry to this index + create/update relationship file
