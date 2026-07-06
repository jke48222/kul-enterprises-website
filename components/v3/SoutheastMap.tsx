"use client";

/**
 * SoutheastMap — Mark's "Regional Focus" interaction (design email §4):
 * FL / GA / TN / AL / SC softly illuminate on hover, a state "subtly
 * brightens or pulses." Built accessible-first per 17-v3-research §2C:
 *
 *  - Inline SVG; the five served states are real <path role="button">
 *    targets: keyboard-focusable (tabIndex=0), Enter/Space operable,
 *    aria-pressed state, visible labels (state conveyed by more than
 *    color — WCAG 2.1).
 *  - Neighboring states render dimmed, aria-hidden, non-interactive.
 *  - A plain-text state list sits beside the map as the always-readable
 *    fallback (no-JS / SEO / screen readers) and syncs highlights.
 *  - The pulse is motion-safe only; reduced motion gets static highlight.
 *  - HONESTY: only regions KUL actually serves illuminate; the footnote
 *    carries the nationwide-authority claim, no coverage inflation.
 *
 * Geometry is deliberately simplified silhouette cartography (hairline
 * weights, label-carried recognition) — not survey-accurate borders.
 */

import { useState } from "react";
import { m, useReducedMotion } from "framer-motion";
import { SE_SHAPES, SE_VIEWBOX } from "./seMapPaths";

type StateDatum = {
  id: string;
  name: string;
  note: string;
  d: string;
  label: [number, number];
};

/**
 * The five served states (design email: FL, GA, TN, AL, SC + surrounding).
 * Outlines and label anchors come from seMapPaths.ts — US Census boundary
 * data through an Albers projection, so proportions and borders are real.
 */
const STATES: StateDatum[] = [
  {
    id: "TN",
    name: "Tennessee",
    note: "Regional lanes north through Chattanooga, Nashville, and Knoxville.",
    d: SE_SHAPES.TN.d,
    label: SE_SHAPES.TN.centroid,
  },
  {
    id: "SC",
    name: "South Carolina",
    note: "Regional lanes east through Greenville and Columbia to the coast.",
    d: SE_SHAPES.SC.d,
    label: SE_SHAPES.SC.centroid,
  },
  {
    id: "GA",
    name: "Georgia",
    note: "Home base — Loganville dispatch, statewide coverage.",
    d: SE_SHAPES.GA.d,
    label: SE_SHAPES.GA.centroid,
  },
  {
    id: "AL",
    name: "Alabama",
    note: "Regional lanes west through Birmingham and Montgomery.",
    d: SE_SHAPES.AL.d,
    label: SE_SHAPES.AL.centroid,
  },
  {
    id: "FL",
    name: "Florida",
    note: "Panhandle and peninsula lanes, produce moving north.",
    d: SE_SHAPES.FL.d,
    label: SE_SHAPES.FL.centroid,
  },
];

/** Dimmed neighbors — context only, never interactive. */
const CONTEXT: { id: string; d: string }[] = [
  { id: "NC", d: SE_SHAPES.NC.d },
  { id: "MS", d: SE_SHAPES.MS.d },
];

export function SoutheastMap() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState<string>("GA");
  const [hovered, setHovered] = useState<string | null>(null);

  const current = STATES.find((s) => s.id === active) ?? STATES[2];
  const lit = (id: string) => id === active || id === hovered;

  const toggle = (id: string) => setActive(id);

  return (
    <div className="grid grid-cols-1 items-start gap-x-[clamp(24px,3vw,56px)] gap-y-10 lg:grid-cols-12">
      {/* The map */}
      <div className="lg:col-span-7">
        <svg
          viewBox={SE_VIEWBOX}
          role="group"
          aria-label="KUL Enterprises Southeast service area map"
          className="w-full"
        >
          {/* context neighbors — dimmed, decorative */}
          {CONTEXT.map((c) => (
            <path
              key={c.id}
              d={c.d}
              aria-hidden
              className="fill-ink/[0.025] stroke-ink/10"
              strokeWidth="1"
            />
          ))}

          {/* served states — interactive */}
          {STATES.map((s) => {
            const on = lit(s.id);
            return (
              <path
                key={s.id}
                d={s.d}
                role="button"
                tabIndex={0}
                aria-pressed={s.id === active}
                aria-label={`${s.name} — ${s.note}`}
                onClick={() => toggle(s.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggle(s.id);
                  }
                }}
                onMouseEnter={() => setHovered(s.id)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(s.id)}
                onBlur={() => setHovered(null)}
                className={`cursor-pointer outline-none transition-colors duration-300 ease-micro motion-reduce:transition-none ${
                  on
                    ? "fill-gold/25 stroke-gold"
                    : "fill-ink/[0.05] stroke-ink/25 hover:fill-ink/[0.1]"
                }`}
                strokeWidth={on ? 1.5 : 1}
              />
            );
          })}

          {/* soft pulse on the active state — motion-safe only */}
          {!reduced && (
            <m.circle
              key={active}
              cx={current.label[0]}
              cy={current.label[1]}
              r="14"
              className="pointer-events-none fill-none stroke-gold/60"
              strokeWidth="1"
              initial={{ scale: 0.7, opacity: 0.6 }}
              animate={{ scale: 1.8, opacity: 0 }}
              transition={{
                duration: 2,
                ease: "easeOut",
                repeat: Infinity,
                repeatDelay: 0.6,
              }}
              style={{ transformOrigin: `${current.label[0]}px ${current.label[1]}px` }}
              aria-hidden
            />
          )}

          {/* labels — state conveyed by more than color (WCAG 2.1) */}
          {STATES.map((s) => (
            <text
              key={`${s.id}-label`}
              x={s.label[0]}
              y={s.label[1]}
              textAnchor="middle"
              aria-hidden
              className={`pointer-events-none select-none text-[13px] uppercase tracking-[0.14em] transition-colors duration-300 ${
                lit(s.id) ? "fill-ink font-semibold" : "fill-ink/50"
              }`}
            >
              {s.id}
            </text>
          ))}
        </svg>

        {/* Active-state note — announced politely */}
        <p
          aria-live="polite"
          className="mt-4 min-h-12 border-t border-ink/10 pt-4 text-body text-graywarm-deep"
        >
          <span className="font-semibold text-ink">{current.name}.</span>{" "}
          {current.note}
        </p>
      </div>

      {/* The always-readable list — fallback + mirror control */}
      <div className="lg:col-span-5">
        <p className="text-micro uppercase text-ink/50">Where we run</p>
        <ul className="mt-4">
          {STATES.map((s) => (
            <li key={`list-${s.id}`} className="border-t border-ink/10 last:border-b">
              <button
                type="button"
                aria-pressed={s.id === active}
                onClick={() => toggle(s.id)}
                onMouseEnter={() => setHovered(s.id)}
                onMouseLeave={() => setHovered(null)}
                className="group flex min-h-[44px] w-full items-center justify-between gap-4 py-3.5 text-left"
              >
                <span
                  className={`text-[17px] transition-colors duration-200 ${
                    lit(s.id) ? "font-semibold text-ink" : "text-ink/70"
                  }`}
                >
                  {s.name}
                </span>
                <span
                  aria-hidden
                  className={`h-px w-10 transition-colors duration-200 ${
                    lit(s.id) ? "bg-gold" : "bg-ink/15"
                  }`}
                />
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-[44ch] text-body text-graywarm-deep">
          Beyond the Southeast, KUL carries nationwide authority — coast-to-coast
          lanes move under the same USDOT and the same standards.
        </p>
      </div>
    </div>
  );
}

export default SoutheastMap;
