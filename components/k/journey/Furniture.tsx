import type { ReactNode } from "react";
import { plateLabel, type Scene } from "@/lib/journey-spine";

/**
 * THE ARCHIVAL FURNITURE.
 *
 * The strap that runs along the bottom of every scene: which scene you are in
 * on the left, where the light is on the right, and the plate number of the
 * photograph in shot when there is one.
 *
 * IT IS THE SAME IN ALL SEVENTEEN SCENES AND THAT IS THE ENTIRE POINT. The
 * seventeen scenes are deliberately unalike, so something has to hold them
 * together or the page reads as seventeen different websites. Two things do:
 * the light arc, which is the ground under everything, and this. Same type,
 * same size, same place, same order, every time. Do not restyle it per scene.
 *
 * WHY IT SITS AT THE BOTTOM. It began at the top and collided with the
 * navigation pill, which floats over the first screen of every page. The bottom
 * is also where a film puts this kind of thing, so it reads as a record rather
 * than as a page header.
 *
 * WHY THE RIGHT-HAND SIDE IS A NAMED STAGE AND NOT A TIME. It was a clock, and
 * a clock was wrong twice: the times ran backwards when the scenes were read in
 * order, and setting an invented "05:41" in the same face as the plate numbers
 * claims a precision nobody has. Mark did not record when he took these
 * photographs. See the note in lib/journey-spine.ts.
 */
export default function Furniture({
  scene,
  /** The photograph in shot, if any, as its filename with no extension. */
  plateFile,
  /**
   * Overrides the scene's light stage.
   *
   * Only scene 10 uses this, and it is the only scene that should. That scene
   * carries the page's entire night-to-day crossing on its own, so its stage
   * genuinely changes while you are inside it. Every other scene sits at one
   * stage and must take it from the spine.
   *
   * Typed as a plain string rather than Stage on purpose: scene 10 steps
   * through Mark's own eleven descriptions of the light ("Dawn, in mist", "The
   * sun clears the horizon"), which are finer grained than the six stages the
   * spine needs for the ramp. Those are his words and they are better than
   * flattening them to fit an enum.
   */
  stage,
  /**
   * Replaces the plate number in the middle of the strap. Scene 10 puts its
   * running count there instead, because eleven photographs pass through one
   * scene and a single plate number would be wrong for ten of them.
   */
  middle,
}: {
  scene: Scene;
  plateFile?: string;
  stage?: string;
  middle?: ReactNode;
}) {
  /**
   * SCENE 10 IS THE ONE THAT NEEDS A SCRIM, AND IT IS NOT AN EXCEPTION SO MUCH
   * AS THE WHOLE REASON THE SCRIM EXISTS.
   *
   * Every other scene's ground stays on one side of the light. Scene 10 crosses
   * it: it starts at #252629 and ends at #909ca5, because it is the scene that
   * carries the sunrise. Its ink stays near-white throughout, since all its
   * words sit on photographs. But the strap sits at the bottom of a held screen
   * for the whole scene, so it travels the entire crossing, and measured on the
   * bare ground at the light end it falls to 2.8:1.
   *
   * A photograph will be behind it in the finished scene, but the strap must not
   * depend on that: a scene whose furniture is only legible because a picture
   * happened to load is a scene with a bug in it. So it carries its own wash.
   */
  const needsScrim = scene.ink === "on-photo";

  return (
    <div
      // Not aria-hidden. Somebody reading with their ears should still be told
      // which scene this is and where the light has got to, because that is the
      // same orientation a sighted reader gets from the strap.
      // Lets the contrast sweep find the strap and account for its own wash
      // instead of measuring the type against the bare ground behind it.
      data-strap={needsScrim ? "scrim" : "bare"}
      className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-5 pb-5 pt-16 md:px-10 md:pb-8 md:pt-20"
      style={
        needsScrim
          ? {
              // Bottom-up, so it sits under the strap and has gone before it
              // reaches anything the scene is showing above it. The tall top
              // padding above puts the type well inside the opaque end rather
              // than up in the fade, which is measured: at the strap's own
              // height the wash is around 0.6 and white holds about 9:1 even
              // at the very end of the scene, where the bare ground alone
              // would give 2.7:1.
              background:
                "linear-gradient(to top, rgba(10,11,13,0.82) 0%, rgba(10,11,13,0.66) 40%, rgba(10,11,13,0.28) 72%, transparent 100%)",
            }
          : undefined
      }
    >
      <div
        className="flex items-baseline justify-between gap-4 border-t pt-3 font-display text-[11px] font-medium uppercase leading-none tracking-[0.1em]"
        style={{
          // THE TYPE IS AT FULL STRENGTH AND IS NEVER DIMMED. This started at
          // 0.62 opacity, which reads as appropriately quiet and is a real
          // contrast cost: on the middle scenes it took 11px text to 2.8:1.
          //
          // The trap is that this ground is not one colour. It travels the whole
          // way from #08090a to #eff1f3 down the page, so there is no single
          // faint tone that is safe on all seventeen scenes. Anything dimmed is
          // guaranteed to fail somewhere. This site has already been bitten by
          // exactly that: see the note on --color-ink-faint in app/globals.css.
          //
          // So the strap is quiet by SIZE and TRACKING rather than by alpha,
          // and only the hairline is faint, because a rule is decoration and
          // held to 3:1 rather than 4.5:1.
          borderColor: "color-mix(in srgb, currentColor 28%, transparent)",
        }}
      >
        <span>SC. {String(scene.n).padStart(2, "0")}</span>

        {/* The plate number only exists when a photograph is actually on
            screen. Motion never gets a plate: the films are not part of the
            twenty-six-frame archive and numbering them would make the register
            claim something untrue. */}
        {middle ?? (plateFile ? <span className="tabular-nums">{plateLabel(plateFile)}</span> : null)}

        <span>{stage ?? scene.stage}</span>
      </div>
    </div>
  );
}
