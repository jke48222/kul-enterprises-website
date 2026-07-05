"use client";

/**
 * HeroVideo — §3.10. Full-bleed background hero video, home only.
 * Mechanics ported from v1 components/concept/HeroVideo.tsx: the poster
 * paints first as a priority next/image layer (the page's LCP element);
 * the <video> src attaches only after the arrival curtain (data-intro /
 * data-page-intro) has cleared AND the main thread is idle, phones get the
 * 720p rendition, an IntersectionObserver pauses the loop off-screen, and
 * reduced-motion users keep the still poster (no src ever attaches).
 *
 * New in v2: a `.scrim-hero` overlay and the scroll-out scrub — the section
 * is 130svh with a sticky svh frame; scroll progress maps video scale
 * 1 → 0.95 across the section and drifts the headline out (y 0 → -8vh,
 * opacity 1 → 0) over the last 30%. One of home's two allowed scrubs.
 */

import Image from "next/image";
import { useEffect, useRef } from "react";
import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";

export type HeroVideoProps = { children: React.ReactNode };

export function HeroVideo({ children }: HeroVideoProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
    layoutEffect: false,
  });
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  const headY = useTransform(scrollYProgress, [0.7, 1], ["0vh", "-8vh"]);
  const headOpacity = useTransform(scrollYProgress, [0.7, 1], [1, 0]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let disposed = false;
    let io: IntersectionObserver | undefined;
    const attach = () => {
      if (disposed || v.src) return;
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

    // Attach on idle so the loop never competes with hydration or the LCP
    // poster for bandwidth.
    const idleAttach = () => {
      if (disposed) return;
      if ("requestIdleCallback" in window) {
        (
          window as Window & {
            requestIdleCallback: (
              cb: () => void,
              opts?: { timeout: number },
            ) => number;
          }
        ).requestIdleCallback(attach, { timeout: 2000 });
      } else {
        setTimeout(attach, 300);
      }
    };

    const html = document.documentElement;
    const covered = () =>
      html.hasAttribute("data-intro") || html.hasAttribute("data-page-intro");
    let mo: MutationObserver | undefined;
    let safety: ReturnType<typeof setTimeout> | undefined;
    // Small delay lets the intro overlay's effect raise data-intro first
    // (page effects run before layout effects).
    const start = setTimeout(() => {
      if (!covered()) {
        idleAttach();
        return;
      }
      mo = new MutationObserver(() => {
        if (!covered()) {
          mo?.disconnect();
          idleAttach();
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
      disposed = true;
      clearTimeout(start);
      if (safety) clearTimeout(safety);
      mo?.disconnect();
      io?.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-ground="ink"
      className="relative h-[130svh] bg-ink"
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        {/* Media layers: poster (LCP) under the deferred video. Transform-only scrub. */}
        <m.div
          aria-hidden
          className="absolute inset-0 will-change-transform"
          style={reduced ? undefined : { scale: mediaScale }}
        >
          {/* Already graded in the file — never .img-grade on the hero video/poster (§2.6). */}
          <Image
            src="/images/stock/kul-hero-poster.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[62%_center]"
          />
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover object-[62%_center]"
            muted
            loop
            playsInline
            preload="none"
            aria-hidden
          />
        </m.div>
        <div aria-hidden className="scrim-hero absolute inset-0" />
        <m.div
          className="relative z-10 h-full"
          style={reduced ? undefined : { y: headY, opacity: headOpacity }}
        >
          {children}
        </m.div>
      </div>
    </section>
  );
}

export default HeroVideo;
