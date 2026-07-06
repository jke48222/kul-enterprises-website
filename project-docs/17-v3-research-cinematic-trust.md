# KUL v3 — "Cinematic Trust Experience" Research (small-carrier edition)

Second deep-research pass (July 5, 2026), scoped to what the July-2 run (`07-design-research.md`) did *not* cover: how a **brand-new, one-truck carrier** earns premium trust, and how to build the specific interactions Mark asked for. Harness: 6 search angles → 28 sources → 131 claims → **25 adversarially verified (3-vote): 22 confirmed, 3 refuted.**

> **Provenance note (honesty).** The workflow's automated synthesis step returned a stub on this run; the findings below were **recovered from the run's journal** (raw fetch claims + verification verdicts). Verdicts (`[CONFIRMED n-0/2-1]`, `[REFUTED 1-2]`) are the harness's real 3-vote results. Claims marked `[credible]` were fetched but fell outside the top-25 verification budget — directionally strong, not adversarially proven. Source URLs re-attributed by claim content.

---

## 0. What changed vs. the July-2 research

The July-2 run established the *aesthetic* (premium = whitespace + light + real photography; motion wins awards; gold sparse; gold-on-dark is NOT inherently premium). This run adds the two things that were missing: **(a) how to be trustworthy as a new/small carrier without faking scale, and (b) concrete, verified build-or-skip rulings for each signature interaction.** Both the "gold-on-dark ≠ premium" refutation (July 2) and the new "two-color-neon-on-dark = premium" refutation (this run) point the same way — earn premium through restraint, light, and real content, not a dark gold theme.

---

## 1. Trust for a brand-new, one-truck carrier (the crux)

This is the hardest problem and the research is unusually clear: **for a new carrier, trust = verifiable honesty, not manufactured scale.**

- **Brokers confirm active MC authority through FMCSA SAFER.** `[CONFIRMED 3-0]` Surface USDOT **7638788** + a "Verify us on FMCSA SAFER ↗" link. (v2 already does this — keep it, make it prominent.)
- **Carrier vetting checks CSA BASIC scores (7 categories) + formal safety ratings.** `[CONFIRMED 3-0]` These are public and checkable, so the site's safety claims must be literally true.
- **New carriers carry a specific trust penalty:** recently-registered/transferred MC numbers are actively targeted by fraud, and have "less verifiable history." `[CONFIRMED 3-0]` The "chameleon carrier" pattern (spin up a new MC to escape a bad record) means a *legitimately* new carrier must actively differentiate from that profile. `[credible]`
- **"Unrated" is the normal state for a small carrier** — a majority of the smallest independents have never been rated, because FMCSA only rates carriers it audits. `[CONFIRMED 3-0]` So *new authority ≠ unsafe.* **But do not over-spin this:** the stronger claim that "the safest carriers are usually the unrated ones" was **`[REFUTED 1-2]`** — frame unrated honestly ("no violations on record; verify us on SAFER"), don't imply it's a badge of safety.
- **Mismatched business info is the dominant fraud marker** (>70% of fraud cases). `[credible]` → **NAP consistency** (name/address/phone identical everywhere, matching local area code) is a *trust* signal, not just SEO. KUL's public phone **678-972-1148** and Loganville, GA address must match across the site, footer, schema, and Google Business Profile.
- **Claiming broad capacity/many equipment types/many regions "without proof" reads as a double-brokering / fraud signal.** `[credible]` → **Present honest, narrowly-scoped capability.** Don't fake a big fleet or nationwide lanes you can't run. The growth story ("50 tractors by 2029") is the honest way to signal ambition without claiming present scale.
- **The three "fake it" pitfalls to refuse outright** `[credible]`, all acutely relevant because KUL has no fleet photos/testimonials yet:
  1. **No fabricated testimonials or client/broker logos** you haven't earned ("serious mistake … legal problems and reputation damage").
  2. **No recognizable stock "team"/fleet photos** ("creates immediate distrust").
  3. **No exaggerated claims** — "B2B buyers recognize hype … it makes them skeptical of everything else you say."
