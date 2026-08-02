"use client";

import { SCENES, inkFor, goldFor } from "@/lib/journey-spine";
import Furniture from "./Furniture";
import { useStageProgress, span, lerp } from "./useStageProgress";

/**
 * SCENE 07 — FORGED THROUGH DISCIPLINE.
 *
 * No photograph exists of the Air Force years and none may be invented. This is
 * the scene where type alone carries a whole beat, and it is the act curtain
 * for everything before the road.
 *
 * ============================================================================
 * THE FOCAL IDEA: THE TYPE IS DISCIPLINED IN FRONT OF YOU
 * ============================================================================
 * Reference: KODE Immersive, where enormous display type filling the viewport
 * edge to edge IS the composition, with no image and nothing to support it.
 *
 * But the borrowed geometry is not the idea. The idea is this:
 *
 *   "Every day became another opportunity to become a little stronger than the
 *    day before."
 *
 * So the three words he names, CONSISTENCY, ACCOUNTABILITY, COMMITMENT, do not
 * fade in, rise, wipe or stagger. They are DRILLED. Each one begins wide, thin
 * and slack, and as you scroll it is compressed: the width axis closes from 125
 * down to 62 and the weight climbs from 200 to 900, so the word physically
 * narrows and thickens into something dense and load-bearing. The same word,
 * made stronger, exactly as he describes.
 *
 * ============================================================================
 * WHY THIS NEEDS A VARIABLE FONT AND CANNOT BE FAKED
 * ============================================================================
 * The obvious cheat is transform: scaleX(), and it is wrong. Squashing a glyph
 * horizontally thins its vertical stems and fattens its horizontals, which is
 * precisely the distortion the `wdth` axis exists to avoid: a real condensed
 * cut redraws the letterform and keeps stem weight true. Anyone who sets type
 * for a living sees the difference instantly, and on a page arguing for
 * craftsmanship it would be the wrong lie to tell.
 *
 * So this needs the real axis, which needed app/layout.tsx to stop requesting
 * static instances of Archivo. See the note there. The width axis is also the
 * axis the KUL wordmark itself lives on, so this scene is set in the same
 * material as the company's own mark.
 *
 * ============================================================================
 * THE COST, HONESTLY
 * ============================================================================
 * font-variation-settings is a layout property: changing it reflows the text.
 * That is normally disqualifying for anything scroll-driven, and it is why this
 * treatment is spent on THREE WORDS on three separate lines and nothing else.
 * Each word reflows only itself, nothing below it moves, and the rest of the
 * scene is untouched. Do not extend this to a paragraph.
 */

const SCENE = SCENES[6];

/** His words, edited at /admin. The drill needs its three words separate. */
export type Scene07Copy = {
  lead: string;
  drilled: string[];
  couplet: string;
};

export default function Scene07Discipline({ copy }: { copy: Scene07Copy }) {
  const { trackRef, stageRef } = useStageProgress((p, stage) => {
    // Each word is compressed over its own window, overlapping the next, so the
    // three read as a sequence of repetitions rather than one group move.
    for (let i = 0; i < 3; i++) {
      const t = span(p, 0.08 + i * 0.16, 0.34 + i * 0.16);
      // Rounded hard: font-variation-settings reflows, so it must only change
      // when it visibly should, not on every scroll tick.
      stage.style.setProperty(`--s07-w${i}`, String(Math.round(lerp(125, 62, t))));
      stage.style.setProperty(`--s07-b${i}`, String(Math.round(lerp(200, 900, t) / 25) * 25));
    }

    // The closing couplet arrives only once the drilling is finished. It is the
    // conclusion drawn from it, so it must not share the screen with the work.
    stage.style.setProperty("--s07-close", span(p, 0.62, 0.86).toFixed(3));
  });

  const ink = inkFor(SCENE);
  const gold = goldFor(SCENE);

  return (
    <section
      id={SCENE.slug}
      ref={trackRef as React.RefObject<HTMLElement>}
      aria-labelledby="discipline-heading"
      // overflow-x-clip: the drilled words begin at wdth 125, wide and slack,
      // and the widest can stand past a phone's edge until the scroll
      // compresses it. clip (not hidden) so no scroll container is created.
      className="relative overflow-x-clip"
      style={{
        height: `${SCENE.vh}svh`,
        background: `linear-gradient(180deg, ${SCENE.from} 0%, ${SCENE.to} 100%)`,
        color: ink,
      }}
    >
      <div
        ref={stageRef}
        className="k-cine flex h-full flex-col justify-center px-5 md:px-10 lg:px-24"
      >
        <div className="mx-auto w-full max-w-[1296px]">
          <h2
            id="discipline-heading"
            className="max-w-[30ch] font-text text-[clamp(1.0625rem,1.7vw,1.5rem)] font-normal leading-[1.4]"
          >
            {copy.lead}
          </h2>

          {/* THE DRILL. Three words, each compressed into strength. Set flush
              left on their own lines so a width change moves nothing but the
              word itself. */}
          <ul className="mt-[6svh] flex flex-col gap-[0.4svh]">
            {copy.drilled.map((word, i) => (
              <li
                key={word}
                className="k-s07-drill w-fit font-display uppercase leading-[0.94] tracking-[-0.01em]"
                style={
                  {
                    fontSize: "clamp(2.25rem, 9vw, 8rem)",
                    fontVariationSettings: `'wdth' var(--s07-w${i}, 62), 'wght' var(--s07-b${i}, 900)`,
                  } as React.CSSProperties
                }
              >
                {word}
              </li>
            ))}
          </ul>

          {/* The conclusion. It has no drill of its own: the point has been
              made by the three words above and repeating the device here would
              turn an argument into a mannerism. */}
          <div className="k-s07-close mt-[7svh] flex max-w-[46ch] flex-col gap-4">
            <p
              aria-hidden="true"
              className="h-px w-16 shrink-0"
              style={{ background: gold ?? "currentColor" }}
            />
            <p className="font-text text-[clamp(1.0625rem,1.7vw,1.5rem)] leading-[1.45]">
              {copy.couplet}
            </p>
          </div>
        </div>
      </div>

      <Furniture scene={SCENE} />
    </section>
  );
}
