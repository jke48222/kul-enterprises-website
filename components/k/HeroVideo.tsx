"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import { useReducedMotionLive } from "@/components/k/useReducedMotionLive";
import { createPortal } from "react-dom";
import { fill } from "@/lib/content";
import nav from "@/content/navigation.json";

/**
 * The control's two words, from Interface words in the CMS. One field feeds
 * the visible word AND the accessible name, which is what keeps WCAG 2.5.3
 * Label in Name true by construction however the client rewords them.
 */
const playWord = fill(nav.chrome.playWord);
const pauseWord = fill(nav.chrome.pauseWord);

/** A store that never changes: the snapshot functions do all the work. */
const noopSubscribe = () => () => {};

/**
 * One rule of the fold, and the three states it moves between.
 *
 * Both rules are pinned to the top of the same 6 by 9 box and moved by
 * transform alone, so nothing is laid out twice and each turns about its own
 * centre rather than about a moving edge.
 *
 * THE REST STATE IS WRITTEN OUT AS AN IDENTITY rather than left unset, so both
 * states carry the same three functions in the same order. A transform list
 * interpolates function by function against another list; against `none` the
 * browser has to infer one, and this is not a place to rely on inference.
 */
const RULE =
  "absolute top-0 h-[9px] w-[1.5px] origin-center rounded-full bg-current transition-transform duration-340 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none";
