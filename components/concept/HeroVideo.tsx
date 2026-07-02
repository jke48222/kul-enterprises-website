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
    // Phones get the 720p rendition: same loop at roughly a third of the
    // decode work and bytes. preload="metadata" keeps the swap cheap.
    if (window.matchMedia("(max-width: 768px)").matches) {
      v.src = "/videos/kul-hero-720.mp4";
    }
    v.muted = true;
    v.play().catch(() => {});
    // Decode only while on screen: pause the loop once the hero scrolls
    // out of view, resume when it comes back.
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) v.play().catch(() => {});
      else v.pause();
    });
    io.observe(v);
    return () => io.disconnect();
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
