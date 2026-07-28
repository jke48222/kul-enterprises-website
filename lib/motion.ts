import type { Variants } from "framer-motion";

/**
 * Shared motion language: slow, deliberate, cinematic.
 * Rules: transform and opacity ONLY; 0.6 to 1.0s durations; no bouncy springs;
 * every consumer must respect prefers-reduced-motion.
 */
export const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const durations = {
  fast: 0.25,
  base: 0.6,
  slow: 0.8,
} as const;

/** Section reveal on scroll-into-view. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.slow, ease },
  },
};

/** Staggered container for hero lines / grids / lists. */
export const stagger: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.base, ease },
  },
};

/** Viewport config: reveal once, slightly before fully in view. */
export const viewportOnce = { once: true, margin: "-10% 0px" } as const;
