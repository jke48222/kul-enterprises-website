# 26. Full audit: codebase, site, and design

**Run 2 August 2026** against the working tree at `ea8a25e` and the dev server, verified in
Chrome. Three instruments: a codebase sweep, a static accessibility sweep, and the design
detector, with every headline finding re-verified by hand in source and each page walked
in the browser (desktop; the mobile pass stands on the measured 31 July evidence, which the
code has not contradicted since). Nothing was fixed during the audit; this document is the
work list.

**RESOLVED 2 August 2026, same day.** Every finding below was fixed in five commits
(`a2d1780` harden, `52456cf` distill, `40ea447` clarify, `dfad76c` adapt, `9b8ea29`
polish), verified in Chrome and by a clean production build. Two items remain open by
their nature, both client-side: the field-note transcript needs Mark's own words (the
field, the dialog rendering, and the briefing request are in place), and the MC number
remains his confirmation. ShapeGrid's motion gate still samples once at mount; its CSS
layer responds live, and the residue is recorded here rather than half-fixed.

One environment note so nobody re-litigates ghosts: the Chrome window was occluded during
the run, which freezes CSS transitions, delays IntersectionObserver, and leaves loaded
images unpainted. Everything that looked broken for that reason was re-verified against the
DOM and is recorded in the memory notes, not here. Only real defects are listed.

---

## Audit health score

| # | Dimension | Score | Key finding |
|---|-----------|-------|-------------|
| 1 | Accessibility | 3/4 | Form failure is never announced to screen readers, on the conversion path |
| 2 | Performance | 3/4 | A 6.1 MB video plays in a 200px menu sleeve; a dead font downloads on every page |
| 3 | Responsive design | 4/4 | Zero overflow at 320/375/1440; the tap-target idiom is systematic |
| 4 | Theming | 3/4 | The token system is measured and honest, but dead tokens and a dead compat block misdocument it |
| 5 | Implementation integrity | 4/4 | Detector found two findings; both are false positives (the checkbox tick glyph) |
| **Total** | | **17/20** | **Good: address the weak dimensions** |

### Implementation integrity verdict: PASS

The implementation expresses one coherent, deeply product-specific system. The two-register
palette, the measured contrast comments, the plate register, the man-versus-institution
typography rule, and the honesty constraints (hollow tick 02, type-only scene 3, no stock
photography) all interlock; nothing reads as template output. The bundled detector returned
exactly two findings, both on `components/forms/QuoteForm.tsx:244`, and both are the drawn
checkmark of the custom consent checkbox (`checked:after:border-b-2 border-r-2`), not a
side-accent card. False positives, verified.

---

## P1: fix before the client meeting or launch

1. **The sitemap omits /journey and /road-ahead.** `app/sitemap.ts:10-24` lists every
   commercial and legal route but not the two story routes linked from the nav and home.
   Category: SEO/metadata. Fix: add both paths.

2. **A failed form send is invisible to screen readers, on all four forms.**
   `components/forms/FormShell.tsx:84-97` holds the `role="alert"` region, but every form
   unmounts it in the error state and renders a plain paragraph instead
   (`ContactForm.tsx:127`, `QuoteForm.tsx:274`, `DriverForm.tsx:156`, `PacketForm.tsx:172`).
   The forms are the site's whole conversion path; a blind broker hears silence. WCAG 4.1.3.
   Fix: `role="alert"` on the four visible error paragraphs.

3. **Scene 1's film ignores reduced motion and cannot be paused.** The reduced-motion CSS
   targets `.k-s01-film` (`app/globals.css:1272`) but no element carries that class:
   `Scene01Beginning.tsx:119` renders a bare autoplaying, looping video. Motion-sensitive
   readers get full-motion night footage; WCAG 2.2.2 wants a pause for any loop over 5s,
   which `HeroVideo` already implements. Fix: add the class and route the film through the
   HeroVideo pause pattern.

4. **Scene 16's `role="img"` swallows Mark's own words.** `Scene16RoadAhead.tsx:116` wraps
   the whole instrument, including the three station sentences, so assistive tech gets only
   the summary label and the stations exist nowhere else. Fix: scope `role="img"` to the
   comb only and move the stations outside it.

## P2: fix in the next working pass

5. **`tinacms` sits in devDependencies** while ten shipped views import
   `tinacms/dist/react`; any `--omit=dev` install breaks the build. Move to dependencies.
6. **Montserrat downloads on every page and nothing uses it** (`app/layout.tsx:14-19`; its
   only consumer is dead compat CSS). Delete the load, the variable, and the config entry.
7. **Dead style system misdocumenting itself**: the marked v1 compat block
   (`globals.css:1308-1326`), the further dead v2 utilities (`.btn-gold`, `.scrim-*`,
   `.img-grade` et al, verified unreferenced), the dead tailwind tokens guarded by a stale
   "load-bearing" comment, the unloaded `Omnibus-Bold.ttf`, and `@google/model-viewer` in
   dependencies. One deletion pass, one commit.
