"use client";

import Image from "next/image";
import { SCENES, inkFor, goldFor, plate, plateLabel } from "@/lib/journey-spine";
import Furniture from "./Furniture";
import { useLit } from "./useLit";

/**
 * SCENE 09 — EARNING TRUST.
 *
 * ============================================================================
 * THE STRATA: NOTHING THAT CAME BEFORE IS THROWN AWAY
 * ============================================================================
 * Reference: Readymag's perspective deck, reduced to what the idea actually
 * needs. In a normal card section the new card covers and erases the old one.
 * Here the opposite is the point: eight responsibilities in a flush-left
 * stack of hairline-ruled plates, ragged right like paper, every one still
 * present and countable at the end. "Trust is earned long before it's ever
 * expected" is a sentence about the layers underneath, so the layers stay.
 *
 * The original 620vh pin was cut by the coherence review and the spine
 * re-budgeted the scene to ordinary flow; the spec's own no-JS state ("this
 * exact same state is also the whole scene") is what ships, with a small
 * settle entrance per stratum.
 *
 * ============================================================================
 * WHY THE PHOTOGRAPHS ARE HERE AND NOT IN SCENE 3
 * ============================================================================
 * jobsite-bay, jobsite-install and jobsite-fixtures are phone photographs
 * from November 2021 to May 2022: Mark's WORKING LIFE, a man running crews
 * and installations. Scene 3 nearly used them for his 1990s childhood, which
 * would have been a lie; this scene is the chapter those photographs are
 * actually from, so this is where the archive gets to speak. They are placed
 * in date order, which also keeps their plate numbers ascending.
 *
 * ============================================================================
 * THEY ARE A CONTACT SHEET NOW, NOT THUMBNAILS IN CARDS (2 Aug, client)
 * ============================================================================
 * They used to sit inside three of the strata as 280px crops at 4:3. Every
 * one of them is a PORTRAIT phone frame, so a 4:3 crop threw away a third of
 * each picture, and at that size, tucked beside a sentence, they read as
 * decoration a designer had reached for rather than as evidence. All three
 * looked interchangeable: grey concrete, grey ceiling, grey floor.
 *
 * So they come out of the sentences and stand together, at their own shape,
 * at a size worth looking at, dated. A contact sheet is what a phone archive
 * actually is, and three frames in a row read as a record where three lonely
 * crops read as clip art. Below md the row becomes a snap gallery: one
 * photograph nearly full width with the edge of the next showing, which is
 * the only way a portrait frame is legible on a phone.
 *
 * THE FIELD NOTE FILM CAME OUT ON 2 AUG at the client's word. It was a
 * seventeen second video of Mark on a jobsite, opened from a button on one
 * of the strata. Its dialog, its button and its transcript field went with
 * it. Nothing here plays sound any more.
 *
 * No card has an icon, a heading, a button or a radius; no shadow exists in
 * the scene; the fills are alpha-white over the light arc so they change with
 * the sunrise instead of sitting on it. Those are the tells that keep eight
 * stacked rectangles from reading as a product-feature stack.
 */

const SCENE = SCENES[8];

/** The ragged right edge of the stack. Widths only: the photographs no longer
 *  live in the strata, they stand together below them. */
const WIDTHS = [
  "min(46rem, 100%)",
  "min(35rem, 92%)",
  "min(44rem, 100%)",
  "min(44rem, 100%)",
  "min(40rem, 96%)",
  "min(45rem, 100%)",
  "min(39rem, 94%)",
  "min(44rem, 100%)",
] as const;

/** The contact sheet, in date order, which is also plate order. */
const RECORD = ["jobsite-bay", "jobsite-install", "jobsite-fixtures"] as const;

/** His words, edited at /admin; which photographs the record holds is the
 *  register's business and stays above. */
export type Scene09Copy = {
  cards: string[];
  recordLabel: string;
  recordNote: string;
  lesson: string;
  lessonWord: string;
};