- **Trust signals work in layers:** the basics (clean modern design, HTTPS, fast, mobile-optimized) must land *before* advanced markers matter; and **too many badges reads as desperate, not confident** — show only the credentials KUL's buyers actually recognize (USDOT, MC, insurance, licensed & insured). `[credible]`
- **88% of buyers research a business online before contact** (higher in trucking, where freight = financial risk). `[credible]` The site is the vetting surface.

**Net trust doctrine for v3:** lead with *verifiable* credentials (USDOT/MC/SAFER/insurance), Mark's *real* photos and *real* founder story, and an *honest* growth narrative. The premium feel does the persuading; the facts do the proving; nothing is faked. This is both the ethical line and, per the evidence, the *effective* one.

---

## 2. Build-vs-skip rulings for the four signature interactions

### 2A. Doctor Bird intro → **BUILD (animated SVG + CSS/Framer). SKIP Lottie-runtime and canvas particles.**
- **The dotLottie runtime is heavy and getting heavier:** `@lottiefiles/dotlottie-react` grew ~16kb → ~51kb; a version migration alone added **+30.3kb gzip** to every page using it — "counter-productive" to its own perf goals. `[CONFIRMED 3-0 ×2]`
- **"Simplest solution first":** CSS/SVG for simple two-state/fade/hover motion; escalate to Lottie/Rive/JS only when the simpler tier can't meet the need. CSS transform/opacity is GPU-accelerated and respects reduced-motion. `[credible]`
- **LCP guardrail:** the LCP element must never be lazy-loaded and must not sit behind main-thread-blocking scripts. `[CONFIRMED 3-0]` → the intro renders as a **client overlay above SSR'd content** (hero paints underneath, so LCP fires behind it), first-visit-gated (`localStorage`), skippable, auto-dismiss ≤ ~2.5s, and reduced-motion collapses it to a static logo lockup. This is exactly v2's `LoadingOverlay` approach — keep and refine, don't rebuild on Lottie.

