"use client";

import Link from "next/link";
import { useState } from "react";
import { SCENES, PLATES, inkFor, goldFor, type Plate } from "@/lib/journey-spine";
import Furniture from "./Furniture";
import { useLit } from "./useLit";

/**
 * SCENE 17 — THE NEXT JOURNEY.
 *
 * ============================================================================
 * THE FILM STOPS AND BECOMES A DOCUMENT
 * ============================================================================
 * Reference: Waka Waka's catalogue-raisonné index. After sixteen scenes of
 * motion, this is the only scene where scrolling reveals but never
 * transforms: every element settles once, 14px into place, and is then
 * permanently still. The one thing that keeps moving is a number.
 *
 * THE MANUSCRIPT MARGIN is the scene's whole grammar: every word the SITE
 * says lives in the left margin, every word MARK says lives in the measure.
 * The man speaks in the column, the institution annotates in the margin,
 * which is the typographic form of the page's man-versus-institution rule.
 *
 * THE INDEX IS A RECORD OF THE ARCHIVE, NOT A MAP OF THE PAGE. The spine's
 * register is printed in full, in register order, grouped into its bodies of
 * work. There is no SCENE column and no thumbnail: ten of the road frames
 * appear in no scene, and an archive is allowed to be larger than the film
 * made from it, but a usage column with ten blanks would read as ten
 * mistakes. The photographs appearing as lines of type is the point; the
 * moment an image reappears here the scene has no argument left.
 *
 * THE COUNTER. Its server-rendered state is the finished count, because
 * wrong-but-final beats zero-and-stuck if the script dies (the same failure
 * class as the reveal trap recorded on this project). A running page counts
 * it up from the first row it sees, derived from the highest settled row,
 * monotonic: miles do not un-accumulate.
 *
 * THE THESIS owns the page's one dramatic weight step: "Trust isn't given."
 * at a whisper, "It's earned." at full black. Four other scenes wanted this
 * device; this is the one that keeps it.
 */

const SCENE = SCENES[16];

/** Short subjects for the record, one per plate, in the site's voice. */
const SUBJECTS: Record<string, string> = {
  "s02-jamaica-childhood": "Two children, frangipani bush",
  "s02b-caribbean-water": "Shallow water, pale sand",
  "s12c-night-highway": "Interstate at night",
  "s12-predawn-peaks": "Peaks before sunrise",
  "s12b-predawn-peaks-alt": "Treeline below peaks",
  "s13-first-daylight": "Sky lifting over the interstate",
  "s04-dawn-road-mist": "Two lanes into morning mist",
  "s11-sunrise-band": "Sunrise band on the horizon",
  "s11b-sunrise-cloud": "Sunrise cloud over an empty road",
  "s05-sunrise-horizon": "Sun breaking the horizon",
  "s07-pines-road": "Road through pine forest",
  "s16-valley-from-height": "Valley road from height",
  "gal-alpine-lake": "Alpine lake, snow on the ridge",
  "gal-river-rocks": "River running over rocks",
  "gal-waterfall-figure": "Waterfall, a figure at its foot",
  "s08-desert-bend": "Desert highway bending away",
  "s08b-rockcut-bend": "Curve through a rock cut",
  "s06-wide-horizon": "Wide horizon opening out",
  "hero-two-lane-centred": "Two lanes toward a treeline",
  "hero-sage-plain": "Highway across a sage plain",
  "s09-interstate-traffic": "Interstate traffic, daylight",
  "s09b-elevated-traffic": "Traffic from an elevated stretch",
  "s10-endless-road": "Empty road to the horizon",
  "s14-confident-highway": "Open highway in full sun",
  "s17-road-to-horizon": "The road, sun high",
  "hero-open-road-blue": "Open road, wide blue sky",
  "jobsite-bay": "Warehouse bay, scissor lifts",
  "jobsite-install": "Fitting a light, high ceiling",
  "jobsite-fixtures": "Fixtures staged in rows",
  "mark-portrait": "Mark Brown, studio",
  "mark-portrait-a": "Mark Brown, stage light",
  "mark-portrait-b": "Mark Brown, stage light",
};

/** A margin-plus-measure row: the scene's entire layout grammar. */
function Margined({
  label,
  gold,
  children,
  className,
}: {
  label?: string;
  gold?: string | null;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`md:grid md:grid-cols-[180px_1fr] md:gap-x-10 ${className ?? ""}`}>
      <p className="mb-3 font-display text-[11px] font-medium uppercase tracking-[0.2em] md:mb-0 md:text-right" style={gold ? { color: gold } : undefined}>
        {label ?? ""}
      </p>
      <div>{children}</div>
    </div>
  );
}

