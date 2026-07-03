"use client";

import { useEffect } from "react";
import { LazyMotion, domAnimation } from "framer-motion";

/**
 * LazyMotion + the `m` component keep Framer Motion's initial footprint at
 * ~4.6kb instead of the 34kb+ full `motion` import (07-design-research.md §2C,
 * confirmed via motion.dev). `strict` throws if anyone imports `motion`
 * directly, so the budget can't silently regress.
 */
export default function MotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Disarms the pure-CSS reveal failsafe (globals.css): once hydration is
  // real, Framer Motion owns the reveal animations again.
  useEffect(() => {
    document.documentElement.setAttribute("data-hydrated", "1");
  }, []);

  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
