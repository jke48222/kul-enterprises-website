"use client";

import { m, useReducedMotion } from "framer-motion";

/**
 * A SENTENCE THAT INKS IN, ONE WORD AT A TIME
 *
 * The block is held still in the middle of the screen while the page scrolls
 * past it, and the words darken in order from the first to the last. It reads
 * at the writing's pace instead of the reader's, which is the point: this is
 * the one passage on the site meant to be read slowly.
 *
 * THE RUN PLAYS ONCE, AT ITS OWN SPEED, and is not tied to the wheel. Tying it
 * to scroll position was tried and reverted: a reader who nudges the wheel back
 * up watches the sentence un-write itself. A high-water mark fixes that in
 * principle, but the version built on it never drove at all here, while the
 * identical arrangement in components/k/JourneySequence.tsx does, and a
 * signature moment on the one page that is not selling anything is not the
 * place to ship a mechanism that is not understood. If it is tried again,
 * prove the scroll progress is changing before building anything on top of it.
 *
 * TWO THINGS THAT LOOK LIKE DETAILS AND ARE NOT.
 *
 * The timing lives on the parent, not on the words. One instruction to watch
 * the screen, and the words take their turn from it. Putting that instruction
 * on every word would set forty separate watchers running at once for a single
 * sentence.
 *
 * The space after each word is printed inside the word. Each word is its own
 * little block so it can fade on its own, and a space left between two blocks
 * is thrown away by the browser, so without this the sentence arrives with
 * every word jammed against the next.
 *
 * KEEP IT SHORT. The words take their turn a fraction of a second apart, so a
 * long paragraph finishes long after the reader has started scrolling again.
 * Around forty words is the ceiling. It is also not the place for a clever
 * line: it is a plain statement, held still, which is quite enough.
 *
 * ============================================================================
 * THE TWO WAYS THIS BREAKS FOR PEOPLE NOT LOOKING AT A NORMAL SCREEN
 * ============================================================================
 *
 * REDUCED MOTION. This used to return a different tree, a short static section
 * instead of the two-screen pinned one. That is a bug, not a fallback:
 * useReducedMotion() is always false on the server, so every reader was sent
 * the tall version and had it replaced on hydration, jumping the page by a
 * screen and a half under exactly the people who asked for less movement. The
 * switch now lives in a prefers-reduced-motion block in app/globals.css, which
 * the server sends in the first byte and which needs no JavaScript.
 *
 * NO JAVASCRIPT AT ALL. The words are rendered at 0.16 opacity by the server,
 * because that is where the run starts. If nothing ever hydrates, that is a
 * sentence at sixteen per cent forever. The noscript block below is the
 * failsafe, and it has to be noscript rather than a rule keyed on some
 * "not yet hydrated" attribute: such a rule would fire for everybody during the
 * first paint and flash the finished sentence before the run had begun.
 *
 * (MotionProvider sets a data-hydrated attribute and its comment claims a
 * pure-CSS reveal failsafe in globals.css keyed on it. There is no such rule in
 * globals.css. Do not rely on that attribute for anything.)
 *
 * THE STAGE IS h-svh AND MUST STAY THAT WAY. Tailwind's h-screen is 100vh,
 * which on iOS Safari with the toolbar showing is taller than the part of the
 * screen you can see.
 */

/** How far apart the words take their turn, in seconds. */
const STEP = 0.035;

export default function PinnedStatement({ text }: { text: string }) {
  const reduced = useReducedMotion();
  const words = text.split(" ");

  return (
    /* Twice the height of the screen, so there is something to scroll through
       while the block below is held still. */
    <section className="kul-pin relative h-[200svh] bg-k-paper">
      <noscript>
        <style>{`.kul-pin{height:auto}.kul-pin-stage{position:static;height:auto;padding-top:8rem;padding-bottom:8rem}.kul-pin-word{opacity:1}`}</style>
      </noscript>

      <div className="kul-pin-stage sticky top-0 flex h-svh items-center px-6 md:px-12 lg:px-24">
        <m.p
          className="mx-auto max-w-[900px] font-display text-k-d3 font-black text-k-ink"
          initial={reduced ? false : "hidden"}
          whileInView={reduced ? undefined : "shown"}
          /* Starts when the block is already well up the screen, so the words
             are inking while it is pinned rather than before it arrives. */
          viewport={{ once: true, margin: "-40%" }}
          variants={{ shown: { transition: { staggerChildren: STEP } } }}
        >
          {words.map((word, i) => (
            <m.span
              key={`${word}-${i}`}
              className="kul-pin-word inline-block"
              variants={{ hidden: { opacity: 0.16 }, shown: { opacity: 1 } }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              {word}
              {i === words.length - 1 ? "" : " "}
            </m.span>
          ))}
        </m.p>
      </div>
    </section>
  );
}
