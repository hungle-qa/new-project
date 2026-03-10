#!/usr/bin/env bash
# PostToolUse hook (Bash) — Check _temp.json cleanup after node conversion
# Always exits 0 (non-blocking) — warnings only

set -euo pipefail

# Read hook input from stdin
INPUT=$(cat)
COMMAND=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('tool_input',{}).get('command',''))" 2>/dev/null || echo "")

# Skip if command doesn't involve node + _temp.json conversion
if [[ ! "$COMMAND" =~ node ]] || [[ ! "$COMMAND" =~ _temp\.json ]]; then
  exit 0
fi

# Check for leftover _temp.json files in testcase feature dirs
PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"
LEFTOVER=$(find "$PROJECT_DIR/source/testcase/feature" -name "*_temp.json" -type f 2>/dev/null || true)

if [[ -n "$LEFTOVER" ]]; then
  echo "HOOK WARNING: Leftover _temp.json file(s) found after conversion:"
  echo "$LEFTOVER"
  echo "These should be cleaned up to avoid clutter."
fi

exit 0