8. **`SceneSection.tsx` is orphaned and its header misleads** ("every scene is wrapped in
   this"; none is). Delete it; the ramp explanation lives in the spine.
9. **The journey nav sleeve plays the full 6.1 MB `dash-daylight.mp4`** in a 200px tile
   while the 1.7 MB `-720` file sits unused (`lib/journey.ts:46`). Point it at the 720.
10. **`"PL. —"` in Scene 11 is a user-facing em dash**, the one banned character, shown in
    the well four times out of six (`Scene11People.tsx:286`). Render the empty-plate state
    without it.
11. **Home still says "Six chapters · the story so far"** (`content/pages/home.json:79`)
    two days after the Journey became seventeen scenes in five acts. CMS edit.
12. **The FAQ hardcodes the USDOT and MC numbers** and bypasses the `{token}` system
    because `Faq.tsx` never runs `fill()`; an authority-number correction would silently
    miss the FAQ and its JSON-LD. Wire `fill()` through FAQ strings and tokenize.
13. **The field-note video has speech and no captions or transcript** (WCAG 1.2.2). Add a
    captions track or a transcript block in the dialog.
14. **Autoplay loops without a pause control** on the About founder film and the nav
    sleeve (the HeroVideo header itself states the standard). Route through HeroVideo.
15. **Scene 11's roll-call rows are six focusable non-controls**, and below `lg` the well
    they drive does not exist. Drop `tabIndex` and let scroll drive the well.
16. **Escape does not close the nav flyout once focus is inside it** (`Nav.tsx:373`
    attaches the handler to the trigger link only). Move it to the header element.
17. **Scene 5's road-stripe rhyme drifts off the seam at wide viewports** (measured at
    1538px: the painted line sits well right of centre and diagonal). The spec's own escape
    hatch applies: crop to the road's shoulder instead, or tune object-position per
    breakpoint. Related: **scene 8's plate stops bleeding off the left edge above ~1490px
    viewports** because the centered container caps it; use a viewport-edge breakout if the
    bleed is wanted at all widths.

## P3: polish queue

18. JSON-LD injected without `<` escaping (`layout.tsx:246`, `home-view.tsx:658`); escape
    `<` before injection.
19. Email subjects keep interior newlines from posted fields (`lib/email.ts:151`); flatten.
20. `readForm` forwards unlimited body keys into logs and the lead webhook; whitelist per
    route.
21. Orphaned public assets, about 3.2 MB (bird PNG/webp set, old logo files, unused truck
    renders and rims, `dash-daylight-poster.jpg`); delete or move to the assets inbox.
22. Unconsumed exports (`TOKEN_HELP`, `fillAll`, `TOTAL_VH`), stale
    `next.config.mjs` image qualities, `aria-controls` pointing at an unmounted id
    (`Nav.tsx:376`), /quote's four micro-`h2`s flattening the outline, reduced-motion
    sampled once and never observed live, scene 1's 1px scroll-cue target, the two 11px
    buttons without the house hit-area pseudo, inconsistent new-tab disclosure on the two
    FMCSA links, and scene 11's `startViewTransition` promises lacking a `.catch` (aborted
    transitions log InvalidStateError; reproducible by fast scrolling).
23. Scene 17's plate index wraps a non-navigation record in `<nav>` with layout-only
    column heads; acceptable linearized, better as a section or true table.
24. The MC number (66389691, eight digits) remains a client-confirmation item published in
    four places; already on Mark's decision list, restated here so the audit is complete.

## Patterns

- **The one systemic weakness is announcement, not structure**: visible states (form
  errors, role="img" content, uncaptioned speech) that assistive tech never receives. The
  structural side (landmarks, headings, focus management, dialogs) is genuinely strong.
- **Dead weight accumulates at redesign seams**: every rebuild (v1→v2→k) left a stratum of
  unreferenced CSS, tokens, fonts, and assets, now actively misdescribing the system to the
  next editor. One sweep commit retires all of it.
- **Viewport-fragile art direction**: two scenes tuned against one canvas width (5's
  stripe, 8's bleed) behave differently at other widths. Compositions that depend on
  geometry need either viewport-relative math or an explicit crop decision.

## Positive findings

- API routes: rate-limited, honeypotted, validated, fail loudly without the email key, and
  leak nothing; security headers present; env hygiene correct.
- The visibility contract holds everywhere it was checked: no-JS, failed-JS, and
  reduced-motion all render a complete, readable page, including all seventeen Journey
  scenes.
- Contrast is engineered, not asserted: measured values with worst-case notes at every
  layer, and the browser re-measurement in this audit found every text state clearing AA at
  both ends of every gradient.
- Copy discipline: zero em dashes in content except the one flagged fallback; counts and
  facts agree across pages (colophon vs register, fields vs form, acts vs structure); the
  single-source token system means the phone number exists in exactly one file.
- The seventeen-scene Journey renders end to end in a real browser with the seams joining
  exactly and each scene's device (drill, laminate, instrument, index) legible and product-
  specific.

## Recommended actions, in order

1. **[P1] `/impeccable harden`**: the four P1s (sitemap, form alerts, scene 1 film,
   scene 16 role scope) plus the P2 a11y cluster (captions, pause controls, roll-call tab
   stops, nav Escape).
2. **[P2] `/impeccable distill`**: the dead-weight sweep (compat CSS, dead tokens,
   Montserrat, Omnibus, model-viewer, orphaned assets, SceneSection) and the dependency fix.
3. **[P2] `/impeccable clarify`**: the copy corrections (home eyebrow, PL fallback, FAQ
   tokens).
4. **[P2] `/impeccable adapt`**: scene 5 stripe and scene 8 bleed across widths.
5. **[P3] `/impeccable polish`**: the remainder of the polish queue in one pass.
