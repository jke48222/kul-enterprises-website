"use client";

/**
 * ClipReveal — v3 port (v2 §3.7). Framed-photo wipe: parent clip-path opens
 * over 1.1s EASE.out while the child settles scale 1.18 → 1 over 1.4s.
 * Fires once. "up" for portrait/square, "left" for wide landscape.
 * Reduced motion: opacity fade only.
 */

import type { ReactNode } from "react";
import { m, useReducedMotion } from "framer-motion";
import { EASE, VIEWPORT } from "@/components/v3/motion";

export type ClipRevealProps = {
  children: ReactNode;
  direction?: "up" | "left";
  delay?: number;
  className?: string;
};

function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

export function ClipReveal({
  children,
  direction = "up",
  delay = 0,
  className,
}: ClipRevealProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <m.div
        className={cx("relative overflow-hidden", className)}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.3, delay }}
      >
        {children}
      </m.div>
    );
  }

  const from =
    direction === "left" ? "inset(0 0 0 100%)" : "inset(100% 0 0 0)";

  return (
    <m.div
      className={cx("relative overflow-hidden", className)}
      initial={{ clipPath: from }}
      whileInView={{ clipPath: "inset(0 0 0 0)" }}
      viewport={VIEWPORT}
      transition={{ duration: 1.1, ease: [...EASE.out], delay }}
    >
      <m.div
        className="relative h-full w-full will-change-transform"
        initial={{ scale: 1.18 }}
        whileInView={{ scale: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: 1.4, ease: [...EASE.out], delay }}
      >
        {children}
      </m.div>
    </m.div>
  );
}

export default ClipReveal;