export default function Scene17Next() {
  const [seen, setSeen] = useState(PLATES.length);
  const [complete, setComplete] = useState(true);

  // Declared FIRST so its scope claims the index rows before the outer scope
  // queries the whole section. Rows settle low, near the bottom edge, so the
  // table is written up from the bottom like a page proof, and the counter is
  // derived from the highest settled row, never incremented.
  const indexRef = useLit<HTMLDivElement>({
    rootMargin: "0px 0px -8% 0px",
    onLit: (count) => {
      setSeen((prev) => {
        const next = prev === PLATES.length && count === 1 ? 1 : Math.max(prev, count);
        return next;
      });
      setComplete(count >= PLATES.length);
    },
  });
  const rootRef = useLit<HTMLElement>();

  const ink = inkFor(SCENE);
  const gold = goldFor(SCENE);

  let lastGroup: Plate["group"] | null = null;

  return (
    <section
      id={SCENE.slug}
      ref={rootRef}
      aria-labelledby={`${SCENE.slug}-heading`}
      className="relative"
      style={{
        minHeight: `${SCENE.vh}svh`,
        background: SCENE.from,
        color: ink,
      }}
    >
      <div className="mx-auto w-full max-w-[1296px] px-5 pt-[16svh] md:px-10 lg:px-24">
        {/* [A] THE SUMMATION. Four sentences, each settling on its own
            trigger, so the reader's hand sets the pace. */}
        <Margined>
          <div className="max-w-[24ch]">
            <h2 id={`${SCENE.slug}-heading`} data-lit className="k-jl k-jset font-display text-[clamp(1.625rem,3.4vw,3rem)] font-medium leading-[1.18] tracking-[-0.015em]">
              Every mile I&rsquo;ve traveled&hellip;
            </h2>
            <p data-lit className="k-jl k-jset font-display text-[clamp(1.625rem,3.4vw,3rem)] font-medium leading-[1.18] tracking-[-0.015em]">
              Every lesson I&rsquo;ve learned&hellip;
            </p>
            <p data-lit className="k-jl k-jset font-display text-[clamp(1.625rem,3.4vw,3rem)] font-medium leading-[1.18] tracking-[-0.015em]">
              Every promise I&rsquo;ve chosen to keep&hellip;
            </p>
            <p data-lit className="k-jl k-jset relative mt-6 font-display text-[clamp(1.625rem,3.4vw,3rem)] font-semibold leading-[1.18] tracking-[-0.015em]">
              <span aria-hidden="true" className="absolute -left-14 top-[0.65em] hidden h-px w-10 md:block" style={{ background: gold ?? "currentColor" }} />
              Has led to this moment.
            </p>
          </div>
        </Margined>

        {/* [B] THE TURN. */}
        <Margined className="mt-[14svh]">
          <div className="max-w-[34ch]">
            <p data-lit className="k-jl k-jset font-text text-[clamp(1.125rem,1.9vw,1.625rem)] leading-[1.45]">
              Not because my journey is complete.
            </p>
            <p data-lit className="k-jl k-jset font-text text-[clamp(1.125rem,1.9vw,1.625rem)] leading-[1.45]">
              But because it&rsquo;s finally ready&hellip; to serve yours.
            </p>
          </div>
        </Margined>

        {/* [C] THE SILENCE, NAMED. Empty ground, and the site saying what
            the man is doing. Then the thesis, which does not settle: in a
            scene where everything arrives, it was always already there. */}
        <Margined label="Silence" className="mt-[12svh]">
          <div aria-hidden="true" className="h-[16svh] md:h-[22svh]" />
        </Margined>
        <Margined>
          <div>
            <p data-lit className="k-jl k-s17-thesis font-display text-[clamp(2.75rem,7.4vw,6rem)] leading-[1.04] tracking-[-0.025em]" style={{ fontWeight: 200 }}>
              Trust isn&rsquo;t given.
            </p>
            <p data-lit className="k-jl k-s17-thesis font-display text-[clamp(2.75rem,7.4vw,6rem)] font-black leading-[1.04] tracking-[-0.025em]">
              It&rsquo;s earned.
            </p>
          </div>
        </Margined>

        {/* [D] THE CADENCE. The site starts counting his sentences here,
            two hundred pixels before the index: that is the hinge. */}
        <div className="mt-[10svh] flex flex-col gap-4">
          {["One mile.", "One decision.", "One relationship at a time."].map((line, i) => (
            <Margined key={line} label={String(i + 1).padStart(2, "0")}>
              <p data-lit className="k-jl k-jset font-display text-[clamp(1.5rem,3vw,2.625rem)] font-medium leading-[1.15] tracking-[-0.015em]">
                {line}
              </p>
            </Margined>
          ))}
        </div>

        {/* [E] THE TWO DOORS. The story has opened the front door; these are
            the handles. */}
        <Margined label="Continue" className="mt-[12svh]">
          <div>
            <p data-lit className="k-jl k-jset max-w-[40ch] font-text text-[clamp(1.0625rem,1.7vw,1.5rem)] leading-[1.5]">
              Whenever you&rsquo;re ready&hellip; we&rsquo;ll be honored&hellip;
              to take the next one with you.
            </p>
            <div className="mt-8 grid max-w-[720px] grid-cols-1 gap-8 sm:grid-cols-2">
              {[
                { label: "Request a rate", path: "/quote" },
                { label: "What we haul", path: "/services" },
              ].map((door) => (
                <Link key={door.path} href={door.path} className="k-s17-door group block outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-current">
                  <span className="font-display text-[clamp(1.25rem,2vw,1.75rem)] font-semibold leading-[1.2] tracking-[-0.01em]">
                    {door.label}
                  </span>
                  <span className="mt-2 block font-display text-[11px] font-medium uppercase tracking-[0.1em]">
                    {door.path}
                  </span>
                  <span aria-hidden="true" className="k-s17-door-rule mt-3 block h-px w-full" />
                </Link>
              ))}
            </div>
          </div>
        </Margined>
      </div>

      {/* [F] THE PLATE INDEX. Full width, breaking the margin rule once,
          deliberately: the archive is bigger than either voice. */}
      <nav aria-label="Plate index" className="mx-auto mt-[14svh] w-full max-w-[1296px] px-5 md:px-10 lg:px-24">
        <a
          href="#journey-sign-off"
          className="sr-only focus:not-sr-only focus:inline-block focus:py-2 focus:font-display focus:text-[11px] focus:font-medium focus:uppercase focus:tracking-[0.1em]"
        >
          Skip the plate index
        </a>

        <div className="sticky top-0 z-10 flex items-baseline justify-between gap-6 border-b py-4 font-display text-[11px] font-medium uppercase tracking-[0.1em]" style={{ background: SCENE.from, borderColor: "color-mix(in srgb, currentColor 20%, transparent)" }}>
          <span>Plate index</span>
          <span className="hidden md:inline">The Journey, 2026</span>
          <span aria-live="off" className="relative tabular-nums">
            Plates {String(seen).padStart(2, "0")} / {PLATES.length}
            <span
              aria-hidden="true"
              className="absolute -bottom-[5px] right-0 h-px w-10 transition-opacity duration-300"
              style={{ background: gold ?? "currentColor", opacity: complete ? 1 : 0 }}
            />
          </span>
        </div>

        <div ref={indexRef}>
          {/* Column heads, in the record's own voice. */}
          <div className="hidden grid-cols-[72px_1fr_180px_220px] gap-x-4 border-b py-2 font-display text-[11px] font-medium uppercase tracking-[0.1em] md:grid" style={{ borderColor: "color-mix(in srgb, currentColor 20%, transparent)" }}>
            <span>Plate</span>
            <span>Subject</span>
            <span>When</span>
            <span className="text-right">File</span>
          </div>

          <ol>
            {PLATES.map((p) => {
              const header = p.group !== lastGroup ? p.group : null;
              lastGroup = p.group;
              return (
                <li key={p.n}>
                  {header ? (
                    <p className="mt-6 border-b pb-2 font-display text-[11px] font-medium uppercase tracking-[0.2em]" style={{ borderColor: "color-mix(in srgb, currentColor 20%, transparent)" }}>
                      {header}
                    </p>
                  ) : null}
                  <div
                    data-lit
                    className="k-jl k-jset k-s17-row grid grid-cols-[72px_1fr] gap-x-4 gap-y-1 border-b py-3 md:grid-cols-[72px_1fr_180px_220px]"
                    style={{ borderColor: "color-mix(in srgb, currentColor 10%, transparent)" }}
                  >
                    <span className="font-display text-[11px] font-medium uppercase tabular-nums tracking-[0.1em]">
                      PL. {String(p.n).padStart(2, "0")}
                    </span>
                    <span className="font-text text-[14px] leading-[1.5]">{SUBJECTS[p.file] ?? p.alt}</span>
                    <span className="col-start-2 font-display text-[11px] font-medium uppercase tracking-[0.1em] md:col-start-auto md:pt-[3px]">
                      {p.when ?? ""}
                    </span>
                    <span className="col-start-2 break-all font-display text-[11px] font-medium tracking-[0.02em] [font-variant-ligatures:none] md:col-start-auto md:pt-[3px] md:text-right">
                      {p.file}
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* THE COLOPHON. What this record is, stated plainly. */}
        <Margined label="Colophon" className="mt-[8svh]">
          <div className="max-w-[52ch] font-text text-[15px] leading-[1.6]">
            <p>
              This page is a record, not a brochure. Thirty-two plates from
              Mark Brown&rsquo;s own archive: twenty-four frames of road
              photographed through a windscreen over eleven years, two frames
              of Jamaica, three of a working life from 2021 to 2022, and three
              portraits. No photograph was staged, purchased, or generated.
              Three chapters of the story have no photograph at all, and the
              page says so rather than dressing the absence up.
            </p>
            <p className="mt-4 font-display text-[11px] font-medium uppercase tracking-[0.1em]">
              Set in Archivo and Inter
            </p>
          </div>
        </Margined>
      </nav>

      {/* [G] THE SIGN-OFF. The last thing on the page is ground. */}
      <div id="journey-sign-off" className="mx-auto w-full max-w-[1296px] px-5 pb-[22svh] pt-[12svh] md:px-10 lg:px-24">
        <Margined label="End">
          <p data-lit className="k-jl k-s17-thesis max-w-[24ch] font-text text-[clamp(1.375rem,2.6vw,2.25rem)] leading-[1.35]">
            Thank you for taking this journey with us.
          </p>
        </Margined>
      </div>

      <Furniture scene={SCENE} />
    </section>
  );
}
