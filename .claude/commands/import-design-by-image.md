---
description: Convert UI component images to HTML with Tailwind CSS
argument-hint: [attach image(s)]
---

**Purpose:** Convert UI component images into HTML with Tailwind CSS, validate pasted code, or update existing components.

**Target:** `source/design-system/{ComponentName}.md`

---

## Modes

| Mode | Trigger |
|------|---------|
| VALIDATE | HTML/CSS code pasted, no images |
| SINGLE | 1 image attached |
| MULTI | 2+ images attached |
| UPDATE | No images + component name + file exists |

---

## Workflow

**Reference:** `.claude/agents/import-design.md`

Read agent file first, then follow skill routing to the matching skill file. All mode detection, action detection, and routing is handled by the agent.

---

Task: $ARGUMENTS
