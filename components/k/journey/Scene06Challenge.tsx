"use client";

import Image from "next/image";
import { SCENES, inkFor, goldFor, plate, plateLabel } from "@/lib/journey-spine";
import Furniture from "./Furniture";
import { useLit } from "./useLit";

/**
 * SCENE 06 — CHOOSING A GREATER CHALLENGE.
 *
 * ============================================================================
 * REBUILT OFF THE SPLIT, ON THE COHERENCE REVIEW'S ORDER
 * ============================================================================
 * The original spec was a sticky plate beside a scrolling column, which was
 * the identical composition to scene 5, from the identical reference, one
 * scene later. The review's verdict stands here: the split belongs to scene 5
 * alone, and this scene's actual idea never needed one.
 *
 * The idea: no photograph exists of a young man deciding to enlist. So the
 * plate holds a LINE first, a 1px gold rule drawn across the dark at exactly
 * half its height, and only then a photograph fades up under it, whose real
 * ridgeline lands exactly where the line was already drawn. A line drawn
 * before there was anything to see, that turns out to have been a horizon.
 * That is "I wanted structure", built as geometry, on one centred plate on an
 * otherwise empty stage. Quieter than everything around it, which this page
 * badly needs at this point.
 *
 * THE CROP MATH: the source is 4:3 and the frame is 3:2, so object-fit: cover
 * shows about 75% of the source height. object-position center 53% lands the
 * ridge crest at the vertical middle of the frame, on the rule. If the file is
 * ever re-exported, re-check the ridge against the rule before shipping.
 *
 * THE GRADE IS FIXED AND NOT A CHEAT. s06-wide-horizon is bright daylight and
 * this ground is #17181f; unmodified it would punch a daylight hole through
 * the light arc four scenes before the sunrise. brightness(0.42) saturate(0.55)
 * reads as first light on a ridge, which is what a pre-dawn scene needs. No
 * tint, no duotone, no gradient map: the photograph stays a photograph.
 *
 * The Air Force is named in the QUIETEST sentence on screen, per Mark's own
 * direction: service, not a trophy. The answers are heavier than the
 * questions; the naming is flat.
 */

const SCENE = SCENES[5];
const PLATE = "s06-wide-horizon";

/** His words, edited at /admin. */
export type Scene06Copy = {
  freedomA: string;
  freedomB: string;
  question: string;
  answerA: string;
  answerB: string;
  airforce: string;
  noPhoto: string;
  credit: string;
  lesson: string;
};

export default function Scene06Challenge({ copy }: { copy: Scene06Copy }) {
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
      <div className="mx-auto flex w-full max-w-[1296px] flex-col items-center px-5 py-[12svh] pb-[20svh] md:px-10">
        {/* THE QUESTION. Above the plate, so the line is drawn in answer. */}
        <div className="max-w-[34ch] text-center">
          <p data-lit className="k-jl font-text text-[clamp(1.0625rem,1.7vw,1.5rem)] leading-[1.5]">
            {copy.freedomA}
          </p>
          <p data-lit className="k-jl font-text text-[clamp(1.0625rem,1.7vw,1.5rem)] leading-[1.5]">
            {copy.freedomB}
          </p>
          <h2
            id={`${SCENE.slug}-heading`}
            data-lit
            className="k-jl mt-[5svh] text-balance font-display text-[clamp(1.625rem,3.6vw,3rem)] font-medium leading-[1.12] tracking-[-0.015em]"
          >
            {copy.question}
          </h2>
        </div>

        {/* THE PLATE. Bounded and framed, ground showing through its border:
            an unexposed plate only reads as unexposed if you can see its
            edges. The rule sits at exactly half height; the photograph fades
            up beneath it and the ridge meets the line. */}
        <figure data-lit className="k-jl mt-[8svh] w-full max-w-[560px]">
          <div
            className="relative aspect-[3/2] w-full overflow-hidden"
            style={{ outline: "1px solid color-mix(in srgb, currentColor 16%, transparent)", outlineOffset: "-1px" }}
          >
            <Image
              src={`/images/journey/${PLATE}.webp`}
              alt={`No photograph exists of this decision. The photograph shown is a road view taken by Mark Brown: ${photo.alt}`}
              fill
              sizes="(min-width: 768px) 560px, 100vw"
              className="k-s06-photo object-cover"
              style={{ objectPosition: "center 53%" }}
            />
            {/* The line he drew, resting on the ridge. Its stylesheet default
                is drawn and settled at 0.35 over the photograph; the arrival
                animation only replays that. */}
            <span aria-hidden="true" className="k-s06-line absolute left-0 top-1/2 h-px w-full origin-left" style={{ background: gold ?? "currentColor" }} />
          </div>
          <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 font-display text-[11px] font-medium uppercase leading-[1.5] tracking-[0.1em]">
            <span>{copy.noPhoto}</span>
            <span className="tabular-nums">{plateLabel(PLATE)} · {copy.credit}</span>
          </figcaption>
        </figure>

        {/* THE ANSWERS. Heavier than the questions that produced them; the
            enlistment named at the quietest weight in the scene. */}
        <div className="mt-[8svh] max-w-[34ch] text-center">
          <p data-lit className="k-jl font-text text-[clamp(1.125rem,1.9vw,1.625rem)] font-semibold leading-[1.45]">
            {copy.answerA}
          </p>
          <p data-lit className="k-jl font-text text-[clamp(1.125rem,1.9vw,1.625rem)] font-semibold leading-[1.45]">
            {copy.answerB}
          </p>
          <p data-lit className="k-jl mt-[4svh] font-text text-[clamp(1rem,1.5vw,1.3125rem)] leading-[1.55]">
            {copy.airforce}
          </p>
        </div>

        <div className="mt-[7svh] flex max-w-[40ch] flex-col items-center gap-4 text-center">
          <span aria-hidden="true" className="h-px w-16" style={{ background: gold ?? "currentColor" }} />
          <p className="font-text text-[clamp(1.0625rem,1.7vw,1.5rem)] leading-[1.45]">
            {copy.lesson}
          </p>
        </div>
      </div>

      <Furniture scene={SCENE} plateFile={PLATE} />
    </section>
  );
}
