# Backend Selection Rules

> Backend must only act on user-selected items, never walk all files independently

## Never bypass frontend selection with a backend walkDir
- **Mistake**: Push integration UI added checkboxes for file selection, but the backend `integrate:run` handler independently walked all source files and copied any new file automatically — ignoring the user's checkbox selections entirely. Only conflict/overwrite files were gated by selection.
- **Fix**: When a UI provides checkboxes or selection, the backend must receive the full selected list and only operate on those items. Use a `Set` of selected files and skip anything not in it. Never re-walk the filesystem independently to decide what to include.
- **Example**:
  - Bad: Backend walks all files, copies new ones unconditionally, only checks selection for conflicts
  - Good: Frontend sends `selectedFiles` (all checked items from both lists), backend iterates source files but skips any not in `selectedSet`
- **Applies to**: Any IPC handler or API endpoint that acts on user-selected items from a list UI