export default function Scene09Trust({ copy }: { copy: Scene09Copy }) {
  const rootRef = useLit<HTMLElement>();
  const ink = inkFor(SCENE);
  const gold = goldFor(SCENE);

  return (
    <section
      id={SCENE.slug}
      ref={rootRef}
      aria-labelledby={`${SCENE.slug}-heading`}
      className="relative"
      style={{
        minHeight: `${SCENE.vh}svh`,
        background: `linear-gradient(180deg, ${SCENE.from} 0%, ${SCENE.to} 100%)`,
        color: ink,
      }}
    >
      <div className="mx-auto w-full max-w-[1296px] px-5 py-[12svh] pb-[20svh] md:px-10 lg:px-24">
        <h2 id={`${SCENE.slug}-heading`} className="sr-only">
          Earning trust
        </h2>

        <ol>
          {copy.cards.map((text, i) => (
            <li
              key={text}
              data-lit
              className="k-jl k-s09-card k-card-cine mt-3 first:mt-0"
              style={
                {
                  maxWidth: WIDTHS[Math.min(i, WIDTHS.length - 1)],
                  "--lit-floor": "0.66",
                } as React.CSSProperties
              }
            >
              <div className="flex items-start gap-5 p-5 md:gap-7 md:p-7">
                <span
                  className="pt-1 font-display text-[11px] font-medium uppercase tabular-nums tracking-[0.1em]"
                  style={{ color: gold ?? "currentColor" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="flex-1 font-text text-[clamp(1.125rem,1.9vw,1.625rem)] leading-[1.35]">
                  {text}
                </p>
              </div>
            </li>
          ))}
        </ol>

        {/* ============================================================
            THE CONTACT SHEET. Three frames at the shape they were taken
            in, dated, at a size worth looking at.
            ============================================================ */}
        <figure className="mt-[10svh]">
          <figcaption className="mb-5 flex flex-col gap-2 md:flex-row md:items-baseline md:gap-6">
            <span
              className="font-display text-[11px] font-medium uppercase tracking-[0.2em]"
              style={{ color: gold ?? "currentColor" }}
            >
              {copy.recordLabel}
            </span>
            <span className="max-w-[52ch] font-text text-[clamp(0.9375rem,1.3vw,1.125rem)] leading-[1.5] opacity-[0.82]">
              {copy.recordNote}
            </span>
          </figcaption>

          {/* Below md this is a snap gallery and it genuinely scrolls, so it
              is a labelled, focusable region: a keyboard reader can reach it
              and drive it with the arrow keys, which a plain overflow
              container does not allow in every browser. From md it is three
              columns that all fit, so the stop lands on a group that is
              already fully visible, which costs a keyboard reader one press
              and misleads nobody.

              The frames bleed to the viewport edges on a phone: a portrait
              photograph inside a 20px gutter is small enough that the person
              on the lift disappears. */}
          <div
            role="group"
            tabIndex={0}
            aria-label="Three photographs from Mark's working life, 2021 to 2022"
            // gap-4 on the phone, gap-px from md. The three frames butt
            // together on the wide page because that is what a contact sheet
            // looks like; in the snap gallery they need daylight between them
            // or the neighbouring frame's plate number lands on this one's
            // date and the two captions read as one string.
            className="k-s09-sheet -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 md:mx-0 md:grid md:grid-cols-3 md:gap-px md:overflow-visible md:px-0"
          >
            {RECORD.map((file) => {
              const p = plate(file);
              return (
                <div
                  key={file}
                  className="w-[74vw] shrink-0 snap-center md:w-auto md:shrink"
                >
                  <div className="k-s09-frame relative aspect-[3/4] w-full overflow-hidden">
                    <Image
                      src={`/images/journey/${file}.webp`}
                      alt={p.alt}
                      fill
                      sizes="(min-width: 768px) 33vw, 74vw"
                      className="k-drift object-cover"
                    />
                  </div>
                  {/* Both marks hang off the frame's LEFT edge, not spread to
                      its two ends. Spread, the date of one frame and the plate
                      number of the next sit a hairline apart and read as one
                      run-on string, because the frames themselves butt
                      together. */}
                  <p className="mt-2.5 flex items-baseline gap-4 font-display text-[11px] font-medium uppercase tracking-[0.1em] opacity-[0.72]">
                    <span className="tabular-nums">{plateLabel(file)}</span>
                    {p.when ? <span>{p.when}</span> : null}
                  </p>
                </div>
              );
            })}
          </div>
        </figure>

        {/* The one labelled lesson in this act. The label is the site's voice
            reading the stack back; the sentence is his. */}
        <div className="mt-[9svh] flex max-w-[36ch] flex-col gap-4">
          <p
            className="font-display text-[11px] font-medium uppercase tracking-[0.2em]"
            style={{ color: gold ?? "currentColor" }}
          >
            {copy.lessonWord}
          </p>
          <p className="font-text text-[clamp(1.25rem,2.2vw,2rem)] leading-[1.35]">
            {copy.lesson}
          </p>
        </div>
      </div>

      <Furniture scene={SCENE} />
    </section>
  );
}
