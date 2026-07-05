"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  m,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { site } from "@/lib/site";

/**
 * §3.3 — mobile conversion bar. Mounts (spring, y 100% → 0) after 400px of
 * scroll; unmounts while the `[data-content-end]` sentinel or any <form> is
 * in view (IO) — NEVER observes the sticky footer itself (its rect
 * intersects the viewport for essentially the whole scroll). The gold pill
 * is the bar's only gold and substitutes for the nav CTA below md.
 */

type StickyMobileBarProps = { variant?: "default" | "drivers" | "hidden" };

function PhoneIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

const ghostZone =
  "inline-flex h-11 w-full items-center justify-center rounded-full border border-paper/30 font-mont text-label font-semibold uppercase text-paper";

export default function StickyMobileBar({
  variant = "default",
}: StickyMobileBarProps) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [past, setPast] = useState(false);
  const [suppressed, setSuppressed] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => setPast(y > 400));

  // Re-sync after route changes (scroll resets without a change event).
  useEffect(() => {
    setPast(window.scrollY > 400);
  }, [pathname]);

  // Suppress while the content-end sentinel or any form is on screen.
  useEffect(() => {
    setSuppressed(false);
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-content-end], form"),
    );
    if (!targets.length) return;
    const visible = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      }
      setSuppressed(visible.size > 0);
    });
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [pathname]);

  if (variant === "hidden") return null;

  const show = past && !suppressed;

  return (
    <AnimatePresence>
      {show && (
        <m.div
          className="fixed inset-x-0 bottom-0 z-[80] border-t border-white/[0.12] bg-ink/90 pb-[env(safe-area-inset-bottom)] text-paper backdrop-blur-md md:hidden"
          initial={reduced ? { opacity: 0 } : { y: "100%" }}
          animate={reduced ? { opacity: 1 } : { y: "0%" }}
          exit={reduced ? { opacity: 0 } : { y: "100%" }}
          transition={
            reduced
              ? { duration: 0.3 }
              : { type: "spring", stiffness: 260, damping: 30 }
          }
        >
          {variant === "drivers" ? (
            <div className="grid h-16 grid-cols-3 items-center gap-2 px-3">
              <a href={site.phoneHref} className={ghostZone}>
                Call
              </a>
              <a href="sms:6789721148" className={ghostZone}>
                Text
              </a>
              <a href="#apply" className="btn-gold w-full justify-center uppercase">
                Apply
              </a>
            </div>
          ) : (
            <div className="flex h-16 items-center gap-3 px-4">
              <a
                href={site.phoneHref}
                aria-label={`Call dispatch, ${site.phone}`}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-paper/30 text-paper"
              >
                <PhoneIcon />
              </a>
              <Link
                href="/v2/quote"
                className="btn-gold flex-1 justify-center uppercase"
              >
                Get a Quote
              </Link>
            </div>
          )}
        </m.div>
      )}
    </AnimatePresence>
  );
}
