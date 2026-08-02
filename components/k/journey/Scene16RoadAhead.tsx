"use client";

import { useRef, useState } from "react";
import { SCENES, inkFor, goldFor } from "@/lib/journey-spine";
import Furniture from "./Furniture";
import { useLit } from "./useLit";

/**
 * SCENE 16 — THE ROAD AHEAD.
 *
 * ============================================================================
 * AN INSTRUMENT, NOT A PICTURE
 * ============================================================================
 * Reference: V7's measuring-rule timeline. A conventional timeline draws only
 * the events, which silently implies the story is full. A ruler draws every
 * graduation whether or not anything happened there, so absence becomes
 * something you can literally count. KUL has one tractor and wants fifty,
 * and a ruler is the only form that can state that without either boasting
 * or apologising.
 *
 * THE NUMBERS ARE THE CLIENT'S OWN. Fifty tractors by the end of 2029 is
 * Mark's stated vision from his Website Blueprint, on the record; the site
 * already publishes it. The endpoint is labelled TARGET, END OF 2029, never
 * a bare year, so the empty span reads as the future and not a shortfall.
 * Tick 02 is hollow and never fills: the second tractor does not exist yet,
 * and the scene must not assert it. If Mark ever revises the vision, this
 * scene and the Road Ahead page change together.
 *
 * The original 460vh two-magnification scrub was cut with the rest of the
 * pinned marathon; the instrument ships in its finished state, which its own
 * spec defined for reduced motion: master head parked on tick 02, detail
 * head at the hollow cap, all three station underlines drawn. What survives
 * of the motion is the entrances and the hover: pointing at any graduation
 * answers with arithmetic, and forty-eight of the fifty answer NOT YET.
 * Nobody has to write that sentence.
 *
 * Gold here is #A05C08 throughout, the light-ground value, 2px strokes at
 * most, never a fill, never text.
 */

const SCENE = SCENES[15];

const TICKS = 50;
const COMB_W = 1296;
const PITCH = (COMB_W - 4) / (TICKS - 1);

/** Where each graduation sits, integer-rounded so the comb stays crisp. */
const tickX = (i: number) => Math.round(2 + i * PITCH);

/** His words, edited at /admin. The instrument's arithmetic (fifty marks,
 *  the numerals, the probe answers) is the site's and stays in code. */
export type Scene16Copy = {
  triad: string[];
  inService: string;
  target: string;
  next: string;
  stations: string[];
  still: string;
  aheadA: string;
  aheadB: string;
  lesson: string;
};

