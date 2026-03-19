#!/usr/bin/env bash
set -euo pipefail

DEST_DIR="$(cd "$(dirname "$0")/.claude" && pwd)"
SOURCE_PATH="${1:-}"

SCOPED_DIRS=(agents skills commands rules code-rules agent-rules workflows)

# Step 1: Resolve source path
if [ -z "$SOURCE_PATH" ]; then
  read -rp "Enter source project path: " SOURCE_PATH
fi
SOURCE_PATH="${SOURCE_PATH/#\~/$HOME}"  # expand ~
SOURCE_DIR="$SOURCE_PATH/.claude"

# Step 2: Validate
if [ ! -d "$SOURCE_DIR" ]; then
  echo "ERROR: .claude not found at: $SOURCE_PATH"
  exit 1
fi

# Step 3: Collect diffs
ADDS=()
UPDATES=()
DIFF_OUTPUT=""

for scope in "${SCOPED_DIRS[@]}"; do
  src_scope="$SOURCE_DIR/$scope"
  [ -d "$src_scope" ] || continue
  while IFS= read -r -d '' src_file; do
    rel="${src_file#"$SOURCE_DIR"/}"
    dst_file="$DEST_DIR/$rel"
    if [ ! -f "$dst_file" ]; then
      ADDS+=("$rel")
    elif ! diff -q "$src_file" "$dst_file" > /dev/null 2>&1; then
      UPDATES+=("$rel")
      DIFF_OUTPUT+="$(diff -u "$dst_file" "$src_file" --label "current/$rel" --label "incoming/$rel" || true)"$'\n'
    fi
  done < <(find "$src_scope" -type f -print0)
done

# Step 4: No changes?
if [ ${#ADDS[@]} -eq 0 ] && [ ${#UPDATES[@]} -eq 0 ]; then
  echo "Already up to date."
  exit 0
fi

# Step 5: Show diff summary
echo ""
if [ ${#ADDS[@]} -gt 0 ]; then
  echo "New files to add (${#ADDS[@]}):"
  for f in "${ADDS[@]}"; do echo "  [ADD] $f"; done
fi
if [ ${#UPDATES[@]} -gt 0 ]; then
  echo ""
  echo "Files to update (${#UPDATES[@]}):"
  for f in "${UPDATES[@]}"; do echo "  [UPDATE] $f"; done
  echo ""
  echo "--- Unified diff ---"
  echo "$DIFF_OUTPUT"
fi

read -rp "Apply these changes? (y/n): " choice
if [[ "$choice" != "y" ]]; then
  echo "Aborted."
  exit 0
fi

# Step 7: Backup
BACKUP="$(dirname "$DEST_DIR")/.claude.bak.$(date +%Y%m%d_%H%M%S)"
cp -r "$DEST_DIR" "$BACKUP"
echo "Backed up .claude → $BACKUP"

# Step 8: Copy
for scope in "${SCOPED_DIRS[@]}"; do
  src_scope="$SOURCE_DIR/$scope"
  [ -d "$src_scope" ] || continue
  while IFS= read -r -d '' src_file; do
    rel="${src_file#"$SOURCE_DIR"/}"
    dst_file="$DEST_DIR/$rel"
    mkdir -p "$(dirname "$dst_file")"
    cp "$src_file" "$dst_file"
  done < <(find "$src_scope" -type f -print0)
done

# Step 9: Report
echo ""
echo "Done — added: ${#ADDS[@]}, updated: ${#UPDATES[@]}"
