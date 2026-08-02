"use client";

import Image from "next/image";
import { useRef } from "react";
import { SCENES, inkFor, goldFor, plate, plateLabel } from "@/lib/journey-spine";
import Furniture from "./Furniture";
import { useLit } from "./useLit";

/**
 * SCENE 09 — EARNING TRUST.
 *
 * ============================================================================
 * THE STRATA: NOTHING THAT CAME BEFORE IS THROWN AWAY
 * ============================================================================
 * Reference: Readymag's perspective deck, reduced to what the idea actually
 * needs. In a normal card section the new card covers and erases the old one.
 * Here the opposite is the point: eight responsibilities in a flush-left
 * stack of hairline-ruled plates, ragged right like paper, every one still
 * present and countable at the end. "Trust is earned long before it's ever
 * expected" is a sentence about the layers underneath, so the layers stay.
 *
 * The original 620vh pin was cut by the coherence review and the spine
 * re-budgeted the scene to ordinary flow; the spec's own no-JS state ("this
 * exact same state is also the whole scene") is what ships, with a small
 * settle entrance per stratum.
 *
 * ============================================================================
 * WHY THE PHOTOGRAPHS ARE HERE AND NOT IN SCENE 3
 * ============================================================================
 * jobsite-bay, jobsite-install and jobsite-fixtures are phone photographs
 * from November 2021 to May 2022: Mark's WORKING LIFE, a man running crews
 * and installations. Scene 3 nearly used them for his 1990s childhood, which
 * would have been a lie; this scene is the chapter those photographs are
 * actually from, so this is where the archive gets to speak. They are placed
 * in date order, which also keeps their plate numbers ascending.
 *
 * The field note travels with them: seventeen seconds of Mark on a jobsite
 * in 2022, hard hat and hi-vis, with sound. It is motion, so it has no plate
 * number, and it never autoplays: the reader asks for it, which is also what
 * makes its audio allowed.
 *
 * No card has an icon, a heading, a button or a radius; no shadow exists in
 * the scene; the fills are alpha-white over the light arc so they change with
 * the sunrise instead of sitting on it. Those are the tells that keep eight
 * stacked rectangles from reading as a product-feature stack.
 */

const SCENE = SCENES[8];

const DESIGN: ReadonlyArray<{ width: string; photo?: string; note?: boolean }> = [
  { width: "min(46rem, 100%)" },
  { width: "min(35rem, 92%)" },
  { width: "min(44rem, 100%)", photo: "jobsite-bay" },
  { width: "min(44rem, 100%)", photo: "jobsite-install" },
  { width: "min(40rem, 96%)" },
  { width: "min(45rem, 100%)", photo: "jobsite-fixtures", note: true },
  { width: "min(39rem, 94%)" },
  { width: "min(44rem, 100%)" },
];

/** His words, edited at /admin; which strata carry photographs is the
 *  register's business and stays above. */
export type Scene09Copy = {
  cards: string[];
  note: string;
  /** Mark's words in the film, verbatim. Empty until he supplies them; the
   *  dialog shows them under the video so the note is readable as well as
   *  hearable. WCAG 1.2.2 is only genuinely met once this is filled in. */
  transcript: string;
  lesson: string;
  lessonWord: string;
};

