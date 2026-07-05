# 14 — Sitewide Upgrade Plan (inspiration-driven)

Sources mined: lovable.dev/templates, motionsites.ai, Framer community gallery + marketplace,
jitter.video, Dribbble, recent.design / godly.website, layers.to, plus two domain sweeps
(best-in-class logistics sites: Schneider, Carroll Fulmer, LODISNA, Flexport-tier; and
dark-luxury editorial: watch/aviation/automotive brands). Every page of the current build was
audited against that pool, the draft plan was adversarially critiqued, and the fixes below are
already folded in.

**Design direction in one line:** keep the cinematic dark-editorial register, make gold *arrive*
instead of merely sit, replace the monotone fade-up vocabulary with four named motion moves, and
stop every page from ending identically.

---

## 0. Governing decisions

**D1 — GoldGlass ships in exactly two roles, one mount per page max.**
1. **Home, Vision band** (the parked wrapper at `app/(site)/page.tsx:135-137`) — but as a
   *plaque with a job*: the panel frames the "Fifty tractors by 2029" line, short and large in
   Omnibus, over `bg-ink/10`. The paragraph moves outside onto plain ground. The blur + scrim +
   sheen stack that caused the legibility fight is dropped. The band's gold eyebrow is removed to
   pay for the panel. Note: the reactive layer is pointer-only — judge it on a phone before ship.
2. **Form success panels** (Quote / Contact / Drivers) — as progressive enhancement only. The
   default success state is a **static gold-gradient panel** (identical layout, `role="status"`
   aria-live preserved); the WebGL liquid shader mounts ~300ms after the panel settles,
   desktop-pointer only. Conversion content ("what happens next" steps + phone fallback) ships
   regardless of WebGL.

Killed uses: CTA-pill surface, headline glyph fill, all three statement bands, services tile.

**D2 — PageClosing repetition.** All nine pages end with the same ~2400px sequence today. Make
`components/concept/PageClosing.tsx` composable via props:
- Each page drops the band that points to itself. Spec for the degraded 2-up: when Drivers drops
  the Drivers panel, the Freight panel goes full-width with left-aligned copy (not a one-legged grid).
- **ContactBand is removed on Quote, Contact, and Drivers** (form-under-form is the worst
  repetition on the site) and replaced by a slim phone + hours strip.
- FAQ renders only on Quote / Drivers / Carrier Packet / Contact, with per-page subsets from
  `content/faq.json`.
- StrengthStatement rotates 2–3 tagline/photo pairs keyed by route (ships with the 2 existing
  approved taglines until the client supplies a third), so the cliffs photo never repeats in-page.
- The 3D Doctor Bird GLB (~2MB) is hoisted/preloaded once at layout level, not refetched per page.

**D3 — Kill list** (off-brand, redundant, or out of scope):
multi-step quote wizard (the ruthless 5-field form is the site's best conversion asset — keep
single-step + inline validation), custom labeled cursor, Lenis smooth scroll, shared-layout image
zoom transitions, bento grid, blur logo-switcher, footer-reveal curtain (stretch), pinned 300vh
chapters (stretch), cursor-spotlight band (stretch), hover-image-swap index (stretch).
Fleet film-strip + testimonial plates are **parked pending assets** — brief the client now.

**D4 — Gold budget enforcement (with honest ledger math).** The fixed nav pill counts as gold
element #1 on every viewport — every rule below assumes that.
- `kul-grad-text` (currently on nearly every h2 = wallpaper) is reserved for the hero h1 and one
  mid-page moment per page; all other headings go flat paper/cream.
- SectionRule's hairline draws in gold **only on the one reserved section per page**; everywhere
  else it draws in `white/25` (dark) or `ink/25` (light).
- Hero scroll cue: cream, not gold. Ticker/divider diamonds: `white/30`, not gold.
- No new gold element without retiring one.

**D5 — Content dependencies, requested up front (each with a shippable fallback):**
| Needed from client | Fallback if unavailable |
|---|---|
| Attestable stats (miles, on-time %, years, inspections) | Proof band stays credentials + founder quote; StatOdometer deferred |
| Driver pay/home-time figures | Qualitative chips ("Home weekly · Late-model equipment") |
| Real lanes + transit times per service | Cities already listed in the carrier packet |
| Third approved brand tagline | Rotate the existing two |
| Fleet photography + named testimonial quotes | Sections stay parked (never fake) |

**Never animate USDOT/MC digits** — regulatory numbers render static and verbatim, always.

---

## 1. Global systems

