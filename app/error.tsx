"use client";

import { useEffect } from "react";
import Link from "next/link";
import { site } from "@/lib/site";
import { fill } from "@/lib/content";
import content from "@/content/pages/error.json";

/**
 * THE ERROR PAGE
 *
 * What a visitor sees when something on our side throws. It replaces only the
 * page body: the nav and the footer come from the layout, so nothing here
 * re-mounts either.
 *
 * IT USES NO ANIMATION LIBRARY, ON PURPOSE, and that is not an oversight. An
 * error boundary that reaches back into the animation layer can re-throw the
 * very error it was built to catch, and the visitor lands on the framework's
 * own unbranded grey page instead of this one. The small entrance below is
 * plain CSS for the same reason, and it is switched off for anybody who has
 * asked their computer to reduce motion.
 *
 * EVERY WORD COMES FROM content/pages/error.json, and that is safe here where
 * it would not be in global-error.tsx. This boundary renders inside a living
 * layout, its imports are static and bundled at build time, nothing fetches,
 * and fill() is written to swallow empty fields rather than throw. The visitor
 * reads this page at the worst possible moment, which is exactly when the
 * client should get to choose the words. global-error.tsx stays hardcoded as
 * the one sanctioned exception, because it renders when the layout itself has
 * died and must depend on nothing at all.
 *
 * ON THE SHAPE. Deliberately the plainest page on the site. A 404 can afford
 * to be helpful and offer somewhere else to go, because the visitor typed
 * something wrong. This is the other case: they did nothing wrong, we broke,
 * and the only useful things are to say so, offer the one action that might
 * work, and print the reference they can read back to us. Anything more
 * decorative here would be the site preening while it is failing.
 */
const t = content.copy;
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Puts the real stack in the browser console and the server log. In
    // production React hides the message from the page, so `digest` is the
    // only thing a visitor can actually read back to us.
    console.error("[kul] route error boundary:", error);
  }, [error]);

  return (
    <>
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          @keyframes kul-err-rise {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: none; }
          }
          .kul-err-rise { animation: kul-err-rise 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }
        }
      `}</style>

      <section className="flex min-h-svh items-center bg-k-coal px-6 md:px-12 lg:px-24">
        <div className="kul-err-rise mx-auto w-full max-w-[1248px] py-32">
          <p className="flex items-center gap-4 pb-10">
            <span className="h-px w-12 shrink-0 bg-k-gold-lit" aria-hidden="true" />
            <span className="font-text text-k-label uppercase text-k-gold-lit">
              {fill(t.eyebrow)}
            </span>
          </p>

          <h1 className="max-w-[16ch] font-display text-k-d1 font-black text-k-on-dark">
            {fill(t.heading)}
          </h1>

          <p className="max-w-[54ch] pt-8 font-text text-k-lede text-k-on-dark-soft">
            {fill(t.body)}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-10">
            <button
              type="button"
              onClick={reset}
              className="rounded-full bg-k-on-dark px-8 py-4 font-text text-k-label uppercase text-k-ink transition-opacity duration-200 hover:opacity-85"
            >
              {fill(t.retryLabel)}
            </button>
            <a
              href={site.phoneHref}
              className="rounded-full border border-k-on-dark-faint px-8 py-4 font-text text-k-label uppercase tabular-nums text-k-on-dark transition-colors duration-200 hover:border-k-on-dark"
            >
              {fill(t.callLabel)}
            </a>
            <Link
              href="/"
              className="font-text text-k-small text-k-on-dark-soft underline underline-offset-4 transition-colors duration-200 hover:text-k-on-dark"
            >
              {fill(t.homeLabel)}
            </Link>
          </div>

          {/* The only thing a visitor can quote back to us, so it is printed
              rather than only logged. */}
          {error.digest ? (
            <p className="pt-12 font-text text-k-micro uppercase tabular-nums text-k-on-dark-soft">
              {fill(t.referencePrefix)} {error.digest}
            </p>
          ) : null}
        </div>
      </section>
    </>
  );
}
