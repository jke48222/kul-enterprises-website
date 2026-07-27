# Style 13 — DISPATCH

**A new KUL version whose every design decision is sourced from the Mobbin MCP.**
No Dribbble refs. No design skills. No invented aesthetics. Every component below traces to a
specific Mobbin section, cited by ID. Builders must run their own Mobbin searches for their page
archetype **in addition to** the library in section 4, and cite what they used.

---

## Thesis (derived from the Mobbin evidence, not asserted)

The strongest logistics and industrial sites on Mobbin — Aurora, Zipline, T1 Energy, Rivian,
VanMoof, Savor — share one move: **they do not sell with adjectives.** They place one enormous
factual statement over one real photograph and hand you one small, confident control. Everything
else is a hairline table of verifiable facts.

This matches the north star already locked for this project in `project-docs/`:
**"Mercedes-Benz not Monster Energy."** Premium, minimal, cinematic, calm.

For a one-truck carrier whose entire trust strategy is honesty, that form is not just fashionable —
it is structurally correct. **The site is an operations document, not a brochure.**

### Note on the historical reference list
This project has previously referenced Terminal Industries, J.B. Hunt, ODFL, XPO, Werner,
Schneider, Flexport, Volvo Trucks, Mack, Rivian, Apple, Rolls-Royce, Rolex, Patek, Mercedes-Benz,
Genesis and Caterpillar. **Mobbin's catalog does not carry Scout Motors, Rolls-Royce, Rolex, Patek,
Mercedes, Volvo Trucks, Mack, or the traditional US freight carriers.** It *does* carry Rivian
(an existing project reference) plus a strong set of adjacent operators — Aurora (autonomous
trucking), Zipline (autonomous delivery), Robot.com (delivery fleets), Lightship (towable EV),
VanMoof, Joby Aviation, T1 Energy, Savor. Those are the substitutes used below, and they are
closer to KUL's actual category than a luxury-goods site would have been.

---

## 1. Grounds — the rhythm device

| Token | Value | Role |
|---|---|---|
| `--ink` | `#0B0B0B` | primary dark ground |
| `--paper` | `#F4F1E8` | warm document ground |
| `--plate` | `#141414` | raised surface on ink |
| `--plate-l` | `#EAE6DA` | raised surface on paper |
| `--line` | `rgba(244,241,232,.20)` on ink / `rgba(11,11,11,.18)` on paper | hairlines |

Sections **alternate ink → paper**. Two same-ground sections may only sit adjacent inside a
deliberate run of "documents". The alternation is the page's pulse — it replaces decoration.

## 2. Type — THREE FACES, REVISED

**Bebas Neue + Montserrat are withdrawn from this style.** The brand board names them, but
`briefs/README.md` states exploration treats type as a per-style variable and brand-board law
applies only if the winning style keeps it. Jalen confirmed on Jul 26 that DISPATCH changes both
faces. Montserrat in particular is among the most-used faces on the web and reads as a default.

