"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const SEEN_KEY = "kul-intro-seen";
/**
 * Total ceremony cap, exit fade included.
 *
 * It was 2500 when the film ended on the bare lion, 3750 when the lockup
 * arrived, 5000 when the piece slowed down, and it is 8000 now that the
 * opening is the client's eight second story: the distant light, the arrival,
 * the hover, the strike at the centre of the screen, and the lion born out of
 * the burst with the name and tagline beneath it. It has to be at least the
 * length of the film, or the cap cuts the ending off. Every escape hatch
 * below is unchanged, so the visitor who does not want to watch still pays
 * nothing.
 */
const CAP_MS = 8000;
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
/**
 * How long the film gets to actually start moving before we give up on it.
 *
 * IT WAS 1500 AND THAT WAS A PHONE-ONLY BUG. iOS does not honour
 * `preload="auto"` on a cellular connection, so on mobile data the fetch of a
 * 2.1MB film does not even begin until `play()` is called, and a second and a
 * half is not enough to get from nothing to a decoded first frame. The
 * deadline fired, the overlay abandoned, and the opening was never seen by
 * anybody who arrived on a phone away from wifi.
 *
 * Waiting longer costs nothing now, because what is on screen while we wait is
 * the poster, which is the closing lockup rather than a black frame.
 */
const PLAY_DEADLINE_MS = 4000;
/**
 * The outside edge of the whole ceremony, measured from the mount.
 *
 * The cap below is timed from the film's FIRST FRAME so that a slow start
 * yields the whole film rather than its tail. That alone has no upper bound,
 * so this is the bound: whatever happens, the overlay is gone by here. It sits
 * under the 11000ms failsafe on the pre-paint cover in app/layout.tsx, so the
 * two can never disagree about which one is still holding the screen.
 */
