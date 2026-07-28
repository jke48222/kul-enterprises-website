"use client";

import { m, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * HOW THINGS ARRIVE ON SCREEN
 *
 * One shared set of entrances, so the whole site moves in the same handwriting
 * rather than every page inventing its own.
 *
 * There are four, and they are deliberately different from each other. A page
 * where every single thing fades upward by the same amount reads as flat as a
 * page where every section is the same three columns, which is the reason this
 * file exists at all.
 *
 *   rise     The default. Comes up a little as it fades in. For paragraphs,
 *            cards, pictures, and anything in a group.
 *   wipe     For big headlines only. The words are uncovered from the left
 *            instead of fading, which suits type this heavy and gives the top
 *            of a section a single strong move.
 *   settle   Almost nothing: a very small lift, no travel. For dense rows of
 *            small print where a big movement would look silly.
 *   rule     For the hairlines. The line draws itself across from the left.
 *
 * Everything here plays ONCE when it comes into view and is never tied to the
 * scroll wheel, so nothing jitters when somebody scrolls back up.
 *
 * ANYONE WHO HAS ASKED THEIR COMPUTER TO REDUCE MOTION sees none of it. Every
 * component below checks that first and simply renders the finished state.
 */

/** The house curve. Fast to start, long slow finish. */
const EASE = [0.16, 1, 0.3, 1] as const;

/** How long each entrance runs, in seconds. */
const DURATION = {
  rise: 0.8,
  wipe: 1.05,
  settle: 0.55,
  rule: 0.9,
} as const;

export type RevealVariant = "rise" | "wipe" | "settle";

type RevealProps = {
  children: ReactNode;
  /** Which entrance to use. Defaults to rise. */
  variant?: RevealVariant;
  /** Position within a group. Each step adds 60ms, so a row arrives in order. */
  index?: number;
  className?: string;
};

/** Where each variant starts from, and what it settles to. */
const STATES: Record<
  RevealVariant,
  { from: Record<string, string | number>; to: Record<string, string | number> }
> = {
  rise: { from: { opacity: 0, y: 24 }, to: { opacity: 1, y: 0 } },
  settle: { from: { opacity: 0, y: 8 }, to: { opacity: 1, y: 0 } },
  // The words are uncovered rather than faded. Opacity stays at 1 the whole
  // time, so the type never looks washed out half way through.
  wipe: {
    from: { clipPath: "inset(0 100% 0 0)", opacity: 1 },
    to: { clipPath: "inset(0 0% 0 0)", opacity: 1 },
  },
};

export default function Reveal({
  children,
  variant = "rise",
  index = 0,
  className,
}: RevealProps) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;

  const state = STATES[variant];

  return (
    <m.div
      className={className}
      initial={state.from}
      whileInView={state.to}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: DURATION[variant],
        delay: index * 0.06,
        ease: [...EASE],
      }}
    >
      {children}
    </m.div>
  );
}

/**
 * A hairline that draws itself across from the left.
 *
 * Use it in place of a border on the rules that head a section. It scales
 * rather than growing, because animating the width of anything inside a
 * scrolling page makes the browser re-lay out the whole thing on every frame.
 */
export function RuleDraw({
  className,
  index = 0,
  tone = "light",
}: {
  className?: string;
  index?: number;
  /** Which ground the line sits on, so it picks the right grey. */
  tone?: "light" | "dark";
}) {
  const reduced = useReducedMotion();
  const colour = tone === "dark" ? "bg-k-rule-dark" : "bg-k-rule-strong";

  if (reduced) {
    return <span className={`block h-px w-full ${colour} ${className ?? ""}`} />;
  }

  return (
    <m.span
      aria-hidden="true"
      className={`block h-px w-full origin-left ${colour} ${className ?? ""}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: DURATION.rule, delay: index * 0.06, ease: [...EASE] }}
    />
  );
}
