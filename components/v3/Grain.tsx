/**
 * Grain — v3 port of the fixed film-grain unifier (v2 §2.6/§3.23).
 * Static feTurbulence data-URI tiled at 182px, no blend mode (a blend on a
 * fixed full-viewport layer forces whole-page recompositing over video and
 * sticky scenes); warm tint baked into the SVG. Never animated.
 * z-order: 70 — above content, below nav (80), menu (90), veil (100).
 */

const GRAIN_URI =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='182' height='182'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.9 0 0 0 0 0.86 0 0 0 0 0.78 0.6 0.6 0.6 0 -0.35'/%3E%3C/filter%3E%3Crect width='182' height='182' filter='url(%23g)'/%3E%3C/svg%3E";

export default function Grain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[70] opacity-[0.04]"
      style={{
        backgroundImage: `url("${GRAIN_URI}")`,
        backgroundSize: "182px 182px",
      }}
    />
  );
}
