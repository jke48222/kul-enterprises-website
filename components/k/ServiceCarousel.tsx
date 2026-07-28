"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Service } from "@/lib/services";

/**
 * SERVICES CAROUSEL
 *
 * The row of photographs near the top of the Services page.
 *
 * All seven services sit in one row that scrolls sideways. You can drag it,
 * use a trackpad, use the arrow buttons, or click the dots underneath. The
 * service nearest the middle of the screen grows larger and shows its
 * description; the others stay smaller but are always sharp and clickable.
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
 */
const SLOT = 400;
const ACTIVE_SCALE = 1.4;
const SIDE_SCALE = 0.8;
const GAP = 64;

type ServiceCarouselProps = {
  services: Service[];
};

export default function ServiceCarousel({ services }: ServiceCarouselProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  // A plain copy of the same number, so the arrows can read where we are
  // without waiting for React to re-render.
  const activeRef = useRef(0);

  /**
   * Scrolls so the chosen service sits in the middle of the screen.
   *
   * Which card counts as the middle one is decided by the watcher below, not
   * here, so dragging the row and pressing the arrows always agree.
   */
  const scrollTo = useCallback((index: number) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.children[index] as HTMLElement | undefined;
    if (!card) return;
    rail.scrollTo({
      left: card.offsetLeft - (rail.clientWidth - card.offsetWidth) / 2,
      behavior: "smooth",
    });
  }, []);

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
   * Decides which service is the middle one.
   *
   * The browser is asked to report whichever card overlaps a narrow strip
   * down the centre of the row. That is far steadier than measuring scroll
   * positions ourselves, because it does not depend on how often the browser
   * chooses to report scrolling, which differs between a drag, a trackpad
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
    <div className="flex flex-col gap-8 py-14 pb-24">
      {/* The vertical padding leaves room for the middle card to scale up
          without being clipped, because a sideways scroller also clips
          anything that overflows top or bottom. */}
      <div
        ref={railRef}
        className="flex snap-x snap-proximity items-center overflow-x-auto py-[100px] pl-[max(1.5rem,calc((100vw-400px)/2))] pr-[max(1.5rem,calc((100vw-400px)/2))] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ gap: GAP }}
      >
        {services.map((service, i) => {
          const isActive = i === active;
          return (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="flex shrink-0 snap-center flex-col gap-5"
              style={{
                width: SLOT,
                zIndex: isActive ? 1 : 0,
                transform: `scale(${isActive ? ACTIVE_SCALE : SIDE_SCALE})`,
                transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)",
              }}
            >
              <Image
                src={service.card}
                alt={service.name}
                width={900}
                height={900}
                priority={i < 3}
                className="h-auto w-full object-cover"
                style={{
                  // Divided by the scale so the corner looks the same size
                  // however far the card has been scaled up or down.
                  borderRadius: isActive
                    ? 35 / ACTIVE_SCALE
                    : 18 / SIDE_SCALE,
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

        <div className="flex items-center gap-2.5">
          {services.map((service, i) => (
            <button
              key={service.slug}
              type="button"
              onClick={() => scrollTo(i)}
              aria-label={`Show ${service.name}`}
              aria-current={i === active}
              className={`h-1.5 rounded-full transition-all duration-300 ${
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
