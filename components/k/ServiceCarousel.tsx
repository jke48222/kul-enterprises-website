"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Service } from "@/lib/services";

/**
 * SERVICES CAROUSEL
 *
 * The row of photographs near the top of the Services page. All seven services
 * sit in one row that moves sideways. You can grab it and pull, use a trackpad
 * or a wheel, press the arrows, or click the dots underneath. The service
 * nearest the middle of the screen grows larger and shows its description; the
 * others stay smaller but are always sharp and clickable.
 *
 * ============================================================================
 * TWO THINGS WERE WRONG WITH IT AND BOTH ARE FIXED HERE. READ THIS BEFORE
 * CHANGING ANY OF THE NUMBERS OR THE POINTER HANDLERS.
 * ============================================================================
 *
 * ONE. IT SAID "DRAG" AND COULD NOT BE DRAGGED. The row had `overflow-x: auto`
 * and nothing else, which gets you a wheel, a trackpad and a touch screen, and
 * on a desktop with a mouse gets you nothing at all: press on a photograph and
 * pull, and the browser starts its own native image drag instead, so the
 * pointer picks the picture up like a file being moved to the desktop and the
 * row never moves. That is the exact complaint. The fix is in three parts and
 * all three are needed:
 *
 *   `draggable={false}` on every image, which is what actually stops the
 *   browser's own drag starting. Without it the rest does nothing.
 *   Pointer handlers below that translate a press and a pull into scrollLeft.
 *   `touch-action: pan-y` so a touch screen keeps its own native sideways
 *   scrolling, which is better than anything reimplemented here, while a
 *   vertical swipe still scrolls the page.
 *
 * TWO. IT MOVED TOO FAST. Both the arrows and the dots called `scrollTo` with
 * the browser's own `behavior: "smooth"`, whose duration is fixed by the
 * browser and is roughly a fifth of a second for any distance. Over a 400px
 * card that is a snap, and over the width of the row it is a blur. There is no
 * property that slows it down, so the glide is run here instead, on the clock,
 * over GLIDE_MS. See `glideTo`.
 *
 * The snap is gone with it. `snap-x` fights a hand-run glide: the browser
 * arrives at the end of the animation and drags the row somewhere else, which
 * reads as the carousel correcting you. The glide already lands each card dead
 * centre, so there is nothing left for the snap to do.
 *
 * TO CHANGE WHICH PHOTOGRAPH A SERVICE USES: replace the file in
 * public/images/services/ keeping the same file name. Photographs are square
 * and should be at least 900 by 900 pixels.
 */

/**
 * Every card occupies the same amount of room in the row. The middle one
 * only looks bigger because it is scaled up, and scaling is drawn by the
 * graphics card rather than re-laid out.
 *
 * Animating the actual width instead would re-measure the whole row on every
 * frame, and because the row is being scrolled at the same time, the moving
 * card positions would fight the scroll position underneath the pointer.
 *
 * HOW BIG THE CARDS ACTUALLY ARE IS SET IN CSS, NOT HERE. The four numbers
 * that used to live on this line (card width, how much the middle one grows,
 * how much the side ones shrink, and the gap) are now the --k-sc-* settings
 * on `.k-service-rail` in app/globals.css, because a phone needs different
 * ones: the desktop numbers put a 560px card on a 375px screen. They are read
 * straight out of the style rules below, so there is one place to change them
 * and it is the one with the comment explaining the sizes.
 *
 * None of the scrolling code needs them. It measures the real cards on the
 * page, so whatever CSS decides, the arrows and dots follow.
 */

/**
 * How long one glide takes, in milliseconds, however far it has to travel.
 *
 * It is deliberately long. The browser's own smooth scrolling is about 200ms
 * and the client asked for this to be slowed down a lot; at 1100 a card takes
 * over a second to cross, which is slow enough to watch the photograph arrive
 * rather than register that something changed. A constant duration rather than
 * a constant speed is what keeps a jump from the first dot to the last from
 * taking seven times as long as a press of the arrow.
 */
const GLIDE_MS = 1100;

/**
 * How long the row must be still before it settles onto the nearest service.
 *
 * Trackpad momentum keeps delivering scroll events after the fingers lift, and
 * every one of them restarts this timer, so the wait only ever begins once the
 * row has genuinely stopped. That is why it can be this short: 260 is a quarter
 * of a second of stillness, not a quarter of a second from the last gesture.
 */
const REST_MS = 260;

/** How long the correction onto the nearest card takes once the row is still. */
const SETTLE_MS = 420;

/** The house easing. Fast out of the gate, long settle, no overshoot. */
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3.2);

type ServiceCarouselProps = {
  services: Service[];
};

