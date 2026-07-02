# Longbow Recreation: Discovery Report, Animation Audit, Implementation Plan

NT Site Mirror v1.1 deliverables for: recreate the structure of longbowmotors.com with KUL content and placeholders.

## Discovery Report

### Task
- Source URL / evidence: https://longbowmotors.com/ (live site, observed in Chrome desktop 1485x812 and mobile 390x844)
- Mode: **Editable Recreation** (we do not own the source site; rebuild from observation with KUL-original content only. No Longbow copy text, imagery, video, code, or trademarks are reproduced.)
- Permission context (user-stated): KUL client project; Longbow is a design reference to adapt, all content replaced with KUL information and placeholders
- Scope Classification: **Multi-Route Site**

### Stack & Architecture (observed facts)
- Framework / build: WordPress + Avada theme (Fusion Builder `.fusion-fullwidth` sections, `awb-icons` font, jQuery present)
- Styling architecture: Avada/Fusion builder CSS, Google Fonts
- Animation system(s): **GSAP + ScrollTrigger** (window.gsap and ScrollTrigger both present); scroll-fade reveals; no smooth-scroll library detected (no Lenis/Locomotive)
- Routing structure: WP pages: `/about/`, `/longbow-technologies/`, `/longbow-ownership/`, plus legal (`/climate-statement/`, `/legal-notices-disclaimers/`, `/privacy-policy/`, `/terms-conditions/`)
- Asset pipeline / CDN: same-origin WP uploads; HubSpot form embed (js.hsforms.net iframe)
- Existing repo: KUL Next.js 15 site (this repo), main branch

