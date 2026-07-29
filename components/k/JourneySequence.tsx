"use client";

import Image from "next/image";
import { useRef } from "react";
import { m, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";

/**
 * CHAPTER FIVE, AS ONE HELD FRAME
 *
 * Eleven photographs Mark took through a windscreen, in the order the light
 * runs. Rather than eleven screens that scroll past each other, the screen is
 * held still and the photographs change inside it, so the reader sits in one
 * windscreen for the length of the chapter and watches the light come up.
 *
 * WHERE THIS COMES FROM. terminal-industries.com, the client's own named
 * favourite, which project-docs/10-design-direction.md already records as "the
 * model for our journey section". Torn down live: their sequence section is
 * exactly three times the viewport height, with an inner
 * `position: sticky; top: 0; height: 100vh` holding the media, and title blocks
 * over it that swap as the sequence advances. This is that mechanism, with real
 * photographs in place of their rendered canvas.
 *
 * THE ONE NUMBER THAT MATTERS is how much scroll each photograph gets. Terminal
 * give theirs about 400px per title, fine for a caption and far too fast for a
 * photograph. Each frame here gets most of a screen, so the chapter costs about
 * the same scrolling as the eleven separate sections it replaces. It is not
 * shorter. It is the same length, held still.
 *
 * ============================================================================
 * THE THREE THINGS THAT ARE EASY TO GET WRONG HERE, ALL OF WHICH WERE
 * ============================================================================
 *
 * 1. FRAMES STACK UP, THEY DO NOT CROSS-FADE.
 *
 * Each photograph fades in on top of the one before and then STAYS at full
 * opacity for the rest of the chapter, held down by z-index. The obvious
 * implementation, fading each one out as the next fades in, dips to black in
 * the middle of every transition: two layers at 0.6 and 0.4 opacity composite
 * to 0.76 coverage, not 1.0, because source-over is not additive. Eleven visible
 * dips in a chapter about light arriving is precisely the wrong artefact.
 *
 * 2. `content-visibility` WILL SILENTLY STOP THE PHOTOGRAPH DOWNLOADING.
 *
 * The window below keeps distant frames out of painting, which is what stops
 * eleven full-screen photographs costing 124MB of texture on a phone. But
 * next/image defaults to `loading="lazy"`, and a lazy image inside a
 * `content-visibility: hidden` subtree never begins its fetch at all. The frame
 * then arrives as a hard pop, or as black, on any connection slower than
 * localhost, which is why it looks perfect while you are building it. Every
 * image here is therefore `loading="eager"`: the paint gate and the fetch gate
 * have to be separate, and only the paint gate belongs on scroll position.
 *
 * `priority` is deliberately absent. Nothing on this page is above the fold
 * except type, the measured LCP element is a paragraph at 140ms, and a preload
 * here only competes with the font that paragraph needs.
 *
 * 3. THE REDUCED-MOTION VERSION IS THE SAME MARKUP, NOT A DIFFERENT TREE.
 *
 * `useReducedMotion()` returns false on the server, always, so branching the
 * component on it means the server sends the nine-thousand-pixel pinned track
 * to everybody and then React swaps it for eleven stacked sections on hydration.
 * That is a multi-thousand-pixel jump under the reader, and it lands worst on
 * exactly the people who asked for less movement.
 *
 * So there is one tree. The pinning, the stacking and the fading are switched
 * off in CSS, in a `prefers-reduced-motion` block in app/globals.css that the
 * server can send in the first byte. A reader who wants no motion gets eleven
 * photographs in flow, each with its caption beneath, before any JavaScript
 * runs at all. That is not a degraded version, it is the same eleven
 * photographs at a different pace. It is also what a crawler and a no-JS
 * visitor see.
 *
 * ============================================================================
 *
 * WHAT THE SCREEN READER GETS. The photographs are decoration here: `alt=""`,
 * marked hidden, and windowed out of painting. The captions are the document.
 * They are all mounted, all in light-arc order, and the inactive ones sit at
 * `opacity: 0`, which is the one property that hides something visually while
 * leaving it in the accessibility tree and findable with ctrl-F. Each caption
 * carries the description of its own photograph. There is exactly one copy of
 * every line, so searching the page cannot land on an invisible duplicate.
 *
 * THE CAPTIONS NO LONGER ALTERNATE LEFT AND RIGHT. In the eleven-section
 * version that alternation was the whole of the variation and is recorded as
 * such in project-docs/21-archetype-inventory.md. It is gone because a line
 * that jumps to the other side of the screen while the photograph behind it is
 * still arriving reads as a glitch. Held still, the sequence has the light to
 * carry it and does not need the alternation.
 */

export type RoadFrame = {
  src: string;
  alt: string;
  time: string;
  line: string;
};

/** How much of the screen each photograph is given, as a fraction of the viewport. */
const SCROLL_PER_FRAME = 0.9;

export default function JourneySequence({ frames }: { frames: readonly RoadFrame[] }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // Measured from the moment the track's top meets the top of the screen to the
  // moment its bottom does, which is exactly the window in which the stage is
  // stuck. `layoutEffect: false` keeps this off the hydration critical path.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
    layoutEffect: false,
  });

  return (
    <div
      ref={ref}
      className="kul-seq-track relative bg-k-void"
      style={{ height: `${frames.length * SCROLL_PER_FRAME * 100}svh` }}
    >
      <div className="kul-seq-stage sticky top-0 h-svh overflow-hidden">
        <ol>
          {frames.map((frame, i) => (
            <SequenceFrame
              key={frame.src}
              frame={frame}
              index={i}
              count={frames.length}
              progress={scrollYProgress}
              reduced={Boolean(reduced)}
            />
          ))}
        </ol>

        <SequenceRail
          count={frames.length}
          progress={scrollYProgress}
          reduced={Boolean(reduced)}
        />
      </div>
    </div>
  );
}

