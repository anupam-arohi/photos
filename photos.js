/* ============================================================================
   photos.js  ·  the single source of truth for this site
   ----------------------------------------------------------------------------
   Adding a photo is one edit, here, and nothing else.

     1.  ./resize.sh Originals/Sky/your-photo.jpg
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
   place     optional   "Espoo, Finland". EMPTY ON EVERY PHOTO BELOW: the EXIF
                        carried no location and I would only have been guessing.
                        Fill these in and they appear in the captions.
   date      optional   ISO "YYYY-MM-DD". Read from EXIF where it existed.
   tags      required   lowercase, used for the filter chips on the home page.
   series    optional   slug from SERIES below. A photo belongs to one series.
   alt       required   a real description for screen readers and for the day
                        the image fails to load. Never "photo of".
   settings  optional   read from EXIF. Sony bodies here did not record ISO.
   featured  optional   true on exactly one photo. Leads the grid and is used
                        as the social preview image.
   sig       optional   "white" (default), "dark" where the bottom-right corner
                        is bright, "none" where the image already carries a
                        burned-in copyright. Set from measured corner luminance
                        rather than by eye.
   src       optional   which file in Originals/ this came from. Not used by the
                        site, kept so you can find the full-resolution version.
   ========================================================================== */

window.SERIES = [
  {
    slug: "northern-lights",
    title: "Northern Lights",
    note: "Fifteen years of standing in cold fields in southern Finland, waiting. Most nights nothing comes. These are the nights something did.",
    accent: "var(--green)"
  },
  {
    slug: "halos-and-arcs",
    title: "Halos and Arcs",
    note: "Ice crystals and raindrops bending light into rings and bows. All of these were overhead and unannounced, which is most of the appeal.",
    accent: "var(--violet)"
  },
  {
    slug: "last-light",
    title: "Last Light",
    note: "The half hour when the sun is nearly gone and the sky stops being a background. Mostly shot from the same few shorelines.",
    accent: "var(--amber)"
  },
  {
    slug: "birds",
    title: "Birds",
    note: "Swans, grebes, a goldeneye chick running flat out across a lake. Patience with a long lens, and a great deal of deleting.",
    accent: "var(--teal)"
  },
  {
    slug: "close-to-the-ground",
    title: "Close to the Ground",
    note: "Insects, flowers and one squirrel with both hands full. Shot at macro distances, usually within a few minutes of the front door.",
    accent: "var(--pink)"
  },
  {
    slug: "found-objects",
    title: "Found Objects",
    note: "Things already sitting where I found them. Sculptures, a cannon, someone's forgotten sunglasses on a boulder.",
    accent: "var(--muted)"
  }
];

