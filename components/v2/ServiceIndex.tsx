"use client";

/**
 * ServiceIndex — §3.14. The numbered editorial index on /services (paper
 * ground). One hairline row per service, all 7, in services.json order.
 *
 * lg+ / pointer:fine / motion-safe: a SINGLE shared 260px 4:5 preview panel
 * follows the cursor on springs (stiffness 150, damping 20 — the site's ONLY
 * spring, §2.3), swapping its photo per hovered row and leaning ±6° with
 * spring velocity (useVelocity → useTransform). The hovered row's text
 * indents 12px while sibling rows dim to 40% — slow in 0.45s, fast out 0.2s,
 * EASE.micro (§2.3 interaction law). All 7 preview images preload eagerly
 * once the panel mounts, at 260px renditions — never full-viewport files.
 *
 * Everywhere else (below lg, coarse pointers, reduced motion): no follower —
 * each row shows a static 16:9 ClipReveal thumb above the name instead. The
 * SAME media query gates the thumb (CSS) and the follower (JS), so the two
 * presentations can never disagree.
 *
 * Row text never gold (§3.14). Row indices are aria-hidden decoration
 * (§2.1 opacity floor — /40 alpha is decoration-only).
 */

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  m,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import type { Service } from "@/lib/services";
import { EASE } from "@/components/v2/motion";
import { ClipReveal } from "@/components/v2/ClipReveal";

export type ServiceIndexProps = {
  /** From lib/services (content/services.json), json order. */
  services: Service[];
};

/** 260px, 4:5 (§3.14). */
const PANEL_W = 260;
const PANEL_H = 325;

/**
 * The one media condition of this component: where it matches, the cursor
 * follower runs and the static thumbs hide; where it doesn't, the thumbs
 * show. Keep the CSS variant and FOLLOWER_QUERY in lockstep.
 */
const FOLLOWER_QUERY = "(min-width: 1024px) and (pointer: fine)";
const THUMB_HIDDEN =
  "[@media(min-width:1024px)_and_(pointer:fine)_and_(prefers-reduced-motion:no-preference)]:hidden";

function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

export function ServiceIndex({ services }: ServiceIndexProps) {
  const reduced = useReducedMotion();
  const [followerReady, setFollowerReady] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(FOLLOWER_QUERY);
    const update = () => setFollowerReady(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const followerOn = followerReady && !reduced;

  // Single shared follower node — position springs + velocity-driven lean.
  const x = useMotionValue(-9999);
  const y = useMotionValue(-9999);
  const sx = useSpring(x, { stiffness: 150, damping: 20 });
  const sy = useSpring(y, { stiffness: 150, damping: 20 });
  const vx = useVelocity(sx);
  const rotate = useTransform(vx, [-1500, 1500], [-6, 6], { clamp: true });

  const place = (e: React.PointerEvent) => {
    x.set(e.clientX - PANEL_W / 2);
    y.set(e.clientY - PANEL_H / 2);
  };

  // Entering the index: teleport the (hidden) panel to the cursor so the
  // first show never glides in from a stale corner.
  const handleSectionEnter = (e: React.PointerEvent) => {
    if (!followerOn || e.pointerType === "touch") return;
    const px = e.clientX - PANEL_W / 2;
    const py = e.clientY - PANEL_H / 2;
    x.set(px);
    y.set(py);
    sx.jump(px);
    sy.jump(py);
  };

  return (
    <section data-ground="paper" className="relative bg-paper py-band-sm text-ink">
      <div
        onPointerEnter={handleSectionEnter}
        onPointerMove={followerOn ? place : undefined}
        onPointerLeave={() => setHovered(null)}
      >
        <ul role="list" className="list-none">
          {services.map((s, i) => {
            const idx = String(i + 1).padStart(2, "0");
            const isHovered = followerOn && hovered === i;
            const isDimmed =
              followerOn && hovered !== null && hovered !== i;
            return (
              <li key={s.slug} className="border-t border-ink/15">
                <Link
                  href={`/v2/services/${s.slug}`}
                  className="block"
                  onPointerEnter={(e) => {
                    if (!followerOn || e.pointerType === "touch") return;
                    setHovered(i);
                  }}
                >
                  <div className="mx-auto max-w-[1760px] px-[clamp(20px,5vw,90px)] py-[clamp(20px,4vh,44px)]">
                    {/* static thumb — mobile / coarse pointer / reduced motion */}
                    <ClipReveal
                      direction="left"
                      className={cx("mb-6 aspect-video w-full", THUMB_HIDDEN)}
                    >
                      <div className="relative h-full w-full">
                        <Image
                          src={s.image.src}
                          alt=""
                          fill
                          sizes="100vw"
                          className="img-grade object-cover"
                        />
                      </div>
                    </ClipReveal>

                    {/* row text — indents 12px hovered, dims to 40% as sibling;
                        slow in (0.45s) / fast out (0.2s), EASE.micro */}
                    <m.div
                      className="grid grid-cols-[auto_1fr_auto] items-baseline gap-x-[clamp(16px,1.4vw,24px)] lg:grid-cols-12"
                      initial={false}
                      animate={{
                        x: isHovered ? 12 : 0,
                        opacity: isDimmed ? 0.4 : 1,
                      }}
                      transition={{
                        duration: hovered === null ? 0.2 : 0.45,
                        ease: [...EASE.micro],
                      }}
                    >
                      <span
                        aria-hidden
                        className="text-micro uppercase tabular-nums text-ink/40 lg:col-span-1"
                      >
                        {idx}
                      </span>
                      <span className="font-omnibus text-[clamp(2rem,5.5vw,4.5rem)] leading-[0.95] text-ink lg:col-span-6">
                        {s.name}
                      </span>
                      <span className="hidden max-w-[36ch] text-right text-[14px] leading-relaxed text-graywarm-deep lg:col-span-4 lg:block lg:justify-self-end">
                        {s.short}
                      </span>
                      <span
                        aria-hidden
                        className="justify-self-end text-[clamp(1.25rem,2vw,1.75rem)] text-ink lg:col-span-1"
                      >
                        →
                      </span>
                    </m.div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* the single shared cursor-follow preview panel (lg+, fine, motion-safe) */}
        {followerOn && (
          <m.div
            aria-hidden
            className="pointer-events-none fixed left-0 top-0 z-[60] w-[260px] will-change-transform"
            style={{ x: sx, y: sy, rotate }}
            initial={{ opacity: 0 }}
            animate={{ opacity: hovered !== null ? 1 : 0 }}
            transition={{ duration: 0.2, ease: [...EASE.micro] }}
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden">
              {services.map((s, i) => (
                <Image
                  key={s.slug}
                  src={s.image.src}
                  alt=""
                  fill
                  sizes="260px"
                  loading="eager"
                  className={cx(
                    "img-grade object-cover transition-opacity duration-200 ease-micro",
                    hovered === i ? "opacity-100" : "opacity-0",
                  )}
                />
              ))}
            </div>
          </m.div>
        )}
      </div>
    </section>
  );
}

export default ServiceIndex;
