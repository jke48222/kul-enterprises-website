/**
 * HeroFrame — §3.11. Corner furniture pinned inside a hero: micro type in
 * paper/60, bottom-left coordinates line by default, bottom-right ScrollCue
 * by default. The parent hero MUST place this inside its .scrim-b /
 * .scrim-hero zone (readable micro over raw video/photo fails contrast —
 * §2.1 opacity floor). ScrollCue is a CSS-only scaleY loop, aria-hidden,
 * never gold, hidden under reduced motion. Server component.
 */

import type { ReactNode } from "react";
import { site } from "@/lib/site";

export type HeroFrameProps = {
  bottomLeft?: ReactNode;
  bottomRight?: ReactNode;
};

/** "33.83°N / 83.90°W" from content/site.json geo (truncated, not rounded). */
function formatGeo() {
  const { latitude, longitude } = site.geo;
  const trunc = (v: number) => (Math.trunc(Math.abs(v) * 100) / 100).toFixed(2);
  const lat = `${trunc(latitude)}°${latitude >= 0 ? "N" : "S"}`;
  const lon = `${trunc(longitude)}°${longitude >= 0 ? "E" : "W"}`;
  return `${lat} / ${lon}`;
}

function ScrollCue() {
  return (
    <span
      aria-hidden
      className="flex flex-col items-center gap-3 text-paper/40 motion-reduce:hidden"
    >
      <span className="text-micro uppercase tracking-[0.18em] [writing-mode:vertical-rl]">
        Scroll
      </span>
      <span className="block h-12 w-px overflow-hidden">
        <span className="block h-full w-full bg-current motion-safe:animate-[v2-scrollcue_2.2s_ease-in-out_infinite]" />
      </span>
      <style>{`@keyframes v2-scrollcue{0%{transform:scaleY(0);transform-origin:top}45%{transform:scaleY(1);transform-origin:top}55%{transform:scaleY(1);transform-origin:bottom}100%{transform:scaleY(0);transform-origin:bottom}}`}</style>
    </span>
  );
}

export function HeroFrame({ bottomLeft, bottomRight }: HeroFrameProps) {
  return (
    <div className="pointer-events-none absolute inset-x-[clamp(20px,5vw,90px)] bottom-[5vh] z-10 flex items-end justify-between gap-6 text-micro uppercase text-paper/60">
      <div>
        {bottomLeft ?? (
          <span>
            {site.location.toUpperCase()} &mdash; {formatGeo()}
          </span>
        )}
      </div>
      <div>{bottomRight ?? <ScrollCue />}</div>
    </div>
  );
}

export default HeroFrame;
