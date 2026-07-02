"use client";

import { useLayoutEffect, useRef, useState } from "react";
import {
  m,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import type { MotionValue } from "framer-motion";
import { journeyBeats } from "@/lib/site";

/**
 * The signature scroll story. The section pins for three extra viewports
 * while a rig tracks along a gold route line and the four beats of a load
 * resolve one by one: quote, dispatch, in transit, delivered.
 * Scroll-linked values animate transform and opacity only.
 * Reduced motion gets the four beats as a readable static grid.
 */

/** Compact line-art rig, side profile, pointing right. */
function RigGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 150 52"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* trailer */}
      <rect x="2" y="6" width="86" height="28" />
      {/* tractor: cab, hood, windshield */}
      <path d="M96 34 L96 12 Q96 8 101 8 L112 8 L117 15 L124 17 L136 19 Q139 19 139 23 L139 34" />
      <path d="M112 8 L112 19 L124 17" />
      {/* frame line + hitch */}
      <path d="M88 30 L96 30" />
      {/* wheels */}
      <circle cx="18" cy="40" r="6" />
      <circle cx="34" cy="40" r="6" />
      <circle cx="104" cy="40" r="6" />
      <circle cx="128" cy="40" r="6" />
      {/* headlight */}
      <path d="M139 26 L146 26" className="text-gold" stroke="currentColor" />
    </svg>
  );
}

function Beat({
  progress,
  index,
  count,
}: {
  progress: MotionValue<number>;
  index: number;
  count: number;
}) {
  const beat = journeyBeats[index];
  const start = index / count;
  const end = (index + 1) / count;
  const fadePad = 0.045;
  const opacity = useTransform(
    progress,
    index === 0
      ? [0, 0.02, end - fadePad, end]
      : index === count - 1
        ? [start, start + fadePad, 0.985, 1]
        : [start, start + fadePad, end - fadePad, end],
    index === 0 ? [1, 1, 1, 0] : index === count - 1 ? [0, 1, 1, 1] : [0, 1, 1, 0]
  );
  const y = useTransform(
    progress,
    [start, start + fadePad, end - fadePad, end],
    index === 0 ? [0, 0, 0, -22] : [22, 0, 0, -22]
  );

  return (
    /* Static wrapper handles centering; the motion div only animates.
       Framer's inline transform would override a class translate. */
    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
      <m.div style={{ opacity, y }} className="px-6 text-center">
        <p
          aria-hidden
          className="pointer-events-none font-display text-[clamp(6rem,20vw,15rem)] font-bold leading-none text-white/[0.045]"
        >
          {beat.step}
        </p>
        <div className="-mt-[clamp(3rem,10vw,7.5rem)]">
          <p className="eyebrow text-gold">
            {beat.step} · {beat.label}
          </p>
          <h3 className="mx-auto mt-4 max-w-2xl font-display text-display-l font-bold text-white">
            {beat.title}
          </h3>
          <p className="mx-auto mt-4 max-w-md text-graywarm-light">
            {beat.body}
          </p>
        </div>
      </m.div>
    </div>
  );
}

export default function JourneyScroll() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackW, setTrackW] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useLayoutEffect(() => {
    const measure = () =>
      setTrackW(trackRef.current ? trackRef.current.offsetWidth : 0);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const rigW = 120;
  const rigX = useTransform(
    scrollYProgress,
    [0.02, 0.98],
    [0, Math.max(0, trackW - rigW)]
  );
  const lineScale = useTransform(scrollYProgress, [0.02, 0.98], [0, 1]);

  /* Stop dots light up as the rig passes them. Hooks stay top-level. */
  const stopCount = journeyBeats.length;
  const stop0 = useTransform(scrollYProgress, [0.0, 0.05], [0, 1]);
  const stop1 = useTransform(scrollYProgress, [0.3, 0.36], [0, 1]);
  const stop2 = useTransform(scrollYProgress, [0.62, 0.68], [0, 1]);
  const stop3 = useTransform(scrollYProgress, [0.93, 0.985], [0, 1]);
  const stopGlow = [stop0, stop1, stop2, stop3];

  if (reduce) {
    return (
      <section className="bg-ink">
        <div className="mx-auto max-w-content px-6 py-24 md:py-28">
          <div className="flex items-center gap-4">
            <span className="gold-rule" />
            <span className="eyebrow text-gold">How your freight moves</span>
          </div>
          <h2 className="mt-5 max-w-2xl font-display text-display-l font-bold text-white">
            Four steps. Zero guesswork.
          </h2>
          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {journeyBeats.map((b) => (
              <div key={b.step}>
                <p className="eyebrow text-gold">
                  {b.step} · {b.label}
                </p>
                <h3 className="mt-3 font-display text-xl font-bold text-white">
                  {b.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-graywarm-light">
                  {b.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative h-[340vh] bg-ink">
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        {/* Faint night-highway texture behind the whole pinned stage */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.16] [background:url('/images/stock/road-night-light-trails.jpg')_center_60%/cover_no-repeat]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_45%,transparent_30%,rgba(11,11,11,0.9)_100%)]"
        />

        {/* Section header */}
        <div className="relative mx-auto w-full max-w-content px-6 pt-28 md:pt-32">
          <div className="flex items-center gap-4">
            <span className="gold-rule" />
            <span className="eyebrow text-gold">How your freight moves</span>
          </div>
        </div>

        {/* Beats stage */}
        <div className="relative mx-auto w-full max-w-content flex-1">
          {journeyBeats.map((_, i) => (
            <Beat
              key={i}
              progress={scrollYProgress}
              index={i}
              count={journeyBeats.length}
            />
          ))}
        </div>

        {/* Route: track, progress line, stops, rig */}
        <div className="relative mx-auto w-full max-w-3xl px-6 pb-24">
          <div ref={trackRef} className="relative">
            <m.div style={{ x: rigX }} className="mb-1 w-[120px] text-white/80">
              <RigGlyph className="h-auto w-full" />
            </m.div>
            <div className="relative h-px w-full bg-white/15">
              <m.div
                style={{ scaleX: lineScale }}
                className="absolute inset-0 origin-left bg-gold"
              />
            </div>
            <div className="relative mt-0 flex justify-between">
              {journeyBeats.map((b, i) => (
                <div key={b.step} className="relative -mt-[5px]">
                  <span className="block h-[9px] w-[9px] rotate-45 border border-white/30 bg-ink" />
                  <m.span
                    style={{ opacity: stopGlow[i] ?? stopGlow[stopCount - 1] }}
                    className="absolute inset-0 block h-[9px] w-[9px] rotate-45 bg-gold"
                  />
                  <span className="absolute left-1/2 top-5 hidden -translate-x-1/2 text-[10px] uppercase tracking-eyebrow text-graywarm sm:block">
                    {b.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