### 1.1 Motion language — four named moves (replaces monotone `Reveal` fade-ups)
New shared components in `components/motion/`; every one specs its reduced-motion state as
"visible at rest, no transform" (opacity-only where needed) — not a checklist slogan.

| Component | What it does | Where it came from | Effort |
|---|---|---|---|
| `SplitLines` | Line-masked headline rise (lines clip in `overflow-hidden`, y 110%→0, 70–90ms stagger, expo ease). **Page-hero h1s only (≤9 mounts)**, gated on `document.fonts.ready`; the Home hero (Montserrat caps) uses word-stagger, not line masks. Interior headings get a simple single-mask rise. | motionsites, jitter, recent, layers (all proposed it) | M |
| `SectionRule` | Section signature: eyebrow letter-spacing contracts 0.45em→0.18em while a 1px hairline draws scaleX 0→1. Gold on one section per page, `white/25`//`ink/25` elsewhere (D4). | motionsites, dribbble | S |
| `ParallaxBand` | 6–8% counter-scroll on full-bleed photos via `useScroll`/`useTransform`, image at 115% height. | motionsites, jitter, dark-luxury sweep | S |
| `ClipReveal` | Photos wipe open (clip-path inset→0) with 1.15→1 scale settle, replacing plain fades. | recent, jitter, dark-luxury sweep | S |

Set pieces (each built once, reused):
- `StatOdometer` — rolling-digit count-up band (masked 0–9 columns, tabular-nums, one gold
  hairline). Proposed independently by **six** of the nine sources. **Contingent on D5 stats.** M
- `SoutheastMap` — static hairline-etched Southeast SVG with a **one-time gold line-draw** along
  KUL's corridors (reuses SectionRule's draw mechanic). This replaces the generic lane-ticker
  marquee — actual trucking geography is something no template has. Lives in the Home Vision
  area; reusable on Contact. M

### 1.2 Nav (`components/concept/ConceptNav.tsx`)
- **Scroll-aware pill:** past ~80% of hero, compact to `backdrop-blur bg-ink/80`; theme-swap over
  light bands via IntersectionObserver. Hide-on-scroll-down is **mobile-only** — on desktop the
  compacted bar with the gold Quote CTA stays visible while scrolling (it's the only persistent
  quote path on desktop). M
- **Menu rebuild — the single biggest chrome win:** replace the unstyled white dropdown with a
  full-height ink panel (AnimatePresence), large Omnibus links staggered in, Montserrat numerals,
  one gold hairline, active route in gold. Keep the Doctor Bird morph trigger. M
- **One sticky mobile action bar** (`StickyActionBar.tsx`, mounted in the site layout): slim
  ink-glass chrome, only the "Get a Quote" *label* gold, ghost "Call" `tel:`; swaps to "Apply" on
  Drivers; **hides whenever any form is in the viewport** (not just on Quote/Contact routes).
  Carrier Packet's mobile CTA is a variant of this component, not a second system. M

### 1.3 Page transitions — demote the ceremony
The intro film plays on **true first visit only** (with a "Skip" caption after 1.5s). Per-route,
an **entry-only ink veil** fades out over the incoming page (~400ms) via `app/(site)/template.tsx`
— App Router unmounts the outgoing page immediately, so exit veils are not attempted (no
FrozenRouter hacks). While in there, fix the hero-timing bug: release `data-page-intro` when the
curtain begins its exit (~300ms in), not at `done`, so hero titles rise through the opening slit
instead of leaving seconds of heroless hero. Files: `PageReveal.tsx`, `globals.css`, new
`template.tsx`. M

### 1.4 Footer (`ConceptFooter.tsx`)
Flat ink (kill the one-off `#161616→#3B3B3B` gradient), proper sitemap column reusing the nav
array, fast 0.6s FadeIn variant, drop the pathname key so it animates once per session. S

### 1.5 Shared bands
PageClosing composability per D2; `ParallaxBand` on PathsPanels/StrengthStatement photography;
fixed 711px/860px heights → `min-h-[clamp(...)]`; FAQ chrome lightened to `bg-ink/15` rule +
`border-ink/15` box (currently reads as wireframe borders). M

### 1.6 Depth + texture
- Hairline-token depth ladder for dark cards: `bg-[#141412] border-white/10` + inset top
  highlight, no drop shadows on ink (layers.to pattern). Sweep Quote/Contact cards, FAQ, footer. S
- `Grain` overlay (SVG feTurbulence, ~3.5% opacity, stepped keyframes, static under
  reduced-motion) for ink heros + 404. S, Phase 3.

### 1.7 Forms system (`FormShell.tsx` + new `FormSuccess.tsx`)
- **Inline on-blur validation** (aria-invalid, sliding message, focus-to-first-error) — this is
  conversion work and ships in Phase 1, decoupled from any cinematics.