export default function ServiceCarousel({ services }: ServiceCarouselProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  /**
   * Whether the row has been moved yet, by any means.
   *
   * Nothing reads it since the hint pill was removed. It is kept because it is
   * the one bit of state a hint would need if one is ever wanted again, and
   * because the scroll and pull handlers already set it for free.
   */
  const [, setHinted] = useState(false);
  const noteHint = useCallback(() => setHinted(true), []);
  // A plain copy of the same number, so the arrows can read where we are
  // without waiting for React to re-render.
  const activeRef = useRef(0);

  /** The frame handle for the running glide, so a new one can cancel it. */
  const glide = useRef<number | null>(null);

  /**
   * Runs the row to a scroll position over GLIDE_MS.
   *
   * The browser's `behavior: "smooth"` is not used anywhere in this component,
   * because its duration cannot be set. This is the same movement on our own
   * clock, and it is cancellable: grabbing the row mid-glide stops it dead
   * rather than fighting it to the end.
   */
  const glideTo = useCallback((left: number, ms: number = GLIDE_MS) => {
    const rail = railRef.current;
    if (!rail) return;
    if (glide.current !== null) cancelAnimationFrame(glide.current);

    const from = rail.scrollLeft;
    const delta = left - from;
    if (Math.abs(delta) < 1) return;

    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      rail.scrollLeft = from + delta * easeOut(t);
      if (t < 1) glide.current = requestAnimationFrame(step);
      else glide.current = null;
    };
    glide.current = requestAnimationFrame(step);
  }, []);

  const stopGlide = useCallback(() => {
    if (glide.current !== null) {
      cancelAnimationFrame(glide.current);
      glide.current = null;
    }
  }, []);

  useEffect(
    () => () => {
      stopGlide();
      if (rest.current) clearTimeout(rest.current);
    },
    [stopGlide],
  );

  /**
   * Scrolls so the chosen service sits in the middle of the screen.
   *
   * Which card counts as the middle one is decided by the watcher below, not
   * here, so pulling the row and pressing the arrows always agree.
   */
  const scrollTo = useCallback(
    (index: number, ms?: number) => {
      const rail = railRef.current;
      if (!rail) return;
      const card = rail.children[index] as HTMLElement | undefined;
      if (!card) return;
      glideTo(card.offsetLeft - (rail.clientWidth - card.offsetWidth) / 2, ms);
    },
    [glideTo],
  );

  /**
   * THE ROW SETTLES ON WHOEVER IT LANDS ON.
   *
   * A wheel, a trackpad flick or a pull leaves the row wherever momentum ran
   * out, which is usually between two services with neither of them centred
   * and neither of them showing its description. The client asked for it to
   * focus on whichever one it lands on, and this is that: once the scrolling
   * has actually stopped, glide the nearest card to the middle.
   *
   * IT WAITS FOR REST RATHER THAN REACTING TO EVERY EVENT. Scroll fires
   * continuously and a browser gives no "scroll ended" event you can rely on
   * across engines, so the timer is restarted on every one and only the last
   * one survives to fire. REST_MS is long enough to sit out trackpad momentum,
   * which keeps arriving for a good half second after the fingers have lifted;
   * shorter than this and the row starts correcting somebody who is still
   * moving it, which is the single most annoying thing a carousel can do.
   *
   * It is deliberately NOT armed while a pull is in progress. `endDrag` does
   * its own settle when the pointer lifts, and a hand still on the row must
   * never be fought.
   */
  const rest = useRef<ReturnType<typeof setTimeout> | null>(null);

  const settleSoon = useCallback(() => {
    if (rest.current) clearTimeout(rest.current);
    rest.current = setTimeout(() => {
      // A pull in progress owns the row; leave it alone.
      if (drag.current) return;
      // SETTLING IS NOT THE SAME MOVE AS PRESSING AN ARROW. An arrow is a
      // request to travel and is worth watching; a settle is a correction of
      // a few dozen pixels the reader did not ask for, and at the arrow's
      // pace it reads as the carousel taking over. It lands in SETTLE_MS.
      scrollTo(activeRef.current, SETTLE_MS);
    }, REST_MS);
  }, [scrollTo]);

  /** Moves one service left or right from wherever the row currently sits. */
  const step = useCallback(
    (delta: number) => {
      const to = Math.min(
        services.length - 1,
        Math.max(0, activeRef.current + delta),
      );
      scrollTo(to);
    },
    [scrollTo, services.length],
  );

  /**
   * GRAB AND PULL.
   *
   * Pointer events rather than mouse events, so a pen works and a touch screen
   * is handled by the same code path if it ever needs to be. Touch is left to
   * the browser: `touch-action: pan-y` on the rail keeps native sideways
   * scrolling, with its own momentum and rubber banding, which is better than
   * anything reproduced here.
   *
   * THE POINTER IS NOT CAPTURED UNTIL IT HAS ACTUALLY MOVED. Capturing on the
   * press would swallow the click that follows, and every card is a link: the
   * row would move beautifully and nothing in it could be opened. So the press
   * only records where it started, and the capture happens on the first move
   * past DRAG_SLOP. A press that never travels that far stays an ordinary
   * click on a link.
   */
  const DRAG_SLOP = 4;
  const drag = useRef<{ id: number; x: number; left: number; live: boolean } | null>(null);

  /**
   * Set the instant a pull ends, and read by the click handler below.
   *
   * IT CANNOT BE THE DRAG ITSELF, AND THIS IS THE PART THAT WAS WRONG.
   * `click` does not fire during the drag; it fires after `pointerup`, by
   * which time the drag has already been torn down and there is nothing left
   * to test. Measured, with the drag as the only guard: pull the row, let go,
   * and the release lands a click on whichever photograph is under the pointer
   * and opens that service page. Which is precisely the thing the guard was
   * written to stop.
   *
   * So the flag outlives the drag by exactly one click, and it is also cleared
   * on the next press in case a pull ever ends without one following.
   */
  const swallowClick = useRef(false);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return;
    const rail = railRef.current;
    if (!rail) return;
    stopGlide();
    swallowClick.current = false;
    drag.current = { id: e.pointerId, x: e.clientX, left: rail.scrollLeft, live: false };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    const rail = railRef.current;
    if (!d || !rail || d.id !== e.pointerId) return;
    const travelled = e.clientX - d.x;
    if (!d.live) {
      if (Math.abs(travelled) < DRAG_SLOP) return;
      d.live = true;
      // CAPTURE IS AN IMPROVEMENT, NOT A REQUIREMENT, AND IT CAN THROW.
      // setPointerCapture raises NotFoundError if the id is no longer an
      // active pointer, which happens if the button came up somewhere this
      // element never heard about. Uncaught, that throws out of the handler
      // before the row has moved and before `live` has done its other job,
      // which is telling the click handler below to swallow the click: the
      // drag would die and open a service page on the way out. Without
      // capture the pull simply stops tracking once the pointer leaves the
      // rail, which is a much smaller problem than that.
      try {
        rail.setPointerCapture(e.pointerId);
      } catch {
        /* not capturable, carry on without it */
      }
      noteHint();
    }
    rail.scrollLeft = d.left - travelled;
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    const rail = railRef.current;
    if (!d || !rail || d.id !== e.pointerId) return;
    if (d.live) {
      if (rail.hasPointerCapture(e.pointerId)) {
        rail.releasePointerCapture(e.pointerId);
      }
      // The click this release is about to produce belongs to the pull, not
      // to the card underneath it. See `swallowClick` above.
      swallowClick.current = true;
      // The pull is over and the row is between two cards. Settle it onto
      // whichever one the watcher below says is nearest the middle, using the
      // same glide as the arrows so a pull and a press end the same way.
      scrollTo(activeRef.current);
    }
    drag.current = null;
  };

  /**
   * A card is a link, and a link that has just been pulled must not open.
   *
   * Capture phase, so it runs before the anchor and before the site's own
   * route transition, both of which are further down the tree. stopPropagation
   * as well as preventDefault, because preventing the default alone still lets
   * Next's Link see the click and navigate on its own.
   */
  const onClickCapture = (e: React.MouseEvent) => {
    if (!swallowClick.current && !drag.current?.live) return;
    swallowClick.current = false;
    e.preventDefault();
    e.stopPropagation();
  };

  /**
   * Decides which service is the middle one.
   *
   * The browser is asked to report whichever card overlaps a narrow strip
   * down the centre of the row. That is far steadier than measuring scroll
   * positions ourselves, because it does not depend on how often the browser
   * chooses to report scrolling, which differs between a pull, a trackpad
   * flick and a jump straight to the end.
   */
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const cards = Array.from(rail.children) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        // More than one card can clip the strip while the row is moving, so
        // the one covering most of it wins.
        const winner = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!winner) return;
        const index = cards.indexOf(winner.target as HTMLElement);
        if (index === -1) return;
        activeRef.current = index;
        setActive(index);
      },
      {
        root: rail,
        // Shrinks the watched area to a thin band at the horizontal centre.
        rootMargin: "0px -49.5% 0px -49.5%",
        threshold: 0,
      },
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [services.length]);

  return (
    <div className="relative flex flex-col gap-8 py-14 pb-24">
      {/* THE "DRAG OR SCROLL SIDEWAYS" PILL IS GONE, at the client's word.
          It floated over the middle of the row until the first time anything
          moved it. The argument for it was that the arrows and dots sit below
          the fold on a thirteen inch laptop, so a first-time visitor might not
          know the row moves; the argument against is that it is a label
          apologising for the control underneath it, and a carousel that has to
          caption itself is one the reader has already been given a reason to
          distrust. The affordances that remain do the job without narration:
          the cursor is a grab hand, the row is cut mid-card at both ends so it
          visibly continues, and the arrows and dots are directly under it.

          `hinted` and `noteHint` stay because the scroll handler still calls
          them and they cost nothing; if a hint is ever wanted again, this is
          where it went. */}

      {/* The vertical padding leaves room for the middle card to scale up
          without being clipped, because a sideways scroller also clips
          anything that overflows top or bottom.

          `select-none` is here so a pull does not leave a trail of highlighted
          service names behind it, and `touch-action: pan-y` hands vertical
          swipes back to the page while keeping the browser's own sideways
          scrolling on a touch screen. */}
      <div
        ref={railRef}
        onScroll={() => {
          noteHint();
          settleSoon();
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
        onWheel={stopGlide}
        className="k-service-rail flex touch-pan-y select-none items-center overflow-x-auto py-[var(--k-sc-air)] pl-[max(1.5rem,calc((100vw-var(--k-sc-slot))/2))] pr-[max(1.5rem,calc((100vw-var(--k-sc-slot))/2))] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ gap: "var(--k-sc-gap)", cursor: "grab" }}
      >
        {services.map((service, i) => {
          const isActive = i === active;
          return (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              draggable={false}
              className="flex shrink-0 flex-col gap-5"
              style={{
                width: "var(--k-sc-slot)",
                zIndex: isActive ? 1 : 0,
                transform: `scale(var(${isActive ? "--k-sc-active" : "--k-sc-side"}))`,
                transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)",
              }}
            >
              <Image
                src={service.card}
                alt={service.name}
                width={900}
                height={900}
                priority={i < 3}
                // THIS IS THE LINE THAT MAKES THE ROW DRAGGABLE. An image is
                // draggable by default and the browser's own drag wins over
                // any pointer handling above it, which is why pressing a
                // photograph used to pick the picture up instead of pulling
                // the row.
                draggable={false}
                className="h-auto w-full object-cover"
                style={{
                  // Divided by the scale so the corner looks the same size
                  // however far the card has been scaled up or down.
                  borderRadius: isActive
                    ? "calc(35px / var(--k-sc-active))"
                    : "calc(18px / var(--k-sc-side))",
                }}
              />
              <div
                className={`flex flex-col gap-1.5 ${isActive ? "items-center text-center" : ""}`}
              >
                <h3 className="font-display text-[26px] font-black leading-8 tracking-[-0.02em] text-k-ink">
                  {service.name}
                </h3>
                <p
                  className="font-text text-[10px] leading-4 text-k-ink-soft"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transition: "opacity 0.4s ease",
                  }}
                >
                  {service.blurb}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Arrows and dots together, below the row and clear of the nav. */}
      <div className="flex items-center justify-center gap-6">
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Previous service"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-k-rule-strong font-text text-k-small text-k-ink-faint transition-colors duration-200 hover:border-k-ink hover:text-k-ink"
        >
          &#8592;
        </button>

        {/* THE DOTS ARE 6px OF INK AND WERE ALSO 6px OF TARGET, which is
            unusable with a thumb and failed WCAG 2.5.8 outright. The ink is
            unchanged; only the target grew, using the pseudo-element idiom
            components/k/HeroVideo.tsx already established, so the row keeps its
            height and the pagination still reads as a row of small marks.

            THE GAP WIDENS ON PHONES BECAUSE THE TARGETS HAVE TO TILE. At the
            design gap of 10px the centres sit 16px apart, so 44px-wide targets
            would overlap and a tap near a boundary would select the wrong
            service. 20px of gap puts the centres 26px apart, and the -10px
            inset then makes neighbouring targets meet exactly without ever
            crossing. From `md` up the design gap and a matching 5px inset are
            restored, so the desktop artboard is untouched and the targets there
            tile at 16px instead of overlapping. */}
        <div className="flex items-center gap-5 md:gap-2.5">
          {services.map((service, i) => (
            <button
              key={service.slug}
              type="button"
              onClick={() => scrollTo(i)}
              aria-label={`Show ${service.name}`}
              aria-current={i === active}
              className={`relative h-1.5 rounded-full transition-all duration-300 before:absolute before:-inset-x-[10px] before:-inset-y-[19px] before:content-[''] md:before:-inset-x-[5px] ${
                i === active ? "w-6 bg-k-gold" : "w-1.5 bg-k-rule-strong"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => step(1)}
          aria-label="Next service"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-k-ink font-text text-k-small text-k-paper transition-opacity duration-200 hover:opacity-85"
        >
          &#8594;
        </button>
      </div>
    </div>
  );
}
