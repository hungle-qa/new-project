# Code Rules — Mistake-Driven Knowledge Base

**MANDATORY**: Before planning or writing code, scan the task description for keywords matching the index below. Read ALL matching files from `.claude/code-rules/` before proceeding. This prevents repeating known mistakes.

## Index

| File | Keywords | Description |
|---|---|---|
| csv-parsing.md | csv, column, alignment, json-to-csv, parsing, delimiter | CSV alignment, JSON-to-CSV conversion, column counting |
| react-state.md | state, useState, closure, re-render, controlled, uncontrolled | Stale closures, re-renders, controlled components |
| file-io.md | file, path, fs, readFile, writeFile, temp, cleanup, race condition | Path handling, race conditions, temp file cleanup |
| typescript-types.md | type, interface, any, narrowing, discriminated, import type | Type narrowing, any escapes, import types |
| tailwind-styling.md | tailwind, className, shadcn, dark mode, responsive, breakpoint | Class ordering, shadcn/ui overrides |
| ui-keyboard.md | popup, modal, dialog, keyboard, shortcut, hotkey, ESC, Ctrl+Enter | Keyboard shortcuts for popups/modals/dialogs |
| node-eval.md | node -e, node eval, inline script, zsh, histexpand | Never use node -e; write temp .js file instead |

## How to use

1. Parse task for keywords
2. Match against the **Keywords** column above
3. Read matched files from `.claude/code-rules/{file}`
4. Apply all rules found before writing any code
5. If no keywords match, proceed normally
