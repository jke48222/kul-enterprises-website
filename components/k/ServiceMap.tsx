"use client";

import { useState } from "react";
import { site } from "@/lib/site";
import { MAP_STATES, MAP_VIEWBOX, HOME_BASE } from "@/lib/map-states";

/**
 * WHERE KUL RUNS
 *
 * The lower 48 with the home region picked out, the base marked, and a written
 * list of the states beside it.
 *
 * This is Mark's own request, spelled out in project-docs/18-v3-build-plan.md
 * §8.4, and it is the last of the named interactions from his brief to be
 * built. His spec set four conditions and all four are met here.
 *
 * ============================================================================
 * ONE. THE GEOGRAPHY IS REAL.
 * ============================================================================
 * The outlines are generated from public-domain GeoJSON and projected with
 * Albers, not drawn by hand. See lib/map-states.ts. On a page that asks a
 * broker to check everything, a state border in roughly the right place is
 * the wrong kind of shortcut.
 *
 * ============================================================================
 * TWO. IT ONLY CLAIMS WHAT KUL ACTUALLY DOES.
 * ============================================================================
 * Two levels, not one. The home region is Georgia and the five states it
 * borders, which is the area the site claims same-day and next-day coverage
 * in. Everywhere else in the lower 48 is drawn faint, because the operating
 * authority reaches it and a truck goes when a lane is booked. Those are
 * different promises and the map has to show them as different, or it is a
 * carrier colouring in the whole country.
 *
 * ============================================================================
 * THREE. COLOUR IS NEVER THE ONLY SIGNAL.
 * ============================================================================
 * WCAG 1.4.1. Every home state carries its abbreviation drawn on it, so the
 * region is legible in greyscale, to a colour-blind reader, and in a
 * screenshot. The hovered or focused state also names itself in full in the
 * readout beside the map. The fill is the least of the three signals.
 *
 * ============================================================================
 * FOUR. IT WORKS WITHOUT A POINTER AND WITHOUT SCRIPT.
 * ============================================================================
 * Every home state is a real <button>, so it is tabbable, operable with Enter
 * and Space, and announced with its name and pressed state. The written list
 * beside the map is not a fallback bolted on: it is the primary content for
 * anyone reading with their ears, for a crawler, and for anybody whose script
 * did not run, and it says exactly what the picture says.
 *
 * The SVG itself is `aria-hidden` where it is decorative and labelled where it
 * is not, so a screen reader is never made to walk 49 anonymous paths.
 */

/** The written region, in the order a reader would say them. */
const HOME_STATES = MAP_STATES.filter((s) => s.home);

