"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const SEEN_KEY = "kul-intro-seen";
/** Total ceremony cap, exit fade included (design bible §3.22: ≤2.5s). */
const CAP_MS = 2500;
/** Opacity-only exit fade. */
const EXIT_MS = 350;
/** If the film hasn't started by now, drop the ceremony entirely. */
const WATCHDOG_MS = 900;

type Phase = "idle" | "show" | "exit" | "done";

/**
 * First-visit-EVER intro film (v2 mount policy, design bible §3.22).
 *
 * v1 covered the page pre-paint via an inline <html data-intro> gate, which
 * hid the hero LCP from crawlers and Lighthouse. v2 inverts the order:
 *
 * 1. Gate: localStorage (first visit ever, not per-session). Storage
 *    blocked or reduced motion → never shows.
 * 2. Mount: renders null on the server AND on first client render; the film
 *    mounts from a post-first-paint idle callback (double-rAF then
 *    requestIdleCallback), so the hero poster paints and is measured as LCP
 *    before the overlay exists.
 * 3. Cap: the whole ceremony, film plus exit fade, is gone within 2.5s,
 *    with a visible SKIP control, Escape, and pointer-down dismissal. If
 *    playback hasn't started by the watchdog, the ceremony is dropped.
 *
 * Animations are opacity-only; RouteVeil owns route transitions and never
 * replays this.
 */
export default function LoadingOverlay() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [entered, setEntered] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const finishedRef = useRef(false);

  const push = (t: ReturnType<typeof setTimeout>) => timers.current.push(t);
  const clearAll = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  /** End the ceremony now: fade out, then unmount. */
  const dismiss = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    clearAll();
    videoRef.current?.pause();
    setPhase("exit");
    push(setTimeout(() => setPhase("done"), EXIT_MS));
  }, []);

  // Gate + post-first-paint idle mount.
  useEffect(() => {
    let seen = true;
    try {
      seen = localStorage.getItem(SEEN_KEY) === "1";
    } catch {
      // Storage blocked (private browsing): treat as seen, and never risk
      // replaying the film on every visit.
    }
    if (seen) return;

    const markSeen = () => {
      try {
        localStorage.setItem(SEEN_KEY, "1");
      } catch {
        /* best effort */
      }
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Reduced motion: no film, ever. Mark seen so a later preference
      // change never surfaces a surprise intro.
      markSeen();
      return;
    }

    let raf1 = 0;
    let raf2 = 0;
    let idleId: number | undefined;
    const mount = () => {
      markSeen();
      setPhase("show");
    };
    // Double rAF guarantees the first frame has painted (hero poster = LCP)
    // before we even queue the idle callback.
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        if (typeof window.requestIdleCallback === "function") {
          idleId = window.requestIdleCallback(mount, { timeout: 600 });
        } else {
          push(setTimeout(mount, 250));
        }
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      if (idleId !== undefined) window.cancelIdleCallback?.(idleId);
      clearAll();
    };
  }, []);

  // Ceremony clock: hard cap + playback watchdog; fade-in on the next frame.
  useEffect(() => {
    if (phase !== "show") return;
    const raf = requestAnimationFrame(() => setEntered(true));
    push(setTimeout(dismiss, CAP_MS - EXIT_MS));
    push(
      setTimeout(() => {
        const v = videoRef.current;
        if (!v || v.readyState < 2 || v.currentTime === 0) dismiss();
      }, WATCHDOG_MS)
    );
    return () => cancelAnimationFrame(raf);
  }, [phase, dismiss]);

  // Escape and any pointer press skip the film.
  useEffect(() => {
    if (phase !== "show") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    const onPointer = () => dismiss();
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [phase, dismiss]);

  // Scroll lock while the film is up (released the moment the fade starts).
  useEffect(() => {
    if (phase !== "show") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [phase]);

  if (phase === "idle" || phase === "done") return null;

  return (
    <div
      role="status"
      aria-label="KUL Enterprises intro"
      className={`fixed inset-0 z-[100] bg-black transition-opacity duration-300 ease-out ${
        phase === "exit" || !entered
          ? "pointer-events-none opacity-0"
          : "opacity-100"
      }`}
    >
      <video
        ref={videoRef}
        // REPLACEABLE ASSET: generated intro film; regenerate as brand evolves
        src="/videos/intro.mp4"
        autoPlay
        muted
        playsInline
        preload="auto"
        aria-hidden
        onEnded={dismiss}
        onError={dismiss}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <button
        type="button"
        onClick={dismiss}
        className="absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-6 z-10 inline-flex h-11 items-center rounded-full border border-white/30 px-5 text-[11px] font-medium uppercase tracking-eyebrow text-white/80 transition-colors duration-200 hover:border-white hover:text-white"
      >
        Skip
      </button>
    </div>
  );
}
