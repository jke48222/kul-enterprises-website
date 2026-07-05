"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { m, useReducedMotion } from "framer-motion";
import { EASE } from "@/components/v2/motion";

/**
 * §3.22 — the 0.45s ink page-transition veil.
 *
 * Implementation is CLICK INTERCEPTION (an enter-only veil keyed on pathname
 * cannot work — it fires after the new route has already rendered): a
 * capture-phase click listener on the layout wrapper intercepts same-origin,
 * same-tab anchor clicks, prevents default (Next's <Link> respects
 * `defaultPrevented`), wipes the veil IN over the CURRENT page, calls
 * `router.push` at full cover, and wipes OUT once `usePathname()` reports
 * the new route. Mandatory 1.5s safety valve; popstate gets NO veil;
 * reduced motion skips interception entirely.
 */

type VeilPhase = "idle" | "cover" | "reveal";

type VeilState = { navigating: boolean; heroDelay: number };

const VeilContext = createContext<VeilState>({ navigating: false, heroDelay: 0 });

/** Heroes read `heroDelay` instead of hardcoding entrance delays (§3.22). */
export function useVeilState(): VeilState {
  return useContext(VeilContext);
}

type RouteVeilProps = { children: React.ReactNode };

export default function RouteVeil({ children }: RouteVeilProps) {
  const router = useRouter();
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<VeilPhase>("idle");

  const pendingHref = useRef<string | null>(null);
  const prevPath = useRef(pathname);
  const safety = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearSafety = () => {
    if (safety.current) {
      clearTimeout(safety.current);
      safety.current = null;
    }
  };

  // New route committed while covered → wipe out.
  useEffect(() => {
    if (pathname === prevPath.current) return;
    prevPath.current = pathname;
    if (phase === "cover") {
      clearSafety();
      setPhase("reveal");
    }
  }, [pathname, phase]);

  // Back/forward gets NO veil — instant swap, never covered.
  useEffect(() => {
    const onPop = () => {
      clearSafety();
      pendingHref.current = null;
      setPhase("idle");
    };
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("popstate", onPop);
      clearSafety();
    };
  }, []);

  const onClickCapture = useCallback(
    (e: React.MouseEvent) => {
      if (reduced) return; // plain navigation, no veil
      if (e.defaultPrevented) return;
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return;
      if (!(e.target instanceof Element)) return;
      const anchor = e.target.closest("a");
      if (!anchor || !(anchor instanceof HTMLAnchorElement)) return;
      if (!anchor.getAttribute("href")) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      // Same pathname (hash-only jumps, no-ops): default behavior, no veil.
      if (
        url.pathname === window.location.pathname &&
        url.search === window.location.search
      )
        return;

      e.preventDefault(); // Next <Link> checks defaultPrevented and stands down
      pendingHref.current = url.pathname + url.search + url.hash;
      clearSafety();
      setPhase("cover");
    },
    [reduced],
  );

  // At full cover: push, reset scroll, arm the safety valve.
  const handleVeilComplete = useCallback(() => {
    if (phase === "cover" && pendingHref.current) {
      const href = pendingHref.current;
      router.push(href);
      if (!href.includes("#")) window.scrollTo(0, 0);
      // Never trap the user behind ink: force the veil out after 1.5s.
      clearSafety();
      safety.current = setTimeout(() => setPhase("reveal"), 1500);
    } else if (phase === "reveal") {
      pendingHref.current = null;
      setPhase("idle");
    }
  }, [phase, router]);

  const covering = phase === "cover";

  const value = useMemo<VeilState>(
    () => ({
      navigating: phase !== "idle",
      // 0.35 while a veil-out is in flight; 0 on first load / popstate /
      // reduced motion — heroes start ~0.1s before the veil fully clears.
      heroDelay: !reduced && phase !== "idle" ? 0.35 : 0,
    }),
    [phase, reduced],
  );

  return (
    <VeilContext.Provider value={value}>
      <div onClickCapture={onClickCapture}>{children}</div>

      {!reduced && (
        <>
          {/* The ink wipe. pointer-events-none: it is purely visual, and the
              safety valve (not a click shield) handles the stuck case. */}
          <m.div
            aria-hidden
            className="pointer-events-none fixed inset-0 z-[100] bg-ink"
            style={{ transformOrigin: covering ? "bottom" : "top" }}
            initial={false}
            animate={{ scaleY: covering ? 1 : 0 }}
            transition={{
              duration: covering ? 0.45 : 0.6,
              ease: EASE.inout,
            }}
            onAnimationComplete={handleVeilComplete}
          />
          {/* Bird mark on its own layer so the wipe's scaleY never distorts it */}
          <m.div
            aria-hidden
            className="pointer-events-none fixed inset-0 z-[101] flex items-center justify-center"
            initial={false}
            animate={{ opacity: covering ? 1 : 0 }}
            transition={{ duration: 0.15 }}
          >
            <Image
              src="/images/brand/doctor-bird-flight.png"
              alt=""
              width={148}
              height={109}
              className="h-8 w-auto"
            />
          </m.div>
        </>
      )}
    </VeilContext.Provider>
  );
}
