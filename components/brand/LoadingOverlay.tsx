"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";

const SEEN_KEY = "kul-intro-seen";
/** Total ceremony cap, exit fade included. */
const CAP_MS = 2500;
/** Opacity-only exit fade. */
const EXIT_MS = 350;

type Phase = "idle" | "show" | "exit" | "done";

/**
 * THE OPENING
 *
 * Black screen, then the Doctor Bird crosses it trailing gold, the trail
 * gathers into the lion, and the tagline settles underneath. Then it gets out
 * of the way. This is Mark's brief, built rather than filmed.
 *
 * IT PLAYS ONCE IN A VISITOR'S LIFE, not once per visit. The flag is in the
 * browser's own storage, so somebody who comes back next week to check a rate
 * never sees it again.
 *
 * FIVE THINGS PROTECT THE VISITOR FROM IT, and none are optional:
 *   1. It is skipped entirely for anybody who has asked their computer to
 *      reduce motion, and marked as seen so it cannot ambush them later.
 *   2. It renders nothing on the server and mounts only after the page has
 *      painted, so the hero is what the browser measures as the main content.
 *      A search engine never sees this file at all.
 *   3. It is gone within two and a half seconds no matter what.
 *   4. Escape, a click, a tap, or the Skip button ends it immediately.
 *   5. If storage is blocked, it never runs.
 *
 * That list exists because a broker who wants a rate should never be made to
 * watch anything. The ceremony is for the visitor who has time; it must cost
 * the visitor who does not exactly nothing.
 *
 * THE BIRD APPEARS HERE AND NOWHERE ELSE ON THE SITE. That was the client's
 * rule and it is the reason it was taken off the journey page when this was
 * built. The lion is the permanent mark; the bird introduces the story and
 * then leaves.
 *
 * IT IS DRAWN, NOT FILMED. An earlier version played a generated video, which
 * cost a megabyte and a half and could not be edited without regenerating it.
 * Everything below is two images and CSS, so the timing can be changed by
 * editing the numbers in this file.
 */
export default function LoadingOverlay() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [entered, setEntered] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const finishedRef = useRef(false);

  const push = (t: ReturnType<typeof setTimeout>) => timers.current.push(t);
  const clearAll = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  /** End it now: fade out, then unmount. */
  const dismiss = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    clearAll();
    setPhase("exit");
    push(setTimeout(() => setPhase("done"), EXIT_MS));
  }, []);

  // The gate, and the mount after first paint.
  useEffect(() => {
    let seen = true;
    try {
      seen = localStorage.getItem(SEEN_KEY) === "1";
    } catch {
      // Storage blocked, in a private window for example. Treat as seen, so
      // the opening can never replay on every single visit.
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
    // Two frames guarantees the page has painted before the idle callback is
    // even queued, so the hero is measured as the page's main content.
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

  // The clock. One hard cap, and nothing else to go wrong: there is no video
  // to stall, so the old playback watchdog is gone with it.
  useEffect(() => {
    if (phase !== "show") return;
    const raf = requestAnimationFrame(() => setEntered(true));
    push(setTimeout(dismiss, CAP_MS - EXIT_MS));
    return () => cancelAnimationFrame(raf);
  }, [phase, dismiss]);

  // Escape, or any press anywhere, ends it.
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

  // Hold the page still while it plays, released the moment the fade starts.
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
      aria-label="KUL Enterprises opening"
      className={`fixed inset-0 z-[100] overflow-hidden bg-black transition-opacity duration-300 ease-out ${
        phase === "exit" || !entered
          ? "pointer-events-none opacity-0"
          : "opacity-100"
      }`}
    >
      {/* THE TIMINGS, ALL IN ONE PLACE.
          The whole thing is over at 2150ms, which is where the cap above
          dismisses it. Everything moves on transform and opacity only, so it
          stays on the compositor and does not re-lay the page out. */}
      <style>{`
        @keyframes kul-bird-cross {
          0%   { opacity: 0; transform: translate3d(-42vw, 14vh, 0) rotate(-8deg) scale(0.55); }
          14%  { opacity: 1; }
          78%  { opacity: 1; }
          100% { opacity: 0; transform: translate3d(6vw, -6vh, 0) rotate(-2deg) scale(0.78); }
        }
        @keyframes kul-trail-draw {
          0%   { opacity: 0; transform: scaleX(0); }
          22%  { opacity: 0.85; }
          62%  { opacity: 0.85; transform: scaleX(1); }
          100% { opacity: 0; transform: scaleX(1); }
        }
        @keyframes kul-lion-gather {
          0%   { opacity: 0; transform: scale(0.82); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes kul-line-in {
          0%   { opacity: 0; transform: translate3d(0, 10px, 0); }
          100% { opacity: 1; transform: none; }
        }
        .kul-bird  { animation: kul-bird-cross 1150ms cubic-bezier(0.33, 0, 0.2, 1) 200ms both; }
        .kul-trail { animation: kul-trail-draw 1100ms cubic-bezier(0.33, 0, 0.2, 1) 260ms both; transform-origin: left center; }
        .kul-lion  { animation: kul-lion-gather 700ms cubic-bezier(0.16, 1, 0.3, 1) 1150ms both; }
        .kul-line  { animation: kul-line-in 650ms cubic-bezier(0.16, 1, 0.3, 1) 1500ms both; }
      `}</style>

      <div className="relative flex h-full w-full flex-col items-center justify-center">
        {/* The gold the bird leaves behind. A drawn streak rather than a
            particle system: at this size and speed the eye reads a trail,
            and a real particle field would cost far more than it returns. */}
        <div
          aria-hidden="true"
          className="kul-trail pointer-events-none absolute left-0 top-[46%] h-px w-[62%] bg-[linear-gradient(90deg,rgba(214,161,69,0)_0%,rgba(214,161,69,0.9)_78%,rgba(214,161,69,0)_100%)]"
        />

        <div
          aria-hidden="true"
          className="kul-bird pointer-events-none absolute"
        >
          <Image
            src="/images/brand/bird-gold.webp"
            alt=""
            width={420}
            height={420}
            priority
            className="h-auto w-[clamp(88px,14vw,160px)]"
          />
        </div>

        <div className="kul-lion flex flex-col items-center">
          <Image
            src="/images/brand/lion-mark.webp"
            alt=""
            width={512}
            height={512}
            priority
            className="h-auto w-[clamp(96px,13vw,150px)]"
          />
        </div>

        <p className="kul-line mt-8 max-w-[24ch] px-6 text-center font-text text-[clamp(11px,1.5vw,13px)] font-semibold uppercase leading-relaxed tracking-[0.14em] text-k-gold-lit">
          {site.tagline}
        </p>
      </div>

      <button
        type="button"
        onClick={dismiss}
        className="absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-6 z-10 inline-flex h-11 items-center rounded-full border border-white/30 px-5 font-text text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80 transition-colors duration-200 hover:border-white hover:text-white"
      >
        Skip
      </button>
    </div>
  );
}
