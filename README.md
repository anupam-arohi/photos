# photos

Photographs by Anupam Arohi. Live at **https://anupam-arohi.github.io/photos/**

Static, hand-built, no framework and no build step. Every page opens correctly
straight from disk, and will still open in fifteen years. Visual language is
copied from [the aurora guide](https://github.com/anupam-arohi/auroras) so the
two sites read as one body of work.

```
index.html              home: whole collection, tag filters, lightbox
series/index.html       series index
series/<slug>.html      one page per series
photos.js               ALL photo metadata. The only file you edit to publish.
gallery.css             shared styles
gallery.js              grid rendering, filtering, lightbox
resize.sh               makes web-ready sizes from a full-resolution original
images/                 web-ready JPGs, three widths each
images/signature/       signature overlays, white and dark
images/_originals/      your full-res sources (gitignored)
.nojekyll               tells GitHub Pages to serve files as-is
```

---

## Adding a photo

Two commands and one paste.

```bash
./resize.sh ~/Pictures/export/midnight-arc.jpg
```

That writes `images/midnight-arc.jpg` plus `-800`, `-1400` and `-2000`
variants, and prints the exact width and height. Then add one entry to the
`PHOTOS` array in **`photos.js`**:

```js
{
  file: "images/midnight-arc.jpg",
  width: 2000, height: 1333,
  title: "Midnight Arc",
  place: "Espoo, Finland",
  date: "2024-03-12",
  tags: ["sky", "winter"],
  series: "northern-lights",
  alt: "A low green aurora arc above a frozen bay, one bare birch at the left edge.",
  settings: "24mm · f/1.8 · 4s · ISO 1600"
}
```

That is the whole job. The home grid, the tag chips, the series page and the
lightbox all read from this array. Nothing else needs touching.

Two things that matter more than they look:

- **`width` and `height` must match the real file.** If they drift, the grid
  goes subtly wrong and it is genuinely hard to spot. `resize.sh` prints the
  correct values precisely so you never have to guess.
- **Write a real `alt`.** It is what a screen reader announces and what shows
  when the image fails to load. Describe the photograph, not the file.

Optional fields: `settings`, `featured` (one photo, drives the social preview
image), and `sig: "dark"`.

ImageMagick is the only dependency:

```bash
brew install imagemagick
```

---

## Adding a series

1. Add an entry to `SERIES` at the top of `photos.js`:

   ```js
   { slug: "long-exposures", title: "Long Exposures", note: "One or two sentences.", accent: "var(--violet)" }
   ```

2. Copy an existing page, for example `series/still-water.html`, to
   `series/long-exposures.html`, then update: `<title>`, the description and
   Open Graph tags, the canonical URL, the `og:image`, the kicker, the `<h1>`,
   the intro paragraph, and `data-series="long-exposures"` on the gallery div.

3. Set `series: "long-exposures"` on the relevant photos in `PHOTOS`.

The series index picks the new set up automatically, using the newest photo in
it as the cover.

> The intro note lives in **both** `photos.js` and the series page HTML. That is
> deliberate: the HTML copy is what crawlers and no-JS visitors see. If you
> reword one, reword the other.

---

## The signature

Two files in `images/signature/`, both 400 × 121 with transparency:

| file                  | use on                                        |
| --------------------- | --------------------------------------------- |
| `signature-white.png` | dark photographs. This is the default.        |
| `signature-dark.png`  | bright photographs. Set `sig: "dark"`.        |

It is placed by CSS, bottom-right, at 18% of the image width capped to 180px,
72% opacity rising to 90% on hover. To change the look, edit the `.sig` rule in
`gallery.css` in one place and every photo follows.

To swap in a different signature, replace those two PNGs. Keep them roughly
3.3:1 and transparent, or adjust `.sig` to suit.

**Be clear-eyed about what this does.** A CSS overlay is presentation only. The
underlying JPG is a plain file and anyone can save it. There are deliberately no
right-click blockers here, because they irritate real visitors and stop nobody.
If a photograph genuinely must not be reused, burn the signature into the pixels
with an ImageMagick `-composite` step, and accept that even that only raises the
effort a little.

---

## Local preview

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Opening `index.html` by double-clicking also works.

---

## GitHub Pages

Settings → Pages → **Source: Deploy from a branch**, Branch **`main`**,
folder **`/ (root)`**. Save. First build takes a minute or two.

---

© Anupam Arohi. All rights reserved.
