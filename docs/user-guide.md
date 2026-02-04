# BA Demo Tool - User Guide

Complete reference for all available commands and workflows.

---

## Quick Reference

| Command | Purpose |
|---------|---------|
| `/start` | Build main app features (client/, server/) |
| `/create-demo` | Create demo projects (source/demo/) |
| `/fix-demo` | Fix existing demo bugs |
| `/import-design` | Import HTML/CSS components |
| `/import-design-by-image` | Convert UI images to components |
| `/import-idea` | Import product ideas from PDF/Confluence |
| `/import-spec-template` | Import spec templates |
| `/build-feature` | General feature building |

---

## Workflows

### Primary Workflow (`/start`)

**Purpose:** Code the main BA Demo Tool application (React + Express)

**Usage:**
```
/start {feature description}
```

**Scope:**
- TypeScript code in `client/src/` or `server/src/`
- Bug fixes, features, enhancements
- NOT for: docs, markdown, demos

---

#### Tier Detection (Optimized)

Task complexity is auto-detected to minimize agent overhead:

| Tier | Agent Chain | Approval |
|------|-------------|----------|
| **SIMPLE** | implementer | No |
| **MEDIUM** | quick-scout → implementer | No |
| **COMPLEX** | scout → planner → designer → implementer | Yes |

**SIMPLE** - Single file, known location:
```
/start Fix typo in Button.tsx
/start Rename variable in DesignSystemPage.tsx
```
→ Direct to implementer (75% fewer agents)

**MEDIUM** - Clear scope, 2-3 files:
```
/start Add search to design system page
/start Add filter dropdown to component list
```
→ Quick scout + inline plan, no file created (50% fewer agents)

**COMPLEX** - Multi-file, unclear scope, architectural:
```
/start Rebuild entire navigation system
/start Add new authentication module
```
→ Full workflow with plan file + approvals

---

#### Tier Detection Rules

| Tier | Indicators |
|------|------------|
| SIMPLE | Exact file path given, "fix", "typo", "rename", single file |
| MEDIUM | "add X to Y page", clear feature, no architecture decisions |
| COMPLEX | "rebuild", "refactor", "implement new", multiple services, user asks for plan |

---

### Create Demo (`/create-demo`)

**Purpose:** Build demo projects with HTML pages in `source/demo/`

**Agent Chain:**
```
demo-folder-creator → scout → planner → designer → implementer → write-spec
```

**Usage:**
```
/create-demo
/create-demo {project-name}
/create-demo from @product-idea {idea-name}
```

**Examples:**
```
/create-demo client-portal
/create-demo from @product-idea fitness-tracker
```

**Creates:**
```
source/demo/{project-name}/
├── README.md
├── components/
├── pages/
├── assets/
└── spec/
```

---

### Fix Demo (`/fix-demo`)

**Purpose:** Fix bugs or improve existing demo projects

**Agent Chain:**
```
scout → planner → designer (if UI) → implementer
```

**Usage:**
```
/fix-demo {project-name}
/fix-demo {project-name}: {issue description}
```

**Examples:**
```
/fix-demo client-portal
/fix-demo hello-world-page: button not aligned
/fix-demo dashboard: card component not rendering
```

**Common Fix Types:**
| Issue | What Gets Fixed |
|-------|-----------------|
| Layout broken | CSS flexbox/grid, spacing |
| Button not working | HTML structure, classes |
| Styling wrong | Tailwind classes |
| Responsive issue | Tailwind breakpoints |

---

## Import Commands

### Import Design (`/import-design`)

**Purpose:** Validate and import HTML/CSS components to design system

**Usage:**
```
/import-design
```
Then paste your HTML/CSS code.

**Process:**
1. Validates HTML structure
2. Validates CSS
3. Reports issues with fix suggestions
4. Asks confirmation before creating file

**Output:** `source/design-system/{ComponentName}.md`

**Validation Checks:**
- Single root container
- Semantic HTML5 tags
- Accessibility (aria-labels, alt text)
- No inline styles
- Consistent class naming
- No !important in CSS