export default function ServiceMap() {
  const [active, setActive] = useState<string | null>(null);
  const current = HOME_STATES.find((s) => s.code === active) ?? null;

  return (
    <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-20">
      <div className="order-2 flex w-full flex-col gap-6 lg:order-1 lg:w-[340px] lg:shrink-0">
        <div>
          <p className="font-text text-k-micro uppercase text-k-ink-faint">
            Home region
          </p>
          <p className="pt-3 font-text text-k-body text-k-ink">
            Same-day and next-day coverage across {HOME_STATES.length} states:{" "}
            {/* The written list. It is the content, not a caption. */}
            <span className="font-medium">
              {HOME_STATES.map((s) => s.name).join(", ")}.
            </span>
          </p>
        </div>

        <div className="border-t border-k-rule pt-6">
          <p className="font-text text-k-micro uppercase text-k-ink-faint">
            Everywhere else
          </p>
          <p className="pt-3 font-text text-k-body text-k-ink-soft">
            Operating authority is active in 48 states. Outside the home region
            a truck goes when the lane is booked rather than on a schedule, so
            ask before you count on it.
          </p>
        </div>

        <div className="border-t border-k-rule pt-6">
          <p className="font-text text-k-micro uppercase text-k-ink-faint">
            Dispatched from
          </p>
          <p className="pt-3 font-text text-k-body text-k-ink">
            {site.city}, {site.state} 30052
          </p>
        </div>
      </div>

      <div className="order-1 w-full lg:order-2 lg:flex-1">
        {/* The readout, and it says nothing until there is something to say.
            It used to read "Hover or tab a highlighted state" when idle, which
            is an instruction printed above a map that does not need one: the
            six states are gold, labelled, and sit under six buttons. The live
            region stays, because a keyboard user tabbing the buttons has to be
            told which state they landed on, and `min-h` holds the line so
            nothing below it jumps when the text arrives.

            Polite rather than assertive: it is an aside, not an alarm. */}
        <p
          aria-live="polite"
          className="min-h-[22px] pb-4 font-text text-k-small text-k-ink-soft"
        >
          {current ? (
            <span className="text-k-ink">
              {current.name}
              <span className="text-k-ink-soft"> · home region</span>
            </span>
          ) : null}
        </p>

        <svg
          viewBox={`0 0 ${MAP_VIEWBOX.width} ${MAP_VIEWBOX.height}`}
          className="h-auto w-full"
          role="img"
          aria-label={`Map of the lower 48 states with KUL's home region highlighted: ${HOME_STATES.map((s) => s.name).join(", ")}. Operating authority is active in 48 states.`}
        >
          {/* The rest of the country. Drawn first so the home region sits on
              top of it, and drawn faint because authority is not coverage. */}
          <g aria-hidden="true">
            {MAP_STATES.filter((s) => !s.home).map((s) => (
              <path
                key={s.code}
                d={s.d}
                className="fill-[#e6e6e6] stroke-[#fcfcfc]"
                strokeWidth={1.2}
              />
            ))}
          </g>

          {/* The home region. Each one is a button. */}
          <g>
            {HOME_STATES.map((s) => {
              const on = active === s.code;
              return (
                <g key={s.code}>
                  <path
                    d={s.d}
                    className={`cursor-pointer transition-colors duration-200 ${
                      on ? "fill-k-gold" : "fill-[#c9a25e]"
                    } stroke-[#fcfcfc]`}
                    strokeWidth={1.2}
                    onMouseEnter={() => setActive(s.code)}
                    onMouseLeave={() => setActive(null)}
                  />
                  {/* THE ABBREVIATION IS THE ACCESSIBLE SIGNAL, not decoration.
                      It is what makes the region readable when the fill cannot
                      be relied on. `paint-order: stroke` draws a white halo
                      behind the letters first, so two-letter codes stay legible
                      where a state is narrow and the gold runs under them. */}
                  <text
                    x={s.cx}
                    y={s.cy}
                    textAnchor="middle"
                    // `central` rather than `middle`: middle centres on the
                    // x-height and leaves two-letter caps sitting visibly high
                    // in the shape. The label positions themselves are the
                    // polygon's area centroid, computed in lib/map-states.ts,
                    // not the mean of the outline points, which on a coastal
                    // state drags the label out to sea.
                    dominantBaseline="central"
                    className="pointer-events-none select-none font-text text-[15px] font-semibold uppercase"
                    style={{
                      fill: "#2c2c2c",
                      stroke: "#fcfcfc",
                      strokeWidth: 3,
                      paintOrder: "stroke",
                    }}
                  >
                    {s.code}
                  </text>
                </g>
              );
            })}
          </g>

          {/* The base. A ring rather than a dot, so it reads as a location
              rather than as a state that got missed. */}
          <g aria-hidden="true">
            <circle cx={HOME_BASE.x} cy={HOME_BASE.y} r={9} fill="none" stroke="#2c2c2c" strokeWidth={1.6} />
            <circle cx={HOME_BASE.x} cy={HOME_BASE.y} r={3.2} fill="#2c2c2c" />
          </g>
        </svg>

        {/* THE BUTTONS. They are outside the SVG rather than inside it, and
            that is not laziness: a <button> inside SVG is not focusable in
            every browser, and the ones that do focus it do not all give it a
            visible ring. Out here they are ordinary buttons with ordinary
            focus behaviour, they carry the same hover state as the shapes, and
            they double as the tap targets on a phone, where hovering a state
            the size of a fingernail is not a real interaction. */}
        <ul className="flex flex-wrap gap-2 pt-5">
          {HOME_STATES.map((s) => (
            <li key={s.code}>
              <button
                type="button"
                aria-pressed={active === s.code}
                onMouseEnter={() => setActive(s.code)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(s.code)}
                onBlur={() => setActive(null)}
                onClick={() => setActive(active === s.code ? null : s.code)}
                className={`rounded-full border px-4 py-2 font-text text-k-micro uppercase transition-colors duration-200 ${
                  active === s.code
                    ? "border-k-gold bg-k-gold text-k-surface"
                    : "border-k-rule-strong text-k-ink-soft hover:border-k-ink hover:text-k-ink"
                }`}
              >
                {s.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
