# Agent System Relationships

## All Command → Agent → Skill Chains

```
/start ─────────────────→ implementer.md ──→ easy.md
                                            medium.md
                                            hard.md

/testcase ──────────────→ testcase-writer.md   (detail: relationships/testcase.md)

/doc ───────────────────→ doc-writer.md ──→ review.md
                                           create.md
                                           update.md

/import-design-by-image → import-design.md     (detail: relationships/design-system.md)

/agent-audit ───────────→ agia.md ──→ audit.md
                                      update.md
                                      test.md
                                      optimize.md
                                      create-skill.md
                                      system-audit.md

/brainstorm ────────────→ brainstorm.md ──→ app-build.md
                                           ai-workflow.md

/rulecode ─────────────→ (standalone command, no agent)
                          reads: .claude/rules/code-rules.md
                          writes: .claude/code-rules/{category}.md
```

### Path Convention

| Type | Path |
|------|------|
| Commands | `.claude/commands/{name}.md` |
| Agents | `.claude/agents/{name}.md` |
| Skills | `.claude/agents/skills/{agent}/{skill}.md` |
| Workflows | `.claude/workflows/{name}.md` |

---

## Shared Resources

| File | Used By | Purpose |
|------|---------|---------|
| `workflows/development-rules.md` | implementer (all skills) | Coding standards, tech stack |
| `workflows/import-design-by-image-rules.md` | import-design skills | Design import rules |
| `skills/testcase-writer/lite-shared.md` | write-lite, write-lite-v2, update-lite | JSON schema, CSV rules |
| `skills/testcase-writer/digest-system.md` | write, update | Digest format, API |
| `skills/import-design/shared.md` | validate, single, multi, update | RULE.md compliance |

---

## CLAUDE.md Workflow Table

`CLAUDE.md` lists all workflows. Must stay in sync:

| Workflow | Agent | Command |
|----------|-------|---------|
| Build App | `implementer.md` | `/start` |
| Testcase | `testcase-writer.md` | `/testcase` |
| Doc | `doc-writer.md` | `/doc` |
| Import Design | `import-design.md` | `/import-design-by-image` |
| Agent Audit | `agia.md` | `/agent-audit` |
| Brainstorm | `brainstorm.md` | `/brainstorm` |

---

## AGIA Chain Registry

`agia.md` has a Chain Registry that must match actual chains:

| Workflow | Chain |
|----------|-------|
| Build App (full) | scout → planner → implementer |
| Build App (medium) | scout → implementer |
| Build App (simple) | implementer |
| Testcase | testcase-writer (skill-based) |
| Import Design | import-design (skill-based) |
| Doc | doc-writer (skill-based) |
| AGIA | agia (skill-based) |

---

## Cross-check Table

| If you update... | x2 check these files |
|---|---|
| Any agent `.md` | Its command `.md` + all its skill files |
| Any command `.md` | Its agent `.md` |
| Any skill `.md` | Its parent agent `.md` + shared files it reads |
| Any shared skill file | ALL skills that read it |
| `implementer.md` | `commands/start.md`, `easy/medium/hard.md`, `development-rules.md` |
| `doc-writer.md` | `commands/doc.md`, `review/create/update.md` |
| `agia.md` | `commands/agent-audit.md`, all 6 agia skills, Chain Registry |
| `brainstorm.md` | `commands/brainstorm.md`, `app-build.md`, `ai-workflow.md` |
| `CLAUDE.md` | Workflow table matches actual agents/commands |
| `development-rules.md` | All implementer skills |
| `commands/rulecode.md` | `.claude/rules/code-rules.md`, `.claude/code-rules/*` |
| `.claude/rules/code-rules.md` | `commands/rulecode.md`, `.claude/code-rules/*` |
| Add/remove agent | `CLAUDE.md` workflow table, `agia.md` Chain Registry, this file |
