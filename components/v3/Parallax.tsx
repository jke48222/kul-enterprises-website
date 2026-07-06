"use client";

/**
 * Parallax — v3 port (v2 §3.8). Full-bleed photo drift: oversized child
 * layer (h-[120%], -top-[10%]) drifting y −range% → +range%, linear scrub.
 * Full-bleed bands only. Disabled entirely under reduced motion (verified
 * vestibular risk — 17-v3-research §2D).
 *
 * Gotcha carried forward: callers passing `absolute inset-0` must NOT also
 * get `relative` (zero-height collapse of fill images).
 */

import { useRef } from "react";
import type { ReactNode } from "react";
import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";

export type ParallaxProps = {
  children: ReactNode;
  /** % drift, default 8 (±6–8%). */
  range?: number;
  className?: string;
};

function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

export function Parallax({ children, range = 8, className }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
    layoutEffect: false,
  });
  const y = useTransform(scrollYProgress, [0, 1], [`${-range}%`, `${range}%`]);

  const positioned = /\babsolute\b|\bfixed\b/.test(className ?? "");
  return (
    <div
      ref={ref}
      className={cx(!positioned && "relative", "overflow-hidden", className)}
    >
      <m.div
        className="absolute inset-0 -top-[10%] h-[120%] will-change-transform"
        style={reduced ? undefined : { y }}
      >
        {children}
      </m.div>
    </div>
  );
}

export default Parallax;
