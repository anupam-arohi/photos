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

# A fixed quality gives wildly different file sizes: a smooth aurora sky lands
# at 40KB while silver sculpture against foliage hits 900KB at the same setting.
# So budget bytes per width instead and step the quality down until it fits.
# Keep these under the pre-commit hook's 600KB ceiling.
BUDGET_800=120       # KB
BUDGET_1400=280
BUDGET_2000=500
QUALITY_STEPS="82 78 74 70 66"

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
    case "$w" in
      800)  budget=$BUDGET_800  ;;
      1400) budget=$BUDGET_1400 ;;
      2000) budget=$BUDGET_2000 ;;
    esac
    dest="$OUT_DIR/${slug}-${w}.jpg"

    for q in $QUALITY_STEPS; do
      "$IM" "$src" \
        -auto-orient \
        -resize "${w}x${w}>" \
        -strip \
        -set 'comment' '(c) Anupam Arohi' \
        -sampling-factor 4:2:0 \
        -define jpeg:dct-method=float \
        -quality "$q" \
        -interlace Plane \
        "$dest"
      kb=$(( ( $(wc -c < "$dest") + 1023 ) / 1024 ))
      [ "$kb" -le "$budget" ] && break
    done
    # $q and $kb hold the setting that was actually kept
    if [ "$kb" -gt "$budget" ]; then
      echo "    note: ${slug}-${w}.jpg is ${kb}KB at q${q}, over the ${budget}KB budget." >&2
      echo "          Very detailed frame. Crop it or accept the weight." >&2
    elif [ "$q" != "${QUALITY_STEPS%% *}" ]; then
      echo "    ${slug}-${w}.jpg  ${kb}KB at q${q} (stepped down to fit ${budget}KB)"
    fi
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
