# Node.js Eval — Shell Escaping

## Problem
`node -e "..."` fails in zsh because `!==` gets escaped to `\!==` by zsh's histexpand feature. This breaks JavaScript operators like `!==` and `!r._header`.

## Rule
**NEVER use `node -e` for inline scripts.** Instead:
1. Write the script to a temp `.js` file (e.g., `_convert.js`)
2. Run with `node path/to/_convert.js`
3. Delete the temp file after successful execution

## Example
```bash
# BAD — zsh escapes ! inside node -e
node -e "if (x !== y) { ... }"

# GOOD — write to file, then run
# Use Write tool to create _convert.js with the script content
node path/to/_convert.js
rm path/to/_convert.js
```
