"use client";

/**
 * PageHero — §3.12. Three variants for every interior page:
 *  - photo:   full-bleed graded image + Parallax(6) + .scrim-b, title block
 *             anchored lower-left (never a lone floating title).
 *  - split:   trucknroll editorial on ink, no photo-bleed — left framed
 *             photo (5/3, ClipReveal) with a short intro beneath, right H1
 *             whose LAST line may carry an inline photo chip (via `chip`).
 *  - compact: lean ink band for conversion/legal pages. No image.
 *
 * Client component so the H1 timing can read useVeilState().heroDelay
 * (§3.22) — heroes start their LineReveal 0.1s before the veil clears.
 * Exactly one h1 per page: this component renders it.
 */

import Image from "next/image";
import { ClipReveal } from "@/components/v2/ClipReveal";
import { Eyebrow } from "@/components/v2/Eyebrow";
import { LineReveal } from "@/components/v2/LineReveal";
import { Parallax } from "@/components/v2/Parallax";
import { Rise } from "@/components/v2/Rise";
import { useVeilState } from "@/components/v2/RouteVeil";

export type PageHeroProps = {
  variant: "photo" | "split" | "compact";
  eyebrow?: string;
  titleLines: string[]; // fed to LineReveal
  deck?: string; // one supporting sentence (split: the intro paragraph under the photo)
  image?: { src: string; alt: string }; // required for photo/split
  height?: "45" | "60" | "80"; // svh, photo variant; default 60
  index?: string; // e.g. "03 / 07" for service details
  children?: React.ReactNode; // CTAs etc.
  /** Optional inline photo chip in the H1's last line (split only — §4.3). */
  chip?: { src: string; alt: string };
};

const CONTAINER = "mx-auto w-full max-w-[1760px] px-[clamp(20px,5vw,90px)]";

const HEIGHTS: Record<NonNullable<PageHeroProps["height"]>, string> = {
  "45": "min-h-[45svh]",
  "60": "min-h-[60svh]",
  "80": "min-h-[80svh]",
};

export function PageHero({
  variant,
  eyebrow,
  titleLines,
  deck,
  image,
  height = "60",
  index,
  children,
  chip,
}: PageHeroProps) {
  const { heroDelay } = useVeilState();
  const baseDelay = heroDelay + 0.2;

  if (variant === "photo" && image) {
    return (
      <section
        data-ground="ink"
        className={`relative flex ${HEIGHTS[height]} flex-col justify-end overflow-hidden bg-ink`}
      >
        <Parallax range={6} className="absolute inset-0">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority
            sizes="100vw"
            className="img-grade object-cover"
          />
        </Parallax>
        <div aria-hidden className="scrim-b absolute inset-0" />
        <div className={`relative z-10 ${CONTAINER} pb-[10vh] pt-32`}>
          <div className="relative">
            {index && (
              <p
                aria-hidden
                className="absolute right-0 top-0 text-micro uppercase tabular-nums text-paper/60"
              >
                {index}
              </p>
            )}
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            <LineReveal
              as="h1"
              lines={titleLines}
              delay={baseDelay}
              className="mt-6 max-w-[14ch] font-omnibus text-display-l text-cream"
            />
            {deck && (
              <Rise delay={baseDelay + 0.25}>
                <p className="mt-6 max-w-[52ch] text-body-l text-paper/80">
                  {deck}
                </p>
              </Rise>
            )}
            {children && (
              <Rise delay={baseDelay + 0.45}>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  {children}
                </div>
              </Rise>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (variant === "split" && image) {
    // The last H1 line optionally carries the inline photo chip.
    const lines: React.ReactNode[] = chip
      ? [
          ...titleLines.slice(0, -1),
          <span key="chip-line" className="flex items-center gap-[0.25em]">
            <span>{titleLines[titleLines.length - 1]}</span>
            <span className="relative h-[0.9lh] flex-grow overflow-hidden [aspect-ratio:470/250]">
              <Image
                src={chip.src}
                alt={chip.alt}
                fill
                sizes="(min-width:768px) 33vw, 100vw"
                className="img-grade object-cover"
              />
            </span>
          </span>,
        ]
      : titleLines;

    return (
      <section data-ground="ink" className="relative bg-ink pb-band pt-32">
        <div
          className={`${CONTAINER} grid grid-cols-1 items-end gap-x-[clamp(16px,1.4vw,24px)] gap-y-12 lg:grid-cols-12`}
        >
          <div className="order-2 lg:order-1 lg:col-span-5">
            <ClipReveal
              direction="left"
              className="relative aspect-[5/3] overflow-hidden"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority
                sizes="(min-width:768px) 50vw, 100vw"
                className="img-grade object-cover"
              />
            </ClipReveal>
            {deck && (
              <Rise delay={baseDelay + 0.35}>
                <p className="mt-6 max-w-[320px] text-sm leading-relaxed text-paper/70">
                  {deck}
                </p>
              </Rise>
            )}
          </div>
          <div className="order-1 lg:order-2 lg:col-span-7">
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            <LineReveal
              as="h1"
              lines={lines}
              delay={baseDelay}
              className="mt-6 font-omnibus text-display-l uppercase text-cream"
            />
            {children && (
              <Rise delay={baseDelay + 0.45}>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  {children}
                </div>
              </Rise>
            )}
          </div>
        </div>
      </section>
    );
  }

  // compact — ink band for conversion/legal pages.
  return (
    <section
      data-ground="ink"
      className="relative flex min-h-[38svh] flex-col justify-end bg-ink pb-band-sm pt-32"
    >
      <div className={CONTAINER}>
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <LineReveal
          as="h1"
          lines={titleLines}
          delay={baseDelay}
          className="mt-6 max-w-[14ch] font-omnibus text-display-l text-cream"
        />
        {deck && (
          <Rise delay={baseDelay + 0.25}>
            <p className="mt-6 max-w-[52ch] text-body-l text-paper/80">
              {deck}
            </p>
          </Rise>
        )}
        {children && (
          <Rise delay={baseDelay + 0.45}>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              {children}
            </div>
          </Rise>
        )}
      </div>
    </section>
  );
}

export default PageHero;
