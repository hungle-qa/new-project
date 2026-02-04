---
title: "Update Use Web App Tab Content"
status: pending
module: docs
target: client/src/pages/UserGuidePage.tsx
created: 2026-02-03
---

# Test Plan: Update Use Web App Tab Content

## Reference Files (from scout)

| File | Patterns to Reuse |
|------|-------------------|
| `client/src/pages/UserGuidePage.tsx` | `GuideSection` interface, `Section` component, tab rendering pattern |
| `README.md` | Page descriptions (Design System, Product Ideas, Demos) |

## Current State

- `use-webapp` tab uses same `GuideSection` structure as other tabs
- Content is generic, lacks specific feature guidance
- Structure: Overview, Workflow, Input, Process, Output, Examples, Note

## Challenge

New content structure differs from existing `GuideSection` interface:
- New: Overview, User Flow, Feature Details (per page)
- Current: Overview, Workflow, Input, Process, Output, Examples, Note

## Approach Options

| Option | Pros | Cons |
|--------|------|------|
| A: Extend `GuideSection` interface | Reuses existing rendering | Complex type, unused fields |
| B: Custom content for `use-webapp` | Clean, specific UI | Different rendering logic needed |
| C: Map new content to existing fields | No interface change | Content may feel forced |

**Recommended: Option C** - Map new content to existing fields for minimal changes.

## Content Mapping

| New Section | Maps To | Content |
|-------------|---------|---------|
| Overview | `overview` | App description, access URL, navigation |
| User Flow | `workflow` | Build Demo, Copy Component, Create Spec, Manage Ideas |
| Feature Details | `process` | Design System, Product Ideas, Spec Templates, Demos pages |
| Page Actions | `input` | Click actions for each page |
| Quick Reference | `examples` | Common tasks per page |
| Tips | `note` | Usage tips |

## Proposed Content

### Overview
"BA Demo Tool web app for managing design components, product ideas, spec templates, and demo projects. Access at http://localhost:3000. Navigate via header menu."

### Workflow (User Flows)
Steps: ["Build Demo", "Copy Component", "Create Spec", "Manage Ideas"]
Description: "Common user flows in the application"

### Input (How to Navigate)
- "Design System: Browse components, preview HTML/CSS, copy code"
- "Product Ideas: View ideas, check details, manage lifecycle"
- "Spec Templates: Select templates for spec generation"
- "Demo Projects: Preview demos, open pages in browser"

### Process (Feature Details)
- "Design System Page: Card grid, status filter, preview tabs (HTML/CSS/Preview), copy buttons"
- "Product Ideas Page: List view, detail panel, create/edit/delete actions"
- "Spec Templates Page: Template list, preview, select for demo generation"
- "Demo Projects Page: Project cards, page list, preview in iframe, open in new tab"

### Output (What You Get)
- "Visual preview of components without code"
- "Quick copy for HTML/CSS snippets"
- "Demo page previews in browser"
- "Spec documents from templates"

### Examples (Quick Tasks)
- "Copy a button: Design System > Click card > CSS tab > Copy"
- "Preview demo: Demos > Click project > Select page > Preview"
- "View idea: Product Ideas > Click idea > Read details"
- "Generate spec: Create Demo workflow > Uses spec templates"

### Note (Tips)
- "All data stored as markdown in source/ folder"
- "Changes sync automatically on save"
- "Use /start workflow for app changes, not this UI"

## Implementation Steps

| Step | Action | Target | Expected |
|------|--------|--------|----------|
| 1 | Update `overview` string | Line 90 | New overview text |
| 2 | Update `workflow.steps` | Line 92-93 | 4 user flow items |
| 3 | Update `input` array | Line 96-99 | Navigation instructions per page |
| 4 | Update `process` array | Line 100-105 | Feature details per page |
| 5 | Update `output` array | Line 106-110 | Output descriptions |
| 6 | Update `examples` array | Line 111-115 | Quick task examples |
| 7 | Update `note` array | Line 116-120 | Usage tips |

## Dependencies

- **Locators**: N/A (content update only)
- **Page Classes**: N/A
- **Fixtures**: N/A

## Next Agents

| Agent | Task |
|-------|------|
| implementer | Update `guideContent['use-webapp']` object in `/Users/hungle-qa/hungle-note/source/BA kit_v1/client/src/pages/UserGuidePage.tsx` (lines 89-121) |

## Code Change Preview

```typescript
'use-webapp': {
  overview: 'BA Demo Tool web app for managing design components, product ideas, spec templates, and demo projects. Access at http://localhost:3000. Navigate via header menu.',
  workflow: {
    steps: ['Build Demo', 'Copy Component', 'Create Spec', 'Manage Ideas'],
    description: 'Common user flows in the application'
  },
  input: [
    'Design System: Browse components, preview HTML/CSS, copy code',
    'Product Ideas: View ideas, check details, manage lifecycle',
    'Spec Templates: Select templates for spec generation',
    'Demo Projects: Preview demos, open pages in browser'
  ],
  process: [
    'Design System Page: Card grid with status filter, preview tabs (HTML/CSS/Preview), copy buttons',
    'Product Ideas Page: List view with detail panel, create/edit/delete actions',
    'Spec Templates Page: Template list with preview, select for demo spec generation',
    'Demo Projects Page: Project cards, page list, iframe preview, open in new tab'
  ],
  output: [
    'Visual preview of components without writing code',
    'Quick copy for HTML/CSS code snippets',
    'Demo page previews directly in browser',
    'Generated spec documents from templates'
  ],
  examples: [
    'Copy button CSS: Design System > Click card > CSS tab > Copy',
    'Preview demo page: Demos > Click project > Select page > Preview',
    'View product idea: Product Ideas > Click idea > Read details',
    'Create demo with spec: /create-demo > Uses spec templates automatically'
  ],
  note: [
    'All data stored as markdown files in source/ folder',
    'Changes sync automatically when files are saved',
    'To modify this app, use /start workflow (not this UI)'
  ]
}
```

## Unresolved Questions

None - content structure maps cleanly to existing interface.
