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
 *   3. THERE IS A BACKSTOP, the shared sweep below. Anything ON SCREEN and
 *      still unplayed is shown regardless of whether the observer ever fired,
 *      swept every SAFETY_MS and again the moment a hidden tab comes back. An
 *      entrance is worth having; it is not worth a paragraph.
 *
 *      It deliberately does not touch anything off screen. Rescuing an element
 *      nobody can see does not save a reader from anything, and it throws that
 *      element's entrance away before they ever scroll to it. See the note on
 *      the sweep for the truck this broke.
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
  /**
   * Wait exactly this many milliseconds before the entrance starts, instead
   * of the 60ms-per-index house rhythm. For the rare section that is paced by
   * hand, like the black band on the safety page. When this is set, `index`
   * no longer affects the delay.
   */
  delayMs?: number;
  /**
   * How long the entrance itself runs, in milliseconds. Bigger is slower.
   * Leave it unset everywhere the shared rhythm is wanted, which is nearly
   * everywhere: an entrance that runs at its own speed on an ordinary page
   * reads as a mistake, not a mood.
   */
  durationMs?: number;
  className?: string;
};

/**
 * How often the backstop sweeps for anything on screen that is still hidden,
 * in milliseconds.
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

/** Is any part of this element on the screen right now. */
function onScreen(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  return r.top < window.innerHeight && r.bottom > 0;
}

/**
 * ============================================================================
 * THE BACKSTOP ONLY RESCUES WHAT IS ACTUALLY ON SCREEN, AND THAT IS THE POINT.
 * ============================================================================
 *
 * It used to be one timer per element that called show() after SAFETY_MS no
 * matter where that element was, which quietly broke every entrance below the
 * fold. The tractor on the home page was the obvious casualty: it is drawn
 * facing left and rolls in from the right across a fifth of its own length, and
 * it was spending that entrance two and a half seconds after load, while it sat
 * a couple of thousand pixels below the fold. By the time anybody scrolled down
 * to it the truck had already arrived, so the whole animation only ever played
 * to an empty screen. The client asked why the truck does not drive in.
 *
 * A thing nobody can see cannot be stranded, so it does not need rescuing. What
 * needs rescuing is an element that IS on screen and is still hidden, which is
 * the failure the backstop was written for in the first place.
 *
 * ONE SWEEP FOR THE WHOLE DOCUMENT, for the same reason there is one observer:
 * thirty timers each reading their own rect is thirty forced layouts. This
 * reads only the elements still waiting, and it stops itself the moment none
 * are left, so a settled page runs no timer at all.
 */
let sweepTimer = 0;

function sweep() {
  for (const el of [...waiting]) {
    if (onScreen(el)) show(el);
  }
  if (waiting.size === 0 && sweepTimer) {
    window.clearInterval(sweepTimer);
    sweepTimer = 0;
  }
}

function startSweeping() {
  if (sweepTimer) return;
  sweepTimer = window.setInterval(sweep, SAFETY_MS);
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
  // a short page nothing will scroll again to correct it. Anything on screen
  // and still waiting is shown at once rather than waiting for the next sweep.
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") sweep();
  });
}

export default function Reveal({
  children,
  variant = "rise",
  index = 0,
  delayMs,
  durationMs,
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

    // THE FIRST BACKSTOP. If the observer never reports this element, the sweep
    // above shows it anyway, but only once it is somewhere a reader could see
    // it. Off screen it keeps its entrance and waits.
    startSweeping();

    return () => {
      waiting.delete(el);
      observer?.unobserve(el);
    };
  }, []);

  // The timing rides on custom properties rather than classes, because the
  // values are arbitrary numbers Tailwind cannot generate a class for. They
  // are written inline so a hand-set delay or length always beats the
  // variant's own value in the stylesheet.
  const delay = delayMs ?? index * 60;
  const timing: Record<string, string> = {};
  if (delay) timing["--rv-delay"] = `${delay}ms`;
  if (durationMs) timing["--rv-dur"] = `${durationMs}ms`;

  return (
    <div
      ref={ref}
      className={`kul-rv ${className ?? ""}`}
      data-rv={variant}
      style={
        Object.keys(timing).length ? (timing as React.CSSProperties) : undefined
      }
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
    // Same shared sweep as Reveal, so a rule below the fold keeps its draw
    // instead of scaling itself open where nobody is looking.
    startSweeping();

    return () => {
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
