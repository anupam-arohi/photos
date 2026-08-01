#!/usr/bin/env bash
# Generate web-ready versions of a photo for the gallery.
#
#   ./resize.sh ~/Pictures/export/midnight-arc.jpg
#   ./resize.sh ~/Pictures/export/*.jpg
#
# For each source file this writes into images/ :
#   <slug>.jpg        long edge 2000, the canonical file referenced in photos.js
#   <slug>-800.jpg    for phones
#   <slug>-1400.jpg   for tablets and normal desktop
#   <slug>-2000.jpg   for retina and large screens
#
# Requires ImageMagick.  macOS:  brew install imagemagick

set -euo pipefail

OUT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/images"
QUALITY=82

# ImageMagick 7 uses `magick`, ImageMagick 6 uses `convert`.
if command -v magick >/dev/null 2>&1; then
  IM="magick"
  IM_IDENTIFY="magick identify"
elif command -v convert >/dev/null 2>&1; then
  IM="convert"
  IM_IDENTIFY="identify"
else
  echo "ImageMagick not found. Install it with:  brew install imagemagick" >&2
  exit 1
fi

if [ "$#" -eq 0 ]; then
  echo "usage: $(basename "$0") <source-image> [more-source-images...]" >&2
  exit 1
fi

mkdir -p "$OUT_DIR"

for src in "$@"; do
  if [ ! -f "$src" ]; then
    echo "skipping, not a file: $src" >&2
    continue
  fi

  base="$(basename "$src")"
  slug="${base%.*}"
  # lowercase, spaces and underscores to hyphens, drop anything else
  slug="$(printf '%s' "$slug" \
    | tr '[:upper:]' '[:lower:]' \
    | sed -e 's/[ _]\+/-/g' -e 's/[^a-z0-9-]//g' -e 's/-\{2,\}/-/g' -e 's/^-//' -e 's/-$//')"

  for w in 800 1400 2000; do
    "$IM" "$src" \
      -auto-orient \
      -resize "${w}x${w}>" \
      -strip \
      -set 'comment' '(c) Anupam Arohi' \
      -quality "$QUALITY" \
      -interlace Plane \
      "$OUT_DIR/${slug}-${w}.jpg"
  done

  # the canonical file is the same pixels as the 2000 variant
  cp "$OUT_DIR/${slug}-2000.jpg" "$OUT_DIR/${slug}.jpg"

  dims="$($IM_IDENTIFY -format '%wx%h' "$OUT_DIR/${slug}.jpg")"
  echo "$slug  ->  $dims"
  echo "    add to photos.js:  { file: \"images/${slug}.jpg\", width: ${dims%x*}, height: ${dims#*x}, ... }"
done

cat <<'NOTE'

Done. Remember:
  1. Add an entry to photos.js with the exact width and height printed above.
     A mismatch there is the usual cause of a subtly wrong-looking grid.
  2. Write a real alt description. Not "photo of".
NOTE