---

### Import Design by Image (`/import-design-by-image`)

**Purpose:** Convert UI component images to HTML/CSS code

**Usage:**
```
/import-design-by-image
```
Then provide the image.

**Process:**
1. Analyzes image for colors, typography, spacing
2. Asks for component name and category
3. Generates HTML + CSS + Tailwind versions
4. Asks confirmation before creating file

**Output:** `source/design-system/{ComponentName}.md`

**Analyzes:**
- Colors (background, text, border)
- Typography (size, weight)
- Spacing (padding, margin)
- Border (style, radius)
- Shadow effects
- States (hover, focus)

---

### Import Idea (`/import-idea`)

**Purpose:** Convert PDFs or Confluence links to product idea docs

**Usage:**
```
/import-idea
```
Then provide PDF file or Confluence URL.

**Process:**
1. Parses content from source
2. Extracts title, description, requirements
3. Structures as product idea
4. Asks confirmation before creating file

**Output:** `source/product-idea/{idea-name}.md`

**Extracts:**
- Title and description
- Problem statement
- Target users
- User stories
- Acceptance criteria
- Technical notes

---

### Import Spec Template (`/import-spec-template`)

**Purpose:** Convert PDFs or Confluence to reusable spec templates

**Usage:**
```
/import-spec-template
```
Then provide PDF file or Confluence URL.

**Process:**
1. Parses content structure
2. Identifies sections and placeholders
3. Creates reusable template
4. Asks confirmation before creating file

**Output:** `source/spec-template/{template-name}.md`

**Identifies:**
- Section hierarchy (H1, H2, H3)
- Placeholders (`{name}`, `{date}`)
- Tables and lists
- Common spec sections

---

## Utility Commands

### Build Feature (`/build-feature`)

**Purpose:** General feature building with intelligent agent activation

**Usage:**
```
/build-feature {feature description}
```

**Examples:**
```
/build-feature Add search to design system page
/build-feature Create new API endpoint for products
```

**Note:** Automatically determines which agents to activate based on the task.

---

## Agent Reference

### Core Agents (Pure Executors)

| Agent | Purpose | Used By |
|-------|---------|---------|
| `scout` | Search codebase for context | COMPLEX tier |
| `quick-scout` | Fast search + inline plan | MEDIUM tier |
| `planner` | Create implementation plans | COMPLEX tier |
| `designer` | Suggest UI composition | COMPLEX tier (if UI) |
| `implementer` | Write production code | All tiers |
| `write-spec` | Generate spec from demo | Demo workflow |
| `demo-folder-creator` | Create demo folder structure | Demo workflow |

### Import Agents

| Agent | Purpose | Output |
|-------|---------|--------|
| `import-design` | Validate HTML/CSS | `source/design-system/*.md` |
| `import-design-by-image` | Image to HTML/CSS | `source/design-system/*.md` |
| `import-idea` | PDF/Confluence to idea | `source/product-idea/*.md` |
| `import-spec-template` | PDF/Confluence to template | `source/spec-template/*.md` |

---

## Step-by-Step Walkthroughs

### Example 1: Edit App (`/start`)

Examples showing tier-based routing:

#### SIMPLE Tier - Fix Typo
```
/start Fix typo in Button.tsx
```
**Detected:** SIMPLE (exact file path, "fix")
**Flow:** implementer only
**Result:** Direct fix, no overhead

#### MEDIUM Tier - Add Search
```
/start Add search to design system page
```
**Detected:** MEDIUM (clear scope, 2-3 files)
**Flow:** quick-scout → implementer

**Step 1: Quick-Scout** - Finds files + shows inline plan:
```
📋 Inline Plan:
- Edit: client/src/pages/DesignSystemPage.tsx
- Add: search state, input component, filter logic
Proceed? [Yes]
```
**Step 2: Implementer** - Writes code

**Result:** Search feature added (50% fewer agents)

#### COMPLEX Tier - Rebuild Navigation
```
/start Rebuild entire navigation system
```
**Detected:** COMPLEX (multi-file, architectural)
**Flow:** scout → planner → [APPROVAL] → designer → [APPROVAL] → implementer

