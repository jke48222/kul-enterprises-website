/**
 * v3 motion tokens — the single motion import for components/v3.
 * Same proven language as v2 (design bible §2.3): slow enter, fast leave;
 * nothing over 0.8s except the veil and clip settles; reveals fire once;
 * max two scroll-scrubbed sequences per page. The Apple/Volvo register
 * changes the *type and grounds*, not the physics.
 */
export const EASE = {
  out: [0.165, 0.84, 0.44, 1], // entrances, reveals, RISE
  inout: [0.77, 0, 0.175, 1], // curtains, veils, clip wipes
  kul: [0.4, 0, 0, 1], // house curve — signature moments only
  micro: [0.215, 0.61, 0.355, 1], // hovers, buttons, accordions
} as const;

export const DUR = {
  fast: 0.25,
  base: 0.4,
  slow: 0.6,
  slower: 0.8,
  curtain: 1.2,
} as const;

export const STAGGER = { lines: 0.1, items: 0.07 } as const;

/** Default whileInView viewport: fire once, 15% early margin. */
export const VIEWPORT = { once: true, margin: "-15% 0px" } as const;
