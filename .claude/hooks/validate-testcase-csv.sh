#!/usr/bin/env bash
# PostToolUse hook (Write) — Validate testcase CSV structure
# Exit 0 = pass, Exit 2 = block with message

set -euo pipefail

# Read hook input from stdin
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('tool_input',{}).get('file_path',''))" 2>/dev/null || echo "")

# Skip if not a testcase CSV
if [[ ! "$FILE_PATH" =~ -testcase.*\.csv$ ]]; then
  exit 0
fi

# Skip if file doesn't exist
if [[ ! -f "$FILE_PATH" ]]; then
  exit 0
fi

# Check file is non-empty
if [[ ! -s "$FILE_PATH" ]]; then
  echo "HOOK ERROR: Testcase CSV is empty: $FILE_PATH" >&2
  exit 2
fi

# Use Python for proper CSV parsing (handles multiline quoted fields)
python3 <<PYEOF
import csv, sys

file_path = "$FILE_PATH"
expected_header = ["No.", "US", "AC", "Step", "Title", "Expectation", "Priority"]

try:
    with open(file_path, newline='', encoding='utf-8') as f:
        reader = csv.reader(f)
        header = next(reader, None)

        if header is None:
            print("HOOK ERROR: CSV has no header row: " + file_path, file=sys.stderr)
            sys.exit(2)

        if header != expected_header:
            print("HOOK ERROR: CSV header mismatch in " + file_path, file=sys.stderr)
            print("  Expected: " + ",".join(expected_header), file=sys.stderr)
            print("  Got:      " + ",".join(header), file=sys.stderr)
            sys.exit(2)

        errors = []
        row_count = 0
        for i, row in enumerate(reader, start=2):
            row_count += 1
            if len(row) < 5 or not row[4].strip():
                errors.append(f"Row {i}: empty Title")

        if row_count == 0:
            print("HOOK ERROR: CSV has no data rows: " + file_path, file=sys.stderr)
            sys.exit(2)

        if errors:
            print("HOOK ERROR: Testcase CSV validation failed in " + file_path, file=sys.stderr)
            for e in errors[:10]:
                print("  - " + e, file=sys.stderr)
            if len(errors) > 10:
                print(f"  ... and {len(errors) - 10} more", file=sys.stderr)
            sys.exit(2)

except Exception as ex:
    print(f"HOOK ERROR: Failed to parse CSV {file_path}: {ex}", file=sys.stderr)
    sys.exit(2)
PYEOF
