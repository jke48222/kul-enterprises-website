"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";

/**
 * THE LION, BETWEEN PAGES
 *
 * Follow a link and a black panel rises from the bottom of the screen, carries
 * the lion across it, and keeps going up and off the top to uncover the new
 * page. It happens on every page and in both directions, which is what makes it
 * read as a cut in a film rather than as a loading screen.
 *
 * IT SLIDES RATHER THAN FADES, WHICH IS WHAT THE OLD ONE DID. A crossfade to
 * black is the same picture at two opacities, so there is nothing to watch and
 * the pause in the middle reads as the page having stalled. One continuous
 * upward pass has a direction, so the wait reads as travel. It is also why the
 * panel leaves upward rather than dropping back the way it came: coming and
 * going by the same edge undoes itself, and the reader ends up back where they
 * were looking.
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

/**
 * How long the panel takes to arrive, and to leave, in seconds.
 *
 * Leaving is the longer of the two on purpose. A panel that arrives fast reads
 * as decisive; one that leaves fast reads as the new page being flung at you.
 */
const IN = 0.42;
const OUT = 0.5;

/**
 * When the panel is covering the screen, measured from the click.
 *
 * The arrival plus a frame, so the push below cannot land while there is still
 * a strip of the old page showing under the panel's bottom edge.
 */
const COVER_MS = IN * 1000 + 40;

/**
 * The shortest time the panel is held, measured from the click.
 *
 * IT HAS TO CLEAR THE ARRIVAL, which is the part a fade did not care about. On
 * a warm cache a route can commit in 30ms; if the release fired then, the panel
 * would turn round and leave while it was still on its way in, and the reader
 * would see it dip at the bottom of the screen and go. So this is the arrival
 * plus a beat to read the mark, not a bare dwell.
 */
const HOLD_MS = COVER_MS + 260;

/**
 * If the route has not changed by now, lift the cover anyway.
 *
 * It has to leave room for the push, which no longer happens on the click but
 * COVER_MS after it, or the valve would fire on a slow route before the
 * navigation it is guarding had even been asked for.
 */
const SAFETY_MS = COVER_MS + 1500;

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
  // The deferred navigation. It gets its own handle rather than sharing the
  // release one: the two are live at different moments but both have to be
  // cancellable by the back button, and one ref cannot hold two timers.
  const push = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (safety.current) clearTimeout(safety.current);
    if (release.current) clearTimeout(release.current);
    if (push.current) clearTimeout(push.current);
    safety.current = null;
    release.current = null;
    push.current = null;
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
      setCovered(true);

      // ==================================================================
      // THE PUSH WAITS FOR THE PANEL TO ARRIVE. IT IS A TIMER, NOT A FRAME.
      // ==================================================================
      //
      // Pushing in the same tick as the cover is what the first version did,
      // and with a fade it was invisible. With a slide it is not: the panel
      // takes IN seconds to climb the screen, the route commits in about a
      // tenth of that, and for the rest of the climb the destination page is
      // rendering in the gap underneath the panel. You see the page you are
      // leaving turn into the page you are going to, and then get covered up,
      // which is the opposite of the point.
      //
      // So the push is held until the panel is actually covering the screen.
      // COVER_MS is the arrival plus a frame of margin.
      //
      // IT IS A setTimeout AND NOT requestAnimationFrame, and that distinction
      // is load bearing rather than stylistic. An earlier attempt used rAF and
      // broke: a browser stops issuing frames to a tab nobody is looking at, so
      // a reader who clicked a link and immediately switched tab came back to a
      // page that had never gone anywhere. Timers keep firing in a background
      // tab. They are clamped to about a second there rather than running at
      // IN, which only means the panel sits still a moment longer on a screen
      // no one is watching.
      const at = pending.current;
      if (push.current) clearTimeout(push.current);
      push.current = setTimeout(() => {
        // A second link clicked before this fired has already replaced
        // `pending`, and that one owns the navigation.
        if (pending.current === at) router.push(at);
      }, COVER_MS);

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
          // THE WHOLE PANEL TRAVELS UP, AND IT NEVER STOPS TO GO BACK. It
          // starts a full screen below the fold, settles over the page, and
          // then carries on off the top. The percentages are of the element,
          // which is inset-0, so one of them is exactly one screen.
          initial={{ y: "100%" }}
          animate={{ y: "0%" }}
          exit={{ y: "-100%" }}
          transition={{
            duration: IN,
            ease: [...EASE],
            exit: { duration: OUT, ease: [...EASE] },
          }}
        >
          {/* The mark rides the panel rather than sitting still behind it, so
              there is one moving object on screen instead of two disagreeing
              about where the middle is. It fades in fractionally behind the
              panel's own arrival so it is never caught half off the bottom of
              the screen, and it is gone before the panel clears the top. */}
          <m.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{
              duration: 0.34,
              ease: [...EASE],
              delay: IN * 0.55,
              exit: { duration: 0.2, ease: [...EASE], delay: 0 },
            }}
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