### 2B. "Strength in Motion" gold roadway + traveling truck → **BUILD as scroll-*linked* progress. SKIP scroll-*jacking*.**
- **Scroll-driven CSS animations run off the main thread, GPU-composited, and stay smooth even under heavy JS load** — the classic JS scroll-event approach janks. `[CONFIRMED 3-0 ×3]` A truck can travel a path via `offset-path` + `offset-distance: 0→100%` + `offset-rotate`, `animation-timeline: scroll()/view()`, `animation-duration: auto`. `[credible]`
- **But native support is ~82.58% (May 2026): Chrome/Edge 115+, Safari 26+, Firefox behind a flag.** `[CONFIRMED]` → needs an `@supports` feature-detect + fallback. Because the site already standardizes on **Framer Motion** (`useScroll`/`useTransform`, cross-browser, rAF, transform/opacity), **use Framer Motion as the baseline engine** and treat native CSS scroll-driven as an optional progressive enhancement. Do **not** add GSAP unless a moment truly needs pinning/scrubbing beyond FM (v2's `TruckChapters` already proves FM suffices).
- **Scrolljacking is a verified UX hazard:** altering scroll speed/direction disorients a majority of users, is worse on mobile, and is *worst when combined with reading text*. `[CONFIRMED 3-0 ×3]` NNG: only for progressive disclosure, below the fold, never change direction, avoid on mobile. And **never delay the H1** — "if an animation delays reading your H1 by two seconds, delete it." `[credible]`
- **Ruling:** the gold roadway is a **scroll-linked progress indicator that preserves native scroll** (the line draws / the truck advances *as you scroll normally*), confined to one signature stretch, transform/opacity/offset only, decorative SVG `aria-hidden="true"` + `tabindex="-1"`, and a reduced-motion rest state (static full roadway). It must never hijack the scroll or gate content.

### 2C. Interactive Southeast service map (FL/GA/TN/AL/SC) → **BUILD accessible-first, lightweight.**
- Inline **SVG** map, hover/focus highlight, but per WCAG 2.1 **state must be conveyed by more than color/motion** — pair highlights with visible **labels**. `[from a11y source]`
- **Interactive SVGs must be keyboard-operable:** focusable (`tabindex="0"`), operable, with accessible names and `aria-pressed`/`aria-expanded` state; use `currentColor` so it adapts to light/dark grounds. `[credible/a11y]`
- Provide a **plain text list of served states** as the no-JS / SEO / screen-reader fallback (and it doubles as honest scope disclosure). On mobile, prefer the labeled list or tap-to-highlight over hover.
- **Honesty constraint (from §1):** only illuminate regions KUL actually serves — the map states operating reality, it doesn't inflate it.

### 2D. Journey/scroll photography for the About story → **BUILD (the E-E-A-T engine). Gate parallax.**
- Scroll-linked **view-timeline** reveals (`cover`/`entry`/`exit` ranges) are the CSS-equivalent of IntersectionObserver and are the right primitive for photos fading/rising as the story scrolls. `[credible]` (FM `whileInView`/`useScroll` is the cross-browser baseline.)
- **Parallax specifically triggers vestibular disorders** (background/foreground move at different rates → dizziness, nausea, migraines). `[CONFIRMED 3-0]` → any parallax on Mark's photos **must** have a `prefers-reduced-motion` fallback that disables the differential movement (simple fade, no parallax). Handle dynamically via `matchMedia` so JS motion stops without reload; optionally split heavy animation CSS into a sheet reduced-motion users never download. `[credible]`
- This is the highest-value interaction: Mark's real landscape photography + real founder story is the one thing "no competitor can copy."

---

## 3. Forms & recruiting (verified conversion specifics)

**Freight quote (keep it short):**
- Optimal B2B form = **3–5 fields**; each extra field ≈ **−4.1%**; **>5 fields ≈ −30%**; **multi-step ≈ +37%** vs one long form of the same length; progressive profiling ≈ +47%. `[credible]`
- **Phone is the single highest-friction field (−18.7%)**, then budget (−15.3%), timeframe (−10.8%). `[credible]` → v2's quote form (origin, destination, freightType, pickupDate, contact = 5, + optional details) is already well-tuned; its generic "contact" field (email *or* phone) neatly dodges the phone-field penalty. If weight/dimensions/commodity are wanted, add them as an **optional step 2**, not required fields.
- A freight quote naturally wants: pickup, destination, freight type, weight, dimensions, timeline. `[credible]` — surface the first four; defer weight/dimensions to step 2.

**CDL driver recruiting (lead with life, not just wage):**
- Non-pay factors are now decisive: **home time, communication, respect, consistency** rank alongside pay. Top motivators to switch: improved **home time 63.7%**, predictable/higher **pay 61.6%**. Top reasons to leave within 3 months: **pay inconsistency 27.1%, lack of respect 20.7%**. 58.1% of drivers were actively job-seeking in Spring 2026. `[credible, survey]`
- **Speed-to-lead is decisive:** best response rates within the first **5 minutes**; drivers apply to several carriers at once. `[credible]` → the driver page should set the expectation of a fast personal callback, and the form must be **short + mobile-first** ("apply in minutes on your phone"), with clear salary/home-time/benefits up front. `[credible]` v2's driver form (name, contact, experience = 3 fields) is already correctly minimal.
- Be **upfront about pay, home time, benefits, schedule** to prevent drop-off. `[credible]` (Blocked on Mark supplying real numbers — see plan §Open Items.)

---

## 4. Award-reference patterns (adds to July-2's Terminal/Truck'N Roll/Rolls-Royce set)

- **Manuport Logistics** (B2B logistics) earned an Awwwards **Honorable Mention** on **scroll-driven animation + unusual navigation + horizontal layout + clean aesthetic**, GSAP-driven, with a restrained palette of **black #000 + one corporate blue #2779a7 + white**. `[CONFIRMED 3-0]` → logistics can win on *restrained palette + one accent + scroll storytelling* (map "corporate blue" → KUL gold).
- **Lando Norris** site (OFF+BRAND) — Awwwards **SOTD Nov 2025**, overall 8.18, Creativity 8.71; built on Webflow + WebGL + GSAP + 3D + gesture interactions. `[CONFIRMED stack]` Two sub-claims **REFUTED**: the motion-vs-accessibility tradeoff framing `[1-2]`, and "tight two-color neon-on-dark = premium" `[1-2]`. → don't cite a two-color dark palette as the premium lever (consistent with July-2).

---

## 5. Hard guardrails (verified, non-negotiable)

- **LCP ≤ 2.5s** at p75 (>4s poor); hero/LCP never lazy-loaded, `src`/`srcset` in initial HTML; no main-thread-blocking scripts before paint; a **text-node hero with a system/`font-display:swap` face has near-zero LCP image cost.** `[CONFIRMED 3-0 ×3]`
- **`prefers-reduced-motion` is mandatory**, handled dynamically (`matchMedia` change listener), with real rest states for every animation. Parallax without it is an accessibility failure. `[CONFIRMED 3-0 ×2]`
- **Decorative SVG** → `aria-hidden` + `tabindex="-1"`; **interactive SVG** → focusable + keyboard + ARIA state + non-color state cues. `[credible/a11y]`
- **Never gate meaning/H1 behind motion; never hijack native scroll.** `[CONFIRMED 3-0]`

---

## 6. Refuted (do not build on these)
- ❌ "Heavy-motion award sites accept an accessibility tradeoff (8.60 anim vs 7.00 a11y)." `[REFUTED 1-2]`
- ❌ "A tight two-color neon-on-near-black palette = premium (validates gold-on-dark)." `[REFUTED 1-2]` (Twice-refuted theme across both research runs.)
- ❌ "The safest carriers are usually the unrated ones." `[REFUTED 1-2]` — unrated is *normal*, not a safety *badge*; frame honestly.

## 7. Sources (28)
caniuse.com/mdn-css_properties_animation-timeline_scroll · developer.chrome.com/docs/css-ui/scroll-driven-animations · developer.chrome.com/blog/scroll-animation-performance-case-study · smashingmagazine.com/2024/12/introduction-css-scroll-driven-animations · denniskats.dev/blog/path_scroll_animation · gsap.com/community/forums (ScrollTrigger vs CSS scroll timelines) · github.com/LottieFiles/dotlottie-web/issues/357 · web.dev/articles/optimize-lcp · web.dev/articles/prefers-reduced-motion · a11y-collective.com/blog/svg-accessibility · nngroup.com/articles/scrolljacking-101 · get-started-int.com (scrolljacking-is-evil) · johnsirrine.com/most-award-winning-websites-suck · trajectorywebdesign.com/blog/b2b-website-trust-signals · awwwards.com/sites/manuport-logistics · awwwards.com/sites/lando-norris · truckstop.com/blog/carrier-vetting · truckstop.com/blog/protect-your-freight-business-onboard-carriers-you-can-trust · overdriveonline.com (FMCSA safety rating podcast) · carrierassure.com/blog/5-signs-a-trucking-company-might-be-a-red-flag · rockytransportinc.com/blog/trucking-company-website-importance · thetrucker.com (driver survey Spring 2026) · brixongroup.com (B2B lead forms) · getdoublenickel.com (70% contact rates; best ways to recruit CDL 2025) · conversionia.com (driver recruiting 2026) · medium.com/@vacmultimedia (CSS/Lottie/Rive/JS strategy) · web.dev · awwwards.com. Full recovered evidence with per-claim quotes: session `scratchpad/research-digest.md`.
