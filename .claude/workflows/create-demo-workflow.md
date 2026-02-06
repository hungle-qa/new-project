# Create Demo Workflow

**Purpose:** Build demo projects in `source/demo/{project-name}/`.

**Guardrails and scope rules are defined in the command file** (`.claude/commands/create-demo.md`).

---

## Agent Data Flow

### SIMPLE Tier
```
[User Request] → demo-folder-creator → implementer → Done
```

### MEDIUM Tier
```
[User Request] → demo-folder-creator → quick-scout → implementer → Done
```

### COMPLEX Tier
```
[User Request]
      ↓
  demo-folder-creator
      ↓
    scout ──→ planner ──→ designer ──→ implementer → Done
```

---

## Tier Agent Chains

| Tier | Agent Chain | When |
|------|-------------|------|
| SIMPLE | `demo-folder-creator` → `implementer` | Single page, clear component |
| MEDIUM | `demo-folder-creator` → `quick-scout` → `implementer` | 2-3 pages, known components |
| COMPLEX | `demo-folder-creator` → `scout` → `planner` → `designer` → `implementer` | Multi-page, product-idea, custom components |

**Tier detection rules are in the command file.**

---

## Orchestration

### Step 0: Get Demo Name

**If name provided:** Confirm project name
**If no name:** Ask user for demo project name
**If `$ARGUMENTS` is empty:** Ask user for demo name before proceeding

### Step 1: Demo Folder Creator (All Tiers)

Call `.claude/agents/demo-folder-creator.md` with:
- **project_name**: Demo name (kebab-case)
- **product_idea**: (optional) Link to product idea

**Output**: Created folder structure at `source/demo/{project-name}/`

### Step 2a: Quick Scout (MEDIUM Tier Only)

Call `.claude/agents/quick-scout.md` with:
- **scope**: `source/demo/{project-name}/`, `source/design-system/`
- **task**: Demo requirements

**Output**: Found files + inline plan → hand off to implementer

### Step 2b: Scout (COMPLEX Tier Only)

Call `.claude/agents/scout.md` with:
- **workflow**: "demo"
- **scope**: `source/demo/{project-name}/`, `source/design-system/`, `source/product-idea/`
- **skip**: `client/src/`, `server/` (main app - NOT in scope)
- **task**: Demo requirements

**Output**: Available design components, product idea requirements

### Step 3: Planner (COMPLEX Only)

Call `.claude/agents/planner.md` with:
- **scout_findings**: Output from scout
- **task**: Demo page planning
- **workflow**: "demo"

**Output**: Page plan with component mapping

### Step 4: Designer (COMPLEX Only)

Call `.claude/agents/designer.md` with:
- **plan**: Output from planner
- **workflow**: "demo"
- **design_system**: Available components from scout

**Output**: UI composition for each page

### Step 5: Implementer (All Tiers)

Call `.claude/agents/implementer.md` with:
- **plan**: Output from planner/quick-scout (or direct from command for SIMPLE)
- **designer_suggestions**: Output from designer (COMPLEX only)
- **workflow**: "demo"
- **output_path**: `source/demo/{project-name}/pages/`

**Output**: HTML files in `source/demo/{project-name}/pages/`

---

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
└── assets/             # Images, icons
    └── {name}.{ext}
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

## Rules

1. **Ask name first**: Always confirm project name before creating
2. **DEMO FILES ONLY**: All files stay in `source/demo/{project-name}/`
3. **READ ONLY sources**: Design system, product ideas, spec templates are READ ONLY
4. **Ask if confused**: If task requires modifying files outside demo folder, ASK user
5. **Scout limitation**: Only scout demo folder and source materials
6. **Standalone pages**: Each HTML page works independently
7. **Use design system**: Copy/use components from `source/design-system/` (don't modify originals)
8. **Approved only**: Only use design system components with `status: approved`
