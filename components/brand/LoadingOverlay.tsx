"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const SEEN_KEY = "kul-intro-seen";
/**
 * Total ceremony cap, exit fade included.
 *
 * It was 2500 when the film ended on the bare lion, then 3750 when the lockup
 * arrived, and it is 5000 now that the whole piece runs slower and holds the
 * finished lockup for a full second. It has to be at least the length of the
 * film, or the cap cuts the ending off. Every escape hatch below is unchanged,
 * so the visitor who does not want to watch still pays nothing.
 */
const CAP_MS = 5000;
/**
 * How long the panel takes to climb off the top of the screen.
 *
 * Matched to the OUT of components/k/RouteTransition.tsx, and for its reason:
 * the opening and the cut between pages are the same gesture, so they should
 * take the same time and use the same curve. A crossfade was here before; it is
 * the same picture at two opacities, so there is nothing to watch. One upward
 * pass has a direction, and the page is uncovered by it rather than revealed
 * underneath it.
 */
const EXIT_MS = 500;
/** How long the still frame stands in for the film when motion is unwelcome. */
const REDUCED_MS = 400;
/** How long the film gets to actually start moving before we give up on it. */
const PLAY_DEADLINE_MS = 1500;
/** The film's own ground, so any letterboxing is invisible against it. */
const GROUND = "#050301";

/**
 * Drop the pre-paint cover that the blocking script in app/layout.tsx put over
 * the page. Called as the exit fade STARTS, not when the overlay unmounts: the
 * cover sits one layer below this component, so leaving it up through the fade
 * would mean fading down to black and then snapping to the page. Clearing it
 * first is what lets the fade actually reveal the site.
 */
function clearCover() {
  const cover = document.getElementById("kul-intro-cover");
  cover?.parentNode?.removeChild(cover);
}

type Phase = "idle" | "show" | "still" | "exit" | "done";

/**
 * THE OPENING
 *
 * A Doctor Bird comes in from far off, flying straight at the lens with its
 * wings beating, turns broadside as it arrives, and comes apart into gold that
 * gathers into the KUL lion. The lion then slides right and the same gold
 * writes the wordmark in beside it, closing on the full lockup. Then it gets
 * out of the way. This is Mark's brief, and it is now a rendered film rather
 * than CSS: public/videos/kul-intro.{mp4,webm}.
 *
 * WHY A FILM AND NOT DRAWN MARKUP. The version before this one faked the whole
 * thing with two images and keyframes, because an earlier generated video cost
 * a megabyte and a half. This one is 941KB for 3.75 seconds and it does what
 * markup cannot: a bird with real wings, seen in perspective, dissolving into
 * thirty thousand points of gold that reassemble as the mark. The Blender file
 * on the desktop that builds it is the editable source now, not this
 * component; the wordmark in it is sampled from the brand artwork, so the
 * lettering is the real thing rather than a font that looks close.
 *
 * IT PLAYS ONCE IN A VISITOR'S LIFE, not once per visit. The flag is in the
 * browser's own storage, so somebody who comes back next week to check a rate
 * never sees it again.
 *
 * SIX THINGS PROTECT THE VISITOR FROM IT, and none are optional:
 *   1. Anybody who has asked their computer to reduce motion gets the closing
 *      frame as a still for a moment, and no film at all.
 *   2. It renders nothing on the server and mounts only after the page has
 *      painted, so the hero is what the browser measures as the main content.
 *      A search engine never sees this file at all.
 *   3. It is gone within CAP_MS no matter what, whether the film plays,
 *      stalls, or never arrives. That number is written once, above, so this
 *      list cannot go stale against it the way it did when the film grew its
 *      second act and this line still promised two and a half seconds.
 *   4. Escape, a click, a tap, or the Skip button ends it immediately.
 *   5. If the video 404s or the browser refuses to autoplay it, the overlay
 *      leaves rather than sitting on a black screen.
 *   6. If storage is blocked, it never runs.
 *
 * That list exists because a broker who wants a rate should never be made to
 * watch anything. The ceremony is for the visitor who has time; it must cost
 * the visitor who does not exactly nothing.
 *
 * THE BIRD APPEARS HERE AND NOWHERE ELSE ON THE SITE. That was the client's
 * rule. The lion is the permanent mark; the bird introduces the story and then
 * leaves.
 */