export default function Scene09Trust({ copy }: { copy: Scene09Copy }) {
  const rootRef = useLit<HTMLElement>();
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const ink = inkFor(SCENE);
  const gold = goldFor(SCENE);

  const openNote = () => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    // Called from the click itself, so this is a real user gesture and the
    // sound is the reader's own decision.
    videoRef.current?.play().catch(() => {
      // Autoplay policy said no. The controls are right there.
    });
  };

  const closeNote = () => {
    videoRef.current?.pause();
    dialogRef.current?.close();
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
        <h2 id={`${SCENE.slug}-heading`} className="sr-only">
          Earning trust
        </h2>

        <ol>
          {copy.cards.map((text, i) => {
            const card = DESIGN[Math.min(i, DESIGN.length - 1)];
            return (
            <li
              key={text}
              data-lit
              className="k-jl k-s09-card mt-3 first:mt-0"
              style={{ maxWidth: card.width, "--lit-floor": "0.66" } as React.CSSProperties}
            >
              <div className="flex items-start gap-5 p-5 md:gap-7 md:p-7">
                <span
                  className="pt-1 font-display text-[11px] font-medium uppercase tabular-nums tracking-[0.1em]"
                  style={{ color: gold ?? "currentColor" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-1 flex-col gap-5 md:flex-row md:items-center md:gap-7">
                  {card.photo ? (
                    <figure className="w-full max-w-[280px] shrink-0">
                      <div className="relative aspect-[4/3] w-full overflow-hidden">
                        <Image
                          src={`/images/journey/${card.photo}.webp`}
                          alt={plate(card.photo).alt}
                          fill
                          sizes="280px"
                          className="object-cover"
                        />
                      </div>
                      <figcaption className="mt-2 flex items-baseline justify-between gap-4 font-display text-[11px] font-medium uppercase tracking-[0.1em] opacity-[0.72]">
                        <span className="tabular-nums">{plateLabel(card.photo)}</span>
                        {plate(card.photo).when ? <span>{plate(card.photo).when}</span> : null}
                      </figcaption>
                    </figure>
                  ) : null}
                  <p className="font-text text-[clamp(1.125rem,1.9vw,1.625rem)] leading-[1.35]">
                    {text}
                  </p>
                </div>
              </div>
              {card.note ? (
                <div className="border-t px-5 py-3 md:px-7" style={{ borderColor: "color-mix(in srgb, currentColor 14%, transparent)" }}>
                  {/* THE FIELD NOTE. A record with sound, so it is a request,
                      never an ambush. It has no plate number: motion is not
                      part of the photographic register and numbering it would
                      make the register claim something untrue. */}
                  <button
                    type="button"
                    onClick={openNote}
                    className="k-s09-note relative font-display text-[11px] font-medium uppercase tracking-[0.1em] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
                  >
                    {copy.note}
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-1 left-0 h-px w-full"
                      style={{ background: gold ?? "currentColor" }}
                    />
                  </button>
                </div>
              ) : null}
            </li>
            );
          })}
        </ol>

        {/* The one labelled lesson in this act. The label is the site's voice
            reading the stack back; the sentence is his. */}
        <div className="mt-[9svh] flex max-w-[36ch] flex-col gap-4">
          <p
            className="font-display text-[11px] font-medium uppercase tracking-[0.2em]"
            style={{ color: gold ?? "currentColor" }}
          >
            {copy.lessonWord}
          </p>
          <p className="font-text text-[clamp(1.25rem,2.2vw,2rem)] leading-[1.35]">
            {copy.lesson}
          </p>
        </div>
      </div>

      {/* THE DIALOG. Native, modal, focus-trapped by the platform; Esc and the
          backdrop both close it, and closing pauses the sound. */}
      <dialog
        ref={dialogRef}
        onClick={(e) => {
          if (e.target === dialogRef.current) closeNote();
        }}
        onClose={() => videoRef.current?.pause()}
        aria-label="Field note. A short video from 2022, with sound."
        className="k-s09-dialog"
      >
        <div className="flex items-baseline justify-between gap-6 pb-3">
          <p className="font-display text-[11px] font-medium uppercase tracking-[0.1em] text-[#FCFCFC]">
            Field note · 2022 · 0:17 · Sound
          </p>
          <button
            type="button"
            onClick={closeNote}
            aria-label="Close the field note"
            className="flex h-8 w-8 items-center justify-center font-display text-[15px] leading-none text-[#FCFCFC] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FCFCFC]"
          >
            ×
          </button>
        </div>
        <video
          ref={videoRef}
          controls
          playsInline
          preload="metadata"
          poster="/videos/mark-fieldnote-poster.jpg"
          className="max-h-[70svh] w-full bg-black object-contain"
        >
          <source src="/videos/mark-fieldnote.mp4" type="video/mp4" />
        </video>
        {/* The transcript, once Mark writes it down. Until then the absence
            is honest: nothing here invents his speech. */}
        {copy.transcript ? (
          <p className="mt-4 max-h-[20svh] overflow-y-auto font-text text-[13px] leading-[1.6] text-[#FCFCFC]">
            {copy.transcript}
          </p>
        ) : null}
      </dialog>

      <Furniture scene={SCENE} />
    </section>
  );
}
