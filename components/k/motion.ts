/**
 * v2 motion tokens (design bible §2.3). The single motion import.
 * Every framer-motion transition on the site pulls its values from here.
 *
 * Interaction law: slow enter, fast leave. Hover-in 0.45s EASE.micro,
 * hover-out 0.2s. Nothing animates longer than 0.8s except the page veil
 * (1.05s total), the ClipReveal settle (1.4s) and scroll-scrubbed moves
 * (which have no duration). Every reveal fires once (VIEWPORT), never
 * replays. Max two scroll-scrubbed sequences per page.
 */
export const EASE = {
  out: [0.165, 0.84, 0.44, 1], // "ease-out", power3.out. All entrances, reveals, RISE.
  inout: [0.77, 0, 0.175, 1], // "ease-inout", for curtains, veils and clip wipes.
  kul: [0.4, 0, 0, 1], // "ease-kul", the house curve. Signature moments only (chapters, footer wordmark).
  micro: [0.215, 0.61, 0.355, 1], // "ease-micro", for hovers, buttons and accordions.
} as const;

export const DUR = {
  fast: 0.25,
  base: 0.4,
  slow: 0.6,
  slower: 0.8,
  curtain: 1.2,
} as const;

export const STAGGER = { lines: 0.1, items: 0.07 } as const;

/* VIEWPORT was exported from here and is gone as of 29 Jul 2026. It was the
   shared `whileInView` config, and nothing imports it any more: entrances moved
   to CSS in components/k/Reveal.tsx after a stalled `whileInView` left fifteen
   elements of the About page permanently invisible. Leaving the constant here
   would be an invitation to build the same failure again. */
