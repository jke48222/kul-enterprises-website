"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { fill } from "@/lib/content";
import nav from "@/content/navigation.json";

/**
 * BACK TO TOP
 *
 * A circle of the bar's smoked glass in the bottom right corner, on the same
 * vertical line as the search circle in the top right, so the two corners of
 * the window answer each other: search at the top of the page, the way back
 * at the bottom of it.
 *
 * IT IS ALSO THE READER'S PLACE IN THE PAGE. A hairline of gold grows around
 * the rim as they scroll, from nothing at the top to the full circle at the
 * foot, so before it is pressed it is quietly answering "how much is left"
 * and the press it invites is "take me back to the start". That is what
 * makes it this site's control rather than an arrow in a box.
 *
 * IT IS NOT THERE AT THE TOP. It fades in once the reader is a screen down,
 * because a button offering the top of the page to somebody already at the
 * top of the page is furniture. The fade is a CSS transition on a class,
 * never a JavaScript animation, for the reason set out in Reveal.tsx: a
 * hidden tab freezes JavaScript mid-flight, and this control must never be
 * stranded half-visible.
 *
 * THE GLASS IS THE BAR'S FIRM STATE, copied from SURFACE.firm in Nav.tsx,
 * which is the source of truth for the material. It is always firm, never
 * the near-clear hero glass: this corner sits over whatever ground the page
 * ends on, light paper included, and the firm tint is the one measured to
 * hold its edge on both.
 */

/** The ring's geometry, shared by the drawing and the scroll arithmetic. */
const RING_RADIUS = 22;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const FIRM_GLASS = {
  backgroundColor: "rgba(14,14,14,0.84)",
  backgroundImage:
    "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0) 18px)",
  boxShadow: [
    "inset 0 0 0 1px rgba(255,255,255,0.08)",
    "inset 0 1px 0 rgba(255,255,255,0.18)",
    "0 1px 1px 0 rgba(0,0,0,0.04)",
    "0 10px 22px -12px rgba(0,0,0,0.26)",
    "0 26px 56px -30px rgba(0,0,0,0.40)",
  ].join(", "),
  backdropFilter: "blur(20px) saturate(165%)",
  WebkitBackdropFilter: "blur(20px) saturate(165%)",
} as const;

export default function BackToTop() {
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(false);
  const ringRef = useRef<SVGCircleElement>(null);

  /**
   * One passive listener does both jobs a frame at a time: decide whether
   * the button has earned its place, and set the ring to the reader's
   * position. The ring is written straight onto the element rather than
   * through state, because it changes on every scrolled pixel and a React
   * render per pixel is a price with nothing bought.
   */
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const limit = document.documentElement.scrollHeight - window.innerHeight;
        const progress = limit > 0 ? Math.min(1, window.scrollY / limit) : 0;
        ringRef.current?.style.setProperty(
          "stroke-dashoffset",
          String(RING_CIRCUMFERENCE * (1 - progress)),
        );
        // A screen's worth of scroll, not the bar's 60px trigger: the bar
        // firms up almost at once, but this button should arrive only once
        // the top of the page is genuinely out of sight.
        setShown(window.scrollY > window.innerHeight * 0.9);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <button
      type="button"
      aria-label={fill(nav.chrome.backToTopLabel)}
      // Anyone who asked for reduced motion gets the top at once; everyone
      // else is carried there. On the Journey, Lenis reads the position back
      // from the browser, so this works there without knowing about it.
      onClick={() =>
        window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })
      }
      tabIndex={shown ? 0 : -1}
      aria-hidden={!shown}
      /* right-5 at 1240 and up is measured against the search circle, not
         guessed: its centre sits 44px in from the edge (16 of margin, half
         of 56), and 44 less half of this button's 48 is 20. Below 1240 the
         circle is gone and the button sits on the page's own 16px gutter.

         pointer-events comes off while it is hidden so an invisible button
         can never swallow a tap meant for the page under it. */
      className={`fixed bottom-4 right-4 z-[70] flex h-12 w-12 items-center justify-center rounded-full text-k-on-dark transition-[opacity,transform] duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:text-k-gold-lit motion-reduce:transition-none min-[1240px]:right-5 ${
        shown
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
      style={FIRM_GLASS}
    >
      {/* The reader's position, drawn as the rim itself: a faint track the
          whole way round, and the gold arc grown over it from twelve
          o'clock. The offset is written by the scroll listener above. */}
      <svg
        className="absolute inset-0"
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="24"
          cy="24"
          r={RING_RADIUS}
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1.5"
        />
        <circle
          ref={ringRef}
          cx="24"
          cy="24"
          r={RING_RADIUS}
          stroke="#D6A145"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray={RING_CIRCUMFERENCE}
          strokeDashoffset={RING_CIRCUMFERENCE}
          transform="rotate(-90 24 24)"
        />
      </svg>
      {/* The arrow, in the house line: the same 1.5 stroke and round caps as
          the magnifier and the go-arrows in the search results. */}
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path
          d="M7 11.5V2.5M7 2.5L3.75 5.75M7 2.5L10.25 5.75"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
