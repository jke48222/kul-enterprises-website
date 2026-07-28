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
 * HOW IT DIFFERS FROM THE SITE IT WAS TAKEN FROM. The reference ties the
 * darkening to the scroll wheel, so the words ink and un-ink as you move up
 * and down. Nothing on this site is tied to the wheel, because scrubbing
 * jitters the moment somebody scrolls back up. Here the run plays once, at its
 * own speed, when the block reaches the middle of the screen.
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
 */

/** How far apart the words take their turn, in seconds. */
const STEP = 0.035;

export default function PinnedStatement({ text }: { text: string }) {
  const reduced = useReducedMotion();
  const words = text.split(" ");

  // Anyone who has asked their computer to reduce motion gets the sentence,
  // set once, with no pinning and nothing to wait for.
  if (reduced) {
    return (
      <section className="bg-k-paper px-6 py-32 md:px-12 lg:px-24">
        <div className="mx-auto max-w-[900px]">
          <p className="font-display text-k-d3 font-black text-k-ink">{text}</p>
        </div>
      </section>
    );
  }

  return (
    /* Twice the height of the screen, so there is something to scroll through
       while the block below is held still. */
    <section className="relative h-[200vh] bg-k-paper">
      <div className="sticky top-0 flex h-screen items-center px-6 md:px-12 lg:px-24">
        <m.p
          className="mx-auto max-w-[900px] font-display text-k-d3 font-black text-k-ink"
          initial="hidden"
          whileInView="shown"
          /* Starts when the block is already well up the screen, so the words
             are inking while it is pinned rather than before it arrives. */
          viewport={{ once: true, margin: "-40%" }}
          variants={{ shown: { transition: { staggerChildren: STEP } } }}
        >
          {words.map((word, i) => (
            <m.span
              key={`${word}-${i}`}
              className="inline-block"
              variants={{ hidden: { opacity: 0.16 }, shown: { opacity: 1 } }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              {word}
              {i === words.length - 1 ? "" : " "}
            </m.span>
          ))}
        </m.p>
      </div>
    </section>
  );
}
