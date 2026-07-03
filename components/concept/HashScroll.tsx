"use client";

import { useEffect } from "react";

/** Runs once per document load: SPA remounts (e.g. back/forward returning
    to this page) must not re-fire the deep-link scroll, or it would hijack
    the browser's restored scroll position. */
let ranThisLoad = false;

/**
 * Restores deep-link scrolling on initial load. The browser's native hash
 * jump can land before images size the page (or get eaten by smooth-scroll),
 * so after mount we re-scroll to the target once layout has settled.
 */
export default function HashScroll() {
  useEffect(() => {
    const { hash } = window.location;
    if (!hash) return;
    const nav = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;
    if (ranThisLoad || nav?.type === "back_forward") return;
    ranThisLoad = true;
    const id = decodeURIComponent(hash.slice(1));
    // The router's own scroll handling can land after (and override) a
    // single attempt, so retry until the target actually sits in view.
    const timers: ReturnType<typeof setTimeout>[] = [];
    // The moment the visitor scrolls or types on their own, every pending
    // corrective jump is off: never fight the user for the scroll position.
    const events = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
    const cancel = () => {
      timers.forEach(clearTimeout);
      events.forEach((e) => window.removeEventListener(e, cancel));
    };
    events.forEach((e) =>
      window.addEventListener(e, cancel, { passive: true })
    );
    [150, 500, 1000].forEach((delay) =>
      timers.push(
        setTimeout(() => {
          const el = document.getElementById(id);
          if (!el) return;
          const top = el.getBoundingClientRect().top;
          if (top < 0 || top > 300) {
            el.scrollIntoView({ behavior: delay === 1000 ? "smooth" : "instant", block: "start" });
          }
        }, delay)
      )
    );
    return cancel;
  }, []);
  return null;
}
