"use client";

import Image from "next/image";
import { SCENES, inkFor, goldFor, plate, plateLabel } from "@/lib/journey-spine";
import Furniture from "./Furniture";
import { useLit } from "./useLit";

/**
 * SCENE 05 — THE BEGINNING OF INDEPENDENCE.
 *
 * ============================================================================
 * THE IDEA: THE PAGE'S OWN COMPOSITION IS THE SUBJECT
 * ============================================================================
 * Reference: Faculty Department's hard vertical seam, an editorial type column
 * on one side of a photographic panel on the other, the two different in KIND
 * so the halves can never read as a comparison. Their chrome (nav links,
 * captions on the photo, pagination) is all dropped: this seam is narrative.
 *
 * The layout divides down the centre while he is finding out who he is, and
 * the words close back over the seam when he claims both halves. The gold
 * hairline that splits the screen sits on the painted centre line of the road
 * in the photograph beside it: the road's line and the page's line are the
 * same line. That is the whole composition, and it is why the photograph's
 * object-position is hand-tuned and must not be re-cropped casually.
 *
 * "Some were good." and "Some weren't." are byte-for-byte the same type spec,
 * the same distance off the seam, one on each side. The site refuses to rank
 * them; the refusal is the point. No labels, no ticks, no colour difference,
 * and the scene resolves back into one measure, which a comparison never does.
 *
 * THE PHOTOGRAPH IS PULLED DOWN TO SIT INSIDE THE NIGHT. This ground is
 * #14141a and the frame is daylight, so it carries a fixed brightness(0.42)
 * grade and feathered top and bottom edges, emerging from the dark rather
 * than sitting on it as a rectangle. The words that cross onto it carry their
 * own wash and never depend on the photograph for their legibility.
 */

const SCENE = SCENES[4];
const PLATE = "hero-two-lane-centred";

/** His words, edited at /admin. */
export type Scene05Copy = {
  momentA: string;
  momentB: string;
  mine: string;
  leaving: string;
  firstTime: string;
  cross: string;
  good: string;
  bad: string;
  belonged: string;
  couplet: string;
  lesson: string;
};

