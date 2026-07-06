"use client";

/**
 * LineReveal — v3 port (v2 §3.6). The signature type entrance: each
 * hand-authored line in a clip mask (−0.2em descender guard) sliding up
 * from y:110%, 0.8s EASE.out, 0.1s line stagger. `immediate` for heroes
 * (whileInView is unreliable above the fold — v2 gotcha). Reduced motion:
 * single 0.3s opacity fade.
 */

import type { ReactNode } from "react";
import { m, useReducedMotion } from "framer-motion";
import { DUR, EASE, STAGGER, VIEWPORT } from "@/components/v3/motion";

export type LineRevealProps = {
  as?: "h1" | "h2" | "h3" | "p";
  lines: ReactNode[];
  delay?: number;
  className?: string;
  immediate?: boolean;
};

export function LineReveal({
  as = "h2",
  lines,
  delay = 0.2,
  className,
  immediate = false,
}: LineRevealProps) {
  const reduced = useReducedMotion();
  const Tag = as;
  const MTag = m[as] as typeof m.p;

  if (reduced) {
    return (
      <MTag
        className={className}
        initial={{ opacity: 0 }}
        {...(immediate
          ? { animate: { opacity: 1 } }
          : { whileInView: { opacity: 1 }, viewport: VIEWPORT })}
        transition={{ duration: 0.3, delay }}
      >
        {lines.map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))}
      </MTag>
    );
  }

  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <span
          key={i}
          className="block"
          style={{ clipPath: "inset(0 0 -0.2em 0)" }}
        >
          <m.span
            className="block will-change-transform"
            initial={{ y: "110%" }}
            {...(immediate
              ? { animate: { y: "0%" } }
              : { whileInView: { y: "0%" }, viewport: VIEWPORT })}
            transition={{
              duration: DUR.slower,
              ease: [...EASE.out],
              delay: delay + i * STAGGER.lines,
            }}
          >
            {line}
          </m.span>
        </span>
      ))}
    </Tag>
  );
}

export default LineReveal;
