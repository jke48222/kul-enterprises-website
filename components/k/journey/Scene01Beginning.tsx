"use client";

import { SCENES } from "@/lib/journey-spine";
import Furniture from "./Furniture";
import { useStageProgress, span, lerp } from "./useStageProgress";

/**
 * SCENE 01 — EVERY ROAD HAS A BEGINNING.
 *
 * The title card. Near black, the dashcam film running behind it, and Mark's
 * opening five lines.
 *
 * ============================================================================
 * THE MOTION: THE FRAME OPENS LIKE AN APERTURE
 * ============================================================================
 * Reference: Artlist, where display type sits directly on moving footage with
 * no card, no panel and no rounded video container, so the words read as a
 * title burned into the film rather than a caption laid over a background.
 * https://mobbin.com/screens/09a09bcc-30f0-4c97-8841-5b7f158bb59c
 *
 * What is NOT taken from it: everything centred, the button, the logo wall.
 * That is a hero selling a product in one screen; this is the first card of a
 * documentary that runs for sixteen more scenes, so it keeps a left rail and
 * has no call to action at all.
 *
 * The scene begins as a single pool of headlight in near-black and widens until
 * the whole road is visible. It is the oldest opening device in film and it is
 * also the literal argument of the words: a road, beginning. Nothing else in
 * the seventeen scenes opens this way and nothing else is allowed to.
 *
 * The iris is one element being scaled. Not a mask being redrawn, not a
 * clip-path being animated, not a radius growing: a radial gradient the size of
 * the screen with `transform: scale()` on it, which the compositor can do
 * without repainting anything.
 *
 * IF THE SCRIPT NEVER RUNS the iris defaults to its fully open value in the
 * stylesheet and this is simply a title card over a film. Read the header of
 * useStageProgress.ts for why every value works that way round.
 */

const SCENE = SCENES[0];

/** Mark's opening, verbatim. The three-line setup, then the couplet. */
const SETUP = [
  "Every company has a story.",
  "Ours began long before the first truck.",
  "It began with character.",
] as const;

