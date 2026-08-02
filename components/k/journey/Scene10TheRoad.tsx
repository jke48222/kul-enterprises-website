"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { SCENES, plate, plateLabel } from "@/lib/journey-spine";
import Furniture from "./Furniture";
import RoadShader, { type RoadShaderHandle } from "./RoadShader";
import { useStageProgress } from "./useStageProgress";

/**
 * SCENE 10 — THE ROAD BECAME MY TEACHER.
 *
 * The centrepiece, the longest scene on the page, and the hinge the whole thing
 * turns on: this is where night becomes day.
 *
 * ============================================================================
 * THE MOTION: THE COUNTRY IS PULLED THROUGH THE FRAME
 * ============================================================================
 * Eleven photographs, full bleed, dissolving into one another on the GPU with a
 * displacement that radiates out of the road's own vanishing point. A change of
 * photograph does not cross-fade, it rushes: the outgoing frame is pushed
 * outward past the edges while the incoming one settles inward, which is what
 * being driven through somewhere looks like. See components/k/journey/
 * RoadShader.tsx for the shader and for why it holds only two textures.
 *
 * THE PHOTOGRAPHS ARE STILL SHARP WHILE YOU READ THEM. The displacement peaks
 * in the middle of a transition and is exactly zero at both ends, so every
 * frame is untouched for as long as it is the frame you are looking at.
 *
 * ============================================================================
 * THE STRIP IS STILL HERE, AND IT IS THE REGISTER NOW
 * ============================================================================
 * Reference for it remains MOUTHWASH Studio's archive index, where the label
 * belongs to the frame and travels with it rather than to the screen, so the
 * band reads as one continuous register instead of a carousel.
 * https://mobbin.com/sites/sections/672f92e4-3ef9-49c3-b9f5-dc2b4ade1c02
 *
 * It used to be the whole scene. It is now a thin index along the foot: small,
 * still travelling, still carrying every plate number and light label with its
 * own frame. Deleting it was the obvious move when the shader arrived and it
 * would have been wrong. It is the only thing that says this is an ARCHIVE of
 * eleven specific photographs rather than a nice piece of footage, and it is
 * also the fallback: if WebGL is missing or the context is lost, the strip is
 * still there and the scene still works.
 *
 * ============================================================================
 * THE NON-LINEAR SCRUB IS UNCHANGED AND IS STILL THE POINT
 * ============================================================================
 * Scroll splits into eleven slots and each runs through smootherstep, which has
 * zero slope AND zero acceleration at both ends. Measured across one slot the
 * lateral velocity is 4px per unit at the boundaries and 11,248 at mid-slot: a
 * dwell ratio of about 2800 to 1. Each photograph settles, holds, releases.
 *
 * The shader is driven by the SAME curve, so the dissolve and the strip move as
 * one thing. Eleven considered looks, not one glide. A truck slowing for
 * something worth looking at and then pulling away from it.
 *
 * ============================================================================
 * WHY THE CAPTION BAND CARRIES ITS OWN WASH
 * ============================================================================
 * This scene owns the page's entire light crossing: its ground travels from
 * #35373a to #909ca5, straight through the band where neither white nor
 * near-black text can reach 4.5:1. Nothing may sit on the raw ground here, and
 * with photographs now full bleed behind the type there is even less to rely
 * on. So Mark's words live in a band with a constant dark wash of its own,
 * measured once, exactly like the furniture strap.
 */

const SCENE = SCENES[9];

/**
 * Eleven photographs in the order the light runs, which is the order he saw
 * them in. Every line is Mark's, verbatim from the screenplay.
 *
 * THE LABELS ARE DESCRIPTIONS OF THE LIGHT, NOT CLOCK TIMES. An earlier version
 * stepped a clock from 03:50 to 15:10, which would have been eleven invented
 * facts on a page whose whole argument is that nothing on it is invented. Mark
 * did not record when he took these.
 */
const FRAMES = [
  { file: "s12c-night-highway", light: "Night", line: "I thought I was learning how to drive a truck." },
  { file: "s12-predawn-peaks", light: "Before first light", line: "What I didn't realize was that the road was teaching me something far greater." },
  { file: "s13-first-daylight", light: "The sky begins to lift", line: "Every mile introduced me to a new place." },
  { file: "s04-dawn-road-mist", light: "Dawn, in mist", line: "Every state introduced me to different people." },
  { file: "s11-sunrise-band", light: "Sunrise", line: "Every delivery reminded me that trust travels farther than freight." },
  { file: "s05-sunrise-horizon", light: "The sun clears the horizon", line: "I had a plan. But plans have a way of changing." },
  { file: "s08-desert-bend", light: "Mid morning", line: "There were victories. There were setbacks. Both became teachers." },
  { file: "s09-interstate-traffic", light: "Late morning", line: "I wasn't chasing titles. I was learning to become dependable." },
  { file: "s06-wide-horizon", light: "Midday", line: "The country was changing. And so was I." },
  { file: "s08b-rockcut-bend", light: "Afternoon", line: "Every load represented someone's trust. Every mile represented someone's promise." },
  { file: "s17-road-to-horizon", light: "Sun high", line: "The farther I traveled, the more I realized every person has a story." },
] as const;

const SOURCES = FRAMES.map((f) => `/images/journey/${f.file}.webp`);

/**
 * Zero slope AND zero acceleration at both ends, which is what gives each
 * photograph its dwell. Plain smoothstep holds too briefly to read as a pause.
 */
