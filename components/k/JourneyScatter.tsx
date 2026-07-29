"use client";

import Image from "next/image";
import { useRef } from "react";
import { m, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import HeroVideo from "@/components/k/HeroVideo";

/**
 * THE CONTACT SHEET, STREAMING
 *
 * Eleven years of photographs going past in columns while one sentence is held
 * still in the middle of them, and then the whole field clears and you are
 * looking through the windscreen they were all taken from.
 *
 * TAKEN FROM waabi.ai, from a screen recording the client sent. Their device:
 * a field of small rounded thumbnails arranged in vertical columns, each column
 * travelling at its own speed and some of them travelling upward while others
 * travel down, with a short centred statement sitting still in a clear channel
 * down the middle. Scroll on and the field empties and resolves onto a single
 * large image with a headline beside it.
 *
 * WHY IT BELONGS IN THIS CHAPTER AND NOWHERE ELSE ON THE SITE. Chapter five is
 * the only place with more photographs than it can show. Twenty-six survived the
 * curation and eleven of them run in the sequence below; the rest have nowhere
 * to be. A streaming contact sheet is what you do with a body of work too large
 * to lay out, and it says something true before a word is read: this man has
 * been driving for a very long time and these are not the only three pictures
 * he has.
 *
 * WHAT IT RESOLVES ONTO IS THE POINT. Waabi land on a photograph of a truck.
 * This lands on Mark's own dashcam film, moving, because the sentence the reader
 * has been holding still with says every photograph from here on was taken
 * through a windscreen. The field of stills clears and the windscreen is there,
 * running. Then the sequence below plays the eleven in the order the light runs.
 * Stills, then the thing that took them, then the stills in order.
 *
 * ============================================================================
 * THE THREE THINGS THAT MAKE OR BREAK IT
 * ============================================================================
 *
 * THE MIDDLE IS KEPT CLEAR. The columns are positioned out to the edges and
 * nothing is allowed into the channel the sentence occupies. Waabi do the same
 * and it is the only reason the type is readable: a scrim over a field of
 * moving pictures would dim the pictures to nothing, and putting the words on
 * top of moving thumbnails is unreadable at any scrim strength.
 *
 * COLUMNS TRAVEL IN BOTH DIRECTIONS. If they all go the same way it reads as
 * the page scrolling faster, which is a bug rather than an effect. Alternating
 * up and down is what makes it read as a field being crossed.
 *
 * NOTHING IS TIED TO A TIMER. Every position is a function of scroll offset, so
 * the field is exactly where the reader left it when they scroll back up.
 *
 * REDUCED MOTION gets the same photographs in the same places, standing still,
 * switched over in CSS that the server sends in the first byte. See the
 * prefers-reduced-motion block in app/globals.css. Nothing is withheld: the
 * sentence and every picture are still there.
 */

export type ScatterTile = { src: string; alt: string };

/**
 * Six columns, three banked against each edge, and how far each travels as a
 * fraction of the scroll. Negative goes up, positive goes down.
 *
 * THEY ARE IN TWO GROUPS RATHER THAN AT SIX PERCENTAGE POSITIONS, and that is
 * the fix for the only thing that went wrong here. Placed by percentage, the
 * innermost column on each side lands on top of the sentence at some window
 * widths and not others, because the columns are measured from the viewport
 * edge and the sentence is measured from the middle. Two groups pinned to the
 * edges with a fixed share of the width leave a channel down the centre that
 * cannot be encroached on at any size.
 *
 * The outer columns travel furthest, which keeps the eye in that channel.
 */
const LEFT_COLUMNS = [
  { drift: -0.55 },
  { drift: 0.38, hideBelow: true },
  { drift: -0.28, hideBelow: true },
];
const RIGHT_COLUMNS = [
  { drift: 0.44, hideBelow: true },
  { drift: -0.36, hideBelow: true },
  { drift: 0.5 },
];

export default function JourneyScatter({
  tiles,
  eyebrow,
  statement,
}: {
  tiles: readonly ScatterTile[];
  eyebrow: string;
  statement: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
    layoutEffect: false,
  });

  // The field thins out over the last third so the chapter resolves onto the
  // film rather than cutting from a full screen of thumbnails to a full screen
  // of video.
  const fieldOpacity = useTransform(scrollYProgress, [0, 0.12, 0.62, 0.86], [0, 1, 1, 0]);
  // The film comes up underneath as the field goes.
  const filmOpacity = useTransform(scrollYProgress, [0.62, 0.9], [0, 1]);
  const statementOpacity = useTransform(
    scrollYProgress,
    [0, 0.1, 0.58, 0.74],
    [0, 1, 1, 0],
  );

  // Deal the tiles out to the columns in order, so neighbouring columns do not
  // show the same photograph at the same height.
  const columns = [...LEFT_COLUMNS, ...RIGHT_COLUMNS];
  const perColumn = columns.map((_, c) => tiles.filter((_, i) => i % columns.length === c));

  return (
    <div
      ref={ref}
      className="kul-scatter relative bg-k-void"
      style={{ height: "260svh" }}
    >
      <div className="kul-scatter-stage sticky top-0 h-svh overflow-hidden">
        {/* The film that the field resolves onto. It is underneath everything,
            so it is already running by the time the thumbnails clear. */}
        <m.div
          className="kul-scatter-film absolute inset-0"
          style={reduced ? undefined : { opacity: filmOpacity }}
        >
          <HeroVideo
            name="dash-daylight"
            poster="/videos/dash-daylight-poster.jpg"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.15)_38%,rgba(0,0,0,0.7)_100%)]"
          />
        </m.div>

        <m.div
          aria-hidden="true"
          className="kul-scatter-field absolute inset-0"
          style={reduced ? undefined : { opacity: fieldOpacity }}
        >
          {/* Two banks, each a third of the width, hard against the edges. The
              middle third is the channel the sentence lives in and nothing is
              ever laid into it. */}
          <div className="absolute inset-y-0 left-0 flex w-[22%] justify-between gap-3 px-3 lg:w-[32%] lg:gap-4">
            {LEFT_COLUMNS.map((column, c) => (
              <Column
                key={`l${c}`}
                column={column}
                tiles={perColumn[c] ?? []}
                progress={scrollYProgress}
                reduced={Boolean(reduced)}
              />
            ))}
          </div>
          <div className="absolute inset-y-0 right-0 flex w-[22%] justify-between gap-3 px-3 lg:w-[32%] lg:gap-4">
            {RIGHT_COLUMNS.map((column, c) => (
              <Column
                key={`r${c}`}
                column={column}
                tiles={perColumn[LEFT_COLUMNS.length + c] ?? []}
                progress={scrollYProgress}
                reduced={Boolean(reduced)}
              />
            ))}
          </div>
        </m.div>

        <m.div
          className="kul-scatter-words absolute inset-0 flex items-center justify-center px-6"
          style={reduced ? undefined : { opacity: statementOpacity }}
        >
          <div className="max-w-[18ch] text-center md:max-w-[26ch] lg:max-w-[30ch]">
            <p className="font-text text-k-micro uppercase tabular-nums text-k-gold-lit">
              {eyebrow}
            </p>
            <p className="pt-5 font-text text-k-lede text-k-on-dark">{statement}</p>
          </div>
        </m.div>
      </div>
    </div>
  );
}

function Column({
  column,
  tiles,
  progress,
  reduced,
}: {
  column: { drift: number; hideBelow?: boolean };
  tiles: ScatterTile[];
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  // Percentages rather than pixels, so a column crosses the same proportion of
  // the screen on a phone as on a desktop.
  const y = useTransform(
    progress,
    [0, 1],
    [`${-column.drift * 50}%`, `${column.drift * 50}%`],
  );

  return (
    <m.div
      className={`kul-scatter-col absolute top-1/2 w-full max-w-[80px] flex-col gap-5 md:max-w-[110px] lg:max-w-[132px] lg:gap-6 ${
        column.hideBelow ? "hidden lg:flex" : "flex"
      }`}
      style={reduced ? { transform: "translateY(-50%)" } : { y, translateY: "-50%" }}
    >
      {tiles.map((tile) => (
        <div key={tile.src} className="relative aspect-square w-full overflow-hidden rounded-xl">
          <Image
            src={tile.src}
            alt=""
            fill
            sizes="(min-width: 1024px) 132px, (min-width: 768px) 110px, 80px"
            loading="eager"
            fetchPriority="low"
            className="object-cover"
          />
        </div>
      ))}
    </m.div>
  );
}
