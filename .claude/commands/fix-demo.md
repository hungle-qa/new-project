---
description: Fix issues in a demo project
argument-hint: @{demo-name} [issue description]
---

**Purpose:** Fix bugs or improve existing demo projects.

**Target:** HTML/CSS files in `source/demo/{project-name}/` only.

**NEVER:** Update design-system docs, product-idea docs, client/src/, server/src/

**ONLY USE:** Design system components with `status: approved` in frontmatter. Reject draft/pending/rejected components.

---

## Demo Name Recognition

- `@source/demo/{name}/` → `source/demo/{name}/`
- `@{name}` → `source/demo/{name}/`

---

## Clarification Check (REQUIRED)

**If task mentions files OUTSIDE demo folder, ASK user:**

Example ambiguous tasks:
- "fix the description in DiscardChangesModal" → Demo HTML or design-system .md?
- "update the button component" → Demo HTML or design-system .md?

**Ask using AskUserQuestion:**
```
"Do you want to fix the DEMO (source/demo/{name}/) or the DESIGN SYSTEM (.md file)?"
Options:
- "Demo project" → Proceed with fix-demo workflow
- "Design system doc" → Exit workflow, handle separately
```

**If clearly demo-related, proceed without asking.**

---

## Tier Detection

**BEFORE running workflow, classify task complexity:**

| Tier | Detection Criteria | Agent Chain |
|------|-------------------|-------------|
| **SIMPLE** | Single file, text change, styling tweak | implementer only |
| **MEDIUM** | 2-3 files, clear scope, layout fix | quick-scout → implementer |
| **COMPLEX** | Multi-page, unclear scope, restructure | Full workflow |

### SIMPLE Task Indicators
- User specifies exact file/element
- Keywords: "change text", "fix color", "update spacing", "rename"
- Single HTML file change
- Content or styling only

### MEDIUM Task Indicators
- Clear fix scope (e.g., "fix button alignment on home page")
- 2-3 HTML files affected
- Layout adjustments
- Add/remove component in existing page

### COMPLEX Task Indicators
- Multiple pages affected
- User explicitly asks for plan
- Structural changes
- Keywords: "rebuild", "restructure", "redesign"

---

## Execution

**SIMPLE tasks:**
```
→ implementer (direct)
```
No scout, no plan, just fix the issue.

**MEDIUM tasks:**
```
→ quick-scout → implementer
```
Scout the demo files, then implement fix.

**COMPLEX tasks:**
```
→ scout → planner → designer → implementer
```
Full workflow per `.claude/workflows/fix-demo-workflow.md`.

---

Task: $ARGUMENTS

**Scope:** Demo projects in source/demo/ only.
