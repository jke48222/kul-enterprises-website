"use client";

import { m, useReducedMotion } from "framer-motion";
import { fadeUp, stagger, staggerItem, viewportOnce } from "@/lib/motion";

/**
 * Scroll-into-view reveal primitives. Content is server rendered and readable
 * without JS; these only add the garnish. Reduced-motion users get content
 * immediately (no opacity-0 entrance gate). Transform/opacity only.
 */

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Extra delay in seconds, for hand-tuned sequencing. */
  delay?: number;
};

export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const reduce = useReducedMotion();
  return (
    <m.div
      className={className}
      variants={fadeUp}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={viewportOnce}
      transition={{ delay }}
    >
      {children}
    </m.div>
  );
}

/** Parent that staggers its <RevealItem> children. */
export function RevealGroup({ children, className }: RevealProps) {
  const reduce = useReducedMotion();
  return (
    <m.div
      className={className}
      variants={stagger}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={viewportOnce}
    >
      {children}
    </m.div>
  );
}

export function RevealItem({ children, className }: RevealProps) {
  return (
    <m.div className={className} variants={staggerItem}>
      {children}
    </m.div>
  );
}
