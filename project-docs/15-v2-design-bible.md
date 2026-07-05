# KUL v2 DESIGN BIBLE — single source of truth
All builder agents implement from THIS document only. It is self-contained. Where it conflicts with instinct, this document wins. Where it is silent, follow `v2-build-constraints.md` (kept assets, kept APIs, branch rules) and copy the quietest possible answer.

Non-negotiables inherited from the constraints file (repeated because they gate everything):
- Branch `v2-redesign`. Never touch `app/api/**`, `lib/*`, `content/**` field names, `tina/**`, `public/**`, `app/fonts/**`.
- Form POST contracts exactly as v1: `/api/quote` (`origin, destination, freightType, pickupDate, contact, details?`), `/api/contact` (`name, email, message`), `/api/driver` (`name, contact, experience, note?`), honeypot input named `botcheck` on all three. Submission logic in `components/forms` (useFormSubmit / Honeypot / FormStatus semantics) is preserved; styling and markup may be rebuilt around it (§3.20), the POST contract may not.
- Assets: ONLY the paths in the inventory below. Never invent an asset path.
- NO new runtime deps. No Lenis, no GSAP. framer-motion 11 via the existing `MotionProvider` (LazyMotion strict) — always import `m` from `framer-motion`, never `motion`.
- NO invented stats. USDOT/MC render static, never animated.

---

## 1. DESIGN DIRECTION

**Thesis.** No trucking carrier on earth ships cinematic dark editorial: US carriers have real numbers and template design; the two award-recognized logistics sites (LODISNA, MVP) have motion craft and generic brands. KUL v2 takes the intersection nobody owns: **ink-black cinema + warm-paper documents + serif monuments + one disciplined gold**, executed with a five-verb motion system. Carriers prove trust with facts; award sites prove craft with restraint; KUL does both in one system. The register is "quiet luxury that answers the phone at 2 a.m." — VistaJet's calm, Rolls-Royce's silence, LODISNA's freight-native theater, on Longbow's palette chassis.

**The four signature moves** (these make the site unmistakable; everything else is supporting cast):

1. **THE RISE** — every H1/H2 on the site enters as line-masked serif: each line clipped `inset(0 0 -0.2em)`, sliding up from `y: 110%`, 0.8s `ease-out`, 0.1s stagger per line. Omnibus Bold at line-height 0.88–0.95. One reveal recipe, used obsessively, is what reads as "designed."
2. **TRUCK CHAPTERS** — the homepage set piece: a pinned 2D scene where a full-height dusk truck photograph holds the right half of the viewport and cross-fades between four gold-lit angles while numbered service chapters (ghost numeral, eyebrow, copy) advance on the left as you scroll. The LODISNA rotating-truck scrollytelling, rebuilt honestly in 2D with our six stock photos. Used ONCE, on home only.
3. **THE GOLD HAIRLINE + BIRD RULE** — hairlines are the structural device sitewide (white/12 on ink, ink/15 on paper): under the nav, between ledger rows, dividing footer columns. Gold #B59352 hairline appears at most once per page, and the ceremonial version is a full-width hairline interrupted at center by the Doctor Bird mark — KUL's version of VistaJet's bird-in-rule.
4. **THE CURTAIN ENDING** — every page's content lifts like a curtain off a sticky footer that was "always there": dispatch strip → sitemap with USDOT/MC set as typographic jewelry → the word **KUL** at 100vw cropped at the baseline in paper at 8% opacity. The biggest brand payoff on the site, saved for last, identical on every page (page ENDINGS differ via the CtaBand that precedes it).

**Unifying film stock** (policy, not a move): every photograph passes through the same soft ink-and-warm grade (`img-grade` utility) and one fixed film-grain layer covers the site at 5% opacity. Mixed stock photography reads as one shoot.

