"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const SEEN_KEY = "kul-intro-seen";
/**
 * Total ceremony cap, exit fade included.
 *
 * It was 2500 when the film ended on the bare lion, 3750 when the lockup
 * arrived, 5000 for the five-second Blender film, and it is 15950 for the
 * Higgsfield film, which runs 15.93 seconds and spends its final two
 * seconds dissolving into the page. It has to be at least the length of the
 * film, or the cap cuts the ending off. Every escape hatch below is
 * unchanged, so the visitor who does not want to watch still pays nothing.
 */
const CAP_MS = 15950;
/**
 * How long the closing fade takes, and WHEN: the fade IS the film's final
 * two seconds (Jalen, 13 Aug 2026). The exit starts at CAP_MS minus this,
 * while the closing card is still playing, and completes exactly as the
 * film ends, so the homepage comes up through the gold lockup: "one
 * continuous experience", the brief's own words. The overlay used to climb
 * off the top of the screen instead; that gesture put a direction on a
 * moment that is meant to dissolve.
 */
const EXIT_MS = 2000;
/** How long the still frame stands in for the film when motion is unwelcome. */
const REDUCED_MS = 400;
/**
 * How long the film gets to actually start moving before we give up on it.
 *
 * IT WAS 1500 AND THAT WAS A PHONE-ONLY BUG. iOS does not honour
 * `preload="auto"` on a cellular connection, so on mobile data the fetch of
 * the film does not even begin until `play()` is called, and a second and a
 * half is not enough to get from nothing to a decoded first frame. The
 * deadline fired, the overlay abandoned, and the opening was never seen by
 * anybody who arrived on a phone away from wifi.
 *
 * What is on screen while we wait is the overlay's own black ground. The
 * video used to carry the closing lockup as its poster, and that painted
 * the ENDING for a flash on every single load before the first frame
 * decoded, spoiling the reveal (caught by Jalen, 13 Aug 2026). The film
 * opens from black, so black is the only honest waiting image.
 */
const PLAY_DEADLINE_MS = 4000;
/**
 * The outside edge of the whole ceremony, measured from the mount.
 *
 * The cap below is timed from the film's FIRST FRAME so that a slow start
 * yields the whole film rather than its tail. That alone has no upper bound,
 * so this is the bound: whatever happens, the overlay is gone by here. It sits
 * under the 19000ms failsafe on the pre-paint cover in app/layout.tsx, so the
 * two can never disagree about which one is still holding the screen.
 */
const CEILING_MS = 18500;
/**
 * The film's own ground, so any letterboxing is invisible against it.
 *
 * It was #050301 for years, because the Blender film was composited onto
 * that near-black. Both client cuts are grounded in TRUE black: sampled at
 * four points across each film, every corner reads 0,0,0. Against #050301
 * the letterbox bands were faintly but visibly lighter than the picture
 * they framed, which is the one thing a letterbox must never be. Keep this
 * equal to whatever the shipped films actually measure, and keep the
 * pre-paint cover in app/layout.tsx equal to this.
 */
const GROUND = "#000000";

/**
 * When each cut may be cropped to fill the screen instead of letterboxed.
 *
 * The landscape cut is 16:9 (1.78) and the portrait cut is 9:16 (0.5625);
 * each band brackets its own film loosely enough to swallow ordinary window
 * shapes and tightly enough that the crop never reaches the lockup. Written
 * as media queries rather than measured in JS on purpose: a window resized
 * or a phone turned over re-evaluates them for free, with no React state and
 * no risk of restarting the film.
 */
