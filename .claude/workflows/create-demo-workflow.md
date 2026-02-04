# Create Demo Workflow

**Purpose:** Build demo projects in `source/demo/{project-name}/`.

## CRITICAL RULES

**ONLY create/modify files in:** `source/demo/{project-name}/`

**NEVER modify:**
- `source/design-system/*.md` - Design system documentation (READ ONLY)
- `source/product-idea/*.md` - Product ideas (READ ONLY)
- `source/spec-template/*.md` - Spec templates (READ ONLY)
- `client/src/*` - Main app frontend
- `server/src/*` - Main app backend

**ONLY USE APPROVED COMPONENTS:**
- Only use design system components with `status: approved` in frontmatter
- Check the frontmatter of each `.md` file before using:
  ```yaml
  ---
  status: approved  # ✅ Can use
  ---
  ```
- Do NOT use components with `status: draft`, `status: pending`, or `status: rejected`
- If a required component is not approved, ask user for alternative or approval

**IF CONFUSED:** Ask the user to clarify before making any changes.

## Demo Name Recognition

When user types `@source/demo/{name}/` or `@{name}`, it refers to:
- Demo project at: `source/demo/{name}/`
- Example: `@client-portal` = `source/demo/client-portal/`

## Scope

This workflow handles:
- Creating demo project folder structure in `source/demo/{name}/`
- Building demo pages using design system components (HTML files)
- Generating spec documents inside demo folder (`source/demo/{name}/spec/`)

## Agent Chain

```
demo-folder-creator.md → scout.md → planner.md → designer.md → implementer.md → write-spec.md
```

| Step | Agent | Purpose | Output |
|------|-------|---------|--------|
| 1 | `demo-folder-creator` | Create folder structure | `source/demo/{name}/` |
| 2 | `scout` | Scout demo + design-system only | Available components |
| 3 | `planner` | Plan demo pages | Page structure plan |
| 4 | `designer` | Suggest UI composition | Component selection |
| 5 | `implementer` | Build HTML pages | `pages/*.html` |
| 6 | `write-spec` | Generate specification | `spec/{name}.md` |

## Orchestration

### Step 0: Get Demo Name

**If name provided:** Confirm project name
**If no name:** Ask user for demo project name

### Step 1: Demo Folder Creator

Call `.claude/agents/demo-folder-creator.md` with:
- **project_name**: Demo name (kebab-case)
- **product_idea**: (optional) Link to product idea

**Output**: Created folder structure at `source/demo/{project-name}/`

### Step 2: Scout (Demo Scope Only)

Call `.claude/agents/scout.md` with:
- **workflow**: "demo"
- **scope**: `source/demo/{project-name}/`, `source/design-system/`, `source/product-idea/`
- **skip**: `client/src/`, `server/` (main app - NOT in scope)
- **task**: Demo requirements

**Output**: Available design components, product idea requirements

### Step 3: Planner

Call `.claude/agents/planner.md` with:
- **scout_findings**: Output from scout
- **task**: Demo page planning
- **workflow**: "demo"

**Output**: Page plan with component mapping

### Step 4: Designer

Call `.claude/agents/designer.md` with:
- **plan**: Output from planner
- **workflow**: "demo"
- **design_system**: Available components from scout

**Output**: UI composition for each page

### Step 5: Implementer

Call `.claude/agents/implementer.md` with:
- **plan**: Output from planner
- **designer_suggestions**: Output from designer
- **workflow**: "demo"
- **output_path**: `source/demo/{project-name}/pages/`

**Output**: HTML files in `source/demo/{project-name}/pages/`

### Step 6: Write Spec

Call `.claude/agents/write-spec.md` with:
- **demo_path**: `source/demo/{project-name}/`
- **workflow**: "demo"

**Output**: `source/demo/{project-name}/spec/{spec-name}.md`

## File Structure

```
source/demo/{project-name}/
├── README.md           # Project overview, links to sources
├── components/         # Demo-specific component variations
│   └── {name}.html
├── pages/              # Demo page layouts (standalone HTML)
│   ├── home.html
│   ├── dashboard.html
│   └── settings.html
├── assets/             # Images, icons
│   └── {name}.{ext}
└── spec/               # Generated specifications
    └── {feature}.md
```

## Demo Page Template

```html
<!--
  Page: {Page Name}
  Demo: {project-name}
  Created: {YYYY-MM-DD}
-->
<!DOCTYPE html>
<html>
<head>
  <title>{Page Name} - {Project Name} Demo</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    /* Page-specific styles */
  </style>
</head>
<body class="bg-gray-50">
  <!-- Page layout using design system components -->
</body>
</html>
```

## Examples

### Example 1: New Demo from Scratch
```
/create-demo client-portal
```
Flow: create folder → scout design system → plan pages → design UI → build pages → write spec

### Example 2: Demo from Product Idea
```
/create-demo from @product-idea fitness-tracker
```
Flow: create folder (linked to idea) → scout idea + design system → plan based on requirements → design → build → spec

## Rules

1. **Ask name first**: Always confirm project name before creating
2. **DEMO FILES ONLY**: All files stay in `source/demo/{project-name}/`
3. **READ ONLY sources**: Design system, product ideas, spec templates are READ ONLY - never modify
4. **Ask if confused**: If task seems to require modifying files outside demo folder, ASK user to clarify
5. **Scout limitation**: Only scout demo folder and source materials
6. **Standalone pages**: Each HTML page works independently
7. **Use design system**: Copy/use components from `source/design-system/` (don't modify originals)
8. **Generate spec**: Always end with spec generation inside demo folder
9. **Approved only**: Only use design system components with `status: approved` - reject draft/pending/rejected

## What This Workflow Does NOT Do

- Does NOT update `source/design-system/*.md` files
- Does NOT update `source/product-idea/*.md` files
- Does NOT update `client/src/*` (main app)
- Does NOT update `server/src/*` (main app)
- Does NOT create documentation outside demo folder
