# photos

Photographs by Anupam Arohi. Live at **https://anupam-arohi.github.io/photos/**

Static, hand-built, no framework and no build step. Every page opens correctly
straight from disk, and will still open in fifteen years. Visual language is
copied from [the aurora guide](https://github.com/anupam-arohi/auroras) so the
two sites read as one body of work.

38 photographs in six series.

```
index.html              home: whole collection, tag filters, lightbox
series/index.html       series index
series/<slug>.html      one page per series (six of them)
photos.js               ALL photo metadata. The only file you edit to publish.
gallery.css             shared styles
gallery.js              grid rendering, filtering, lightbox
resize.sh               makes web-ready sizes from a full-resolution original
images/                 web-ready JPGs, three widths each
images/signature/       signature overlays, white and dark
Originals/              your full-res sources (gitignored, stays local)
.nojekyll               tells GitHub Pages to serve files as-is
```

---

## Adding a photo

Two commands and one paste.

```bash
./resize.sh Originals/Sky/IMG_7876.jpeg
```

That writes `images/img-7876.jpg` plus `-800`, `-1400` and `-2000` variants,
and prints the exact width and height. Rename them if the slug is ugly. Then add
one entry to the `PHOTOS` array in **`photos.js`**:

```js
{
  file: "images/violet-over-the-birch.jpg",
  width: 2000, height: 1125,
  title: "Violet Over the Birch",
  place: "Espoo, Finland",
  date: "2024-05-11",
  tags: ["aurora", "sky"],
  series: "northern-lights",
  alt: "Violet and magenta aurora flooding the whole sky above a bare birch.",
  settings: "26mm · f/1.5 · 1/2s · ISO 4000"
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

Optional fields: `settings` (read from EXIF), `featured` (one photo; it leads the
grid and becomes the social preview image), `sig`, and `src` (which file in
`Originals/` it came from, so you can find the full-resolution version again).

**`place` is empty on every photo right now.** The EXIF carried no location and
guessing would have been worse than leaving it blank. Fill them in and they
appear in the captions automatically.

ImageMagick is the only dependency:

```bash
brew install imagemagick
```

### On file sizes

`resize.sh` targets bytes, not a fixed quality. A fixed quality setting gives
wildly inconsistent results: a smooth aurora sky lands at 40KB where silver
sculpture against foliage hits 900KB at the identical setting. So each width has
a budget and the script steps quality down from 82 until the file fits.

| width | budget | typical |
| ----- | ------ | ------- |
| 800   | 120KB  | 65KB    |
| 1400  | 280KB  | 160KB   |
| 2000  | 500KB  | 295KB   |

It tells you when it stepped down, and warns if a frame is so detailed it misses
the budget even at quality 66. Six of the current 38 needed stepping; the most
compressed is a nesting goose at quality 66, and side by side against a quality
95 reference the difference is not visible at display size.

Browsers loading the home grid pick the 800px variants, so the whole page is
about 2.4MB across 38 lazy-loaded images. The larger variants only download when
you open the lightbox.

---

## Adding a series

1. Add an entry to `SERIES` at the top of `photos.js`:

   ```js
   { slug: "long-exposures", title: "Long Exposures", note: "One or two sentences.", accent: "var(--violet)" }
   ```

2. Copy an existing page, for example `series/last-light.html`, to
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

Set per photo with the `sig` field:

| value            | effect                                                     |
| ---------------- | ---------------------------------------------------------- |
| omitted          | white signature. The default, right for most photographs.  |
| `sig: "dark"`    | dark signature, for bright photographs.                    |
| `sig: "none"`    | no overlay, for images that already carry a burned-in one.  |

The two PNGs in `images/signature/` are both 400 × 121 with transparency.

`Oystercatcher` uses `sig: "none"` because the original already has a
`© Anupam Arohi` watermark burned into the bottom-left corner.

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

## Keeping originals out of the repo

Two layers, because `.gitignore` alone is not a guarantee.

**`.gitignore`** covers `Originals/` at any depth and capitalisation, the old
`images/_originals/` convention, every camera raw format, TIFF, PSD and editor
sidecars.

**`hooks/pre-commit`** is the actual backstop. `.gitignore` does not survive
`git add -f`, and it does not help if a 14MB original gets dropped straight into
`images/`. The hook refuses any staged file that is from an originals folder, is
a raw or layered format, or exceeds 600KB.

Git hooks are not themselves versioned, so install it once per clone:

```bash
ln -sf ../../hooks/pre-commit .git/hooks/pre-commit
```

To bypass it deliberately: `git commit --no-verify`.

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