The three-role system follows Aave [`194a20c4`](https://mobbin.com/sites/sections/194a20c4-7e03-4839-86b3-30981d8db06e),
which specs exactly this split — a display face, a body face, and a mono for data.

| Role | Face | Use |
|---|---|---|
| **Display** | **Big Shoulders Display** 600/700 | Hero and section heads, uppercase, `line-height:.88`, `letter-spacing:.01em`. An American industrial/civic signage face — conceptually correct for a carrier, and nothing like Bebas (a poster face) or s02a's Anton. Hero `clamp(3.4rem, 11vw, 10.5rem)`; section heads `clamp(2rem, 5vw, 4.4rem)`. |
| **Body & statements** | **Schibsted Grotesk** 400/500/600/700 | Body `16px/1.62`, measure ≤`62ch`. Also carries the large mid-scale statements in the heavy-grotesk register of Waka Waka [`27163fc7`](https://mobbin.com/sites/sections/27163fc7-a425-4132-831c-ec30e7a290de) — set 600/700 at `clamp(1.6rem,3.4vw,3rem)`. A Norwegian news grotesk built for dense factual reading, which is exactly this system's register. |
| **Data & labels** | **DM Mono** 400/500 | `10.5px`, `letter-spacing:.18em`, uppercase. **The system's signature: every fact carries a mono label.** Bracketed forms — `[ 023 ]`, `[ AR ]` — per KODE Immersive [`2a059cce`](https://mobbin.com/sites/sections/2a059cce-8c42-4096-b74a-0ddf77e3e7d3). |

Two voices, deliberately: the **signage voice** (Big Shoulders, headings) and the **editorial
voice** (Schibsted Grotesk, statements). Keep the roles clean — do not set a heading in Schibsted
Grotesk or a paragraph in Big Shoulders.

**Body-face history — do not regress.** The first attempt at this revision used *Instrument Sans*,
which the `impeccable` detector correctly flags as part of the current "Anthropic-skill / Vercel /
GitHub default wave" monoculture — the exact thing changing faces was meant to escape. Its full
banned set is `inter, roboto, open sans, lato, montserrat, arial, helvetica, fraunces, instrument
sans, instrument serif, geist(+sans/mono), mona sans, plus jakarta sans, space grotesk, recoleta`.
Any future substitution must clear that list.

Type does the work imagery and color normally do. If a section feels weak, the fix is scale and
hierarchy, never an added flourish.

## 3. Gold discipline — the hardest rule

`#D4AF37` is **functional ink only**. Permitted, exhaustively: arrow glyphs (`↗` `→`), the single
most important number in a group, 1px current/active rules, focus rings.

**Banned:** large fills, gradients, glows, section backgrounds, buttons wider than a pill, icon
tints, borders on more than one element per viewport.

Primary buttons are **white on ink / ink on paper** — Aurora, T1 Energy, Zipline, Rivian and
VanMoof all use neutral pills, never a brand-color fill. **Gold ≤3% of any viewport.** Scarcity is
what makes it read as gold rather than as yellow.

---

## 4. The reference library

Every entry was retrieved from Mobbin and visually examined. Use these; add your own.

### 4.1 Heroes — study all of these before designing one

| Site | ID | The move worth taking |
|---|---|---|
| VanMoof | [`33eaa6a1`](https://mobbin.com/sites/sections/33eaa6a1-4089-4d0c-9f7b-0c9cf0b30b62) | near-black macro photography, giant display word bottom-left, **centered** floating capsule nav, small right-hand text block with `↗`, price line bottom-right |
| T1 Energy | [`08b1da0a`](https://mobbin.com/sites/sections/08b1da0a-e784-4a8c-8d23-0359ff00b023) | full-bleed landscape, headline bottom-left, pill nav top-right, small case-study card bottom-right |
| Zipline | [`f0fb90fd`](https://mobbin.com/sites/sections/f0fb90fd-faff-496a-b01c-8af8c6d064c2) | ink split — huge condensed uppercase left, rounded photo card right, tiny pill CTA `↗` |
| Aurora | [`884f76c3`](https://mobbin.com/sites/sections/884f76c3-6c90-4f33-b2e9-10834e483daa) | headline over a moving truck; dual-line microcopy *above* one centered pill CTA |
| Rivian | [`542092f3`](https://mobbin.com/sites/sections/542092f3-a589-4909-8f3f-630089abe4f0) | **giant wordmark set BEHIND the subject**, centered spec line, two pills (filled + outline) |
| Rivian | [`a67b1738`](https://mobbin.com/sites/sections/a67b1738-47a5-450a-b81b-a5991e4f31aa) | utility bar above nav, centered wordmark, carousel arrows + dot indicator |
| Savor | [`f6870d1a`](https://mobbin.com/sites/sections/f6870d1a-3708-4347-92c6-048af2b0d73f) | full-bleed macro, tiny wordmark, minimal nav, zero other chrome |
| Joby Aviation | [`7e3bda43`](https://mobbin.com/sites/sections/7e3bda43-641a-4ac2-8070-527cd89cfecc) | cream ground, giant headline, tiny mono corner labels bottom-left and bottom-right |
| Freshman | [`1a15a6d9`](https://mobbin.com/sites/sections/1a15a6d9-be03-4761-9a3a-30ec06495846) | full-bleed motion, giant wordmark, bottom filmstrip rail of captioned thumbnails |
| Coda | [`5267d6c6`](https://mobbin.com/sites/sections/5267d6c6-eeca-4050-bbae-119af1bb9106) | pill eyebrow above a centered giant uppercase headline |

### 4.2 Navigation & menu

| Site | ID | The move |
|---|---|---|
| T1 Energy | [`08b1da0a`](https://mobbin.com/sites/sections/08b1da0a-e784-4a8c-8d23-0359ff00b023) | floating translucent capsule nav, solid CONTACT button |
| Aurora | [`0b6361a0`](https://mobbin.com/sites/sections/0b6361a0-1916-42d2-8c23-5efd205e4904) | **full-screen menu: huge nav list, mono LOCATIONS / OUR COMPANY columns beneath, bottom bar with a statement + `Schedule a call →`** |
| Rivian | [`a67b1738`](https://mobbin.com/sites/sections/a67b1738-47a5-450a-b81b-a5991e4f31aa) | thin utility bar above the main nav |
| Maze · Hex | [`0422d28b`](https://mobbin.com/sites/sections/0422d28b-b36f-4def-8590-f57fc5812131) · [`13d9a28c`](https://mobbin.com/sites/sections/13d9a28c-126f-4364-acaa-7cdb47e77a7b) | announcement/ticker strip above the bar |

### 4.3 Services / capability — **REPLACES the earlier three-column list**

| Site | ID | The move |
|---|---|---|
| **Intercom** | [**`fe15fe44`**](https://mobbin.com/sites/sections/fe15fe44-d336-4234-9780-e70800155eb1) | **PRIMARY.** Full-width hairline-separated capability list; a bullet dot marks the active row; a preview panel to the right swaps as you move down. Editorial, interactive, no cards. |
| **Anima** | [**`883db2f4`**](https://mobbin.com/sites/sections/883db2f4-aced-412d-8c52-de2012b6e6db) | **PRIMARY (treatment).** Mono index label `003/ SERVICES`, huge light-weight type list, thin measurement-grid rules across the section |
| A24 | [`b645a881`](https://mobbin.com/sites/sections/b645a881-adf5-43f3-a86c-758cd54f0b72) | giant type list with superscript metadata |
| MindMarket | [`33d8d60d`](https://mobbin.com/sites/sections/33d8d60d-8c8d-4907-8294-4692622909f4) | two-column hairline rows with `›` chevrons |
| ClassPass | [`76254648`](https://mobbin.com/sites/sections/76254648-1940-4409-b392-09a2361482e7) | category tab switcher above image + list |

> The previously-specified Raw Materials three-column layout is **withdrawn**. Do not use it.

### 4.4 Credentials & figures

| Site | ID | The move |
|---|---|---|
| Spade | [`34a2151f`](https://mobbin.com/sites/sections/34a2151f-c9b2-4121-b790-8e85202fe9ca) | corner crop-mark cards, mono `▸` label above a large value, horizontally scrollable |
| Zipline | [`baf31b25`](https://mobbin.com/sites/sections/baf31b25-1858-463c-bf15-611d9c669092) | condensed-caps figure, caps label, `Learn more ↗` |
| Robot.com | [`f85060f2`](https://mobbin.com/sites/sections/f85060f2-e490-4793-b11f-86d41a6a2cd0) | bento grid mixing dark and light tiles |

### 4.5 Contact — **REPLACES the earlier directory-plus-form**

| Site | ID | The move |
|---|---|---|
| **Aino Agency** | [**`1083cf3c`**](https://mobbin.com/sites/sections/1083cf3c-a197-4ee7-9632-e9bfe0d4e416) | **PRIMARY.** A slide-over CONTACT panel from the right edge with CLOSE; mono labels; the email address; and two explicit buttons — **OPEN MAIL** and **COPY EMAIL**; then FOLLOW and the address block in mono. Removes the "will anyone read this form?" doubt entirely. |
| **Büro** | [**`ce206186`**](https://mobbin.com/sites/sections/ce206186-f0b6-45e1-862f-a1bcbcfc5c0c) | **PRIMARY (routing).** Purpose-routed contacts — general vs. new business — with the physical address **and GPS coordinates set in mono** |
| Mother Design | [`ecbaa0a2`](https://mobbin.com/sites/sections/ecbaa0a2-e865-4b45-a5ea-0f67b4cb9794) | routing columns by purpose, each with its own address |
| Lightship | [`0791334e`](https://mobbin.com/sites/sections/0791334e-985a-4902-b866-3be56684576c) | reason-for-inquiry select **first**, then a segmented "email me / call me" preference |
| Rains | [`82ce6566`](https://mobbin.com/sites/sections/82ce6566-c33e-4b16-8750-670aa04be011) | underline-only inputs; opening hours stated above the form |
| Samara | [`c6c00a9a`](https://mobbin.com/sites/sections/c6c00a9a-496b-419e-9ba1-5c2ac1b207e3) | quiet two-line prompt + a single text link, no form at all |

> The previously-specified In Common With table-beside-form is **withdrawn**. Do not use it.

### 4.6 Multi-step flows

| Site | ID | The move |
|---|---|---|
| Glide | [`2f6ffe2c`](https://mobbin.com/flows/2f6ffe2c-4b38-43fd-a6ef-0e0215713861) | `Step 2 of 3`, chip-select request type, Continue / Back, explicit confirm step |
| HoneyBook | [`6cd26450`](https://mobbin.com/flows/6cd26450-7bbd-41f8-b30f-ba9cfa42d317) | service options as selectable cards with `✓ Selected`, then a thank-you card |
| Calendly | [`732847b6`](https://mobbin.com/flows/732847b6-28f1-4624-a4c2-5c6103433d26) | structured contact form → confirmation card with a return action |

### 4.7 Careers

| Site | ID | The move |
|---|---|---|
| Runway | [`9b88baff`](https://mobbin.com/sites/sections/9b88baff-1fc3-4850-b9e6-6bc4c0ed630b) | large display headline over a 4-column hairline table: role / group / location / Apply |
| Linear | [`b94b791e`](https://mobbin.com/sites/sections/b94b791e-21d7-46d0-95e8-cd3ec25fc5ee) | ink ground, roles grouped by department, region links with arrows |
| Dovetail | [`a61eb7a0`](https://mobbin.com/sites/sections/a61eb7a0-0eb3-4c9e-b2dc-37019cfd2c47) | search + location filter above a grouped table |
| Vanta | [`4388b797`](https://mobbin.com/sites/sections/4388b797-146a-491b-ad47-82fab8951d60) | filter row, then rows ending `Learn more →` |

### 4.8 Story, mission & manifesto

| Site | ID | The move |
|---|---|---|
| sweetgreen | [`1e44b0a4`](https://mobbin.com/sites/sections/1e44b0a4-1609-4ecc-baf0-7296db75c194) | tinted panel left with a small label + huge statement, full-bleed photo right |
| Dropbox | [`12023a33`](https://mobbin.com/sites/sections/12023a33-4b27-4b79-9756-72dfa0af47df) | half ink panel carrying the mission, half photograph |
| Zipline | [`1dc65341`](https://mobbin.com/sites/sections/1dc65341-71e4-485d-83c9-5700f01dfb23) | rounded video card left, condensed headline + short paragraphs right |
| Fiasco | [`3c2289aa`](https://mobbin.com/sites/sections/3c2289aa-4d3f-41d7-be08-a10c48dd6734) | asymmetric image pair, small italic label, `Watch … ↘` |
| Joby | [`7e3bda43`](https://mobbin.com/sites/sections/7e3bda43-641a-4ac2-8070-527cd89cfecc) | one enormous line, tiny mono corner labels, nothing else |

### 4.9 Galleries & carousels

| Site | ID | The move |
|---|---|---|
| Rivian | [`ceb97802`](https://mobbin.com/sites/sections/ceb97802-b7e4-4c5c-814c-220c0aea8def) | warm ground, 3-up image carousel, prev/next + `View full screen` |
| Aurora | [`6453133e`](https://mobbin.com/sites/sections/6453133e-a0f0-45f0-a007-81cfd700f7a3) | `Featured ⁽⁰⁶⁾` superscript count, circular arrows, category chip on each image, date + headline |
| Atlas Card | [`8c09fb14`](https://mobbin.com/sites/sections/8c09fb14-b75f-49c8-8511-4c2d7bb45e1e) | full-bleed photo, centered caption, **tiny mono location credit under it** |

### 4.10 Footers

| Site | ID | The move |
|---|---|---|
| Legora | [`74f66481`](https://mobbin.com/sites/sections/74f66481-04ab-4abc-bf99-7878c607e1f6) | link columns above a giant wordmark cropped off the bottom edge |
| Squarespace | [`10f3b92c`](https://mobbin.com/sites/sections/10f3b92c-1829-4e60-8f75-265bf7919ec1) | ink, six link columns, language selector |
| Maxima | [`fc167e3e`](https://mobbin.com/sites/sections/fc167e3e-e2f2-4340-bfcf-52cc593edfbb) | rounded panel footer with an oversized logotype |

---

### 4.11 Typography & label systems

| Site | ID | The move |
|---|---|---|
| Waka Waka | [`27163fc7`](https://mobbin.com/sites/sections/27163fc7-a425-4132-831c-ec30e7a290de) | index numeral in a plate beside a huge heavy grotesk word; mono taxonomy row beneath with the active term in full black; mono corner labels — brand left, **city + live local time** right |
| KODE Immersive | [`2a059cce`](https://mobbin.com/sites/sections/2a059cce-8c42-4096-b74a-0ddf77e3e7d3) | bracketed mono micro-labels pinned to the page corners |
| Aave | [`194a20c4`](https://mobbin.com/sites/sections/194a20c4-7e03-4839-86b3-30981d8db06e) | the three-face system stated explicitly: display / body / mono, each with its role |
| Jasper | [`30434930`](https://mobbin.com/sites/sections/30434930-ea74-484a-8eca-88ff9c8014f2) | type scale annotated with mono `SIZE / WEIGHT / LETTER SPACING` per step |
| Kinfolk | [`1557474b`](https://mobbin.com/sites/sections/1557474b-af5b-48e0-b8d3-541af616713b) | uppercase title over sentence-case subtitle with a tiny issue credit |

**Take the live-clock detail from Waka Waka.** A mono `LOGANVILLE, GA · HH:MM ET ●` label is honest,
costs nothing, and says "24/7 dispatch" better than the claim does. Use the visitor's clock
converted to ET; never fake a status.

---

## 5. Motion & performance

Scroll-**linked** only; scroll-jacking banned. State transitions `220ms cubic-bezier(.2,.8,.2,1)`.
Section entrances: 700ms clip-reveal (`inset(0 100% 0 0)` → `inset(0)`). Hairlines draw in via
`transform:scaleX()`. All inside a full `prefers-reduced-motion` shutoff. 60fps or ship simpler.

**NEVER transition a layout property.** No `transition` or `@keyframes` on `width`, `height`,
`padding`, `margin`, `top/right/bottom/left`, or `font-size`. Each one forces layout on every
frame. The first build of this style violated this four times and a design hook caught it — do not
repeat it. Use instead:

| Instead of | Use |
|---|---|
| `transition: padding` on a scroll-collapsing bar | a fixed-height bar with `transform: translateY()`, or transition `block-size` on a wrapper via `grid-template-rows` |
| `transition: width/height` on a shrinking logo | `transform: scale()` with `transform-origin` set |
| `transition: padding-left` for a hover indent | `transform: translateX()` |
| animating `height: auto` open/closed | `grid-template-rows: 0fr → 1fr` |

Animate **`transform` and `opacity` only**, plus `clip-path`, `color`, `background-color`,
`border-color` and `filter` where needed. Anything on a scroll handler must be transform/opacity.

## 6. UI/UX laws (this version is judged on these)

1. **Five states on every interactive element** — rest, hover, focus-visible, active, disabled.
   Focus-visible is a 2px gold ring at 3px offset, never removed.
2. **Touch targets ≥44px.** Hairline rows get padding, not tiny hit areas.
3. **Contrast measured, not eyeballed** — body ≥4.5:1, large ≥3:1. Text over photography sits on a
   verified scrim. (Two phase-2 pages shipped near-illegible hero text.)
4. **One primary action per viewport.** Secondary actions are text-with-arrow, not a second button.
5. **Forms:** label above input (never placeholder-as-label), validation on blur, errors name the
   fix, required marked, real `autocomplete` / `inputmode`, reachable success state.
6. **Nav tells you where you are** — `aria-current="page"` plus a visible gold rule.
7. **Mobile is the design, not a fallback.** Capsule nav → bottom sheet; rails scroll with a
   visible overflow affordance; the interactive services list degrades to a plain readable list.
8. **No layout shift.** Every image ships `width`/`height`. No CDN, no external JS.

## 7. Truth guardrail — read this twice

Mobbin's stat sections are full of `50,000+ customers` and `$10B+ saved` (Ramp `b3c99307`,
Amplemarket `7630befa`). **KUL has none of that and must never appear to.**

- Credential rails carry **credentials**: USDOT 7638788, MC 66389691, licensed & insured, coverage
  area, 24/7 dispatch, Loganville GA.
- Figure blocks carry **the honest 1 → 50 vision** — one truck today, 50 tractors targeted by end
  of 2029, framed as intention.
- **Never** fabricate testimonials, client logos, load counts, on-time percentages, safety scores,
  years in business, or fleet size. Borrow Mobbin's *form*; supply KUL's *facts*.

Honesty is the trust strategy. A number that cannot be verified does not go on the page.

## 8. Content and asset truth

- Copy comes from the existing phase-2 pages (`multiverse/phase2/s02a/**` is the best-written set)
  and `briefs/the-journey-screenplay.md`. Adapt voice; do not invent facts.
- Routes (uniform `../<slug>/` contract): `/` The Beginning · `journey/` The Journey ·
  `story/` Why I Started Driving · `mission/` The Mission · `responsibility/` The Responsibility ·
  `join/` Join the Journey · `forward/` Let's Move Forward · `road-ahead/` The Road Ahead
- Contact: `dispatch@kulenterprises.com` · `678-972-1148` · Loganville, GA.
- Services: Power Only · Dry Van · Reefer · Dedicated · Regional · Over-the-Road · Expedited.
- **Photo filenames lie.** Verified pixel-by-pixel — pick and caption from this column only:

  | Path | What the pixels show | Meaning |
  |---|---|---|
  | `/assets/journey/cliffs.jpg` | flat-topped mesa over turquoise water | exploration, the journey |
  | `/assets/journey/wave.jpg` | turquoise creek through dense green forest | calm, dependability |
  | `/assets/journey/tree.jpg` | big spreading tree, green valley | roots, legacy |
  | `/assets/journey/desert.jpg` | sandstone headland + breaking ocean wave | movement, power |
  | `/assets/journey/river.jpg` | tall sandstone formations over empty sand | strength, foundation |

  `river.jpg` and `desert.jpg` are sandstone siblings — never feature both prominently on one page.
- **Lion is the only mark.** `/assets/brand/lion-clean.png` floats on any ground;
  `/assets/brand/logo-vector.png` on light grounds only. **The Doctor Bird must never appear.**

## 9. Technical contract

Self-contained `index.html` per route: inline `<style>`, inline `<script>`, no build step, no CDN.
One permitted external stylesheet — the Google Fonts link for the three revised faces:

```html
<link href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@600;700&family=Schibsted+Grotesk:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
```

Expose them as `--ff-d` (Big Shoulders Display), `--ff-b` (Schibsted Grotesk), `--ff-m` (DM Mono) so
the pairing is swappable from one place. End with:

```js
window.KUL_TWEAKS = { style: 's13', controls: [ /* 6-9 real levers */ ] };
```
followed by `<script src="/tweaks.js" defer></script>`.
