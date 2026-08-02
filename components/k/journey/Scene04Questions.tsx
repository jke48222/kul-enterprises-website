"use client";

import Image from "next/image";
import { SCENES, inkFor, goldFor, plate } from "@/lib/journey-spine";
import Furniture from "./Furniture";
import { useLit } from "./useLit";

/**
 * SCENE 04 — SEEING THE WORLD DIFFERENTLY.
 *
 * ============================================================================
 * THE IDEA: THE RHYTHM IS AUTHORED AS WHITESPACE, NOT AS TIMING
 * ============================================================================
 * Reference: Microsoft AI's stacked statements, where the non-current lines
 * stay fully legible and the current one is distinguished by a lift rather
 * than an entrance. Nothing arrives; something is attended to.
 *
 * What was NOT taken is its driver. Their stack advances on a uniform stepped
 * index, evenly spaced, which reads as a carousel. Here the interval between
 * lines is set by deliberately UNEQUAL vertical gaps, and the reader's own
 * scroll supplies the tempo. Read the gaps: the pair arrives quickly, the
 * pause before "Curiosity doesn't always give you immediate answers." is a
 * third of a screen of empty ground, and "Sometimes…" lands hard on its heels.
 * The layout encodes the rhythm; the reader plays it. That is why the scene
 * survives with all motion off: the pacing is in the pixels, not the clock.
 *
 * UNDER EACH LINE, A RULE OPENS MORE ROAD THAN THE LAST. The lengths grow with
 * each question and the final one runs off the edge of the frame: the fifth
 * question has no end on this page. They draw at a constant physical velocity
 * when the line lights, so a longer thought takes longer to draw; their
 * resting state in the stylesheet is fully drawn.
 *
 * The lines light one-way at a 0.52 floor, which is 5.6:1 on this ground:
 * every sentence of Mark's clears normal-text AA at every moment of the
 * scroll, including a stalled one.
 */

const SCENE = SCENES[3];

/**
 * The stack. Gap is the space ABOVE each line, in svh, and it is the design:
 * quick, quick, pause, hard on its heels, then the answer.
 * Rule is each line's road, growing until the last leaves the frame.
 */
const DESIGN = [
  { gap: 0, rule: "72px", ms: 65 },
  { gap: 7, rule: "160px", ms: 145 },
  { gap: 10, rule: "280px", ms: 255 },
  { gap: 26, rule: "420px", ms: 382 },
  { gap: 5, rule: "560px", ms: 509 },
  { gap: 4, rule: "80vw", ms: 1000 },
] as const;

/** His words, edited at /admin; the gaps and rule lengths above are design. */
export type Scene04Copy = {
  leadA: string;
  leadB: string;
  stack: string[];
  lesson: string;
};

const PLATE = "s04-dawn-road-mist";

export default function Scene04Questions({ copy }: { copy: Scene04Copy }) {
  const rootRef = useLit<HTMLElement>();
  const ink = inkFor(SCENE);
  const gold = goldFor(SCENE);
  const photo = plate(PLATE);

  return (
    <section
      id={SCENE.slug}
      ref={rootRef}
      aria-labelledby={`${SCENE.slug}-heading`}
      className="relative overflow-hidden"
      style={{
        minHeight: `${SCENE.vh}svh`,
        background: `linear-gradient(180deg, ${SCENE.from} 0%, ${SCENE.to} 100%)`,
        color: ink,
      }}
    >
      {/* THE GROUND IS THE PHOTOGRAPH NOW. The screenplay sets this scene on
          a "quiet road to horizon", and this is that road: full bleed,
          graded down into the pre-dawn ramp, feathered top and bottom so the
          sunrise passes through it unbroken, drifting slowly as the scene
          crosses the viewport. The questions sit over a scrim column
          measured against the scene's own ground colour, so every lit-floor
          contrast sum still holds against known pixels. The first cut kept
          this photograph as a small plate at the foot of a text column, and
          the client read the scene as a slide. */}
      <div aria-hidden="true" className="absolute inset-0">
        <Image
          src={`/images/journey/${PLATE}.webp`}
          alt=""
          fill
          sizes="100vw"
          className="k-s04-ground k-parallax object-cover"
          style={{ objectPosition: "50% 60%" }}
        />
        <div className="k-s04-scrim absolute inset-0" />
      </div>
      {/* The real caption for ears; the visible frame is presentation. */}
      <p className="sr-only">{photo.alt}</p>

      {/* Nothing is centred. The whole scene hangs off one left edge, like a
          page of notes. */}
      <div className="k-cine relative mx-auto w-full max-w-[1296px] px-5 py-[14svh] pb-[20svh] md:px-10 lg:px-24">
        <div className="max-w-[26ch]">
          <p data-lit className="k-jl font-text text-[clamp(1.0625rem,1.7vw,1.5rem)] leading-[1.5]">
            {copy.leadA}
          </p>
          <h2
            id={`${SCENE.slug}-heading`}
            data-lit
            className="k-jl font-text text-[clamp(1.0625rem,1.7vw,1.5rem)] leading-[1.5]"
          >
            {copy.leadB}
          </h2>
        </div>

        {/* THE STACK. Each line is prose, not a control: no tab stops, no
            ARIA, five sentences in reading order. Hover lighting rides the
            same one-way class the scroll uses, desktop pointers only. */}
        <ol className="mt-[10svh]">
          {copy.stack.map((text, i) => {
            const line = DESIGN[Math.min(i, DESIGN.length - 1)];
            return (
            // The line and its rule light as ONE unit, so the floor opacity
            // and the draw can never disagree about which state they are in.
            <li
              key={text}
              data-lit
              className="k-jl"
              style={
                {
                  marginTop: `${line.gap}svh`,
                  "--lit-floor": "0.52",
                  // Constant physical velocity: every rule draws at roughly
                  // 1100px per second, so a longer thought takes longer to
                  // draw. The duration is the width, not a house style.
                  "--k-s04-dur": `${line.ms}ms`,
                } as React.CSSProperties
              }
            >
              <p className="k-s04-line max-w-[24ch] font-display text-[clamp(1.375rem,2.9vw,2.5rem)] font-medium leading-[1.2] tracking-[-0.01em] md:max-w-none">
                {text}
              </p>
              {/* The road this question opened. Decoration, drawn from the
                  left when its line lights; already drawn if the script never
                  runs. */}
              <span
                aria-hidden="true"
                className="k-s04-rule mt-3 block h-px origin-left"
                // The long rules are meant to leave the frame, not to widen
                // it: capped at the container plus its own right padding, so
                // the last one reaches the viewport edge exactly and nothing
                // ever creates a horizontal scroll on a phone.
                style={{ width: line.rule, maxWidth: "calc(100% + 20px)", background: gold ?? "currentColor", opacity: 0.7 }}
              />
            </li>
            );
          })}
        </ol>

        {/* THE LESSON. Its gold mark hangs to the LEFT of the first word, in
            the gutter: a beginning mark, not an underline, because the line is
            about where roads start. */}
        <div className="relative mt-[12svh] max-w-[30ch] pl-9 md:pl-12">
          <span
            aria-hidden="true"
            className="absolute left-0 top-[0.6em] h-px w-6"
            style={{ background: gold ?? "currentColor" }}
          />
          <p className="font-text text-[clamp(1.25rem,2.2vw,2rem)] leading-[1.35]">
            {copy.lesson}
          </p>
        </div>
      </div>

      <Furniture scene={SCENE} plateFile={PLATE} />
    </section>
  );
}
