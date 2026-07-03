"use client";

import { useEffect, useRef, useState } from "react";

type ModelViewerEl = HTMLElement & {
  dismissPoster?: () => void;
  loaded?: boolean;
};

/**
 * The Doctor Bird as a slowly rotating 3D model (client-supplied GLB,
 * Draco-compressed 49MB to 2MB). Rendered with model-viewer, loaded on the
 * client after mount. Its built-in viewport detection misfires inside
 * animated wrappers, so we force the load with dismissPoster() once mounted.
 * Auto-rotate is disabled for prefers-reduced-motion users.
 */
export default function BirdModel({ className = "" }: { className?: string }) {
  const [ready, setReady] = useState(false);
  const reduceRef = useRef(false);
  const elRef = useRef<ModelViewerEl | null>(null);
  const holderRef = useRef<HTMLDivElement | null>(null);

  // The viewer chunk (three.js inside, ~1MB) and the 2MB GLB stay off the
  // initial load: import only once the section is within ~600px of view.
  useEffect(() => {
    reduceRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const load = () =>
      import("@google/model-viewer")
        .then(() => setReady(true))
        // Chunk failed to load (flaky network): the bird is decorative, so
        // leave the empty placeholder rather than surface an error.
        .catch(() => {});
    const holder = holderRef.current;
    if (!holder || !("IntersectionObserver" in window)) {
      load();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          load();
        }
      },
      { rootMargin: "600px 0px" }
    );
    io.observe(holder);
    return () => io.disconnect();
  }, []);

  // Force the model to load: retry until the element reports loaded.
  useEffect(() => {
    if (!ready) return;
    const timers = [0, 400, 1200, 2500].map((delay) =>
      setTimeout(() => {
        const el = elRef.current;
        if (el && !el.loaded) el.dismissPoster?.();
      }, delay)
    );
    return () => timers.forEach(clearTimeout);
  }, [ready]);

  if (!ready) return <div ref={holderRef} aria-hidden className={className} />;

  return (
    // @ts-expect-error model-viewer is a custom element
    <model-viewer
      ref={(el: ModelViewerEl | null) => {
        elRef.current = el;
      }}
      src="/models/doctor-bird.glb"
      alt="The KUL Doctor Bird"
      auto-rotate={reduceRef.current ? undefined : true}
      rotation-per-second="7deg"
      auto-rotate-delay="0"
      interaction-prompt="none"
      disable-zoom
      disable-tap
      shadow-intensity="0.4"
      exposure="1.15"
      class={className}
      style={{ backgroundColor: "transparent", pointerEvents: "none" }}
    />
  );
}
