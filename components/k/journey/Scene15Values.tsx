"use client";

import { SCENES, inkFor, goldFor } from "@/lib/journey-spine";
import Furniture from "./Furniture";
import { useLit } from "./useLit";

/**
 * SCENE 15 — WHAT WE STAND FOR.
 *
 * ============================================================================
 * SIX STRATA THAT CLOSE INTO ONE OBJECT
 * ============================================================================
 * Reference: Ada's zero-gutter statement panels. The moment gaps go to zero a
 * list stops being a list and becomes a slab, and six separate claims read as
 * one continuous object. Their saturated colour fills are left behind
 * entirely: the divisions here are hairlines with the scene's own ground
 * showing through, so the light arc passes straight through the composition.
 *
 * The motion IS the closing sentence. Six things written separately become
 * one thing lived together, so the six strata arrive displaced apart, fully
 * legible with ground showing between them, and CLOSE on each other,
 * outside-in, sealing at the centre seam. The resting stylesheet state is
 * the sealed laminate; the displacement only exists on an armed page that
 * has not reached the block yet.
 *
 * THE GOLD SPINE. One vertical rule at the seam between what a value is
 * called and what it actually costs. The spine's own gold table says this
 * ground can carry #A05C08 as a MARK only, which is exactly what a 3px
 * spine is. It crosses all six hairlines, so it reads by its intersections;
 * it carries no information a reader could miss.
 *
 * The row heights are generous and the promises are set at reading size,
 * which is most of what keeps a ruled six-row block from reading as a
 * spreadsheet. No cell fills, no zebra, no outer box: an open-sided ruled
 * field is a printed manifest, which is the native document of freight.
 */

const SCENE = SCENES[14];

/** His six values, and what each one costs. Verbatim. */
const VALUES = [
  { name: "Integrity", promise: "We do the right thing… even when no one is watching." },
  { name: "Safety", promise: "Every load matters. Every person matters more." },
  { name: "Communication", promise: "Trust grows when people know what's happening." },
  { name: "Respect", promise: "We believe relationships are built… one conversation at a time." },
  { name: "Excellence", promise: "Good enough has never been our destination." },
  { name: "Accountability", promise: "When we make a promise… We intend to keep it." },
] as const;

/** Displacement away from the centre seam, and the outside-in stagger. */
const SETTLE = [
  { dy: -72, delay: 0 },
  { dy: -48, delay: 100 },
  { dy: -24, delay: 200 },
  { dy: 24, delay: 200 },
  { dy: 48, delay: 100 },
  { dy: 72, delay: 0 },
] as const;

export default function Scene15Values() {
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
        minHeight: `${SCENE.vh}svh`,
        background: `linear-gradient(180deg, ${SCENE.from} 0%, ${SCENE.to} 100%)`,
        color: ink,
      }}
    >
      <div className="mx-auto w-full max-w-[1296px] px-5 py-[12svh] pb-[20svh] md:px-10 lg:px-24">
        <p className="font-display text-[11px] font-medium uppercase tracking-[0.2em]">
          What we stand for
        </p>

        <div className="mt-8 max-w-[38ch]">
          <h2 id={`${SCENE.slug}-heading`} data-lit className="k-jl k-jset font-text text-[clamp(1.0625rem,1.7vw,1.5rem)] leading-[1.5]">
            Every company has values.
          </h2>
          <p data-lit className="k-jl k-jset font-text text-[clamp(1.0625rem,1.7vw,1.5rem)] leading-[1.5]">
            Ours were learned&hellip; long before this company existed.
          </p>
        </div>

        {/* THE LAMINATE. One data-lit target: the whole block settles as one
            press seating parts, not six list items sliding in. */}
        <ol data-lit className="k-s15-block relative mt-[7svh]">
          {/* The spine. On desktop it cuts the name/promise seam through all
              six strata; on a phone there is no seam, so it binds the block's
              left edge instead. */}
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-0 w-[3px] md:left-[calc(56px+min(24vw,280px))]"
            style={{ background: gold ?? "currentColor" }}
          />
          {VALUES.map((v, i) => (
            <li
              key={v.name}
              className="k-s15-row grid grid-cols-[40px_1fr] items-baseline gap-x-4 py-5 pl-4 md:grid-cols-[56px_min(24vw,280px)_1fr] md:gap-x-8 md:py-7 md:pl-0"
              style={
                {
                  "--s15-dy": `${SETTLE[i].dy}px`,
                  "--s15-delay": `${SETTLE[i].delay}ms`,
                  borderTop: "1px solid color-mix(in srgb, currentColor 22%, transparent)",
                  borderBottom:
                    i === VALUES.length - 1
                      ? "1px solid color-mix(in srgb, currentColor 40%, transparent)"
                      : undefined,
                } as React.CSSProperties
              }
            >
              <span className="font-display text-[11px] font-medium uppercase tabular-nums tracking-[0.1em]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-display text-[clamp(0.9375rem,1.6vw,1.375rem)] font-semibold uppercase leading-[1.1] tracking-[0.08em]">
                {v.name}
              </span>
              <span className="col-span-2 mt-2 font-text text-[clamp(1rem,1.6vw,1.4375rem)] leading-[1.4] md:col-span-1 md:mt-0">
                {v.promise}
              </span>
            </li>
          ))}
        </ol>

        {/* The closing pair. No label, no rule: after six ruled strata,
            another piece of furniture would be one too many. */}
        <div className="mt-[7svh] max-w-[34ch] md:ml-[calc(56px+min(24vw,280px)+3px+2rem)]">
          <p data-lit className="k-jl k-jset font-text text-[clamp(1.25rem,2.2vw,2rem)] leading-[1.35]">
            Values don&rsquo;t matter because they&rsquo;re written.
          </p>
          <p data-lit className="k-jl k-jset font-text text-[clamp(1.25rem,2.2vw,2rem)] leading-[1.35]">
            They matter because they&rsquo;re lived.
          </p>
        </div>
      </div>

      <Furniture scene={SCENE} />
    </section>
  );
}
