# Design System Flow Relationships

## Command → Agent → Skill

```
/import-design-by-image → import-design.md → validate.md ──→ shared.md
                                              single.md ───→ shared.md
                                              multi.md ────→ shared.md
                                              update.md ───→ shared.md
```

### File Paths

| Role | Path |
|------|------|
| Command | `.claude/commands/import-design-by-image.md` |
| Agent | `.claude/agents/import-design.md` |
| Skills | `.claude/agents/skills/import-design/{validate,single,multi,update}.md` |
| Shared | `.claude/agents/skills/import-design/shared.md` |
| Workflow rules | `.claude/workflows/import-design-by-image-rules.md` |

---

## Server Pipeline

```
Route                      Service                           Storage
──────────────────────────────────────────────────────────────────────
design-system.ts ────────→ DesignSystemComponentService ──→ source/design-system/*.md
                           DesignSystemIconService ───────→ source/design-system/icons/*
                           DesignSystemRulesService ──────→ source/design-system/rule/RULE.md
                           DesignSystemTypes.ts
```

---

## Client Components

```
DesignSystemPage.tsx
├── DesignSystemHeader.tsx
├── ComponentsView.tsx
│   ├── ComponentSelectorBar.tsx
│   └── ComponentDetailPanel.tsx
└── DeleteComponentModal.tsx
```

---

## Cross-check Table

| If you update... | x2 check these files |
|---|---|
| `import-design.md` | `commands/import-design-by-image.md`, all 4 skill files, `shared.md` |
| Any skill (validate/single/multi/update) | `import-design.md`, `shared.md` |
| `shared.md` | All 4 skill files |
| `import-design-by-image-rules.md` | `import-design.md`, `shared.md` |
| `design-system.ts` (route) | All 3 service files |
| `DesignSystemComponentService.ts` | `design-system.ts`, `ComponentDetailPanel.tsx` |
| `RULE.md` | `shared.md` (skills reference RULE.md for compliance) |
