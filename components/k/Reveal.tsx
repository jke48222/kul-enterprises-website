"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

/**
 * HOW THINGS ARRIVE ON SCREEN
 *
 * One shared set of entrances, so the whole site moves in the same handwriting
 * rather than every page inventing its own.
 *
 * There are five, and they are deliberately different from each other. A page
 * where every single thing fades upward by the same amount reads as flat as a
 * page where every section is the same three columns, which is the reason this
 * file exists at all.
 *
 *   rise     The default. Comes up a little as it fades in. For paragraphs,
 *            cards, pictures, and anything in a group.
 *   wipe     For big headlines only. The words are uncovered from the left
 *            instead of fading, which suits type this heavy and gives the top
 *            of a section a single strong move.
 *   settle   Almost nothing: a very small lift, no travel. For dense rows of
 *            small print where a big movement would look silly.
 *   roll     Comes in from the right and slows to a stop. Built for the
 *            tractor on the home page, which is drawn facing left and so has
 *            to arrive from the side it is driving away from. Anything using
 *            this needs a parent with overflow hidden, or the page gains a
 *            sideways scrollbar for the length of the movement.
 *   rule     For the hairlines. The line draws itself across from the left.
 *
 * ============================================================================
 * THIS WAS REBUILT ON 29 JUL 2026 BECAUSE IT COULD HIDE THE PAGE.
 * ============================================================================
 *
 * The previous version was framer-motion `whileInView`, with each variant
 * declaring an `initial` state that was invisible: opacity 0 for three of them
 * and `clip-path: inset(0 100% 0 0)` for the wipe. That is a normal way to
 * write an entrance and it has one catastrophic property. THE ANIMATION WAS
 * THE ONLY THING THAT MADE THE CONTENT VISIBLE, so anything that stopped the
 * animation stopped the reader seeing the words.
 *
 * It was caught on the About page, reported as an empty space with a question
 * mark drawn over it. Measured at 928px wide: fifteen elements on that one page
 * were invisible at once, the h1 was frozen part-way through its wipe reading
 * "Ele / car / ow", and scrolling them into view did not recover any of them.
 * The section heading, the founder's note, the imprint and half the page were
 * simply not there. Across the site that failure mode was available at 105
 * call sites.
 *
 * Framer drives these on requestAnimationFrame. A browser stops issuing frames
 * to a tab nobody is looking at, so an animation caught by a tab switch, a
 * heavy paint, or a slow first load can stall at whatever value it had reached
 * and never resume, and `whileInView` with `once: true` will not fire again to
 * rescue it.
 *
 * SO THE RULE HERE IS NOW: NOTHING ON THIS SITE IS INVISIBLE UNLESS SOMETHING
 * ACTIVELY HID IT, AND WHATEVER HID IT IS GUARANTEED TO PUT IT BACK.
 *
 * Three things enforce that, and all three have to stay:
 *
 *   1. THE VISIBLE STATE IS THE CSS DEFAULT. `.kul-rv` on its own is a plain
 *      visible element. The hiding rule in app/globals.css is scoped to
 *      `html[data-reveal]`, and that attribute is set by the inline script in
 *      app/layout.tsx, which runs before first paint and only when there is a
 *      script running at all. No JavaScript, an old browser, a thrown error
 *      during hydration: the page is simply legible.
 *
 *   2. THE ENTRANCE IS A CSS ANIMATION, NOT A JAVASCRIPT ONE. CSS keyframes
 *      are not driven by requestAnimationFrame from this thread, they run to
 *      completion in a background tab, and `animation-fill-mode: both` pins
 *      the finished state when they land. The stall that started all of this
 *      is not reachable from here.
 *
 *   3. THERE IS A BACKSTOP, in `arm()` below. Anything still unplayed after
 *      SAFETY_MS is shown regardless of whether the observer ever fired, and
 *      anything unplayed when a hidden tab becomes visible again is shown at
 *      once. An entrance is worth having; it is not worth a paragraph.
 *
 * ANYONE WHO HAS ASKED THEIR COMPUTER TO REDUCE MOTION sees none of it, and
 * that is enforced twice: the inline script does not set the attribute, so
 * nothing is ever hidden, and globals.css switches the animations off as well.
 */

export type RevealVariant = "rise" | "wipe" | "settle" | "roll";

