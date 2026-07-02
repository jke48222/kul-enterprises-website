"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  m,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

/**
 * THE signature scroll moment (07-design-research.md §2C: exactly one or two,
 * used sparingly). The section pins for ~1.2 extra viewports while the fleet
 * number counts 0 → 50 with scroll and the supporting copy resolves.
 * Transform/opacity only; scroll-driven values run off the main React render.
 * Reduced motion: a static, fully readable section. No pin, no count.
 */
export default function Vision() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const count = useTransform(scrollYProgress, [0.12, 0.6], [0, 50]);
  const rounded = useTransform(count, (v) => Math.round(v));
  const ruleScale = useTransform(scrollYProgress, [0.12, 0.6], [0, 1]);
  const copyOpacity = useTransform(scrollYProgress, [0.25, 0.55], [0, 1]);
  const copyY = useTransform(scrollYProgress, [0.25, 0.55], [28, 0]);

  if (reduce) {
    return (
      <section className="bg-ink">
        <div className="mx-auto max-w-content px-6 py-28 text-center">
          <p className="eyebrow text-gold">Our Vision</p>
          <p className="mt-8 font-display text-[clamp(5rem,18vw,13rem)] font-bold leading-none text-white">
            50
          </p>
          <p className="mt-2 eyebrow text-graywarm">
            tractors by the end of 2029
          </p>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-graywarm-light">
            To build one of the Southeast&apos;s most trusted transportation
            companies: 50 tractors by the end of 2029, with the same commitment
            to safety, integrity, and dependable service we run today.
          </p>
          <Link href="/concept/about" className="btn-ghost-dark mt-10">
            Read our story
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative h-[220vh] bg-ink">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="mx-auto w-full max-w-content px-6 text-center">
          <p className="eyebrow text-gold">Our Vision</p>

          <p
            aria-label="50 tractors by the end of 2029"
            className="mt-8 font-display text-[clamp(5rem,18vw,13rem)] font-bold leading-none text-white"
          >
            <m.span aria-hidden>{rounded}</m.span>
          </p>

          <m.span
            aria-hidden
            style={{ scaleX: ruleScale }}
            className="mx-auto mt-6 block h-px w-40 origin-left bg-gold"
          />
          <p className="mt-4 eyebrow text-graywarm">
            tractors by the end of 2029
          </p>

          <m.div style={{ opacity: copyOpacity, y: copyY }}>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-graywarm-light">
              To build one of the Southeast&apos;s most trusted transportation
              companies: 50 tractors by the end of 2029, with the same commitment
              to safety, integrity, and dependable service we run today.
            </p>
            <Link href="/concept/about" className="btn-ghost-dark mt-10">
              Read our story
            </Link>
          </m.div>
        </div>
      </div>
    </section>
  );
}