**Decisions where research conflicted (one line each):**
- Home hero = full-bleed **video**, not the split-editorial photo hero — the video asset exists, trucking emotion wins the first 3 seconds; the split editorial opener goes to /services instead.
- **No smooth-scroll library** — constraints forbid Lenis; therefore scroll-scrubbed motion is limited to two moments per page max and always mapped linearly (with light `useSpring` where noted), everything else is trigger-once reveals.
- **No animated counters anywhere** — KUL's only numbers are identifiers (USDOT/MC) and commitments (2029), not metrics; static facts beautifully typeset beat odometers and dodge the Schneider "0 miles" failure entirely.
- **GoldGlass/POUR is retired from v2** — the v1 liquid-gold shader fought legibility (that's why it got parked); Truck Chapters is the signature moment instead. `components/concept/**` stays on disk, unimported.
- **No marquee, no preloader percentage, no character-shuffle** — they dilute the quiet register; ceremony budget is spent on the intro film (first visit only) and the curtain footer.
- **Desktop nav = visible links; overlay menu is mobile-only** — brokers are in a hurry; VistaJet keeps links visible and it reads more, not less, luxury.
- Page transitions = a fast 0.45s ink **veil**, not the v1 2.5s curtain replay — perceived speed is the premium signal for a logistics brand; the film plays once per first visit ever.

**Dark/light rhythm per page** (ink = #0B0B0B scenes, paper = #F7F5F0 scenes; never two full-bleed photo bands adjacent; the paper beat is always where "paperwork" lives — facts, forms, FAQs):

| Page | Rhythm (top → bottom) |
|---|---|
| home | ink(video) → paper(quote strip + manifesto) → ink(chapters) → paper(proof) → photo/ink(vision) → paper(FAQ) → photo/ink(drivers) → ink(CTA) → ink(footer) |
| about | photo/ink(hero) → paper(manifesto) → ink(growth ledger) → paper(values, framed photos) → ink(2029 close → footer) |
| services | ink(split hero) → paper(service index) → ink(discipline band) → paper(quote strip) → ink(CTA → footer) |
| services/[slug] | photo/ink(hero) → paper(overview deck) → ink(ledger) → paper(proof strip) → photo/ink(next service → footer) |
| safety | photo/ink(hero) → paper(credentials document) → ink(pillars ledger) → paper(process strip) → ink(verify CTA → footer) |
| drivers | photo/ink(hero) → ink(the deal ledger) → photo/ink(home base) → paper(timeline + apply) → ink(call CTA → footer) |
| carrier-packet | ink(compact hero) → paper(document ledger + request) → ink(CTA → footer) |
| quote | ink(compact opener) → paper(form) → paper(FAQ) → footer directly |
| contact | ink(compact opener) → ink(directory) → paper(form) → footer directly |
| legal set | ink(header band) → paper(document body) → ink(index band → footer) |
| 404 | ink only |

---

## 2. DESIGN TOKENS (exact values)

All tokens live in `app/globals.css` `:root` + `tailwind.config.ts` `theme.extend`. KEEP existing color/font/tracking token names (`gold, gold-dim, gold-soft, ink, ink2, charcoal, paper, cream, graywarm, font-omnibus, font-mont, tracking-eyebrow`) — pages depend on them. Keep the existing `focus-visible` rules and `::selection`. Add the following.

### 2.1 Type scale (Tailwind `fontSize` tuples: [size, {lineHeight, letterSpacing}])
Omnibus Bold is the ONLY display face; it never renders below 20px. Montserrat handles everything ≤20px. Uppercase serif is allowed only on display-xl/display-l.

| token | clamp() | line-height | letter-spacing | face / use |
|---|---|---|---|---|
| `display-xl` | `clamp(3.25rem, 1.75rem + 7.5vw, 9.5rem)` (52→152px) | 0.88 | -0.01em | Omnibus. Home hero H1, CtaBand headline, 404 numeral base |
| `display-l` | `clamp(2.5rem, 1.5rem + 5vw, 6.5rem)` (40→104px) | 0.9 | -0.01em | Omnibus. Interior page H1s, statement bands, NextService |
| `h2` | `clamp(1.875rem, 1.25rem + 2.6vw, 3.75rem)` (30→60px) | 0.95 | -0.005em | Omnibus. Section headings |
| `h3` | `clamp(1.25rem, 1.05rem + 0.9vw, 1.875rem)` (20→30px) | 1.1 | 0 | Omnibus. Card/ledger row titles, big phone numbers |
| `body-l` | `clamp(1.0625rem, 1rem + 0.3vw, 1.1875rem)` (17→19px) | 1.55 | 0 | Montserrat 400. Decks, lead paragraphs |
| `body` | `1rem` | 1.6 | 0 | Montserrat 400. Default copy |
| `label` | `0.75rem` (12px) | 1.2 | 0.22em (`tracking-eyebrow`) | Montserrat 600 UPPERCASE. Eyebrows, buttons, nav links |
| `micro` | `0.6875rem` (11px) | 1.4 | 0.18em | Montserrat 500 UPPERCASE. Frame furniture, credentials, legal rows |

Rules: body copy `max-w-[62ch]` hard cap. Display type never exceeds `max-w-[14ch]` per line (hand-break lines in JSX — no runtime splitters). On ink, body text is `text-paper/70`; display is `text-cream` or `text-paper`. On paper, body is `text-graywarm-deep` (#5C574F), display is `text-ink`. Never pure-black body on paper, never pure-white body on ink. Tabular-nums (`font-feature-settings: "tnum"`) on anything numeric (USDOT/MC, indices, times).

**Opacity floor (a11y law):** readable text never sits below `/60` alpha on its ground (contrast targets: 4.5:1 body/micro, 3:1 display). Alphas `/30–/50` are reserved for `aria-hidden` decoration ONLY (ghost numerals, ScrollCue, decorative indices, progress hairlines). Micro furniture over photography/video must sit inside a `.scrim-hero`/`.scrim-b` zone.

**Heading hierarchy (a11y law):** exactly one `h1` per page, and never skip heading levels in DOM order. Visual scale comes from the type token, not the tag — an `h2` may wear h3 clothes wherever the spec calls for a small heading.

### 2.2 Spacing rhythm
| token | clamp() | use |
|---|---|---|
| `band-sm` | `clamp(4rem, 2.5rem + 6vw, 7.5rem)` (64→120px) | compact sections (proof strips, FAQ) |
| `band` | `clamp(5.5rem, 3.5rem + 9vw, 11.25rem)` (88→180px) | default section padding-block |
| `band-lg` | `clamp(7rem, 4rem + 13vw, 15rem)` (112→240px) | before/after heroes and CtaBand |

Container: `mx-auto max-w-[1760px] px-[clamp(20px,5vw,90px)]`. Grid: `grid-cols-12 gap-x-[clamp(16px,1.4vw,24px)]`. Text content never spans col 1→12 (min `col-start-2`, max `col-end-12` on lg+). Root font zoom for big screens: `@media (min-width:1920px){ html { font-size: clamp(16px, 0.5vw + 8px, 19px); } }`.

### 2.3 Motion tokens — `components/v2/motion.ts` (every transition imports from here)
```ts
export const EASE = {
  out:   [0.165, 0.84, 0.44, 1],   // "ease-out" — power3.out. All entrances, reveals, RISE.
  inout: [0.77, 0, 0.175, 1],      // "ease-inout" — curtains, veils, clip wipes.
  kul:   [0.4, 0, 0, 1],           // "ease-kul" — house curve. Signature moments only (chapters, footer wordmark).
  micro: [0.215, 0.61, 0.355, 1],  // "ease-micro" — hovers, buttons, accordions.
} as const;
export const DUR = { fast: 0.25, base: 0.4, slow: 0.6, slower: 0.8, curtain: 1.2 } as const;
export const STAGGER = { lines: 0.1, items: 0.07 } as const;
export const VIEWPORT = { once: true, margin: "-15% 0px" } as const; // default whileInView viewport
```
Interaction law: **slow enter, fast leave** — hover-in 0.45s `EASE.micro`, hover-out 0.2s. Nothing animates longer than 0.8s except the page veil (1.05s total), the ClipReveal settle (1.4s) and scroll-scrubbed moves (which have no duration). Springs are allowed ONLY for the ServiceIndex cursor-follow. Max two scroll-scrubbed sequences per page. Every reveal fires once (`VIEWPORT`), never replays.

Reduced motion (hard requirement, three layers): (1) wrap `(site)` tree in `<MotionConfig reducedMotion="user">`; (2) every component checks `useReducedMotion()` and swaps transforms for a 0.3s opacity fade — content must be fully visible at rest with JS disabled (initial states only via `whileInView`, never `hidden` classes); (3) CSS hover transforms live inside `@media (prefers-reduced-motion: no-preference)`. HeroVideo shows poster; Parallax/TruckChapters scrub disabled (static first frame / stacked layout).

### 2.4 Hairline system
- `.rule-ink` → `h-px bg-ink/15` (on paper) · `.rule-paper` → `h-px bg-white/12` (on ink) · `.rule-gold` → `h-px bg-gold/70` — **max ONE full-width standalone gold rule per page**, and only as `BirdMark` or the legal-page byline rule (§4.10). An `Eyebrow`'s short gold hairline is part of that eyebrow's single gold element, not a separate gold rule.
- Hairlines replace boxes everywhere: no card borders, no rounded panels, sharp corners sitewide (`rounded-none`; the only radius on the site is `rounded-full` on pills).
- Vertical hairlines divide grid columns (`divide-x divide-white/12`) in fact rows and footer.

### 2.5 Scrim recipes (text on photo — flat washes are FORBIDDEN)
- `.scrim-b` (default, text in lower third): `background: linear-gradient(to top, rgba(11,11,11,0.72), rgba(11,11,11,0.38) 32%, rgba(11,11,11,0.08) 58%, transparent 78%)`.
- `.scrim-hero` (adds nav-zone protection): `.scrim-b` PLUS `background: linear-gradient(to bottom, rgba(11,11,11,0.45), transparent 22%)` as a second layer.
- `.melt-b` (photo dissolves into the ink page below — Exo Ape): `background: linear-gradient(180deg, transparent 60%, #0B0B0B 100%)`.
- `.vignette-ink`: `box-shadow: inset 0 0 120px 20px rgba(11,11,11,0.35)` — on every framed photo to seat it into ink.
- Law: display type over photos only within the scrim zone; body copy NEVER sits on photography (move it to an adjacent column or below the band). Contrast target 4.5:1 body, 3:1 display, measured against the scrimmed region.

### 2.6 Photo grade + grain
- `.img-grade` on EVERY `next/image` photograph: `filter: grayscale(0.35) sepia(0.14) brightness(0.94) contrast(1.06) saturate(0.9)` — a 50%-strength warm cinema grade, cheap single-filter version. Never applied to the hero video (already graded in the file).
- Grain: one global layer in `(site)/layout` — `<div aria-hidden className="pointer-events-none fixed inset-0 z-[70] opacity-[0.04]" style={{backgroundImage:"url(data:image/svg+xml,…feTurbulence baseFrequency='0.65' numOctaves='3' stitchTiles='stitch' + feComponentTransfer contrast/tint baked into the SVG itself…)", backgroundSize:"182px 182px"}} />`. **NO `mix-blend-overlay`** — a blend mode on a fixed full-viewport layer forces whole-page recompositing every frame over the hero video and the 400vh pinned section; bake the tonal character into the data-URI and composite normally at low alpha. Static, never animated. z-70 sits above content, below nav (z-80), veil (z-100).
- `sizes` law (a hard constraint requirement): EVERY `next/image` declares `sizes`. Defaults by role — full-bleed bands (PhotoBand, PageHero photo, CtaBand "next", HeroVideo poster): `sizes="100vw"`; half-viewport frames (TruckChapters, PageHero split, About values rows): `sizes="(min-width:768px) 50vw, 100vw"`; ServiceIndex follower: `sizes="260px"`; small floaters/thumbs: `sizes="(min-width:768px) 33vw, 100vw"`. The HeroVideo poster and every PageHero photo image also set `priority` (they are LCP candidates).
- Aspect grammar: full-bleed bands = A; framed grid images 16:9 or 21:9 ("cinema strip") = B; small floaters 4:5 = C. Page sequence approximates A-B-C-B-A. Never two A-state photo bands adjacent.

### 2.7 THE GOLD BUDGET LEDGER (hard law, audited per viewport)
Gold = `#B59352` (`gold`), `#6F5A2C` (`gold-dim`, AA text on paper), `#CFB484` (`gold-soft`, hover companion — hovers do NOT add to the count).
1. The nav's "Request a Quote" CTA is **gold element #1 in every viewport, always** (it's fixed).
2. Max **ONE more** gold element per viewport: an Eyebrow (label+hairline counts as one), OR a CTA, OR a BirdMark rule — never several. Form focus underlines and the active nav link are NEVER gold (§3.20, §3.1).
3. Ghost numerals are NEVER gold (paper/ink at 5–14% alpha only). Headlines are never gold. Body text never gold. No gold-gradient text anywhere (the v1 `kul-grad-text` wallpaper failure is banned).
4. Buttons: gold is a **border/text**, never a fill, except the single `btn-gold` pill (nav CTA + one page-level primary). All other buttons ink/paper ghosts.
5. Each page spec below carries a gold ledger; page agents must not add gold beyond it. When in doubt: white/ink.

### 2.8 Buttons & pills
- `btn-gold`: `rounded-full bg-gold text-ink text-label px-6 h-11 inline-flex items-center gap-2 hover:bg-gold-soft transition-colors duration-200` (nav CTA, one primary per page max).
- `btn-ghost-dark` (on ink): `rounded-full border border-paper/30 text-paper text-label px-6 h-11 hover:border-paper transition-colors`.
- `btn-ghost-light` (on paper): `border-ink/25 text-ink hover:border-ink`.
- `link-hairline`: text link with 1px `currentColor` underline that wipes — `::after scaleX(0) origin-right` → hover `scaleX(1) origin-left`, `transition transform 0.5s cubic-bezier(0.77,0,0.175,1)`. The universal text-link hover.
- Min tap target 44px everywhere.

---

## 3. SHARED COMPONENT INVENTORY — `components/v2/*`
The foundation agent builds ALL of these before page agents start. Server components unless marked `"use client"`. Every client component imports `{ m }` from framer-motion (LazyMotion strict is mounted by the existing `MotionProvider` in the v2 `(site)/layout.tsx`). Everything ground-aware via a `data-ground="ink" | "paper"` attribute pattern: components read `currentColor`/CSS vars, not hardcoded colors, wherever both grounds are possible.

### 3.1 `Nav.tsx` + `MenuOverlay.tsx` — "use client"
```ts
// Nav
type NavProps = {}; // reads usePathname internally; renders MenuOverlay
```
**Layout (desktop ≥lg):** fixed top bar, `h-14`, container-aligned. Left: text wordmark — `KUL` Omnibus 20px + `ENTERPRISES` micro tracked beneath-right (currentColor, so it theme-flips; the lockup PNG is not used in chrome). Center: 5 links `SERVICES · DRIVERS · SAFETY · ABOUT · CONTACT` (text-label, 44px hit areas, `link-hairline` hover). Right: `678-972-1148` as `tel:` micro link + `btn-gold` "REQUEST A QUOTE" → `/quote`. A `.rule-paper` hairline closes the bar bottom (opacity 0 at top state).
**Mobile:** left wordmark, right stacked-label MENU button — two spans "MENU"/"CLOSE" in an `overflow-hidden h-[1em]` window, roll `y: -100%` on toggle, 0.3s `EASE.micro`, plus a two-line icon rotating to an X. `aria-expanded`/`aria-controls` wired.
**Scroll behavior (three states via `useScroll` + `useMotionValueEvent`, 6px direction threshold):** `top` (scrollY < 80): transparent, no hairline; `hidden` (scrolling down past 1 viewport): `y: -100%`, 0.3s; `pinned` (scrolling up): `y: 0`, `bg-ink/85 backdrop-blur-md` + hairline. 
**Theme flip:** sections carry `data-ground`; a single IntersectionObserver (in Nav) watches `[data-ground]` elements crossing a 56px top line and sets `data-nav-theme="ink"|"paper"` on `<html>`; CSS flips nav `color` (paper text over ink sections, ink text + `bg-paper/85` when pinned over paper sections). The gold CTA is constant in both themes.
**Route awareness:** active link gets a persistent 1px `currentColor` hairline underline (the `link-hairline` rest state) — NEVER gold; the nav CTA is the chrome's only gold. On `/quote` AND `/contact`, the CTA renders as `btn-ghost` (those pages' forms own the gold; you're already where the CTA points).
**Reduced motion:** hide/show becomes opacity toggle.
```ts
// MenuOverlay (mobile only, rendered by Nav)
type MenuOverlayProps = { open: boolean; onClose(): void };
```
Full-screen ink panel (`fixed inset-0 z-[90]`), opens with `clip-path: inset(0 0 100% 0)` → `inset(0)` 0.7s `EASE.inout`; close reverses 40% faster. Three zones (Æbele): top row = wordmark + CLOSE; middle = links Home / Services / About / Safety / Drivers / Carrier Packet / Contact in Omnibus `clamp(2.2rem, 9vw, 3.5rem)`, each line in an overflow-hidden mask rising `y: 110% → 0`, 0.8s `EASE.out`, delay `0.25 + i*0.07`; small `01–07` micro indices in paper/40, `aria-hidden` (decoration; not gold); active route line gets a 2px paper/80 left tick — never gold (the overlay's gold pill is its single gold). Bottom zone = two bordered pills: `btn-gold` "Request a Quote" and `btn-ghost-dark` `tel:678-972-1148`, then a meta line in micro: `LOGANVILLE, GEORGIA — SOUTHEAST BASED · NATIONWIDE SERVICE · USDOT 7638788 · MC 66389691` entering last. Body scroll locked; focus-trapped; Escape closes; focus returns to trigger.
**Used by:** every page (via layout).

### 3.2 `Footer.tsx` — server, with one tiny client island
```ts
type FooterProps = {}; // reads content/site.json via lib/site
```
**The Curtain (md and up ONLY):** in `(site)/layout.tsx`, page content wraps in `<div className="relative z-[1] bg-ink shadow-[0_30px_60px_rgba(0,0,0,0.45)]">…</div>` — the background must be EXPLICIT and opaque (`bg-[inherit]` resolves to transparent here and lets the footer bleed through un-painted gaps; paper sections paint their own `bg-paper` inside the wrapper) — and `<footer className="md:sticky md:bottom-0 md:h-[92svh]">` sits AFTER it in the DOM — content scrolls up and off the footer (pure CSS; no JS). **Below `md` the footer is normal flow, `h-auto`, no curtain** — the stacked mobile content (dispatch + address + 3 columns + legal + wordmark) far exceeds 92svh at 375px and would clip links. A zero-height sentinel `<div data-content-end aria-hidden />` sits at the END of the content wrapper (last child, above the footer in flow). Footer inner content gets a subtle settle: `FooterReveal` (small client wrapper) drives it from the sentinel — `useScroll({target: contentEndSentinel, offset:["start end","end end"]})` → inner `y: -10% → 0`, `opacity 0.5 → 1`, linear. NEVER target the sticky footer element itself with `useScroll` (sticky rect measurement gives degenerate 0/1 progress).
**Layers top→bottom (ink ground):**
1. Dispatch strip: hairline-top/bottom row, centered — micro eyebrow `DISPATCH ANSWERS 24/7` + `678-972-1148` in Omnibus h3 as a `tel:` link + `dispatch@kulenterprises.com` with a `CopyButton` (§3.25 — the client island).
2. Sitemap grid `md:grid-cols-12`: col-span-4 address block (`KUL Enterprises LLC` / `Loganville, GA` / `Southeast Based · Nationwide Service`); three link columns col-span-2 each — **Company** (About, Safety, Carrier Packet, Contact), **Services** (all 7 from services.json), **Drivers** (Drive with KUL, Request a Quote, FAQ→/quote#faq); column heads micro paper/60, items 15px paper/80 with `link-hairline` hover.
3. Legal row: flex-between micro paper/60 (the /35 of the moodboard fails WCAG at 11px — §2.1 opacity floor) — `© {year} KUL Enterprises LLC` · `USDOT 7638788 · MC 66389691` (static, tabular-nums) · legal links (Privacy, Terms, Cookies, Legal Notices, Climate) · `LOGANVILLE, GA — {live ET clock, tabular-nums}` (tiny client island, 1-min interval).
4. Wordmark: `KUL` in Omnibus, paper at 8% opacity, cropped at the baseline by `overflow-hidden` + `translate-y-[14%]`; `aria-hidden` + `sr-only` "KUL Enterprises". Size by QA, not by faith: 3 glyphs at `text-[38vw]` measure only ~65–70vw — start around `text-[52vw] leading-[0.72] tracking-[-0.02em]` and tune until the cropped mark spans the full container width on desktop; at ≤480px switch to an intentionally oversized `text-[140vw]` crop (research footers note). Rises `y: 26% → 14%` on the footer-reveal scroll progress (EASE irrelevant — linear scrub).
**No gold anywhere in the footer** except nothing — footer is a zero-gold zone (nav CTA has scrolled away only if hidden; budget stays safe).
**Used by:** every page including 404.

### 3.3 `StickyMobileBar.tsx` — "use client"
```ts
type StickyMobileBarProps = { variant?: "default" | "drivers" | "hidden" }; // layout derives variant from pathname
```
`md:hidden fixed bottom-0 inset-x-0 z-[80] h-16 pb-[env(safe-area-inset-bottom)] bg-ink/90 backdrop-blur-md border-t border-white/12`. Mounts with `y: 100% → 0` spring after 400px scroll; unmounts when the content-end sentinel (`[data-content-end]`, §3.2) or any `<form>` is in view (IO). NEVER observe the sticky footer itself — a `sticky bottom-0` element's rect intersects the viewport for essentially the entire scroll, so the bar would never mount. `default` (all pages except below): `tel:` icon-button + `btn-gold` "GET A QUOTE" → /quote. `drivers` (on /drivers): three zones — CALL (`tel:`), TEXT (`sms:6789721148`), gold APPLY → `#apply`. `hidden` on /quote, /contact, legal pages, 404. The gold pill is the bar's only gold and substitutes for the nav CTA on mobile viewports (nav CTA hidden < md to keep budget = 1 fixed gold on mobile).
**Used by:** layout (global).

### 3.4 `Eyebrow.tsx` — server (+optional client reveal wrapper)
```ts
type EyebrowProps = { children: React.ReactNode; gold?: boolean; as?: "span"|"p"|"h2"; className?: string };
```
`text-label uppercase flex items-center gap-4 before:content-[''] before:h-px before:w-16 before:bg-current` — the Æbele attached-hairline label. Default color: `text-graywarm-deep` on paper / `text-paper/60` on ink (via currentColor). `gold` variant: `text-gold-dim` on paper / `text-gold` on ink, hairline `bg-gold/70` — label+hairline counts as ONE gold element. Reveal (when wrapped in `Rise`): hairline `scaleX 0→1` origin-left 0.8s `EASE.out`, label fades up 0.3s later.
**Used by:** every section opener on every page.

### 3.5 `SectionRule.tsx` / `BirdMark.tsx` — server
```ts
type SectionRuleProps = { ground?: "ink"|"paper" };            // plain full-width hairline
type BirdMarkProps = { ground?: "ink"|"paper" };               // hairline interrupted by the bird
```
`BirdMark`: full-width flex row — hairline half, `<Image src="/images/brand/doctor-bird-flight.png" width={40} height={28} alt="" />`, hairline half. The bird PNG is gold-toned: **BirdMark counts as the viewport's 2nd gold element; max once per page.**
**Used by:** the §4 page specs are canonical — currently only About §4.2.5 places a BirdMark. Nowhere else; never place one where the viewport already spends its 2nd gold.

### 3.6 `LineReveal.tsx` — "use client" (THE RISE)
```ts
type LineRevealProps = {
  as?: "h1"|"h2"|"h3"|"p";
  lines: React.ReactNode[];        // hand-authored line breaks; each entry = one masked line
  delay?: number;                  // base delay, default 0.2
  className?: string;              // type scale classes applied to the element
};
```
Each line: wrapper `style={{clipPath:"inset(0 0 -0.2em 0)"}}` (the -0.2em protects Omnibus descenders), inner `m.span` from `y: "110%"` to `0`, `{duration: DUR.slower, ease: EASE.out, delay: delay + i * STAGGER.lines}`, driven by `whileInView` + `VIEWPORT` (or `animate` when `immediate` on heroes). Reduced motion: single 0.3s opacity fade, no transform.
**Used by:** every H1 and every section H2 sitewide.

### 3.7 `ClipReveal.tsx` — "use client"
```ts
type ClipRevealProps = { children: React.ReactNode; direction?: "up"|"left"; delay?: number; className?: string };
```
Photo wipe: parent `clipPath inset(100% 0 0 0)` (or `0 0 0 100%` for "left") → `inset(0)` 1.1s `EASE.out`; child image pre-scaled 1.18 settling to 1 over 1.4s same ease (wipe finishes first, image keeps settling — the cinematic beat). `whileInView` once. Direction rule: `up` for portrait/square crops, `left` for wide landscape. Reduced motion: opacity fade.
**Used by:** every framed (B-state) photo — about values, services index thumbs (mobile), drivers, prev/next cards.

### 3.8 `Parallax.tsx` — "use client"
```ts
type ParallaxProps = { children: React.ReactNode; range?: number; className?: string }; // range = % drift, default 8
```
Wrapper `relative overflow-hidden`; child layer `absolute inset-0 h-[120%] -top-[10%] will-change-transform`; `useScroll({target, offset:["start end","end start"]})` → `y: -range% → +range%`, linear mapping (no spring). Full-bleed bands only; never on framed images. Disabled under reduced motion.
**Used by:** PhotoBand, PageHero photo variant, NextService.

### 3.9 `Rise.tsx` — "use client" (the workhorse reveal)
```ts
type RiseProps = { children: React.ReactNode; delay?: number; as?: keyof JSX.IntrinsicElements; className?: string };
type RiseGroupProps = { children: React.ReactNode; stagger?: number; className?: string }; // variants parent, staggerChildren
```
`initial={{opacity:0, y:32}} whileInView={{opacity:1, y:0}} viewport={VIEWPORT} transition={{duration:0.7, ease:EASE.out}}`. Groups cap stagger at 5 children (beyond 5, stagger drops to 0.05).
**Used by:** every body block, ledger row, fact row, card grid sitewide.

### 3.10 `HeroVideo.tsx` — "use client" (port v1 logic, restyle)
```ts
type HeroVideoProps = { children: React.ReactNode }; // children = headline block + frame furniture
```
Copy the working v1 mechanics from `components/concept/HeroVideo.tsx`: poster `/images/stock/kul-hero-poster.jpg` paints first — render it as a `priority` `next/image` layer (`sizes="100vw"`) under the video; it is the page's LCP element and must never be occluded at first paint; defer `<video>` src attach until idle/intro-cleared; `/videos/kul-hero-720.mp4` on ≤768px viewports else `/videos/kul-hero.mp4`; `autoPlay muted loop playsInline preload="none"`; IntersectionObserver pauses off-screen; reduced-motion = poster only. New in v2: `.scrim-hero` overlay layer; a scroll-out scrub — section is `h-[130svh]` with a sticky inner `h-svh`, `useScroll` maps progress 0→1 to video `scale 1 → 0.95` and headline `y: 0 → -8vh`, `opacity 1 → 0` on the last 30% (one of home's two allowed scrubs). Children render into the sticky frame.
**Used by:** home only.

### 3.11 `HeroFrame.tsx` — server
```ts
type HeroFrameProps = { bottomLeft?: React.ReactNode; bottomRight?: React.ReactNode };
```
Absolutely-positioned corner furniture inside any hero: slots pinned `bottom-[5vh]` `inset-x-[clamp(20px,5vw,90px)]`, micro type paper/60, and the furniture MUST sit inside the hero's `.scrim-b`/`.scrim-hero` zone (readable micro over raw video/photo fails contrast — §2.1 opacity floor). Default bottomLeft: `LOGANVILLE, GA — 33.83°N / 83.90°W` (from site.json geo). Default bottomRight: **ScrollCue** — 48px vertical 1px line, `scaleY` looping 0→1 origin-top then 1→0 origin-bottom, 2.2s ease-in-out infinite, `SCROLL` label rotated 90°, paper/40, whole cue `aria-hidden` (pure decoration; never gold). CSS-only loop; hidden under reduced motion.
**Used by:** home hero, drivers hero, about hero.

### 3.12 `PageHero.tsx` — server + small client bits
```ts
type PageHeroProps = {
  variant: "photo" | "split" | "compact";
  eyebrow?: string;
  titleLines: string[];                    // fed to LineReveal
  deck?: string;                           // one supporting sentence
  image?: { src: string; alt: string };    // required for photo/split
  height?: "45" | "60" | "80";             // svh, photo variant; default 60
  index?: string;                          // e.g. "03 / 07" for service details
  children?: React.ReactNode;              // CTAs etc.
};
```
- **photo**: full-bleed `img-grade` image (`priority`, `sizes="100vw"`) + `Parallax(6)` + `.scrim-b`; title block anchored LOWER-LEFT (`pb-[10vh]`), Eyebrow above, LineReveal H1 in display-l, deck below in body-l `text-paper/80 max-w-[52ch]`; optional index in micro top-right of the block. NEVER a lone floating title (v1's empty-hero failure is banned).
- **split** (trucknroll editorial, ink ground, no photo-bleed): 2-col grid — left col photo `aspect-[5/3]` with ClipReveal + small intro paragraph `max-w-[320px]` beneath; right col the H1 at display-l with the LAST line containing an inline photo chip (`h-[0.9lh] aspect-[470/250] overflow-hidden` flex-grow div with a second image) — spec the chip only where the section spec says so.
- **compact**: ink band `min-h-[38svh] pt-32 pb-band-sm`, Eyebrow + LineReveal H1 + deck. No image. For conversion/legal pages.
**Used by:** every interior page.

### 3.13 `StatBlock.tsx` (FactRow) — server. STATIC FACTS, NO ANIMATION OF VALUES.
```ts
type Fact = { label: string; value: string; href?: string };   // href e.g. SAFER link
type StatBlockProps = { facts: Fact[]; ground?: "ink"|"paper"; columns?: 2|3|4 };
```
Grid with vertical hairline dividers (`divide-x divide-white/12` on ink, `divide-ink/15` on paper). Value in Omnibus h3, tabular-nums, NEVER animated (USDOT/MC law); label in micro at 60% above it (§2.1 opacity floor). Whole row enters as one `Rise`. Allowed facts sitewide (the complete honest list — page agents pick from these, never add numbers): `USDOT — 7638788`, `MC — 66389691`, `LICENSED & INSURED — Auto liability + cargo`, `HOME BASE — Loganville, GA`, `COVERAGE — Southeast based · Nationwide authority`, `DISPATCH — 24/7 · 678-972-1148`, `QUOTES — Same business day`, `VISION — 50 tractors by end of 2029`.
**Used by:** home proof, safety, services details, carrier-packet, contact.

### 3.14 `ServiceIndex.tsx` — "use client"
```ts
type ServiceIndexProps = { services: Service[] };  // from lib/services (content/services.json)
```
Paper ground. One row per service (all 7): `border-t border-ink/15` full-bleed rows, `py-[clamp(20px,4vh,44px)]`, grid: index `01`–`07` (micro, tabular, `text-ink/40`) | name in Omnibus `clamp(2rem, 5.5vw, 4.5rem)` | `short` field right-aligned Montserrat 14px `text-graywarm-deep max-w-[36ch]` (desktop only) | arrow glyph. Hover (pointer:fine only): hovered row text indents `x: 12px` and siblings dim to 40% (0.45s in / 0.2s out `EASE.micro`); a SINGLE shared floating preview panel (`w-[260px] aspect-[4/5] overflow-hidden`) follows the cursor via `useMotionValue` + `useSpring({stiffness:150, damping:20})`, swapping `next/image` src per row (all 7 images preloaded on section mount, `sizes="260px"` — never full-viewport renditions for a 260px panel), rotation ±6° from spring velocity (`useVelocity`+`useTransform`), show/hide 0.2s. Rows link to `/services/[slug]`. Mobile / pointer:coarse / reduced-motion: no follower — each row shows a static 16:9 `ClipReveal` thumb (`sizes="100vw"`) above the name. Row text never gold.
**Used by:** /services only.

### 3.15 `PhotoBand.tsx` — server + Parallax
```ts
type PhotoBandProps = {
  image: { src: string; alt: string };
  eyebrow?: string; titleLines: string[]; body?: string;
  align?: "left" | "right";            // text column placement, cols 2–7 or 7–12
  cta?: { label: string; href: string; style: "gold"|"ghost" };
  minH?: string;                        // default "min-h-[80svh]"
  melt?: boolean;                       // adds .melt-b so the band dissolves into ink below
};
```
Full-bleed A-state band: `img-grade` image (`sizes="100vw"`) + `Parallax(8)` + `.scrim-b` (+`.melt-b` when `melt`); content column on the 12-col grid at `align`, bottom-anchored; Eyebrow + LineReveal (display-l) + optional 2-line body (`text-paper/75`, ≤2 lines — body-on-photo stays inside the scrim zone) + optional single CTA. Gold ledger: if `cta.style==="gold"` OR `eyebrow` is gold — never both.
**Used by:** home (vision, drivers), about hero alternative, drivers (home base), safety.

### 3.16 `QuoteStrip.tsx` — "use client" (VistaJet booking row → `/api/quote`)
```ts
type QuoteStripProps = { ground?: "ink"|"paper"; heading?: string; headingLevel?: "h2"|"h3" };  // default heading "Send a lane. A person prices it."; headingLevel defaults to "h2" (rendered at h3 visual scale) so the strip never breaks heading order — §2.1
```
One segmented horizontal row on ≥md (stacked fields on mobile — the row NEVER crushes below md): `ORIGIN (city, state)` | `DESTINATION` | `FREIGHT TYPE` (select fed from services.json names + "Not sure") | `PICKUP DATE` (`type="date"`, `min` = today) | `EMAIL OR PHONE` | circular submit button with arrow →. Fields divided by vertical hairlines, no boxes; micro labels above each; underline focus choreography from the field system (3.20). Submits via the existing `useFormSubmit` semantics to `/api/quote` with EXACT names `origin, destination, freightType, pickupDate, contact` + `<Honeypot/>` (`botcheck`); `details` omitted (optional in API). Inline status line below (FormStatus semantics): success swaps the strip for a one-line editorial confirmation — `"Your lane is with dispatch. Same business day."` + `tel:` fallback — via AnimatePresence 0.4s. Submit arrow button is gold (`btn-gold` circle) = the section's 2nd gold. Micro trust line under the row: `PRICED BY A PERSON · SAME BUSINESS DAY · USDOT 7638788 · MC 66389691`.
**Used by:** home §2, services §4. (The /quote page uses the full `QuoteForm`, not the strip.)

### 3.17 `FaqAccordion.tsx` — "use client"
```ts
type FaqAccordionProps = { items: {q:string; a:string}[]; ground?: "ink"|"paper"; jsonLd?: boolean };
```
Hairline rows (`border-t`, last `border-b`), question in Omnibus h3-small (20px floor), plus-glyph rotating 45° 0.3s `EASE.micro`; panel height `0 → auto` 0.4s; one open at a time; semantic buttons + `aria-expanded`. When `jsonLd`, emits FAQPage schema. No gold.
**Used by:** home (5 items), quote (3 items: quote speed, licensed/insured, updates), drivers (1–2 driver items inline is fine).

### 3.18 `CtaBand.tsx` — "use client" (page endings — EVERY page ends differently via variant)
```ts
type CtaBandProps = {
  variant: "quote" | "drive" | "packet" | "verify" | "call" | "next";
  next?: { label: string; href: string; image?: {src:string; alt:string} }; // for "next"
};
```
- **quote** (home): `min-h-[92svh]` ink, centered-left — LineReveal display-xl `"Ready" / "to move?"` + one oversized text link `Request a quote →` with gold hairline underline wipe (2nd gold) + micro line `Same business day · Dispatch 678-972-1148`.
- **drive** (unused on v2 home; available): display-l `"Drive something worth driving."` + ghost CTA → /drivers.
- **packet** (services index): display-l `"Brokers: the full packet, same business day."` + ghost CTA → /carrier-packet + micro `One email. USDOT 7638788 · MC 66389691.`
- **verify** (safety): display-l `"Look us up. We encourage it."` + ghost link → FMCSA SAFER (external, `https://safer.fmcsa.dot.gov/`) + secondary text link → /quote.
- **call** (drivers): display-l `"Talk lanes, home time, equipment."` + phone number `678-972-1148` set in Omnibus display-l as a `tel:` link (the number IS the design object); beneath the number a full-width SVG hairline **draws itself** left→right (`pathLength 0→1`, 1.1s `EASE.kul`, whileInView once, paper/60) — the interior pages' one signature flourish, used nowhere else; + micro `A person calls back. Usually the owner.` — no gold; ink ground.
- **next** (about, services/[slug]): full-bleed `h-[70svh]` link — dimmed `img-grade` image (opacity layer `bg-ink/55`, hover → `/35` + image `scale 1.05` 0.7s), eyebrow `NEXT` + destination name in display-xl, whole section one `<Link>`, `Parallax(6)`. Prefetched.
All variants: content enters via LineReveal + Rise. CtaBand sits directly above the curtain footer.
**Used by:** every page except quote/contact/legal/404 (they end leaner — see specs).

### 3.19 `GhostNumeral.tsx` — server
```ts
type GhostNumeralProps = { children: string; className?: string }; // e.g. "01", "2029", "404"
```
`aria-hidden select-none absolute` Omnibus at `clamp(8rem, 16vw, 15rem)` leading-none, `text-paper/[0.06]` on ink / `text-ink/5` on paper (never gold), positioned by the caller, `z-0` behind content. Optional slow drift: `y ±24px` scrubbed linearly on section progress.
**Used by:** TruckChapters, about growth ledger, drivers deal ledger, 404, services detail hero index.

### 3.20 Form field system — CREATE inside `components/forms/` (submission logic untouched)
`Field`, `SelectField`, `TextareaField` do NOT exist yet — create them (today `components/forms/FormShell.tsx` only exports `Label`, `SubmitButton`, `FormStatus`, `Honeypot`, `useFormSubmit`). Rewrite `QuoteForm`/`DriverForm`/`ContactForm` markup around the new primitives — allowed, provided POST endpoints, field `name`s, honeypot, and `useFormSubmit`/`FormStatus` semantics are preserved verbatim.
- Resting: no boxes — transparent bg, `border-b border-ink/15` (paper) / `border-white/18` (ink), input Montserrat 17px, row height 64px, 40px field rhythm.
- Label: micro, ABOVE the line, 60% opacity (never placeholder-as-label; §2.1 floor).
- Focus choreography: label lifts 2px → full opacity; a 1.5px line in full-strength `currentColor` ink/paper (`bg-ink` on paper ground, `bg-paper` on ink ground) `scaleX 0→1` origin-left 0.45s `EASE.micro` over the resting hairline; caret inherits. **The focus underline is NEVER gold** — motion is the focus signal, not color; the form viewport's only gold is the submit pill (nav CTA + gold focus + gold submit would blow the §2.7 budget while typing).
- Error: line+label to `#8C3B2E` desaturated brick, message slides down 4px in micro, 0.25s. Inline `aria-invalid` on blur; focus-to-first-error on submit.
- Select: same underline + chevron rotating 180°; native `<select>` styled bare (no new deps).
- Submit: `btn-gold` pill; on submitting, label rolls up to "SENDING…" (masked swap 120ms); success = editorial takeover panel (AnimatePresence swaps the whole form): serif headline `"It's with dispatch."`, echo of the submitted lane/name in body-l, mono line `"A person replies the same business day."`, `tel:` fallback; panel scrolls into view on mobile.
- QuoteForm layout upgrade (fields/names unchanged): numbered groups `01 THE LANE` (origin/destination side-by-side), `02 THE FREIGHT` (freightType/pickupDate), `03 REACH YOU` (contact + optional details), group labels in micro with tiny tabular indices. Add `min={today}` to pickupDate. DriverForm: same system, `experience` select unchanged.
**Used by:** quote, contact, drivers, (QuoteStrip reuses Field internals).

### 3.21 `TruckChapters.tsx` — "use client" (THE signature set piece; feasible 2D build)
```ts
type Chapter = { index: string; slug: string; eyebrow: string; title: string; body: string; image: {src:string; alt:string} };
type TruckChaptersProps = { chapters: Chapter[] };  // home passes exactly 4 (below)
```
**Structure:** section `h-[400vh]` (4 chapters × 100vh) on ink; inner `sticky top-0 h-svh` stage, 12-col grid.
**Right (cols 7–12, full height):** the pinned truck: all 4 photos absolutely stacked (`img-grade`, `sizes="(min-width:768px) 50vw, 100vw"`, `.melt-b` toward the left edge via a horizontal gradient `linear-gradient(90deg, #0B0B0B 0%, transparent 30%)` so text never fights the photo), cross-fading by chapter — active image `opacity 1, scale 1.04→1` over 0.6s `EASE.kul`, others 0. This is the "truck rotating between angles" read, built from four different gold-lit angles.
**Left (cols 1–6, centered):** persistent header (eyebrow `WHAT WE MOVE` + h2 `"Seven services." / "One standard."` + hairline) stays pinned; below it the four chapter blocks are ABSOLUTELY STACKED in a relative container and crossfade directly — active block `opacity 1, y 0` (enter 0.45s `EASE.out` from `y:24`), inactive `opacity 0, y:-24` (exit 0.12–0.15s). **Do NOT use `AnimatePresence mode="wait"`** — wait-mode queues exit+enter pairs and under flick-scroll leaves the copy ~0.7s behind the image crossfade. Block content: gold eyebrow (service tagline — the viewport's 2nd gold), service name in h2, `short` copy, `+ MORE` `link-hairline` → `/services/[slug]`. Behind the block: `GhostNumeral` `01…04` cross-fading with a slower 0.6s.
**Drive:** `useScroll({target: section, offset:["start start","end end"]})`; chapter index = `useTransform(progress, v => Math.min(3, Math.floor(v*4)))` consumed via `useMotionValueEvent` into state — the handler always sets the LATEST computed index directly (never step through intermediate chapters; fast scrolls jump straight to the final index). A 1px progress hairline under the persistent header scales `0→1` across the whole section (paper/30, `aria-hidden`, not gold).
**Footer of stage:** micro link `ALL SEVEN SERVICES →` bottom-left.
**Mobile (<md), reduced motion, AND the §5.2.1 all-viewports fallback:** no pinning — render 4 stacked bands (image 16:9 + text below). The stacked version must RETAIN the section's signature beats, not degrade to generic reveals: (a) each band's image enters with a dedicated crossfade-settle (`opacity 0→1, scale 1.06→1`, 0.8s `EASE.kul`, whileInView once — not the stock ClipReveal), (b) ghost numeral behind each band, (c) a 1px progress hairline at the section top tracks section scroll linearly (paper/30, `aria-hidden`). These three beats are what keep the section signature-grade if the pinned version is ever flagged off. 
**Home chapter data (exact):**
1. `01 / dry-van` · eyebrow "The workhorse, run with discipline." · title "Dry Van" · body = services.json `dry-van.short` · image `/images/stock/hero-semi-truck-dusk-mountains.jpg`
2. `02 / reefer` · "Cold chain, unbroken." · "Reefer" · `reefer.short` · `/images/stock/hero-alt-semi-night-gold-lights.jpg`
3. `03 / dedicated` · "Your lane. Our promise. Every week." · "Dedicated" · `dedicated.short` · `/images/stock/driver-in-cab-gold-truck.jpg`
4. `04 / expedited` · "When it cannot wait." · "Expedited" · `expedited.short` · `/images/stock/road-night-light-trails.jpg`
**Used by:** home only. Never a second pinned section on the same page.

### 3.22 `RouteVeil.tsx` — "use client" (page transition)
```ts
type RouteVeilProps = { children: React.ReactNode }; // wraps page content in (site)/layout
export function useVeilState(): { navigating: boolean; heroDelay: number }; // context hook, exported from RouteVeil
```
Fixed ink panel `z-[100]`. **Implementation is click interception — an enter-only veil keyed on pathname CANNOT work** (it only fires after the new route has committed and rendered: new page flashes → veil covers it → re-reveals it, worse than no transition). Correct sequence: a capture-phase click listener on the layout wrapper intercepts same-origin, same-tab `<a>` clicks (skip modified/middle clicks, `target="_blank"`, downloads, hash-only changes, the current pathname); `preventDefault()` → veil wipes IN `scaleY 0→1` origin-bottom 0.45s `EASE.inout` over the CURRENT page, Doctor Bird mark (`doctor-bird-flight.png`, h-8, centered) fades in 0.15s → at full cover call `router.push(href)` + `window.scrollTo(0,0)` → when `usePathname()` reports the new route, veil wipes OUT `scaleY 1→0` origin-top 0.6s. Safety valve (mandatory): if the pathname hasn't changed 1.5s after push, force the veil out — never trap the user behind ink. Back/forward (popstate) navigations get NO veil — instant swap. **Hero coordination:** RouteVeil provides `useVeilState()` context — `heroDelay` is `0.35` while a veil-out is in flight (heroes start their LineReveal 0.1s before the veil fully clears; overlap feels expensive) and `0` on first load / popstate; hero components read `heroDelay` instead of hardcoding delays. Skipped entirely under reduced motion (plain `router.push`, no veil). First-visit intro film: keep the existing `LoadingOverlay` in `app/layout.tsx` but (a) gate to first visit EVER (`localStorage` flag), (b) mount it only post-first-paint from a client `useEffect`/idle callback so the hero poster paints and is measured as LCP BEFORE the film appears — crawlers, Lighthouse, and no-JS visitors must never see the film occlude LCP (the v1 "hidden LCP" audit failure), (c) cap the total film ceremony at ≤2.5s with a visible skip. RouteVeil never replays it.
**Used by:** layout.

### 3.23 `Grain.tsx` — server
Zero-prop; the fixed feTurbulence layer from §2.6. Mounted once in `(site)/layout`.

### 3.24 `ProcessStrip.tsx` — "use client"
```ts
type ProcessStripProps = { steps: { label: string; line: string }[]; ground?: "ink"|"paper" }; // exactly 3 steps
```
Horizontal 3-step strip (vertical rail stacked below md): step labels in `label` scale, one supporting line each in body 15px; a connecting 1px rule draws `scaleX 0→1` origin-left 0.8s `EASE.out` on enter (whileInView once), steps Rise-stagger after it. No gold. ONE shared component — safety and drivers must NOT hand-roll divergent versions of this pattern.
**Used by:** safety §4.5.4, drivers §4.6.4.

### 3.25 `CopyButton.tsx` — "use client"
```ts
type CopyButtonProps = { value: string; label?: string }; // default label "COPY"
```
Clipboard write + masked label swap "COPY"→"COPIED" (AnimatePresence roll, 0.2s `EASE.micro`), revert after 1.6s; if `navigator.clipboard` is unavailable, select the adjacent text instead; `aria-live="polite"` announces the state change. THE single clipboard primitive — three pages need it; never hand-roll.
**Used by:** Footer dispatch strip (§3.2), carrier-packet request card (§4.7.2), contact directory (§4.9.2).

### 3.26 Killed / not built (do not create): GoldGlass v2, marquee, preloader counter, magnetic buttons, 3D bird mount in chrome (the `.glb` may appear at most once per page; v2 uses it NOWHERE by default — decision: the PNG marks carry the bird; the 2MB GLB isn't worth its LCP cost on any v2 page), character shuffle, cursor dots, Lottie, sound.

---

## 4. PAGE-BY-PAGE SECTION SPECS

Global rules for every page: sections declare `data-ground="ink"|"paper"` (nav theme + component color context). First section always provides top padding clearance for the fixed nav. Every page ends with its specified CtaBand (or lean ending) → curtain Footer. Gold ledger lines list what spends the per-viewport budget BEYOND the fixed nav/mobile-bar CTA. All copy strings below are final unless marked (json) meaning pull from the content file verbatim. Heading law (§2.1): exactly one `h1` per page, no level skips in DOM order — where a spec calls for a small heading before the page's first h2, render an h2 at the smaller visual scale.

### 4.1 HOME — `app/(site)/page.tsx`
1. **Hero** — ink. `HeroVideo` (130svh w/ sticky svh frame, scroll-out scrub = scrub 1 of 2). Content lower-left on the grid (cols 1–8): `Eyebrow` (not gold, paper/60): `KUL ENTERPRISES · FREIGHT CARRIER`; `LineReveal` display-xl, 2 lines: `"Strength"` / `"in Motion."` (site.json taglineLines[0]); deck (body-l, paper/80, max 52ch): `"A Georgia freight carrier built on integrity and driven by safety — Southeast based, nationwide service."` (recomposes tagline+serviceArea, no new claims); CTA row: `btn-gold` `REQUEST A QUOTE` → /quote + `btn-ghost-dark` `DRIVE WITH KUL` → /drivers. `HeroFrame`: bottomLeft coordinates line, bottomRight ScrollCue. Timing: LineReveal base delay = `useVeilState().heroDelay` (§3.22) + 0.2s, CTAs at +0.45s, furniture +0.6s. **Gold: hero gold CTA (nav CTA is at `top` state = transparent chrome; total 2).**
2. **Quote strip** — paper, `py-band-sm`. `QuoteStrip` with heading `"Where is it going?"` (default `headingLevel="h2"` at h3 scale — the page's first h2; an h3 here would skip levels after the hero h1). **Gold: strip submit circle.**
3. **Manifesto** — paper (continues the paper zone), `py-band`. Cols 2–10: `Eyebrow gold`: `THE CARRIER`; `LineReveal` h2, 3 lines: `"Freight is a promise"` / `"with a deadline."` / `"We keep both."`; body (62ch, graywarm-deep): `"KUL started on the road. Years of long hauls taught our founder what freight really is: someone's livelihood, on a schedule. That experience rides along on every load we move."` (site.json stories[every-mile].body, lightly trimmed — keep json wording). **Gold: the eyebrow.**
4. **Truck Chapters** — ink, 400vh pinned (scrub 2 of 2). `TruckChapters` with the 4 chapters from §3.21. **Gold: active chapter eyebrow (one at a time).**
5. **Proof** — paper, `py-band-sm` ("the paperwork moment"). `Eyebrow`: `AUTHORITY & INSURANCE` (not gold); `LineReveal` h2: `"Look us up"` / `"before you call us."`; body: `"We operate under full federal authority with auto liability and cargo coverage. Verify us anytime on the FMCSA SAFER system — we encourage it."` (from faq.json item 3, reworded, no new facts); `StatBlock` 4-up: USDOT / MC / LICENSED & INSURED / HOME BASE (values §3.13); `link-hairline` `VERIFY ON FMCSA SAFER ↗` (external). **Gold: none (zero-gold section; nav pinned state may show CTA — budget holds).**
6. **Vision band** — photo/ink. `PhotoBand` image `/images/photos/tree-open-landscape.jpg` (nature allowed: statement beat), `melt`, align left: eyebrow `THE VISION` (not gold); titleLines `["Rooted deep.", "Built to grow."]` (site.json stories[roots].title split); body: `"Fifty tractors by the end of 2029 — one kept promise at a time."` (site vision, already public copy); no CTA. **Gold: none.**
7. **FAQ** — paper, `py-band-sm`. `Eyebrow gold`: `STRAIGHT ANSWERS`; h2 LineReveal: `"Asked often."` ; `FaqAccordion` items = faq.json items 1,2,3,4,8 (quote speed, what we haul, licensed, where we run, updates), `jsonLd`. **Gold: eyebrow.**
8. **Drivers band** — photo/ink. `PhotoBand` image `/images/stock/driver-portrait-semi-cab-night.jpg`, align right: eyebrow `DRIVE WITH KUL` (not gold); titleLines `["Driven by people", "who keep their word."]`; body: `"CDL-A, Southeast regional and OTR. The most important delivery on any route is the driver coming home."` (fuses stories[driven-by-safety] line); CTA ghost `DRIVE WITH KUL` → /drivers. **Gold: none (ghost CTA).**
9. **Ending** — `CtaBand variant="quote"` (§3.18). **Gold: the underlined quote link.**
→ curtain Footer.

### 4.2 ABOUT — `app/(site)/about/page.tsx`
1. **Hero** — `PageHero variant="photo"` height 80, image `/images/photos/cliffs-over-water.jpg` (the About opener photo), eyebrow `OUR STORY`, titleLines `["Trust is in", "our DNA."]`, deck `"Built from miles, not meetings."`. `HeroFrame` coordinates. **Gold: none.**
2. **Founder manifesto** — paper `py-band-lg`. Cols 3–10: `Eyebrow gold`: `THE JOURNEY` (site.json stories[every-mile].eyebrow); LineReveal h2 3 lines: `"Every mile teaches"` / `"something new."` (json title split); body body-l = stories[every-mile].body (json, full); attribution micro: `FOUNDER · KUL ENTERPRISES · LOGANVILLE, GA` under a 24px `rule-ink`. **Gold: eyebrow.**
3. **Growth ledger** — ink `py-band`. `Eyebrow`: `ON PURPOSE` (paper/60); h2 LineReveal: `"We grow load by load."`; three brace-numbered columns `{01} AUTHORITY` — `"Federal operating authority, active. USDOT 7638788 · MC 66389691."` / `{02} HOME` — `"Based in Loganville, Georgia. The Southeast is a home route; the authority is nationwide."` / `{03} THE MARK` — `"Fifty tractors by the end of 2029. Growth that never outruns the service."` Braces+indices in paper/40, `aria-hidden` decoration (NOT gold), values static; columns `border-t border-white/12`, Rise stagger. GhostNumeral `2029` behind col 3. **Gold: none.**
4. **Values, framed** — paper `py-band`. Three alternating rows (B-state framed images, `ClipReveal`, text beside NEVER on photo): 
   a. stories[integrity] (json eyebrow/title/body) + image `/images/photos/river-through-forest.jpg` `aspect-[16/9]`, image left / text right.
   b. stories[strength-in-motion] + `/images/photos/ocean-waves-rocks.jpg`, text left / image right.
   c. stories[driven-by-safety] + `/images/photos/desert-rock-formation.jpg`, image left / text right.
   Each row: Eyebrow (not gold) + h3 title + body. **Gold: none.**
5. **BirdMark** divider → **2029 close** — ink `py-band-lg`. Centered cols 3–10: GhostNumeral `2029` behind; LineReveal display-l: `"Fifty tractors."` / `"One kept promise"` / `"at a time."`; micro line `THE SERVICE NEVER FALLS BEHIND THE NAME ON THE DOOR` (stories[roots] paraphrase). **Gold: the BirdMark.**
6. **Ending** — `CtaBand variant="next"` next=`{label:"Services", href:"/services", image:{src:"/images/stock/hero-semi-truck-dusk-mountains.jpg", alt:"A tractor-trailer crossing a mountain road at dusk"}}`. **Gold: none.**

### 4.3 SERVICES INDEX — `app/(site)/services/page.tsx`
1. **Hero** — `PageHero variant="split"` on ink: left photo `/images/stock/hero-semi-truck-dusk-mountains.jpg` (5/3, ClipReveal) + intro paragraph `max-w-[320px]`: `"Seven ways to move full truckloads, one standard behind all of them: straight answers, clean equipment, deadlines that hold."`; right H1 display-l 3 lines: `"SEVEN WAYS"` / `"TO MOVE"` / `"FREIGHT."` with the inline photo chip in line 3 using `/images/stock/road-night-light-trails.jpg`. Eyebrow above H1: `SERVICES` (paper/60). **Gold: none.**
2. **Service index** — paper. `ServiceIndex` with all 7 from services.json in json order (power-only, dry-van, reefer, dedicated, regional, expedited, otr). **Gold: none (hover preview is photography).**
3. **The standard** — ink `py-band`. `Eyebrow gold`: `EVERY LOAD`; h2 LineReveal: `"Different freight."` / `"Same discipline."`; three columns (Rise stagger, `border-t border-white/12`): `CONFIRMED IN WRITING` — `"Rates, appointments, and trailer condition — documented, not assumed."` / `ONE DISPATCH LINE` — `"One call gets an answer, 24/7. 678-972-1148."` / `PROACTIVE ETAS` — `"If anything changes in transit, you hear it from us first."` (all recomposed from services.json commitments + faq — no new claims). **Gold: eyebrow.**
4. **Quote strip** — paper `py-band-sm`. Plain `SectionRule` above (NOT BirdMark — it would collide with the strip's gold submit in one viewport), then `QuoteStrip` heading `"Send the lane. Same business day."`. **Gold: strip submit circle.**
5. **Ending** — `CtaBand variant="packet"`. **Gold: none (ghost CTA).**

### 4.4 SERVICE DETAIL — `app/(site)/services/[slug]/page.tsx` (7 slugs, `dynamicParams=false`)
All copy from services.json for the slug. `next` = next service in array order, circular.
1. **Hero** — `PageHero variant="photo"` height 60, image = service.image (json), eyebrow = `SERVICE {index+1} OF 7` (micro pairs with `index` prop `0X / 07` top-right), titleLines = [service.name], deck = service.tagline. **Gold: none.**
2. **Overview deck** — paper `py-band`. Cols 2–9: service.description set as body-l deck at `clamp(1.25rem, 1.05rem + 1vw, 1.75rem)` Montserrat 400 leading-relaxed (a "deck", not display serif — Omnibus stays ≥20px display only); `Eyebrow gold` above: `{service.tagline}` uppercase. **Gold: eyebrow.**
3. **Fit & commitments ledger** — ink `py-band`. Two columns under hairline heads: `BEST FOR` → service.bestFor as hairline-divided rows (Rise stagger, each row: 15px Montserrat, `border-t border-white/12`, py-5); `OUR COMMITMENTS` → service.commitments same treatment. GhostNumeral `0{index+1}` behind the section top-left. **Gold: none.**
4. **Proof strip** — paper `py-band-sm`. `StatBlock` 3-up: USDOT / MC / `QUOTES — Same business day`; plus micro line `TIME-CRITICAL? CALL DISPATCH 24/7 — 678-972-1148` as `tel:` `link-hairline`. **Gold: none.**
5. **Ending** — `CtaBand variant="next"` next = next service `{label: nextService.name, href: /services/{nextSlug}, image: nextService.image}`. A slim `PREVIOUS: {prev.name}` micro link sits above it. **Gold: none.** (Detail pages are near-zero-gold pages; the chrome CTA carries conversion.)

### 4.5 SAFETY — `app/(site)/safety/page.tsx`
1. **Hero** — `PageHero variant="photo"` height 60, image `/images/stock/driver-in-cab-gold-truck.jpg`, eyebrow `SAFETY & COMPLIANCE`, titleLines `["No load", "outranks a life."]`, deck `"The most important delivery on any route is the driver coming home."` (stories[driven-by-safety] line, json). **Gold: none.**
2. **Credentials document** — paper `py-band-sm`. h2 LineReveal: `"On the record."`; `StatBlock` 4-up: USDOT / MC / LICENSED & INSURED / DISPATCH 24/7; body under: `"Verify our authority anytime on the FMCSA SAFER system, and request a certificate of insurance with your company listed as holder."` (faq.json item 3, json); `VERIFY ON SAFER ↗` link-hairline. **Gold: none.**
3. **Pillars ledger** — ink `py-band`. `Eyebrow gold`: `NOT UP FOR NEGOTIATION` (stories[driven-by-safety] phrase); four full-width numbered rows (ledger style, `border-t border-white/12`, GhostNumeral index behind each row start): `01 PRE-TRIP, EVERY TRIP` — `"Inspections before the wheels turn. Clean, DOT-compliant equipment on every dispatch."` / `02 LEGAL HOURS` — `"Hours-of-service discipline. Speed inside the rules — fast, never reckless."` / `03 WEATHER CALLS MADE EARLY` — `"And on the side of caution."` / `04 SEALED & DOCUMENTED` — `"Load bars, straps, and seals; trailer condition documented at pickup and delivery."` (all recomposed from services.json commitments + stories — no new claims). Rows hover-indent 12px. **Gold: eyebrow.**
4. **Before every mile** — paper `py-band-sm`. h2: `"Before every mile."`; `ProcessStrip` (§3.24) steps: `PRE-TRIP` → `IN TRANSIT` → `AT DELIVERY`, one line each: `"Equipment inspected, setpoints confirmed in writing."` / `"Milestone updates at pickup, in transit, and delivery."` / `"Signed, documented, closed out."` (faq/services recompose). **Gold: none.**
5. **Ending** — `CtaBand variant="verify"`. **Gold: none.**

### 4.6 DRIVERS — `app/(site)/drivers/page.tsx` (StickyMobileBar variant="drivers")
1. **Hero** — `PageHero variant="photo"` height 80, image `/images/stock/driver-portrait-semi-cab-night.jpg`, eyebrow `DRIVE WITH KUL`, titleLines `["Drive something", "worth driving."]`, deck `"CDL-A · Southeast regional & OTR · A thirty-second form, then a real call back."` (faq item 6 recompose), children: `btn-gold` `START THE CONVERSATION` → `#apply` + micro `tel:` link `OR CALL 678-972-1148`. `HeroFrame` cue. **Gold: hero CTA (nav CTA hidden <md; on desktop nav is `top` transparent — total 2).**
2. **The deal ledger** — ink `py-band`. `Eyebrow`: `WHAT YOU GET` (paper/60); four full-width numbered rows (GhostNumeral 01–04 behind, hairline-divided, Rise): `01 A NAME, NOT A NUMBER` — `"You are a professional. Dispatch treats you like one — one line, straight answers."` / `02 HOME TIME THAT HOLDS` — `"Southeast regional lanes built around getting you home, and OTR when you want the miles."` / `03 EQUIPMENT THAT'S READY` — `"Clean, DOT-compliant, maintained before it's ever your problem."` / `04 ROOM TO GROW` — `"Fifty tractors by the end of 2029. Early drivers grow with the fleet."` (all recomposed from existing v1 voice + vision; NO pay figures — we have none and invent nothing). **Gold: none.**
3. **Home base band** — photo/ink. `PhotoBand` image `/images/stock/road-night-light-trails.jpg`, align left, melt: eyebrow `HOME BASE` (not gold), titleLines `["Loganville, Georgia."]`, body `"The Southeast is a home route. Nationwide when you want it."`. **Gold: none.**
4. **How it works** — paper `py-band-sm`. h2 LineReveal: `"Four fields."` / `"Then a phone call."`; `ProcessStrip` (§3.24 — the SAME component safety uses, not a re-implementation): `THE FORM — thirty seconds` / `THE CALL BACK — a person, not a portal` / `THE TALK — lanes, home time, equipment` (faq item 6, json recompose). **Gold: none.**
5. **Apply** — paper, `id="apply"`, `py-band`. `Eyebrow` (plain, NOT gold): `START THE CONVERSATION`; restyled `DriverForm` (fields/names unchanged: name, contact, experience, note + botcheck) with the underline system; success takeover: `"We've got you."` + `"A person calls back to talk lanes, home time, and equipment."`. Legal micro line below (equal-opportunity, receded). **Gold: the gold submit pill (the form's whole spend — focus underlines are never gold, §3.20).**
6. **Ending** — `CtaBand variant="call"`. **Gold: none.**

### 4.7 CARRIER PACKET — `app/(site)/carrier-packet/page.tsx`
1. **Hero** — `PageHero variant="compact"`, eyebrow `FOR BROKERS`, titleLines `["The full packet.", "Same business day."]`, deck `"One email. Authority, COI, W-9, references, and signed agreements come back the same business day."` (faq item 5, json). **Gold: none.**
2. **Document ledger + request** — paper `py-band`. Opens with an `sr-only` h2 (`"The packet, itemized"`) so the h3 rows below never precede the page's first h2 (§2.1 heading law). Left (cols 1–7): five hairline rows, each `0X` index + document name in h3 + one micro line: `01 OPERATING AUTHORITY — MC 66389691, USDOT 7638788` / `02 CERTIFICATE OF INSURANCE — your company listed as holder on request` / `03 W-9` / `04 REFERENCES` / `05 SIGNED CARRIER AGREEMENTS`. Right (cols 8–12, `lg:sticky top-28`): request card — h3 `"Request the packet."`, body `"Send your company name and MC or USDOT number."`, `btn-gold` `EMAIL DISPATCH` (`mailto:dispatch@kulenterprises.com?subject=Carrier packet request`) + `CopyButton` email fallback (§3.25) + micro `OR CALL 678-972-1148`. On mobile the card renders ABOVE the ledger. **Gold: the mailto CTA.**
3. **Ending** — lean band, ink `py-band`: h2 LineReveal `"Already set up?"` + link-hairline `SEND THE FIRST LANE →` /quote. (Distinct ending; no CtaBand component needed — 10 lines.) **Gold: none.**

### 4.8 QUOTE — `app/(site)/quote/page.tsx` (conversion page: lean, fast, form above the fold on laptop)
1. **Opener** — `PageHero variant="compact"` (38svh), eyebrow `REQUEST A QUOTE`, titleLines `["Send your lane."]`, deck `"Priced by a person who can actually commit capacity. Answered the same business day."` (faq item 1, json). Nav CTA suppressed on this route (ghost). **Gold: none yet.**
2. **Form** — paper `py-band-sm`, form visible within first scroll. Rebuilt `QuoteForm` (§3.20 numbered groups; fields/names unchanged). Trust strip INSIDE the form column above submit: micro `PRICED BY A PERSON · SAME BUSINESS DAY · USDOT 7638788 · MC 66389691`; beside submit: `TIME-CRITICAL? 678-972-1148 — DISPATCH ANSWERS 24/7`. **Gold: the gold submit pill only (focus underlines never gold — §3.20).**
3. **FAQ** — paper `py-band-sm`, `id="faq"` (the Footer links to `/quote#faq` — this anchor is load-bearing). `FaqAccordion` 3 items: faq items 1, 3, 8. `jsonLd`. **Gold: none.**
4. **Ending** — none. Straight to curtain Footer (the page IS the CTA).

### 4.9 CONTACT — `app/(site)/contact/page.tsx`
1. **Opener** — `PageHero variant="compact"`, eyebrow `CONTACT`, titleLines `["Talk to", "a person."]`, deck `"Dispatch answers around the clock. Freight quotes have a faster lane —"` + inline link `send the lane here →` /quote. Nav CTA renders ghost on this route (§3.1 — the form's gold submit is the page's gold). **Gold: none.**
2. **Directory** — ink `py-band-sm` (Aman pattern: humans before forms). Opens with a visible h2 at h3 scale, `"Reach dispatch."` (the page's first h2 — without it the column h3s would skip levels; §2.1). Three hairline-divided columns (`divide-x divide-white/12`): `DISPATCH — 24/7` → `678-972-1148` in Omnibus h3 `tel:`; `EMAIL` → `dispatch@kulenterprises.com` + `CopyButton` (§3.25); `HOME BASE` → `Loganville, GA` + micro `SOUTHEAST BASED · NATIONWIDE SERVICE` + `USDOT 7638788 · MC 66389691`. **Gold: none.**
3. **Form** — paper `py-band-sm`. Rebuilt `ContactForm` (name, email, message + botcheck). h2 at h3 scale above: `"Or write it down."` **Gold: the gold submit pill only.**
4. **Ending** — none. Straight to Footer.

### 4.10 LEGAL TEMPLATE — one `components/v2/LegalPage.tsx` used by privacy-policy, terms-conditions, cookies, legal-notices, climate-statement
```ts
type LegalPageProps = { eyebrow: string; title: string; updated: string;  // REQUIRED per page, no default
  sections: { heading: string; body: React.ReactNode }[]; pull?: string };  // pull = optional pull-quote (climate)
```
1. **Header band** — ink `py-band-sm`: Eyebrow (plain), H1 LineReveal in display-l sentence case, `Last updated {updated}` micro, one `rule-gold` hairline under the byline (**the page's single gold**).
2. **Body** — paper: max-w-[68ch] document column; sections with sentence-case Omnibus h3 headings + tabular micro index (`02`) beside; real `<ul>/<dl>` lists with hanging indents (no fake-list paragraphs); anchors (`id` slugged) + a `lg:` sticky mini-TOC rail in the free right gutter when sections ≥ 3 (scroll-spy, active item ink not gold). Single Rise on the header only — body content renders instantly (no per-section reveals on utility documents).
3. **Index band** — ink `py-band-sm`: `OTHER DOCUMENTS` micro + links to the other four legal pages + `Questions? dispatch@kulenterprises.com`. → Footer.
Climate-statement additionally renders `pull` as an Omnibus h2 pull-quote on paper before the body: `"We would rather report real practices than print slogans."` Existing legal copy text is reused from v1 pages verbatim (content strings de-CAPSed to sentence case in headings only — body wording unchanged).

### 4.11 404 — `app/not-found.tsx` (outside (site): mount `Nav` + `Footer` + `Grain` manually, `MotionProvider` wrapped)
Single ink viewport (`min-h-svh flex items-center`): `GhostNumeral` `404` at `clamp(12rem, 30vw, 26rem)` paper/[0.06] behind; `<Image src="/images/brand/doctor-bird-flight.png" width={96} height={64}>` with a gentle 6s `y:[-6,6]` float loop (reduced-motion: static); eyebrow `OFF THE ROUTE`; LineReveal **h1** (the page's h1 — every page gets exactly one, §2.1): `"This lane"` / `"doesn't exist."`; body: `"The freight is fine — the page isn't. Let's get you back on the road."`; CTAs: `btn-gold` `BACK HOME` → / + `btn-ghost-dark` `REQUEST A QUOTE` → /quote. **Gold: the home CTA.** → Footer.

---

## 5. BUILD ORDER & RISKS

### 5.1 Foundation agent builds, in order (page agents may assume ALL of this exists):
1. `app/globals.css` token layer (§2: type/spacing/scrims/rules/img-grade/buttons/focus-visible+selection preserved) + `tailwind.config.ts` extensions (fontSize tuples, spacing band tokens, transitionTimingFunction from EASE) — existing token names untouched.
2. `components/v2/motion.ts` (EASE/DUR/STAGGER/VIEWPORT) — the single motion import.
3. `(site)/layout.tsx`: MotionProvider (reuse existing) + `<MotionConfig reducedMotion="user">` + Grain + Nav + RouteVeil(children in curtain wrapper) + StickyMobileBar + curtain Footer. `app/layout.tsx`: LoadingOverlay policy → first visit ever (localStorage) + post-first-paint mount + ≤2.5s cap (§3.22 — never occlude LCP), fonts/metadata/GA untouched.
4. Primitives: Eyebrow, SectionRule, BirdMark, LineReveal, ClipReveal, Parallax, Rise/RiseGroup, GhostNumeral, StatBlock, HeroFrame, ProcessStrip, CopyButton.
5. Chrome: Nav + MenuOverlay, Footer (+FooterReveal driven by the content-end sentinel, CopyButton/clock islands), StickyMobileBar, RouteVeil (+`useVeilState`).
6. Composites: PageHero (3 variants), PhotoBand, HeroVideo (port v1 logic), CtaBand (6 variants), FaqAccordion, QuoteStrip, LegalPage.
7. Form field system in `components/forms/` (§3.20 — CREATE Field/SelectField/TextareaField and rewrite the three form components' markup around them) — submission logic/field names untouched; verify all three POSTs still round-trip.
8. Set pieces: TruckChapters, ServiceIndex.
9. A `/dev/v2` scratch route rendering every component on both grounds for eyeball QA (delete before merge).
Page agents then build pages §4.1–4.11 in parallel; each page imports ONLY from `components/v2/*` and `components/forms/*`, uses `lib/site`/`lib/services`/content json for copy, and declares `data-ground` per section.

### 5.2 Five riskiest items + fallbacks
1. **TruckChapters pinning** (sticky + 400vh + stacked-crossfade chapter swaps): risk of jank/misfire mid-scroll on Safari/iOS. Fallback (already specced): the <md stacked layout ships for ALL viewports behind a single flag — if desktop pinning isn't butter-smooth by QA, flip the flag; the stacked version retains the crossfade-settle, ghost numerals, and progress hairline (§3.21) and stays signature-grade.
2. **Curtain footer** (md+: sticky bottom + 92svh; below md ALWAYS normal flow — §3.2, the stacked mobile content cannot fit 92svh) vs iOS toolbar collapse and short desktop viewports: test `svh`; if footer content overflows 92svh at any remaining breakpoint, that breakpoint goes normal-flow too. Full fallback = normal flow everywhere (delete the sticky + content shadow — everything else identical).
3. **Nav theme flipping** via IO on `data-ground`: risk of flicker at fast scroll and mismatched boundaries. Fallback = nav stays ink-themed everywhere (ink/85 blur when pinned) — it reads fine over paper; keep hide/reveal behavior regardless.
4. **QuoteStrip one-row UX** (5 fields + validation in a hairline row): risk of cramped errors/date-picker chrome. Mitigation: stacked below md always; native date input styled minimally; on validation failure the strip expands its status line rather than inlining per-field errors. Fallback = replace strip with a single `SEND A LANE →` deep-link band to /quote (keep the section, swap the guts).
5. **RouteVeil click interception** (§3.22): risks are missed edge cases (clicks on elements nested inside links, hash links, downloads) and a veil stuck at full cover. The 1.5s safety valve is mandatory; QA every nav path including back/forward (no veil on popstate). Fallback = drop the veil entirely (instant swaps) — the site must feel fast first. An enter-only veil keyed on pathname is NOT an acceptable fallback (it fires after the new page renders: flash → cover → re-reveal).
Watchlist (not top-5): Omnibus descender clipping in LineReveal (the -0.2em inset is mandatory; QA "gy" glyphs), ServiceIndex spring cost (single shared follower node only), grain layer on low-end GPUs (it's static and blend-free per §2.6 — if paint cost still shows, drop opacity to 0.03 rather than animating anything), footer wordmark size at 320px (QA the §3.2 crop rule).

---

## Rejected critique points
None of the 15 critique points was rejected; two were applied in modified form:
- **#14 interior signature:** granted to the drivers "call" CtaBand phone-number hairline draw as suggested, but as a trigger-once `whileInView` draw rather than a scroll-scrubbed one — a scrub there would spend a third scrub budget slot on /drivers for no perceptual gain. The SVG lane-map alternative was not taken (higher build cost, same payoff).
- **#12 grain:** the blend mode is removed globally (not just ≤768px) — once the tint is baked into the data-URI there is no reason to keep `mix-blend-overlay` anywhere.
