# Tailwind Styling Rules

> Class ordering, shadcn/ui overrides, scrollbar layout shift

## Use global CSS for scrollbar layout shift — never overflow-y-scroll on containers
- **Mistake**: Using `overflow-y-scroll` on individual containers (or the root Layout div) to prevent layout shift when scrollbar appears. This forces a visible scrollbar gutter even when content doesn't overflow, wasting space.
- **Fix**: Add global overlay scrollbar CSS in `index.css` instead:
  - `scrollbar-gutter: stable` on `html` — reserves space so content width stays constant
  - `overflow-y: overlay` on `html` — Chrome/Edge overlay scrollbar (floats over content)
  - Thin WebKit scrollbar styles (8px, transparent track, rounded thumb)
- **Example**: In `index.css`:
  ```css
  html { overflow-y: auto; overflow-y: overlay; scrollbar-gutter: stable; }
  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.2); border-radius: 4px; }
  ```
  Keep `overflow-auto` on inner containers — the global CSS handles the shift.
