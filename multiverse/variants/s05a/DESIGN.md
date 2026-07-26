# s05a — Fog Monument (design system)

Scope: this variant only. Product truth lives in `/briefs/README.md`; the surface brief is
`/briefs/style-05-fog-monument.md`. This file records the durable visual rules the build settled.

## World

The most disciplined room in the multiverse. A carrier presented like a calibrated instrument:
vast fog, one monumental soft statement per viewport, one gold glow per viewport. Light pole of
the multiverse — never a dark section (dark exists only as the ink pill component).

## Tokens

| Token | Value | Rule |
|---|---|---|
| `--fog` | `#F4F2EC` | page ground; warm by default, coolable via tweaks |
| `--ink` | `#23241F` | all display text (14.3:1 on fog) |
| `--ink-soft` | `#56554B` | body + mono annotations (6.7:1 on fog) |
| `--gold` | `#D4AF37` | glow/halation and tiny marks ONLY — never running text |
| `--line` / `--line-strong` | ink at .14 / .30 | hairlines, dotted rules, ticks |
| `--plate` | `#FBFAF6` | instrument plates (registry card) |
| `--glow-o` | `.55` | master glow intensity; every glow derives via `calc()` |
| `--grid-op` | `.5` | master opacity for diamond grid + dotted rules |
| `--photo-blur` | `1.5px` | photo softness; photos also desaturate ~.85 |

## Type (Archivo variable + Fragment Mono)

- `.monument` — wght 200, stretch 106%, the fog voice; hero words wght 300/103%.
- `.statement` — wght 560, ls -.022em, the certainty voice (ref-3 register).
- `.mono` — Fragment Mono 11px, ls .09em, uppercase; carries every hard fact (USDOT/MC,
  phone, coordinates). Monospace is measurement here, never costume.
- Max two voices + mono micro per viewport.

## Laws

1. Exactly ONE gold glow per viewport (hero halation, orbit dot, services orb, journey
   halation, gold scale tick, CTA bloom). Adding a second means removing one.
2. ≥60% empty space per viewport. When torn, delete.
3. Annotations tier by `--ann-density` (1–3) via `.ann-2`/`.ann-3` opacity clamps.
4. Photos: only `/assets/journey/cliffs.jpg` + `tree.jpg` (desert.jpg in the shared pool is
   a mis-copied brand-kit collage — do not use). Soft focus + gold halation always.
5. Motion: one orchestrated hero focus-pull on load; slow 80s orbit; scroll-driven journey
   focus via `animation-timeline: view()` where supported; everything gated by
   `prefers-reduced-motion` and visible-by-default without JS.
6. Brand mark is the typographic lockup (KUL — hairline dash — mono ENTERPRISES LLC).
   No lion raster, never the Doctor Bird.
7. Truth law: registry numbers, contact, location, one-truck honesty, 50-by-2029 plan —
   nothing else is claimable. No testimonials, logos, or stats.
