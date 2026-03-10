# UI Keyboard Rules

> Keyboard shortcuts, hotkeys, popup/modal/dialog interactions

## Always handle ESC to close and Ctrl/Cmd+Enter to save
- **Mistake**: Building popups, modals, or dialogs without keyboard shortcuts — users must click buttons manually
- **Fix**: Always add these keyboard handlers to any popup/modal/dialog component:
  - `ESC` → close/cancel the popup
  - `Ctrl+Enter` (Windows/Linux) / `Cmd+Enter` (Mac) → trigger the save/submit button
- **Example**:
  ```tsx
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) onSave();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onSave]);
  ```
