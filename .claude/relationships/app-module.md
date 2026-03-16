# App Module — Relationship Map

> Before creating or updating any module, read the target project's actual structure first. Do NOT assume a generic layout — derive the pattern from what exists.

## How to Discover the Project Structure

1. Read the project's `README.md` or `CLAUDE.md` for architecture notes
2. Glob the top-level directories to understand the layout
3. Find existing modules (services, routes, pages, components) and follow their pattern exactly
4. If no modules exist yet, ask the user how the project is structured before creating anything

## Related Files (per module)

Identify the equivalent of each role below in the specific project, then keep them in sync:

| Role | When to update |
|------|----------------|
| Data / storage files | When data format or schema changes |
| Service layer | When data format or file structure changes |
| API route / controller | When API contracts change |
| Page component | When page layout or features change |
| UI components | When UI patterns or props change |

## Creating a New Module

1. Glob the project to find 1–2 existing modules as reference
2. Mirror the same file naming, folder depth, and import conventions
3. Register the new route/service in the app entry point (find where others are registered)
4. Add file patterns to `.claude/CLAUDE.md` index pointing to this relationship file

## Update Rules

- Changing data format → update service + any type definitions
- Changing API shape → update route + client-side fetch calls
- Changing a component's props → update every usage site
