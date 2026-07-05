"use client";

/**
 * LineReveal — §3.6. THE RISE: the site's signature type entrance.
 * Each hand-authored line sits inside a clip mask `inset(0 0 -0.2em 0)`
 * (the -0.2em protects Omnibus descenders) and slides up from y:110%,
 * 0.8s EASE.out, 0.1s stagger per line. Fires once via VIEWPORT, or on
 * mount when `immediate` (heroes — pair `delay` with useVeilState().heroDelay).
 * Reduced motion: a single 0.3s opacity fade, no transform.
 */

import type { ReactNode } from "react";
import { m, useReducedMotion } from "framer-motion";
import { DUR, EASE, STAGGER, VIEWPORT } from "@/components/v2/motion";

export type LineRevealProps = {
  as?: "h1" | "h2" | "h3" | "p";
  /** Hand-authored line breaks; each entry = one masked line. */
  lines: ReactNode[];
  /** Base delay, default 0.2. Heroes add useVeilState().heroDelay. */
  delay?: number;
  /** Type-scale classes applied to the element. */
  className?: string;
  /** Animate on mount (`animate`) instead of whileInView — heroes only. */
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
