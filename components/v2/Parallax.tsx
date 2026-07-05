"use client";

/**
 * Parallax — §3.8. Full-bleed photo drift: the child layer is oversized
 * (h-[120%], -top-[10%]) and drifts y: -range% → +range% mapped LINEARLY
 * to scroll progress (no spring). Full-bleed bands only — never framed
 * images. Disabled entirely under reduced motion (static layer).
 */

import { useRef } from "react";
import type { ReactNode } from "react";
import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";

export type ParallaxProps = {
  children: ReactNode;
  /** % drift, default 8 (§3.8: ±6–8%). */
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
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`${-range}%`, `${range}%`],
  );

  // Callers that pass `absolute inset-0` must not also receive `relative`:
  // Tailwind's .relative outranks .absolute in the stylesheet, and a
  // relative wrapper here has zero content height (its only child is
  // absolutely positioned), which collapses fill images to 0px.
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
