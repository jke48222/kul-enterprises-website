"use client";

import { SCENES, inkFor, goldFor } from "@/lib/journey-spine";
import Furniture from "./Furniture";
import { useLit } from "./useLit";

/**
 * SCENE 03 — LEARNING THE VALUE OF WORK.
 *
 * ============================================================================
 * WHY THERE IS NO PHOTOGRAPH HERE, AND WHY THERE MUST NEVER BE ONE
 * ============================================================================
 * The original spec illustrated this scene with jobsite-fixtures, jobsite-install
 * and jobsite-bay. Those photographs are from 2021 and 2022: Mark as an adult,
 * running a business. This scene is the 1990s. Putting them here would use a
 * grown man's work record to stand in for a boy's summers, which is a lie about
 * his childhood on the one page whose whole argument is that nothing on it is
 * invented. The coherence review (project-docs/24) called it the most serious
 * finding in the document.
 *
 * No photograph of those summers exists. So the scene is type only, and the
 * absence is stated the way the page always states it: the furniture strap
 * simply carries no plate. The 2021-22 photographs live where they are honest,
 * in scene 9, which is actually about his working life.
 *
 * ============================================================================
 * THE DEVICE: A LEDGER OF THREE SUMMERS
 * ============================================================================
 * What survives from the spec is its best idea, which never needed the
 * photographs: the triplet. "Every school break. Every holiday. Every
 * vacation." is a ledger entry, so it is set as one: counted in the margin in
 * the site's voice, ruled in gold, the rule filling top to bottom as you read
 * the three lines. The rhythm is built into the SPACING, not into a timer;
 * the tight 28px internal gaps against the long gaps around them are what make
 * the three land as beats, and that survives with every animation off.
 *
 * The lines light one at a time as you reach them (see useLit.ts for the
 * visibility contract). The unreached floor is 0.55, which is 6.1:1 on this
 * ground: every state of every word clears AA, so the dimming is a reading
 * aid, never a reveal.
 */

const SCENE = SCENES[2];

/** His narration, in his order, edited at /admin. */
export type Scene03Copy = {
  opening: string[];
  turnA: string;
  turnB: string;
  triplet: string[];
  father: string;
  coupletA: string;
  coupletB: string;
  lesson: string;
};

export default function Scene03Work({ copy }: { copy: Scene03Copy }) {
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
        // min-height rather than height: the ramp is a gradient between two
        // fixed colours, so a section that grows for its content on a phone
        // stretches the ramp without ever breaking a seam.
        minHeight: `${SCENE.vh}svh`,
        background: `linear-gradient(180deg, ${SCENE.from} 0%, ${SCENE.to} 100%)`,
        color: ink,
      }}
    >
      <div className="mx-auto w-full max-w-[1296px] px-5 py-[16svh] pb-[22svh] md:px-10 lg:px-24">
        {/* THE ARRIVAL. Three short declaratives, quiet, plain. */}
        <div className="max-w-[30ch]">
          {copy.opening.map((line) => (
            <p
              key={line}
              data-lit
              className="k-jl font-text text-[clamp(1.0625rem,1.7vw,1.5rem)] leading-[1.5]"
            >
              {line}
            </p>
          ))}
        </div>

        {/* THE TURN. The pair that sets up the ledger. */}
        <h2
          id={`${SCENE.slug}-heading`}
          data-lit
          className="k-jl mt-[9svh] max-w-[24ch] font-display text-[clamp(1.75rem,4.2vw,3.5rem)] font-black leading-[1.06] tracking-[-0.02em]"
        >
          {copy.turnA}
        </h2>
        <p
          data-lit
          className="k-jl mt-4 max-w-[24ch] font-display text-[clamp(1.75rem,4.2vw,3.5rem)] font-black leading-[1.06] tracking-[-0.02em]"
        >
          {copy.turnB}
        </p>

        {/* THE LEDGER. Counted in the site's voice, ruled in gold, his words
            on the lines. The gold hairline spans exactly the triplet and no
            more: it is a rule beside an entry, not a decoration. */}
        <div className="relative mt-[9svh] w-fit pl-9 md:pl-12">
          <span
            aria-hidden="true"
            className="k-s03-rule absolute left-0 top-1 bottom-1 w-px"
            style={{ background: gold ?? "currentColor" }}
          />
          <ul className="flex flex-col gap-[14px]">
            {copy.triplet.map((line, i) => (
              <li key={line} data-lit className="k-jl flex items-baseline gap-5">
                <span
                  className="w-6 shrink-0 font-display text-[11px] font-medium uppercase tabular-nums tracking-[0.1em]"
                  style={{ color: gold ?? "currentColor" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-text text-[clamp(1.125rem,1.9vw,1.625rem)] leading-[1.4] tracking-[0.01em]">
                  {line}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p
          data-lit
          className="k-jl mt-[9svh] max-w-[30ch] font-text text-[clamp(1.0625rem,1.7vw,1.5rem)] leading-[1.5]"
        >
          {copy.father}
        </p>

        {/* THE CONCLUSION HE DREW. A couplet, then the lesson, closed with a
            rule rather than a label: this page varies its endings on purpose,
            because thirteen identical LESSON cards read as a template. */}
        <div className="mt-[9svh] max-w-[36ch]">
          <p data-lit className="k-jl font-text text-[clamp(1.0625rem,1.7vw,1.5rem)] leading-[1.45]">
            {copy.coupletA}
          </p>
          <p data-lit className="k-jl font-text text-[clamp(1.0625rem,1.7vw,1.5rem)] font-semibold leading-[1.45]">
            {copy.coupletB}
          </p>
        </div>

        <div className="mt-[7svh] flex max-w-[44ch] flex-col gap-4">
          <p
            aria-hidden="true"
            className="h-px w-24 shrink-0"
            style={{ background: gold ?? "currentColor" }}
          />
          <p className="font-text text-[clamp(1.125rem,2vw,1.75rem)] leading-[1.4]">
            {copy.lesson}
          </p>
        </div>
      </div>

      <Furniture scene={SCENE} />
    </section>
  );
}
