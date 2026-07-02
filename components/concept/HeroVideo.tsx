"use client";

import { useEffect, useRef } from "react";

/**
 * Full-bleed background hero video. The poster paints instantly (LCP), the
 * loop plays muted once it can. React does not serialize `muted` into server
 * HTML, so we re-mute and call play() on mount to survive autoplay policies.
 * Reduced-motion users keep the still poster.
 */
export default function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    v.muted = true;
    v.play().catch(() => {});
  }, []);

  return (
    <video
      ref={ref}
      className="absolute inset-0 h-full w-full object-cover object-[62%_center]"
      // REPLACEABLE ASSET: aerial stock reel; swap for KUL fleet footage
      poster="/images/stock/kul-hero-poster.jpg"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden
    >
      <source src="/videos/kul-hero.mp4" type="video/mp4" />
    </video>
  );
}