const CEILING_MS = 10500;
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
 * Eight seconds, nine beats, exactly as the client storyboarded it: a black
 * screen; a tiny gold light far off that grows until it is understood to be
 * the Doctor Bird flying at the viewer; the arrival, each slow wingbeat
 * shedding a little gold dust; a hover at the centre where the film breathes;
 * the bird's attention turning to the exact centre of the screen; a sudden
 * dart and a gentle beak tap on that centre; a molten pulse; the lion
 * materialising out of the burst; and the name with the tagline fading in
 * beneath. The bird introduces the lion and never competes with it. It is a
 * rendered film: public/videos/kul-intro.mp4.
 *
 * WHY A FILM AND NOT DRAWN MARKUP. A film does what markup cannot: a real
 * gold bird with feathered wings under studio light, depth of field, and
 * thirty thousand points of gold that assemble into the actual lion artwork.
 * The Blender file on the desktop (~/Desktop/kul/kul.blend) is the editable
 * source, not this component; the lion and the lettering in it are sampled
 * from the brand artwork, so both are the real marks. The hero bird is built
 * on a CC-licensed Sketchfab base model, credited in the colophon.
 *
 * IT PLAYS ONCE PER TAB SESSION, home page only (client direction,
 * 2 Aug 2026). A new tab, window or browser session replays it; moving
 * around the site inside one session never does.
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
  //
  // SESSION-SCOPED AND HOME-ONLY, both on purpose (client direction,
  // 2 Aug 2026). sessionStorage is per tab: every new tab, window or
  // browser session that arrives at the front door gets the opening, and
  // moving around inside one session never replays it. The pathname check
  // matches the pre-paint cover script in app/layout.tsx: the ceremony
  // belongs to the home page, and a deep link to /quote or /services is
  // never made to sit through it.
  useEffect(() => {
    if (window.location.pathname !== "/") return;
    let seen = true;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      // Storage blocked, in a private window for example. Treat as seen, so
      // the opening can never replay on every single visit.
    }
    if (seen) return;

    const markSeen = () => {
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
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
  //
  // THE CAP IS TIMED FROM THE FIRST FRAME, NOT FROM THE MOUNT, and that is
  // the second half of the phone fix. Started at the mount, every second the
  // film spent fetching came out of the film's own running time, so a visitor
  // on mobile data who waited three seconds for it to arrive was then shown
  // the last two seconds of it: the lockup, with the bird and the lion it is
  // made of already over. The ceremony is eight seconds of film or it is
  // nothing. CEILING_MS is what stops that promise being open ended.
  useEffect(() => {
    if (phase === "still") {
      push(setTimeout(dismiss, REDUCED_MS - EXIT_MS));
      return;
    }
    if (phase !== "show") return;
    const v = videoRef.current;
    if (!v) return;

    let capped = false;
    const startCap = () => {
      if (capped) return;
      capped = true;
      push(setTimeout(dismiss, CAP_MS - EXIT_MS));
    };
    // Already running by the time this effect got here, which is the ordinary
    // case on a fast connection with the file in cache.
    if (!v.paused && v.currentTime > 0) startCap();
    v.addEventListener("playing", startCap);

    push(setTimeout(dismiss, CEILING_MS - EXIT_MS));
    return () => v.removeEventListener("playing", startCap);
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
    // Whether a frame has actually been put on the screen. The `playing`
    // event is the only thing that means that, and it is what the watchdog
    // below stands down for.
    let started = false;
    const onPlaying = () => {
      started = true;
    };
    v.addEventListener("playing", onPlaying);

    const played = v.play();
    if (played && typeof played.catch === "function") {
      played.catch(() => {
        // AUTOPLAY REFUSED, WHICH ON A PHONE USUALLY MEANS LOW POWER MODE.
        // iOS blocks even a muted inline film once the battery saver is on,
        // and there is no gesture coming to unblock it, because the visitor
        // has not been asked for one and must not be.
        //
        // The old behaviour was to say nothing and let the full cap run,
        // which meant four and a half seconds of a still frame for somebody
        // whose phone had simply decided not to play video today. Take the
        // reduced-motion treatment instead: the closing lockup is on screen
        // as the poster, hold it for a beat the way the reduced-motion path
        // does, and give them the site.
        push(setTimeout(dismiss, REDUCED_MS));
      });
    }
    push(
      setTimeout(() => {
        // Nothing is moving and nothing has arrived to move with: a 404, a
        // codec this browser cannot decode, a dead connection. `readyState`
        // 3 is HAVE_FUTURE_DATA, so a film that has got that far is about to
        // start and must not be taken away one frame short.
        //
        // A HIDDEN TAB IS EXEMPT BY DESIGN. Browsers stall media in the
        // background on purpose, and nobody is watching it there anyway.
        if (started || v.readyState >= 3) return;
        if (document.visibilityState === "visible") abandon();
      }, PLAY_DEADLINE_MS),
    );
    return () => v.removeEventListener("playing", onPlaying);
  }, [phase, dismiss, abandon]);

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
        /* ================================================================
           ONE SOURCE, AND IT IS THE MP4. DO NOT PUT A WEBM BACK IN FRONT
           OF IT.
           ================================================================
           There used to be a `<source>` for kul-intro.webm above this one,
           and it is the reason the opening never played on an iPhone.

           Measured in Mobile Safari on iOS 26, 3 Aug 2026:

             canPlayType('video/webm')                -> "maybe"
             canPlayType('video/webm; codecs="vp9"')  -> ""
             mediaCapabilities VP9 profile 0 and 1    -> NOT SUPPORTED
             mediaCapabilities H.264 High             -> SUPPORTED

           Those first two lines are the whole trap. WebKit says "maybe" to
           the bare container type, so the resource selection algorithm
           COMMITS to the webm, and only then discovers it cannot decode VP9,
           which it has never supported in any profile. What it does at that
           point is not fail. It sits at readyState 0 forever with
           `video.error` still null, so no error event is dispatched, the
           `onError` below never runs, and the mp4 underneath is never
           reached. The film simply never arrives and the watchdog takes the
           overlay away.

           A `codecs` parameter on the type would be enough to make Safari
           skip the source honestly, but the webm earned nothing here even
           where it did decode: it was the larger file as well as the
           unplayable one, and it was deleted. The mp4 is H.264 High, level
           3.2, yuv420p, 1280x720 at 60fps (2.1MB for the eight-second
           story), which is the one encoding every browser and every phone
           decodes in hardware. A 1080p master lives beside the .blend on
           the desktop if a heavier trade-up is ever wanted.

           If a second encoding is ever wanted (AV1, say), it goes AFTER this
           one and its type carries a full `codecs` string. */
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
          <source src="/videos/kul-intro.mp4" type='video/mp4; codecs="avc1.640020"' />
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
