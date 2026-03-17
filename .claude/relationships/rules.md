# Rules & Knowledge Base — Relationship Map

> Two parallel rule systems + shared development standards.

## Structure

```
.claude/
├── rules/                          # Auto-loaded indexes (in every conversation)
│   ├── code-rules.md               # Index → .claude/code-rules/*.md
│   └── agent-rules.md              # Index → .claude/agent-rules/*.md
├── code-rules/                     # Code mistake categories (8 files)
│   ├── csv-parsing.md
│   ├── react-state.md
│   ├── file-io.md
│   ├── typescript-types.md
│   ├── tailwind-styling.md
│   ├── ui-keyboard.md
│   ├── node-eval.md
│   └── file-size.md
├── agent-rules/                    # Agent mistake categories (5 files)
│   ├── separation-of-concerns.md
│   ├── workflow-execution.md
│   ├── file-conventions.md
│   ├── prompt-engineering.md
│   └── content-lifecycle.md
├── workflows/
│   └── development-rules.md        # Tech stack, code standards, patterns
└── CLAUDE.md                       # This relationship index
```

## Scope Separation

| System | Triggers when | Scope |
|--------|---------------|-------|
| **code-rules** | Writing React/Express app code | Keywords in task → match code-rules index |
| **agent-rules** | Editing `.claude/commands/`, `.claude/agents/`, `.claude/skills/` | File path + keywords → match agent-rules index |
| **development-rules** | Any coding task | Always available — tech stack & standards |

## Related Files

| File | Role | When to update |
|------|------|----------------|
| `.claude/rules/code-rules.md` | Index — keyword → category mapping | When new code-rule category added or keywords change |
| `.claude/rules/agent-rules.md` | Index — keyword → category mapping | When new agent-rule category added or keywords change |
| `.claude/code-rules/*.md` | Categories — individual code mistake rules | Via `/rulecode` command |
| `.claude/agent-rules/*.md` | Categories — individual agent mistake rules | Via `/ruleagent` command |
| `.claude/workflows/development-rules.md` | Shared standards — tech stack, patterns, commit format | When tech stack or standards change |
| `.claude/commands/rulecode.md` | Capture command for code rules | If rule format or capture flow changes |
| `.claude/commands/ruleagent.md` | Capture command for agent rules | If rule format or capture flow changes |
| `.claude/CLAUDE.md` | Relationship index | When any relationship changes |
