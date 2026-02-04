---
title: "Add Examples Field to User Guide Page"
status: pending
module: client
target: client/src/pages/UserGuidePage.tsx
created: 2026-02-03
---

# Implementation Plan: Add Examples Field to User Guide Page

## Reference Files (from scout)

| File | Patterns to Reuse |
|------|-------------------|
| `client/src/pages/UserGuidePage.tsx` | `GuideSection` interface, `Section` component, `guideContent` object |

## Current State

- `GuideSection` interface has: overview, workflow, input, process, output, note
- UI renders sections in order: Overview > Workflow > Input > Process > Output > Note
- Uses `<Section>` component with title prop and optional icon
- Content rendered as lists (ul/ol) or paragraphs

## Proposed Changes

### 1. Update Interface (line 6-13)

Add `examples` field to `GuideSection`:

```typescript
interface GuideSection {
  overview: string
  workflow: { steps: string[]; description?: string }
  input: string[]
  process: string[]
  output: string[]
  examples: string[]  // NEW
  note: string[]
}
```

### 2. Add Data for Each Tab

| Tab | Examples Content |
|-----|------------------|
| edit-app | `/start Add search to design system` |
| create-demos | `/create-demo client-portal` |
| use-webapp | `Click component card > View HTML tab > Copy code` |

### 3. Add UI Section (between Output and Note)

Insert Examples section after line 191 (Output section), before line 194 (Note section):

```tsx
{/* Examples */}
<Section title="Examples">
  <ul className="space-y-1 text-gray-700">
    {content.examples.map((item, i) => (
      <li key={i} className="flex items-start gap-2">
        <code className="px-2 py-0.5 bg-gray-100 text-indigo-600 rounded text-sm font-mono">
          {item}
        </code>
      </li>
    ))}
  </ul>
</Section>
```

## Implementation Steps

| Step | Action | Target | Expected |
|------|--------|--------|----------|
| 1 | Add `examples` to interface | Line 12 (before `note`) | Type updated |
| 2 | Add examples array to `edit-app` | Line 43-45 | Single example added |
| 3 | Add examples array to `create-demos` | Line 72-74 | Single example added |
| 4 | Add examples array to `use-webapp` | Line 97-99 | Single example added |
| 5 | Add Examples section UI | Line 192 (after Output) | New section renders |

## Dependencies

- **Locators**: [x] N/A
- **Page Classes**: [x] exists (`UserGuidePage.tsx`)
- **Fixtures**: [x] N/A

## Next Agents

| Agent | Task |
|-------|------|
| implementer | Edit `client/src/pages/UserGuidePage.tsx` per steps above |
| tester | Run `npm run dev` in client/, verify Examples section appears on all 3 tabs |

## Unresolved Questions

None - requirements are clear.
