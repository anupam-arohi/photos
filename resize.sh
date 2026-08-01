#!/usr/bin/env bash
# Generate web-ready, signed versions of a photo for the gallery.
#
#   ./resize.sh Originals/Sky/IMG_7876.jpeg
#   ./resize.sh Originals/Nature/*.jpg
#   ./resize.sh --sig=none Originals/Nature/MeriHarakka.jpg
#
# For each source file this writes into images/ :
#   <slug>.jpg        long edge 2000, the canonical file referenced in photos.js
#   <slug>-800.jpg    for phones
#   <slug>-1400.jpg   for tablets and normal desktop
#   <slug>-2000.jpg   for retina and large screens
#
# The signature is composited into the pixels, at the same fraction of the frame
# in every variant, so a downloaded or hotlinked file stays signed. This replaced
# a CSS overlay, which was presentation only and also sized inconsistently: a
# min-width floor meant every thumbnail rendered the signature at 24% of tile
# width instead of the intended 18%.
#
# Originals are never modified. Everything here is re-derivable: delete images/
# and run this again.
#
# Requires ImageMagick.  macOS:  brew install imagemagick

set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUT_DIR="$REPO/images"
SIG_DIR="$REPO/images/signature"

# --- signature geometry ------------------------------------------------------
SIG_FRAC=0.18        # signature width as a fraction of the image width
SIG_INSET=0.030      # inset as a fraction of the SHORTER edge, so the gap looks
                     # the same on a panorama and on a portrait
SIG_OPACITY=0.72
SIG_TONE_THRESHOLD=135   # mean luminance of the corner, 0-255. Above this the
                         # corner is too bright for the white signature.

# --- file size budgets -------------------------------------------------------
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
  IM="magick"; IM_IDENTIFY="magick identify"
elif command -v convert >/dev/null 2>&1; then
  IM="convert"; IM_IDENTIFY="identify"
else
  echo "ImageMagick not found. Install it with:  brew install imagemagick" >&2
  exit 1
fi

# --- arguments ---------------------------------------------------------------
FORCE_TONE=""        # "", "white", "dark" or "none"
ARGS=()
for a in "$@"; do
  case "$a" in
    --sig=none)  FORCE_TONE="none"  ;;
    --sig=white) FORCE_TONE="white" ;;
    --sig=dark)  FORCE_TONE="dark"  ;;
    --sig=*)     echo "unknown option: $a  (use --sig=none|white|dark)" >&2; exit 1 ;;
    -h|--help)   sed -n '2,25p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *)           ARGS+=("$a") ;;
  esac
done

if [ "${#ARGS[@]}" -eq 0 ]; then
  echo "usage: $(basename "$0") [--sig=none|white|dark] <source-image> [more...]" >&2
  exit 1
fi

for t in white dark; do
  [ -f "$SIG_DIR/signature-$t.png" ] || { echo "missing $SIG_DIR/signature-$t.png" >&2; exit 1; }
done

mkdir -p "$OUT_DIR"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# Mean luminance (0-255) of the region the signature will occupy.
corner_luminance() {
  local img="$1" iw ih sw sh x y
  iw=$($IM_IDENTIFY -format '%w' "$img"); ih=$($IM_IDENTIFY -format '%h' "$img")
  sw=$(awk -v w="$iw" -v f="$SIG_FRAC" 'BEGIN{printf "%d", w*f}')
  sh=$(awk -v s="$sw" 'BEGIN{printf "%d", s/3.31}')      # signature aspect ratio
  local inset_px
  inset_px=$(awk -v a="$iw" -v b="$ih" -v f="$SIG_INSET" 'BEGIN{m=(a<b?a:b); printf "%d", m*f}')
  x=$(( iw - sw - inset_px )); y=$(( ih - sh - inset_px ))
  [ "$x" -lt 0 ] && x=0; [ "$y" -lt 0 ] && y=0
  "$IM" "$img" -crop "${sw}x${sh}+${x}+${y}" +repage -colorspace Gray \
    -format '%[fx:int(mean*255)]' info:
}

