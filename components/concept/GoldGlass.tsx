"use client";

import { useRef } from "react";

/**
 * Reactive gold liquid glass: a translucent, backdrop-blurred panel with a
 * gold hairline edge, an inner specular highlight, and a soft gold sheen
 * that follows the pointer (CSS vars --gx/--gy, no re-renders). Used around
 * the statement-band descriptions so the copy reads over bright photography
 * without a heavy scrim. Touch devices simply get the static glass.
 */
export default function GoldGlass({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onPointerMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--gx", `${e.clientX - r.left}px`);
    el.style.setProperty("--gy", `${e.clientY - r.top}px`);
  };

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      className={`group relative overflow-hidden rounded-2xl border border-gold/35 bg-gold/10 p-5 backdrop-blur-md [box-shadow:inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-1px_0_rgba(181,147,82,0.25),0_10px_36px_rgba(0,0,0,0.25)] sm:p-6 ${className}`}
    >
      {/* Standing glass tint: a faint gold wash so the panel reads warm
          even before the pointer arrives. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(240,220,168,0.1),rgba(181,147,82,0.04)_45%,rgba(240,220,168,0.08))]"
      />
      {/* Reactive sheen: gold light pooling under the cursor. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(240px circle at var(--gx, 50%) var(--gy, 50%), rgba(240,220,168,0.3), rgba(181,147,82,0.12) 45%, transparent 72%)",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
