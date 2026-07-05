"use client";

/**
 * Eyebrow — §3.4. The Æbele attached-hairline label: short rule + tracked
 * uppercase label. Ground-aware via the nearest `[data-ground]` ancestor.
 * `gold` variant = label + hairline together count as ONE gold element (§2.7).
 * Reveal: hairline scaleX 0→1 origin-left, label fades up 0.3s later.
 * Reduced motion: static, fully visible at rest.
 */

import type { ReactNode } from "react";
import { m, useReducedMotion } from "framer-motion";
import { DUR, EASE, VIEWPORT } from "@/components/v2/motion";

export type EyebrowProps = {
  children: ReactNode;
  gold?: boolean;
  as?: "span" | "p" | "h2";
  className?: string;
};

function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

export function Eyebrow({
  children,
  gold = false,
  as: Tag = "p",
  className,
}: EyebrowProps) {
  const reduced = useReducedMotion();

  const color = gold
    ? "text-gold-dim [[data-ground=ink]_&]:text-gold"
    : "text-graywarm-deep [[data-ground=ink]_&]:text-paper/60";
  const ruleColor = gold ? "bg-gold/70" : "bg-current";

  return (
    <Tag className={cx("flex items-center gap-4 text-label uppercase", color, className)}>
      {reduced ? (
        <span aria-hidden className={cx("h-px w-16 shrink-0", ruleColor)} />
      ) : (
        <m.span
          aria-hidden
          className={cx("h-px w-16 shrink-0 origin-left", ruleColor)}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: DUR.slower, ease: [...EASE.out] }}
        />
      )}
      {reduced ? (
        <span>{children}</span>
      ) : (
        <m.span
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: DUR.base, ease: [...EASE.out], delay: 0.3 }}
        >
          {children}
        </m.span>
      )}
    </Tag>
  );
}

export default Eyebrow;