- Gold focus underline on `.field-light` (scaleX draw + label shift).
- Success sequence per D1: fields collapse into the confirmation panel — serif "Your lane is with
  dispatch.", 3-step "what happens next" stagger, phone fallback, `scrollIntoView` on mobile.

### 1.8 Performance / a11y
Preload `doctor-bird.glb` once at layout level; fluid band heights and `-mt-56`→`-mt-24` overlap
reduction below `md` sitewide; keep the existing discipline (LazyMotion strict, IO gating,
reduced-motion) as acceptance criteria on every new component.

---

## 2. Page-by-page

### Home (`app/(site)/page.tsx`)
- **Choreographed hero open** (motionsites "luxury hero entrance"; logistics sweep "dual-audience
  routing"): word-staggered h1, one caps subline ("Georgia freight carrier — Southeast based,
  nationwide reach"), dual CTAs — gold "Get a Quote" + ghost "Drive with KUL" — and a slow-pulsing
  **cream** hairline scroll cue. The hero currently gives visitors nothing to do and nothing to
  learn. M
- **Reinstate GoldGlass on the Vision band as the 2029 plaque** (D1); other two parked wrappers
  stay plain. M
- **Differentiate the three identical statement beats:** `ParallaxBand` per band, fix band 05's
  right-aligned body copy (readability anti-pattern), swap the ocean/desert/cliffs nature stock
  for trucking assets in `/images/stock`, de-dupe the cliffs photo. M
- **`SoutheastMap` with gold line-draw** near the Vision band — the most differentiating single
  item for a freight brand. M
- **Proof band becomes the trust climax:** staggered credential marks (currently one opacity-70
  blob), founder quote enlarged in Omnibus with a short gold hairline; `StatOdometer` added *if*
  D5 stats arrive. M
- **Close the loop on the lifestyle band:** add a "Drive With KUL" Pill and move the band above
  StrengthStatement so the page ends light instead of re-opening dark with no CTA. S
- Gold sweep per D4. S

### About (`about/page.tsx`)
- **Founder timeline as a vertical milestone ledger** (Framer "year-indexed archive" + layers
  "gold progress rail", merged): CDL year → OTR → authority → first tractor → 2029, scroll-driven
  gold progress line. M
- Values grid: ghost Omnibus numerals behind cards (one of only **two** sanctioned
  ghost-numeral surfaces — see genericness note below), staggered variants, hover gold-border. S
- Story bands: `ClipReveal` + `ParallaxBand`, "02 / 05" index labels, `SplitLines` h1. M
- Vision close: render 2029 with the existing `YearStamp`. S

### Services overview (`services/page.tsx`)
- Tiles become a real index: render the unused `short` field on hover, corner numerals (sanctioned
  surface #2), arrival emphasis on the anchored article via HashScroll. M
- Break the seven-screen ink monotony with 40vh photo interstitials using `ClipReveal`, restoring
  the light/dark rhythm. M
- Commitments columns → staggered cascades with drawing hairline rows (existing unused
  `RevealGroup`). S

### Service detail (`services/[slug]/page.tsx`)
- Extend `content/services.json` with three fields per service — "How it runs" 3-step process,
  example lanes/transit (D5), equipment/spec line — rendered as a paper band (logistics sweep
  "what / how / proof" structure). M
- Hero differentiation: ~55svh, title in lower third, first sentence as serif deck, "0X / 07"
  counter, `ParallaxBand`. S
- Proof strip above the CTA: USDOT/MC (static, verbatim), Loganville GA base, one service fact. S
- Prev/next as photo cards. S

### Safety (`safety/page.tsx`)
- Hero fix: swap the desert photo for truck/road, bottom-anchor the already-written "No load
  outranks a life." — zero new components. S
- Credentials band: staggered reveal + real attestable stats *if supplied*; USDOT/MC never
  animated. S
- Pillars: thin self-drawing line icons via `pathLength` (jitter pattern) to differentiate from
  About's numerals. M
- "Before every mile" process strip on paper: Pre-trip → In transit → Delivery. M

### Drivers (`drivers/page.tsx`, `DriverForm.tsx`)
- Hero sells the job: caps subline ("CDL-A · Regional & dedicated · Southeast"), gold pill →
  `#apply`, slow scale-settle on the image. S
- Fact chips row (Schneider pattern, editorialized): HOME TIME / PAY / EQUIPMENT / ROUTES with
  client figures, qualitative fallback per D5. M
- Value props → numbered editorial ledger, fixing the four-sibling-h2 issue. S
- Form: dedicated `type=tel` phone field, optional email, segmented experience pills, section on
  brand paper. S
- Success panel shared per D1.

### Carrier Packet (`carrier-packet/page.tsx`)
- Promise in the headline: "The full packet, same business day." S
- Copy-to-clipboard beside the mailto CTA ("Copied" toast); sticky-bar variant handles mobile. S
- Document rows: index numerals + drawing hairlines. S
- Swap the tree hero for an operational image; etched credential strip at the header. S

### Quote (`quote/page.tsx`, `QuoteForm.tsx`)
- Compress hero to ~40svh with promise subline ("One lane. One person. Priced the same business
  day."), pull the card up `-mt-24` so field one is visible on load. S
- Editorialize the card: paper shell, serif "Send your lane.", numbered field groups, one gold
  hairline. M
- Field fixes: email/phone toggle with correct `inputMode`, `min={today}` on pickup date. S
- Trust strip inside the card above submit; 24/7 phone in the card footer. S
- Inline validation Phase 1; GoldGlass success later. Multi-step wizard: killed (D3).

### Contact (`contact/page.tsx`)
Same hero compression + paper card as Quote; operational dusk/dispatch photo instead of the
river; "Dispatch is on" presence row (neutral pulsing dot, "avg reply under 2 hrs"). S×3

### Legal set (`LegalPage.tsx` + five pages)
On-palette shell (ink→charcoal, killing the off-brand steel blue) + one gold hairline; sentence-
case Omnibus headings; real `<ul>/<dl>` for fake-list paragraphs; single header Reveal; required
`updated` prop; shared "Legal index" band killing the dead ends. S×5. Climate Statement moves out
of legal chrome onto a paper editorial layout with pull-quote + YearStamp. M

### 404 (`not-found.tsx`)
Import ConceptNav + minimal footer (lost users currently can't navigate); giant ghosted "404"
behind the bird; staggered entrance + ambient float (reduced-motion safe); warm drifting
spotlight. S×4

---

## 3. Phased rollout — honest scope math

The original engagement is $750. Phase 1 + the three starred Phase 2 items ≈ the contracted
build. The rest of Phase 2 and all of Phase 3 are **priced add-ons** — proposed, not assumed.

### Phase 1 — in scope: composition + copy fixes, mostly existing components
1. Home hero subline + dual CTAs + cream scroll cue; lifestyle band CTA + reorder
2. Drivers hero subline + #apply CTA; value-prop ledger restyle
3. Gold-budget sweep sitewide (D4)
4. Quote/Contact: hero compression, card pull-up, trust strip, date min, phone/email split,
   **inline validation**
5. Safety hero fix
6. Carrier Packet headline + clipboard button
7. FAQ chrome lighten + fluid band heights + mobile overlap fixes
8. Footer rebuild
9. Hero-title/curtain timing fix
10. Legal shell recolor + typography + index band; 404 nav/footer + numeral + entrance
11. `SectionRule` + `ParallaxBand` + `ClipReveal`, deployed on Home/About/Safety photo bands
12. Content-request list (D5) delivered to client now, so assets exist by Phase 2

### Phase 2 — signature moments (★ = include in contracted build; rest are add-ons)
1. ★ Menu overlay rebuild — biggest chrome win
2. ★ PageClosing composability + per-page FAQ + StrengthStatement rotation + bird hoisting
3. ★ Form success panel (static-gradient version) on Quote/Contact/Drivers
4. Intro demotion to first-visit-only + entry-only route veil
5. `SplitLines` on page-hero h1s
6. GoldGlass: Home Vision plaque + shader enhancement on form success
7. `StatOdometer` (contingent on D5 stats)
8. `SoutheastMap` gold line-draw
9. Services: tile index + photo interstitials + detail-page deepening
10. About founder timeline + YearStamp close
11. Drivers fact chips (pending client numbers)
12. Sticky mobile action bar + desktop scroll-aware nav

### Phase 3 — polish & stretch (⚑ = clearly beyond scope)
Grain/vignette texture; Safety line icons + process strip; documentary micro-labels; magnetic
gold CTA physics; Climate Statement rebuild; legal sticky TOC; ⚑ full animated route-map;
⚑ accordion paths panels; ⚑ footer-reveal curtain; ⚑ cursor photo previews; ⚑ pinned Safety
monolith; ⚑ fleet film-strip + testimonials (blocked on client assets).

**Acceptance criteria for every item:** defined reduced-motion rest state, transform/opacity-only
animation, no new gold without retiring one (nav pill counts), regulatory numbers never animated,
and no page ships two identical endings.
