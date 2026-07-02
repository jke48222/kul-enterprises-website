"use client";

import { m, useReducedMotion } from "framer-motion";
import { viewportOnce } from "@/lib/motion";

/**
 * Slow opacity-only fade on scroll into view, matching the hero title's
 * kul-fade-slow timing (2.4s ease, 0.2s delay). No slide. Reduced-motion
 * users get the content immediately.
 */
export default function FadeIn({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <m.div
      className={className}
      initial={reduce ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={viewportOnce}
      transition={{ duration: 2.4, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </m.div>
  );
}
