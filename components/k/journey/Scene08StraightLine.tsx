"use client";

import Image from "next/image";
import { SCENES, inkFor, goldFor, plate, plateLabel } from "@/lib/journey-spine";
import Furniture from "./Furniture";
import { useLit } from "./useLit";

/**
 * SCENE 08 — LIFE DOESN'T FOLLOW A STRAIGHT LINE.
 *
 * ============================================================================
 * THE IDEA, KEPT; THE MACHINE, NOT
 * ============================================================================
 * The original spec was a 400vh pin: a bezier road sliding past a fixed
 * reading anchor, with text riding the curve. The coherence review found the
 * 8-9-10 stretch was seventeen consecutive screens of pinned scrubbing and
 * ordered it cut, and the spine re-budgeted this scene to ordinary flow.
 *
 * What survives is the spec's own answer for small screens, scaled up,
 * because it was always the honest core of the idea: THE COLUMN ITSELF BENDS.
 * Each statement's left edge steps along a shallow S down the page, out to
 * the widest swing at "There were victories.", snapping hard back for "There
 * were setbacks.", and returning home for the question. A single drawn gold
 * line threads the indents, so the path is visible; the statements are the
 * places it was wide.
 *
 * Victories and setbacks are the SAME size, the same weight, the same
 * colour: they sit on opposite swings of the bend, and the bend is the only
 * thing that distinguishes them. Line 6 resolves the pair and takes the one
 * weight step in the column. The question is the largest type in the scene,
 * larger than the lesson, because the question is the point.
 *
 * The unlit floor here is 0.55, which the review set after finding the spec's
 * 0.34 was the only sub-AA resting text on the page: 0.55 composites to about
 * 5.3:1 on this ground, so every statement passes AA at every scroll position.
 */

const SCENE = SCENES[7];
const PLATE = "s08b-rockcut-bend";

/**
 * The bend, as left insets. Out, further out, widest at victories, snapped
 * back inside for setbacks, resolving through line 6, home for the question.
 * These are the same numbers the gold path below is drawn through.
 */
const DESIGN = [
  { inset: 0 },
  { inset: 64 },
  { inset: 148 },
  { inset: 264, pair: true },
  { inset: 96, pair: true },
  { inset: 148, resolve: true },
  { inset: 48 },
] as const;

/** His words, edited at /admin; the bend they trace is design and stays here. */
export type Scene08Copy = {
  statements: string[];
  questionA: string;
  questionB: string;
  lessonA: string;
  lessonB: string;
};

export default function Scene08StraightLine({ copy }: { copy: Scene08Copy }) {
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
      <div className="mx-auto w-full max-w-[1296px] px-5 py-[12svh] pb-[20svh] md:px-10 lg:px-24">
        <div className="relative">
          {/* THE ROAD. One drawn line threading the indents. Decoration: the
              bend it describes is already fully carried by the text insets,
              so nothing depends on seeing it. Scaled to the block, stroke
              width pinned at 1px. */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute -left-2 top-0 hidden h-full w-[340px] md:block"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path
              d="M 2 1 C 30 8, 52 12, 58 22 C 64 30, 84 34, 86 40 C 88 46, 38 46, 34 52 C 30 57, 50 60, 48 66 C 46 72, 18 76, 14 84 C 11 90, 4 94, 3 100"
              fill="none"
              stroke={gold ?? "currentColor"}
              strokeOpacity="0.5"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <h2 id={`${SCENE.slug}-heading`} className="sr-only">
            Life doesn&rsquo;t follow a straight line
          </h2>

          <ol className="relative">
            {copy.statements.slice(0, 3).map((text, i) => (
              <StatementRow key={text} text={text} s={DESIGN[i]} />
            ))}
          </ol>

          {/* THE PLATE. The road going out of sight, immediately after the
              sentence about plans changing. It bleeds off the left edge so it
              has no framed-rectangle silhouette, is pulled down into the
              scene's pre-dawn light, and carries a scrim that dissolves its
              bright sky into the ground. No text ever sits on it; the label
              sits on the ground above. */}
          <div className="my-[7svh] md:my-[8svh]">
            <p className="mb-3 pl-0 font-display text-[11px] font-medium uppercase tracking-[0.1em] md:pl-[48px]">
              <span className="tabular-nums">{plateLabel(PLATE)}</span>
            </p>
            {/* ml 50%-50vw is the one margin that lands this element's
                left edge exactly on the viewport's, whatever the container
                caps at; the width buys the bleed distance back and then the
                column's own measure. Fixed negative margins only reached
                the edge below the container cap, so on wide screens the
                "bleed" floated with a gutter. */}
            <div className="k-s08-frame relative ml-[calc(50%-50vw)] h-[38svh] w-[calc(50vw-50%+min(92%,624px))] md:h-[46svh]">
              <Image
                src={`/images/journey/${PLATE}.webp`}
                alt={photo.alt}
                fill
                sizes="(min-width: 768px) 720px, 100vw"
                className="k-s08-photo object-cover"
                style={{ objectPosition: "42% 60%" }}
              />
              <span aria-hidden="true" className="k-s08-scrim absolute inset-0" />
            </div>
          </div>

          <ol className="relative">
            {copy.statements.slice(3).map((text, i) => (
              <StatementRow key={text} text={text} s={DESIGN[Math.min(i + 3, DESIGN.length - 1)]} />
            ))}
            {/* THE QUESTION. The largest type in the scene, home at the left
                edge, broken where he broke it. */}
            <li data-lit className="k-jl mt-[6svh]" style={{ "--lit-floor": "0.55" } as React.CSSProperties}>
              <p className="max-w-[18ch] font-display text-[clamp(1.75rem,4vw,3.375rem)] font-black leading-[1.08] tracking-[-0.02em]">
                {copy.questionA}
                <br />
                {copy.questionB}
              </p>
            </li>
          </ol>
        </div>

        {/* THE LESSON DOES NOT RIDE THE ROAD. The motion of the column stops,
            and the stillness is the punctuation. */}
        <div className="mx-auto mt-[10svh] flex max-w-[30ch] flex-col items-center gap-4 text-center">
          <span aria-hidden="true" className="h-px w-16" style={{ background: gold ?? "currentColor" }} />
          <p className="font-text text-[clamp(1.125rem,2vw,1.75rem)] leading-[1.4]">
            {copy.lessonA}
            <br />
            {copy.lessonB}
          </p>
        </div>
      </div>

      <Furniture scene={SCENE} plateFile={PLATE} />
    </section>
  );
}

function StatementRow({
  text,
  s,
}: {
  text: string;
  s: { inset: number; pair?: boolean; resolve?: boolean };
}) {
  return (
    <li
      data-lit
      className="k-jl mt-[4.5svh] first:mt-0"
      style={
        {
          "--lit-floor": "0.55",
          // The bend. Insets collapse to a shallower step on small screens,
          // where 264px of indent would push a sentence off the page.
          paddingLeft: `clamp(${Math.round(s.inset * 0.28)}px, ${(s.inset / 1296) * 100}vw, ${s.inset}px)`,
        } as React.CSSProperties
      }
    >
      <p
        className={
          s.resolve
            ? "max-w-[24ch] font-text text-[clamp(1.25rem,2.3vw,2rem)] font-semibold leading-[1.3]"
            : s.pair
              ? "max-w-[24ch] font-text text-[clamp(1.25rem,2.3vw,2rem)] leading-[1.3]"
              : "max-w-[26ch] font-text text-[clamp(1.375rem,2.6vw,2.25rem)] leading-[1.3]"
        }
      >
        {text}
      </p>
    </li>
  );
}
