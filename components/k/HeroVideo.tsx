"use client";

import { useEffect, useRef, useState } from "react";

type HeroVideoProps = {
  poster: string;
  className?: string;
  /**
   * The film to play, without the .mp4 on the end, e.g. "kul-hero" or
   * "dash-night". A matching "-720" file has to sit beside it in
   * public/videos, because phones are served the smaller one.
   */
  name?: string;
  /**
   * What the control says it is stopping, for a screen reader: "the hero film",
   * "the dashcam". It is read as "Pause the hero film".
   */
  label?: string;
};

/**
 * A silent background loop. Autoplay, loop, muted, playsinline, and paused the
 * moment it leaves the viewport, so a background video never costs decode time
 * on a section nobody is looking at.
 *
 * Reduced motion gets the poster frame and no video at all: the still carries
 * the same information, so nothing is withheld.
 *
 * ============================================================================
 * IT HAS A PAUSE BUTTON, AND THAT IS A REQUIREMENT RATHER THAN A FLOURISH.
 * ============================================================================
 * Mark asked for one in his brief (§8.2, "a pause/play control, the Volvo
 * device; accessibility + polish"), and it went unbuilt until 29 Jul 2026.
 *
 * It is also the rule. WCAG 2.2 §2.2.2 Pause, Stop, Hide: anything that moves
 * automatically, starts on its own and runs for more than five seconds must
 * have a way to stop it. A looping hero film is exactly that. The
 * reduced-motion path covers people who have set the preference at the system
 * level and nobody else, and "I find this distracting right now" is not a
 * system setting.
 *
 * WHAT THE BUTTON DOES AND DOES NOT DO. Pressing pause is a decision, so the
 * viewport observer stops overriding it: a film the reader paused must not
 * start again because they scrolled past and came back. That is what
 * `userPaused` is for, and it is separate from `playing`, which is only ever
 * what the element itself reports.
 *
 * ON WHERE IT SITS. Bottom right of the film, small, low contrast until
 * hovered or focused. It is the least important thing in the frame right up
 * until it is the only thing somebody wants, which is the argument for it
 * being present and quiet rather than absent or loud.
 *
 * TO USE A DIFFERENT FILM: pass `name` and a matching `poster`. Both the full
 * size and the "-720" version must exist in public/videos, since the browser
 * picks the smaller one below 768px and silently plays nothing if it is
 * missing.
 */
export default function HeroVideo({
  poster,
  className,
  name = "kul-hero",
  label = "the background film",
}: HeroVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  /**
   * WHETHER THE FILM IS ACTUALLY RUNNING, READ FROM THE ELEMENT.
   *
   * Not inferred from what we last asked it to do. Measured: on first load the
   * button read "Pause the hero film" while the video was sitting paused,
   * because autoplay had not started yet and the state assumed it had. A
   * control that offers to stop something already stopped is worse than no
   * control. The video's own play and pause events are the source of truth,
   * which also covers the browser refusing autoplay outright.
   */
  const [playing, setPlaying] = useState(false);
  /** Whether the reader pressed pause. Their decision outranks scrolling. */
  const [userPaused, setUserPaused] = useState(false);
  /**
   * Whether there is a film to control at all. False under reduced motion, and
   * false until mount, so the server never renders a button for a video that
   * this reader is not going to be shown.
   */
  const [playable, setPlayable] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setPlayable(true);

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    setPlaying(!el.paused);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        // THE READER'S PAUSE WINS. Without this check, scrolling the film out
        // of view and back would restart something they deliberately stopped.
        if (entry.isIntersecting) {
          if (!pausedRef.current) void el.play().catch(() => undefined);
        } else {
          el.pause();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
    };
  }, []);

  /**
   * A plain mirror of `userPaused` the observer can read without being torn down
   * and rebuilt every time it changes. Putting it in the effect's
   * dependencies instead would disconnect and reconnect the observer on every
   * press, which re-fires the callback and restarts the film: the exact thing
   * the check above exists to prevent.
   */
  const pausedRef = useRef(false);
  useEffect(() => {
    pausedRef.current = userPaused;
  }, [userPaused]);

  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    if (el.paused) {
      setUserPaused(false);
      void el.play().catch(() => undefined);
    } else {
      setUserPaused(true);
      el.pause();
    }
    // `playing` is not set here on purpose. The element's own play and pause
    // events set it, so if play() is refused the button tells the truth
    // instead of claiming a film is running that never started.
  };

  return (
    <>
      <video
        ref={ref}
        className={className}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        tabIndex={-1}
      >
        <source
          src={`/videos/${name}-720.mp4`}
          type="video/mp4"
          media="(max-width: 768px)"
        />
        <source src={`/videos/${name}.mp4`} type="video/mp4" />
      </video>

      {playable ? (
        <button
          type="button"
          onClick={toggle}
          // The name changes with the state rather than the button being
          // labelled "play/pause", so a screen reader announces the action
          // about to happen instead of the two it could.
          aria-label={`${playing ? "Pause" : "Play"} ${label}`}
          className="absolute bottom-5 right-5 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/35 text-k-on-dark opacity-45 backdrop-blur-sm transition-opacity duration-200 hover:opacity-100 focus-visible:opacity-100 md:bottom-7 md:right-7"
        >
          {playing ? (
            // Running, so the control offers to stop it: two bars.
            <svg width="10" height="14" viewBox="0 0 10 14" aria-hidden="true">
              <path d="M0 0h3.2v14H0ZM6.8 0H10v14H6.8Z" fill="currentColor" />
            </svg>
          ) : (
            // Stopped, so it offers to start it. The triangle is nudged right
            // of centre because a triangle centred on its bounding box always
            // reads left-heavy: its visual mass is not its geometric middle.
            <svg width="12" height="14" viewBox="0 0 12 14" aria-hidden="true" className="ml-0.5">
              <path d="M0 0.6 11 7 0 13.4Z" fill="currentColor" />
            </svg>
          )}
        </button>
      ) : null}
    </>
  );
}
