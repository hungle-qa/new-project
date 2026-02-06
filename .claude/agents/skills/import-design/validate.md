# Skill: VALIDATE

**Mode:** Validate pasted HTML/CSS code (no image input)
**Action:** Validate + CREATE documentation

---

## Unique Workflow

### Step 1: Parse Input

1. Identify component name from user input
2. Extract HTML code
3. Check for Tailwind CSS classes

### Step 2: Validate HTML + Tailwind

Check for common issues:
- Missing closing tags
- Invalid attribute values
- Deprecated elements (`<center>`, `<font>`, etc.)
- Accessibility issues (missing alt, aria-*)
- Inline event handlers (onclick, etc.)
- Presence of Tailwind utility classes

### Step 3: Reject Non-Tailwind CSS

Check and reject if found:
- `<style>` tags in HTML -> Error: "Remove `<style>` tags, use Tailwind classes"
- External CSS files -> Error: "Convert CSS to Tailwind utility classes"
- `style=""` attributes -> Error: "Replace inline styles with Tailwind classes"
- Suggest Tailwind equivalents for common CSS patterns

### Step 4: Report Issues

```markdown
## Validation Report: {ComponentName}

### Summary
| Status | Count |
|--------|-------|
| Errors | {n} |
| Warnings | {n} |
| Info | {n} |

### Issues Found

#### Errors (Must Fix)
1. **{Issue}**
   - Location: `{line/selector}`
   - Problem: {description}
   - Fix: {suggestion}

#### Warnings (Should Fix)
1. **{Issue}**
   - Location: `{line/selector}`
   - Problem: {description}
   - Fix: {suggestion}

#### Info (Consider)
1. **{Issue}**
   - Suggestion: {improvement}
```

### Step 5: Ask Before Creating File

Use `AskUserQuestion`:
```
"I've validated the component. Would you like me to create the documentation file?"
Options:
- Yes, create {ComponentName}.md
- No, just show the report
- Let me fix issues first
```

---

## CSS to Tailwind Conversion Guide

When user provides regular CSS, suggest Tailwind equivalents:

| CSS Property | Tailwind Class |
|--------------|----------------|
| `margin: 1rem` | `m-4` |
| `padding: 0.5rem 1rem` | `px-4 py-2` |
| `display: flex` | `flex` |
| `justify-content: center` | `justify-center` |
| `border-radius: 0.5rem` | `rounded-lg` |
| `font-weight: bold` | `font-bold` |
| `font-size: 1.25rem` | `text-xl` |

**For colors, fonts, button styles:** Refer to `source/design-system/rule/RULE.md`.

---

## Output Format

```markdown
## 1. Validation Report
{issues and suggestions}

## 2. Corrected Code (if errors found)
{fixed HTML with Tailwind classes}

## 3. Tailwind Conversion (if regular CSS provided)
{suggest Tailwind equivalents for rejected CSS}

## 4. Confirmation
{ask user before creating file}

## 5. Component File (after approval)
{path to created file}
```

---

## Workflow Note

Validate mode uses a **single-phase workflow** (no Phase 1/Phase 2 split). After validation + approval, create the full documentation file immediately since the user is providing code directly (no testing step needed).

---

## Quality Standards

| Standard | Requirement |
|----------|-------------|
| HTML | Valid HTML5, semantic tags |
| Tailwind | Use utility classes only, no custom CSS |
| Accessibility | WCAG 2.1 AA compliance |
| Documentation | Complete all sections |
