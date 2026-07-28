"use client";

import { m, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Stagger position within a group. Each step adds 60ms. */
  index?: number;
  className?: string;
};

/**
 * Section entrance. Opacity plus a small y offset, played once on
 * intersection, never scrubbed to scroll position.
 *
 * The offset lives in framer's `y`, never a Tailwind -translate-* class:
 * framer writes a complete `transform` string and would silently override it.
 */
export default function Reveal({ children, index = 0, className }: RevealProps) {
  const reduced = useReducedMotion();

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.8,
        delay: index * 0.06,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </m.div>
  );
}
