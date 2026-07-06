"use client";

/**
 * Roadway — the "Strength in Motion" signature (Mark's design email §3;
 * build plan §8.3). A gold roadway draws in and the KUL TruckMark travels
 * along it as the visitor scrolls NORMALLY through the section — scroll-
 * LINKED progress, never scroll-jacking (native scroll preserved; the
 * sticky frame only holds the scene). One stretch per site.
 *
 * Verified rules applied (17-v3-research §2B):
 *  - Framer useScroll/useTransform baseline (cross-browser), transform-only.
 *  - Decorative road/truck are aria-hidden; beat COPY is always fully
 *    readable — activation highlights (gold tick + numeral), never gates.
 *  - Reduced motion: static composition, road fully drawn, truck at rest.
 */

import { useEffect, useRef, useState } from "react";
import {
  m,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Eyebrow } from "@/components/v3/Eyebrow";
import { LineReveal } from "@/components/v3/LineReveal";
import { TruckMark } from "@/components/v3/icons";

export type Beat = { title: string; body: string };

export type RoadwayProps = {
  eyebrow?: string;
  titleLines: string[];
  beats: Beat[]; // 4 beats
};

const CONTAINER = "mx-auto w-full max-w-[1760px] px-[clamp(20px,5vw,90px)]";
const TRUCK_W = 64;

function BeatCell({
  beat,
  index,
  active,
  staticLayout = false,
}: {
  beat: Beat;
  index: number;
  active: boolean;
  staticLayout?: boolean;
}) {
  return (
    <div className="relative pt-5">
      {/* activation tick — highlight, never a content gate */}
      <span
        aria-hidden
        className={`absolute inset-x-0 top-0 h-px transition-colors duration-500 ${
          active || staticLayout ? "bg-gold/80" : "bg-white/[0.14]"
        }`}
      />
      <p
        aria-hidden
        className={`text-micro uppercase tabular-nums transition-colors duration-500 ${
          active || staticLayout ? "text-gold" : "text-paper/40"
        }`}
      >
        {String(index + 1).padStart(2, "0")}
      </p>
      <h3 className="mt-2 text-[17px] font-semibold text-paper">
        {beat.title}
      </h3>
      <p className="mt-2 max-w-[36ch] text-sm leading-relaxed text-paper/70">
        {beat.body}
      </p>
    </div>
  );
}

export function Roadway({
  eyebrow = "Strength in Motion",
  titleLines,
  beats,
}: RoadwayProps) {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const roadRef = useRef<HTMLDivElement>(null);
  const [roadW, setRoadW] = useState(0);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
    layoutEffect: false,
  });

  // Measure the road width (transform-only travel needs pixels).
  useEffect(() => {
    const el = roadRef.current;
    if (!el) return;
    const measure = () => setRoadW(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const lineScale = useTransform(scrollYProgress, [0.08, 0.85], [0, 1], {
    clamp: true,
  });
  const truckX = useTransform(
    scrollYProgress,
    [0.08, 0.85],
    [0, Math.max(0, roadW - TRUCK_W)],
    { clamp: true },
  );

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const span = (0.85 - 0.08) / beats.length;
    const idx = Math.min(
      beats.length - 1,
      Math.max(0, Math.floor((p - 0.08) / span)),
    );
    setActive(idx);
  });

  // Reduced motion: the scene at rest — full road, truck arrived, all
  // beats lit. No sticky, no scrub.
  if (reduced) {
    return (
      <section data-ground="ink" className="bg-ink py-band">
        <div className={CONTAINER}>
          <Eyebrow>{eyebrow}</Eyebrow>
          <LineReveal as="h2" lines={titleLines} className="mt-6 max-w-[18ch] text-d2 text-paper" />
          <div aria-hidden className="relative mt-14">
            <div className="h-[2px] w-full bg-gold/80" />
            <TruckMark className="absolute -top-8 right-0 h-7 w-16 text-gold" />
          </div>
          <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {beats.map((b, i) => (
              <BeatCell key={b.title} beat={b} index={i} active staticLayout />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} data-ground="ink" className="relative h-[340vh] bg-ink">
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        <div className={CONTAINER}>
          <Eyebrow>{eyebrow}</Eyebrow>
          <LineReveal
            as="h2"
            lines={titleLines}
            className="mt-6 max-w-[18ch] text-d2 text-paper"
          />

          {/* The roadway — decorative; gold budget: the road system is the
              section's gold (eyebrow stays non-gold). */}
          <div ref={roadRef} aria-hidden className="relative mt-16">
            {/* resting bed */}
            <div className="h-[2px] w-full bg-white/[0.12]" />
            {/* gold draw-in */}
            <m.div
              className="absolute inset-x-0 top-0 h-[2px] origin-left bg-gold/80 will-change-transform"
              style={{ scaleX: lineScale }}
            />
            {/* mile ticks */}
            {[0.125, 0.375, 0.625, 0.875].map((t) => (
              <span
                key={t}
                className="absolute top-[-4px] h-[10px] w-px bg-white/[0.18]"
                style={{ left: `${t * 100}%` }}
              />
            ))}
            {/* the traveler */}
            <m.div
              className="absolute -top-8 left-0 will-change-transform"
              style={{ x: truckX }}
            >
              <TruckMark className="h-7 w-16 text-gold" />
            </m.div>
          </div>

          {/* Beats — copy always readable; activation is a highlight. */}
          <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4 lg:gap-x-8">
            {beats.map((b, i) => (
              <BeatCell key={b.title} beat={b} index={i} active={i === active} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Roadway;
