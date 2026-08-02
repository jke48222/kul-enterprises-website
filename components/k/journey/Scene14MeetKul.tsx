"use client";

import Image from "next/image";
import { SCENES, plate, plateLabel, inkFor, goldFor } from "@/lib/journey-spine";
import Furniture from "./Furniture";
import { useStageProgress, span, lerp } from "./useStageProgress";

/**
 * SCENE 14 — MEET KUL.
 *
 * The payoff. Everything before this has been a man telling you how he got
 * here; this is the moment the company is named and you finally see his face.
 *
 * ============================================================================
 * THE MOTION: THREE THINGS TRAVEL AND STOP AGAINST ONE THAT NEVER MOVED
 * ============================================================================
 * Reference: Ragged Edge, where a lockup is presented alone on a flat field at
 * very large scale, with the mark tucked hard enough against the wordmark that
 * the two read as one settled object rather than two things placed near each
 * other, and the nerve to leave the surrounding field genuinely, uncomfortably
 * empty so the arrival has somewhere to land.
 * https://mobbin.com/sites/sections/0162a9ba-2ce1-49f4-b599-e8a016dd7d75
 *
 * Not taken from it: the centring, the whimsy, and the fact that nothing else
 * exists on their page. This one is left-anchored and has to carry a
 * photograph and the archival furniture in the same field.
 *
 * Mark's line is "Every mile. Every lesson. Every decision. Led here." Three of
 * those fragments start displaced and travel a long way into position. "Led
 * here." has no keyframes at all: it is the only resolved thing on screen from
 * the very first frame and it never moves once.
 *
 * That is the whole argument of the scene. Three things travelled a long way
 * and came to rest against a destination that was already standing there. It
 * is the only scene of the seventeen whose climax is an object coming to rest
 * rather than an element appearing.
 *
 * ============================================================================
 * THE PORTRAIT
 * ============================================================================
 * A real studio headshot, supplied by the client. It replaces the backstage
 * phone snapshot this scene was built around, which was lit by a red stage lamp
 * and needed a display grade just to sit inside the page's own light. That one
 * is still in the register as PL. 31 and 32, because it is genuinely part of
 * the archive and scene 11 answers "Drivers." with it, but it is not a portrait
 * and should not be used as one.
 *
 * NO GRADE ON THIS FILE AT ALL. It arrives correctly exposed on a neutral grey
 * that already sits inside this scene's own ground, so anything applied here
 * would be interference rather than correction. The rule the project has always
 * held still holds: the file is untouched and no pixel of his face is ever
 * reconstructed.
 *
 * IT IS A WINDOW AND NOT FULL BLEED, and that survives the swap. The face
 * arriving at reading size, beside the mark, is the payoff this page has spent
 * thirteen scenes earning. Blown across the viewport it would stop being a
 * portrait and start being a stock hero.
 *
 * The source is 1122x1402, which is 4:5, and the window is 330x412, which is
 * also 4:5. So object-cover crops essentially nothing and the photographer's
 * own framing is what you see.
 */

const SCENE = SCENES[13];
const PORTRAIT = "mark-portrait";

/**
 * Mark's line, split where he wrote the full stops.
 *
 * Each fragment starts a long way off in its own direction, so the three do not
 * read as a group sliding in together. They are separate journeys ending in the
 * same place, which is what the sentence says.
 */
const OFFSETS = [
  { dx: -318, dy: -112 },
  { dx: 292, dy: 96 },
  { dx: -96, dy: 178 },
] as const;

/** His words, edited at /admin; the travel vectors above are design. */
export type Scene14Copy = {
  fragments: string[];
  led: string;
  say: string;
  welcome: string;
  portraitName: string;
};

