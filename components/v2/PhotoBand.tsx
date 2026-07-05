/**
 * PhotoBand — §3.15. Full-bleed A-state statement band: graded photo +
 * Parallax(8) + .scrim-b (+ .melt-b when `melt` so the band dissolves into
 * the ink section below). Content column sits on the 12-col grid at `align`,
 * bottom-anchored, inside the scrim zone (body ≤2 lines — body copy never
 * floats on raw photography, §2.5).
 *
 * Gold ledger (§2.7): a PhotoBand may spend the viewport's 2nd gold on its
 * CTA (`style: "gold"`) — every §4 usage keeps the eyebrow non-gold, and
 * this component renders it non-gold accordingly.
 *
 * Server component; Parallax / LineReveal / Rise are the client islands.
 */

import Image from "next/image";
import Link from "next/link";
import { Eyebrow } from "@/components/v2/Eyebrow";
import { LineReveal } from "@/components/v2/LineReveal";
import { Parallax } from "@/components/v2/Parallax";
import { Rise } from "@/components/v2/Rise";

export type PhotoBandProps = {
  image: { src: string; alt: string };
  eyebrow?: string;
  titleLines: string[];
  body?: string;
  align?: "left" | "right"; // text column placement, cols 2–7 or 7–12
  cta?: { label: string; href: string; style: "gold" | "ghost" };
  minH?: string; // default "min-h-[80svh]"
  melt?: boolean; // adds .melt-b so the band dissolves into ink below
};

const CONTAINER = "mx-auto w-full max-w-[1760px] px-[clamp(20px,5vw,90px)]";

export function PhotoBand({
  image,
  eyebrow,
  titleLines,
  body,
  align = "left",
  cta,
  minH = "min-h-[80svh]",
  melt = false,
}: PhotoBandProps) {
  return (
    <section
      data-ground="ink"
      className={`relative flex ${minH} flex-col justify-end overflow-hidden bg-ink`}
    >
      <Parallax range={8} className="absolute inset-0">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="100vw"
          className="img-grade object-cover"
        />
      </Parallax>
      <div aria-hidden className="scrim-b absolute inset-0" />
      {melt && <div aria-hidden className="melt-b absolute inset-0" />}
      <div className={`relative z-10 ${CONTAINER} pb-[9vh] pt-band-sm`}>
        <div className="grid grid-cols-12 gap-x-[clamp(16px,1.4vw,24px)]">
          <div
            className={
              align === "left"
                ? "col-span-12 md:col-start-2 md:col-end-8"
                : "col-span-12 md:col-start-7 md:col-end-12"
            }
          >
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            <LineReveal
              as="h2"
              lines={titleLines}
              className="mt-6 max-w-[14ch] font-omnibus text-display-l text-cream"
            />
            {body && (
              <Rise delay={0.2}>
                <p className="mt-6 max-w-[46ch] text-body-l text-paper/75">
                  {body}
                </p>
              </Rise>
            )}
            {cta && (
              <Rise delay={0.3}>
                <div className="mt-9">
                  <Link
                    href={cta.href}
                    className={
                      cta.style === "gold" ? "btn-gold" : "btn-ghost-dark"
                    }
                  >
                    {cta.label}
                  </Link>
                </div>
              </Rise>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default PhotoBand;
