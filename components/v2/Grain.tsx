/**
 * Grain — the one fixed film-grain layer that unifies mixed stock
 * photography into a single "shoot" (design bible §2.6 / §3.23).
 *
 * Static feTurbulence data-URI, tiled at 182px. NO blend mode — a blend on
 * a fixed full-viewport layer would force whole-page recompositing every
 * frame over the hero video and the pinned TruckChapters section; the warm
 * paper tint and contrast are baked into the SVG itself (the feColorMatrix
 * maps noise luminance to alpha around a warm-paper constant color) and the
 * layer composites normally at low alpha. Never animated.
 *
 * z-order: 70 — above content, below nav (z-80), menu overlay (z-90) and
 * the route veil (z-100).
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
