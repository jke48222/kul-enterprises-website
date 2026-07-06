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
import { EASE } from "@/components/v3/motion";

/**
 * v3 port of the 0.45s ink page-transition veil (v2 §3.22) — the Doctor
 * Bird's standing home in the chrome (brand hierarchy: lion = mark,
 * bird = signature/motion).
 *
 * CLICK INTERCEPTION mechanics preserved exactly: capture-phase listener
 * intercepts same-origin same-tab anchor clicks, wipes IN over the current
 * page, router.push at full cover, wipes OUT when usePathname reports the
 * new route. 1.5s safety valve; popstate gets no veil; reduced motion
 * skips interception entirely.
 */

type VeilPhase = "idle" | "cover" | "reveal";

type VeilState = { navigating: boolean; heroDelay: number };

const VeilContext = createContext<VeilState>({
  navigating: false,
  heroDelay: 0,
});

/** Heroes read `heroDelay` instead of hardcoding entrance delays. */
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
      if (reduced) return;
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
      if (
        url.pathname === window.location.pathname &&
        url.search === window.location.search
      )
        return;

      e.preventDefault();
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
      heroDelay: !reduced && phase !== "idle" ? 0.35 : 0,
    }),
    [phase, reduced],
  );

  return (
    <VeilContext.Provider value={value}>
      <div onClickCapture={onClickCapture}>{children}</div>

      {!reduced && (
        <>
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