type RevealProps = {
  children: ReactNode;
  /** Which entrance to use. Defaults to rise. */
  variant?: RevealVariant;
  /** Position within a group. Each step adds 60ms, so a row arrives in order. */
  index?: number;
  className?: string;
};

/**
 * How long anything may stay hidden waiting to be noticed, in milliseconds.
 *
 * Generous, because it is a safety net and not a schedule: a reader on a slow
 * connection should get the entrance rather than have it snatched away. But it
 * is finite, which is the whole point.
 */
const SAFETY_MS = 2600;

/** How near the edge of the screen an element is when it counts as arrived. */
const OBSERVER_MARGIN = "0px 0px -12% 0px";

/**
 * One observer for the whole document rather than one per element.
 *
 * There are 87 of these on the site and a page can hold thirty. Thirty
 * IntersectionObservers all watching the same scroller is thirty callbacks per
 * scroll; one observer with thirty targets is one.
 */
let observer: IntersectionObserver | null = null;

/** Everything hidden and still waiting, so the backstops can find them. */
const waiting = new Set<HTMLElement>();

function show(el: HTMLElement) {
  if (!waiting.delete(el)) return;
  observer?.unobserve(el);
  el.setAttribute("data-shown", "");
}

function ensureObserver() {
  if (observer || typeof IntersectionObserver === "undefined") return;

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) show(entry.target as HTMLElement);
      }
    },
    { rootMargin: OBSERVER_MARGIN, threshold: 0 },
  );

  // THE SECOND BACKSTOP. A tab that was hidden while its reveals were queued
  // comes back to a page that has already decided they are off screen, and on
  // a short page nothing will scroll again to correct it. Everything still
  // waiting is simply shown.
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      for (const el of [...waiting]) show(el);
    }
  });
}

export default function Reveal({
  children,
  variant = "rise",
  index = 0,
  className,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // The attribute is only on <html> when the inline script decided this
    // visitor gets entrances at all. Without it nothing was ever hidden and
    // there is nothing to reveal.
    if (!document.documentElement.hasAttribute("data-reveal")) return;
    if (el.hasAttribute("data-shown")) return;

    ensureObserver();
    if (!observer) {
      // No IntersectionObserver in this browser. Show it and move on; an
      // entrance is not worth withholding a paragraph over.
      el.setAttribute("data-shown", "");
      return;
    }

    waiting.add(el);
    observer.observe(el);

    // THE FIRST BACKSTOP. If the observer never reports this element, for any
    // reason at all, it stops being hidden.
    const safety = window.setTimeout(() => show(el), SAFETY_MS);

    return () => {
      window.clearTimeout(safety);
      waiting.delete(el);
      observer?.unobserve(el);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`kul-rv ${className ?? ""}`}
      data-rv={variant}
      // The stagger is a custom property rather than a class, because the
      // index is arbitrary and Tailwind cannot generate a class per number.
      style={index ? ({ "--rv-delay": `${index * 60}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}

/**
 * A hairline that draws itself across from the left.
 *
 * Use it in place of a border on the rules that head a section. It scales
 * rather than growing, because animating the width of anything inside a
 * scrolling page makes the browser re-lay out the whole thing on every frame.
 *
 * IT IS THE SAME MECHANISM AS Reveal ABOVE and for the same reason: a rule
 * that never draws is a section with no rule under its heading, which is a
 * visible hole rather than a missing flourish.
 */
export function RuleDraw({
  className,
  index = 0,
  tone = "light",
}: {
  className?: string;
  index?: number;
  /** Which ground the line sits on, so it picks the right grey. */
  tone?: "light" | "dark";
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const colour = tone === "dark" ? "bg-k-rule-dark" : "bg-k-rule-strong";

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!document.documentElement.hasAttribute("data-reveal")) return;
    if (el.hasAttribute("data-shown")) return;

    ensureObserver();
    if (!observer) {
      el.setAttribute("data-shown", "");
      return;
    }

    waiting.add(el);
    observer.observe(el);
    const safety = window.setTimeout(() => show(el), SAFETY_MS);

    return () => {
      window.clearTimeout(safety);
      waiting.delete(el);
      observer?.unobserve(el);
    };
  }, []);

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={`kul-rv block h-px w-full origin-left ${colour} ${className ?? ""}`}
      data-rv="rule"
      style={index ? ({ "--rv-delay": `${index * 60}ms` } as React.CSSProperties) : undefined}
    />
  );
}
