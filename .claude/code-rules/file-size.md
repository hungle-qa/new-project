# File Size Rule — Keep .ts/.tsx Files Under 300 Lines

## Rule

Every `.ts` and `.tsx` file must stay under **300 lines**.

## Why

Large files are harder to review, test, and maintain. A file exceeding 300 lines is a signal of poor separation of concerns — it likely holds multiple responsibilities that should be split.

## Fix

When a file approaches or exceeds 300 lines:

1. **Identify distinct responsibilities** — look for groups of functions, types, or components that belong together
2. **Extract to smaller modules** — move related code into separate files with focused names (e.g., `useFormState.ts`, `FormActions.tsx`, `formUtils.ts`)
3. **Re-export from an index** if needed to preserve the public API surface
4. **Prefer co-location** — keep extracted files near their consumers, not in a generic `utils/` dump

## Examples

```
// BAD — one 400-line file doing everything
components/UserDashboard.tsx  (400 lines)

// GOOD — split by responsibility
components/UserDashboard.tsx       (80 lines — layout + composition)
components/UserDashboard/Stats.tsx (90 lines — stats section)
components/UserDashboard/Actions.tsx (60 lines — action buttons)
hooks/useUserDashboard.ts          (70 lines — data + state logic)
```

## Threshold

| Situation | Action |
|-----------|--------|
| < 250 lines | Fine — no action needed |
| 250–299 lines | Warning zone — avoid adding more; consider splitting |
| ≥ 300 lines | Must split before merging |
