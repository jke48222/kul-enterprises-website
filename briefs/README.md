# The KUL Multiverse — Phase 1 Briefs

20 variants. Styles 01–08 are each built **twice from the same brief** — build A loads the
`impeccable` skill, build B loads `design-taste-frontend` (taste) — displayed left/right in the
gallery. Styles 09–12 are `nt-site-mirror` recreations of four confirmed reference sites,
reskinned to KUL. Builders do not look at sibling builds.

## Page contract (every variant = one signature page)

1. **Nav** — Services, Safety, Request a Quote, Contact reachable in one click, always.
2. **Hero** — headline + primary CTA "Request a Freight Quote" + secondary "Become a Driver".
3. **Trust strip** — USDOT 7638788 · MC 66389691 · Licensed & Insured · Loganville, GA ·
   Nationwide Service · 24/7 Dispatch.
4. **Services teaser** — Power Only · Dry Van · Reefer · Dedicated · Regional ·
   Over-the-Road · Expedited.
5. **Journey teaser** — at least one of Mark's real photos + one story line.
6. **Vision line** — 50 tractors by end of 2029, framed honestly (growing with intention).
7. **CTA band + footer** — dispatch@kulenterprises.com · 678-972-1148.

Mobile-first. Fast. The page should be judgeable in a 90-second scroll.

## Brand constants

- KUL Enterprises LLC — "Strength in Motion. Built on Integrity. Driven by Safety."
- Gold `#D4AF37` · Blacks `#0B0B0B` / `#1F1F1F` / `#2E2E2E` · Gray `#6E6E6E` · White `#FFFFFF`.
  Earth-tone accents permitted where a brief says so (blessed in Mark's original palette).
- **Lion is the only permanent mark.** The Doctor Bird NEVER appears in page designs — it is
  reserved exclusively for the future intro animation.
- Bebas Neue + Montserrat are Mark's brand-board picks, but exploration treats type as a
  per-style variable. Briefs may propose different faces; the winning style decides.
- **Truth law:** never fabricate testimonials, client logos, fleet counts, or stats. KUL is a
  one-truck carrier building toward 50 — honesty IS the trust strategy.
- **Motion law:** `prefers-reduced-motion` fallback for everything; native scroll preserved
  (scroll-LINKED is fine, scroll-JACKING is banned); 60fps or it ships simpler.

## Assets available now (gitignored inbox — copy what you need into the app)

- Journey photo pool — ALL FIVE served slots are genuine Mark photos. **FILENAMES DO NOT MATCH
  THEIR SUBJECTS** (verified pixel-by-pixel Jul 26 — three of the five names are rotated).
  Trust this table, never the filename:

  | Served path | What the pixels ACTUALLY show | Mark's blueprint image | Its assigned meaning |
  |---|---|---|---|
  | `/assets/journey/cliffs.jpg` | flat-topped mesa/bluff over turquoise water | #1 Rocky Cliffs Over Blue Water | exploration, experience, the journey |
  | `/assets/journey/wave.jpg` | **turquoise creek/river through dense green forest** | #2 Blue River Through the Forest | calm, patience, consistency, dependability |
  | `/assets/journey/tree.jpg` | big spreading tree, green valley, hills | #3 Large Tree and Open Landscape | roots, growth, legacy, long-term vision |
  | `/assets/journey/desert.jpg` | **sandstone headland + breaking ocean wave on sand** | #4 Ocean Waves Against the Rocks | movement, power, forward progress |
  | `/assets/journey/river.jpg` | **tall sandstone rock formations over empty sand** | #5 Desert Rock Formation | strength, foundation, stability, built to last |

  So: `river.jpg` is the DESERT subject, `wave.jpg` is the RIVER subject, `desert.jpg` is the WAVE
  subject — a three-way rotation. **Write alt text and pick photos from the pixels column, not the
  name.** The two sandstone/sand siblings are `river.jpg` + `desert.jpg` — avoid featuring both
  prominently on one page (this supersedes the earlier wave+desert note).
- Brand/livery boards (raster, AI — direction only, NEVER a page photo):
  `assets-inbox/New Chat.png` (company/palette board), `assets-inbox/6AAF8586-*.jpeg` +
  `IMG_6646.PNG` (livery/logo boards), `assets-inbox/F18C0F6D-*.png` (loading-animation storyboard).
- Pending: ~50 more journey photos, founder headshot, ~8 dashcam clips (~2 hrs). Until the
  dashcam clips land, kinetic styles may use a tastefully graded placeholder clip clearly
  marked `PLACEHOLDER` in code.

## Brand kit (landed Jul 24 — use through everything)

Source files: `assets-inbox/brand-kit/` (full-res, plus trailer wraps / tractor graphics /
door decals for later livery mockups). Web-ready set served at `/assets/brand/`:

| Asset | Use on | Notes |
|---|---|---|
| `/assets/brand/logo-full-transparent.png` | light & mid grounds | true-alpha full-color lockup; its wordmark/tagline lines are DARK — illegible on dark grounds |
| `/assets/brand/logo-gold-t.png` | dark grounds | keyed floating gold lockup (edges cut against black — keep on dark) |
| `/assets/brand/logo-white-t.png` | dark grounds | keyed floating white mono lockup |
| `/assets/brand/logo-black-t.png` | light grounds | keyed floating black mono lockup |
| `/assets/brand/logo-full-dark.png` / `logo-full-light.png` | contained plates | opaque backgrounds — use only inside a matching plate/card |
| `/assets/brand/lion.png` | plated badge only | the "transparent" lion icon has a baked tan vignette — do NOT float it on arbitrary grounds |
| `/assets/brand/lion-black.png` | plated badge only | opaque |

### Vector master landed (Jul 24) — now the preferred marks

True vectors (thousands of real paths, zero embedded raster) rasterized to clean transparent PNGs:

| Asset | Use | Notes |
|---|---|---|
| `/assets/brand/lion-clean.png` | **preferred lion, any ground** | true-transparent gold lion head, NO baked vignette — this replaces `lion.png` for floating use |
| `/assets/brand/lion.svg` | crisp scalable lion | vector-lite (~7.9k paths); use when you need resolution-independence |
| `/assets/brand/logo-vector.png` | light grounds | true-alpha full-color lockup, crisp |
| `/assets/brand/logo.svg` | crisp scalable lockup | vector-lite |

Prefer `lion-clean.png` / `logo-vector.png` over the older keyed rasters. Logo-gold-t / white-t /
black-t (keyed lockups) remain valid for their grounds. Logos are detailed illustration — use at
restrained nav/footer sizes (≤ 200px tall in-page), never as a hero background wash.

### Bird kit (Jul 24) — INTRO ANIMATION ONLY, never on a page

`/assets/bird/bird-rest.png` `bird-up.png` `bird-down.png` (transparent, 640px) + matching
`.svg` vector-lites. Three poses of the Jamaican Doctor Bird (gold/black, streamer tail) for
the opening sequence's flight + wing-flap. **HARD BRAND LAW: the bird appears exactly once, in
the intro animation, then exits forever. It must NEVER appear in any of the 20 page variants —
not in nav, hero, footer, background, or decoration.** The lion is the only permanent page mark.

## Styles 09–12 (mirror leg) — confirmed

Targets proposed: volvotrucks.com · apple.com (flagship product page) · macktrucks.com ·
rivian.com. Recreate the bones (IA, section rhythm, interaction patterns), reskin to KUL
brand constants, swap all content to KUL's real content. Mirror fidelity serves the layout;
the brand serves KUL.
