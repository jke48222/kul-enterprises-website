# KUL Enterprises v3 — Build Plan for Fable 5

**Version 3. Ground-up.** This is the execution brief Fable 5 builds from. It supersedes the v1/v2 design intent as the *experience* spec, while deliberately **reusing v1/v2's proven plumbing** (see §3). Read it top to bottom before writing any code.

Companion docs (read these too):
- `16-reference-teardown-apple-volvo.md` — observed design tokens/patterns from Apple + Volvo Trucks (Mark's named north stars). Screenshots + `apple-volvo-tokens.json` in `project-docs/reference/`.
- `17-v3-research-cinematic-trust.md` — verified research: small-carrier trust doctrine + build/skip rulings for each interaction.
- `07-design-research.md` / `10-design-direction.md` — the July-2 aesthetic research and the reference-site blend (Truck'N Roll + Terminal Industries + Rolls-Royce + Longbow).
- `15-v2-design-bible.md` — the full v2 spec; mine it for proven component mechanics, don't treat it as the v3 law.

---

## 0. Execution contract (how to use this doc)

1. **The prime directive** is Mark's, verbatim: every design decision answers one question — *"Does this increase trust?"* If yes, keep refining it; if no, cut it. When a visual "cool" idea competes with trust or performance, **trust wins.**
2. **Build one section at a time.** Compare against the reference evidence, get typography/spacing/motion/responsive right, verify in a *visible* browser window, then move on. Never scaffold the whole site in one pass.
3. **Honesty is a hard constraint, not a vibe.** Do not fabricate testimonials, client/broker logos, statistics, safety claims, or fleet/team photos. Every number on the site must be real or clearly aspirational ("our goal…"). See §10. This is both ethics and, per §17 research, what actually converts skeptical brokers.
4. **Reduced-motion and LCP are gates, not polish** (§6). A beautiful section that fails either is not done.
5. **Reuse before you rebuild** (§3). The invisible plumbing already survived a 69-agent audit and ~57 fixed bugs. Reintroducing those bugs by rewriting `lib/email.ts` from scratch is failure, not freshness.
6. When something is **blocked on a missing asset** (§2, §15), build a clearly-labeled, high-craft *replaceable* stand-in and note it — never fake, never lorem, never ship a broken gap.

**One-sentence goal:** *A calm, light-forward, cinematically-confident carrier site — Apple's restraint × Volvo's premium heft — that makes a broker, shipper, or driver think "I trust them" within one screen, and proves it with verifiable credentials and Mark's own story.*

---

## 1. Why v3 exists (thesis)

v1 was the first custom build; v2 was a from-scratch "best-looking-trucking-site" rebuild (excellent, but tuned toward Truck'N Roll's *ink-black rock-poster* register). Since then **Mark sent an explicit creative brief** ("Cinematic Trust Experience": Apple simplicity + Volvo confidence, a Doctor-Bird intro, subtle micro-interactions, a "Strength in Motion" gold roadway, an interactive Southeast map, and journey photography) and supplied a **gold lion-head mark**. v3 is the version that executes *that brief precisely*, corrected by two hard research findings:

- **Both Apple and Volvo Trucks are predominantly LIGHT sites** (white/`#f5f5f7`/`#f7f7f7`), using black only for cinematic product beats. Premium comes from whitespace + light + real photography + one restrained accent — **not** wall-to-wall black with gold (a theme refuted *twice* now). So v3's biggest visible change from v2 is **inverting the ground: light-dominant, with dark cinematic beats** — which is also literally what Mark asked for by naming Apple and Volvo.
- **The lion is Mark's primary mark; the Doctor Bird is the "signature."** v2 led with the bird. v3 fixes the hierarchy (§5).

**The four genuine deltas over v2:** (a) light-forward Apple/Volvo art direction; (b) lion-primary brand system + dual-mark ritual; (c) the specific named interactions (Strength-in-Motion roadway, interactive Southeast map, service-icon micro-interactions, journey-scroll About); (d) a trust architecture built explicitly for a *new/small* carrier (§10).

---

## 2. Locked facts & current assets

**Business facts (from `content/site.json` → `lib/site.ts`; never invent, never animate the digits):**
- Legal: **KUL Enterprises LLC**. Tagline: **"Strength in Motion. Built on Integrity. Driven by Safety."**
- **USDOT 7638788 · MC 66389691** · dispatch@kulenterprises.com · public phone **678-972-1148** · **Loganville, GA** (confirm city/state in `site.json`).
- Services (7): Power Only, Dry Van, Reefer, Dedicated, Regional, Over-the-Road (OTR), Expedited.
- Service area (from Mark's design email): Southeast — **FL, GA, TN, AL, SC** + surrounding — "Southeast based, nationwide service."
- Vision: **50 tractors by the end of 2029.**

**Assets on hand (in repo unless noted):**
- Brand marks (raster PNG, transparent): `public/images/brand/lion-head.png` (gold, 500×500), `doctor-bird-flight.png`, `doctor-bird-display.png`, `bird-body.png`, `bird-wing.png`, `kul-logo-lockup.png` (lion + wordmark).
- Intro film: `public/videos/intro.mp4` (bird → gold particles → logo → tagline, ~5s, silent). Hero clips: `kul-hero.mp4` / `kul-hero-720.mp4` + poster.
- Mark's 5 real photos: `public/images/photos/` — `cliffs-over-water`, `river-through-forest`, `tree-open-landscape`, `ocean-waves-rocks`, `desert-rock-formation` (mapped to themes in the Blueprint).
- Interim stock (night-truck/driver/road) in `public/images/stock/` — **replaceable placeholders only**.

**Critical gaps / blockers (do NOT paper over — see §15):**
- ❌ **No real truck/fleet photography** and **no founder headshot.** The homepage hero and About portrait are the highest-impact slots and currently rely on stock. Build with clearly-labeled replaceable stand-ins; the hero art direction target is Volvo's "one truck, reflective plane, vast negative space" shot.
- ❌ **Brand marks are raster, not vector.** The lion/bird/lockup need SVG for crisp scaling and the intro/dual-mark animation. Trace to clean SVG (from the PNGs) as a stand-in; flag that licensed vector originals are still owed by Mark.
- ⚠️ **Display font license.** v2 used `Omnibus` (license unconfirmed) + `Montserrat`. For v3, pick a **properly-licensed** display face (a confident geometric grotesk in the Apple-Display / Volvo-Novum register) before launch; do not ship an unlicensed face.

---

## 3. Reuse-vs-Rebuild ledger (read before deleting anything)

"Start fresh" = a fresh **experience layer**, not a fresh codebase. Structure v3 like the existing dual-demo: **`app/v3/*` routes + `components/v3/*`**, reusing the shared plumbing below unchanged. (Once v3 is chosen, promote it to root and retire v1/v2 — see §15 open decision.)

**REUSE unchanged (proven, audited — do not rewrite):**
- **Form API routes — byte-identical POST contracts.** `app/api/quote|contact|driver/route.ts` + `lib/email.ts` (`readForm`, `sendViaResend`, `recordLead`, `isEmail`) + `lib/ratelimit.ts`. Field lists are frozen:
  - quote: `origin, destination, freightType, pickupDate, contact` (required) + optional `details`; honeypot `spam`.
  - driver: `name, contact, experience` (required) + optional `note`.
  - contact: `name, email, message` (required).
- **Content/CMS layer:** `content/{site,services,faq}.json`, `tina/config.ts`, `lib/site.ts`, `lib/services.ts`. v3 pages read facts/services/FAQ from here so CMS edits keep working. Extend the schema if a section needs new fields; don't fork it.
- **Motion/perf foundation:** the LazyMotion strict provider + `MotionConfig reducedMotion="user"` pattern, the `next/image` priority-hero discipline, GA4-behind-`NEXT_PUBLIC_GA_ID`, Search Console verification, sitemap/robots.
- **Proven mechanics worth porting (re-skin, keep the physics):** the curtain-Footer sticky mechanism, `RouteVeil` page transitions, first-visit `LoadingOverlay` gate (localStorage `kul-intro-seen`), the scroll-scrubbed hero and `TruckChapters` pin (Framer `useScroll`/`useTransform` — proof FM suffices without GSAP), `link-hairline` underline, `scrim-*`/`img-grade` photo recipes.

**REBUILD fresh (the v3 experience):**
- Art direction → light-dominant (§4). Re-compose every page around the new ground rhythm.
- Brand system → lion-primary + dual-mark ritual (§5).
- The signature interactions (§8): Strength-in-Motion roadway, interactive Southeast map, service micro-interactions, journey-scroll About.
- Nav/Footer/Hero visual design (keep the underlying mechanics).

**Known v2 gotchas to carry forward (from the design bible):** Tailwind bare `/12` alphas silently no-op (bracket them); `Parallax` must not add `relative` when the caller is `absolute`; above-the-fold hero reveals must use `immediate`, not `whileInView`; background/occluded tabs freeze Framer rAF — always QA in a visible window; a transformed ancestor hijacks an `absolute` child's containing block (furniture fades must be opacity-only).

---

## 4. Design system (v3)

### 4.1 Grounds & the light/dark rhythm — the core shift
Default ground is **light**; dark is reserved for cinematic beats. This is the Apple `#fff`/`#f5f5f7` + black-product-tile rhythm and Volvo's white + full-bleed-image-band rhythm, applied to a carrier.
- **Paper (default):** warm off-white. Carry v2's `paper #f7f5f0` for the base and pure `#ffffff` for raised cards/spec blocks (Apple pairs `#fff` with `#f5f5f7`).
- **Ink (cinematic beats only):** `#0b0b0b`. Use for: the intro overlay, the homepage hero, the "Strength in Motion" band, the Safety hero, PhotoBands, and the curtain footer. Roughly **one dark beat between stretches of light** — never long runs of black.
- Ink text on paper: near-black `#111`/`#1a1a1a` (Apple ink is `#1d1d1f`, Volvo `#212121` — not pure black). Secondary text ~`rgba(0,0,0,.56)`.
- Use `data-ground="paper"`/`"ink"` so focus rings, hairlines, and grade invert correctly (v2 already keys off this).

### 4.2 Gold — the single accent, strictly budgeted
Gold replaces Apple's blue / Volvo's blue as *the one accent*. **Recommended value: the muted metallic `#b59352`** (v2's choice) over the brighter blueprint `#D4AF37` — muted metallic reads more "excellence, not costume gold," matching Mark's "warm metallic gold … excellence not luxury." *Flag this to Mark for sign-off (§15).*
- **Gold budget (hard rule): ≤ ~2 gold marks per viewport.** Allowed slots: the nav CTA, one hairline/eyebrow per section, the active-nav underline, the primary CTA, the loading mark, the roadway line, active map state. If a third gold thing appears in one viewport, remove one.
- Never animate the USDOT/MC digits; never put gold on body copy.

### 4.3 Typography
Register: **big, confident display with tight line-height and slight negative tracking** (Apple SF Pro Display 80px/lh 1.05/−1.2px; Volvo Novum 700/−0.48px), over a clean, legible body.
- **Display face:** a licensed geometric grotesk in that register (replace/confirm `Omnibus`). Weights: one display weight (600–700).
- **Body/UI face:** a neutral grotesk (Inter/Söhne-like); Montserrat acceptable for eyebrows/labels.
- **Fluid scale (`clamp()`):** Display-XL `clamp(2.75rem, 6.5vw, 5.5rem)` lh ~1.03 tracking −0.02em · Display-L `clamp(2rem, 4vw, 3.25rem)` · H2 `clamp(1.5rem, 3vw, 2.25rem)` · Body-L `1.125rem/1.7` · Body `1rem/1.65` · Eyebrow `0.75rem`, `0.22em`, uppercase.
- Rules: line-height tightens as size grows; measure capped ~60–68ch; two display weights max.
- **Perf note:** a text-node hero (system/`font-display:swap`) has near-zero LCP image cost (§6). Favor type-led over image-behind-text where it still reads premium.

### 4.4 Spacing, hairlines, buttons, photography
- **Section rhythm:** desktop `py-[clamp(88px,10vw,128px)]` (Apple ran 112px). Generous margins; container ~`max-w-[1280–1320px]` with `px-[clamp(20px,5vw,90px)]`. Whitespace is the primary premium lever — when in doubt, add space.
- **Hairlines over boxes:** `rule-ink` / `rule-paper` / `rule-gold` (max one standalone gold rule per page). Cards use hairline borders, not heavy shadows.
- **Buttons — pill only** (Apple `980px` radius; v2 `rounded-full`): `btn-gold` (filled accent, primary), `btn-ghost-dark` / `btn-ghost-light` (outline secondary). Pair them (Apple/Volvo "Learn more" ghost + filled): primary = "Request a Freight Quote", secondary ghost = "Become a Driver".
- **Photography grade:** one unified warm cinema grade on every `next/image` photo (`img-grade`), never on hero video; `scrim-*` recipes for text-over-photo legibility.

---

## 5. Brand & marks (fix the hierarchy)

- **Lion = primary icon** (leadership/strength/protection). It is the standing brand mark: nav lockup, footer crest, favicon, watermark. Use `lion-head.png` (→ trace to SVG).
- **Doctor Bird = the signature** (Jamaican heritage; freedom/precision/speed). It appears in the *intro*, as a subtle footer/section flourish, and the favicon may pair them. Not the primary logo.
- **Dual-mark ritual (Rolls-Royce device, from `10-design-direction.md`):** the header shows the **lion monogram** at the top scroll state and **crossfades to the full KUL lockup** (or vice-versa) on scroll — a quiet luxury signature. Transform/opacity only.
- **Intro sequence** is bird-led *by Mark's own concept board* (bird flies L→R, gold-particle trail resolves into the KUL logo lockup — which contains the lion — then the tagline). This is consistent with lion-primary: the bird is the motion signature; the lion lives in the resolved logo and the standing chrome.

---

## 6. Motion & performance system

**Engine:** Framer Motion via **LazyMotion + `m` + `domAnimation`** (cross-browser, ~4.6–18kb). Native CSS scroll-driven animation (`animation-timeline`) only as a *progressive enhancement* behind `@supports`, because support is ~82.58% (Safari 26+/Chrome 115+/Firefox-flagged). **Do not add GSAP** unless a moment provably needs it beyond FM (v2 proves FM suffices).

**One motion language:**
- **Transform + opacity only** on scroll. Never animate width/height/top/left/filter/box-shadow on scroll.
- **Reveal:** `fadeUp` (y:24→0 + opacity, 0.6–0.9s, ease `[0.22,1,0.36,1]`), `whileInView` `{ once:true, margin:"-10% 0px" }`. Above-the-fold hero uses `immediate`.
- **Stagger** children 60–100ms for grids/lists.
- **Pace = slow, deliberate** (0.6–1.0s); no bouncy springs.
- **Micro-interactions (Mark's ask):** buttons react on hover (gold hairline / slight lift, transform), icons gently animate, gold highlight on important actions, smooth section fades. Keep them ≤150ms, transform/opacity.

**The three always-on gates:**
1. **LCP ≤ 2.5s (p75).** Hero/LCP image never lazy-loaded; `src/srcset` in initial HTML; `priority` + `fetchPriority="high"`; explicit dimensions; AVIF/WebP. Intro overlay renders *above* SSR'd content so LCP fires behind it. No main-thread-blocking scripts before paint. INP ≤ 200ms, CLS < 0.1. **Test on mobile.**
2. **`prefers-reduced-motion`** — mandatory, three layers: `MotionConfig reducedMotion="user"`, per-component reduced variants that jump to rest state, and dynamic `matchMedia` so JS motion stops without reload. **Parallax without a reduced-motion fallback is an accessibility failure** (vestibular disorders — verified). Consider splitting heavy animation CSS into a sheet reduced-motion users never download.
3. **Never gate meaning behind motion; never hijack native scroll.** All copy is SSR'd and readable with JS off. Scroll-*linked* (progress tied to native scroll) is allowed; scroll-*jacking* (overriding scroll speed/direction) is banned — it disorients most users, worse on mobile, worst over text.

---

## 7. Information architecture

Routes under `app/v3/` (mirror to root when promoted). Core pages (Mark's 8) + per-service detail + legal:
- `/` Home
- `/about` About (founder story + journey photography)
- `/services` Services index → `/services/[slug]` for each of the 7 (SEO: one page per freight type)
- `/safety` Safety & Compliance (credentials/trust hub)
- `/carrier-packet` Carrier Packet / Documents (CMS-managed PDFs)
- `/drivers` Driver Careers (dedicated CDL landing page)
- `/quote` Request a Freight Quote
- `/contact` Contact (NAP, map, hours)
- Legal (5): `/privacy-policy`, `/terms-conditions`, `/cookies`, `/legal-notices`, `/climate-statement`
- **Page-count note:** contract allotment is 12; core+service-index+legal already exceed it if each service detail counts. Treat `/services/[slug]` as one templated route. Flag the 12-vs-actual count for Jalen (§15).

Chrome: sticky Nav (dual-mark, transparent-over-hero → solid on scroll, gold CTA, active-link hairline), `StickyMobileBar` (Quote/Call), curtain Footer (NAP, USDOT/MC, SAFER link, lion crest, LocalBusiness JSON-LD), `RouteVeil` transitions, `LoadingOverlay` intro.

---

## 8. The signature experiences (build specs)

For each: the ruling is from `17-v3-research-cinematic-trust.md`. All are **transform/opacity/offset only, reduced-motion-safe, never block the H1.**

### 8.1 Doctor Bird intro — **BUILD (animated SVG+CSS/Framer); SKIP Lottie-runtime & canvas particles**
- Client overlay above SSR'd hero (LCP fires behind it). First-visit only (`localStorage kul-intro-seen`). Skippable (click/key/Esc). Auto-dismiss ≤ ~2.5s.
- Inline SVG bird + a **masked gold-gradient trail** sweeping the flight path + a few transform/opacity dots (not a particle sim). Resolve into the KUL lockup, then the 3-line tagline, then fade to reveal hero.
- Keep `intro.mp4` as the video-first path with the CSS/SVG bird as automatic fallback (watchdog + onError), exactly as v2's LoadingOverlay does — but rebuilt on the vector marks.
- **Reduced-motion:** skip the flight; show the static logo lockup ~400ms, then fade. **No Lottie runtime** (dotLottie is +30kb and growing).

### 8.2 Homepage hero — **BUILD (cinematic, light-page's one big dark beat)**
- Full-bleed night-truck media (video→poster) with left-anchored `scrim-hero`. H1 poster-scale "**Strength in Motion.**" + one-line subhead (Georgia carrier, integrity, safety, Southeast→nationwide) + dual CTA (gold Quote / ghost Drivers) + a **pause/play control** (Volvo device; accessibility + polish).
- Content readable with no scroll and no JS. Subtle transform-only parallax/scale on scroll-out. **Critical asset gap:** real fleet shot (Volvo "reflective-plane" register) — stand-in until Mark delivers.

### 8.3 "Strength in Motion" gold roadway — **BUILD as scroll-linked progress; SKIP scroll-jacking**
- A thin **gold roadway line** that *draws in* and a small **vector truck** that *advances along it as you scroll normally* through one signature stretch (e.g., a "How your freight moves" 3–4 beat section — the Terminal-Industries device, retuned). Native scroll preserved.
- Implementation: FM `useScroll`+`useTransform` mapping scroll progress → line `pathLength` / truck `offsetDistance` (or CSS `offset-path`+`offset-rotate` as `@supports` enhancement). Decorative SVG `aria-hidden="true"` + `tabindex="-1"`.
- **Reduced-motion:** show the full static roadway with the truck at rest; no travel.
- Confine to ONE stretch. This is the literal expression of the tagline; don't sprinkle traveling trucks everywhere.

### 8.4 Interactive Southeast service map — **BUILD accessible-first, lightweight**
- Inline **SVG** of FL/GA/TN/AL/SC (+ neighbors dimmed). Hover/focus/tap **highlights a state and shows its label** (state must be conveyed by more than color — pair with a label/pattern per WCAG 2.1). `currentColor` so it adapts to ground.
- **Keyboard-operable:** states are `tabindex="0"`, operable, with accessible names + `aria-pressed`. Provide a **plain text list of served states** beneath/beside it as the no-JS/SEO/screen-reader fallback.
- Mobile: labeled list or tap-to-highlight (no hover reliance).
- **Honesty:** illuminate only regions KUL actually serves; the map states reality. Copy frames it as "Southeast based, nationwide on request," not "we blanket the country."

### 8.5 Journey-scroll About — **BUILD (the E-E-A-T engine); gate parallax**
- Mark's 5 real photos become a scrolled "journey across the country": each full-bleed image reveals (fade/rise) as its section enters, with a short line of story, alternating sides — mapped per the Blueprint (cliffs→"Every mile teaches something," river→Integrity, tree→Company Story/roots, ocean→Strength in Motion, desert→Safety/Reliability).
- FM `whileInView`/`useScroll` reveals; optional gentle parallax on the image only.
- **Reduced-motion:** disable parallax entirely (verified vestibular risk) → simple fade, images static. Real photos + real founder voice is the one thing no competitor can copy — this section carries the trust load.

### 8.6 Service micro-interactions — **BUILD (subtle)**
- On the services grid and category hovers (Mark's ask): the truck/service icon **slides forward slightly** and a **gold hairline** underlines on hover/focus (transform/opacity, ≤150ms). Region/service illumination is the same accessible-state pattern as the map. Nothing gimmicky; restraint everywhere else keeps it Mercedes-not-Monster.

---

## 9. Page-by-page spec

**Home (light-forward, one/two dark beats).** Suggested beats: (1) Hero (ink, §8.2) → (2) Quote strip (paper, VistaJet one-row "where's it going?" → /quote) → (3) Manifesto (paper: "Freight is a promise with a deadline. We keep both.") → (4) Strength-in-Motion roadway / How-your-freight-moves (ink, §8.3) → (5) Proof band (paper: USDOT/MC/Licensed/Home-base + "Verify on FMCSA SAFER ↗") → (6) Services preview (paper, §8.6, links to detail pages) → (7) Southeast map (paper, §8.4) → (8) Vision PhotoBand (ink: "Rooted deep. Built to grow." — 50 tractors by 2029) → (9) FAQ (paper, FAQPage JSON-LD) → (10) Drivers PhotoBand (ink, ghost CTA) → (11) Closing CTA (ink) → curtain Footer. Keep gold to the budgeted slots per beat.

**About (light, story-led).** Lead with *purpose, not trucks* (Blueprint). "Rocky Cliffs" opener → the road-miles founder narrative → journey-scroll photography (§8.5) → one **named founder quote from Mark** (small carriers win trust with named humans) → founder portrait slot (blocked asset) → CTA. Emits Organization/Person schema where truthful.

**Services (index + 7 detail pages).** Index: 7 services, icon + one line, §8.6 micro-interactions, each linking to its detail page. **Detail template = the Volvo FH16 model-page IA** (`16-reference-teardown`): cinematic hero → light spec card (what it is / when to use it / equipment) → capability showcase (image + 3-up captioned features) → a slim anchored sub-nav (OVERVIEW · COMMITMENTS · QUOTE, Apple/Rolls-Royce device) → alternating proof bands → CTA to quote. `dynamicParams=false`, per-page title/description/canonical/OG.

**Safety & Compliance (trust hub).** DOT/MC front and center; insurance (auto liability + cargo); safety commitments; "Verify on SAFER"; a quantified-proof band in large minimal numerals (only *real* numbers). Given Volvo's "safety-as-heritage" prominence, this page carries heavy trust weight — design it as a flagship, not a formality.

**Carrier Packet / Documents.** CMS-managed downloadable PDFs (W-9, authority, insurance/COI, packet). Simple, fast, obvious. If docs aren't ready, show a labeled "request the packet" path — don't fake documents.

**Driver Careers (dedicated CDL landing page, not a form dump).** Lead with **home time, communication, respect, consistency** — then honest pay framing (blocked on Mark's real numbers), routes/lanes, equipment, benefits. Set the expectation of a **fast personal callback** (speed-to-lead). Short, **mobile-first** form (name, contact, experience). Optional "we'll call you within the day" reassurance.

**Request a Quote.** Short/progressive: required = origin, destination, freightType, pickupDate, contact (5). Optional **step 2** for weight/dimensions/commodity (don't make them required — each field costs conversion; phone is the highest-friction field, so keep the single generic "contact" field). Clear success/error states (surface server errors; never silent-fail a lead).

**Contact.** NAP (matching everywhere), hours, embedded map, contact form → Resend. LocalBusiness schema.

**Legal (5).** Reuse v2's `LegalPage` component pattern and copy.

---

## 10. Trust architecture (the honesty doctrine)

The site's job is to make a *new, one-truck* carrier credible without faking scale. Per §17 research, do this by being *verifiably honest*, and refuse the shortcuts:

**DO:**
- Surface **USDOT 7638788 · MC 66389691** prominently, each near a "**Verify on FMCSA SAFER ↗**" link — invite scrutiny (v2 pattern; keep).
- Keep **NAP identical** across site, footer, schema, and Google Business Profile (mismatched info is the #1 fraud marker).
- Use **Mark's real photos** and **real founder story**; a **named** founder quote.
- Frame scale honestly: present *ambition* ("our goal: 50 tractors by 2029"), not *pretended* present size. Narrow, true capability beats broad, unproven claims.
- Layer trust: nail the basics first (clean, fast, mobile, HTTPS) — they gate whether any credential lands.
- Credentials shown **selectively** (USDOT, MC, licensed & insured, insurance types) — a wall of badges reads as desperate.

**DO NOT (hard "fake it" bans):**
- ❌ No fabricated testimonials or client/broker logos (legal + reputation risk).
- ❌ No recognizable stock "team"/fleet photos presented as KUL's (immediate distrust).
- ❌ No invented stats, on-time percentages, loads-delivered counts, or safety ratings.
- ❌ No "unrated = safest" spin (that specific claim was refuted); "unrated" is normal for a small carrier — say so plainly if relevant, don't weaponize it.
- ❌ No overstated capacity/lane coverage (reads as double-brokering/fraud).

---

## 11. Forms & conversion (specs)

- **Preserve the POST contracts** (§3). Build new v3 form UIs against the same endpoints/field names/honeypot.
- **Quote:** 5 required fields + optional step-2 (weight/dimensions/commodity). Generic "contact" field avoids the phone-field penalty. Multi-step > one long form.
- **Driver:** 3 fields, mobile-first, fast-callback promise. Optional "Save & continue" is a nice-to-have.
- **All forms:** inline validation, visible success, surfaced server errors, rate-limited, honeypot, Resend delivery (hard-fail in prod without `RESEND_API_KEY` — never show false success). Consider an optional immediate auto-reply ("we got it, we'll call you shortly") — matches driver speed-to-lead expectations. (SMS/automation = future phase, out of scope.)

---

## 12. Tech, structure, SEO/analytics

- **Stack:** Next.js 15 (App Router) · React 19 · Tailwind 3 · Framer Motion (LazyMotion) · TinaCMS. No new frameworks; follow repo conventions.
- **Structure:** `app/v3/*` (routes), `components/v3/*` (components), reuse `lib/*`, `content/*`, `app/api/*`, `tina/*`. New shared tokens in `tailwind.config` + `globals.css` `@layer components` (extend, don't fork v2's utilities).
- **SEO:** per-page title/description/canonical/OG; `sitemap.ts`/`robots.ts`; **LocalBusiness JSON-LD** (legal name, USDOT/MC, NAP, geo, hours, `sameAs`); FAQPage schema on FAQ; service pages one-per-type. NAP consistency (also a trust signal).
- **Analytics:** GA4 behind `NEXT_PUBLIC_GA_ID`; Search Console verification behind its env var; privacy/cookies copy tracks the same flags.
- **Env at launch:** `RESEND_API_KEY` + verified Resend domain, `NEXT_PUBLIC_GA_ID`, Search Console token, Tina Cloud creds + `build:cms`. Document in `.env.example`.

---

## 13. Build sequence (phases for Fable 5)

1. **Foundation:** v3 tokens (grounds/gold/type/spacing/hairlines/buttons) in Tailwind + `globals.css`; motion config (LazyMotion, reduced-motion layers); vector-trace the lion/bird/lockup marks; confirm/replace the display font.
2. **Chrome:** Nav (dual-mark ritual), Footer (curtain, crest, SAFER, JSON-LD), StickyMobileBar, RouteVeil, LoadingOverlay (SVG bird intro).
3. **Primitives/composites:** Eyebrow, LineReveal/Rise, hairlines, PhotoBand, StatBlock, FaqAccordion, QuoteStrip, service cards, the anchored sub-nav, the map component, the roadway component.
4. **Home** (all beats §9), verifying each section in a visible browser before the next.
5. **Inner pages:** About (journey scroll) → Services index + detail template → Safety → Drivers → Quote → Contact → Carrier Packet → Legal.
6. **Signature interactions polish** (§8) + micro-interactions pass.
7. **QA gates** (§14): LCP/INP/CLS on mobile, reduced-motion pass, keyboard/a11y pass (map + forms + SVGs), no-JS content check, cross-browser (incl. Safari fallback for CSS scroll-driven), forms end-to-end (stub + real Resend).
8. **Content/CMS wiring**, SEO/schema, analytics, `.env.example`, replaceable-asset audit.

Commit after each working phase (Jalen's standing rule: author "Jalen Edusei", **no co-author trailer**).

---

## 14. Definition of done (acceptance gates)

- ✅ Every page renders SSR text with **JS disabled**; nothing meaningful is gated behind motion.
- ✅ **LCP ≤ 2.5s, INP ≤ 200ms, CLS < 0.1 on mobile**; hero not lazy-loaded.
- ✅ **`prefers-reduced-motion`** verified on every animation (intro, roadway, map, journey parallax, reveals) with real rest states.
- ✅ **Keyboard + screen-reader** pass on the interactive map, all forms, and SVGs (decorative hidden, interactive labeled/operable).
- ✅ **Cross-browser incl. Safari** (native CSS scroll-driven has a working fallback).
- ✅ All 3 forms deliver end-to-end (honeypot, rate-limit, Resend, surfaced errors, no silent success).
- ✅ **Honesty audit passed** (§10): zero fabricated testimonials/logos/stats/photos; all stand-ins labeled replaceable.
- ✅ Gold budget respected (≤~2 marks/viewport); light/dark rhythm holds (no long black runs).
- ✅ Matches the Apple/Volvo reference register at desktop/tablet/mobile (compare against `project-docs/reference/`).

---

## 15. Open decisions for Jalen / Mark (sign-off before/at revision round 1)

1. **v3 structure:** build under `app/v3/*` alongside v1/v2 (recommended — safe A/B, promote the winner), **or** replace root directly? *Assumed: `app/v3/*`.*
2. **Gold value:** muted metallic `#b59352` (recommended) vs blueprint bright `#D4AF37`.
3. **Dark:light ratio:** confirm the light-forward inversion (v3's core change from v2). Palette is locked; ratio is Mark's call.
4. **Display font:** confirm a licensed face (retire `Omnibus` if its license can't be cleared).
5. **Blocking assets (highest priority):** real **fleet photography** (hero — Volvo reflective-plane register), founder **headshot**, and **vector** logo/lion/bird. Until then, labeled replaceable stand-ins.
6. **Driver page facts:** real pay range, home-time policy, lanes, equipment, benefits (needed to make the CDL page convert honestly).
7. **Carrier packet PDFs** (W-9, authority, COI/insurance) — real files or a "request packet" path.
8. **Page-count allotment:** reconcile core + 7 service details + 5 legal against the 12-page contract line.
9. **Interaction sign-offs** at revision round 1: intro length/feel, the Strength-in-Motion roadway, the Southeast map, hero copy/CTAs.
10. **Deferred divergences to confirm:** minimal cinematic hero vs the Blueprint's literal "Reliable Freight Transportation Built on Trust." headline; intro ~5s silent vs spec ~2–3s.
