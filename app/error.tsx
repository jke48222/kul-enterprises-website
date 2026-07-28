"use client";

import { useEffect } from "react";
import Link from "next/link";
import GhostNumeral from "@/components/v2/GhostNumeral";

/**
 * Route error boundary, the branded counterpart to the 404 (design bible
 * §4.11). Catches render/data exceptions thrown anywhere under `main` and
 * replaces ONLY the page body: the root layout still supplies the chrome
 * (MotionProvider, Grain, Nav, RouteVeil + main#main + the [data-content-end]
 * sentinel, StickyMobileBar, curtain Footer), so this file must never
 * re-mount any of it.
 *
 * Deliberately motion-free. Everything here is CSS-only: no framer-motion,
 * no `m`, no MotionProvider dependency. An error boundary that re-enters the
 * animation layer can re-throw the very error it is catching and flip the
 * page to Next's unbranded fallback, so the boundary is kept inert on
 * purpose. The markup below is pixel-identical to Eyebrow/LineReveal at REST
 * (their post-animation state), so it reads as the same design system.
 *
 * Single ink viewport. Gold ledger: the nav CTA is gold #1; TRY AGAIN is the
 * page's one additional gold element (§2.7).
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surfaces the stack in the browser console / server logs. `digest` is
    // the only identifier a visitor can read back to us in production, where
    // React redacts the real message.
    console.error("[kul] route error boundary:", error);
  }, [error]);

  return (
    <>
      {/* CSS-only entrance, mirroring the 404's bird float: wrapped in
          no-preference so reduced motion gets the static rest state (§2.3). */}
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          @keyframes err-rise {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: none; }
          }
          .err-rise { animation: err-rise 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }
        }
      `}</style>
      <section
        data-ground="ink"
        className="relative flex min-h-svh items-center overflow-hidden bg-ink"
      >
        <GhostNumeral className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 !text-[clamp(12rem,30vw,26rem)]">
          500
        </GhostNumeral>
        <div className="err-rise relative z-[1] mx-auto w-full max-w-[1760px] px-[clamp(20px,5vw,90px)] pb-band-sm pt-32">
          {/* Eyebrow at rest: attached hairline + tracked label (§3.4). */}
          <p className="flex items-center gap-4 text-label uppercase text-paper/60">
            <span aria-hidden className="h-px w-16 shrink-0 bg-current" />
            <span>Load rejected</span>
          </p>
          {/* LineReveal at rest: hand-authored lines, one block each (§3.6). */}
          <h1 className="mt-6 max-w-[16ch] font-omnibus text-display-l text-cream">
            <span className="block">Something</span>
            <span className="block">threw a rod.</span>
          </h1>
          <p className="mt-6 max-w-[52ch] text-body-l text-paper/70">
            This page hit an error on our end &mdash; nothing you did. Try it
            again, and if it sticks, call dispatch and we&apos;ll sort it out.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <button type="button" onClick={reset} className="btn-gold">
              Try again
            </button>
            <Link href="/" className="btn-ghost-dark">
              Back home
            </Link>
          </div>
          {error.digest && (
            <p className="mt-10 text-micro uppercase text-paper/40">
              Reference {error.digest}
            </p>
          )}
        </div>
      </section>
    </>
  );
}
