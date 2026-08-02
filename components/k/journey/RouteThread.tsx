"use client";

import { useEffect, useRef } from "react";
import { useReducedMotionLive } from "@/components/k/useReducedMotionLive";

/**
 * THE THREAD: ONE CONTINUOUS LINE DOWN THE WHOLE JOURNEY.
 *
 * The client's note on the first cut was that the page read as scenes, not as
 * one film: seventeen compositions with hard seams between them. The ground
 * ramp already binds them tonally; this binds them PHYSICALLY. A single
 * route line runs down the left gutter of the entire page, from the first
 * frame of scene 1 to the last line of scene 17, and fills as you travel.
 * It is the journey drawn as a road: you can see how far you have come and
 * that the line does not break anywhere between Jamaica and the sign-off.
 *
 * TWO LAYERS, ONE GEOMETRY. The faint layer is the whole road, always
 * present, so the page never hides where it is going. The bright layer is
 * the travelled part, revealed by clip-path from the top as the reader
 * scrolls. Clip-path rather than scaleY because the line changes colour down
 * its length, and scaling would drag the colours with it.
 *
 * THE COLOUR CROSSES WITH THE SUNRISE, and this is measured, not styled.
 * Headlight gold (#D6A145) carries the dark half; from the sunrise's end the
 * line is ink (#12141A), because the spine's own arithmetic forbids gold on
 * the mid-grey scenes (it cannot clear even 3:1 there) and the darker gold
 * only earns mark duty from scene 14 on. So the gold beam of the night
 * becomes a drawn ink route by day, which is also the honest reading: at
 * night the road is what your lights show you; by day it is a line on a map
 * you have already driven. The crossover stops are measured from the real
 * position of scene 10 (the sunrise) after layout and written as CSS
 * variables; the stylesheet default assumes the crossing at 56 to 62
 * percent, which is where the spine's budgets put it.
 *
 * THE VISIBILITY CONTRACT HOLDS. The stylesheet default for the travelled
 * layer is FULLY DRAWN (--k-thread-clip: 0%): no script, failed script, or
 * reduced motion shows the complete route, which is a true and legible
 * resting state. The driver may only ever write values.
 *
 * It is decoration and says so (aria-hidden): every fact it draws is carried
 * by the scenes themselves.
 */
export default function RouteThread() {
  const faintRef = useRef<HTMLDivElement | null>(null);
  const brightRef = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotionLive();

  useEffect(() => {
    if (reduced) return;
    const bright = brightRef.current;
    const faint = faintRef.current;
    if (!bright || !faint) return;

    // Measure where the sunrise actually sits so the colour crossing lands
    // inside scene 10 whatever the viewport has done to the scene heights.
    const measure = () => {
      const road = document.getElementById("the-road");
      const total = document.documentElement.scrollHeight;
      if (!road || !total) return;
      const top = ((road.offsetTop + road.offsetHeight * 0.35) / total) * 100;
      const end = ((road.offsetTop + road.offsetHeight * 0.9) / total) * 100;
      for (const el of [bright, faint]) {
        el.style.setProperty("--k-thread-cross-a", `${top.toFixed(2)}%`);
        el.style.setProperty("--k-thread-cross-b", `${end.toFixed(2)}%`);
      }
    };

    let frame = 0;
    let queued = false;
    const read = () => {
      queued = false;
      const doc = document.documentElement;
      const travelled =
        doc.scrollHeight <= window.innerHeight
          ? 1
          : (window.scrollY + window.innerHeight) / doc.scrollHeight;
      // The unfilled remainder, from the bottom. Written as the single value
      // the stylesheet consumes; 0% means fully drawn, which is the default.
      bright.style.setProperty(
        "--k-thread-clip",
        `${((1 - Math.min(1, Math.max(0, travelled))) * 100).toFixed(2)}%`,
      );
    };
    const onScroll = () => {
      if (queued) return;
      queued = true;
      frame = requestAnimationFrame(read);
    };

    measure();
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [reduced]);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-2.5 z-[5] w-px md:left-5">
      {/* The whole road, faint, always there. */}
      <div ref={faintRef} className="k-thread k-thread-faint absolute inset-0" />
      {/* The travelled road, revealed from the top as you drive it. */}
      <div ref={brightRef} className="k-thread k-thread-bright absolute inset-0" />
    </div>
  );
}
