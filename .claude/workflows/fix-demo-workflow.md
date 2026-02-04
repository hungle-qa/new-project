# Fix Demo Workflow

**Purpose:** Fix bugs or improve existing demo projects in `source/demo/{project-name}/`.

## CRITICAL RULES

**ONLY modify files in:** `source/demo/{project-name}/`

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
- Example: `@hello-world-page` = `source/demo/hello-world-page/`

## Scope

This workflow handles:
- Fixing bugs in demo pages (`source/demo/{name}/pages/*.html`)
- Improving UI/layout of demo components (`source/demo/{name}/components/*.html`)
- Updating content in demo HTML files
- Resolving styling issues in demo pages

## Agent Chain

```
scout.md → planner.md → designer.md → implementer.md
```

| Step | Agent | Purpose | Output |
|------|-------|---------|--------|
| 1 | `scout` | Scout demo project only | Demo files, current state |
| 2 | `planner` | Plan the fix | Fix steps |
| 3 | `designer` | Suggest UI changes (if needed) | UI recommendations |
| 4 | `implementer` | Apply the fix | Updated HTML/CSS files |

## Orchestration

### Step 0: Get Demo Name and Issue

**If name provided:** Confirm project name
**If no name:** List available demos from `source/demo/*/`, ask user to choose

**If issue provided:** Confirm issue description
**If no issue:** Ask user what to fix or improve

### Step 1: Scout (Demo Scope Only)

Call `.claude/agents/scout.md` with:
- **workflow**: "fix-demo"
- **scope**: `source/demo/{project-name}/`, `source/design-system/`
- **skip**: `client/src/`, `server/`, other demo projects
- **task**: Issue description

**Output**: Current demo files, relevant code sections

### Step 2: Planner

Call `.claude/agents/planner.md` with:
- **scout_findings**: Output from scout
- **task**: Issue description
- **workflow**: "fix-demo"

**Output**: Fix plan with file changes

### Step 3: Designer (if UI fix)

**Skip if**: Issue is not UI-related (content only, logic fix)

Call `.claude/agents/designer.md` with:
- **plan**: Output from planner
- **workflow**: "fix-demo"

**Output**: UI change recommendations

### Step 4: Implementer

Call `.claude/agents/implementer.md` with:
- **plan**: Output from planner
- **designer_suggestions**: Output from designer (if any)
- **workflow**: "fix-demo"
- **output_path**: `source/demo/{project-name}/`

**Output**: Updated HTML/CSS files

## File Structure

```
source/demo/{project-name}/
├── README.md           # Project overview
├── components/         # Demo-specific components
│   └── {name}.html
├── pages/              # Demo page layouts
│   ├── home.html
│   ├── dashboard.html
│   └── settings.html
├── assets/             # Images, icons
│   └── {name}.{ext}
└── spec/               # Generated specifications
    └── {feature}.md
```

## Common Fix Types

| Issue | What to Check | Typical Fix |
|-------|---------------|-------------|
| Layout broken | Flexbox/grid CSS | Fix Tailwind classes |
| Element misaligned | Padding/margin | Adjust spacing classes |
| Styling wrong | Color/font classes | Update Tailwind utilities |
| Content missing | HTML structure | Add missing elements |
| Component broken | HTML validity | Fix markup errors |
| Responsive issue | Breakpoint classes | Add responsive prefixes |

## Examples

### Example 1: Fix Button Alignment
```
/fix-demo client-portal: login button not centered
```
Flow: scout pages → find button → plan fix → implement CSS fix

### Example 2: Improve Spacing
```
/fix-demo hello-world-page: add more spacing between sections
```
Flow: scout pages → identify sections → plan spacing → add Tailwind classes

### Example 3: Fix Broken Layout
```
/fix-demo dashboard: sidebar overlapping content
```
Flow: scout layout → analyze CSS → plan fix → fix flexbox/grid

### Example 4: Update Content
```
/fix-demo client-portal: change header text to "Welcome Back"
```
Flow: scout pages → find header → implement text change (skip designer)

## Rules

1. **Confirm demo**: Always verify which demo to fix
2. **Understand issue**: Get clear issue description before starting
3. **DEMO FILES ONLY**: Only modify files in `source/demo/{project-name}/`
4. **READ ONLY sources**: Design system, product ideas, spec templates are READ ONLY - never modify
5. **Ask if confused**: If task mentions files outside demo folder, ASK user to clarify
6. **Scout first**: Always scout existing files before changing
7. **Preserve structure**: Don't reorganize unless necessary
8. **Skip designer**: If not UI-related, go directly to implementer
9. **One fix at a time**: Handle multiple issues sequentially
10. **Approved only**: Only use design system components with `status: approved` - reject draft/pending/rejected

## What This Workflow Does NOT Do

- Does NOT update `source/design-system/*.md` files
- Does NOT update `source/product-idea/*.md` files
- Does NOT update `client/src/*` (main app)
- Does NOT update `server/src/*` (main app)
- Does NOT create documentation