const FIT_COVER = {
  landscape:
    "[@media(min-aspect-ratio:3/2)_and_(max-aspect-ratio:2/1)]:object-cover",
  portrait:
    "[@media(min-aspect-ratio:1/2)_and_(max-aspect-ratio:3/4)]:object-cover",
} as const;

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
 * A distant gold star grows into the Doctor Bird flying at the lens. It
 * arrives, breathes, fixes its eye on the viewer, then darts and taps the
 * screen; the tap ignites a molten whiteout, the gold spirals, and the KUL
 * lockup materialises out of the settling particles, closing on the full
 * gold mark. This is Mark's twenty-panel storyboard, produced in Higgsfield
 * Cinema Studio 3.5 and cut in Final Cut Pro (production guide:
 * project-docs/33-higgsfield-intro-plan.md; master export:
 * ~/Movies/kul-intro.mp4 and ~/Movies/mobile-intro.mp4). There are TWO
 * cuts, both from the client: kul-intro.mp4 is 1080p landscape, 15.93s,
 * ~9MB; kul-intro-mobile.mp4 is 720x1280 portrait, 15.79s, ~3MB, and a
 * phone gets that one. Both are silent, and both carry the tagline
 * composited beneath the closing card at encode time (neither Final Cut
 * master has it), one line on the wide cut and three on the tall one, so
 * each poster carries it too.
 *
 * IT PLAYS ONCE PER TAB SESSION, home page only, and never replays while the
 * visitor moves around inside that session. The gate below and the pre-paint
 * cover in app/layout.tsx read the same flag.
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
  /**
   * Which cut to play. There are two films, not one film letterboxed: a
   * 16:9 landscape cut and a 9:16 portrait cut, both edited by the client
   * from the same footage, so a phone gets a film composed for a phone
   * rather than a wide frame stranded in bars.
   *
   * Chosen ONCE, at mount, and never re-chosen: swapping `src` mid-play
   * restarts the film, so somebody who turns their phone over halfway
   * through keeps the cut they started. It is decided in the mount effect
   * rather than during render because the server has no viewport and
   * guessing one would hydrate wrong.
   */
  const [portrait, setPortrait] = useState(false);
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
    // Taller than it is wide gets the portrait cut. Square lands on
    // landscape, which is the safer of the two to letterbox.
    const isPortrait = window.matchMedia("(max-aspect-ratio: 1/1)").matches;

    let raf1 = 0;
    let raf2 = 0;
    let idleId: number | undefined;
    const mount = () => {
      markSeen();
      setPortrait(isPortrait);
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
  // made of already over. The ceremony is the whole film or it is
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
        // Take the reduced-motion treatment: switch to the still (the
        // closing lockup card), hold it for a beat, and give them the site.
        // The video no longer carries a poster (it flashed the ending at
        // the start), so the still phase is what provides the lockup here.
        setPhase("still");
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
      style={{ backgroundColor: GROUND }}
      // IT FADES INTO THE SITE. The film closes holding the gold lockup, and
      // the homepage comes up through it as one continuous experience; that
      // is the brief's own sentence, and a slide would put a direction on a
      // moment that is meant to dissolve. A fade is also inherently
      // reduced-motion-safe, so the old motion-reduce special case is gone.
      className={`fixed inset-0 z-100 overflow-hidden transition-opacity duration-2000 ease-linear ${
        phase === "exit" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      {/* FILL THE SCREEN WHEN THE CROP IS CHEAP, LETTERBOX WHEN IT IS NOT.
          Each cut gets a band of viewport shapes close enough to its own
          that covering costs only a few percent off an edge, and inside
          that band the film runs genuinely fullscreen (Jalen, 13 Aug 2026:
          a MacBook was showing bars). Outside it the crop turns
          destructive, because the closing lockup spans about ninety percent
          of the frame's width and the tagline sits near its bottom edge:
          a long window would shave the tagline off, a very tall phone would
          cut the lion and the K. Those fall back to contain, and the bars
          are the film's own near-black on the overlay's identical ground,
          so the seam cannot be seen. */}
      {phase === "still" ? (
        <Image
          src={portrait ? "/videos/kul-intro-poster-mobile.jpg" : "/videos/kul-intro-poster.jpg"}
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className={`object-contain ${FIT_COVER[portrait ? "portrait" : "landscape"]}`}
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
           skip the source honestly, but the webm earns nothing here even
           where it does decode: it was the larger file as well as the
           unplayable one. Both cuts are H.264 High, level 4.0, yuv420p,
           which every browser and every phone decodes in hardware.

           THE TWO CUTS ARE CHOSEN IN JAVASCRIPT, NOT BY A `media` ATTRIBUTE
           ON A SECOND `<source>`. That attribute looks like the obvious
           answer and does nothing: browsers dropped support for media on
           video sources years ago and evaluate only the first playable
           entry, so both phones and desktops would have got whichever came
           first. `key` on the element forces React to build a new one when
           the cut changes, because swapping a `<source>` child in place
           leaves the already-committed media element pointed at the old
           file until load() is called by hand.

           If a second encoding is ever wanted (AV1, say), it goes AFTER this
           one and its type carries a full `codecs` string. */
        <video
          key={portrait ? "portrait" : "landscape"}
          ref={videoRef}
          muted
          playsInline
          autoPlay
          preload="auto"
          aria-hidden="true"
          onError={abandon}
          className={`h-full w-full object-contain ${FIT_COVER[portrait ? "portrait" : "landscape"]}`}
        >
          <source
            src={portrait ? "/videos/kul-intro-mobile.mp4" : "/videos/kul-intro.mp4"}
            type='video/mp4; codecs="avc1.640028"'
          />
        </video>
      )}

      {/* NO TAGLINE OVER THE TOP. There used to be one here, from when the
          opening ended on the bare lion. The tagline now lives INSIDE the
          encode, composited beneath the closing card from the brand tokens
          and ArchivoBlack (13 Aug 2026), fading in at 12.9s. HTML text
          floated over the film would only compete with it. */}

      {/* SKIP, AS A MARK RATHER THAN A WORD.

          The glyph is the skip-to-end symbol every player uses, which is
          literally what the control does: jump past the film to the site.
          The ring that used to be drawn around it is gone (Jalen, 13 Aug
          2026): the bare glyph sits quieter over the film. The accessible
          name stays, the target stays a full 44px, and keyboard focus gets
          a gold ring that pointer users never see. */}
      <button
        type="button"
        onClick={dismiss}
        className="group absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-6 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full text-white/70 transition-colors duration-200 hover:text-k-gold-lit focus-visible:text-k-gold-lit focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-k-gold-lit/60"
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