/**
 * When frame `index` takes over the screen.
 *
 * `arrive` is the progress at which it is fully opaque. It begins fading in a
 * third of a slice earlier and then never fades out again.
 */
function windowFor(index: number, count: number) {
  const slice = 1 / count;
  return { arrive: index * slice, fade: slice / 3, slice };
}

function SequenceFrame({
  frame,
  index,
  count,
  progress,
  reduced,
}: {
  frame: RoadFrame;
  index: number;
  count: number;
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  const { arrive, fade, slice } = windowFor(index, count);

  // The first photograph is up before the chapter starts, so it never fades.
  const opacity = useTransform(progress, [arrive - fade, arrive], index === 0 ? [1, 1] : [0, 1]);

  // A slow push in, ending as the next frame arrives over the top. The
  // photograph is always larger than the screen, so there is no edge to expose.
  const scale = useTransform(progress, [arrive - fade, arrive + slice], [1.06, 1]);

  // Anything more than two frames from the front stops being painted. This is
  // the memory gate and nothing else: see note 2 at the top of this file for
  // why it must never also be the download gate.
  const paint = useTransform(progress, (p) =>
    p > arrive - 2 / count && p < arrive + 2 / count ? "visible" : "hidden",
  );

  // Captions cannot stack the way photographs do, so this one does fade out as
  // the next arrives. They occupy the same cell, so they cross in place.
  const captionOpacity = useTransform(
    progress,
    [arrive - fade / 2, arrive + fade / 2, arrive + slice - fade, arrive + slice - fade / 2],
    [0, 1, 1, 0],
  );
  const captionY = useTransform(progress, [arrive - fade / 2, arrive + fade / 2], [14, 0]);

  return (
    <li className="kul-seq-frame absolute inset-0" style={{ zIndex: index }}>
      <m.div
        aria-hidden="true"
        className="kul-seq-media absolute inset-0"
        style={reduced ? undefined : { opacity, contentVisibility: paint }}
      >
        <m.div className="absolute inset-0" style={reduced ? undefined : { scale }}>
          <Image
            src={frame.src}
            alt=""
            fill
            sizes="100vw"
            loading="eager"
            // Low on all eleven, including the first. `auto` here makes Next
            // emit a <link rel=preload> for the frame, and this chapter starts
            // seven screens down: that preload only competes with the font the
            // real first paragraph is waiting on. Eager is about starting the
            // fetch at all, not about starting it early.
            fetchPriority="low"
            className="object-cover"
          />
        </m.div>
        {/* One scrim per photograph rather than one over the stack. Because the
            frames stack rather than cross-fade, only the front one is ever
            fully visible, so these never double up.

            ITS NUMBERS WERE MEASURED, NOT GUESSED. Every one of the eleven
            photographs was sampled pixel by pixel in the band where the words
            sit, this gradient composited over it, and the contrast computed
            against the exact text colours below. A gentler first attempt failed
            on two frames at 4.13:1 and 4.14:1. These stops put the brightest
            pixel behind the headline at 9.33:1 on the worst frame and behind
            the small time of day at 8.05:1, both worst cases being
            s17-road-to-horizon, the last frame and the brightest sky in the
            set. If a photograph is ever swapped, measure again rather than
            assuming: the frames that failed the first attempt were not the ones
            that looked brightest.

            THE TIME OF DAY IS FULL WHITE FOR THE SAME REASON. It was a soft
            grey, which measured 3.47:1 on the worst frame and failed on five of
            the eleven. It is small uppercase type under a headline four times
            its size, so it still reads as subordinate without being dimmed.

            The gradient is hand written rather than built from a colour with a
            transparency modifier, because those modifiers silently fail on this
            project's tokens and produce no scrim at all, which here would mean
            white text on a bright photograph. */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.08)_30%,rgba(0,0,0,0.6)_62%,rgba(0,0,0,0.95)_100%)]" />
      </m.div>

      <m.figcaption
        className="kul-seq-cap absolute inset-x-0 bottom-0"
        style={reduced ? undefined : { opacity: captionOpacity, y: captionY }}
      >
        {/* `relative` matters. Without it the inner column resolves against the
            viewport-sized parent instead of this padded box, and ten of the
            eleven captions run hard to the right edge of a phone screen. */}
        <div className="relative mx-auto w-full max-w-[1248px] px-6 pb-20 md:px-12 lg:px-24">
          <span className="font-text text-k-micro uppercase tabular-nums text-k-on-dark">
            {frame.time}
          </span>
          <p className="max-w-[640px] pt-4 font-display text-k-d3 font-black text-k-on-dark">
            {frame.line}
          </p>
          <span className="sr-only">Photograph: {frame.alt}.</span>
        </div>
      </m.figcaption>
    </li>
  );
}

