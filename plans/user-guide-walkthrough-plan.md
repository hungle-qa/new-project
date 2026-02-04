---
title: "Add Step-by-Step Walkthrough to User Guide"
status: pending
module: docs
target: docs/user-guide.md
created: 2026-02-03
---

# Test Plan: Add Step-by-Step Walkthrough to User Guide

## Reference Files (from scout)

| File | Patterns to Reuse |
|------|-------------------|
| `docs/user-guide.md` | Markdown tables, code blocks, horizontal rule separators |
| `.claude/workflows/create-demo-workflow.md` | Agent chain format, step-by-step structure |
| `.claude/workflows/primary-workflow.md` | Agent table format (Step, Agent, Purpose, Output) |

## Current State

- User guide has 322 lines
- Examples are brief (1-2 lines each)
- No detailed walkthrough showing actual agent outputs
- Structure: Quick Reference > Workflows > Import Commands > Utility > Agent Reference > Storage > Troubleshooting > Tips

## Proposed Changes

### Section: Step-by-Step Walkthrough Example

**Location:** Insert after "Agent Reference" section (line 275), before "File Storage" section

**Scenario:** "Building a Client Portal Demo" using `/create-demo`

Chosen because:
- Most comprehensive workflow (6 agents)
- Realistic business scenario
- Shows all agent interactions

### Content Structure

| Step | Agent | Shows | Example Output |
|------|-------|-------|----------------|
| 0 | User | Command input | `/create-demo client-portal` |
| 1 | demo-folder-creator | Folder structure created | Tree of created directories |
| 2 | scout | Design components found | List of available components |
| 3 | planner | Page plan created | Table of pages with component mapping |
| 4 | designer | UI composition | Component selection per page |
| 5 | implementer | HTML files built | File paths created |
| 6 | write-spec | Spec generated | Spec document summary |

### Format Guidelines

- Use collapsible sections or clearly labeled subsections
- Show truncated but realistic output examples
- Include timing estimates (optional)
- Keep under 100 lines total for the section

## Implementation Steps

| Step | Action | Target | Expected |
|------|--------|--------|----------|
| 1 | Add section header | Line ~276 | `## Step-by-Step Walkthrough` |
| 2 | Add intro paragraph | After header | Explain purpose of walkthrough |
| 3 | Add scenario setup | After intro | Command and context |
| 4 | Add Step 1-6 details | Main content | Agent outputs with examples |
| 5 | Add summary box | End of section | What was created, next steps |

## Dependencies

- **Locators**: N/A (documentation task)
- **Page Classes**: N/A
- **Fixtures**: N/A

## Next Agents

| Agent | Task |
|-------|------|
| implementer | Edit `docs/user-guide.md` to add walkthrough section after line 275 |

## Walkthrough Content Draft

```markdown
## Step-by-Step Walkthrough

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
```

## Unresolved Questions

None - requirements are clear.
