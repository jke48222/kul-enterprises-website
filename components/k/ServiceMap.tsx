"use client";

import { useState } from "react";
import { site } from "@/lib/site";
import { fill } from "@/lib/content";
import contactPage from "@/content/pages/contact.json";
import { MAP_STATES, MAP_VIEWBOX, HOME_BASE } from "@/lib/map-states";

/**
 * The legend's words, from the contact page's map group in the CMS. The
 * facts beside them stay derived: the state count, the state list and the
 * city all come from the map data and Business Facts, so the words can be
 * reworded without the figures ever drifting from the drawing.
 */
const t = contactPage.map;

/**
 * WHERE KUL RUNS
 *
 * The lower 48 with the home region picked out, the base marked, and a written
 * list of the states beside it.
 *
 * This began as Mark's own request, spelled out in project-docs/18-v3-build-plan.md
 * §8.4. At his first walkthrough (project-docs/32) the hover titles that
 * named a state in full ("Alabama · home region") were removed at his word,
 * and on 9 Aug Jalen confirmed the interaction itself stays: the state
 * buttons and the hover highlight are back, and the only thing that remains
 * gone is the printed title. The live announcement survives for screen
 * readers alone, and it says the state's name and nothing else. Do not give
 * it a visible rendering back without Mark asking for it.
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
 * screenshot. With the printed readout gone, the abbreviations and the
 * written list beside the map are the remaining always-visible signals,
 * which is why neither may be removed.
 *
 * ============================================================================
 * FOUR. IT WORKS WITHOUT A POINTER AND WITHOUT SCRIPT.
 * ============================================================================
 * Every home state has a real <button> under the map, so the interaction is
 * tabbable, operable with Enter and Space, and announced by name. The
 * written list beside the map is the primary content for anyone reading
 * with their ears, for a crawler, and for anybody whose script did not run,
 * and it says exactly what the picture says.
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
            {fill(t.homeRegionLabel)}
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
            {fill(t.elsewhereLabel)}
          </p>
          <p className="pt-3 font-text text-k-body text-k-ink-soft">
            {fill(t.elsewhereBody)}
          </p>
        </div>

        <div className="border-t border-k-rule pt-6">
          <p className="font-text text-k-micro uppercase text-k-ink-faint">
            {fill(t.dispatchedLabel)}
          </p>
          <p className="pt-3 font-text text-k-body text-k-ink">
            {site.city}, {site.state} 30052
          </p>
        </div>
      </div>

      <div className="order-1 w-full lg:order-2 lg:flex-1">
        {/* The announcement a keyboard reader needs when a state button takes
            focus. SCREEN-READER-ONLY BY CLIENT INSTRUCTION: the printed
            "Alabama · home region" title this used to render was removed at
            the first walkthrough, and only the interaction came back. */}
        <p aria-live="polite" className="sr-only">
          {current ? current.name : null}
        </p>

        <svg
          viewBox={`0 0 ${MAP_VIEWBOX.width} ${MAP_VIEWBOX.height}`}
          className="h-auto w-full"
          role="img"
          // The sentence is the CMS field; the state list is the map's own,
          // spliced in where the field writes {states} so the words can never
          // name states the drawing does not shade.
          aria-label={fill(t.ariaDescription).replace(
            "{states}",
            HOME_STATES.map((s) => s.name).join(", "),
          )}
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

          {/* The home region. Hover lights a state; the buttons below do the
              same job for keyboards and phones. */}
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
                    // in the shape. Where each label sits is decided in
                    // lib/map-states.ts, which explains why Florida's is not
                    // worked out the same way as everybody else's.
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
            focus behaviour, they carry the same hover state as the shapes,
            and they double as the tap targets on a phone, where hovering a
            state the size of a fingernail is not a real interaction. */}
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
