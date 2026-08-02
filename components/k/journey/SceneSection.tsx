import type { ReactNode } from "react";
import { inkFor, type Scene } from "@/lib/journey-spine";
import Furniture from "./Furniture";

/**
 * ONE SCENE OF THE JOURNEY, AND THE PIECE OF THE SUNRISE IT PAINTS.
 *
 * Every one of the seventeen scenes is wrapped in this. It does three things
 * and deliberately nothing else, so that the scenes themselves are free to look
 * completely unalike:
 *
 *   1. Paints its slice of the light arc.
 *   2. Sets the text colour that slice can carry.
 *   3. Hangs the furniture strap along the bottom.
 *
 * ============================================================================
 * HOW THE SUNRISE ACTUALLY WORKS, WHICH IS SIMPLER THAN IT LOOKS
 * ============================================================================
 * Each section paints a vertical gradient from its own colour to the NEXT
 * scene's colour. Because every scene's `to` is the following scene's `from`,
 * stacking the seventeen produces one continuous ramp from near-black at the
 * top of the page to daylight at the bottom, with no seams.
 *
 * There is no JavaScript in it at all. No scroll listener, no observer, nothing
 * to repaint on a scroll frame, and it is already correct in the first byte the
 * browser receives. It is also automatically right for anybody who asked for
 * reduced motion, because a background that does not move is not motion.
 *
 * The first version of this drove the ramp from a scroll handler that wrote a
 * custom property. It would have worked, and it would also have put the
 * readability of the entire page behind a script: without it, scenes 11 to 17
 * would have set near-black text on a near-black ground. That is the same class
 * of bug as the one described at the top of components/k/Reveal.tsx.
 *
 * ============================================================================
 * WHY PINNING IS RARE
 * ============================================================================
 * A pinned scene holds the viewport still and plays out as you keep scrolling,
 * which means it has to spend scroll distance to do it. When every scene pinned
 * itself the page ran to sixty-four screens. Four scenes pin now, and they are
 * the four that are about stillness. See the note on `vh` in lib/journey-spine.ts.
 */
export default function SceneSection({
  scene,
  children,
  /** The photograph on screen, if any. Gives the strap its plate number. */
  plateFile,
  /** Extra classes for the inner stage, not the section. */
  className,
}: {
  scene: Scene;
  children: ReactNode;
  plateFile?: string;
  className?: string;
}) {
  const ink = inkFor(scene);

  return (
    <section
      id={scene.slug}
      aria-labelledby={`${scene.slug}-heading`}
      className="relative"
      style={{
        height: `${scene.vh}svh`,
        // The slice of the sunrise this scene is responsible for.
        background: `linear-gradient(180deg, ${scene.from} 0%, ${scene.to} 100%)`,
        // Set once here so nothing inside a scene has to name a text colour.
        // The furniture strap and any hairline inherit it through currentColor.
        color: ink,
      }}
    >
      {scene.pinned ? (
        // A pinned scene is a tall section with one screen held inside it. The
        // section keeps its full height so the ramp still travels the whole
        // distance; only what is inside the stage stands still.
        //
        // `svh` rather than `vh` on purpose: on a phone the browser chrome
        // shrinks and grows as you scroll, and `vh` would make a pinned stage
        // change height under the reader mid-scene.
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          <div className={className}>{children}</div>
          <Furniture scene={scene} plateFile={plateFile} />
        </div>
      ) : (
        <>
          <div className={className}>{children}</div>
          <Furniture scene={scene} plateFile={plateFile} />
        </>
      )}
    </section>
  );
}
