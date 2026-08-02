"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useReducedMotionLive } from "@/components/k/useReducedMotionLive";
import { flushSync } from "react-dom";
import { SCENES, plate, plateLabel, inkFor, NO_PLATE } from "@/lib/journey-spine";
import Furniture from "./Furniture";

/**
 * SCENE 11 — A VISION BEGINS TO FORM.
 *
 * The roll call. Six words, and an archive being asked, name by name, whether
 * it has a photograph of that person.
 *
 * ============================================================================
 * THE MOTION: THE ARCHIVE IS INTERROGATED AND MOSTLY ANSWERS NO
 * ============================================================================
 * Reference: Freshman's directors index, where a name stack at display scale IS
 * the composition, the register metadata hangs outside the row in a narrow
 * margin column, and the revealed image is a modest plate parked in the margin
 * rather than a full-bleed takeover, so the list stays the subject and the
 * photograph is subordinate evidence.
 * https://mobbin.com/sites/sections/3641b988-b26c-471d-a177-c5fc2254b123
 *
 * FOUR OF THE SIX ANSWERS ARE AN EMPTY FRAME, AND THAT IS THE POINT OF THE
 * SCENE RATHER THAN A SHORTAGE OF ASSETS. Mark's argument here is that what
 * keeps freight moving is not trucks but people, and the honest fact about his
 * own archive is that in eleven years he photographed the road constantly and
 * the people almost never. The empty frame says that better than a stock
 * photograph of a smiling dispatcher ever could, and it has the advantage of
 * being true.
 *
 * The two that ARE answered are answered truthfully:
 *   Drivers                  he is one, so the plate is his own portrait
 *   Families waiting at home his own family, in the only photograph of them
 * Neither is a decorative match. Both are the archive genuinely having
 * something to say.
 *
 * ============================================================================
 * WHY NOTHING HERE EVER CHANGES OPACITY
 * ============================================================================
 * This scene sits at the tightest part of the light arc. Its ground runs from
 * #909ca5 to #9fabbd, and ink on that is 6.6:1 at best. There is enough room
 * for full-strength text and none at all for a dimmed state: ink at 55% over
 * this ground composites to roughly 2.5:1, which is unreadable.
 *
 * So the active row is NEVER carried by alpha. It is carried by weight, by a
 * gold tick in the margin, and by the plate well changing. Every one of the six
 * words sits at full ink permanently, in every state, including while a
 * transition is running. Do not add an opacity to this list.
 *
 * ============================================================================
 * WHY THIS SCENE DOES NOT PIN
 * ============================================================================
 * The obvious build is a pinned stage with the names walking past a fixed well.
 * That would be a fifth pinned scene, and pinning is the thing that took the
 * first draft of this page to sixty-four screens.
 *
 * It does not need one. The list scrolls normally and only the plate well is
 * sticky, which is the same reading experience for a fraction of the scroll:
 * the well stays in view and answers each name as it comes level with it.
 */

const SCENE = SCENES[10];

/**
 * Mark's six, verbatim, in his order. `plateFile` is null where the archive
 * genuinely has nothing, which is most of them.
 */
const PLATE_FILES: ReadonlyArray<string | null> = [
  "mark-portrait",
  null,
  null,
  null,
  null,
  "s02-jamaica-childhood",
];

/** His words, edited at /admin. Which names the archive can answer with a
 *  photograph is the register's business and stays in the list above. */
export type Scene11Copy = {
  premise: string;
  people: string;
  roll: { word: string; note: string }[];
};

