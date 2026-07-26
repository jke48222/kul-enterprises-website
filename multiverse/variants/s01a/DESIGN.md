# s01a — Cinematic Noir · design system

Scope: this variant directory only. Skill: impeccable. Brief: /briefs/style-01-cinematic-noir.md.

## World

A night-drive private showroom for a freight carrier. Trust rendered as composure: warm
charcoal rooms lit by tungsten pools, one champagne-gold element per view, a bone-daylight
editorial interlude mid-page, glass used only where the brief pins it (nav frost, service
cards, quote form). The only numbers on the page are public record (USDOT/MC) — the safety
monument sets them in gold display type. Footer sinks under a ghost KUL wordmark.

## Tokens (source of truth = `:root` in index.html)

- Grounds (warm, never dead black): `#0B0906 → #2A241E` ramp; light interlude
  `color-mix(#F2ECE0 var(--ground-mix), #14110E)`.
- Gold `--gold: #D4AF37`; ambient dosage `--gold-wash` (percent into transparent mixes);
  scene light `--light: color-mix(#FFB25C var(--warmth), gold)`.
- Glass: `--glass-blur` drives the nav/menu backdrop-filter and the services-backdrop
  softness. The services backdrop is a 96px canvas repaint of river.jpg upscaled by CSS
  (a full-size CSS-blurred img breaks compositing and burns GPU across 20 gallery iframes).
  The quote panel is translucent fill + shadow, no backdrop-filter — nothing detailed sits
  behind it, so blur bought nothing.
- Type: Archivo variable (wdth 62–125) everywhere; display voice = `--font-display`
  (Archivo | Bricolage Grotesque | Big Shoulders) at `font-stretch` ~118%, weight 680–760.
  Tracked caps labels: 10.5–12px, ls .18–.26em. Body 16px/1.66, measure ≤ 66ch.
- Hero grade: `--hero-grade: dusk|night` mirrored to `data-hero-grade` by a tiny observer;
  drives image filter + veil opacities via `--hero-dark`.

## Laws

1. One gold accent element per viewport (hero CTA · services progress · USDOT numerals ·
   vision tick · submit button). Gold never sits as body text on the light ground.
2. Light has temperature: every dark section carries a warm radial pool; no neutral grays —
   secondary text is tinted bone (`#C9BFAD` on dark, `#6E6152` on light).
3. Motion: one authored moment (hero light ignition + line reveal). Everything else is
   scroll-LINKED (cluster drift, carousel hairline, ghost rise) — never jacked; all of it
   gated behind `prefers-reduced-motion` and a `.js` class (no-JS = fully visible page).
4. Truth: no testimonials, logos, fleet counts, or invented stats. The 1→50 line is framed
   as a stated plan. Form is a visual stub and says so.
5. Photography is Mark's own, graded warm; never bird imagery; lion exists only as words.

## Asset truth (pool mix-up, noted 2026-07-24)

Served pool files vs actual pixels: `river.jpg` = desert rock formation (hero),
`wave.jpg` = forest river, `desert.jpg` = **brand board collage — never place on page**,
`cliffs.jpg` + `tree.jpg` correct. Cluster uses cliffs/tree/wave; hero + services backdrop
use river.jpg (same night, defocused deeper in).
