"use client";

/**
 * Rise / RiseGroup — §3.9. The workhorse reveal for body blocks, ledger
 * rows, fact rows, and card grids. opacity 0 / y:32 → rest, 0.7s EASE.out,
 * fires once (VIEWPORT). Inside a RiseGroup, children inherit the parent's
 * orchestration (staggerChildren = STAGGER.items, dropping to 0.05 beyond
 * 5 children). Reduced motion: 0.3s opacity fade, no transform.
 */

import { Children, createContext, useContext } from "react";
import type { ReactNode, ElementType, JSX } from "react";
import { m, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import { EASE, STAGGER, VIEWPORT } from "@/components/v2/motion";

export type RiseProps = {
  children: ReactNode;
  delay?: number;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  /** Animate on mount instead of whileInView — above-the-fold hero content
      only (whileInView is unreliable for elements already in view at load). */
  immediate?: boolean;
};

export type RiseGroupProps = {
  children: ReactNode;
  stagger?: number;
  className?: string;
};

const RiseGroupContext = createContext(false);

function riseVariants(reduced: boolean, delay = 0): Variants {
  return reduced
    ? {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.3, delay } },
      }
    : {
        hidden: { opacity: 0, y: 32 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.7, ease: [...EASE.out], delay },
        },
      };
}

export function Rise({
  children,
  delay = 0,
  as = "div",
  className,
  immediate = false,
}: RiseProps) {
  const reduced = useReducedMotion();
  const inGroup = useContext(RiseGroupContext);
  const MTag = (m as unknown as Record<string, ElementType>)[as as string] ?? m.div;
  const variants = riseVariants(!!reduced, inGroup ? 0 : delay);

  if (inGroup) {
    // Parent RiseGroup orchestrates initial/whileInView + stagger.
    return (
      <MTag variants={variants} className={className}>
        {children}
      </MTag>
    );
  }

  if (immediate) {
    return (
      <MTag
        variants={variants}
        initial="hidden"
        animate="show"
        className={className}
      >
        {children}
      </MTag>
    );
  }

  return (
    <MTag
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      className={className}
    >
      {children}
    </MTag>
  );
}

export function RiseGroup({ children, stagger, className }: RiseGroupProps) {
  const reduced = useReducedMotion();
  const count = Children.count(children);
  const base = stagger ?? STAGGER.items;
  // §3.9: groups cap stagger at 5 children — beyond 5 it drops to 0.05.
  const each = count > 5 ? Math.min(base, 0.05) : base;

  const groupVariants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduced ? 0 : each } },
  };

  return (
    <RiseGroupContext.Provider value={true}>
      <m.div
        variants={groupVariants}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
        className={className}
      >
        {children}
      </m.div>
    </RiseGroupContext.Provider>
  );
}

export default Rise;