export default function Scene01Beginning() {
  const { trackRef, stageRef } = useStageProgress((p, stage) => {
    // THE IRIS. Opens from a headlight-sized pool to wider than the screen, and
    // keeps opening past the point where it has left the frame so its edge is
    // never in shot while scene 2 arrives underneath.
    //
    // THE FLOOR IS 1 AND IT CAN NEVER GO BELOW IT. The aperture element is
    // exactly the size of the viewport, so at any scale under 1 it is smaller
    // than the screen and its own edges come into shot as a hard rectangle with
    // the film showing around it. This scene shipped that bug twice: once when
    // the element was 300vmax and scaled to 0.1, and again when the element was
    // resized to the viewport and this range was left behind at 0.78.
    //
    // 4.3 is where the transparent core finally passes the screen's half
    // diagonal, so it is the exact scale at which the frame reads as fully
    // clear, and the scene lands on it at 62% of its travel. The climb to 5
    // after that only keeps the soft edge out of shot while scene 2 arrives.
    stage.style.setProperty(
      "--s01-iris",
      (p < 0.62
        ? lerp(1, 4.3, span(p, 0, 0.62))
        : lerp(4.3, 5, span(p, 0.62, 1))
      ).toFixed(3),
    );

    // THE FILM DOES NOT MOVE, AND THAT IS THE FIX FOR THE FLICKER.
    // It used to scale from 1.06 to 1 across the scene. Transform-scaling a
    // PLAYING video forces every decoded frame to be resampled as it arrives,
    // and the result shimmers along high-contrast edges: headlights, lane
    // markings, the trailer's own reflectors. The push-in was worth almost
    // nothing and cost exactly the artefact this scene was being criticised
    // for. The aperture is the only thing that moves now.

    // THE LINES LIGHT ONE AFTER THE OTHER, at the pace of somebody saying them.
    // The three of setup land close together; the couplet is given more room
    // because it is the turn, and "This is mine." is the last thing said.
    const lit =
      p >= 0.46 ? 5 : p >= 0.34 ? 4 : p >= 0.22 ? 3 : p >= 0.14 ? 2 : p >= 0.06 ? 1 : 0;
    stage.style.setProperty("--s01-lit", String(lit));

    // The words recede rather than leave. 0.55 is a floor and not a fade-out:
    // measured on this ground that is still 5.1:1, so the type is readable for
    // every pixel of this scene, including while it is on its way out.
    const out = span(p, 0.68, 1);
    stage.style.setProperty("--s01-lift", `${lerp(0, -64, out)}px`);
    stage.style.setProperty("--s01-fade", String(lerp(1, 0.55, out)));

    // The cue has done its job the moment the reader takes it.
    stage.style.setProperty("--s01-cue", String(1 - span(p, 0, 0.12)));
  });

  return (
    <section
      id={SCENE.slug}
      ref={trackRef as React.RefObject<HTMLElement>}
      aria-labelledby="beginning-heading"
      className="relative"
      style={{
        height: `${SCENE.vh}svh`,
        background: `linear-gradient(180deg, ${SCENE.from} 0%, ${SCENE.to} 100%)`,
        color: "#FCFCFC",
      }}
    >
      <div ref={stageRef} className="sticky top-0 h-[100svh] overflow-hidden">
        {/* The film. Muted, looping, and graded hard enough that a single
            weight of type holds contrast anywhere in the frame. It is the
            night dashcam, which is the only footage that belongs under a
            scene whose light stage is "Night". */}
        <video
          className="absolute inset-0 h-full w-full object-cover"
          poster="/videos/dash-night-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
        >
          <source src="/videos/dash-night-720.mp4" type="video/mp4" media="(max-width: 768px)" />
          <source src="/videos/dash-night.mp4" type="video/mp4" />
        </video>

        {/* Flat veil, so the grade does not have to do all the work and the
            film keeps its detail in the highlights. */}
        <div aria-hidden="true" className="absolute inset-0 bg-[rgba(8,9,10,0.55)]" />

        {/* THE IRIS. Its transparent core is the pool of light; everything
            outside it is the scene's own ground colour, so as it opens it
            reveals the film rather than brightening it. */}
        <div aria-hidden="true" className="k-s01-iris" />

        {/* The words. Bottom-anchored on a left rail, which is the axis every
            scene on this page shares. */}
        <div className="k-s01-type absolute inset-x-0 bottom-0 px-5 pb-32 md:px-10 md:pb-40 lg:px-24">
          <div className="mx-auto w-full max-w-[1248px]">
            {/* Five lines, each lighting in turn. The index on each is what
                drives its own reveal; see .k-s01-line in globals.css. */}
            <div className="flex flex-col gap-1.5 md:gap-2">
              {SETUP.map((line, i) => (
                <p
                  key={line}
                  className="k-s01-line font-text text-[17px] leading-[1.5] md:text-[26px] md:leading-[38px]"
                  style={{ "--i": i + 1 } as React.CSSProperties}
                >
                  {line}
                </p>
              ))}
            </div>

            <h1
              id="beginning-heading"
              className="mt-8 font-display text-[clamp(2.375rem,7.2vw,5.75rem)] font-black leading-[0.98] tracking-[-0.025em] md:mt-14"
            >
              <span
                className="k-s01-line block"
                style={{ "--i": 4 } as React.CSSProperties}
              >
                Every road has a beginning.
              </span>
              {/* The one line where he speaks about himself, and the only gold
                  in the scene. The rule is a mark in the margin, not a
                  decoration: it says which sentence is his. */}
              <span
                className="k-s01-line relative mt-2 block md:mt-3"
                style={{ "--i": 5 } as React.CSSProperties}
              >
                <span
                  aria-hidden="true"
                  className="absolute -left-4 top-[0.18em] h-[0.62em] w-[2px] bg-[#D6A145] md:-left-6"
                />
                This is mine.
              </span>
            </h1>
          </div>
        </div>

        {/* A real link, not a decoration. It is the first tab stop on the page
            and it actually goes to scene 2. Its focus ring forces it back to
            full opacity, so a keyboard reader can always see where they are
            even once scrolling has faded it. */}
        <a
          href="#jamaica"
          className="k-s01-cue group absolute bottom-24 left-1/2 z-30 -translate-x-1/2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D6A145] md:bottom-28"
        >
          <span className="sr-only">Skip to Jamaica, scene two</span>
          <span
            aria-hidden="true"
            className="block h-10 w-px bg-[rgba(252,252,252,0.24)]"
          />
          <span
            aria-hidden="true"
            className="k-s01-dot absolute left-1/2 top-0 block h-1 w-1 -translate-x-1/2 rounded-full bg-[#D6A145]"
          />
        </a>

        <Furniture scene={SCENE} />
      </div>
    </section>
  );
}