export default function Scene05Independence({ copy }: { copy: Scene05Copy }) {
  const rootRef = useLit<HTMLElement>();
  const ink = inkFor(SCENE);
  const gold = goldFor(SCENE);
  const photo = plate(PLATE);

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
      {/* ============================================================
          MOBILE: a 187px half is unreadable, so the seam turns
          horizontal. The photo is a full-bleed band whose bottom edge
          IS the hairline, and every word lives below it.
          ============================================================ */}
      <div className="md:hidden">
        <div className="relative h-[38svh] w-full overflow-hidden">
          <Image
            src={`/images/journey/${PLATE}.webp`}
            alt={photo.alt}
            fill
            sizes="100vw"
            className="k-s05-photo object-cover"
            style={{ objectPosition: "50% 62%" }}
          />
          <span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-px"
            style={{ background: gold ?? "currentColor", opacity: 0.5 }}
          />
        </div>
        <div className="px-5 pb-[18svh] pt-10">
          <MobileCopy copy={copy} ink={ink} gold={gold} />
        </div>
      </div>

      {/* ============================================================
          DESKTOP: two halves either side of one axis.
          ============================================================ */}
      <div className="relative mx-auto hidden w-full md:block">
        {/* THE SEAM. One hairline down the exact midline, the scene's whole
            accent budget. It is drawn once when the scene arrives; its
            resting state is drawn. */}
        <span
          aria-hidden="true"
          data-lit
          className="k-jl k-s05-seam absolute inset-y-0 left-1/2 z-10 w-px origin-top"
          style={{ background: gold ?? "currentColor", opacity: 0.34, "--lit-floor": "1" } as React.CSSProperties}
        />

        {/* THE PHOTOGRAPH. Right half only, its left edge crisp on the seam,
            every other edge feathered into the ground. The object-position is
            tuned so the road's painted centre stripe lands on that left edge. */}
        <div className="pointer-events-none absolute inset-y-[8svh] left-1/2 right-0">
          <div className="k-s05-mask relative h-full w-full">
            <Image
              src={`/images/journey/${PLATE}.webp`}
              alt=""
              fill
              sizes="50vw"
              // 62% was MEASURED, not guessed: the painted centre line was
              // located by sampling the file (source x ~890 at mid frame) and
              // the offset solved so it crosses the seam at the panel's
              // vertical middle. Perspective tilts the line, so it can only be
              // exact at one height; mid panel is where the eye reads the
              // rhyme. Re-run the measurement if this file is re-exported.
              className="k-s05-photo object-cover"
              style={{ objectPosition: "62% 62%" }}
            />
          </div>
          {/* The plate label sits on the photo panel's own ground, 24px in
              from the seam, labelling the plate rather than the page. */}
          <p className="absolute bottom-4 left-6 font-display text-[11px] font-medium uppercase tracking-[0.1em]">
            {plateLabel(PLATE)}
          </p>
        </div>
        {/* The real caption for ears, since the visible frame is presentation. */}
        <p className="sr-only">{photo.alt}</p>

        <div className="relative mx-auto grid w-full max-w-[1296px] grid-cols-2 px-10 py-[12svh] lg:px-24">
          {/* PHASE A + B: one column while someone else is deciding. The block
              is centred on the axis by spanning both halves. */}
          <div className="col-span-2 mx-auto max-w-[36ch] text-center">
            <p data-lit className="k-jl font-text text-[clamp(1.125rem,1.9vw,1.625rem)] leading-[1.5]">
              {copy.momentA}
            </p>
            <p data-lit className="k-jl font-text text-[clamp(1.125rem,1.9vw,1.625rem)] leading-[1.5]">
              {copy.momentB}
            </p>
            <h2
              id={`${SCENE.slug}-heading`}
              data-lit
              className="k-jl mt-[6svh] font-display text-[clamp(2.5rem,5.5vw,4.75rem)] font-black leading-[1.02] tracking-[-0.025em]"
            >
              {copy.mine}
            </h2>
          </div>

          {/* PHASE C: the split. Type keeps 120px of dark air off the seam;
              the words never touch the line. */}
          <div className="mt-[10svh] pr-[8%]">
            <p data-lit className="k-jl max-w-[22ch] font-text text-[clamp(1.0625rem,1.7vw,1.5rem)] leading-[1.5]">
              {copy.leaving}
            </p>
            <p data-lit className="k-jl mt-2 max-w-[22ch] font-text text-[clamp(1.0625rem,1.7vw,1.5rem)] leading-[1.5]">
              {copy.firstTime}
            </p>
          </div>
          <div aria-hidden="true" />

          {/* PHASE D: the one sentence allowed to straddle the seam. It
              carries its own band scrim across the photo half so it never
              depends on the photograph's pixels. */}
          <p
            data-lit
            className="k-jl k-s05-cross col-span-2 mx-auto mt-[9svh] max-w-[26ch] text-center font-display text-[clamp(1.75rem,3.6vw,3rem)] font-medium leading-[1.15] tracking-[-0.015em]"
          >
            {copy.cross}
          </p>

          {/* PHASE E: the pair. Identical spec, identical offset from the
              seam, opposite sides, different heights. Never level for long. */}
          <p
            data-lit
            className="k-jl mt-[9svh] pr-[12%] text-right font-display text-[clamp(1.625rem,3.2vw,2.75rem)] font-medium leading-[1.1] tracking-[-0.015em]"
          >
            {copy.good}
          </p>
          <p
            data-lit
            className="k-jl k-s05-wash mt-[16svh] w-fit pl-[12%] text-left font-display text-[clamp(1.625rem,3.2vw,2.75rem)] font-medium leading-[1.1] tracking-[-0.015em]"
          >
            {copy.bad}
          </p>

          {/* PHASE F: the close. One measure again, landing on the centred
              axis "This was mine." established. */}
          <p
            data-lit
            className="k-jl col-span-2 mx-auto mt-[10svh] max-w-[30ch] text-center font-display text-[clamp(1.75rem,3.6vw,3rem)] font-medium leading-[1.12] tracking-[-0.015em]"
          >
            {copy.belonged}
          </p>

          {/* The conclusion, centred on the axis, with the last surviving
              fragment of the seam standing over it. */}
          <div className="col-span-2 mx-auto mt-[8svh] flex max-w-[46ch] flex-col items-center gap-4 text-center">
            <span
              aria-hidden="true"
              className="h-6 w-px"
              style={{ background: gold ?? "currentColor" }}
            />
            <p className="font-text text-[clamp(1.0625rem,1.7vw,1.5rem)] leading-[1.45]">
              {copy.couplet}
            </p>
            <p className="font-text text-[clamp(1.125rem,2vw,1.75rem)] leading-[1.4]">
              {copy.lesson}
            </p>
          </div>
        </div>
      </div>

      <Furniture scene={SCENE} plateFile={PLATE} />
    </section>
  );
}

/** The same beats, stacked for one column. The pair keeps its two sides as
 *  two alignments, which is the most a phone can honestly do with a seam. */
function MobileCopy({ copy, ink, gold }: { copy: Scene05Copy; ink: string; gold: string | null }) {
  void ink;
  return (
    <>
      <p data-lit className="k-jl font-text text-[1.0625rem] leading-[1.5]">
        {copy.momentA}
      </p>
      <p data-lit className="k-jl font-text text-[1.0625rem] leading-[1.5]">
        {copy.momentB}
      </p>
      <p data-lit className="k-jl mt-6 font-display text-[2.25rem] font-black leading-[1.04] tracking-[-0.02em]">
        {copy.mine}
      </p>
      <p data-lit className="k-jl mt-8 max-w-[30ch] font-text text-[1.0625rem] leading-[1.5]">
        {copy.leaving} {copy.cross}
      </p>
      <p data-lit className="k-jl mt-7 font-display text-[1.5rem] font-medium leading-[1.15]">
        {copy.good}
      </p>
      <p data-lit className="k-jl mt-4 text-right font-display text-[1.5rem] font-medium leading-[1.15]">
        {copy.bad}
      </p>
      <p data-lit className="k-jl mt-7 max-w-[30ch] font-text text-[1.0625rem] leading-[1.5]">
        {copy.belonged}
      </p>
      <div className="mt-8 flex max-w-[38ch] flex-col gap-3">
        <span aria-hidden="true" className="h-px w-16" style={{ background: gold ?? "currentColor" }} />
        <p className="font-text text-[1.0625rem] leading-[1.45]">
          {copy.couplet}
        </p>
        <p className="font-text text-[1.125rem] leading-[1.4]">
          {copy.lesson}
        </p>
      </div>
    </>
  );
}
