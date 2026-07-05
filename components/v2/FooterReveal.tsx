"use client";

import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";

/**
 * §3.2 — the curtain footer's client islands.
 *
 * The scroll driver targets the zero-height `[data-content-end]` sentinel
 * that the (site)/layout renders as the LAST child of the content wrapper —
 * NEVER the sticky footer itself (a sticky rect measures degenerate 0/1
 * progress). With a zero-height target, "start end"/"end end" resolve to the
 * same scroll position (division by zero), so the working equivalent
 * ["start end","end start"] is used: progress 0 when the content's end
 * enters the viewport bottom (footer starts to show), ~0.92 at page bottom
 * (the sentinel rests at 8svh above the 92svh footer). Mappings clamp at 0.9.
 */
function useContentEndProgress() {
  const ref = useRef<HTMLElement | null>(null);
  // Re-render once the sentinel is resolved so useScroll re-subscribes
  // (its internal effect depends on target.current).
  const [, setReady] = useState(false);
  useEffect(() => {
    ref.current = document.querySelector<HTMLElement>("[data-content-end]");
    setReady(true);
  }, []);
  const { scrollYProgress } = useScroll({
    target: ref as RefObject<HTMLElement>,
    offset: ["start end", "end start"],
  });
  return scrollYProgress;
}

type FooterRevealProps = { children: React.ReactNode; className?: string };

/** Inner-content settle: y -10% → 0, opacity 0.5 → 1, linear scrub. */
export default function FooterReveal({ children, className }: FooterRevealProps) {
  const progress = useContentEndProgress();
  const reduced = useReducedMotion();
  const y = useTransform(progress, [0, 0.9], ["-10%", "0%"]);
  const opacity = useTransform(progress, [0, 0.9], [0.5, 1]);

  if (reduced) return <div className={className}>{children}</div>;
  return (
    <m.div style={{ y, opacity }} className={className}>
      {children}
    </m.div>
  );
}

/**
 * The cropped KUL wordmark — paper at 8% opacity, cropped at the baseline,
 * rising y 26% → 14% on the same footer-reveal progress. `aria-hidden`
 * (Footer renders the sr-only "KUL Enterprises" beside it).
 * Size per the §3.2 QA rule: start at 52vw desktop / 140vw ≤480px and tune.
 */
export function FooterWordmark() {
  const progress = useContentEndProgress();
  const reduced = useReducedMotion();
  const y = useTransform(progress, [0, 0.9], ["26%", "14%"]);

  const glyphClass =
    "block w-full select-none text-center font-omnibus font-bold leading-[0.72] tracking-[-0.02em] text-paper/[0.08] text-[140vw] min-[480px]:text-[52vw]";

  return (
    <div aria-hidden className="overflow-hidden">
      {reduced ? (
        <span className={`${glyphClass} translate-y-[14%]`}>KUL</span>
      ) : (
        <m.span style={{ y }} className={glyphClass}>
          KUL
        </m.span>
      )}
    </div>
  );
}

/** Live Eastern-time clock for the legal row — 1-minute interval. */
export function LocalClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  return <span className="tabular-nums">{time ?? "--:--"}</span>;
}
