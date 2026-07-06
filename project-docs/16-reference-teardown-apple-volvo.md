# Reference Teardown — Apple + Volvo Trucks (for KUL v3)

Produced with the `nt-site-mirror` skill in **reference-extraction mode** (Editable Recreation, not a clone). We did **not** copy Apple/Volvo source code or protected assets — this is an observed design-language teardown to steer KUL's own build. Mark named both as his north stars ("Apple's simplicity + Volvo's premium, confident design language").

**Evidence captured (this session):**
- Full-page screenshots, desktop/tablet/mobile, of `apple.com`, `apple.com/iphone`, `volvotrucks.com`, and the `Volvo FH16` model page → full-res in session scratchpad; compact desktop thumbnails committed to `project-docs/reference/`.
- Computed design tokens (type scale, palette, section rhythm, CSS variables) → `project-docs/reference/apple-volvo-tokens.json`.
- Verification basis: **Observed visually** + **DOM/computed-style confirmed**. Motion timings are estimates unless noted.

---

## Headline conclusion (drives the whole v3 plan)

**Both reference sites are predominantly LIGHT, not dark.** This is the single most important, most counter-intuitive finding, and it independently confirms the July-2 research (which *refuted* "gold-on-dark = premium").

- Apple base = `#ffffff` with its signature `#f5f5f7` light gray; pure black (`#000`) is reserved for a handful of **cinematic product tiles** (MacBook Pro, iPad Pro, AirPods).
- Volvo base = `#ffffff` / `#f7f7f7` / `#ededed`; near-black `#212121` is used for **buttons** and full-bleed **image bands**, not as the page ground.
- The premium feel on both comes from **whitespace + huge type + art-directed photography + one restrained accent**, exactly the opposite of a wall-to-wall black "dark SaaS" look.

→ **KUL v3 is a light-dominant editorial site with dark cinematic beats**, gold as the rare accent. (See `18-v3-build-plan.md §4 Design system`.)

---

## APPLE — observed tokens & patterns

### Type (computed, desktop)
| Element | Size / line-height | Weight | Tracking | Family |
|---|---|---|---|---|
| Product H1 (iPhone page) | **80px / 84px** | 600 | **−1.2px** | SF Pro **Display** |
| Homepage tile H3 | 40px / 44px | 600 | normal | SF Pro Display |
| Tile subhead (`p`) | 28px / 32px | 400 | +0.2px | SF Pro Display |
| Body / nav / links | 17px / 21–25px | 400–600 | −0.37px | SF Pro **Text** |
| Eyebrow/meta | 12–14px | 400 | −0.12px | SF Pro Text |

Rules observed: **display face vs text face split at ~20px**; line-height *tightens* as size grows (84/80 ≈ 1.05); slight **negative tracking on large type**; ink is **`#1d1d1f`** (not pure black), secondary text `rgba(0,0,0,.56)`.

### Color
- Grounds: `#ffffff`, `#f5f5f7` (the Apple gray), `#000000` (product tiles only).
- Ink `#1d1d1f`; accent (the ONE color) = link/CTA blue `#0071e3` / `#0066cc`.
- Buttons: **pill**, `border-radius: 980px`; ghost ("Learn more") + filled-accent ("Buy") **paired**.

### Spacing / layout
- Section vertical rhythm on the iPhone page: **112px top & bottom** between sections; hero 60px top.
- Container max-width ~**1260px**; global nav height **44px** (thin, sticky, blurred).
- Micro-durations: nav transitions `.24s`; flyover `.5s`.

### Composition patterns to steal
1. **Tile grid homepage** — full-bleed marquee tiles stacked, then a 2-up grid of smaller tiles; each tile = centered headline + subhead + **dual pill CTA** + centered product hero on light or black.
2. **Alternating light/dark tiles** — the dark tiles ARE the drama; everything else breathes white.
3. **Sticky anchored product sub-nav** (iPhone page: "iPhone" + model links + Buy) — maps to the Rolls-Royce "anchored service sub-nav" idea already in our design direction.
4. **Card carousels** ("Explore the lineup", "Get to know iPhone") — horizontal, snap, pill CTAs.
5. **Comparison accordion** ("Significant others") — collapsible compare rows.
6. Motion (known, not fully measurable headless): slow scroll-pinned product reveals, opacity/transform only, nothing gates the headline.

---

## VOLVO TRUCKS — observed tokens & patterns