const MARK_REST = "transform-[translate(0px,0px)_rotate(0deg)_scaleY(1)]";
const MARK_FOLD_UPPER = "transform-[translate(2.5px,-2.25px)_rotate(-45deg)_scaleY(0.707)]";
const MARK_FOLD_LOWER = "transform-[translate(-2px,2.25px)_rotate(45deg)_scaleY(0.707)]";

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
  /**
   * Suppress the control entirely, for a caller whose film is not currently
   * being presented.
   *
   * THIS EXISTS BECAUSE OF JourneyScatter, where the film sits inside a wrapper
   * whose opacity is driven by scroll position and is zero for the first
   * two thirds of the piece. A button at opacity zero is still in the tab order
   * and still takes a click, so without this a reader tabbing through that
   * section landed on an invisible control that paused a film they could not
   * see. Opacity is not a way to remove something from a page.
   *
   * It removes the button from the tree rather than hiding it, because hidden
   * and unfocusable is the only combination that is actually true here.
   */
  controlHidden?: boolean;
  /**
   * The id of an element to put the control inside, instead of floating it in
   * the corner of the film.
   *
   * IT IS AN ID AND NOT A REF ON PURPOSE. The pages that use this are server
   * components and cannot create a ref, so the only thing they can hand a
   * client component is a string. The control is then portalled into that
   * element, which is what lets it be a real flex child of the credential
   * strip on the home page and share the strip's centre line with the DOT
   * number rather than being positioned near it and hoping.
   */
  controlSlotId?: string;
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
 * `pausedRef` is for, and it is separate from `playing`, which is only ever
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
  controlHidden = false,
  controlSlotId,
}: HeroVideoProps) {
  const slotted = Boolean(controlSlotId);
  /**
   * The element the control is portalled into, once it exists.
   *
   * Read through useSyncExternalStore with a null server snapshot, because the
   * slot is markup from a server component and is not in the document while
   * the server render runs. Until hydration resolves it, a slotted control
   * renders nothing at all: showing it in the corner for one frame and then
   * moving it into the strip is worse than showing it a frame late.
   */
  const slot = useSyncExternalStore(
    noopSubscribe,
    () => (controlSlotId ? document.getElementById(controlSlotId) : null),
    () => null,
  );
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
  const subscribePlaying = useCallback((onChange: () => void) => {
    const el = ref.current;
    if (!el) return () => undefined;
    el.addEventListener("play", onChange);
    el.addEventListener("pause", onChange);
    return () => {
      el.removeEventListener("play", onChange);
      el.removeEventListener("pause", onChange);
    };
  }, []);
  const playing = useSyncExternalStore(
    subscribePlaying,
    () => !(ref.current?.paused ?? true),
    () => false,
  );
  /**
   * Whether the reader pressed pause. Their decision outranks scrolling. A ref
   * and not state, because nothing renders from it: the observer below reads
   * it, and it must read the current answer without being torn down and
   * rebuilt on every press, which would re-fire the callback and restart the
   * film, the exact thing the check exists to prevent.
   */
  const pausedRef = useRef(false);

  // Observed live: flipping to reduce pauses the film and removes the
  // control; flipping back restores both, because the effect re-runs.
  const reduced = useReducedMotionLive();
  /**
   * Whether there is a film to control at all. False under reduced motion, and
   * false in the server render, so the server never paints a button for a
   * video that this reader is not going to be shown.
   */
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const playable = mounted && !reduced;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reduced) {
      el.pause();
      return;
    }

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
    return () => observer.disconnect();
  }, [reduced]);

  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    if (el.paused) {
      pausedRef.current = false;
      void el.play().catch(() => undefined);
    } else {
      pausedRef.current = true;
      el.pause();
    }
    // `playing` is not set here on purpose. The element's own play and pause
    // events set it, so if play() is refused the button tells the truth
    // instead of claiming a film is running that never started.
  };

  /**
   * THE CONTROL IS A LINE OF TYPE, NOT A PLATE OVER THE PICTURE.
   *
   * It was a 40px frosted circle: a white hairline ring, a black fill at 35%,
   * a backdrop blur, and 45% opacity until you touched it. That is the default
   * media-player look and it was the only element on this site wearing one.
   * Everything else here is a hairline and a line of tracked micro caps, so
   * the one component that reached for a glass pill was the one that read as
   * borrowed from somewhere else.
   *
   * So it is set in exactly what the credential strip beside it is set in:
   * font-text, text-k-micro, uppercase. On the home page it is literally a
   * member of that row, sitting on the same centre line as the DOT number and
   * the location, which is what the client asked for and is also the only
   * placement that cannot collide with them.
   *
   * THE WORD IS NOT DECORATION. A bare glyph over film is ambiguous at 11px,
   * and the word is what makes the mark legible as play rather than as an
   * arrow. It also means the control reads the same way the rest of the page
   * does, at a glance, without anybody having to recognise an icon.
   *
   * THE TARGET IS BIGGER THAN THE INK. The type is about 16px tall, which is
   * under the 24px WCAG asks of a control. The `after` pseudo-element pushes
   * the hit area out to 28px without changing the layout of the row it sits
   * in, so the strip keeps its height and the button keeps its target.
   */
  const control =
    playable && !controlHidden ? (
      <button
        type="button"
        onClick={toggle}
        // The name changes with the state rather than the button being
        // labelled "play/pause", so a screen reader announces the action
        // about to happen instead of the two it could.
        //
        // THE VISIBLE WORD IS THE FIRST WORD OF THAT NAME, deliberately. WCAG
        // 2.5.3 Label in Name wants the visible text to open the accessible
        // name, so somebody driving this page by voice can say "pause" and hit
        // the thing that reads Pause. The same CMS field renders both, so the
        // rule survives any rewording at /admin.
        aria-label={`${playing ? pauseWord : playWord} ${label}`}
        className={[
          // POSITION IS SET ONCE, IN THE CONDITIONAL BELOW, AND NEVER HERE.
          // `relative` used to sit in this line and `absolute` was added lower
          // down for the floating call sites. Both are the same specificity, so
          // the winner was whichever Tailwind happened to emit last rather than
          // whichever was written last, and `relative` won: the control stayed
          // in normal flow and the safety band put it hard against the left
          // edge, 1175px from where right-8 says it should be.
          "group inline-flex items-center gap-2.5 whitespace-nowrap font-text text-k-micro uppercase",
          // THE WORD IS AT FULL STRENGTH, AND THAT IS A CONTRAST DECISION
          // RATHER THAN A LOUDNESS ONE. #fcfcfc is the only tone that clears
          // 4.5:1 in all four places this appears. Measured against a blown
          // highlight it reads 10.1:1 on the home strip, 14.9:1 low on the
          // safety band, about 11:1 in the journey film band and 6.9:1 on the
          // daylight windscreen in the contact sheet. The soft grey one step
          // down lands at 3.0:1 on that last one, which fails, and buying it
          // back would mean regrading Mark's own footage to protect a colour
          // choice. Never soften this to text-k-on-dark-soft.
          //
          // IT IS MONOCHROME FOR THE SAME REASON. Gold is the tone that fails
          // hardest over film: app/journey/page.tsx already records 2.44:1 for
          // gold over this exact dashcam footage. The fold and the word carry
          // the state without needing a colour to help.
          "text-k-on-dark",
          // THE TARGET IS BIGGER THAN THE INK. The type is about 16px tall,
          // under the 24px WCAG 2.5.8 asks of a control. The pseudo-element
          // takes the hit area to roughly 32px without adding a single pixel
          // to the row it sits in, so the credential strip keeps its height.
          "before:absolute before:-inset-x-3 before:-inset-y-2 before:content-['']",
          "focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-k-on-dark",
          // The three floating call sites sit over moving film, where a bright
          // frame can pass under the type. The shadow keeps it readable there.
          // In the strip it costs nothing, so it is simply not applied.
          // In the strip it is a flex child and only needs a containing block
          // for its own target pseudo-element. Floating, `absolute` provides
          // that containing block itself, so `relative` must not be added too.
          slotted
            ? "relative"
            : "absolute bottom-6 right-6 z-20 [text-shadow:0_1px_3px_rgba(0,0,0,0.85)] md:bottom-8 md:right-8",
        ].join(" ")}
      >
        {/* THE MARK IS THE MENU MARK CONJUGATED A SECOND TIME. Two rules stand
            parallel as the pause bars and fold to a chevron for play. Nothing
            appears and nothing fades out mid-movement: the same two strokes do
            both jobs, which is the argument components/k/MenuMark.tsx makes and
            the reason this reads as one fold rather than two icons swapped.

            THE NUMBERS ARE DERIVED, NOT EYEBALLED. To become a chevron each
            rule travels to the middle, turns 45 degrees and shortens to the
            length of a 45 degree run, which is 1 over root 2. The upper stroke
            runs from (1,0) to the apex at (5.5,4.5) and the lower from that
            apex to (1,9), so both midpoints land on the same x and the rounded
            caps meet at the point. Working back gives the translations below.

            THE ROUNDED CAPS ARE LOAD BEARING, as on the menu mark: square ends
            leave two corners at the vertex and it stops reading as a fold. */}
        <span aria-hidden="true" className="relative block h-[9px] w-[6px] shrink-0">
          <span className={`${RULE} left-0 ${playing ? MARK_REST : MARK_FOLD_UPPER}`} />
          <span className={`${RULE} right-0 ${playing ? MARK_REST : MARK_FOLD_LOWER}`} />
        </span>

        {/* THE WORD, IN A CELL THAT CANNOT CHANGE SIZE. "Pause" is five letters
            and "Play" is four, so one span would shrink the lockup at the
            moment it is pressed and jog the mark out from under the reader's
            own cursor. Both words share one grid cell with the longer one
            always present and invisible, so the cell is measured from the type
            actually rendering, whatever face the reader ends up with. */}
        <span className="relative grid">
          <span aria-hidden="true" className="invisible col-start-1 row-start-1">
            {/* Whichever of the two words is longer, so the cell is measured
                from the widest word the control can ever show. */}
            {pauseWord.length >= playWord.length ? pauseWord : playWord}
          </span>
          <span className="col-start-1 row-start-1">{playing ? pauseWord : playWord}</span>
          {/* The hairline is the hover, which is the idiom this site already
              teaches for interactive type. It is also what stops the word
              reading as a fourth credential in a row of three. */}
          <span
            aria-hidden="true"
            className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
          />
        </span>
      </button>
    ) : null;

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

      {slotted ? (slot ? createPortal(control, slot) : null) : control}
    </>
  );
}
