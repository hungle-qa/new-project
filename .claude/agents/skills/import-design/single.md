# Skill: SINGLE

**Mode:** Convert 1 UI component image to HTML + Tailwind CSS
**Actions:** CREATE (new component) or EDIT (update existing)

---

## IMAGE FIDELITY RULE (P0 - CRITICAL)

**The original image is the SOURCE OF TRUTH. Adhere strictly to it.**

| Principle | Rule |
|-----------|------|
| **Exact Match** | Generated code MUST visually match the image pixel-perfectly |
| **No Assumptions** | Do NOT add elements, states, or features not visible in the image |
| **No Improvements** | Do NOT "improve" or "enhance" the design beyond what's shown |
| **Colors** | Extract exact colors from image |
| **Spacing** | Match padding, margins, gaps exactly as shown |
| **Typography** | Match font sizes, weights, line heights from image |
| **Border Radius** | Match exact roundness from image |
| **Shadows** | Only add shadows if clearly visible in image |

**When in doubt, ASK the user rather than guess.**

---

## Step 0: Use Pre-Detected Context

Workflow may pass pre-detected values:
```
{ mode: "SINGLE", action: "CREATE"|"EDIT", component_name, file_exists }
```

**If action not provided (fallback):**
- Check keywords: "edit", "update", "modify" -> EDIT
- Check file exists at `source/design-system/{ComponentName}.md`
- File exists + edit keywords -> EDIT
- File exists + no keywords -> ASK user
- File doesn't exist -> CREATE

### Step 0a: EDIT Mode - Read Existing

```
Read: source/design-system/{ComponentName}.md
Extract: Current HTML, CSS, states
Store as: BEFORE_HTML, BEFORE_CSS
```

---

## Step 1: Analyze the Image

Examine for:
1. Component type (button, input, card, etc.)
2. Colors (background, text, border)
3. Typography (size, weight)
4. Spacing (padding, margin)
5. Border (style, radius)
6. Shadow effects
7. Icons (if any)

---

## Step 2: Ask Component Details

Use AskUserQuestion:
```
"I've analyzed the image. Please confirm:"

Questions:
1. Component Name: {suggested}
2. Category: buttons | cards | forms | layout | navigation | feedback
3. Any specific requirements?
```

---

## Step 3: Generate HTML with Tailwind

**Requirements:**
- Tailwind utility classes only
- No custom CSS or `<style>` tags
- No inline `style=""` attributes
- Follow RULE.md colors/fonts

---

## Step 4: Show Mock-up (MANDATORY)

**For CREATE mode:**
```markdown
## Mock-up Preview

\`\`\`html
{complete HTML with Tailwind}
\`\`\`

## Tailwind Classes Used
| Class | Purpose |
|-------|---------|
```

**For EDIT mode - Show BEFORE vs AFTER:**
```markdown
## BEFORE (Current)

\`\`\`html
{BEFORE_HTML from Step 0a}
\`\`\`

## AFTER (Proposed)

\`\`\`html
{new HTML with Tailwind}
\`\`\`

## Changes Summary
| Aspect | Before | After |
|--------|--------|-------|
```

---

## Phase 1 & Phase 2

Follow master agent's two-phase workflow:
- **Phase 1:** Create/update HTML + CSS sections only -> user tests
- **Phase 2:** After approval -> complete full documentation (16 sections)
