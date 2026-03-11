# Direct Commands — Relationship Map

> Commands that execute directly without an agent. Self-contained logic.

## Commands

### /ship — `commands/ship.md`

```
/ship [optional commit message]
  → Stage & commit all changes
  → Push current branch
  → Merge into main (--no-ff)
  → Switch back to original branch
```

**Safety rules:** No force-push to main. Stop on merge conflicts. Stop on push rejection.

### /rulecode — `commands/rulecode.md`

```
/rulecode [guidance]
  → Analyze conversation for coding mistake
  → Read index: .claude/rules/code-rules.md
  → Match to category by keywords
  → Read target category file from .claude/code-rules/
  → Append rule (Mistake/Fix/Example format)
  → Update index if new category
```

**Related files:** `.claude/rules/code-rules.md` (index), `.claude/code-rules/*.md` (categories)

### /ruleagent — `commands/ruleagent.md`

```
/ruleagent [guidance]
  → Analyze conversation for agent-authoring mistake
  → Read index: .claude/rules/agent-rules.md
  → Match to category by keywords
  → Read target category file from .claude/agent-rules/
  → Deprecation check (scan for overlap/contradiction)
  → Append rule (Mistake/Fix/Example/Applies-to format)
  → Update index if new category
```

**Related files:** `.claude/rules/agent-rules.md` (index), `.claude/agent-rules/*.md` (categories)
