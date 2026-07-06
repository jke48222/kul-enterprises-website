"use client";

/**
 * HeroVideo — v3 hero (v2 §3.10 mechanics + the Volvo pause/play control,
 * 16-reference-teardown §Volvo). Poster paints first as the priority LCP
 * image; the <video> src attaches post-intro on idle; phones get 720p; an
 * IO pauses the loop off-screen; reduced motion keeps the still poster.
 * Scroll-out scrub: video scale 1→0.95, headline drifts out over the last
 * 30%. The pause button respects user intent over the IO (a user pause is
 * never auto-resumed).
 */

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";

export type HeroVideoProps = { children: React.ReactNode };

export function HeroVideo({ children }: HeroVideoProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  const [attached, setAttached] = useState(false);
  const [playing, setPlaying] = useState(true);
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
      v.src = window.matchMedia("(max-width: 768px)").matches
        ? "/videos/kul-hero-720.mp4"
        : "/videos/kul-hero.mp4";
      v.muted = true;
      v.play().catch(() => {});
      setAttached(true);
      if (!("IntersectionObserver" in window)) return;
      io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          // Respect an explicit user pause — never auto-resume over it.
          if (!userPaused.current) v.play().catch(() => {});
        } else v.pause();
      });
      io.observe(v);
    };

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

  const togglePlayback = () => {
    const v = videoRef.current;
    if (!v || !v.src) return;
    if (v.paused) {
      userPaused.current = false;
      v.play().catch(() => {});
      setPlaying(true);
    } else {
      userPaused.current = true;
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      data-ground="ink"
      className="relative h-[130svh] bg-ink"
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        <m.div
          aria-hidden
          className="absolute inset-0 will-change-transform"
          style={reduced ? undefined : { scale: mediaScale }}
        >
          {/* REPLACEABLE ASSET: stand-in night-truck footage/poster — swap
              for KUL fleet photography (Volvo reflective-plane register)
              when Mark delivers. Never .img-grade on the hero media. */}
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

        {/* Volvo device: background-video pause control (a11y + polish). */}
        {attached && (
          <button
            type="button"
            onClick={togglePlayback}
            aria-pressed={!playing}
            aria-label={
              playing ? "Pause background video" : "Play background video"
            }
            className="absolute bottom-6 right-6 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-paper/90 transition-colors duration-200 hover:border-white motion-reduce:transition-none"
          >
            {playing ? (
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
                <rect x="3" y="2" width="3.2" height="12" fill="currentColor" />
                <rect x="9.8" y="2" width="3.2" height="12" fill="currentColor" />
              </svg>
            ) : (
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
                <path d="M4 2 L14 8 L4 14 Z" fill="currentColor" />
              </svg>
            )}
          </button>
        )}
      </div>
    </section>
  );
}

export default HeroVideo;
