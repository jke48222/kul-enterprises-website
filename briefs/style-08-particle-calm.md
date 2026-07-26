# Style 08 — Particle Calm

Aesthetic: particle calm — one living generative emblem (gold particle field that breathes
and resolves), calm steel-light ground, serif-accented wordmark, pill CTAs, quiet SaaS
clarity everywhere else

Reference: assets-inbox/inspiration/kinetic-motion-2-dribbble.mp4 — match feel, not content.
(The ref's pixel-morph cloud becomes a gold particle emblem.)

Intent: One signature living visual carries the brand while everything else stays almost
boring-calm. This is Mark's gold-particle idea grown into the site's centerpiece rather than
a 3-second intro — a particle field that drifts and periodically resolves toward the lion
silhouette. Trust = a company with one clear idea, executed perfectly.

Guardrails: Always exactly one generative element (the hero emblem) with everything else flat
and calm, particles in gold on steel-white, 60fps, static-image fallback for reduced-motion
and slow devices, content paint never blocked by the canvas. Never particles sprinkled across
other sections, never glitch-for-glitch's-sake, never bird shapes (lion or abstract only —
the bird is reserved for the future intro).

## Build notes

- Emblem is the R&D bed for Mark's opening sequence (particles→lion): whatever resolver gets
  built here seeds the eventual bird→particles→lion intro animation.
- Canvas budget <150KB JS; devicePixelRatio-aware; pauses off-viewport.
- Rest of page: quiet nav, pill CTAs, generous line-height, three-column services.

## Tweaks to expose

particle density/size · morph target (abstract ⇄ lion silhouette) · resolve speed · drift
energy · ground tint (steel vs warm) · emblem scale