### Design System (measured)
- Typography:
  - Display: **Playfair Display 400** (serif) at ~37px (section headings) and ~49px (product names, cream #E3DED0)
  - Eyebrow/hero H1: **Montserrat 600**, ~33px, letter-spacing ~0.3em (9.8px), off-white, all-caps styling
  - Body: **Montserrat 400**, 15px / 22.5px line-height
  - Both families are Google Fonts (OFL) and freely usable
- Color values (by frequency): gold **#9D895C** (x18: nav wordmark, buttons, accents), off-white **#F8F8F8**, near-black **#161616** (body bg), light **#F4F4F4**, cream **#E3DED0**, black #000
- Spacing: full-viewport section bands (615 to 771px tall at 812px viewport); pill nav inset ~150px from edges; generous interior padding
- Breakpoints: desktop layout collapses to a single column on mobile (390px verified); nav pill persists with same hamburger + wordmark + CTA

### Module Trigger Scan
| Trigger | Detected? | Module |
| --- | --- | --- |
| WebGL / canvas / 3D | **No** (0 canvas; "suspended car" visual is photography/render imagery, not runtime 3D) | not activated |
| Audio | No (0 audio elements) | not activated |
| Video | **Yes** (hero: autoplay/loop/muted MP4 1920x1080, no poster) | `modules/video.md` rules apply |
| Multiple routes | **Yes** (3 content pages + 4 legal) | `modules/multi-route.md` rules apply |
| Runtime-loaded assets | Suspected minor (WP lazyload of images; HubSpot iframe) | noted |

### Link & Route Inventory (source → KUL recreation)
| Source link / route | Status in recreation | KUL target |
| --- | --- | --- |
| `/` homepage | Recreated locally | KUL homepage, Longbow structure |
| `/about/` | Recreated locally | existing `/about` (restyled to match) |
| `/longbow-technologies/` | Recreated locally | `/services` (KUL's 7 services) |
| `/longbow-ownership/` | Recreated locally | `/careers` or `/quote` (mapping decision below) |
| Forum (menu item) | Replaced | omit (no KUL equivalent) |
| Enquire (menu, gold) | Recreated locally | `/quote` |
| BUILD YOURS (nav CTA) | Recreated locally | "REQUEST A QUOTE" → `/quote` |
| Legal routes (4) | Out of scope v1 | footer links to existing pages only |
| `/author/longbowdev/` | Out of scope | WP cruft, not part of design |
| HubSpot form embed | Replaced | KUL native quote/contact form (Resend) |

### Source Module Inventory (homepage, source order)
| # | Module | Type | Visibility | Notes |
| --- | --- | --- | --- | --- |
| 1 | Floating pill nav: hamburger left, gold mark + tracked wordmark center, gold pill CTA right | fixed nav | always | hamburger opens simple white dropdown list (About, Technologies, Ownership, Build items, Enquire in gold) |
| 2 | Hero: full-bleed autoplay video, centered tracked-out caps H1 near top | video hero | always | dark cinematic footage |
| 3 | "DNA" band: dark, serif heading left, body copy + outline ABOUT button right, large product visual center | split content | always | scroll fade-up |
| 4 | Product split: two half-width panels (SPEEDSTER / ROADSTER), serif cream names above full-bleed product photos, gold RESERVE buttons | 2-up product grid | always | hover treatment Unknown |
| 5 | Press logo band: 6 grayscale logos + serif pull quote + attribution | social proof | scroll-faded in | logos at low opacity until scroll |
| 6 | Vision band: full-bleed top-down product image, serif heading "Shaping the future..." left | full-bleed statement | always | fade-in heading |
| 7 | Second statement band (continuation, full-bleed imagery) | full-bleed | always | |
| 8 | Sky/clouds transition band into light section, centered gold mark | full-bleed transition | always | dark-to-light pivot |
| 9 | FAQ: light #F8F8F8 band, centered heading, accordion list (~1700px tall) | accordion | always | |
| 10 | Lifestyle photo band: full-bleed golden-hour photo, two people in product | full-bleed | always | |
| 11 | Footer: dark #161616, logo, link columns, legal | footer | always | |

### Findings
**Facts:** all of the above (observed/measured). Gold-on-black + serif display + tracked caps + full-bleed alternation is the visual formula. Motion is modest: scroll fades, no pinning, no scrubbing, no 3D.
**Assumptions:** product-panel hover states exist but were not captured; FAQ accordion behavior is standard Avada toggle.
**Unknowns:** inner-page layouts beyond the homepage (About/Technologies/Ownership) were not deeply captured this pass; exact GSAP timings (estimated in audit).

## Animation Audit

| # | Element | Trigger | Duration | Easing | Start → End | Transforms | Pin/scrub | Module |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Hero video | load | continuous loop | n/a | autoplay muted | none | none | video |
| 2 | Section headings/copy | scroll into view | ~0.8s (est.) | ease-out (est.) | opacity 0, y ~30px → visible | opacity + translateY | none | GSAP ScrollTrigger |
| 3 | Press logos + quote | scroll into view | ~1s (est.), staggered (est.) | ease-out | low opacity → full | opacity | none | GSAP |
| 4 | Nav pill | scroll | instant/persistent | n/a | stays fixed, no transform observed | none | none | CSS |
| 5 | Menu dropdown | click | ~0.2s (est.) | ease | hidden → white dropdown | opacity/height | none | theme JS |
| 6 | FAQ accordion | click | ~0.3s (est.) | ease | collapsed → expanded | height | none | theme JS |

**Motion system conclusion:** Framer Motion is fully sufficient (fades, staggers, accordion). No GSAP needed; the source's own motion vocabulary is simpler than what the KUL build already ships. Shared config: reuse existing `lib/motion.ts` (0.6-0.8s, cinematic ease).

## Implementation Plan

### Approach
Recreate the Longbow homepage structure 1:1 as a KUL-branded page in this repo, one section at a time, using KUL content everywhere and clearly marked placeholders where content does not exist yet. Typography choice: **Playfair Display + Montserrat** (open fonts, matches source feel) loaded via next/font, applied only to this page's scope so the rest of the site keeps Sora/Inter until a global decision is made.

### Section sequence (Phase 4 order)
1. Floating pill nav (hamburger dropdown, centered KUL lockup, gold pill "REQUEST A QUOTE")
2. Video hero: KUL intro-film footage or night-rig imagery, centered tracked-caps H1 "STRENGTH IN MOTION" (KUL's own line)
3. DNA band → "Trust is in our DNA": serif heading, body, outline ABOUT button, hero-scale rig image
4. Product split 2-up → FREIGHT / DRIVERS panels (ship-with-us vs drive-with-us paths), gold buttons
5. Proof band → USDOT/MC/Licensed-Insured/24-7 as the "logo row" + one client-style pull quote placeholder
6. Vision band → full-bleed top-down truck image (stock placeholder), serif "Building the Southeast's most trusted carrier"
7. Transition band → sky/dusk full-bleed with centered Doctor Bird mark, dark-to-light pivot
8. FAQ: light band, accordion with real carrier FAQs (quote turnaround, coverage, insurance, packet)
9. Lifestyle band → full-bleed golden-hour driver/rig photo (stock placeholder)
10. Footer: dark, KUL lockup, link columns (existing footer restyled or reused)

### Asset plan (classification)
| Asset | Status |
| --- | --- |
| Longbow video, photos, renders, logos, copy | **Not used** (protected; never copied) |
| Hero video | User-Supplied Replacement (KUL intro film) or Recreated (night-rig stock) |
| Rig photography | Local Copy (already-licensed Pexels/Unsplash in repo) + Approximated placeholders where noted |
| Fonts | Local Copy via next/font (Playfair Display, Montserrat; both OFL) |
| KUL lockup, bird | Original (client assets already in repo) |
| FAQ/quote/ownership copy | Recreated (KUL-original copy, placeholders marked) |

### Safe change boundary
New page component tree + fonts scoped to it; shared `lib/site.ts` data reused read-only; existing pages untouched except where the user chooses Replace-homepage.

## Validation, second pass (1:1 rebuild to measured skeleton)

Re-inspected the source in-browser with per-section geometry extraction, then rebuilt the concept homepage to the measured skeleton:
- Measured and applied: hero pt-170 with centered tracked-caps title; statement band py-242 with a 320px left column (heading, copy, pill button) over a right-weighted visual; 711px full-black 2-up panels with centered stacks (display name, 13px line, pill CTA); proof band with 17px gray tracked caps heading, six dim marks at reduced opacity, 22px display quote; two full-bleed statement bands with a 468px left column at the 275px gutter; 612px centered 55px statement over sky pivoting to light; FAQ with hairline rule, 15px gold tracked-caps heading left, boxed accordion with plus markers and 15px questions; 629px lifestyle band; 4-column footer.
- Buttons match reference metrics: 100px radius pills, 12px caps, 3px tracking, 9x20 padding, in KUL gold.
- Typography per client: **Omnibus Bold** (user-supplied) for display headings, **Montserrat** 400/600 for body and labels. Same licensing caveat as Trenda: confirm web-embed rights for Omnibus before production.
- Verified in Chrome at 1485px: hero, statement band, panels, proof band, statement bands A/B, sky-to-light pivot with the bird, FAQ open/close interaction, lifestyle band, footer. Zero console errors. Production build 29/29 pages, lint clean.
- Structure only was recreated; all copy, imagery, and marks are KUL-original or licensed stand-ins.

## Validation (Phase 5, first pass)

- Routes shipped: `/concept` (home, all 10 modules + concept nav/footer), `/concept/about`, `/concept/services`, `/concept/drivers`, `/concept/quote`. Production build exits 0, lint clean, zero console errors.
- Typography: user-supplied **Trenda** (Light 300 / Regular 400 / Semibold 600 / Bold 700 / Black 900) via next/font/local, scoped to the concept subtree. Licensing note: Trenda is a commercial Latinotype family; confirm the license covers web embedding before production use.
- Desktop (1440) verified: pill nav, tracked-caps hero over night rig with slow drift, DNA band, Freight/Drivers split panels, credentials proof band with founder quote, vision band (client wave photo), sky transition with Doctor Bird pivot to light, FAQ accordion, lifestyle band, footer.
- Mobile (375) verified after fix: nav CTA compacts to "QUOTE" so the centered lockup never collides.
- Main site unaffected: chrome swap confirmed (original header/footer render everywhere outside /concept).
- Forms reuse the production QuoteForm/DriverForm handlers (Resend, env-guarded).

### Honest status (Completion Integrity)
- **Completed:** all 5 concept routes, structure per plan, responsive, validated in browser.
- **Approximated (declared placeholders):** hero uses a licensed night-rig still with a slow-drift treatment in place of cinematic fleet footage (footage does not exist yet); split-panel and lifestyle imagery are licensed stock stand-ins pending Mark's fleet/driver photos.
- **Not recreated by design:** source inner-page layouts were Unknown at discovery; concept subpages use restrained defaults from the same design system rather than invented copies.
- **Not used, by rule:** no source copy, imagery, video, code, fonts, or marks. All content is KUL-original or user-supplied.

## Risks
- **Placement decision required** (see Implementation Request): replacing the current homepage discards the already-approved journey-scroll homepage unless kept on a route or branch.
- Typography split-brain: Playfair/Montserrat on this page vs Sora/Inter elsewhere until a global call is made.
- Product-panel hover behavior and inner-page layouts are Unknown; recreation uses restrained defaults and flags them.
- The source's serif-luxury voice differs from the locked "Blueprint" art direction in one respect (serif vs geometric sans). Mark locked feel, not fonts, so this is presentable, but it is a real brand decision for him.
- Hero video: KUL's intro film is logo-centric; a driving-footage hero would need new footage (placeholder until then).
