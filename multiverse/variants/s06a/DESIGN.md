# s06a — Industrial Ledger · design system

Scope: this variant directory only. World: KUL Enterprises presented as its own
engineering specification sheet (doc ref KUL-SS-01). Mode: Persuade.

## Durable rules

- **Grid is the surface.** Hard mondrian panels on a cool gray ground; the seam
  (`--seam`, ground showing through grid gap) is the only separator. No borders
  between panels, no border-radius anywhere, no box-shadows ever.
- **One full-gold panel per screen** (`--gold` #D4AF37). The §06 quote panel is
  the committed block; all other gold is ticks, stamps, and washes governed by
  `--gold-freq` (0–100 → `--gold-mix`).
- **Registration ticks** (`.reg`, 11px plus-marks) sit on seam intersections of
  load-bearing panels only — never decorate every corner.
- **Two voices:** Archivo (400–800) for headlines and prose, sentence case,
  tracking ≥ -0.03em; Chivo Mono (400/500) exclusively for measurement — doc
  refs, stamps, specs, dates, dimensions. Mono never carries prose.
- **Annotations are bracketed** (`.bkt` renders `[ … ]`; `--bracket-style`
  0 none · 1 corners · 2 framed). Arrows are literal glyphs ↘ ↗ ← →.
- **Stamps** (`.stamp`) carry credentials and statuses; `--stamp-style`
  0 flat · 1 boxed · 2 plate. USDOT/MC always appear as stamps, never prose.
- **Material palette** derives from `--gray-hue` (20 warm → 220 cool, default
  160): ground 76%, paper 94%, paper-2 89%, mid 62%, deep 40%, ink 9% lightness.
  Never introduce colors outside gray-scale + gold.
- **Imagery law:** freight, road, machine, and material only. Journey photos are
  the founder's own, labeled as field records with `REF F-nn` stamps; drawings
  are hairline engineering elevations (1.4px strokes, non-scaling), dimension
  callouts in `--gold-deep`.
- **Truth is the aesthetic:** every number on the page is real (USDOT 7638788,
  MC 66389691, fleet 1/50, dates are actual revision dates). The 50-tick fleet
  scale must always show the true count filled.
- **Motion:** one orchestrated system — panels rise 14px, stamps snap in with
  `steps`-like pop, the Fig. 01 drawing draws itself once (stroke-dashoffset).
  Everything visible without JS and under `prefers-reduced-motion`.

## Tweak contract (window.KUL_TWEAKS)

`--gold` (color) · `--gray-hue` (20–220) · `--seam` (0–8px) · `--gold-freq`
(0–100) · `--bracket-style` (0–2) · `--stamp-style` (0–2) · `--pad` (16–48px).
