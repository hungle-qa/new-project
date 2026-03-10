# Relationship Index

> **When updating ANY file, read this index → find matching relationship file → read it → x2 check & update all related files listed there. If the relationship itself changed, update the relationship file too.**

---

## Index: File Path → Relationship File

| File pattern | Relationship file |
|---|---|
| `.claude/commands/testcase.md` | `relationships/testcase.md` |
| `.claude/agents/testcase-writer.md` | `relationships/testcase.md` |
| `.claude/agents/skills/testcase-writer/*` | `relationships/testcase.md` |
| `server/src/routes/testcase*.ts` | `relationships/testcase.md` |
| `server/src/services/Testcase*.ts` | `relationships/testcase.md` |
| `client/src/pages/testcase-manager/*` | `relationships/testcase.md` |
| `client/src/components/testcase/*` | `relationships/testcase.md` |
| `source/testcase/**` | `relationships/testcase.md` |
| `.claude/commands/import-design*.md` | `relationships/design-system.md` |
| `.claude/agents/import-design.md` | `relationships/design-system.md` |
| `.claude/agents/skills/import-design/*` | `relationships/design-system.md` |
| `server/src/routes/design-system.ts` | `relationships/design-system.md` |
| `server/src/services/DesignSystem*.ts` | `relationships/design-system.md` |
| `client/src/pages/design-system/*` | `relationships/design-system.md` |
| `client/src/components/design-system/*` | `relationships/design-system.md` |
| `source/design-system/**` | `relationships/design-system.md` |
| `server/src/routes/feature-knowledge.ts` | `relationships/knowledge.md` |
| `server/src/services/FeatureKnowledge*.ts` | `relationships/knowledge.md` |
| `client/src/pages/FeatureKnowledgePage.tsx` | `relationships/knowledge.md` |
| `client/src/components/feature-knowledge/*` | `relationships/knowledge.md` |
| `source/feature-knowledge/**` | `relationships/knowledge.md` |
| `.claude/agents/*.md` | `relationships/agents.md` |
| `.claude/commands/*.md` | `relationships/agents.md` |
| `.claude/agents/skills/implementer/*` | `relationships/agents.md` |
| `.claude/agents/skills/doc-writer/*` | `relationships/agents.md` |
| `.claude/agents/skills/agia/*` | `relationships/agents.md` |
| `.claude/agents/skills/brainstorm/*` | `relationships/agents.md` |
| `.claude/workflows/*` | `relationships/agents.md` |
| `.claude/rules/*` | `relationships/agents.md` |
| `.claude/code-rules/*` | `relationships/agents.md` |
| `CLAUDE.md` | `relationships/agents.md` |

## Update Rules

1. **Before editing:** Read this index → find matching relationship file → read it
2. **After editing:** x2 check all related files listed in the relationship file
3. **If relationship changed:** Update the relationship file
4. **If new file/flow added:** Add entry to this index + create/update relationship file