function smootherstep(f: number): number {
  return f * f * f * (f * (f * 6 - 15) + 10);
}

export default function Scene10TheRoad() {
  const [current, setCurrent] = useState(0);
  const shader = useRef<RoadShaderHandle | null>(null);

  const { trackRef, stageRef } = useStageProgress((p, stage) => {
    const slots = FRAMES.length - 1;
    const raw = Math.min(p, 0.9999) * slots;
    const i = Math.floor(raw);
    const eased = smootherstep(raw - i);

    // The shader and the strip are driven by the SAME eased value, so the
    // dissolve and the index can never disagree about where the scene is.
    shader.current?.set(i, Math.min(i + 1, slots), eased);

    const strip = stage.querySelector<HTMLElement>(".k-s10-strip");
    const first = strip?.firstElementChild as HTMLElement | null;
    if (strip && first) {
      // Measured from the DOM rather than hard-coded, so the pitch stays right
      // at every viewport without a second copy of the layout living in here.
      const gutter = parseFloat(getComputedStyle(strip).columnGap || "0") || 0;
      const pitch = first.offsetWidth + gutter;
      strip.style.setProperty("--s10-x", `${-(pitch * (i + eased)).toFixed(2)}px`);
    }

    // The nearest frame owns the caption. Rounding rather than flooring means
    // the words change at the midpoint of a dissolve, while the outgoing
    // photograph is already leaving, not the instant it starts to move.
    const near = Math.round(raw);
    setCurrent((prev) => (prev === near ? prev : near));
  });

  const frame = FRAMES[Math.min(current, FRAMES.length - 1)];

  return (
    <section
      id={SCENE.slug}
      ref={trackRef as React.RefObject<HTMLElement>}
      aria-labelledby="the-road-heading"
      className="relative"
      style={{
        height: `${SCENE.vh}svh`,
        background: `linear-gradient(180deg, ${SCENE.from} 0%, ${SCENE.to} 100%)`,
        color: "#FCFCFC",
      }}
    >
      <div ref={stageRef} className="sticky top-0 h-[100svh] overflow-hidden">
        <h2 id="the-road-heading" className="sr-only">
          {SCENE.title}
        </h2>

        {/* THE ROAD ITSELF. Purely an enhancement: it is aria-hidden, and every
            photograph it draws is also in the index below with its own alt text
            and plate number. If it never initialises, nothing is lost but the
            depth. */}
        <RoadShader
          sources={SOURCES}
          handleRef={shader}
          className="absolute inset-0 h-full w-full"
        />

        {/* Seats the full-bleed frame into the page and keeps the top edge from
            fighting the navigation pill. Static. */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,11,13,0.62) 0%, rgba(10,11,13,0.10) 26%, rgba(10,11,13,0) 46%)",
          }}
        />

        {/* THE CAPTION. Its own wash, so Mark's words never depend on what the
            photograph behind them happens to be doing. */}
        <div
          className="absolute inset-x-0 bottom-0 px-5 pb-[19svh] pt-24 md:px-10 lg:px-24"
          style={{
            background:
              "linear-gradient(to top, rgba(10,11,13,0.94) 0%, rgba(10,11,13,0.82) 46%, rgba(10,11,13,0.32) 76%, transparent 100%)",
          }}
        >
          <div className="mx-auto w-full max-w-[1296px]">
            <p
              key={frame.file}
              className="k-s10-line max-w-[24ch] font-display text-[clamp(1.5rem,3.4vw,3rem)] font-black leading-[1.1] tracking-[-0.022em]"
            >
              {frame.line}
            </p>
          </div>
        </div>

        {/* THE INDEX. Demoted from the whole scene to a register along the foot,
            still travelling, each label still belonging to its own frame. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[7svh] overflow-hidden">
          <div
            className="k-s10-strip flex items-stretch gap-3 pl-5 will-change-transform md:pl-10 lg:pl-24"
            style={{ transform: "translate3d(var(--s10-x, 0px), 0, 0)" }}
          >
            {FRAMES.map((f, i) => {
              const pl = plate(f.file);
              const on = i === current;
              return (
                <figure key={f.file} className="flex shrink-0 flex-col">
                  <div
                    className="relative h-[9svh] w-[13.5svh] overflow-hidden transition-opacity duration-300"
                    style={{ opacity: on ? 1 : 0.42 }}
                  >
                    <Image
                      src={`/images/journey/${f.file}.webp`}
                      alt={pl.alt}
                      fill
                      sizes="180px"
                      className="object-cover"
                      priority={i < 2}
                    />
                  </div>
                  <figcaption className="mt-2 flex items-baseline gap-3 whitespace-nowrap font-display text-[10px] font-medium uppercase leading-none tracking-[0.1em]">
                    <span className="tabular-nums">{plateLabel(f.file)}</span>
                    <span style={{ opacity: on ? 1 : 0.6 }}>{f.light}</span>
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </div>

        {/* The furniture is alive on this scene, and it is the only one where it
            is: scene 10 genuinely crosses the whole day, so the light stage
            steps with the photographs. It uses the shared component so it keeps
            the scrim that an on-photo scene needs. */}
        <Furniture
          scene={SCENE}
          stage={frame.light}
          middle={
            <span className="tabular-nums">
              {current + 1} / {FRAMES.length}
            </span>
          }
        />
      </div>
    </section>
  );
}
