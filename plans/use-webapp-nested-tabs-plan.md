---
title: "Use Web App Nested Tabs"
status: pending
module: mainCoach
target: client/src/pages/UserGuidePage.tsx
created: 2026-02-03
---

# Test Plan: Use Web App Nested Tabs

## Reference Tests (from scout)

| File | Patterns to Reuse |
|------|-------------------|
| `UserGuidePage.tsx` | useState for tab state, TabType union type, tabs array config, conditional styling for active tab |

## Current State Analysis

- Main tabs: `edit-app`, `create-demos`, `use-webapp`
- Tab state: `useState<TabType>('edit-app')`
- Content structure: `guideContent[activeTab]` lookup
- Styling: Tailwind with indigo accent, border-based active state

## Implementation Plan

### Step 1: Add Sub-Tab Type and State

```typescript
// Add after line 4
type WebAppSubTab = 'design-system' | 'product-ideas' | 'spec-templates' | 'demo-projects'

// Add inside component after line 183
const [webAppSubTab, setWebAppSubTab] = useState<WebAppSubTab>('design-system')
```

### Step 2: Define Sub-Tab Configuration

```typescript
const webAppSubTabs: { id: WebAppSubTab; label: string }[] = [
  { id: 'design-system', label: 'Design System' },
  { id: 'product-ideas', label: 'Product Ideas' },
  { id: 'spec-templates', label: 'Spec Templates' },
  { id: 'demo-projects', label: 'Demo Projects' },
]
```

### Step 3: Extract Content per Sub-Tab

Refactor `use-webapp` content from single GuideSection to per-sub-tab content:

| Sub-Tab | Content Source (from existing) |
|---------|-------------------------------|
| design-system | Lines 104-108, 131-136, 160 |
| product-ideas | Lines 111-115, 138-143, 161 |
| spec-templates | Lines 117-121, 145-150, 162 |
| demo-projects | Lines 123-128, 152-157, 163 |

### Step 4: Render Sub-Tab UI

Insert after main tabs (line 212), conditionally when `activeTab === 'use-webapp'`:

```tsx
{activeTab === 'use-webapp' && (
  <div className="flex gap-1 mb-4 ml-4">
    {webAppSubTabs.map(({ id, label }) => (
      <button
        key={id}
        onClick={() => setWebAppSubTab(id)}
        className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
          webAppSubTab === id
            ? 'bg-indigo-100 text-indigo-700 font-medium'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
        }`}
      >
        {label}
      </button>
    ))}
  </div>
)}
```

### Step 5: Content Rendering Logic

When `activeTab === 'use-webapp'`, render based on `webAppSubTab` instead of full content.

## Test Steps

| Step | Action | Target | Expected |
|------|--------|--------|----------|
| 1 | Click "Use Web App" tab | Main tab bar | Tab becomes active, sub-tabs appear |
| 2 | Verify sub-tabs visible | Below main tabs | 4 sub-tabs: Design System, Product Ideas, Spec Templates, Demo Projects |
| 3 | Click "Product Ideas" sub-tab | Sub-tab bar | Content switches to Product Ideas guide |
| 4 | Click "Edit App" main tab | Main tab bar | Sub-tabs disappear, Edit App content shows |
| 5 | Return to "Use Web App" | Main tab bar | Sub-tabs reappear, previous sub-tab state preserved |

## Dependencies

- **Locators**: [x] exists - reuse existing tab button patterns
- **Page Classes**: [x] exists - modify UserGuidePage.tsx only
- **Fixtures**: [x] exists - no new fixtures needed

## File Changes

| File | Change Type | Description |
|------|-------------|-------------|
| `client/src/pages/UserGuidePage.tsx` | Modify | Add sub-tab type, state, config, UI, content structure |

## Implementation Notes

1. Keep overview section at top for "use-webapp" (shared across sub-tabs)
2. Sub-tab content replaces Input/Process/Output/Examples sections
3. Note section can remain shared or split per sub-tab
4. Reset sub-tab to 'design-system' when switching away and back (optional, discuss with user)

## Next Agents

| Agent | Task |
|-------|------|
| implementer | Modify `/Users/hungle-qa/hungle-note/source/BA kit_v1/client/src/pages/UserGuidePage.tsx` per plan |
| tester | `npm run dev` then manual verification in browser |

## Unresolved Questions

1. Should sub-tab state persist when switching main tabs, or reset to 'design-system'?
2. Should the overview section be shared across all sub-tabs or split per sub-tab?
3. Should the Note section remain at bottom for all sub-tabs or be sub-tab-specific?
