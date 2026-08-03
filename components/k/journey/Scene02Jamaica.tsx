"use client";

import Image from "next/image";
import { SCENES, plate, plateLabel } from "@/lib/journey-spine";
import Furniture from "./Furniture";
import { useStageProgress, span, lerp } from "./useStageProgress";

/**
 * SCENE 02 — JAMAICA.
 *
 * The most important photograph on the site, and the hardest single decision on
 * the page.
 *
 * ============================================================================
 * THE MOTION: THE WORDS RUN AROUND THE PRINT
 * ============================================================================
 * Reference: Intercom, Response Time Vol. 27, where one portrait photograph is
 * set INSIDE the display type. The plate sits in the middle of the setting and
 * the words break around it, rather than sitting beside it in two columns. The
 * type owns the whole measure and the picture is an interruption in it.
 * https://mobbin.com/sites/sections/63faa1de-53d7-46f1-80e6-7ef18aeba0b6
 *
 * Here it is a real editorial float with `shape-outside`, so the sentences
 * genuinely wrap the print rather than being hand-placed around a gap. That is
 * the right relationship for this scene: the photograph is not an illustration
 * beside the account, it is the thing the account is about.
 *
 * ============================================================================
 * THE PAUSE, AND WHY THE LAST SENTENCE HAS NO MOTION AT ALL
 * ============================================================================
 * Mark's script reads: "She told us we were spending the summer with our
 * father." / (long pause) / "We never went back."
 *
 * That pause is scored here as scroll distance rather than as a typographic
 * device: 56vh of completely empty frame, with nothing entering, leaving or
 * moving in it. It is the only place on the whole page where the reader travels
 * more than half a screen through nothing.
 *
 * Then "We never went back." has NO motion of any kind, at any scroll position,
 * in any motion preference. No fade, no rise, no transition, no observer, no
 * JavaScript of any sort touches it. It is in normal flow at full opacity and
 * it becomes visible the way a printed page does, by the reader arriving at it.
 *
 * Every other element in this scene was given a slow, considerate arrival. This
 * sentence is given none, because it is the sentence that arrived without one.
 * That is the entire motion argument of the scene and it is made by taking
 * motion away. Do not add a reveal to it.
 *
 * HIS DATE OF BIRTH IS DELIBERATELY NOT HERE. The screenplay's second line is
 * "On August 8, 1988". A founder's full date of birth beside his full legal
 * name on a public page is a real identity risk. It was flagged to the client
 * rather than silently dropped; putting it back is his call, not a developer's.
 */

const SCENE = SCENES[1];
const PLATE_FILE = "s02-jamaica-childhood";

/** Mark's own words, edited at /admin. Copy is sacred; the fields carry his
 *  sentences and the component only decides where they stand. */
export type Scene02Copy = {
  said: string[];
  caption: string;
  alone: string;
  lesson: string;
  lessonWord: string;
};