export default function Scene14MeetKul({ copy }: { copy: Scene14Copy }) {
  const { trackRef, stageRef } = useStageProgress((p, stage) => {
    // Each fragment arrives over its own window, overlapping the next by a
    // couple of points so the three do not tick like a metronome.
    stage.style.setProperty("--s14-f1", span(p, 0.1, 0.22).toFixed(3));
    stage.style.setProperty("--s14-f2", span(p, 0.2, 0.32).toFixed(3));
    stage.style.setProperty("--s14-f3", span(p, 0.3, 0.42).toFixed(3));

    // NOTHING RECEDES ON THIS SCENE. An earlier version shrank the assembled
    // sentence away to the left margin to uncover the nameplate underneath.
    // That was wrong: the sentence is the conclusion of the whole page, and
    // taking it off screen the moment it finishes assembling throws away the
    // thing the scene exists to say. It arrives, and then it stays there while
    // the lockup settles in beneath it.

    // EVERYTHING ELSE ARRIVES FROM FULLY TRANSPARENT, in three overlapping
    // beats rather than one, so the portrait, the mark and his line do not all
    // land on the same frame. Settle is the word for all three: they come up a
    // short distance and stop. Nothing on this scene overshoots.
    stage.style.setProperty("--s14-portrait", span(p, 0.46, 0.68).toFixed(3));
    stage.style.setProperty("--s14-mark", span(p, 0.56, 0.78).toFixed(3));
    stage.style.setProperty("--s14-say", span(p, 0.66, 0.88).toFixed(3));
  });

  const port = plate(PORTRAIT);
  const ink = inkFor(SCENE);
  // null on scenes that cannot carry gold at all. See the gold note in the spine.
  const gold = goldFor(SCENE);

  return (
    <section
      id={SCENE.slug}
      ref={trackRef as React.RefObject<HTMLElement>}
      aria-labelledby="meet-kul-heading"
      className="relative"
      style={{
        height: `${SCENE.vh}svh`,
        background: `linear-gradient(180deg, ${SCENE.from} 0%, ${SCENE.to} 100%)`,
        color: ink,
      }}
    >
      {/* isolate, so the scene composites against its own ground and never
          against the scene above it. */}
      <div
        ref={stageRef}
        className="k-s14-stage sticky top-0 h-[100svh] overflow-hidden [isolation:isolate]"
      >
        <div className="flex h-full flex-col justify-center px-5 md:px-10 lg:px-24">
          <div className="mx-auto w-full max-w-[1296px]">
            {/* THE SENTENCE. Assembles, holds, then retreats to the left
                margin to uncover the nameplate. */}
            <p className="k-s14-sentence flex flex-wrap items-baseline gap-x-[18px] gap-y-1 font-text text-[clamp(1.5rem,4vw,4rem)] font-normal leading-[1.15] tracking-[-0.006em]">
              {copy.fragments.map((text, i) => {
                const f = OFFSETS[Math.min(i, OFFSETS.length - 1)];
                return (
                <span
                  key={text}
                  className="k-s14-frag"
                  style={
                    {
                      "--dx": `${f.dx}px`,
                      "--dy": `${f.dy}px`,
                      "--t": `var(--s14-f${i + 1}, 1)`,
                    } as React.CSSProperties
                  }
                >
                  {text}
                </span>
                );
              })}
              {/* NO KEYFRAMES, EVER. This is the destination that was already
                  standing there. Do not give it an entrance. */}
              <span className="font-semibold">{copy.led}</span>
            </p>

            {/* THE LOCKUP. Portrait left, nameplate and his greeting right. */}
            <div className="mt-10 grid grid-cols-1 gap-8 md:mt-14 lg:grid-cols-[330px_1fr] lg:gap-14">
              <figure className="k-s14-rise w-full max-w-[330px]" style={{ "--t": "var(--s14-portrait, 1)" } as React.CSSProperties}>
                <div className="relative aspect-[330/412] w-full overflow-hidden">
                  <Image
                    src={`/images/journey/${PORTRAIT}.webp`}
                    alt={port.alt}
                    fill
                    sizes="330px"
                    // No filter. See the note at the top of this file: this
                    // frame does not need rescuing and touching it would only
                    // move it away from what the photographer delivered.
                    className="object-cover"
                  />
                </div>
                {/* The one dark element on a light scene. It is the caption
                    bar, so it reads as a label fixed to the print. */}
                <figcaption
                  className="flex items-center justify-between gap-4 px-3 py-3 font-display text-[11px] font-medium uppercase tracking-[0.1em]"
                  style={{ background: ink, color: "#FCFCFC" }}
                >
                  <span className="tabular-nums">{plateLabel(PORTRAIT)}</span>
                  <span>{port.when ? `Mark Brown · ${port.when}` : copy.portraitName}</span>
                </figcaption>
              </figure>

              <div className="flex flex-col justify-center">
                {/* A nameplate, not speech, so it is correctly sans. */}
                <h2 id="meet-kul-heading" className="k-s14-rise max-w-[320px]" style={{ "--t": "var(--s14-mark, 1)" } as React.CSSProperties}>
                  {/* THE REAL MARK IN FULL COLOUR, not the name set in Archivo
                      and not the flat ink version. This is the client's own
                      full-color-transparent-bg artwork, and it is the one file
                      in the supplied kit that is genuinely transparent: all
                      four corners sample rgba(0,0,0,0), where the rest of the
                      kit is opaque on a flat black or white field and shows a
                      visible box on any ground.

                      It is NOT trimmed. trim() has cropped into the lion and cut
                      the wordmark on this artwork before; it is resized only.

                      The alt text is the company name, so a screen reader hears
                      a heading rather than a description of a picture. */}
                  <Image
                    src="/images/brand/lockup-colour.webp"
                    alt="KUL Enterprises"
                    width={760}
                    height={643}
                    className="h-auto w-full max-w-[300px]"
                  />
                </h2>
                <p
                  className="k-s14-rise mt-5 max-w-[46ch] font-text text-[clamp(1.0625rem,1.6vw,1.5rem)] leading-[1.45]"
                  style={{ "--t": "var(--s14-say, 1)" } as React.CSSProperties}
                >
                  {copy.say}
                </p>
                {/* GOLD IS THE RULE, NOT THE WORDS, and that is measured
                    rather than styled. #A05C08 on this scene's ground is
                    3.4:1, which is under the 4.5:1 that 11px text needs but
                    over the 3:1 a non-text mark is held to. So the mark is
                    gold and the words beside it are ink. The full table is in
                    the gold note in lib/journey-spine.ts; scenes 11 to 13
                    cannot carry gold at all. */}
                <p
                  className="k-s14-rise mt-8 flex items-center gap-3 font-display text-[11px] font-medium uppercase tracking-[0.2em]"
                  style={{ "--t": "var(--s14-say, 1)" } as React.CSSProperties}
                >
                  <span
                    aria-hidden="true"
                    className="h-px w-10 shrink-0"
                    style={{ background: gold ?? "currentColor" }}
                  />
                  {copy.welcome}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Furniture scene={SCENE} plateFile={PORTRAIT} />
      </div>
    </section>
  );
}
