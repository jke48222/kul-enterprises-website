"use client";

import Image from "next/image";
import { SCENES, plate, plateLabel, inkFor } from "@/lib/journey-spine";
import Furniture from "./Furniture";

/**
 * SCENE 11 — A VISION BEGINS TO FORM.
 *
 * The roll call. Six words, and one face.
 *
 * ============================================================================
 * WHAT THIS SCENE USED TO BE, AND WHY IT IS NOT THAT ANY MORE (2 Aug, client)
 * ============================================================================
 * It was an archive being interrogated: the well answered whichever name was
 * level with it, and four times out of six the answer was a drawn empty
 * frame. The argument was honest and the machinery was not worth it. Driving
 * it took a per-frame rect read of six rows, a held-hover override, a state
 * commit deferred out of the measurement pass, and a View Transition on every
 * change. On a page with smoothed scrolling, that last part is what the client
 * saw: the transition snapshots the document, so the whole page stalled for a
 * beat every time a name went by, six times in one scene, and a scene about
 * people read as a stutter.
 *
 * The instruction was to use Mark's picture through Drivers to Brokers. Taken
 * at its word it removes the swap entirely, and with the swap goes every one
 * of those moving parts: THIS FILE NOW CONTAINS NO JAVASCRIPT AT ALL. No
 * state, no effect, no observer, no ref. One photograph stands for the list,
 * the caption says why it is the one, and the roll call is type.
 *
 * If a future round wants the archive interrogated again, do it with a
 * scroll-driven CSS timeline and no snapshotting transition. Do not put the
 * rect reader back.
 *
 * ============================================================================
 * WHY NOTHING HERE EVER CHANGES OPACITY
 * ============================================================================
 * This scene sits at the tightest part of the light arc. Its ground runs from
 * #909ca5 to #9fabbd, and ink on that is 6.6:1 at best. There is enough room
 * for full-strength text and none at all for a dimmed state: ink at 55% over
 * this ground composites to roughly 2.5:1, which is unreadable.
 *
 * So the name being called is NEVER carried by alpha. It is carried by weight
 * and by the tick in the margin, both of which are driven by the scroll
 * position of the row itself, in CSS, with no script (see .k-s11-row in
 * globals.css). Every one of the six words sits at full ink permanently, in
 * every state, in every browser, including one that has never heard of a
 * scroll timeline. Do not add an opacity to this list.
 */

const SCENE = SCENES[10];
const PLATE_FILE = "mark-portrait";

/** His words, edited at /admin. */
export type Scene11Copy = {
  premise: string;
  people: string;
  roll: string[];
  plateNote: string;
};

export default function Scene11People({ copy }: { copy: Scene11Copy }) {
  const ink = inkFor(SCENE);
  const portrait = plate(PLATE_FILE);

  return (
    <section
      id={SCENE.slug}
      aria-labelledby="people-heading"
      className="relative"
      style={{
        // min-height, not height: the roll call is six lines of copy the
        // client can lengthen, and a fixed height would clip a seventh.
        minHeight: `${SCENE.vh}svh`,
        background: `linear-gradient(180deg, ${SCENE.from} 0%, ${SCENE.to} 100%)`,
        color: ink,
      }}
    >
      <div className="k-cine mx-auto flex w-full max-w-[1296px] flex-col px-5 pb-[16svh] pt-[12svh] md:px-10 lg:px-24">
        {/* THE PREMISE. The answer arrives alone, in empty ground. */}
        <div className="max-w-[34ch]">
          <h2
            id="people-heading"
            className="font-text text-[clamp(1.125rem,2vw,1.75rem)] font-normal leading-[1.35]"
          >
            {copy.premise}
          </h2>
          <p className="k-title-cine mt-[8svh] font-display text-[clamp(2rem,5.4vw,4.5rem)] font-black leading-[1.02] tracking-[-0.025em]">
            {copy.people}
          </p>
        </div>

        {/* THE ROLL CALL. Names left, the one face the archive has on the
            right. Below lg the portrait comes first, at a little over half
            the column: a phone reads the picture, then the list it stands
            for, which is the same order the eye takes on the wide page. */}
        <div className="mt-[10svh] flex flex-col gap-12 lg:grid lg:grid-cols-[1fr_360px] lg:gap-20">
          {/* Source order puts the list first so the wide page can hang the
              portrait in the right-hand column; on a phone the order flips
              back visually and the reading order is unaffected either way,
              because a photograph and a list of nouns have no sequence. */}
          <ul className="order-2 flex flex-col lg:order-none">
            {copy.roll.map((word) => (
              <li key={word} className="flex items-baseline gap-5 py-[1.4svh]">
                {/* The margin tick and the weight are the whole signal, and
                    both are scroll-driven CSS. See globals.css. */}
                <span
                  aria-hidden="true"
                  className="k-s11-tick mt-[0.5em] h-px w-8 shrink-0 origin-left bg-current"
                />
                {/* font-black is the RESTING state, not the styling: a
                    browser with no scroll timelines, or a reader who asked
                    for no motion, gets all six names called at once, which
                    is a complete roll call. The keyframes drive the wght
                    axis directly, and font-variation-settings outranks
                    font-weight, so the animation still wins where it runs. */}
                <span className="k-s11-row font-display text-[clamp(1.75rem,4.6vw,3.75rem)] font-black leading-[1.06] tracking-[-0.02em]">
                  {word}
                </span>
              </li>
            ))}
          </ul>

          {/* THE FACE. On the wide page it is sticky, so it holds the reader's
              eye level for the whole roll call rather than scrolling out from
              under the third name. */}
          <figure className="order-1 w-[62%] max-w-[280px] lg:order-none lg:w-full lg:max-w-none">
            <div className="lg:sticky lg:top-[30svh]">
              <div
                className="k-s11-well relative aspect-[3/4] w-full overflow-hidden"
                style={{ outline: `1px solid ${ink}`, outlineOffset: "-1px" }}
              >
                <Image
                  src={`/images/journey/${PLATE_FILE}.webp`}
                  alt={portrait.alt}
                  fill
                  sizes="(min-width: 1024px) 360px, 62vw"
                  className="k-drift object-cover"
                />
              </div>
              <figcaption className="mt-3 flex flex-col gap-1.5 font-display text-[11px] font-medium uppercase leading-[1.5] tracking-[0.1em]">
                <span className="tabular-nums">{plateLabel(PLATE_FILE)}</span>
                <span className="normal-case tracking-normal font-text text-[13px] leading-[1.5] opacity-[0.85]">
                  {copy.plateNote}
                </span>
              </figcaption>
            </div>
          </figure>
        </div>
      </div>

      <Furniture scene={SCENE} plateFile={PLATE_FILE} />
    </section>
  );
}
