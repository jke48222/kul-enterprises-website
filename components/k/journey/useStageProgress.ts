"use client";

import { useEffect, useRef } from "react";

/**
 * HOW A PINNED SCENE KNOWS HOW FAR THROUGH ITSELF IT IS.
 *
 * Four scenes on the Journey hold the viewport still and play out as you keep
 * scrolling. This is the one piece of machinery all four share: it turns scroll
 * position into a number from 0 to 1 and hands it to the scene, sixty times a
 * second, on the animation frame.
 *
 * ============================================================================
 * THE RULE THIS THING OBEYS, WHICH IS THE WHOLE REASON IT LOOKS LIKE THIS
 * ============================================================================
 * THE DRIVER MAY ONLY EVER WRITE VALUES. It must never be the reason something
 * is visible.
 *
 * Every scene sets its finished, readable state in the stylesheet as the
 * default, and the driver only writes a custom property that moves it away from
 * that. So:
 *
 *     .k-s01-iris { transform: scale(var(--s01-iris, 3.4)); }
 *
 * 3.4 is the OPEN state. If this hook never runs, if the bundle fails, if the
 * script throws during hydration, if the reader has an old browser, the scene
 * is simply already finished and completely legible. Nothing is ever hidden by
 * default and then rescued by JavaScript.
 *
 * The same idea in the other direction is what `arm` does. Elements that are
 * meant to arrive one at a time are written at full opacity in the stylesheet,
 * and the hidden state is scoped to a class this hook adds on its first frame:
 *
 *     .k-s02-say            { opacity: 1 }
 *     .is-armed .k-s02-say  { opacity: .3 }
 *
 * So the page has to be alive and running before anything is allowed to be
 * faint. This is the same argument, and the same hard-won lesson, as the header
 * of components/k/Reveal.tsx: fifteen elements on the About page went invisible
 * at once because an animation was the only thing making them visible.
 *
 * ANYONE WHO ASKED FOR REDUCED MOTION IS NEVER ARMED AND NEVER DRIVEN. They get
 * the finished state of every scene, standing still, which is a complete
 * reading of the page rather than a degraded one.
 */

export type StageDriver = (progress: number, stage: HTMLElement) => void;

export function useStageProgress(driver: StageDriver) {
  /**
   * THE ELEMENT THAT ACTUALLY HOLDS THE STICKY STAGE, which is not always the
   * whole section.
   *
   * Progress runs 0 to 1 across (this element's height - one screen), because
   * that is exactly how long a `position: sticky` child is held for. Put this
   * on the wrong element and the scrub is stretched over the wrong distance:
   * scene 2 has a 170vh sticky block inside a 300vh section, and measuring
   * against the section would have run the animation for nearly three times
   * the distance the stage is actually on screen for.
   *
   * It also carries `is-armed`, so it must be an ancestor of everything the
   * scene wants to arrive.
   */
  const trackRef = useRef<HTMLElement | null>(null);
  /** The one screen held inside it. This is what gets the custom properties. */
  const stageRef = useRef<HTMLDivElement | null>(null);
  /** Kept in a ref so changing the callback never tears the listener down. */
  const driverRef = useRef(driver);
  driverRef.current = driver;

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage) return;

    // Nobody who asked for less movement is armed or driven. The stylesheet
    // defaults are the finished scene, so they already have everything.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // THE SCENE IS ONLY ALLOWED TO HIDE ANYTHING ONCE WE ARE CERTAIN WE ARE
    // RUNNING. Anything faint is scoped to this class, so it cannot apply
    // before this line executes.
    track.classList.add("is-armed");

    let frame = 0;
    let queued = false;

    const read = () => {
      queued = false;
      const rect = track.getBoundingClientRect();
      // The sticky child is held for (track height - one screen) of scrolling,
      // so that distance is what maps to 0..1.
      const travel = rect.height - window.innerHeight;
      const p = travel <= 0 ? 0 : Math.min(1, Math.max(0, -rect.top / travel));
      driverRef.current(p, stage);
    };

    const onScroll = () => {
      // One read and one write per frame, however many scroll events arrive.
      // Reading getBoundingClientRect inside the scroll event itself is what
      // makes a scroll handler expensive; doing it on the frame does not.
      if (queued) return;
      queued = true;
      frame = requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      track.classList.remove("is-armed");
    };
  }, []);

  return { trackRef, stageRef };
}

/** Maps p onto 0..1 across [a,b], flat outside it. The one easing helper. */
export function span(p: number, a: number, b: number): number {
  if (b <= a) return p >= b ? 1 : 0;
  return Math.min(1, Math.max(0, (p - a) / (b - a)));
}

/** Linear interpolation, so a scene reads as numbers rather than arithmetic. */
export function lerp(from: number, to: number, t: number): number {
  return from + (to - from) * t;
}