window.PHOTOS = [
  /* ---------- Northern Lights ------------------------------------------- */
  {
    file: "images/green-arc.jpg",
    width: 2000, height: 1125,
    title: "Green Arc",
    place: "",
    date: "2023-02-26",
    tags: ["aurora", "sky", "winter"],
    series: "northern-lights",
    alt: "A green aurora arc curving across the sky above a snow-covered shoreline, a scatter of small house lights along the far edge of the bay.",
    settings: "31mm · f/1.5 · 1/2s · ISO 2000",
    src: "Sky/F8F4FCF1-2AD4-41AB-A863-73AB7D0D43EB.JPG"
  },
  {
    file: "images/rays-behind-a-bare-tree.jpg",
    width: 2000, height: 1125,
    title: "Rays Behind a Bare Tree",
    place: "",
    date: "2023-04-24",
    tags: ["aurora", "sky"],
    series: "northern-lights",
    alt: "Pink and green aurora rays filling the frame behind the bare, broken branches of a dead tree standing in snow.",
    settings: "26mm · f/1.5 · 1/2s · ISO 3200",
    src: "Sky/IMG_2673.jpeg"
  },
  {
    file: "images/violet-over-the-birch.jpg",
    width: 2000, height: 1125,
    title: "Violet Over the Birch",
    place: "",
    date: "2024-05-11",
    tags: ["aurora", "sky"],
    series: "northern-lights",
    alt: "Violet and magenta aurora flooding the whole sky above a bare birch, the tree lit from below so its branches glow pale gold.",
    settings: "26mm · f/1.5 · 1/2s · ISO 4000",
    featured: true,
    src: "Sky/IMG_7876.jpeg"
  },
  /* ---------- Halos and Arcs -------------------------------------------- */
  {
    file: "images/rainbow-over-the-block.jpg",
    width: 2000, height: 1500,
    title: "Rainbow Over the Block",
    place: "",
    date: "2020-07-08",
    tags: ["sky"],
    series: "halos-and-arcs",
    alt: "A full rainbow arc standing over a row of pale apartment buildings, an empty green bench in the foreground.",
    settings: "13mm · f/2.4 · 1/232s · ISO 20",
    src: "Sky/53D9404C-FF48-485E-87D9-998FEED700B1.JPG"
  },
  {
    file: "images/halo-over-the-ice.jpg",
    width: 2000, height: 1125,
    title: "Halo Over the Ice",
    place: "",
    date: "2021-03-31",
    tags: ["sky", "winter", "water"],
    series: "halos-and-arcs",
    alt: "A complete circular halo ringing the sun above a frozen bay, the ice pale and almost featureless below it.",
    settings: "13mm · f/2.4 · 1/5319s · ISO 25",
    src: "Sky/605724A0-14A0-4F51-B876-2FE4E3D4723C.JPG"
  },
  {
    file: "images/halo-through-birches.jpg",
    width: 2000, height: 1125,
    title: "Halo Through Birches",
    place: "",
    date: "2021-05-25",
    tags: ["sky"],
    series: "halos-and-arcs",
    alt: "A faint solar halo seen straight up through the crowns of two birch trees against a bright white sky.",
    settings: "13mm · f/2.4 · 1/11905s · ISO 32",
    src: "Sky/C4893548-F075-46A0-982F-448099850C5E.JPG"
  },
  /* ---------- Last Light ------------------------------------------------ */
  {
    file: "images/storm-front-over-the-sound.jpg",
    width: 2000, height: 1500,
    title: "Storm Front Over the Sound",
    place: "",
    date: "2020-05-20",
    tags: ["sky", "water"],
    series: "last-light",
    alt: "A dark blue storm front stretched right across the sky above a choppy sound, sunlight still reaching the water at the left edge.",
    settings: "13mm · f/2.4 · 1/444s · ISO 20",
    src: "Sky/5855C45F-008A-4CAF-B1A2-FA57E3782EB8.JPG"
  },
  {
    file: "images/orange-cloud.jpg",
    width: 2000, height: 1500,
    title: "Orange Cloud",
    place: "",
    date: "2020-07-13",
    tags: ["sky", "water"],
    series: "last-light",
    alt: "Heavy orange and grey cloud over a calm lake late in the evening, the same colour repeated on the water.",
    settings: "52mm · f/2 · 1/122s · ISO 64",
    src: "Sky/C82016AF-2CDF-452E-A02D-B095EE087F93.JPG"
  },
  {
    file: "images/walking-out-on-the-ice.jpg",
    width: 2000, height: 1125,
    title: "Walking Out on the Ice",
    place: "",
    date: "2021-01-16",
    tags: ["sky", "winter", "water"],
    series: "last-light",
    alt: "A lone figure and a dog crossing a wide frozen bay, low sun burning through thin cloud above the far treeline.",
    settings: "52mm · f/2 · 1/813s · ISO 20",
    src: "Sky/514F3EBA-F50B-40FE-92A9-FC8E8B070E6B.JPG"
  },
  {
    file: "images/glow-over-the-snowfield.jpg",
    width: 2000, height: 1125,
    title: "Glow Over the Snowfield",
    place: "",
    date: "2021-01-20",
    tags: ["sky", "winter"],
    series: "last-light",
    alt: "A faint band of light along the horizon over a snow-covered field at night, dry reeds catching what little light reaches the foreground.",
    sig: "dark",
    settings: "26mm · f/1.8 · 1/8s · ISO 500",
    src: "Sky/011BB8F4-57A3-469B-BC54-2934D83DEFBB.JPG"
  },
  {
    file: "images/sun-pillar-empty-marina.jpg",
    width: 2000, height: 1125,
    title: "Sun Pillar, Empty Marina",
    place: "",
    date: "2021-02-04",
    tags: ["sky", "winter", "water"],
    series: "last-light",
    alt: "A vertical pillar of light rising from a low orange sun over a snow-covered marina, the jetties stripped bare for winter.",
    settings: "52mm · f/2 · 1/695s · ISO 20",
    src: "Sky/2564D2E0-F983-436C-A6FB-73CD64146831.JPG"
  },
  {
    file: "images/rays-behind-a-cumulus.jpg",
    width: 2000, height: 1125,
    title: "Rays Behind a Cumulus",
    place: "",
    date: "2022-08-28",
    tags: ["sky", "water"],
    series: "last-light",
    alt: "Crepuscular rays fanning out from behind a tall cumulus cloud above a small wooded island.",
    settings: "26mm · f/1.5 · 1/11364s · ISO 50",
    src: "Sky/8755223F-A0C6-4C9E-9B79-B19A0C7DEF1B.JPG"
  },
  /* ---------- Birds ----------------------------------------------------- */
  {
    file: "images/goose-on-the-nest.jpg",
    width: 2000, height: 2000,
    title: "Goose on the Nest",
    place: "",
    date: "2015-05-04",
    tags: ["birds"],
    series: "birds",
    alt: "A Canada goose settled on a down-lined nest, four pale eggs just visible against the down beside her.",
    settings: "121mm · f/2.2 · 1/216s · ISO 32",
    src: "Nature/5A63938E-76C6-4505-AA04-1F972BAE409A.JPG"
  },
  {
    file: "images/swan-and-five-cygnets.jpg",
    width: 2000, height: 1125,
    title: "Swan and Five Cygnets",
    place: "",
    date: "2021-06-10",
    tags: ["birds", "water"],
    series: "birds",
    alt: "A mute swan on open water with five grey cygnets gathered close beside her at the edge of the reeds.",
    settings: "52mm · f/2 · 1/180s · ISO 20",
    src: "Nature/41C4B2B4-302C-44F2-9E64-1F5691C41081.JPG"
  },
  {
    file: "images/full-wingspan.jpg",
    width: 2000, height: 1125,
    title: "Full Wingspan",
    place: "",
    date: "2024-05-25",
    tags: ["birds", "water"],
    series: "birds",
    alt: "A mute swan standing up in shallow water with both wings fully extended, treeline and broken cloud behind.",
    settings: "26mm · f/1.5 · 1/1295s · ISO 50",
    src: "Nature/IMG_8171.jpeg"
  },
  {
    file: "images/wings-half-open.jpg",
    width: 2000, height: 1200,
    title: "Wings Half Open",
    place: "",
    date: "2026-03-27",
    tags: ["birds", "water"],
    series: "birds",
    alt: "A mute swan rising out of the water with its wings half opened, ripples spreading away from it.",
    settings: "60mm · f/5.6 · 1/4000s · ISO 400",
    src: "Nature/DSC00216.JPG"
  },
  {
    file: "images/great-tit.jpg",
    width: 2000, height: 1342,
    title: "Great Tit",
    place: "",
    date: "2026-06-04",
    tags: ["birds"],
    series: "birds",
    alt: "A great tit gripping a bare twig with its head turned to one side, the background dissolved to soft green.",
    settings: "200mm · f/4 · 1/250s · ISO 8000",
    src: "Nature/Greytit.jpeg"
  },
  {
    file: "images/cygnet-riding-along.jpg",
    width: 2000, height: 1266,
    title: "Cygnet Riding Along",
    place: "",
    date: "2026-06-07",
    tags: ["birds", "water"],
    series: "birds",
    alt: "A mute swan swimming on dark water with a single cygnet tucked up on her back between her folded wings.",
    settings: "200mm · f/4 · 1/1250s · ISO 100",
    src: "Nature/CygnetsWithMom 3.jpg"
  },
  {
    file: "images/grebe-with-a-fish.jpg",
    width: 2000, height: 1545,
    title: "Grebe With a Fish",
    place: "",
    date: "2026-06-10",
    tags: ["birds", "water"],
    series: "birds",
    alt: "A great crested grebe surfacing with a small silver fish held crosswise in its bill.",
    settings: "200mm · f/4 · 1/1250s · ISO 125",
    src: "Nature/SilkiUikku.jpeg"
  },
  {
    file: "images/at-the-nest-box.jpg",
    width: 2000, height: 1521,
    title: "At the Nest Box",
    place: "",
    date: "2026-06-10",
    tags: ["birds"],
    series: "birds",
    alt: "A sparrow clinging to the side of a blue wooden nest box, sunlit leaves and bright sky behind.",
    sig: "dark",
    settings: "200mm · f/4 · 1/125s · ISO 125",
    src: "Nature/Sparrow 3.jpeg"
  },
  {
    file: "images/green-neck.jpg",
    width: 2000, height: 1397,
    title: "Green Neck",
    place: "",
    date: "2026-06-14",
    tags: ["birds"],
    series: "birds",
    alt: "A feral pigeon in profile, the iridescent green and purple of its neck catching the light.",
    settings: "190mm · f/4 · 1/200s · ISO 100",
    src: "Nature/pigeon.jpg"
  },
  {
    file: "images/grebe-and-chick.jpg",
    width: 2000, height: 1224,
    title: "Grebe and Chick",
    place: "",
    date: "2026-06-21",
    tags: ["birds", "water"],
    series: "birds",
    alt: "An adult great crested grebe swimming beside its striped chick on flat grey water.",
    settings: "400mm · f/5.6 · 1/400s · ISO 500",
    src: "Nature/Great Crested Grebe chick 2.jpg"
  },
  {
    file: "images/oystercatcher.jpg",
    width: 2000, height: 1401,
    title: "Oystercatcher",
    place: "",
    date: "2026-06-22",
    tags: ["birds"],
    series: "birds",
    alt: "An oystercatcher standing on dark green grass, its long orange bill bright against a black and white body.",
    settings: "400mm · f/5.6 · 1/400s · ISO 1250",
    sig: "none",
    src: "Nature/MeriHarakka.jpg"
  },
  {
    file: "images/running-on-water.jpg",
    width: 2000, height: 1170,
    title: "Running on Water",
    place: "",
    date: "2026-06-23",
    tags: ["birds", "water"],
    series: "birds",
    alt: "A goldeneye duckling sprinting flat out across the surface of a lake, wings held out, a thin wake behind it.",
    sig: "dark",
    settings: "400mm · f/5.6 · 1/400s · ISO 500",
    src: "Nature/TelkkaChickRunning-2b.jpg"
  },
  /* ---------- Close to the Ground --------------------------------------- */
  {
    file: "images/robber-fly.jpg",
    width: 2000, height: 1768,
    title: "Robber Fly",
    place: "",
    date: "2026-06-16",
    tags: ["insects"],
    series: "close-to-the-ground",
    alt: "A bristly robber fly standing on the edge of a green leaf, facing the camera, deep shadow behind it.",
    settings: "200mm · f/4 · 1/500s · ISO 800",
    src: "Nature/Bug.jpg"
  },
  {
    file: "images/bumblebee-in-the-lupines.jpg",
    width: 2000, height: 1574,
    title: "Bumblebee in the Lupines",
    place: "",
    date: "2026-06-16",
    tags: ["insects", "flowers"],
    series: "close-to-the-ground",
    alt: "A bumblebee working its way up a spike of purple lupine flowers, more lupines out of focus behind.",
    settings: "200mm · f/4 · 1/320s · ISO 100",
    src: "Nature/BlueFlowersWithBee3.jpg"
  },
  {
    file: "images/harebells.jpg",
    width: 1229, height: 2000,
    title: "Harebells",
    place: "",
    date: "2026-06-16",
    tags: ["flowers"],
    series: "close-to-the-ground",
    alt: "Three pale violet harebell flowers on thin stems, held against soft green foliage.",
    settings: "200mm · f/4 · 1/320s · ISO 100",
    src: "Nature/BlueFlowers.jpg"
  },
  {
    file: "images/both-hands-full.jpg",
    width: 2000, height: 1840,
    title: "Both Hands Full",
    place: "",
    date: "2026-06-21",
    tags: ["animals"],
    series: "close-to-the-ground",
    alt: "A red squirrel sitting up on gravel holding food in both front paws, ear tufts up, cheeks working.",
    settings: "400mm · f/5.6 · 1/250s · ISO 2000",
    src: "Nature/Squirrel 3.jpg"
  },
  {
    file: "images/hornet-moth.jpg",
    width: 1796, height: 2000,
    title: "Hornet Moth",
    place: "",
    date: "2026-06-26",
    tags: ["insects"],
    series: "close-to-the-ground",
    alt: "A yellow and black hornet moth at rest on a bright green serrated leaf, its wings clear and finely veined.",
    settings: "100mm · f/5.6 · 1/100s · ISO 8000",
    src: "Nature/Moth 2.jpg"
  },
  {
    file: "images/two-fuchsias.jpg",
    width: 1336, height: 2000,
    title: "Two Fuchsias",
    place: "",
    date: "2026-06-26",
    tags: ["flowers"],
    series: "close-to-the-ground",
    alt: "Two fuchsia flowers hanging from one stem, deep pink outer petals over a purple inner skirt, plain grey behind.",
    settings: "100mm · f/8 · 1/160s · ISO 2500",
    src: "Nature/PinkPurpleFlowers.jpg"
  },
  {
    file: "images/thistle-fully-open.jpg",
    width: 1395, height: 2000,
    title: "Thistle, Fully Open",
    place: "",
    date: "2026-07-26",
    tags: ["flowers"],
    series: "close-to-the-ground",
    alt: "A single magenta thistle flower fully open at the top of its stem, surrounded by tangled leaves.",
    sig: "dark",
    settings: "48mm · f/1.8 · 1/60s · ISO 200",
    src: "Nature/IMG_5869.jpeg"
  },
  /* ---------- Found Objects --------------------------------------------- */
  {
    file: "images/driftwood-totem.jpg",
    width: 1930, height: 2000,
    title: "Driftwood Totem",
    place: "",
    tags: ["objects"],
    series: "found-objects",
    alt: "A hanging mobile of stacked driftwood pieces turning slowly among birch trunks and blue sky.",
    src: "Objects/Totems.jpeg"
  },
  {
    file: "images/blue-glass.jpg",
    width: 2000, height: 1336,
    title: "Blue Glass",
    place: "",
    tags: ["objects"],
    series: "found-objects",
    alt: "A tall glass of bright blue drink on a coaster on a dark table, a Rubik's cube out of focus behind it.",
    src: "Objects/BlueGlass.jpg"
  },
  {
    file: "images/cannon-facing-the-sea.jpg",
    width: 2000, height: 1125,
    title: "Cannon, Facing the Sea",
    place: "",
    date: "2026-04-03",
    tags: ["objects"],
    series: "found-objects",
    alt: "An old cannon on a wooden carriage set in low green planting above a busy beach promenade.",
    settings: "24mm · f/1.8 · 1/4975s · ISO 80",
    src: "Objects/IMG_4632.jpeg"
  },
  {
    file: "images/two-hands-reaching.jpg",
    width: 2000, height: 1307,
    title: "Two Hands, Reaching",
    place: "",
    date: "2026-05-14",
    tags: ["objects", "sculpture"],
    series: "found-objects",
    alt: "Two large silver sculpted hands rising out of the ground in a park, fingers open against a blue sky.",
    settings: "28mm · f/4 · 1/500s · ISO 50",
    src: "Objects/Hands.jpeg"
  },
  {
    file: "images/left-on-a-boulder.jpg",
    width: 2000, height: 1221,
    title: "Left on a Boulder",
    place: "",
    date: "2026-05-14",
    tags: ["objects"],
    series: "found-objects",
    alt: "A pair of blue mirrored sunglasses left on top of a large speckled boulder beside a forest path.",
    settings: "28mm · f/4 · 1/80s · ISO 100",
    src: "Objects/SunGlasses.jpg"
  },
  {
    file: "images/granite-insect.jpg",
    width: 1125, height: 2000,
    title: "Granite Insect",
    place: "",
    date: "2026-07-18",
    tags: ["objects", "sculpture"],
    series: "found-objects",
    alt: "A carved granite figure with two thin antennae standing on a plinth in front of a green wooden wall.",
    settings: "48mm · f/1.8 · 1/1715s · ISO 64",
    src: "Objects/IMG_5816.jpeg"
  },
  {
    file: "images/bowl-of-cherries.jpg",
    width: 2000, height: 1346,
    title: "Bowl of Cherries",
    place: "",
    date: "2026-07-21",
    tags: ["objects"],
    series: "found-objects",
    alt: "Dark cherries piled in a white bowl, pale kitchen shapes blurred out behind them.",
    settings: "133mm · f/2.8 · 1/2s · ISO 100",
    src: "Objects/Cherries.jpg"
  }
];
