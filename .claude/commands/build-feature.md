---
description: Build features for the BA Demo Tool using file-based storage
argument-hint: [feature description]
---

**Ultrathink** to plan & execute these feature implementation tasks following the Primary Workflow and Development Rules:
<tasks>$ARGUMENTS</tasks>

**IMPORTANT:** Analyze the agents at `.claude/agents/*` and intelligently activate the agents needed for the task.
**IMPORTANT:** No database - use file-based storage (markdown files).

## Two Workflows

| Workflow | Use For | Command |
|----------|---------|---------|
| **Primary** | Code main app (client/, server/) | `/start` |
| **Create Demo** | Build demo projects (source/demo/) | `/create-demo` |

## Primary Workflow (Main App)

```
scout.md → planner.md → designer.md → implementer.md
```

| Agent | Task |
|-------|------|
| `scout` | Search client/src/, server/ |
| `planner` | Create implementation plan |
| `designer` | Suggest UI components |
| `implementer` | Write TypeScript code |

## Create Demo Workflow

```
demo-folder-creator.md → scout.md → planner.md → designer.md → implementer.md → write-spec.md
```

| Agent | Task |
|-------|------|
| `demo-folder-creator` | Create folder structure |
| `scout` | Scout demo + design-system only |
| `planner` | Plan demo pages |
| `designer` | Suggest UI composition |
| `implementer` | Build HTML pages |
| `write-spec` | Generate specification |

## Fix Demo Workflow

```
scout.md → planner.md → designer.md → implementer.md
```

| Agent | Task |
|-------|------|
| `scout` | Scout demo project files |
| `planner` | Plan the fix |
| `designer` | Suggest UI changes (if needed) |
| `implementer` | Apply the fix |

## Import Agents (Independent)

| Agent | Task | Output |
|-------|------|--------|
| `import-design` | Import HTML/CSS | `source/design-system/*.md` |
| `import-design-by-image` | Convert image to component | `source/design-system/*.md` |
| `import-idea` | Import product idea | `source/product-idea/*.md` |
| `import-spec-template` | Import spec template | `source/spec-template/*.md` |

## File-Based Storage

All data stored as markdown files in `source/`:

| Data | Location |
|------|----------|
| Design components | `source/design-system/*.md` |
| Product ideas | `source/product-idea/*.md` |
| Spec templates | `source/spec-template/*.md` |
| Demo projects | `source/demo/{name}/` |

## Skip Conditions

| Condition | Action |
|-----------|--------|
| Know the codebase | Skip scout |
| Have clear plan | Skip planner |
| No UI changes | Skip designer |
| Only need plan | Skip implementer |

## References

- Primary Workflow: `.claude/workflows/primary-workflow.md`
- Create Demo Workflow: `.claude/workflows/create-demo-workflow.md`
- Fix Demo Workflow: `.claude/workflows/fix-demo-workflow.md`
- Development Rules: `.claude/workflows/development-rules.md`
- Agents: `.claude/agents/*`
