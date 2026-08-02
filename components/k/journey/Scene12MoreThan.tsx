"use client";

import { useState } from "react";
import { SCENES, inkFor } from "@/lib/journey-spine";
import Furniture from "./Furniture";
import { useStageProgress } from "./useStageProgress";

/**
 * SCENE 12 — MORE THAN A BUSINESS.
 *
 * ============================================================================
 * THE ONLY SCENE WHOSE STYLESHEET CONTAINS NO TRANSFORM
 * ============================================================================
 * Reference: Savor's pinned statement, where a very short text is trusted to
 * hold a whole screen. Everything Savor does to keep the frame alive (the
 * drifting ground) is exactly what is forbidden here: this is the first
 * moment of the film with no movement at all.
 *
 * The entire page of writing is already on screen when you arrive, laid out
 * at its final size and position, at a low ink. Nothing enters, nothing
 * travels, nothing reflows. Scroll does one thing only: it raises the light
 * on the paragraph, clause by clause. The film's whole light arc, performed
 * once at the scale of a single page of writing, in the scene right after
 * the sunrise.
 *
 * THE MECHANIC THAT MEANS SOMETHING: b2 is the question he outgrew. It comes
 * to full ink, holds alone, then falls back to 0.30 and STAYS on the page.
 * "I stopped asking X" does not mean X was deleted; it means it was outgrown,
 * and the old question is still faintly under the new one when you leave.
 *
 * ============================================================================
 * THE VISIBILITY CONTRACT, WHICH THIS SCENE MUST GET EXACTLY RIGHT
 * ============================================================================
 * The server renders every beat at opacity 1 and full ink. The dimming rule
 * is scoped to `.is-armed`, which useStageProgress adds only once it is
 * certainly running, and the driver writes exactly one custom property per
 * frame, --s12-p; each beat computes its own opacity from it in CSS. No
 * script, failed script, reduced motion: the reader gets the finished page.
 * (components/k/PinnedStatement.tsx does this the wrong way round, rendering
 * dim from the server; the review flagged it and it must not be copied.)
 *
 * The ghost floor is 0.30, per the review's instruction, and the ghosts are
 * transient: every word reaches full ink before the reader is expected to
 * read it, and prefers-contrast: more, reduced motion, no-JS and the SHOW
 * FULL STATEMENT control all render the page at full ink immediately.
 *
 * THE PAUSE. For a stretch of wheel between b7 and b9 nothing on screen
 * changes at all. That is what "(long pause)" means. The beat counter in the
 * furniture strap reads PAUSE for exactly that stretch: a clock ticking in a
 * silent room is what makes stillness read as held rather than broken.
 */

const SCENE = SCENES[11];

/** Where each beat's light comes up, as fractions of the pinned travel. */
const RAMPS = {
  b1: { in: 0.0, out: 0.045 },
  b2: { in: 0.07, out: 0.15 },
  b3: { in: 0.4, out: 0.445 },
  b4: { in: 0.47, out: 0.575 },
  b5: { in: 0.6, out: 0.645 },
  b6: { in: 0.66, out: 0.705 },
  b7: { in: 0.73, out: 0.775 },
  b9: { in: 0.895, out: 0.965 },
  close: { in: 0.955, out: 0.995 },
} as const;

/** The counter's switch points, derived from the same table. */
const COUNTER: ReadonlyArray<{ at: number; label: string }> = [
  { at: 0, label: "Beat 01 / 09" },
  { at: RAMPS.b2.in, label: "Beat 02 / 09" },
  { at: RAMPS.b3.in, label: "Beat 03 / 09" },
  { at: RAMPS.b4.in, label: "Beat 04 / 09" },
  { at: RAMPS.b5.in, label: "Beat 05 / 09" },
  { at: RAMPS.b6.in, label: "Beat 06 / 09" },
  { at: RAMPS.b7.in, label: "Beat 07 / 09" },
  { at: 0.775, label: "Pause" },
  { at: RAMPS.b9.in, label: "Beat 09 / 09" },
];

function beatVars(key: keyof typeof RAMPS): React.CSSProperties {
  return { "--in": String(RAMPS[key].in), "--out": String(RAMPS[key].out) } as React.CSSProperties;
}