export default function Scene11People({ copy }: { copy: Scene11Copy }) {
  const ROLL = copy.roll.map((r, i) => ({
    word: r.word,
    note: r.note || null,
    plateFile: PLATE_FILES[Math.min(i, PLATE_FILES.length - 1)],
  }));
  const [active, setActive] = useState(0);
  const rowsRef = useRef<(HTMLLIElement | null)[]>([]);
  /** Set by hover or tap. While it holds, scroll does not move the answer. */
  const heldRef = useRef<number | null>(null);
  /** So the scroll effect can call commit without tearing down its listener. */
  const commitRef = useRef<((i: number) => void) | null>(null);

  const reduced = useReducedMotionLive();
  useEffect(() => {
    if (reduced) return;

    // The row whose centre is nearest the reading line owns the well. One
    // observer-free rAF read, because six rects on a scroll frame is cheap and
    // an IntersectionObserver cannot express "nearest to a line".
    let frame = 0;
    let queued = false;
    const read = () => {
      queued = false;
      if (heldRef.current !== null) return;
      const line = window.innerHeight * 0.46;
      let best = 0;
      let bestDist = Infinity;
      rowsRef.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - line);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setActive((prev) => {
        if (prev === best) return prev;
        // Scroll changes the answer as well as hover, and it must morph the
        // same way, or the well behaves differently depending on how you got
        // there. Deferred out of the rAF read so the transition is not started
        // inside a measurement pass.
        queueMicrotask(() => commitRef.current?.(best));
        return prev;
      });
    };
    const onScroll = () => {
      if (queued) return;
      queued = true;
      frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduced]);

  /**
   * THE WELL MORPHS BETWEEN ANSWERS RATHER THAN BLINKING.
   *
   * This scene is an archive being asked, name by name, whether it has a
   * photograph of that person, and four times out of six the answer is an empty
   * frame. A hard swap makes that read as a slideshow. A View Transition makes
   * the well itself persist and its CONTENTS change, which is what a catalogue
   * drawer does, and it is the difference between six pictures and one
   * instrument being queried six times.
   *
   * flushSync is required, not stylistic: startViewTransition snapshots the DOM
   * inside its callback, and React would otherwise batch the state update to
   * after the snapshot, so the transition would capture no change at all.
   *
   * IT IS PURE ENHANCEMENT. No View Transitions support, or reduced motion, and
   * this is exactly the plain setState it always was.
   */
  const commit = (i: number) => {
    const reduced = typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || typeof document.startViewTransition !== "function") {
      setActive(i);
      return;
    }
    const vt = document.startViewTransition(() => flushSync(() => setActive(i)));
    // A transition interrupted by the next one (or a throttled tab) rejects
    // these promises. That is normal operation, not an error.
    vt.finished.catch(() => undefined);
    vt.ready.catch(() => undefined);
  };

  const hold = (i: number) => {
    heldRef.current = i;
    commit(i);
  };
  const release = () => {
    heldRef.current = null;
  };

  commitRef.current = commit;

  const current = ROLL[active];
  const ink = inkFor(SCENE);

  return (
    <section
      id={SCENE.slug}
      aria-labelledby="people-heading"
      className="relative"
      style={{
        height: `${SCENE.vh}svh`,
        background: `linear-gradient(180deg, ${SCENE.from} 0%, ${SCENE.to} 100%)`,
        color: ink,
      }}
    >
      <div className="k-cine mx-auto flex h-full w-full max-w-[1296px] flex-col px-5 pt-[12svh] md:px-10 lg:px-24">
        {/* THE PREMISE. The answer arrives alone, in empty ground. */}
        <div className="max-w-[34ch]">
          <h2
            id="people-heading"
            className="font-text text-[clamp(1.125rem,2vw,1.75rem)] font-normal leading-[1.35]"
          >
            {copy.premise}
          </h2>
          <p className="k-title-cine mt-[8svh] font-display text-[clamp(2rem,5.4vw,4.5rem)] font-black leading-[1.02] tracking-[-0.025em]">
            {copy.people}
          </p>
        </div>

        {/* THE ROLL CALL. Names left, the archive's answer sticky on the right. */}
        <div className="mt-[10svh] grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px] lg:gap-20">
          <ul className="flex flex-col">
            {ROLL.map((r, i) => {
              const on = i === active;
              return (
                <li
                  key={r.word}
                  ref={(el) => {
                    rowsRef.current[i] = el;
                  }}
                  // Pointer only, on purpose. These are sentences, not
                  // controls: scroll answers them for everyone, hover lets a
                  // pointer peek ahead, and a tab stop that operates nothing
                  // (and drives a well that is display:none below lg) would
                  // cost a keyboard reader six stops for nothing.
                  onMouseEnter={() => hold(i)}
                  onMouseLeave={release}
                  className="group relative flex items-baseline gap-5 py-[1.4svh]"
                >
                  {/* The tick is the margin marker, and it is the only thing on
                      this scene that moves. Scale rather than width, so it
                      cannot cause a layout pass. */}
                  <span
                    aria-hidden="true"
                    className="mt-[0.5em] h-px w-8 shrink-0 origin-left bg-current transition-transform duration-300 ease-out"
                    style={{ transform: `scaleX(${on ? 1 : 0.18})` }}
                  />
                  {/* WEIGHT, NEVER ALPHA. See the note at the top of this file:
                      a dimmed state on this ground is unreadable. */}
                  <span
                    className="font-display text-[clamp(1.75rem,4.6vw,3.75rem)] leading-[1.06] tracking-[-0.02em] transition-[font-variation-settings,letter-spacing] duration-300 ease-out"
                    style={{
                      fontVariationSettings: on ? "'wght' 900" : "'wght' 400",
                    }}
                  >
                    {r.word}
                  </span>
                </li>
              );
            })}
          </ul>

          {/* THE WELL. It answers whichever name is level with it, and four
              times out of six the honest answer is that there is no picture. */}
          <div className="hidden lg:block">
            <div className="sticky top-[30svh]">
              <div
                className="k-s11-well relative aspect-[3/4] w-full overflow-hidden"
                style={{ outline: `1px solid ${ink}`, outlineOffset: "-1px" }}
              >
                {current.plateFile ? (
                  <Image
                    key={current.plateFile}
                    src={`/images/journey/${current.plateFile}.webp`}
                    alt={plate(current.plateFile).alt}
                    fill
                    sizes="360px"
                    className="object-cover"
                  />
                ) : (
                  // The drawn empty frame. It is the dominant visual event of
                  // the scene and it is deliberately not styled as a loading
                  // state or an error: it is a catalogue card with nothing
                  // filed behind it.
                  <div className="flex h-full items-center justify-center p-6">
                    <span className="font-display text-[11px] font-medium uppercase tracking-[0.14em]">
                      {NO_PLATE}
                    </span>
                  </div>
                )}
              </div>
              <p className="mt-3 flex items-baseline gap-4 font-display text-[11px] font-medium uppercase leading-[1.5] tracking-[0.1em]">
                {/* An empty slot carries no plate label at all: the note
                    beside it already says the honest sentence, and a dash
                    would be the one banned character on the page. */}
                {current.plateFile ? (
                  <span className="tabular-nums">{plateLabel(current.plateFile)}</span>
                ) : null}
                <span>{current.note ?? NO_PLATE}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Furniture scene={SCENE} plateFile={current.plateFile ?? undefined} />
    </section>
  );
}