### Type (computed, desktop) — face: **Volvo Novum** (custom brand sans), 700 for headings
| Element | Size / line-height | Weight | Tracking |
|---|---|---|---|
| Hero / page H1 | 48px / 56px | **700** | −0.48px |
| H2 | 32px / 40px | 700 | −0.32px |
| H3 | 24px / 32px | 700 | −0.24px |
| H4 / labels | 16px / 24px | 700 | normal |
| Body `p` | 14px / 20px | 400 | +0.28px |

Note: Volvo's display scale is **smaller and denser** than Apple's — more corporate. KUL should lean **closer to Apple's scale** (bigger, more editorial) but borrow Volvo's **700-weight tight-tracking** confidence for headings.

### Color (from the `--vcdk-*` design-kit tokens)
- Grounds: `#ffffff`, `#f7f7f7`, `#ededed`.
- Ink `#212121`; secondary grey `#575757` / `#53565a`.
- **Primary button = near-black `#212121`** (hover `#333`); "marketing" button = Volvo blue `#2a609d`.
- A muted category-accent set (blue/teal/purple/orange) exists but is used sparingly on cards.

### Composition patterns to steal
1. **Full-bleed cinematic hero** — near-full-viewport truck video/image, minimal overlaid H1 ("Built with purpose."), a **ghost** CTA, and a **pause/play control** bottom-right (accessibility + polish). This is the KUL homepage hero blueprint.
2. **"Truck on a reflective plane" editorial shot** — the single most premium image on the site: one truck, vast negative space, mirror reflection. The aesthetic target for KUL's eventual fleet photography.
3. **2-up full-bleed image bands** (Trucks / News) — dark photo, white overlaid heading + one line + ghost button.
4. **Model page IA (FH16) = the KUL service-detail template:**
   `cinematic hero → light spec card (Applications / Power / Availability) → "powered for productivity" feature showcase (one big image + 3-up captioned features) → "Tailor your FH16" configurator CTA → alternating image/text proof bands → engine/proof section (big haul image + 2-col stats) → dark 2-up feature grid → footer.`
5. **Safety/heritage-as-architecture** — quality, safety, environmental care are top-level nav and recurring themes, not a buried page. KUL's "Safety & Compliance" gets the same prominence.
6. Restraint: ghost buttons everywhere, one blue accent, lots of white, confident tight headings.

---

## Translation table → KUL v3

| Apple/Volvo device | KUL v3 application |
|---|---|
| Light ground `#fff` / `#f5f5f7` (Apple), `#f7f7f7` (Volvo) | KUL light ground = white + warm off-white `#F5F4F1` |
| Pure-black cinematic tiles/bands | KUL dark beats `#0B0B0B`: intro, hero, "Strength in Motion", Safety, footer |
| The ONE accent (Apple blue / Volvo blue) | **KUL gold `#D4AF37`** — nav CTA, one hairline/section, active underline, primary CTA, loading mark. Never more than ~2 gold marks per viewport. |
| SF Pro Display 80px/−1.2px, lh 1.05 | KUL display: geometric/grotesk sans, `clamp()` up to ~5–6rem, lh ~1.05, slight negative tracking |
| Volvo Novum 700 tight headings | KUL section headings: 700 weight, tight tracking, confident |
| Dual pill CTA (ghost + filled accent) | KUL: ghost "Become a Driver" + filled-gold "Request a Freight Quote" |
| Volvo full-bleed hero + pause control | KUL night-truck hero (video → poster fallback) + pause control |
| Volvo "truck on reflective plane" | Art-direction brief for the KUL fleet shoot (the critical missing asset) |
| Volvo FH16 model-page IA | KUL `/services/[type]` detail-page template |
| Apple sticky anchored sub-nav | KUL service-page anchor bar: OVERVIEW · COMMITMENTS · QUOTE |
| Apple 112px section rhythm, 1260px container | KUL desktop section rhythm ~clamp(88–128px); container ~1200–1280px |
| Apple comparison accordion | KUL Carrier Packet / FAQ accordion |

**Fidelity note (honesty rule):** scroll-choreography *timings* on Apple/Volvo run in JS we did not reconstruct — the motion mappings above are directional, to be re-derived at build time against `prefers-reduced-motion` and a transform/opacity-only budget. Screenshots + tokens are observed facts; motion feel is an informed estimate.
</content>
