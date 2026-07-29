"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";

/**
 * THE LION, BETWEEN PAGES
 *
 * Follow a link and the screen goes to black with the lion on it for about a
 * second, then opens onto the new page. It happens on every page and in both
 * directions, which is what makes it read as a cut in a film rather than as a
 * loading screen.
 *
 * THIS EXISTED BEFORE, AS A PLAIN INK WIPE, AND WAS CUT. It was removed when
 * the last of the v2 components went, on the grounds that nothing was reading
 * its state any more. The client has asked for it back with the mark on it, so
 * this is a rebuild rather than a revert: same mechanism, different content,
 * and none of the v2 context plumbing that made the old one look load bearing.
 *
 * ============================================================================
 * IT INTERCEPTS THE CLICK. IT DOES NOT WATCH THE ROUTE.
 * ============================================================================
 *
 * This is the part that is not obvious and the part an earlier attempt got
 * wrong. You cannot build this by watching `usePathname()` and covering the
 * screen when it changes: by the time the pathname changes, Next has already
 * rendered the new page, so the cover appears over the destination and the
 * reader watches the page they wanted get hidden and then revealed. The effect
 * has to start before the navigation, which means catching the click.
 *
 * So a capture-phase listener sits on the whole document, and for a plain
 * left click on an internal link it calls preventDefault, covers the screen,
 * and only then hands the href to the router. Next's Link respects
 * defaultPrevented, which is what makes this safe to do over the top of it.
 *
 * WHAT IS DELIBERATELY LET THROUGH, and each of these is a real way to break a
 * site that intercepts clicks:
 *
 *   Anything with a modifier held, or a middle click, because those open tabs
 *   and a cover would fire on a page the reader is not leaving.
 *   External links, downloads, mailto and tel, and anything with a target.
 *   Links to the page you are already on, which would cover and never uncover
 *   because the pathname never changes.
 *   In-page anchors, for the same reason.
 *   The back and forward buttons. They get no cover at all: the reader is
 *   retracing their steps and an animation there feels like the browser has
 *   stopped responding.
 *
 * THERE IS A SAFETY VALVE. If the new route has not committed within a second
 * and a half, the cover lifts anyway. Without it, any navigation that fails or
 * stalls leaves a reader looking at a black screen with no way out.
 *
 * ANYONE WHO HAS ASKED FOR REDUCED MOTION is never intercepted at all. The
 * listener returns immediately, the link behaves like an ordinary link, and no
 * cover is ever mounted.
 */

/** How long the cover takes to arrive, and to leave, in seconds. */
const IN = 0.32;
const OUT = 0.42;

/** The shortest time the mark is held, so a fast navigation still reads. */
const HOLD_MS = 340;

/** If the route has not changed by now, lift the cover anyway. */
const SAFETY_MS = 1500;

const EASE = [0.16, 1, 0.3, 1] as const;

export default function RouteTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const reduced = useReducedMotion();

  const [covered, setCovered] = useState(false);
  const pending = useRef<string | null>(null);
  const coveredAt = useRef(0);
  const previousPath = useRef(pathname);
  const safety = useRef<ReturnType<typeof setTimeout> | null>(null);
  const release = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (safety.current) clearTimeout(safety.current);
    if (release.current) clearTimeout(release.current);
    safety.current = null;
    release.current = null;
  }, []);

  // The new page has committed. Lift the cover, but not before the mark has
  // been on screen long enough to have been seen: on a warm cache a route can
  // arrive in 30ms, and a cover that flashes is worse than no cover.
  useEffect(() => {
    if (pathname === previousPath.current) return;
    previousPath.current = pathname;
    pending.current = null;
    if (!covered) return;
    if (safety.current) clearTimeout(safety.current);
    const held = Date.now() - coveredAt.current;
    release.current = setTimeout(() => setCovered(false), Math.max(0, HOLD_MS - held));
  }, [pathname, covered]);

  // Back and forward get no cover, and cancel one that is up.
  useEffect(() => {
    const onPop = () => {
      clearTimers();
      pending.current = null;
      setCovered(false);
    };
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("popstate", onPop);
      clearTimers();
    };
  }, [clearTimers]);

  useEffect(() => {
    if (reduced) return;

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented) return;
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (!(e.target instanceof Element)) return;

      const anchor = e.target.closest("a");
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      // Same-origin only. A relative href resolves against the current page,
      // which is what makes this work for both "/quote" and "quote".
      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      // Already here. Covering would never uncover, because the pathname that
      // lifts the cover would never change.
      if (url.pathname === window.location.pathname) return;

      e.preventDefault();
      pending.current = url.pathname + url.search;
      coveredAt.current = Date.now();

      // THE COVER AND THE PUSH GO IN THE SAME TICK, AND THE PUSH IS NOT
      // DEFERRED TO A FRAME. Waiting for requestAnimationFrame before pushing
      // looks tidier, and it means the black has painted before the router
      // starts work, but it makes the navigation depend on a frame being
      // rendered. A browser stops rendering frames for a tab nobody is looking
      // at, so a reader who clicks a link and immediately switches tab comes
      // back to a page that never went anywhere and a link that appears broken.
      // Measured here: the push never happened and the safety valve lifted the
      // cover a second and a half later onto the page they started on.
      //
      // React batches these two together, so the cover still renders before the
      // route resolves. Navigation is not instant even from cache.
      setCovered(true);
      router.push(pending.current);

      safety.current = setTimeout(() => {
        pending.current = null;
        setCovered(false);
      }, SAFETY_MS);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [reduced, router]);

  if (reduced) return null;

  return (
    <AnimatePresence>
      {covered ? (
        <m.div
          key="route-cover"
          // aria-hidden and pointer-events-none: it is scenery, and a reader
          // on a screen reader should never be told the page went black.
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[200] flex items-center justify-center bg-k-void"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: IN,
            ease: [...EASE],
            // Leaving is slower than arriving, so the new page is uncovered
            // rather than snapped to.
            exit: { duration: OUT, ease: [...EASE] },
          }}
        >
          <m.div
            initial={{ opacity: 0, scale: 0.86 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.06 }}
            transition={{ duration: 0.5, ease: [...EASE] }}
          >
            <Image
              src="/images/brand/lion-mark.webp"
              alt=""
              width={72}
              height={72}
              priority
            />
          </m.div>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}
