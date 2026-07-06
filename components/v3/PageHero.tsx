"use client";

/**
 * PageHero — v3 interior openers. Two variants:
 *  - photo:   full-bleed graded image + Parallax(6) + .scrim-b, title
 *             anchored lower-left (Volvo model-page register).
 *  - compact: lean ink band for conversion/legal pages.
 * Exactly one h1 per page — this component renders it. Heroes read
 * useVeilState().heroDelay and animate `immediate` (above-the-fold law).
 */

import Image from "next/image";
import { Eyebrow } from "@/components/v3/Eyebrow";
import { LineReveal } from "@/components/v3/LineReveal";
import { Parallax } from "@/components/v3/Parallax";
import { Rise } from "@/components/v3/Rise";
import { useVeilState } from "@/components/v3/RouteVeil";

export type PageHeroProps = {
  variant: "photo" | "compact";
  eyebrow?: string;
  titleLines: string[];
  deck?: string;
  image?: { src: string; alt: string };
  height?: "45" | "60" | "80";
  index?: string; // e.g. "03 / 07" on service details
  children?: React.ReactNode;
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
              immediate
              className="mt-6 max-w-[16ch] text-d1 text-paper"
            />
            {deck && (
              <Rise immediate delay={baseDelay + 0.25}>
                <p className="mt-6 max-w-[52ch] text-body-l text-paper/80">
                  {deck}
                </p>
              </Rise>
            )}
            {children && (
              <Rise immediate delay={baseDelay + 0.45}>
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
          immediate
          className="mt-6 max-w-[16ch] text-d1 text-paper"
        />
        {deck && (
          <Rise immediate delay={baseDelay + 0.25}>
            <p className="mt-6 max-w-[52ch] text-body-l text-paper/80">
              {deck}
            </p>
          </Rise>
        )}
        {children && (
          <Rise immediate delay={baseDelay + 0.45}>
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
