"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  type MotionValue,
  m,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

/**
 * Scroll-driven rig — the Rivian R1S store pattern, KUL's truck.
 *
 * A tall section with a sticky viewport: the rig tracks horizontally across
 * the frame as the section scrolls, its wheels spinning at the rate the
 * distance actually demands, over a ghosted KUL wordmark it partially
 * occludes.
 *
 * How the wheels work: these are the real photographic rims, not a redraw.
 * Each rim is cropped out of the body render as a circular sprite and stamped
 * back at the exact coordinates it came from, then rotated. Rotating a circle
 * about its own centre sweeps precisely the area it already covered, so the
 * baked rim underneath never peeks out and at rest the overlay is
 * pixel-identical to the body — there is no seam.
 */

/**
 * Wheel geometry, measured off the 1975x577 source render and verified
 * against a circle overlay rather than derived statistically — automated
 * blob-fitting kept catching the chassis chrome and the dark bolt holes.
 *
 * All five run the same tyre, as a real rig does: contact patches sit on a
 * ground line at y=574, tyre radius 75, so every centre is at y=499. An
 * earlier pass gave the steer axle a 99px radius, but that was the front
 * valance widening its contact patch, not a bigger wheel.
 */
const BODY = { w: 1975, h: 577 };
const GROUND = 574;
/**
 * Wheel centre. Checked at high zoom against 499/503/507/511: at 499 the rim
 * sat visibly high in the tyre, 507 centres it. Crop centre and placement
 * centre must stay identical — if they drift apart the baked rim underneath
 * peeks out from behind the sprite.
 */
const WHEEL_CY = 507;
/** Rolling radius follows from the centre, so the spin rate stays honest. */
const TYRE_R = GROUND - WHEEL_CY;
/**
 * The sprite is cropped TIGHT to the photographic rim (its outer edge measures
 * ~44px), not to the tyre. That is the whole fix: an earlier version cropped
 * at 0.65 x an over-estimated tyre radius, so each sprite carried a ring of
 * tyre sidewall — and sidewall has shading and a bead highlight, which
 * visibly spun against the static tyre underneath. Cropped at the rim edge
 * there is no sidewall in the sprite, so only the rim turns.
 */
const RIM_R = 45;

const WHEEL_X = [158, 724, 883, 1674, 1829] as const;

const WHEELS = WHEEL_X.map((cx, id) => ({
  id,
  leftPct: (100 * cx) / BODY.w,
  topPct: (100 * WHEEL_CY) / BODY.h,
  sizePct: (100 * (2 * RIM_R)) / BODY.w,
}));

/**
 * Fraction of its own width the rig travels. Wide enough that it enters fully
 * off the right edge and leaves fully off the left rather than just sliding
 * about within the frame.
 */
const TRAVEL = 2.2;

/**
 * Degrees the wheels turn over the whole travel, from real geometry rather
 * than a guessed constant: distance / circumference, in units of body width.
 * All axles share a tyre size, so they turn in lockstep — which is what a
 * real rig does.
 */
const SPIN_DEGREES = (TRAVEL * BODY.w * 360) / (2 * Math.PI * TYRE_R);

type Wheel = (typeof WHEELS)[number];

/**
 * One rim sprite. Its own component so the rotation hook runs at a component
 * top level rather than inside a loop.
 */
function Rim({
  wheel,
  progress,
  reduced,
}: {
  wheel: Wheel;
  progress: MotionValue<number>;
  reduced: boolean | null;
}) {
  // Negative: the rig travels leftward, so seen from its left flank the
  // wheels roll counter-clockwise. Positive here would spin them backwards.
  const rotate = useTransform(progress, [0, 1], [0, -SPIN_DEGREES]);

  // Centring MUST go through framer's x/y, not Tailwind's -translate-*
  // classes: framer writes a complete `transform`, so a class-based translate
  // on the same element is silently discarded and the sprite ends up
  // positioned by its top-left corner instead of its centre.
  return (
    <m.div
      aria-hidden
      style={{
        left: `${wheel.leftPct}%`,
        top: `${wheel.topPct}%`,
        width: `${wheel.sizePct}%`,
        x: "-50%",
        y: "-50%",
        ...(reduced ? {} : { rotate }),
      }}
      className="absolute aspect-square will-change-transform"
    >
      <Image
        src={`/images/truck/rim-${wheel.id}.webp`}
        alt=""
        fill
        sizes="60px"
        className="object-contain"
      />
    </m.div>
  );
}

export default function ScrollTruck() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
    layoutEffect: false,
  });

  // The render faces left, so the rig has to travel RIGHT to LEFT — entering
  // from the right edge and driving off the left. Moving it the other way
  // would have it going backwards down the road.
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    [`${TRAVEL * 50}%`, `${-TRAVEL * 50}%`],
  );
  // Wordmark drifts the opposite way at a fraction of the rate, so the two
  // planes separate in depth.
  const markX = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <section
      ref={sectionRef}
      data-ground="paper"
      className="relative h-[260svh] bg-paper"
    >
      <div className="sticky top-0 flex h-svh flex-col items-center justify-center overflow-hidden">
        {/* Ghost wordmark. Sits high enough that the rig crosses its lower
            third and occludes it — the reference's depth trick. Heavier than
            GhostNumeral's 0.06–0.08 on purpose: at that weight it read as a
            smudge rather than as type the truck is passing in front of. */}
        {/* The lift MUST go through framer's `y`, not a Tailwind -translate-y
            class: framer writes a complete `transform` string, which silently
            replaces any class-based transform on the same element. */}
        <m.span
          aria-hidden
          style={reduced ? { y: "-62%" } : { x: markX, y: "-62%" }}
          className="pointer-events-none absolute select-none font-omnibus text-[clamp(9rem,34vw,30rem)] leading-none tracking-tight text-ink/[0.12]"
        >
          KUL
        </m.span>

        <m.div
          style={reduced ? undefined : { x }}
          className="relative w-[min(1100px,86vw)] will-change-transform"
        >
          {/* Body render. Rims are baked in and sit under the sprites. */}
          <div className="relative" style={{ aspectRatio: `${BODY.w} / ${BODY.h}` }}>
            <Image
              src="/images/truck/truck-body.webp"
              alt="KUL Enterprises tractor-trailer in side profile, trailer wrapped with the KUL lion livery"
              fill
              sizes="(max-width: 768px) 86vw, 1100px"
              className="object-contain"
              priority={false}
            />

            {WHEELS.map((w) => (
              <Rim
                key={w.id}
                wheel={w}
                progress={scrollYProgress}
                reduced={reduced}
              />
            ))}
          </div>
        </m.div>

        {/* Copy block, mirroring the reference's caption + twin pills. */}
        <div className="relative mt-10 px-6 text-center">
          <p className="font-mont text-body-l text-ink">
            Power Only, Dry Van and Reefer capacity — Southeast based, nationwide.
          </p>
          <p className="mt-2 font-mont text-micro uppercase text-graywarm-deep tabular-nums">
            USDOT 7638788 · MC 66389691 · Dispatch answers 24/7
          </p>
        </div>
      </div>
    </section>
  );
}
