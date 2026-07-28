"use client";

import { useEffect, useRef } from "react";

type HeroVideoProps = {
  poster: string;
  className?: string;
  /**
   * The film to play, without the .mp4 on the end, e.g. "kul-hero" or
   * "dash-rain". A matching "-720" file has to sit beside it in
   * public/videos, because phones are served the smaller one.
   */
  name?: string;
};

/**
 * A silent background loop. Autoplay, loop, muted, playsinline, and paused the
 * moment it leaves the viewport, so a background video never costs decode time
 * on a section nobody is looking at.
 *
 * Reduced motion gets the poster frame and no video at all: the still carries
 * the same information, so nothing is withheld.
 *
 * TO USE A DIFFERENT FILM: pass `name` and a matching `poster`. Both the full
 * size and the "-720" version must exist in public/videos, since the browser
 * picks the smaller one below 768px and silently plays nothing if it is
 * missing.
 */
export default function HeroVideo({
  poster,
  className,
  name = "kul-hero",
}: HeroVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) void el.play().catch(() => undefined);
        else el.pause();
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
      tabIndex={-1}
    >
      <source
        src={`/videos/${name}-720.mp4`}
        type="video/mp4"
        media="(max-width: 768px)"
      />
      <source src={`/videos/${name}.mp4`} type="video/mp4" />
    </video>
  );
}
