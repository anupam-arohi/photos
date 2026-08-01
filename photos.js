/* ============================================================================
   photos.js  ·  the single source of truth for this site
   ----------------------------------------------------------------------------
   Adding a photo is one edit, here, and nothing else.

     1.  ./resize.sh ~/Pictures/export/your-photo.jpg
     2.  paste the entry the script prints into PHOTOS below
     3.  fill in title, place, date, tags, series and a real alt description

   Field reference
   ---------------
   file      required   path to the canonical 2000px file, from the repo root.
                        The -800 / -1400 / -2000 srcset variants are derived
                        from this name automatically. Do not list them here.
   width     required   pixel width  of that file. resize.sh prints both.
   height    required   pixel height of that file.
                        These two must match the real file. If they drift, the
                        grid goes subtly wrong and it is very hard to spot.
   title     required   shown in the caption and the lightbox.
   place     optional   "Espoo, Finland"
   date      optional   ISO "YYYY-MM-DD". Drives the default newest-first sort.
   tags      required   lowercase, used for the filter chips on the home page.
   series    optional   slug from SERIES below. A photo can belong to one series.
   alt       required   a real description for screen readers and for the day
                        the image fails to load. Never "photo of".
   settings  optional   "24mm · f/1.8 · 4s · ISO 1600". Rendered only if present.
   featured  optional   true on exactly one photo. Used for the social preview.
   sig       optional   "white" (default) or "dark". Use "dark" on bright images
                        where the white signature would disappear.
   ========================================================================== */

window.SERIES = [
  {
    slug: "northern-lights",
    title: "Northern Lights",
    note: "Fifteen years of standing in cold fields in southern Finland, waiting. Most nights nothing comes. These are the nights something did.",
    accent: "var(--green)"
  },
  {
    slug: "still-water",
    title: "Still Water",
    note: "Lakes and shorelines in the few minutes when the wind drops and the surface stops arguing with the sky.",
    accent: "var(--teal)"
  },
  {
    slug: "small-things",
    title: "Small Things",
    note: "Objects photographed at home, mostly on a windowsill, mostly because the light was good and I had five minutes.",
    accent: "var(--amber)"
  }
];

window.PHOTOS = [
  /* ---------- Northern Lights ------------------------------------------- */
  {
    /* REPLACE: placeholder image */
    file: "images/midnight-arc.jpg",
    width: 2000, height: 1333,
    title: "Midnight Arc",
    place: "Espoo, Finland",
    date: "2024-03-12",
    tags: ["sky", "winter"],
    series: "northern-lights",
    alt: "A low green aurora arc stretched across the horizon above a frozen bay, a single bare birch silhouetted at the left edge.",
    settings: "24mm · f/1.8 · 4s · ISO 1600",
    featured: true
  },
  {
    /* REPLACE: placeholder image */
    file: "images/substorm-over-bay.jpg",
    width: 2000, height: 1125,
    title: "Substorm Over the Bay",
    place: "Kirkkonummi, Finland",
    date: "2024-02-27",
    tags: ["sky", "winter"],
    series: "northern-lights",
    alt: "Bright green aurora rays fanning upward from the horizon over open water, reflected as broken streaks on the surface.",
    settings: "20mm · f/2.0 · 2s · ISO 3200"
  },
  {
    /* REPLACE: placeholder image */
    file: "images/violet-crown.jpg",
    width: 1600, height: 2000,
    title: "Violet Crown",
    place: "Nuuksio, Finland",
    date: "2023-11-05",
    tags: ["sky"],
    series: "northern-lights",
    alt: "Violet and pink aurora curtains rising vertically overhead, framed by dark pine tops at the bottom of the frame.",
    settings: "14mm · f/2.8 · 3s · ISO 3200"
  },

  /* ---------- Still Water ----------------------------------------------- */
  {
    /* REPLACE: placeholder image */
    file: "images/morning-mirror.jpg",
    width: 2000, height: 1333,
    title: "Morning Mirror",
    place: "Bodom, Espoo",
    date: "2025-06-18",
    tags: ["nature", "water"],
    series: "still-water",
    alt: "A pale lake at sunrise, the far treeline doubled in a perfectly flat reflection, thin mist sitting on the surface.",
    settings: "50mm · f/8 · 1/125s · ISO 100",
    sig: "dark"
  },
  {
    /* REPLACE: placeholder image */
    file: "images/reeds-at-dusk.jpg",
    width: 1600, height: 2000,
    title: "Reeds at Dusk",
    place: "Laajalahti, Espoo",
    date: "2025-08-02",
    tags: ["nature", "water"],
    series: "still-water",
    alt: "Backlit reeds standing in shallow water against a warm amber sky, their stems repeated as dark verticals in the reflection.",
    settings: "85mm · f/2.8 · 1/400s · ISO 200"
  },
  {
    /* REPLACE: placeholder image */
    file: "images/ice-edge.jpg",
    width: 2000, height: 1125,
    title: "Ice Edge",
    place: "Suomenlinna, Helsinki",
    date: "2025-01-24",
    tags: ["nature", "water", "winter"],
    series: "still-water",
    alt: "The ragged boundary between sea ice and open water, teal water on the right, textured white ice filling the left half.",
    settings: "35mm · f/5.6 · 1/250s · ISO 100"
  },

  /* ---------- Small Things ---------------------------------------------- */
  {
    /* REPLACE: placeholder image */
    file: "images/brass-compass.jpg",
    width: 1600, height: 1600,
    title: "Brass Compass",
    place: "Espoo, Finland",
    date: "2025-04-09",
    tags: ["objects"],
    series: "small-things",
    alt: "A worn brass pocket compass lying open on dark wood, low side light picking out scratches on the lid.",
    settings: "90mm macro · f/4 · 1/60s · ISO 400"
  },
  {
    /* REPLACE: placeholder image */
    file: "images/two-cups.jpg",
    width: 1600, height: 2000,
    title: "Two Cups",
    place: "Espoo, Finland",
    date: "2025-05-21",
    tags: ["objects"],
    series: "small-things",
    alt: "Two grey stoneware cups on a windowsill, one tipped slightly towards the other, soft shadows falling to the right.",
    settings: "50mm · f/2.0 · 1/125s · ISO 320"
  },
  {
    /* REPLACE: placeholder image */
    file: "images/frost-on-glass.jpg",
    width: 2000, height: 1333,
    title: "Frost on Glass",
    place: "Espoo, Finland",
    date: "2025-02-11",
    tags: ["objects", "winter"],
    series: "small-things",
    alt: "Feathered frost crystals spreading across a pale window pane, the blurred outline of a house visible beyond.",
    settings: "90mm macro · f/5.6 · 1/80s · ISO 200",
    sig: "dark"
  }
];
