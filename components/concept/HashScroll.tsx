"use client";

import { useEffect } from "react";

/**
 * Restores deep-link scrolling on initial load. The browser's native hash
 * jump can land before images size the page (or get eaten by smooth-scroll),
 * so after mount we re-scroll to the target once layout has settled.
 */
export default function HashScroll() {
  useEffect(() => {
    const { hash } = window.location;
    if (!hash) return;
    const id = decodeURIComponent(hash.slice(1));
    // The router's own scroll handling can land after (and override) a
    // single attempt, so retry until the target actually sits in view.
    const timers: ReturnType<typeof setTimeout>[] = [];
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
    return () => timers.forEach(clearTimeout);
  }, []);
  return null;
}