**Result:** Full workflow with plan file and user approvals

---

### Example 2: Create Demo (`/create-demo`)

This example shows the complete `/create-demo` workflow building a client portal demo.

### Command

```
/create-demo client-portal
```

### Step 1: Demo Folder Creator

**Agent:** `demo-folder-creator`
**Action:** Creates project structure

**Output:**
```
Created: source/demo/client-portal/
  README.md
  components/
  pages/
  assets/
  spec/
```

### Step 2: Scout

**Agent:** `scout`
**Action:** Searches design system for available components

**Output:**
```
Found 12 components in source/design-system/:
  - Button.md (primary, secondary, outline variants)
  - Card.md (default, hover states)
  - Navigation.md (sidebar, topbar)
  - Form.md (input, select, checkbox)
  - Table.md (sortable, paginated)
  ...
```

### Step 3: Planner

**Agent:** `planner`
**Action:** Plans pages based on requirements

**Output:**

| Page | Purpose | Components |
|------|---------|------------|
| home.html | Landing page | Navigation, Card, Button |
| dashboard.html | User dashboard | Navigation, Table, Card |
| settings.html | User settings | Navigation, Form |

### Step 4: Designer

**Agent:** `designer`
**Action:** Suggests UI composition

**Output:**
```
dashboard.html layout:
  - TopNav: Logo left, user menu right
  - Sidebar: 4 nav items with icons
  - Main: 3-column card grid + data table below
  - Uses: bg-gray-50, rounded-lg shadows
```

### Step 5: Implementer

**Agent:** `implementer`
**Action:** Builds HTML pages

**Output:**
```
Created:
  source/demo/client-portal/pages/home.html (142 lines)
  source/demo/client-portal/pages/dashboard.html (238 lines)
  source/demo/client-portal/pages/settings.html (186 lines)
```

### Step 6: Write Spec

**Agent:** `write-spec`
**Action:** Generates specification document

**Output:**
```
Created: source/demo/client-portal/spec/client-portal-spec.md

Contents:
  - Overview
  - Page Descriptions
  - Component Usage
  - User Flows
```

### Result

Demo project ready at `source/demo/client-portal/` with:
- 3 standalone HTML pages
- Tailwind CSS styling
- Design system components applied
- Specification document

---

### Example 3: Use Web App

#### Overview

The BA Demo Tool web app provides a unified interface for managing design system components, product ideas, spec templates, and demo projects. All data is stored as markdown files for easy version control and portability.

**Access:** `http://localhost:3000` (after running `npm run dev`)

**Main Navigation:**
| Page | Purpose |
|------|---------|
| Design System | Browse/manage UI components |
| Product Ideas | View/edit product requirements |
| Spec Templates | Manage specification templates |
| Demo Projects | Preview generated demos |

---

#### User Flow

**Flow 1: Build Demo from Scratch**
```
Import Components → Create Product Idea → Generate Demo → Review & Fix
```
1. `/import-design` or `/import-design-by-image` → Add components to design system
2. `/import-idea` → Create product idea from requirements
3. `/create-demo from @product-idea {name}` → Generate demo pages
4. Web App → Preview demo → `/fix-demo` if needed

**Flow 2: Copy Component for External Use**
```
Browse → Select → Copy → Paste
```
1. Web App → Design System page
2. Click component card → View preview
3. Click **HTML** or **Full Code** tab
4. Click **Copy** → Paste into your project

**Flow 3: Create Spec from Demo**
```
Demo Ready → Write Spec → Export
```
1. `/create-demo {name}` → Build demo pages
2. Auto-generates spec in `source/demo/{name}/spec/`
3. Web App → Demo Projects → View Spec → Copy/Export

**Flow 4: Manage Product Ideas**
```
Import → Review → Edit → Use in Demo
```
1. `/import-idea` → Import from PDF/Confluence
2. Web App → Product Ideas → Review details
3. Edit if needed → Save
4. `/create-demo from @product-idea {name}`

