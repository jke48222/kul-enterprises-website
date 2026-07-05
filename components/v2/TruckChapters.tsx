"use client";

/**
 * TruckChapters — §3.21. THE signature set piece (home only; never a second
 * pinned section on the same page).
 *
 * md+ (pinned): a 400vh ink section with a sticky h-svh stage. The right
 * half of the viewport holds four absolutely-stacked gold-lit truck photos
 * cross-fading per chapter (the honest 2D "rotating truck"); the left half
 * keeps a pinned header while the four chapter copy blocks — absolutely
 * stacked — crossfade DIRECTLY. No `AnimatePresence mode="wait"`: wait-mode
 * queues exit+enter pairs and under flick-scroll leaves the copy ~0.7s
 * behind the image crossfade. Scroll maps linearly to one chapter index and
 * the handler always adopts the LATEST computed index (fast scrolls jump
 * straight to the final chapter, never stepping through intermediates).
 *
 * <md, reduced motion, or PINNED_SCENE_ENABLED=false (§5.2.1): the stacked
 * fallback — four bands that keep the section's three signature beats:
 *   (a) dedicated crossfade-settle image entries (opacity 0→1, scale
 *       1.06→1, 0.8s EASE.kul, once — NOT the stock ClipReveal),
 *   (b) a ghost numeral behind each band,
 *   (c) a 1px linear progress hairline at the section top (paper/30,
 *       aria-hidden, never gold).
 *
 * Gold ledger (§2.7): the active chapter's gold eyebrow is the viewport's
 * 2nd gold element — one at a time. Nothing else here is gold.
 * Reduced motion: stacked layout, images enter as a 0.3s opacity fade,
 * scrubs disabled — fully visible at rest.
 */

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  m,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { DUR, EASE, VIEWPORT } from "@/components/v2/motion";
import { Eyebrow } from "@/components/v2/Eyebrow";
import { GhostNumeral } from "@/components/v2/GhostNumeral";
import { LineReveal } from "@/components/v2/LineReveal";

export type Chapter = {
  /** Running order / ghost numeral, e.g. "01". */
  index: string;
  /** services.json slug — the block links to /services/[slug]. */
  slug: string;
  /** Service tagline — rendered as the gold eyebrow (the viewport's 2nd gold). */
  eyebrow: string;
  title: string;
  /** services.json `short`. */
  body: string;
  image: { src: string; alt: string };
};

export type TruckChaptersProps = {
  /** Home passes exactly 4 (§3.21 chapter data, from content/services.json). */
  chapters: Chapter[];
};

/**
 * §5.2.1 — the single fallback flag. If desktop pinning isn't butter-smooth
 * by QA, flip this to `false` and the stacked layout (which retains the
 * crossfade-settle, ghost numerals, and progress hairline — signature-grade)
 * ships on ALL viewports. No other code change required.
 */
const PINNED_SCENE_ENABLED = true;

const HEADER_EYEBROW = "WHAT WE MOVE";
const HEADER_LINES = ["Seven services.", "One standard."];

function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

