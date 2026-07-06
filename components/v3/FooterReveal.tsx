"use client";

import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";

/**
 * v3 port of the curtain footer's client islands (v2 §3.2).
 * Scroll driver targets the zero-height [data-content-end] sentinel that
 * the layout renders as the LAST child of the content wrapper — never the
 * sticky footer itself (degenerate rect). Offsets ["start end","end start"]
 * per the v2 zero-height-target workaround; mappings clamp at 0.9.
 */
function useContentEndProgress() {
  const ref = useRef<HTMLElement | null>(null);
  const [, setReady] = useState(false);
  useEffect(() => {
    ref.current = document.querySelector<HTMLElement>("[data-content-end]");
    setReady(true);
  }, []);
  const { scrollYProgress } = useScroll({
    target: ref as RefObject<HTMLElement>,
    offset: ["start end", "end start"],
    layoutEffect: false,
  });
  return scrollYProgress;
}

type FooterRevealProps = { children: React.ReactNode; className?: string };

/** Inner-content settle: y -10% → 0, opacity 0.5 → 1, linear scrub. */
export default function FooterReveal({
  children,
  className,
}: FooterRevealProps) {
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
 * The cropped KUL wordmark — Geist bold in v3, paper at 8% opacity,
 * cropped at the baseline, rising y 26% → 14% on the footer progress.
 */
export function FooterWordmark() {
  const progress = useContentEndProgress();
  const reduced = useReducedMotion();
  const y = useTransform(progress, [0, 0.9], ["26%", "14%"]);

  const glyphClass =
    "block w-full select-none text-center font-bold leading-[0.72] tracking-[-0.04em] text-paper/[0.08] text-[140vw] min-[480px]:text-[52vw]";

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