---

#### Design System Page

**Purpose:** Browse, preview, and copy design system components.

**Features:**

| Feature | How to Use |
|---------|------------|
| Browse components | Scroll grid or use search |
| Search | Type in search box to filter by name |
| View preview | Click component card |
| Copy HTML | Click **HTML** tab → **Copy** button |
| Copy CSS | Click **CSS** tab → **Copy** button |
| Copy full code | Click **Full Code** tab → **Copy** button |
| Change status | Click status badge → Select new status |
| Filter by status | Click status filter chips (Active/Draft/Inactive) |

**Component Card Actions:**
| Tab | Content |
|-----|---------|
| Preview | Live render of component |
| HTML | Markup code with syntax highlighting |
| CSS | Stylesheet code |
| Full Code | Combined HTML + CSS ready to paste |

---

#### Product Ideas Page

**Purpose:** Manage product requirements and feature ideas.

**Features:**

| Feature | How to Use |
|---------|------------|
| View all ideas | Grid displays idea cards |
| Search ideas | Type in search box |
| View details | Click idea card |
| Edit idea | Click **Edit** button on detail view |
| Delete idea | Click **Delete** button → Confirm |
| Import new | Use `/import-idea` command |

**Idea Detail View:**
| Section | Content |
|---------|---------|
| Header | Title and description |
| Problem | Problem statement |
| Users | Target users |
| Stories | User stories list |
| Criteria | Acceptance criteria |
| Technical | Technical notes |

---

#### Spec Templates Page

**Purpose:** Manage reusable specification templates.

**Features:**

| Feature | How to Use |
|---------|------------|
| Browse templates | Scroll template list |
| Preview template | Click template card |
| Copy template | Click **Copy** button |
| View sections | Expand collapsible sections |
| Import new | Use `/import-spec-template` command |

**Template Structure:**
| Element | Example |
|---------|---------|
| Section headers | H1, H2, H3 hierarchy |
| Placeholders | `{name}`, `{date}`, `{version}` |
| Tables | Requirements tables, feature lists |
| Instructions | Comments for template users |

---

#### Demo Projects Page

**Purpose:** View and preview generated demo projects.

**Features:**

| Feature | How to Use |
|---------|------------|
| Browse demos | Grid displays demo cards |
| View demo info | Click demo card |
| View pages list | Expand demo → See page links |
| Preview page | Click page link → Opens in new tab |
| View spec | Click **View Spec** button |
| Create new | Use `/create-demo` command |
| Fix issues | Use `/fix-demo {name}` command |

**Demo Card Info:**
| Field | Description |
|-------|-------------|
| Project name | Demo identifier |
| Page count | Number of HTML pages |
| Components | Design system components used |
| Created | Creation date |
| Links | Quick preview buttons |

---

## File Storage

All data stored as markdown files:

| Data | Location | Naming |
|------|----------|--------|
| Design components | `source/design-system/` | PascalCase.md |
| Product ideas | `source/product-idea/` | kebab-case.md |
| Spec templates | `source/spec-template/` | kebab-case.md |
| Demo projects | `source/demo/{name}/` | kebab-case folders |

---

## Choosing the Right Command

| I want to... | Use |
|--------------|-----|
| Add feature to main app | `/start` |
| Fix bug in client/server code | `/start` |
| Create new demo project | `/create-demo` |
| Fix bug in demo | `/fix-demo` |
| Import HTML/CSS component | `/import-design` |
| Convert UI screenshot to code | `/import-design-by-image` |
| Import product requirements | `/import-idea` |
| Import spec format | `/import-spec-template` |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Wrong files being modified | Check workflow: `/start` for app, `/create-demo` for demos |
| Scout finds nothing | Try different keywords or provide file paths |
| Demo files in wrong place | Ensure using `/create-demo`, not `/start` |

---

## Tips

1. **For new features:** Use `/start {feature}` to get complete analysis
2. **For demos:** Always use `/create-demo`, never `/start`
3. **For imports:** Let the agent validate before creating files
4. **When stuck:** Provide more context in your command description