export default function LoadingOverlay() {
  const [phase, setPhase] = useState<Phase>("idle");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const finishedRef = useRef(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

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
    clearCover();
    setPhase("exit");
    push(setTimeout(() => setPhase("done"), EXIT_MS));
  }, []);

  /** The film is missing or blocked. Leave, rather than hold a black screen. */
  const abandon = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    clearAll();
    clearCover();
    setPhase("done");
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

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf1 = 0;
    let raf2 = 0;
    let idleId: number | undefined;
    const mount = () => {
      markSeen();
      setPhase(reduced ? "still" : "show");
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
      // Insurance: if this ever unmounts by some route other than dismiss,
      // the cover must not outlive it and leave the page black.
      clearCover();
    };
  }, []);

  // The clock. One hard cap covers every way the film can fail to finish:
  // stalled buffering, a decode error, a tab that was backgrounded mid-play.
  //
  // THERE IS NO ENTRANCE FADE, AND THAT IS DELIBERATE. This used to hold the
  // overlay at opacity 0 until a requestAnimationFrame flipped a flag, so it
  // could fade in. That was survivable when a stalled frame just left the page
  // showing. It is not survivable now the pre-paint cover sits underneath at
  // z-99: a late or throttled frame meant the cover held an opaque black
  // screen for the entire cap and the film was never seen. There is nothing to
  // fade in from anyway, because the cover is already the film's own ground
  // colour, so the overlay simply paints opaque on its first frame.
  useEffect(() => {
    if (phase !== "show" && phase !== "still") return;
    push(setTimeout(dismiss, (phase === "still" ? REDUCED_MS : CAP_MS) - EXIT_MS));
  }, [phase, dismiss]);

  // Autoplay is muted and inline, which every current browser allows, but a
  // refusal is still possible and must not strand anyone on a black screen.
  //
  // THE WATCHDOG IS THE POINT HERE. The cover underneath is opaque, so any
  // route to "no frames are arriving" is a route to a black screen held for
  // the whole cap. If the film has not actually started moving by the deadline
  // and the visitor is genuinely looking at the tab, leave and give them the
  // site. A skipped opening is a far cheaper mistake than four seconds of
  // nothing. A hidden tab is exempt: browsers stall media there on purpose,
  // and nobody is watching it anyway.
  useEffect(() => {
    if (phase !== "show") return;
    const v = videoRef.current;
    if (!v) return;
    const played = v.play();
    if (played && typeof played.catch === "function") {
      played.catch(() => {
        // The poster frame is still up, so let the cap run rather than
        // snatching the mark away the instant playback is declined.
      });
    }
    push(
      setTimeout(() => {
        const stalled = v.currentTime === 0 && v.readyState < 3;
        if (stalled && document.visibilityState === "visible") abandon();
      }, PLAY_DEADLINE_MS),
    );
  }, [phase, abandon]);

  // Escape, or any press anywhere, ends it.
  useEffect(() => {
    if (phase !== "show" && phase !== "still") return;
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
    if (phase !== "show" && phase !== "still") return;
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
      style={{
        backgroundColor: GROUND,
        // The route transition's curve, so the two gestures are the same
        // gesture. Tailwind has no token for it.
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      // IT LEAVES UPWARD, THE WAY THE PANEL BETWEEN PAGES DOES. The whole
      // thing, film and all, travels off the top and uncovers the site as it
      // goes, rather than dissolving in place. It never comes back down the way
      // it came: arriving and leaving by the same edge undoes itself.
      //
      // Under reduced motion it does not travel at all. Sliding a full screen
      // of anything past somebody who asked for less movement is exactly the
      // thing they turned off, so that case keeps the old opacity exit.
      className={`fixed inset-0 z-[100] overflow-hidden transition-transform duration-500 motion-reduce:transition-opacity ${
        phase === "exit"
          ? "pointer-events-none -translate-y-full motion-reduce:translate-y-0 motion-reduce:opacity-0"
          : "translate-y-0 opacity-100"
      }`}
    >
      {/* CONTAIN, NOT COVER. The film is 16:9 and a tall phone is far taller
          than that, so cover would crop the lion's mane off at the sides. The
          letterbox is the same near-black the film is grounded in, so on any
          shape of screen it reads as one field of black. */}
      {phase === "still" ? (
        <Image
          src="/videos/kul-intro-poster.jpg"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className="object-contain"
        />
      ) : (
        <video
          ref={videoRef}
          poster="/videos/kul-intro-poster.jpg"
          muted
          playsInline
          autoPlay
          preload="auto"
          aria-hidden="true"
          onError={abandon}
          className="h-full w-full object-contain"
        >
          <source src="/videos/kul-intro.webm" type="video/webm" />
          <source src="/videos/kul-intro.mp4" type="video/mp4" />
        </video>
      )}

      {/* NO TAGLINE OVER THE TOP. There used to be one here, from when the
          opening ended on the bare lion and the frame had something left to
          say. The film now closes on the full lockup, wordmark and all, so a
          line of HTML text laid over it would only compete with the thing it
          was standing in for. */}

      {/* SKIP, AS A MARK RATHER THAN A WORD.

          The glyph is the skip-to-end symbol every player uses, which is
          literally what the control does: jump past the film to the site. It
          keeps its accessible name, so a screen reader still hears "Skip
          intro" and the target stays a full 44px even though the drawn ring
          is smaller than the word ever was. */}
      <button
        type="button"
        onClick={dismiss}
        className="group absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-6 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white/70 transition-colors duration-200 hover:border-k-gold-lit hover:text-k-gold-lit focus-visible:border-k-gold-lit focus-visible:text-k-gold-lit focus-visible:outline-none"
      >
        <span className="sr-only">Skip intro</span>
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-[18px] w-[18px]"
          fill="currentColor"
        >
          <path d="M5 5.2a.8.8 0 0 1 1.24-.67l9.1 6.13a.8.8 0 0 1 0 1.33l-9.1 6.13A.8.8 0 0 1 5 17.45V5.2Z" />
          <rect x="17.4" y="4.6" width="1.9" height="14.8" rx=".95" />
        </svg>
      </button>
    </div>
  );
}
