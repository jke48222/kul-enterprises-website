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

  useEffect(() => {
    reduceRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    import("@google/model-viewer").then(() => setReady(true));
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

  if (!ready) return <div aria-hidden className={className} />;

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
