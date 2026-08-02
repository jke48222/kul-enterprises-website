"use client";

import Image from "next/image";
import { SCENES, inkFor, plate } from "@/lib/journey-spine";
import Furniture from "./Furniture";
import { useLit } from "./useLit";

/**
 * SCENE 13 — THE PROMISE.
 *
 * ============================================================================
 * THE PAPERWORK AND THE PROMISE, SIDE BY SIDE
 * ============================================================================
 * Reference: Locomotive's typographic planes. The original spec was a 380vh
 * parallax pin in which the filings streamed past while the vows held still;
 * the spine re-budgeted the scene to ordinary flow, and what survives is the
 * content of that idea rather than its physics: the paperwork stands in the
 * margin as a ledger, in the site's own 11px furniture voice, typographically
 * indistinguishable from the page's record-keeping, and the promise column
 * carries everything Mark actually said. Paperwork is the institution
 * talking; the promise is a man talking. The two never share a typeface.
 *
 * THE FILING LIST IS REAL AND GENERIC, AND MUST STAY THAT WAY. Sixteen
 * filings a US motor carrier actually makes, names only: no numbers, no
 * dates, no seals, no signatures, no paper facsimile. The moment it carries
 * a number it stops being a texture of bureaucracy and becomes a fabricated
 * document. It is aria-hidden, because it is scenery.
 *
 * GOLD DOES NOT APPEAR IN THIS SCENE, and that is arithmetic, not taste:
 * both golds fail even the 3:1 non-text floor on this ground. goldFor() in
 * the spine returns null here. The vows' ticks are ink.
 *
 * The vows settle in once, one-way, from a server-rendered visible state
 * (the hiding is scoped to .is-armed, the same contract as every scene).
 * There are no opacity floors on this ground: a dim state on a mid grey is
 * unreadable, so nothing here is ever dimmed, only briefly not-yet-settled
 * while the page is provably alive.
 */

const SCENE = SCENES[12];

/** His words and the ledger's names, edited at /admin. */
export type Scene13Copy = {
  filingsLabel: string;
  filings: string[];
  coupletA: string;
  coupletB: string;
  hinge: string;
  vows: string[];
  closer: string;
  lesson: string;
  lessonWord: string;
};

export default function Scene13Promise({ copy }: { copy: Scene13Copy }) {
  const rootRef = useLit<HTMLElement>();
  const ink = inkFor(SCENE);

  return (
    <section
      id={SCENE.slug}
      ref={rootRef}
      aria-labelledby={`${SCENE.slug}-heading`}
      className="relative overflow-hidden"
      style={{
        minHeight: `${SCENE.vh}svh`,
        background: `linear-gradient(180deg, ${SCENE.from} 0%, ${SCENE.to} 100%)`,
        color: ink,
      }}
    >
      {/* FIRST FULL DAYLIGHT, the screenplay's setting for the promise. The
          sky photograph is LIGHTENED toward the ground rather than darkened,
          so ink holds over every pixel of it, and it is double-feathered so
          it emerges from the page. It drifts slowly; the promise does not. */}
      <div aria-hidden="true" className="absolute inset-y-0 right-0 w-full md:w-[72%]">
        <Image
          src="/images/journey/s13-first-daylight.webp"
          alt=""
          fill
          sizes="72vw"
          className="k-s13-day k-drift object-cover"
          style={{ objectPosition: "50% 30%" }}
        />
      </div>
      <p className="sr-only">{plate("s13-first-daylight").alt}</p>

      <div className="relative mx-auto grid w-full max-w-[1296px] grid-cols-1 gap-x-14 px-5 py-[12svh] pb-[20svh] md:grid-cols-[240px_1fr] md:px-10 lg:px-24">
        {/* THE FILING LANE. The institution's texture, in the institution's
            voice, at the institution's size. Scenery, not information. */}
        {/* On a phone the ledger follows the words that explain it; on the
            wide page it stands beside them as a margin. */}
        <div aria-hidden="true" className="order-last mt-12 md:order-none md:mt-0">
          <p className="font-display text-[11px] font-medium uppercase tracking-[0.2em] opacity-[0.72]">
            {copy.filingsLabel}
          </p>
          <ul className="mt-4 columns-2 gap-8 font-display text-[11px] font-medium uppercase leading-[2.2] tracking-[0.1em] opacity-[0.72] md:columns-1">
            {copy.filings.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          {/* The closer travels up the lane the paperwork occupied: his one
              sentence set where the filings were, after they end. */}
          <p className="mt-8 max-w-[16ch] font-text text-[clamp(1.125rem,1.7vw,1.5rem)] leading-[1.4]">
            {copy.closer}
          </p>
        </div>

        <div>
          <p data-lit className="k-jl k-jset font-text text-[clamp(1.0625rem,1.7vw,1.5rem)] leading-[1.5]">
            {copy.coupletA}
          </p>
          <p data-lit className="k-jl k-jset font-text text-[clamp(1.0625rem,1.7vw,1.5rem)] leading-[1.5]">
            {copy.coupletB}
          </p>

          <h2
            id={`${SCENE.slug}-heading`}
            data-lit
            className="k-jl k-jset mt-[6svh] max-w-[16ch] font-display text-[clamp(2rem,4.6vw,4rem)] font-black leading-[1.05] tracking-[-0.02em]"
          >
            {copy.hinge}
          </h2>

          <ul className="mt-[7svh] flex max-w-[46ch] flex-col gap-6">
            {copy.vows.map((vow, i) => (
              <li key={vow} data-lit className="k-jl k-jset relative pl-7">
                {/* The tick is ink, on the spine of the list. Gold cannot
                    appear on this ground at all; see the spine's gold note. */}
                <span aria-hidden="true" className="k-s13-tick absolute left-0 top-[0.3em] h-5 w-[2px] origin-top bg-current" />
                <p
                  className={
                    i === copy.vows.length - 1
                      ? "font-text text-[clamp(1rem,1.5vw,1.3125rem)] leading-[1.55]"
                      : "font-text text-[clamp(1.125rem,1.9vw,1.625rem)] leading-[1.45]"
                  }
                >
                  {vow}
                </p>
              </li>
            ))}
          </ul>

          {/* The one labelled lesson on the light half. The label is ink here
              for the same reason the ticks are. */}
          <div className="mt-[8svh] flex max-w-[40ch] flex-col gap-4">
            <p className="font-display text-[11px] font-medium uppercase tracking-[0.2em]">{copy.lessonWord}</p>
            <span aria-hidden="true" className="h-[2px] w-16 bg-current" />
            <p className="font-text text-[clamp(1.125rem,2vw,1.75rem)] leading-[1.4]">
              {copy.lesson}
            </p>
          </div>
        </div>
      </div>

      <Furniture scene={SCENE} plateFile="s13-first-daylight" />
    </section>
  );
}
