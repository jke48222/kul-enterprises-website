"use client";

import { useEffect } from "react";

/**
 * THE SCROLL ITSELF, ON THE JOURNEY PAGE ONLY.
 *
 * Every scene on this page is scroll-driven, which means the scroll wheel is
 * effectively the transport control for a film. A native wheel event arrives in
 * coarse, uneven jumps, so a scrubbed animation driven by it lands in coarse,
 * uneven jumps too, however carefully the curve was authored. Smoothing the
 * scroll is not a flourish here: it is the difference between a scrub and a
 * stutter, and it improves all seventeen scenes at once rather than adding an
 * effect to one.
 *
 * ============================================================================
 * WHY THIS IS THE ONE DEPENDENCY THAT WAS WORTH ADDING
 * ============================================================================
 * GSAP was the obvious alternative and was rejected: 6.2MB unpacked, and its
 * ScrollTrigger does what components/k/journey/useStageProgress.ts already does
 * in forty lines. Adding a library for something the stack expresses cleanly is
 * how a bundle doubles for nothing.
 *
 * Lenis earns its place because it changes something the stack genuinely cannot
 * express: the feel of the scroll, everywhere, for free.
 *
 * ============================================================================
 * THREE THINGS THAT MUST STAY TRUE
 * ============================================================================
 * 1. IT ONLY RUNS ON THIS PAGE. It mounts inside the Journey route and unmounts
 *    with it, so the commercial pages a broker actually needs, Quote, Services,
 *    Contact, keep ordinary native scrolling. Smooth scroll on a page somebody
 *    is trying to get a rate from is an obstacle, not a feature.
 *
 * 2. ANYONE WHO ASKED FOR REDUCED MOTION NEVER GETS IT. Smoothed scrolling is
 *    exactly the kind of decoupling between input and response that triggers
 *    motion sickness. It is not initialised at all for them, so the page falls
 *    back to native scroll, which is what they asked for.
 *
 * 3. IT MUST NOT BREAK `position: sticky`. Four scenes on this page pin. Lenis
 *    is used here in its default mode, which drives the real scroll position
 *    rather than transforming a wrapper, so sticky, anchors, and the browser's
 *    own scrollbar all keep working. If this is ever swapped for a
 *    transform-based smooth scroller, every pinned scene breaks at once.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null;
    let frame = 0;
    let cancelled = false;

    // Loaded on demand so it is not in the bundle of any other route, and so a
    // failure to fetch it leaves the page on native scroll rather than broken.
    import("lenis")
      .then(({ default: Lenis }) => {
        if (cancelled) return;
        lenis = new Lenis({
          // Long enough to smooth the steps out of a wheel, short enough that
          // the page never feels like it is deciding whether to obey.
          duration: 1.05,
          easing: (t: number) => 1 - Math.pow(1 - t, 3),
          // Touch is left completely alone. A phone's own inertia is better
          // than anything re-implemented on top of it, and overriding it is
          // the single most common way these libraries ruin a mobile page.
          smoothWheel: true,
          syncTouch: false,
        });
        const raf = (time: number) => {
          lenis?.raf(time);
          frame = requestAnimationFrame(raf);
        };
        frame = requestAnimationFrame(raf);
      })
      .catch(() => {
        // Native scroll. The page works.
      });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      lenis?.destroy();
    };
  }, []);

  return null;
}
