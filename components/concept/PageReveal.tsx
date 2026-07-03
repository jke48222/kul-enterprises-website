"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { site } from "@/lib/site";

/**
 * Arrival transitions for the primary pages.
 *
 * Homepage: the FULL intro film plays on every arrival (bird, gold trail,
 * logo resolve), frozen a beat before its end, then the letterbox reveal.
 * Other primary pages: the film's tail only. The black stage is already up
 * with the settled logo lockup and tagline, holds a beat, then splits open
 * with the same reveal.
 *
 * Skipped when the first-visit LoadingOverlay is running (it already plays
 * the film and ends with this reveal), for reduced-motion users, and on the
 * legal pages.
 */

const PRIMARY = new Set([
  "/",
  "/about",
  "/services",
  "/drivers",
  "/safety",
  "/carrier-packet",
  "/quote",
  "/contact",
]);

const HOLD_MS = 700; // logo settled on black before the split
const REVEAL_MS = 1750; // 0.22s hold + 1.35s split + settle, matches the intro
const FILM_CAP_MS = 6200; // hard cap in case the film never reports ended

/** Shared skip conditions; returns true when the curtain should not play. */
function shouldSkip() {
  return (
    document.documentElement.getAttribute("data-intro") === "1" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * While the opaque cover is up, the page beneath is invisible but would
 * otherwise stay in the tab order; inert keeps keyboard and screen-reader
 * focus out until the reveal starts opening.
 */
function useInertFrame(covered: boolean) {
  useEffect(() => {
    if (!covered) return;
    const frame = document.querySelector("[data-kul-frame]");
    if (!frame) return;
    frame.setAttribute("inert", "");
    return () => frame.removeAttribute("inert");
  }, [covered]);
}

function Stage({
  exit,
  children,
}: {
  exit: boolean;
  children: React.ReactNode;
}) {
  return (
    // display is CSS-gated (globals.css): hidden unless the pre-paint script
    // set html[data-page-reveal], so no-JS visitors never see a stuck cover.
    <div
      aria-hidden
      className={`kul-page-reveal fixed inset-0 z-[90] items-center justify-center overflow-hidden ${
        exit ? "kul-reveal pointer-events-none" : ""
      }`}
    >
      {/* Same stage as the intro: two black panels meeting at center. */}
      <div className="kul-panel-top absolute inset-x-0 top-0 h-[calc(50%_+_20px)] rounded-b-[36px] bg-black" />
      <div className="kul-panel-bottom absolute inset-x-0 bottom-0 h-[calc(50%_+_20px)] rounded-t-[36px] bg-black" />
      {children}
    </div>
  );
}

/** Non-home primaries: the film's settled final frame, then the split. */
function TailCurtain() {
  const [phase, setPhase] = useState<"cover" | "exit" | "done">("cover");
  useInertFrame(phase === "cover");

  useEffect(() => {
    if (shouldSkip()) {
      setPhase("done");
      return;
    }
    // Hold the hero title's slow fade until the reveal finishes, exactly
    // like the homepage film does via html[data-page-intro].
    document.documentElement.setAttribute("data-page-intro", "1");
    const t1 = setTimeout(() => setPhase("exit"), HOLD_MS);
    const t2 = setTimeout(() => setPhase("done"), HOLD_MS + REVEAL_MS);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      document.documentElement.removeAttribute("data-page-intro");
    };
  }, []);

  useEffect(() => {
    if (phase === "done") {
      document.documentElement.removeAttribute("data-page-intro");
    }
  }, [phase]);

  if (phase === "done") return null;

  return (
    <Stage exit={phase === "exit"}>
      <div className="kul-intro-content relative z-10 flex flex-col items-center px-6 pt-16 text-center">
        <Image
          src="/images/brand/kul-logo-lockup.png"
          alt=""
          width={244}
          height={91}
          priority
          className="h-auto w-56 sm:w-64"
        />
        <div className="mt-6 space-y-1.5">
          {site.taglineLines.map((line) => (
            <p
              key={line}
              className="text-[11px] font-medium uppercase tracking-eyebrow text-gold"
            >
              {line}
            </p>
          ))}
        </div>
        <span
          aria-hidden
          className="mt-6 block h-px w-44 bg-[linear-gradient(90deg,transparent,#B59352,transparent)]"
        />
      </div>
    </Stage>
  );
}

/** Homepage: the full intro film on every arrival, then the split. */
function FilmCurtain() {
  const [phase, setPhase] = useState<"cover" | "exit" | "done">("cover");
  const videoRef = useRef<HTMLVideoElement>(null);
  const finishedRef = useRef(false);
  useInertFrame(phase === "cover");

  /** Freeze playback and run the letterbox reveal exactly once. */
  const finish = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setPhase("exit");
  };

  useEffect(() => {
    if (shouldSkip()) {
      setPhase("done");
      return;
    }
    // Hold the hero title's slow fade until the reveal finishes, exactly
    // like the first-visit intro does via html[data-intro].
    document.documentElement.setAttribute("data-page-intro", "1");
    // Hard cap so a stalled film never traps the visitor, plus the same
    // watchdog the first-visit intro uses: if playback has not actually
    // started shortly after mount, reveal the page instead of holding black.
    const cap = setTimeout(finish, FILM_CAP_MS);
    const watchdog = setTimeout(() => {
      const v = videoRef.current;
      if (!v || v.readyState < 2 || v.currentTime === 0) finish();
    }, 1400);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(cap);
      clearTimeout(watchdog);
      window.removeEventListener("keydown", onKey);
      document.documentElement.removeAttribute("data-page-intro");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (phase !== "exit") return;
    const t = setTimeout(() => setPhase("done"), REVEAL_MS);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase === "done") {
      document.documentElement.removeAttribute("data-page-intro");
    }
  }, [phase]);

  // Freeze on the settled logo a beat BEFORE the native end, where the
  // browser can snap to an early frame for one frame (same fix as the
  // first-visit intro).
  const onTime = () => {
    const v = videoRef.current;
    if (!v || finishedRef.current || !v.duration) return;
    if (v.currentTime >= v.duration - 0.2) {
      v.pause();
      finish();
    }
  };

  if (phase === "done") return null;

  return (
    <Stage exit={phase === "exit"}>
      <video
        ref={(el) => {
          videoRef.current = el;
          // The inline ref re-runs on every re-render (including the
          // cover-to-exit one); finishedRef keeps it from resuming the
          // deliberately frozen final frame. The src attaches here rather
          // than in JSX so a hidden curtain (first-visit intro running,
          // reduced motion) never downloads the film a second time.
          if (el && !finishedRef.current && !shouldSkip()) {
            if (!el.getAttribute("src")) el.src = "/videos/intro.mp4";
            el.muted = true;
            // A rejected play() here is NOT fatal: the commit can interrupt
            // the first call while the autoPlay attribute still starts
            // playback once data arrives (same quirk the first-visit intro
            // works around). Real failures are caught by onError and the
            // stall watchdog.
            const p = el.play();
            if (p) p.catch(() => {});
          }
        }}
        autoPlay
        muted
        playsInline
        preload="auto"
        aria-hidden
        onTimeUpdate={onTime}
        onEnded={finish}
        onError={finish}
        className="kul-intro-content absolute inset-0 z-10 h-full w-full object-cover"
      />
    </Stage>
  );
}

export default function PageReveal() {
  const pathname = usePathname();
  if (!PRIMARY.has(pathname)) return null;
  // Keyed on the pathname so every arrival at a primary page replays it.
  return pathname === "/" ? (
    <FilmCurtain key={pathname} />
  ) : (
    <TailCurtain key={pathname} />
  );
}