export default function Scene16RoadAhead({ copy }: { copy: Scene16Copy }) {
  const rootRef = useLit<HTMLElement>();
  const combRef = useRef<HTMLDivElement | null>(null);
  const [probe, setProbe] = useState<number | null>(null);
  const ink = inkFor(SCENE);
  const gold = goldFor(SCENE);

  const onProbe = (e: React.PointerEvent) => {
    const box = combRef.current?.getBoundingClientRect();
    if (!box) return;
    const frac = (e.clientX - box.left) / box.width;
    setProbe(Math.max(0, Math.min(TICKS - 1, Math.round(frac * (TICKS - 1)))));
  };

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
        {/* THE TRIAD. */}
        <div>
          <h2
            id={`${SCENE.slug}-heading`}
            data-lit
            className="k-jl k-jset max-w-[18ch] font-display text-[clamp(1.875rem,4.2vw,3.625rem)] font-black leading-[1.06] tracking-[-0.02em]"
          >
            {copy.triad[0]}
          </h2>
          <p data-lit className="k-jl k-jset mt-4 pl-6 font-text text-[clamp(1.125rem,1.9vw,1.625rem)] leading-[1.4] md:pl-12">
            {copy.triad[1]}
          </p>
          <p data-lit className="k-jl k-jset mt-1 pl-6 font-text text-[clamp(1.125rem,1.9vw,1.625rem)] leading-[1.4] md:pl-12">
            {copy.triad[2]}
          </p>
        </div>

        {/* ==============================================================
            THE INSTRUMENT. Fifty graduations, one per tractor. The whole
            measure is restated in words for anyone who cannot see it, and
            every gold mark has an ink label saying the same thing.
            ============================================================== */}
        <div
          data-lit
          className="k-jl k-jset mt-[9svh]"
          role="img"
          aria-label="Fleet measure. One tractor in service today. The target is fifty tractors by the end of 2029. Forty-nine of the fifty marks on this rule are empty."
        >
          <div
            ref={combRef}
            className="relative"
            onPointerMove={onProbe}
            onPointerLeave={() => setProbe(null)}
          >
            {/* The probe's answer: arithmetic, never a claim. Snaps tick to
                tick like an instrument detent. Decoration for a pointer;
                the aria-label above already says everything it can say. */}
            {probe !== null ? (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-7 hidden -translate-x-1/2 whitespace-nowrap px-2 py-1 font-display text-[11px] font-medium uppercase tracking-[0.1em] md:block"
                style={{
                  left: `${(tickX(probe) / COMB_W) * 100}%`,
                  background: SCENE.to,
                }}
              >
                {probe === 0
                  ? "Tractor 01 · In service"
                  : probe === 1
                    ? "Tractor 02 · Next"
                    : `Tractor ${String(probe + 1).padStart(2, "0")} · Not yet`}
              </span>
            ) : null}

            <svg
              aria-hidden="true"
              viewBox={`0 0 ${COMB_W} 96`}
              className="block w-full"
              shapeRendering="crispEdges"
            >
              {/* The master rule, and the head parked where the story is:
                  on the hollow second graduation. */}
              <rect x="0" y="56" width={COMB_W} height="1" fill="currentColor" opacity="0.34" />
              <rect x={tickX(1) - 1} y="0" width="2" height="56" fill={gold ?? "currentColor"} />
              <rect x={tickX(1) - 3} y="0" width="6" height="6" fill={gold ?? "currentColor"} />
              {Array.from({ length: TICKS }, (_, i) => {
                if (i === 0)
                  return <rect key={i} x={tickX(i)} y="57" width="2" height="28" fill={gold ?? "currentColor"} />;
                if (i === 1)
                  return (
                    <rect
                      key={i}
                      x={tickX(i)}
                      y="57.5"
                      width="4"
                      height="27"
                      fill="none"
                      stroke={gold ?? "currentColor"}
                      strokeWidth="1"
                    />
                  );
                const major = (i + 1) % 10 === 0;
                return (
                  <rect
                    key={i}
                    x={tickX(i)}
                    y="57"
                    width="1"
                    height={major ? 18 : 12}
                    fill="currentColor"
                    opacity={major ? 0.55 : 0.32}
                  />
                );
              })}
            </svg>

            <div className="relative mt-1 h-9 font-display text-[11px] font-medium uppercase tracking-[0.1em]">
              <span className="absolute left-0 tabular-nums">01</span>
              <span
                className="absolute tabular-nums opacity-[0.62]"
                style={{ left: `${(tickX(1) / COMB_W) * 100}%` }}
              >
                02
                <span className="mt-0.5 block">{copy.next}</span>
              </span>
              <span className="absolute right-0 tabular-nums">50</span>
            </div>
            <div className="flex items-baseline justify-between gap-6 font-display text-[11px] font-medium uppercase tracking-[0.1em]">
              <span>{copy.inService}</span>
              <span className="text-right">{copy.target}</span>
            </div>
          </div>

          {/* THE STATIONS. What actually closes the gap, in his words, with
              the drawn underlines of promises already being kept. */}
          <div className="mt-[6svh] flex flex-col gap-5 border-t pt-6 md:flex-row md:justify-between md:gap-8" style={{ borderColor: "color-mix(in srgb, currentColor 40%, transparent)" }}>
            {copy.stations.map((s) => (
              <p key={s} className="font-text text-[clamp(1.0625rem,1.5vw,1.3125rem)] leading-[1.4]">
                {s}
                <span aria-hidden="true" className="mt-2 block h-px w-[140px]" style={{ background: gold ?? "currentColor" }} />
              </p>
            ))}
          </div>
        </div>

        {/* THE CALIBRATION. What guides the run to the far end. */}
        <div className="mt-[8svh] max-w-[38ch]">
          <p data-lit className="k-jl k-jset font-text text-[clamp(1.25rem,2.2vw,2rem)] leading-[1.35]">
            {copy.still}
          </p>
          <p data-lit className="k-jl k-jset mt-4 font-text text-[clamp(1.0625rem,1.7vw,1.5rem)] leading-[1.5]">
            {copy.aheadA}
          </p>
          <p data-lit className="k-jl k-jset font-text text-[clamp(1.0625rem,1.7vw,1.5rem)] leading-[1.5]">
            {copy.aheadB}
          </p>
        </div>

        <div className="mt-[7svh] flex max-w-[40ch] flex-col gap-4">
          <span aria-hidden="true" className="h-px w-16" style={{ background: gold ?? "currentColor" }} />
          <p className="font-text text-[clamp(1.125rem,2vw,1.75rem)] leading-[1.4]">
            {copy.lesson}
          </p>
        </div>
      </div>

      <Furniture scene={SCENE} />
    </section>
  );
}
