"use client";

import { m } from "framer-motion";

/**
 * THE MENU MARK
 *
 * Two rules that fold into a cross and unfold back into a menu, on one
 * uninterrupted movement. It is the only control that opens or closes the menu
 * on a narrow screen, so it is drawn once and told which state it is in rather
 * than being swapped for a second icon at the moment the panel appears.
 *
 * WHY TWO RULES AND NOT THREE. Three equal rules is the drawing everybody uses
 * and the one that carries no decision. Two, set wide apart and cut fine, reads
 * as deliberate rather than as a default, and it is the only version that folds
 * into a cross without a spare line to hide: with three, the middle one has to
 * be faded out, and a line vanishing mid-movement is the thing that makes most
 * of these look cheap. Here every stroke that starts the movement finishes it.
 *
 * THE FOLD IS ONE GESTURE, NOT TWO. The rules travel to the middle and turn at
 * the same time rather than meeting first and then rotating. Sequencing it
 * reads as two steps waiting on each other; doing both at once reads as a
 * single fold, which is what it is meant to be. The whole thing takes a third
 * of a second, which is quick enough to feel like a response to the tap rather
 * than an animation being played at you.
 *
 * THE ROUNDED CAPS ARE LOAD BEARING. Square ends leave four visible corners
 * where the two rules cross, and the cross stops reading as one continuous
 * mark. Rounded ends let them pass through each other.
 *
 * ANYONE WHO HAS ASKED FOR REDUCED MOTION gets the same two states with no
 * travel between them: `y` and `rotate` are transforms, and the MotionConfig in
 * app/layout.tsx drops transform animation to nothing for those readers.
 *
 * IT IS DECORATION AND CARRIES NO LABEL. The button around it owns the
 * accessible name and the expanded state; see components/k/Nav.tsx.
 */

/** How far each rule sits from the centre when the mark is closed, in pixels. */
const SPREAD = 5;

const FOLD = { duration: 0.34, ease: [0.16, 1, 0.3, 1] as const };

/**
 * Both rules are pinned to the same line through the middle of the box and
 * pushed apart by transform alone, so nothing here is laid out twice and the
 * turn happens about the mark's own centre rather than about a moving edge.
 */
const RULE =
  "absolute left-0 top-[calc(50%-0.75px)] block h-[1.5px] w-full origin-center rounded-full bg-current";

export default function MenuMark({ open }: { open: boolean }) {
  return (
    <span aria-hidden="true" className="relative block h-3.5 w-[22px]">
      <m.span
        className={RULE}
        initial={false}
        animate={{ y: open ? 0 : -SPREAD, rotate: open ? 45 : 0 }}
        transition={FOLD}
      />
      <m.span
        className={RULE}
        initial={false}
        animate={{ y: open ? 0 : SPREAD, rotate: open ? -45 : 0 }}
        transition={FOLD}
      />
    </span>
  );
}