export default function Scene12MoreThan() {
  const [counter, setCounter] = useState(COUNTER[COUNTER.length - 1].label);
  const [full, setFull] = useState(false);

  const { trackRef, stageRef } = useStageProgress((p, stage) => {
    stage.style.setProperty("--s12-p", p.toFixed(4));
    // The only state change in the scene. It substitutes instantly, no
    // crossfade: a crossfade would be motion, and this scene has none.
    let label = COUNTER[0].label;
    for (const step of COUNTER) if (p >= step.at) label = step.label;
    setCounter((prev) => (prev === label ? prev : label));
  });

  const ink = inkFor(SCENE);

  return (
    <section
      id={SCENE.slug}
      ref={trackRef as React.RefObject<HTMLElement>}
      aria-labelledby={`${SCENE.slug}-heading`}
      className="relative"
      data-full={full ? "on" : undefined}
      style={{
        height: `${SCENE.vh}svh`,
        background: `linear-gradient(180deg, ${SCENE.from} 0%, ${SCENE.to} 100%)`,
        color: ink,
      }}
    >
      <div ref={stageRef} className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-[1296px] grid-cols-1 gap-x-10 px-5 md:grid-cols-[200px_1fr] md:px-10 lg:px-24">
          {/* THE MARGINALIA. Stage directions in his own voice, hung in the
              margin like a documentary page rather than stacked. */}
          <p data-s12 className="k-s12-beat self-start font-text text-[clamp(0.9375rem,1.3vw,1.25rem)] leading-[1.5] md:text-right" style={beatVars("b1")}>
            There came a moment when I stopped asking:
          </p>
          <h2
            id={`${SCENE.slug}-heading`}
            data-s12
            className="k-s12-beat k-s12-b2 font-display text-[clamp(1.625rem,3.4vw,3rem)] font-medium leading-[1.14] tracking-[-0.015em]"
            style={beatVars("b2")}
          >
            what kind of business do I want to own?
          </h2>

          <p data-s12 className="k-s12-beat mt-[5svh] self-start font-text text-[clamp(0.9375rem,1.3vw,1.25rem)] leading-[1.5] md:text-right" style={beatVars("b3")}>
            I began asking a different question.
          </p>
          {/* The new question: larger and heavier than the one it replaced.
              That difference is the argument. */}
          <p
            data-s12
            className="k-s12-beat mt-[5svh] font-display text-[clamp(2rem,4.4vw,3.875rem)] font-black leading-[1.08] tracking-[-0.02em]"
            style={beatVars("b4")}
          >
            What kind of company deserves to exist?
          </p>

          <div aria-hidden="true" className="hidden md:block" />
          <div className="mt-[6svh]">
            {/* The matched pair shares an indent; the operative nouns carry
                weight, never colour, because colour is unavailable here. */}
            <p data-s12 className="k-s12-beat pl-6 font-text text-[clamp(1rem,1.5vw,1.375rem)] leading-[1.5] md:pl-12" style={beatVars("b5")}>
              A company built on <strong className="font-semibold">honesty</strong>, when honesty
              costs something.
            </p>
            <p data-s12 className="k-s12-beat mt-2 pl-6 font-text text-[clamp(1rem,1.5vw,1.375rem)] leading-[1.5] md:pl-12" style={beatVars("b6")}>
              A company built on <strong className="font-semibold">integrity</strong>, even when no
              one is watching.
            </p>
            {/* The un-indent is the turn in the argument, made structural. */}
            <p data-s12 className="k-s12-beat mt-[4svh] font-text text-[clamp(1rem,1.5vw,1.375rem)] leading-[1.5]" style={beatVars("b7")}>
              I wasn&rsquo;t trying to build a trucking company.
            </p>
            <p
              data-s12
              className="k-s12-beat mt-[4svh] max-w-[26ch] font-display text-[clamp(1.5rem,3vw,2.625rem)] font-medium leading-[1.16] tracking-[-0.015em]"
              style={beatVars("b9")}
            >
              I was trying to build something people could believe in.
            </p>
            <p data-s12 className="k-s12-beat mt-[4svh] font-text text-[clamp(1rem,1.5vw,1.375rem)] leading-[1.5]" style={beatVars("close")}>
              The strongest foundation isn&rsquo;t concrete.{" "}
              <strong className="font-semibold">It&rsquo;s character.</strong>
            </p>
          </div>
        </div>

        {/* THE ESCAPE HATCH, visible rather than buried in a media query. A
            reader who does not want to be held in a pin gets an immediate,
            dignified way out, and the corner where a plate number would sit
            is not left empty or apologised for. */}
        {!full ? (
          <button
            type="button"
            onClick={() => setFull(true)}
            className="absolute bottom-16 right-5 font-display text-[11px] font-medium uppercase tracking-[0.1em] underline decoration-1 underline-offset-[3px] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current md:bottom-20 md:right-10"
          >
            Show full statement
          </button>
        ) : null}

        <Furniture
          scene={SCENE}
          middle={<span className="tabular-nums">{full ? "09 beats" : counter}</span>}
        />
      </div>
    </section>
  );
}
