# Skill: UPDATE

**Mode:** Update existing component WITHOUT image input
**Action:** EDIT only (never CREATE)

---

## LOGIC PRESERVATION RULE (P0 - CRITICAL)

**The existing component is the SOURCE OF TRUTH. Preserve what's not being changed.**

| Principle | Rule |
|-----------|------|
| **Minimal Changes** | ONLY modify what user explicitly requested |
| **Preserve Structure** | Keep existing HTML structure unless change requires restructure |
| **No Assumptions** | Do NOT add features user didn't request |
| **No Improvements** | Do NOT "improve" or "enhance" beyond requested changes |
| **Ask First** | When user request is ambiguous, ASK rather than guess |

**When in doubt, ASK the user rather than guess.**

---

## Step 0: Validate Component Exists (MANDATORY)

### Step 0a: Check File Exists

```
Check: source/design-system/{ComponentName}.md

If file NOT FOUND:
  ERROR: "Component '{ComponentName}' does not exist. Use CREATE mode to create new components."
  STOP and ask user to verify component name or use create workflow.

If file EXISTS:
  Continue to Step 0b.
```

### Step 0b: Read Existing Component

```
TARGET_FILE = source/design-system/{ComponentName}.md
Read: {TARGET_FILE}

Extract and store:
- TARGET_FILE: The exact file path (use this for ALL subsequent Edit/Write operations)
- BEFORE_FRONTMATTER: name, category, status, created, updated
- BEFORE_HTML: Complete HTML section
- BEFORE_CSS: Complete CSS section
- BEFORE_STATES: Component States table (if exists)
- BEFORE_TAILWIND: Tailwind Classes Used table (if exists)
- ALL_SECTIONS: Complete file content for reference
```

**CRITICAL:** All subsequent Edit/Write operations MUST target `{TARGET_FILE}`. NEVER edit a different component file.

---

## Step 1: Understand User Request

Parse update request for:

| Element | Examples |
|---------|----------|
| **What to change** | "Change button color", "Add hover state", "Update padding" |
| **Specific values** | "Use blue-500", "8px padding", "Add shadow-lg on hover" |
| **Scope** | "Only the submit button", "All buttons", "The entire card" |

**If request is unclear, ASK:**

Use AskUserQuestion:
```
"I found the {ComponentName} component. To update it accurately, please clarify:

1. What specifically should I change?
2. What are the target values?
3. Which elements?"
```

---

## Step 2: Apply Changes to HTML/CSS

**Requirements:**
- Tailwind utility classes only
- No custom CSS or `<style>` tags
- No inline `style=""` attributes
- Follow RULE.md colors/fonts
- **Preserve existing structure where possible**

Generate: AFTER_HTML, AFTER_CSS

---

## Step 3: Show BEFORE vs AFTER Comparison (MANDATORY)

```markdown
## Component: {ComponentName}
**File:** `{TARGET_FILE}`

### BEFORE (Current)

\`\`\`html
{BEFORE_HTML from Step 0b}
\`\`\`

### AFTER (Proposed Changes)

\`\`\`html
{AFTER_HTML with requested changes}
\`\`\`

### Changes Summary

| Aspect | Before | After | Reason |
|--------|--------|-------|--------|
| Background | {old} | {new} | {user request} |

### Tailwind Classes Changed

| Element | Removed Classes | Added Classes |
|---------|-----------------|---------------|
```

---

## Phase 1 & Phase 2

Follow master agent's two-phase workflow:
- **Phase 1:** Edit `{TARGET_FILE}` — update HTML + CSS sections only -> user tests
- **CRITICAL:** Always use the exact `TARGET_FILE` path from Step 0b. NEVER edit a different file.
- **Phase 2:** After approval -> update affected documentation sections in `{TARGET_FILE}` only

**Phase 2 specifics for UPDATE:**
- Update only sections affected by changes (Tailwind Classes, Component States, etc.)
- Preserve sections NOT affected
- Keep `created` unchanged, update `updated` to current timestamp

---

## Revert Strategy

**If user says "Revert" or "Cancel" after seeing changes:**

```
Use Edit tool to restore from BEFORE_* variables:
- Restore BEFORE_HTML
- Restore BEFORE_CSS
- Keep all other sections unchanged

Tell user: "Changes reverted. Component restored to previous version."
```

---

## Common Update Scenarios

| User Request | Changes Required | Sections to Update (Phase 2) |
|--------------|------------------|------------------------------|
| "Change button color" | HTML classes only | HTML, Tailwind Classes table |
| "Add hover state" | HTML classes only | HTML, Component States, Tailwind Classes |
| "Update spacing" | HTML classes only | HTML, Tailwind Classes table |
| "Add icon" | HTML structure + icon | HTML, Tailwind Classes, Notes |
| "Change text" | HTML content only | HTML only |
| "Add disabled state" | HTML classes + structure | HTML, Component States, Tailwind Classes |
| "Fix alignment" | HTML classes only | HTML, Tailwind Classes table |

---

## Update-Specific Failure Handlers

| Situation | Action |
|-----------|--------|
| Component not found | Stop, ask user to verify name |
| Request unclear | Use AskUserQuestion with specific options |
| Conflicting requirements | Ask user to prioritize |
| RULE.md conflict | Ask which takes precedence |
| Icon not found | List available icons, ask user to choose |
| Invalid Tailwind class | Suggest correct alternatives |
