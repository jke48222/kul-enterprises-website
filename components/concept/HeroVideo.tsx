"use client";

import { useEffect, useRef } from "react";

/**
 * Full-bleed background hero video. The poster paints instantly (LCP); the
 * loop's src attaches only on the client, after the arrival curtain (first
 * visit intro or the homepage film) has cleared, so the 5MB loop never
 * competes with the intro film for bandwidth and phones never touch the
 * desktop rendition. Reduced-motion users keep the still poster: with no
 * src ever attached, nothing plays or downloads.
 */
export default function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let io: IntersectionObserver | undefined;
    const attach = () => {
      if (v.src) return;
      // Phones get the 720p rendition: same loop at roughly a third of the
      // decode work and bytes.
      v.src = window.matchMedia("(max-width: 768px)").matches
        ? "/videos/kul-hero-720.mp4"
        : "/videos/kul-hero.mp4";
      // React does not serialize `muted` into server HTML; re-mute so
      // autoplay policies allow playback.
      v.muted = true;
      v.play().catch(() => {});
      // Decode only while on screen: pause the loop once the hero scrolls
      // out of view, resume when it comes back.
      if (!("IntersectionObserver" in window)) return;
      io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {});
        else v.pause();
      });
      io.observe(v);
    };

    const html = document.documentElement;
    const covered = () =>
      html.hasAttribute("data-intro") || html.hasAttribute("data-page-intro");
    let mo: MutationObserver | undefined;
    let safety: ReturnType<typeof setTimeout> | undefined;
    // Small delay lets PageReveal's effect raise data-page-intro first
    // (page effects run before layout effects).
    const start = setTimeout(() => {
      if (!covered()) {
        attach();
        return;
      }
      mo = new MutationObserver(() => {
        if (!covered()) {
          mo?.disconnect();
          attach();
        }
      });
      mo.observe(html, {
        attributes: true,
        attributeFilter: ["data-intro", "data-page-intro"],
      });
      // Never let a stuck curtain attribute keep the hero frozen forever.
      safety = setTimeout(attach, 9000);
    }, 120);

    return () => {
      clearTimeout(start);
      if (safety) clearTimeout(safety);
      mo?.disconnect();
      io?.disconnect();
    };
  }, []);

  return (
    <video
      ref={ref}
      className="absolute inset-0 h-full w-full object-cover object-[62%_center]"
      // REPLACEABLE ASSET: aerial stock reel; swap for KUL fleet footage
      poster="/images/stock/kul-hero-poster.jpg"
      muted
      loop
      playsInline
      preload="none"
      aria-hidden
    />
  );
}
