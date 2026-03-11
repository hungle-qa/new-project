# App Module — Relationship Map (Generic Template)

> Every feature module follows the same vertical slice pattern. Use this template when creating or updating any module.

## Vertical Slice Pattern

```
source/{module}/                              # Markdown data files
  → server/src/services/{Name}Service.ts      # File-based service (reads source/)
  → server/src/routes/{module}.ts             # Express API routes
  → client/src/pages/{module}/                # Page component(s)
  → client/src/components/{module}/           # Module-specific UI components
```

## Related Files (per module)

| File pattern | Role | When to update |
|------|------|----------------|
| `source/{module}/**` | Data — markdown storage | When data format changes |
| `server/src/services/{Name}Service.ts` | Service — reads/writes source/{module}/ | When data format or file structure changes |
| `server/src/routes/{module}.ts` | Route — Express API endpoints | When API contracts change |
| `client/src/pages/{module}/*` | Page — main page component | When page layout or features change |
| `client/src/components/{module}/*` | Components — module-specific UI | When UI patterns change |

## Creating a New Module

1. Create `source/{module}/` directory for data files
2. Create `server/src/services/{Name}Service.ts` following service pattern
3. Create `server/src/routes/{module}.ts` following route pattern
4. Create `client/src/pages/{module}/` with page component
5. Create `client/src/components/{module}/` for module-specific components
6. Add file patterns to `.claude/CLAUDE.md` index pointing to this relationship file
7. Register route in Express app entry point
