"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { site } from "@/lib/site";

const SEEN_KEY = "kul-intro-seen";

/**
 * First-visit intro, built to Mark's concept board frame by frame.
 *
 * Primary: the generated intro film (bird flies in trailing gold, dissolves
 * into particles, the KUL logo and tagline resolve), played at a contained
 * size on a pure black stage. The film's own black background matches the
 * stage, so its edges are invisible without any blend mode.
 *
 * The <video> ships without src (data-src only); an inline script in the
 * root layout attaches it pre-paint on first visits. Repeat visits never
 * fetch or decode the film even though the element is in the server HTML.
 *
 * Fallback: the CSS build of the same sequence using Mark's actual artwork.
 * Used automatically if the video errors or has not started within a second.
 *
 * Reveal: modeled on the Terminal Industries intro. When the film ends, the
 * black splits along a horizontal seam at center and the letterbox opening
 * expands vertically with rounded lips until the page fills the viewport.
 *
 * Both paths: overlay sits above server-rendered content so nothing waits on
 * it, first visit only via sessionStorage, dismissible with Escape. Reduced
 * motion skips the film and the split, showing a still logo and a fade.
 */
export default function LoadingOverlay() {
  const [phase, setPhase] = useState<"pending" | "show" | "exit" | "done">(
    "pending"
  );
  const [mode, setMode] = useState<"video" | "css">("video");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduceRef = useRef(false);

  const push = (t: ReturnType<typeof setTimeout>) => timers.current.push(t);
  const clearAll = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const REVEAL_MS = 1750; // 0.22s hold + 1.35s split + settle

  const startCssClock = (reduce: boolean) => {
    clearAll();
    push(setTimeout(() => setPhase("exit"), reduce ? 1300 : 3700));
    push(setTimeout(() => setPhase("done"), reduce ? 1800 : 3700 + REVEAL_MS));
  };

  useEffect(() => {
    let seen = true;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
      if (!seen) sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // Storage blocked (private browsing). Never trap the visitor.
    }
    if (seen) {
      document.documentElement.removeAttribute("data-intro");
      setPhase("done");
      return;
    }
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    reduceRef.current = reduce;
    setPhase("show");

    if (reduce) {
      setMode("css");
      startCssClock(true);
    } else {
      // Video mode: exit on ended; hard cap in case ended never fires;
      // watchdog falls back to the CSS sequence if playback never starts.
      push(setTimeout(() => setPhase("exit"), 6200));
      push(setTimeout(() => setPhase("done"), 6200 + REVEAL_MS));
      push(
        setTimeout(() => {
          const v = videoRef.current;
          if (!v || v.readyState < 2 || v.currentTime === 0) {
            setMode("css");
            startCssClock(false);
          }
        }, 1400)
      );
    }
    return clearAll;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (phase !== "show") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // Guards the intro from finishing twice (the timeupdate freeze below plus
  // the native `ended` fallback can both fire).
  const finishedRef = useRef(false);

  /** End the intro now and run the letterbox reveal. */
  const dismiss = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    clearAll();
    setPhase("exit");
    push(setTimeout(() => setPhase("done"), REVEAL_MS));
  };

  // Freeze on the settled logo and start the reveal a beat BEFORE the native
  // end. Playback never reaches the `ended` boundary, where the browser snaps
  // to an early frame for one frame — a gold flash under mix-blend-screen.
  const onVideoTime = () => {
    const v = videoRef.current;
    if (!v || finishedRef.current || !v.duration) return;
    if (v.currentTime >= v.duration - 0.2) {
      v.pause();
      dismiss();
    }
  };

  // Cleanup once finished so the pre-paint gate never lingers.
  useEffect(() => {
    if (phase === "done") {
      document.documentElement.removeAttribute("data-intro");
    }
  }, [phase]);

  if (phase === "done") return null;

  // Rendered in the server HTML (phase "pending") so first visits are
  // covered before first paint; html[data-intro] decides visibility.
  return (
    <div
      role="status"
      aria-label="KUL Enterprises is loading"
      className={`kul-intro-root fixed inset-0 z-[100] items-center justify-center overflow-hidden ${
        phase === "exit" ? "kul-reveal pointer-events-none" : ""
      }`}
    >
      {/* The black stage: two panels meeting at center. On reveal they pull
          apart, opening a rounded-lip letterbox onto the page beneath. */}
      <div
        aria-hidden
        className="kul-panel-top absolute inset-x-0 top-0 h-[calc(50%_+_20px)] rounded-b-[36px] bg-black"
      />
      <div
        aria-hidden
        className="kul-panel-bottom absolute inset-x-0 bottom-0 h-[calc(50%_+_20px)] rounded-t-[36px] bg-black"
      />

      {mode === "video" ? (
        <video
          ref={(el) => {
            videoRef.current = el;
            // Only wire the film up when this visit actually shows the
            // intro (data-intro set pre-paint). Repeat visits keep the
            // element src-less: zero fetch, zero decode. finishedRef stops
            // the re-invoked inline ref from resuming the deliberately
            // frozen final frame on the exit re-render.
            if (
              el &&
              !finishedRef.current &&
              document.documentElement.getAttribute("data-intro") === "1"
            ) {
              if (!el.getAttribute("src")) el.src = el.dataset.src ?? "";
              // React does not serialize `muted` into server HTML, so the
              // browser blocks the pre-hydration autoplay as an unmuted
              // video. Re-mute and (re)start unconditionally — play() on an
              // already-playing element is a harmless no-op, and the
              // `paused`-guarded version raced the browser and stuck at 0.
              el.muted = true;
              const p = el.play();
              if (p) p.catch(() => {});
            }
          }}
          // REPLACEABLE ASSET: generated intro film; regenerate or reshoot as brand evolves
          data-src="/videos/intro.mp4"
          // The root-layout inline script attaches src pre-paint on first
          // visits; tell React that mismatch is intentional.
          suppressHydrationWarning
          autoPlay
          muted
          playsInline
          preload="auto"
          aria-hidden
          onTimeUpdate={onVideoTime}
          onEnded={dismiss}
          onError={() => {
            setMode("css");
            startCssClock(reduceRef.current);
          }}
          className="kul-intro-content absolute inset-0 z-10 h-full w-full object-cover"
        />
      ) : (
        <div className="kul-intro-content relative z-10 h-full w-full">
          {/* CSS sequence: flight with wing beats, trail, brake and flare */}
          <div aria-hidden className="absolute inset-0 overflow-hidden">
            <div className="kul-loader-bird absolute left-1/2 top-[34%] -ml-[88px]">
              <div className="kul-bird-lift relative w-44">
                <Image
                  // REPLACEABLE ASSET: bird artwork extracted from the concept board; swap for vector
                  src="/images/brand/bird-body.png"
                  alt=""
                  width={148}
                  height={109}
                  priority
                  className="h-auto w-44"
                />
                <Image
                  src="/images/brand/bird-wing.png"
                  alt=""
                  width={148}
                  height={109}
                  priority
                  className="kul-bird-wing absolute left-0 top-0 h-auto w-44"
                />
                {Array.from({ length: 11 }, (_, i) => (
                  <span
                    key={i}
                    className="kul-loader-particle absolute rounded-full bg-gold"
                    style={{
                      width: `${4.5 - (i % 3)}px`,
                      height: `${4.5 - (i % 3)}px`,
                      left: `${-4 - i * 11}px`,
                      bottom: `${30 + (i % 3) * 7 - (i % 2) * 9}px`,
                      animationDelay: `${0.08 + i * 0.08}s`,
                    }}
                  />
                ))}
              </div>

              <div className="absolute left-1/2 top-1/2 w-56 -translate-x-1/2 -translate-y-[58%]">
                <Image
                  src="/images/brand/doctor-bird-display.png"
                  alt=""
                  width={302}
                  height={261}
                  priority
                  className="kul-bird-flare h-auto w-56"
                />
              </div>

              {[
                { x: "-3rem", y: "-2.6rem", l: 30, b: 40, s: 4 },
                { x: "2.5rem", y: "-3rem", l: 110, b: 52, s: 3 },
                { x: "-1.5rem", y: "-3.4rem", l: 70, b: 66, s: 3.5 },
                { x: "3.2rem", y: "-2rem", l: 140, b: 30, s: 2.5 },
                { x: "-3.8rem", y: "-1.2rem", l: 16, b: 24, s: 3 },
                { x: "1rem", y: "-3.8rem", l: 92, b: 74, s: 2.5 },
              ].map((p, i) => (
                <span
                  key={i}
                  className="kul-loader-burst absolute rounded-full bg-gold"
                  style={
                    {
                      width: `${p.s}px`,
                      height: `${p.s}px`,
                      left: `${p.l}px`,
                      bottom: `${p.b}px`,
                      "--burst-x": p.x,
                      "--burst-y": p.y,
                    } as React.CSSProperties
                  }
                />
              ))}
            </div>
          </div>

          {/* Logo reveal, tagline, shine */}
          <div className="relative flex h-full flex-col items-center justify-center px-6 pt-16 text-center">
            <div className="kul-loader-mark">
              <Image
                src="/images/brand/kul-logo-lockup.png"
                alt="KUL Enterprises LLC"
                width={244}
                height={91}
                priority
                className="h-auto w-56 sm:w-64"
              />
            </div>
            <div className="kul-loader-tagline mt-6 space-y-1.5">
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
              className="kul-loader-shine mt-6 block h-px w-44 bg-[linear-gradient(90deg,transparent,#B59352,transparent)]"
            />
          </div>
        </div>
      )}
    </div>
  );
}