/**
 * Eleven ticks up the side, one lit.
 *
 * A pinned section that eats ten screens of scrolling has to say how long it
 * is, or it reads as a page that has stopped working.
 */
function SequenceRail({
  count,
  progress,
  reduced,
}: {
  count: number;
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className="kul-seq-rail pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col gap-2.5 md:flex lg:right-12"
    >
      {Array.from({ length: count }, (_, i) => (
        <RailTick key={i} index={i} count={count} progress={progress} reduced={reduced} />
      ))}
    </div>
  );
}

function RailTick({
  index,
  count,
  progress,
  reduced,
}: {
  index: number;
  count: number;
  progress: MotionValue<number>;
  reduced: boolean;
}) {
  const { arrive, fade, slice } = windowFor(index, count);
  const opacity = useTransform(
    progress,
    [arrive - fade, arrive, arrive + slice - fade, arrive + slice],
    [0.3, 1, 1, 0.3],
  );
  // The lit tick is longer as well as brighter, so it survives being seen out
  // of the corner of the eye against a bright photograph.
  const scaleX = useTransform(
    progress,
    [arrive - fade, arrive, arrive + slice - fade, arrive + slice],
    [1, 2.2, 2.2, 1],
  );

  return (
    <m.span
      className="block h-px w-4 origin-right bg-k-on-dark"
      style={reduced ? { opacity: 0.3 } : { opacity, scaleX }}
    />
  );
}
