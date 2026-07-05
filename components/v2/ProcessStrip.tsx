"use client";

/**
 * ProcessStrip — §3.24. Horizontal 3-step strip (vertical rail stacked
 * below md): the connecting 1px rule draws scaleX 0→1 origin-left over
 * 0.8s EASE.out on enter (once), then the steps Rise-stagger after it.
 * No gold. THE single shared component for this pattern — safety §4.5.4
 * and drivers §4.6.4 both use it; never hand-roll divergent versions.
 */

import { m, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import { EASE, STAGGER, VIEWPORT } from "@/components/v2/motion";

export type ProcessStripProps = {
  steps: { label: string; line: string }[]; // exactly 3
  ground?: "ink" | "paper";
};

function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

export function ProcessStrip({ steps, ground = "paper" }: ProcessStripProps) {
  const reduced = useReducedMotion();
  const ink = ground === "ink";
  const ruleColor = ink ? "bg-white/[0.12]" : "bg-ink/[0.15]";

  const fade: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.3 } },
  };
  const drawX: Variants = reduced
    ? fade
    : {
        hidden: { scaleX: 0 },
        show: {
          scaleX: 1,
          transition: { duration: 0.8, ease: [...EASE.out] },
        },
      };
  const drawY: Variants = reduced
    ? fade
    : {
        hidden: { scaleY: 0 },
        show: {
          scaleY: 1,
          transition: { duration: 0.8, ease: [...EASE.out] },
        },
      };
  const group: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduced ? 0 : STAGGER.items,
        delayChildren: reduced ? 0 : 0.35,
      },
    },
  };
  const item: Variants = reduced
    ? fade
    : {
        hidden: { opacity: 0, y: 32 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.7, ease: [...EASE.out] },
        },
      };

  return (
    <div className="relative">
      {/* Connecting rule: horizontal on md+, vertical rail below md. */}
      <m.div
        aria-hidden
        className={cx("hidden h-px w-full origin-left md:block", ruleColor)}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
        variants={drawX}
      />
      <m.div
        aria-hidden
        className={cx(
          "absolute bottom-0 left-0 top-0 w-px origin-top md:hidden",
          ruleColor,
        )}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
        variants={drawY}
      />
      <m.ol
        className="grid gap-10 pl-6 md:mt-10 md:grid-cols-3 md:gap-x-[clamp(16px,1.4vw,24px)] md:pl-0"
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
        variants={group}
      >
        {steps.map((step) => (
          <m.li key={step.label} variants={item}>
            <p
              className={cx(
                "text-label uppercase",
                ink ? "text-paper" : "text-ink",
              )}
            >
              {step.label}
            </p>
            <p
              className={cx(
                "mt-3 max-w-[36ch] text-[15px] leading-relaxed",
                ink ? "text-paper/70" : "text-graywarm-deep",
              )}
            >
              {step.line}
            </p>
          </m.li>
        ))}
      </m.ol>
    </div>
  );
}

export default ProcessStrip;
