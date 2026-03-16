#!/usr/bin/env bash
set -euo pipefail

SOURCE_DIR="$(cd "$(dirname "$0")/.claude" && pwd)"
TARGET_PATH="${1:-}"

# Step 1: Resolve target path
if [ -z "$TARGET_PATH" ]; then
  read -rp "Enter target project path: " TARGET_PATH
fi
TARGET_PATH="${TARGET_PATH/#\~/$HOME}"  # expand ~
TARGET_DIR="$TARGET_PATH/.claude"

# Step 2: Validate
if [ ! -d "$TARGET_PATH" ]; then
  echo "ERROR: path not found: $TARGET_PATH"
  exit 1
fi

# Step 3: Backup existing .claude if present
if [ -d "$TARGET_DIR" ]; then
  BACKUP="$TARGET_PATH/.claude.bak.$(date +%Y%m%d_%H%M%S)"
  cp -r "$TARGET_DIR" "$BACKUP"
  echo "Backed up existing .claude → $BACKUP"
fi

# Step 4: Merge — walk source, copy or prompt on conflict
COPIED=0
SKIPPED=0
while IFS= read -r -d '' src_file; do
  rel="${src_file#"$SOURCE_DIR"/}"
  dst_file="$TARGET_DIR/$rel"
  if [ -f "$dst_file" ]; then
    read -rp "Conflict: $rel — overwrite? (y/n): " choice
    if [[ "$choice" != "y" ]]; then
      ((SKIPPED++)) || true
      continue
    fi
  fi
  mkdir -p "$(dirname "$dst_file")"
  cp "$src_file" "$dst_file"
  ((COPIED++)) || true
done < <(find "$SOURCE_DIR" -type f -print0)

echo ""
echo "Done — copied: $COPIED, skipped: $SKIPPED"