export function TruckChapters({ chapters }: TruckChaptersProps) {
  const reduced = useReducedMotion();
  // Pinned scene only when the flag is on AND motion is allowed (§3.21:
  // reduced motion always gets the stacked layout, all viewports).
  const pinned = PINNED_SCENE_ENABLED && !reduced;

  if (chapters.length === 0) return null;

  return (
    <section data-ground="ink" className="relative bg-ink text-paper">
      {pinned && <PinnedScene chapters={chapters} />}
      <StackedScene
        chapters={chapters}
        className={pinned ? "md:hidden" : undefined}
      />
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Pinned scene — md+ only (hidden below md via CSS)                   */
/* ------------------------------------------------------------------ */

function PinnedScene({ chapters }: { chapters: Chapter[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // §3.21 drive: progress 0→1 across the whole 400vh pin.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const chapterIndex = useTransform(scrollYProgress, (v) =>
    Math.min(
      chapters.length - 1,
      Math.max(0, Math.floor(v * chapters.length)),
    ),
  );
  // Always set the LATEST computed index directly — never step through
  // intermediate chapters on a flick (§3.21).
  useMotionValueEvent(chapterIndex, "change", (latest) => setActive(latest));

  return (
    <div
      ref={sectionRef}
      className="relative hidden md:block"
      style={{ height: `${chapters.length * 100}vh` }}
    >
      <div className="sticky top-0 grid h-svh grid-cols-12 gap-x-[clamp(16px,1.4vw,24px)] overflow-hidden">
        {/* LEFT — cols 1–6: pinned header + directly-crossfading chapter copy */}
        <div className="relative z-[1] col-span-6 flex h-full flex-col justify-center pl-[clamp(20px,5vw,90px)] pr-[clamp(8px,1vw,24px)]">
          {/* persistent header — stays pinned for the whole scene */}
          <div>
            <Eyebrow>{HEADER_EYEBROW}</Eyebrow>
            <LineReveal
              as="h2"
              lines={HEADER_LINES}
              className="mt-6 font-omnibus text-h2 text-paper"
            />
            {/* progress hairline — linear scrub, decoration, never gold */}
            <div
              aria-hidden
              className="relative mt-8 h-px w-full bg-white/[0.12]"
            >
              <m.div
                className="absolute inset-0 origin-left bg-paper/30"
                style={{ scaleX: scrollYProgress }}
              />
            </div>
          </div>

          {/* chapter blocks — absolutely stacked, direct crossfade */}
          <div className="relative mt-10 min-h-[clamp(19rem,42svh,24rem)]">
            {/* ghost numerals behind the copy, slower 0.6s crossfade */}
            {chapters.map((c, i) => (
              <m.div
                key={`ghost-${c.slug}`}
                aria-hidden
                className="absolute inset-0 z-0"
                initial={false}
                animate={{ opacity: i === active ? 1 : 0 }}
                transition={{ duration: DUR.slow, ease: [...EASE.kul] }}
              >
                <GhostNumeral className="-top-[0.28em] left-0">
                  {c.index}
                </GhostNumeral>
              </m.div>
            ))}

            {chapters.map((c, i) => {
              const isActive = i === active;
              return (
                <m.div
                  key={c.slug}
                  aria-hidden={!isActive}
                  className={cx(
                    "absolute inset-0 z-[1] flex flex-col items-start justify-start",
                    !isActive && "pointer-events-none",
                  )}
                  initial={false}
                  animate={
                    isActive
                      ? { opacity: [0, 1], y: [24, 0] } // enter from below
                      : { opacity: 0, y: -24 } // exit upward, fast leave
                  }
                  transition={
                    isActive
                      ? { duration: 0.45, ease: [...EASE.out] }
                      : { duration: 0.13, ease: [...EASE.out] } // §3.21: 0.12–0.15s
                  }
                >
                  {/* the viewport's 2nd gold — one active eyebrow at a time */}
                  <Eyebrow gold>{c.eyebrow}</Eyebrow>
                  {/* h3 tag in h2 clothes: visual scale from the token, the
                      tag keeps the outline h2 → h3 with no skips (§2.1). */}
                  <h3 className="mt-5 font-omnibus text-h2 text-cream">
                    {c.title}
                  </h3>
                  <p className="mt-4 max-w-[44ch] text-body text-paper/70">
                    {c.body}
                  </p>
                  <Link
                    href={`/services/${c.slug}`}
                    tabIndex={isActive ? 0 : -1}
                    className="link-hairline mt-6 py-1 text-label uppercase text-paper/80"
                  >
                    + MORE
                  </Link>
                </m.div>
              );
            })}
          </div>
        </div>

        {/* RIGHT — cols 7–12: the pinned truck, four angles cross-fading */}
        <div className="relative col-span-6 h-full overflow-hidden">
          {chapters.map((c, i) => {
            const isActive = i === active;
            return (
              <m.div
                key={c.slug}
                aria-hidden={!isActive}
                className="absolute inset-0"
                initial={false}
                animate={{
                  opacity: isActive ? 1 : 0,
                  // enters at 1.04 (its inactive rest state) and settles to 1
                  scale: isActive ? 1 : 1.04,
                }}
                transition={{ duration: DUR.slow, ease: [...EASE.kul] }}
              >
                <Image
                  src={c.image.src}
                  alt={c.image.alt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="img-grade object-cover"
                />
              </m.div>
            );
          })}
          {/* melt toward the left edge so copy never fights the photo */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(90deg,#0B0B0B_0%,transparent_30%)]"
          />
        </div>

        {/* stage footer */}
        <div className="absolute bottom-[5vh] left-[clamp(20px,5vw,90px)] z-[2]">
          <Link
            href="/services"
            className="link-hairline py-1 text-micro uppercase text-paper/60"
          >
            ALL SEVEN SERVICES <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Stacked fallback — <md always; all viewports when the §5.2.1 flag   */
/* is off or motion is reduced. Keeps the three signature beats.       */
/* ------------------------------------------------------------------ */

function StackedScene({
  chapters,
  className,
}: {
  chapters: Chapter[];
  className?: string;
}) {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  // Beat (c): linear progress across the whole section (no spring).
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  return (
    <div ref={sectionRef} className={cx("relative", className)}>
      {/* progress hairline at the section top — scrub, disabled under RM */}
      {!reduced && (
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-px bg-white/[0.12]"
        >
          <m.div
            className="h-full w-full origin-left bg-paper/30"
            style={{ scaleX: scrollYProgress }}
          />
        </div>
      )}

      <div className="mx-auto max-w-[1760px] px-[clamp(20px,5vw,90px)] py-band">
        <Eyebrow>{HEADER_EYEBROW}</Eyebrow>
        <LineReveal
          as="h2"
          lines={HEADER_LINES}
          className="mt-6 font-omnibus text-h2 text-paper"
        />

        <div className="mt-[clamp(3.5rem,10vw,6rem)] flex flex-col gap-y-[clamp(5rem,16vw,9rem)]">
          {chapters.map((c) => (
            <article key={c.slug} className="relative">
              {/* Beat (a): dedicated crossfade-settle — not the stock ClipReveal.
                  RM: 0.3s opacity fade, no transform. */}
              <div className="relative aspect-video overflow-hidden">
                <m.div
                  className="absolute inset-0"
                  initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 1.06 }}
                  whileInView={reduced ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                  viewport={VIEWPORT}
                  transition={
                    reduced
                      ? { duration: 0.3 }
                      : { duration: DUR.slower, ease: [...EASE.kul] }
                  }
                >
                  <Image
                    src={c.image.src}
                    alt={c.image.alt}
                    fill
                    sizes="100vw"
                    className="img-grade object-cover"
                  />
                </m.div>
              </div>

              {/* Beat (b): ghost numeral behind the band copy */}
              <div className="relative mt-8">
                <GhostNumeral className="-top-[0.34em] right-0">
                  {c.index}
                </GhostNumeral>
                <div className="relative z-[1]">
                  <Eyebrow gold>{c.eyebrow}</Eyebrow>
                  <h3 className="mt-4 font-omnibus text-h2 text-cream">
                    {c.title}
                  </h3>
                  <p className="mt-4 max-w-[52ch] text-body text-paper/70">
                    {c.body}
                  </p>
                  <Link
                    href={`/services/${c.slug}`}
                    className="link-hairline mt-6 py-1 text-label uppercase text-paper/80"
                  >
                    + MORE
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-[clamp(4rem,12vw,7rem)]">
          <Link
            href="/services"
            className="link-hairline py-1 text-micro uppercase text-paper/60"
          >
            ALL SEVEN SERVICES <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TruckChapters;