export default function Scene02Jamaica({ copy }: { copy: Scene02Copy }) {
  const { trackRef, stageRef } = useStageProgress((p, stage) => {
    // THE PRINT ARRIVES FIRST, AND ALONE. The mount hairline is drawn from the
    // very start; what comes up inside it is the photograph. Eighteen per cent
    // of the stage is spent on one picture appearing and nothing else, which is
    // the scene's opening statement.
    const arrive = span(p, 0, 0.18);
    stage.style.setProperty("--s02-photo", String(arrive));
    // The image pushes in very slightly behind a mount that never moves, so the
    // frame stays absolutely still while its contents settle.
    stage.style.setProperty("--s02-push", String(lerp(1.06, 1, arrive)));

    // THE SENTENCES BEGIN WHILE THE PHOTOGRAPH IS STILL COMING UP. They used to
    // wait for it to finish, and that read as two separate events: a picture,
    // and then some words about it. Starting the first sentence at 0.04, well
    // inside the print's own 0 to 0.18 arrival, makes the photograph and the
    // account of it one thing surfacing together, which is what they are.
    //
    // Threshold classes rather than a scrub: each sentence transitions once on
    // its own, and is never taken back on the way up. A memory does not
    // un-remember.
    stage.dataset.said = String(
      p >= 0.3 ? 3 : p >= 0.16 ? 2 : p >= 0.04 ? 1 : 0,
    );

    // THE PHOTOGRAPH DOES NOT FADE OUT, at the client's word on 2 Aug. The
    // print and its account used to lift 30vh and dissolve to nothing while
    // still on screen, as one rigid object. On the most important photograph
    // on the site that read as the page taking it away from you. The stage
    // simply unsticks at the end of its track and the picture leaves the way
    // everything else on the page leaves, by being scrolled past, at full
    // strength the whole way. Do not put an exit on this scene.
  });

  const p1 = plate(PLATE_FILE);

  return (
    <section
      id={SCENE.slug}
      aria-labelledby="jamaica-heading"
      className="relative"
      style={{
        height: `${SCENE.vh}svh`,
        background: `linear-gradient(180deg, ${SCENE.from} 0%, ${SCENE.to} 100%)`,
        color: "#FCFCFC",
      }}
    >
      {/* BLOCK A, 170vh. One screen held still inside it.
          THE TRACK IS THIS BLOCK, NOT THE SECTION, and that distinction is
          load bearing. The sticky stage is only held for this block's height
          minus one screen, about 560px at a 800px viewport. Measuring progress
          against the whole 300vh section instead would stretch the same
          animation over 1600px, so the photograph would still be arriving long
          after the stage had unstuck and scrolled out of shot. Scene 1 can
          hand this hook its whole section because there the sticky child spans
          all of it; here it cannot. */}
      <div ref={trackRef as React.RefObject<HTMLDivElement>} style={{ height: "170svh" }}>
        <div ref={stageRef} className="k-s02-stage sticky top-0 h-[100svh] overflow-hidden">
          <div className="flex h-full items-center px-5 md:px-10 lg:px-24">
            <div className="k-s02-group mx-auto w-full max-w-[1200px]">
              {/* THE FLOAT. It is the first thing in the text flow, so the
                  sentences wrap it. Below lg the float is abandoned entirely:
                  the right-hand channel would fall under 560px and the display
                  type would rag badly, so the picture goes back into the run of
                  sentences instead. */}
              <figure className="k-s02-figure mb-8 lg:mb-0">
                <div className="k-s02-mount relative overflow-hidden">
                  <Image
                    src={`/images/journey/${PLATE_FILE}.webp`}
                    alt={p1.alt}
                    width={1291}
                    height={1920}
                    priority
                    sizes="(max-width: 1024px) 100vw, 387px"
                    className="k-s02-print h-full w-full object-cover"
                  />
                </div>
                <figcaption className="mt-5 font-display text-[11px] font-medium uppercase leading-[1.6] tracking-[0.1em]">
                  <span className="block tabular-nums">{plateLabel(PLATE_FILE)}</span>
                  <span className="block opacity-80">{copy.caption}</span>
                </figcaption>
              </figure>

              <h2 id="jamaica-heading" className="sr-only">
                {SCENE.title}
              </h2>

              {copy.said.map((line, i) => (
                <p
                  key={line}
                  data-say={i + 1}
                  className="k-s02-say font-display text-[clamp(1.75rem,4.4vw,3.625rem)] font-black leading-[1.08] tracking-[-0.02em]"
                >
                  {line}
                </p>
              ))}
            </div>
          </div>

          <Furniture scene={SCENE} plateFile={PLATE_FILE} />
        </div>
      </div>

      {/* BLOCK B, THE PAUSE. 40vh, and it is empty on purpose. No element, no
          rule, no mark. If you are tempted to put something here, read the
          note at the top of this file: this is the "(long pause)" in his
          script, and it is the reason the next sentence lands. */}
      <div style={{ height: "40svh" }} aria-hidden="true" />

      {/* BLOCK C. Same left rail as the sentences above, so it is unmistakably
          the fourth sentence in the same voice. It is bigger, and the screen is
          otherwise empty. Nothing here moves, ever. */}
      <div
        style={{ height: "55svh" }}
        className="grid items-center px-5 md:px-10 lg:px-24"
      >
        <p className="mx-auto w-full max-w-[1200px] font-display text-[clamp(2.25rem,6vw,5rem)] font-black leading-[1.02] tracking-[-0.025em]">
          {copy.alone}
        </p>
      </div>

      {/* BLOCK D. Static as well: putting a reveal on the lesson after a hard
          cut would undercut the cut. */}
      <div
        style={{ height: "35svh" }}
        className="grid items-center px-5 md:px-10 lg:px-24"
      >
        <div className="mx-auto w-full max-w-[1200px]">
          <p className="font-display text-[11px] font-medium uppercase tracking-[0.2em] text-[#D6A145]">
            {copy.lessonWord}
          </p>
          <p className="mt-4 max-w-[42ch] font-text text-[clamp(1.0625rem,2vw,1.375rem)] leading-[1.5]">
            {copy.lesson}
          </p>
        </div>
      </div>
    </section>
  );
}