# Build a signature PNG scaled for this image, with a soft halo so it survives
# whatever is underneath, then composite it bottom-right.
sign() {
  local img="$1" out="$2" tone="$3" iw ih sw inset_px shadow_colour
  iw=$($IM_IDENTIFY -format '%w' "$img"); ih=$($IM_IDENTIFY -format '%h' "$img")
  sw=$(awk -v w="$iw" -v f="$SIG_FRAC" 'BEGIN{printf "%d", w*f}')
  inset_px=$(awk -v a="$iw" -v b="$ih" -v f="$SIG_INSET" 'BEGIN{m=(a<b?a:b); printf "%d", m*f}')

  # white signature gets a dark halo, dark signature gets a light one
  if [ "$tone" = "dark" ]; then shadow_colour="white"; else shadow_colour="black"; fi

  "$IM" "$SIG_DIR/signature-$tone.png" \
    -resize "${sw}x" \
    \( +clone -background "$shadow_colour" -shadow "70x$(awk -v s="$sw" 'BEGIN{printf "%.1f", s/90}')+0+0" \) \
    +swap -background none -layers merge +repage \
    -alpha set -channel A -evaluate multiply "$SIG_OPACITY" +channel \
    "$TMP/sig.png"

  "$IM" "$img" "$TMP/sig.png" \
    -gravity southeast -geometry "+${inset_px}+${inset_px}" -composite \
    "$out"
}

for src in "${ARGS[@]}"; do
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

  # Decide the signature tone ONCE per photo, from a small probe render, and
  # reuse it for all three widths. Measuring per width was three times slower
  # and could in principle disagree between variants, which would look sloppy.
  if [ "$FORCE_TONE" = "none" ]; then
    tone="none"
  elif [ -n "$FORCE_TONE" ]; then
    tone="$FORCE_TONE"
  else
    "$IM" "$src" -auto-orient -resize "800x800>" -strip "$TMP/probe.png"
    lum=$(corner_luminance "$TMP/probe.png")
    if [ "$lum" -gt "$SIG_TONE_THRESHOLD" ]; then tone="dark"; else tone="white"; fi
  fi
  tone_used="$tone"

  for w in 800 1400 2000; do
    case "$w" in
      800)  budget=$BUDGET_800  ;;
      1400) budget=$BUDGET_1400 ;;
      2000) budget=$BUDGET_2000 ;;
    esac
    dest="$OUT_DIR/${slug}-${w}.jpg"

    # 1. resize to a lossless intermediate
    "$IM" "$src" -auto-orient -resize "${w}x${w}>" -strip "$TMP/resized.png"

    # 2. sign it, unless this photo already carries its own watermark
    if [ "$tone" = "none" ]; then
      cp "$TMP/resized.png" "$TMP/signed.png"
      marker="original"
    else
      sign "$TMP/resized.png" "$TMP/signed.png" "$tone"
      marker="burned-in"
    fi

    # 3. encode, stepping quality down until it fits the budget
    for q in $QUALITY_STEPS; do
      "$IM" "$TMP/signed.png" \
        -strip \
        -set 'comment' "(c) Anupam Arohi | signature: $marker" \
        -sampling-factor 4:2:0 \
        -define jpeg:dct-method=float \
        -quality "$q" \
        -interlace Plane \
        "$dest"
      kb=$(( ( $(wc -c < "$dest") + 1023 ) / 1024 ))
      [ "$kb" -le "$budget" ] && break
    done

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
  echo "$slug  ->  $dims  signature: $tone_used"
  echo "    add to photos.js:  { file: \"images/${slug}.jpg\", width: ${dims%x*}, height: ${dims#*x}, ... }"
done

cat <<'NOTE'

Done. Remember:
  1. Add an entry to photos.js with the exact width and height printed above.
     A mismatch there is the usual cause of a subtly wrong-looking grid.
  2. Write a real alt description. Not "photo of".

The signature is in the pixels now. If a photo already carries its own
watermark, re-run that one with --sig=none so it is not signed twice.
NOTE
