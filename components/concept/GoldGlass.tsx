"use client";

import { useEffect, useRef, useState } from "react";
import { mountMetal, NATIVE_TONES, type MetalMount } from "./liquidMetal";

/**
 * Reactive gold liquid glass. The fill is Argent's liquid-metal shader in its
 * gold tone (vendored engine, see ./liquidMetal.ts) — flowing reflection
 * bands with chromatic fringe — poured behind the copy at partial opacity
 * over a backdrop-blurred base, so it reads as molten gold under glass.
 *
 * Reactive twice over: the metal itself flows (and quickens under the
 * pointer), and a gold sheen pools where the cursor sits (CSS vars, no
 * re-renders). The shader mounts only while the panel is near the viewport
 * (WebGL context cap) and freezes for reduced-motion users. Until it mounts
 * — SSR, no WebGL2 — a static gold gradient stands in.
 */

// A lazy, heavy pour — barely moving at rest, waking gently under the pointer.
const IDLE_SPEED = 0.12;
const HOVER_SPEED = 0.4;

// Richer than the stock argent gold: more saturated highlight, deeper bronze
// shadow, so the bands pop through the glass instead of whispering.
const GOLD = { light: "#ffd76a", dark: "#5c4406" };

export default function GoldGlass({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mountRef = useRef<MetalMount | null>(null);
  const reducedRef = useRef(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "250px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    reducedRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    mountRef.current = mountMetal(canvas, {
      ...NATIVE_TONES.gold,
      ...GOLD,
      speed: reducedRef.current ? 0 : IDLE_SPEED,
      scale: 1.1,
    });
    return () => {
      mountRef.current?.destroy();
      mountRef.current = null;
    };
  }, [inView]);

  const setSpeed = (speed: number) => {
    if (reducedRef.current) return;
    mountRef.current?.update({ speed });
  };

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
      onPointerEnter={() => setSpeed(HOVER_SPEED)}
      onPointerLeave={() => setSpeed(IDLE_SPEED)}
      className={`group relative overflow-hidden rounded-2xl border border-gold/40 p-5 backdrop-blur-md [box-shadow:inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-1px_0_rgba(181,147,82,0.25),0_10px_36px_rgba(0,0,0,0.25)] sm:p-6 ${className}`}
    >
      {/* Static gold stand-in: shows during SSR and wherever WebGL2 is
          unavailable; the canvas paints over it once mounted. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(240,220,168,0.18),rgba(181,147,82,0.08)_45%,rgba(240,220,168,0.14))]"
      />
      {/* Argent's liquid gold, poured behind the glass. The canvas element
          itself unmounts when the panel leaves the viewport: a destroyed
          WebGL context sticks to its canvas, so re-entry needs a fresh one
          (same pattern as upstream's MetalFill). */}
      {inView && (
        <canvas
          ref={canvasRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 block h-full w-full opacity-65"
        />
      )}
      {/* A whisper of ink over the metal keeps the copy comfortable when a
          bright band flows beneath it. */}
      <span aria-hidden className="pointer-events-none absolute inset-0 bg-ink/10" />
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
