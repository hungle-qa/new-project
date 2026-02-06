---
description: Create a demo project
argument-hint: [demo-name] or "from @product-idea {name}"
---

**Purpose:** Build demo projects with HTML pages.

**Target:** Create files in `source/demo/{project-name}/` only.

**NEVER:** Update design-system docs, product-idea docs, client/src/, server/src/

**ONLY USE:** Design system components with `status: approved` in frontmatter. Reject draft/pending/rejected components.

---

## Demo Name Recognition

- `@source/demo/{name}/` → `source/demo/{name}/`
- `@{name}` → `source/demo/{name}/`
- `from @product-idea {name}` → Use `source/product-idea/{name}.md` as reference (READ ONLY)

---

## Clarification Check (REQUIRED)

**If task is ambiguous, ASK user:**

Example ambiguous tasks:
- "create a modal component" → New demo or add to design-system?
- "build login page" → New demo or main app feature?

**Ask using AskUserQuestion:**
```
"Do you want to CREATE A DEMO (source/demo/) or something else?"
Options:
- "Demo project" → Proceed with create-demo workflow
- "Design system component" → Exit workflow, use @import-design
- "Main app feature" → Exit workflow, use /start
```

**If clearly demo-related, proceed without asking.**

---

## Tier Detection

**BEFORE running workflow, classify task complexity:**

| Tier | Detection Criteria | Agent Chain |
|------|-------------------|-------------|
| **SIMPLE** | Single page demo, clear component | folder-creator → implementer |
| **MEDIUM** | 2-3 pages, known components | folder-creator → scout → implementer |
| **COMPLEX** | Multi-page, custom components, from product-idea | Full workflow |

### SIMPLE Task Indicators
- Single page demo
- User specifies exact component to showcase
- No product idea reference
- Keywords: "quick demo", "simple page", "showcase {component}"

### MEDIUM Task Indicators
- 2-3 pages
- Clear page structure
- Uses existing design system components
- No spec generation needed

### COMPLEX Task Indicators
- Multiple pages with navigation
- References product idea
- Needs custom component variations
- User explicitly asks for spec
- Keywords: "full demo", "from product-idea", "with spec"

---

## Execution

**SIMPLE tasks:**
```
→ demo-folder-creator → implementer
```
Create folder, build the page directly.

**MEDIUM tasks:**
```
→ demo-folder-creator → quick-scout → implementer
```
Create folder, scout design system, build pages.

**COMPLEX tasks:**
```
→ demo-folder-creator → scout → planner → designer → implementer
```
Full workflow per `.claude/workflows/create-demo-workflow.md`.

---

**If `$ARGUMENTS` is empty:** Ask user for demo name before proceeding.

---

Task: $ARGUMENTS

**Scope:** Demo projects in source/demo/ only.
