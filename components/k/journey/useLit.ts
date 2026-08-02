"use client";

import { useEffect, useRef } from "react";

/**
 * ONE-WAY LIGHTING FOR THE FLOW SCENES.
 *
 * Several scenes in ordinary flow (3, 4, 8) read as a column of Mark's
 * sentences in which the line you have reached is at full ink and the lines
 * you have not are quieter. This is the one piece of machinery they share.
 *
 * THE CONTRACT IS THE SAME AS useStageProgress AND IT IS NOT OPTIONAL:
 *
 *   1. The stylesheet default for every line is FULL ink. The quiet state only
 *      exists under `.is-armed`, which this hook adds after it is certain it
 *      is running. No script, failed script, old browser: every word is
 *      simply already lit. See components/k/Reveal.tsx for the page that
 *      taught this project the rule.
 *
 *   2. Lighting is ONE-WAY and additive. A line that has been read does not
 *      dim again when you scroll back, the same way a worked summer does not
 *      un-happen. The observer unobserves each line the moment it lights.
 *
 *   3. Anyone who asked for reduced motion is never armed. They get the
 *      finished state, standing still, which is a complete reading.
 *
 * The quiet state itself lives in globals.css as one rule:
 *
 *   .is-armed [data-lit]:not(.is-lit) { opacity: var(--lit-floor, 0.55) }
 *
 * and every floor used on this page clears AA on its own ground. The floors
 * are per-scene because the grounds are: 0.55 is safe on the dark scenes and
 * the light scenes do not use opacity states at all, by the house rule scene
 * 11 set.
 */
export function useLit<T extends HTMLElement>(options?: {
  /**
   * Where the trigger band sits. The default fires a little above centre,
   * where an eye actually holds a page. Scene 17's index rows override it to
   * fire near the bottom edge, so the table is written up from the bottom
   * like a page proof.
   */
  rootMargin?: string;
  /** Called whenever an element lights, with how many have lit so far. */
  onLit?: (litCount: number, el: Element) => void;
}) {
  const rootRef = useRef<T | null>(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Only now may anything be quiet.
    root.classList.add("is-armed");
    // Scenes may nest a second lit scope with its own trigger band (scene 17
    // does, for its index rows). Each scope claims only its own elements, so
    // nothing is ever observed twice at two different bands.
    root.setAttribute("data-lit-scope", "");

    let lit = 0;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-lit");
            io.unobserve(entry.target);
            lit += 1;
            optionsRef.current?.onLit?.(lit, entry.target);
          }
        }
      },
      { rootMargin: optionsRef.current?.rootMargin ?? "0px 0px -34% 0px", threshold: 0 },
    );

    root.querySelectorAll("[data-lit]").forEach((el) => {
      if (el.closest("[data-lit-scope]") === root) io.observe(el);
    });

    return () => {
      io.disconnect();
      root.classList.remove("is-armed");
    };
  }, []);

  return rootRef;
}
