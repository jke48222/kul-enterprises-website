/**
 * PhotoBand — v3 port (v2 §3.15). Full-bleed statement band: graded photo +
 * Parallax(8) + .scrim-b (+ .melt-b when `melt`). Content bottom-anchored
 * on the 12-col grid; body ≤2 lines (copy never floats on raw photography).
 * v3 type: text-d2 display on paper-white. Parallax disables itself under
 * reduced motion (vestibular guardrail — 17-v3-research §2D).
 */

import Image from "next/image";
import Link from "next/link";
import { Eyebrow } from "@/components/v3/Eyebrow";
import { LineReveal } from "@/components/v3/LineReveal";
import { Parallax } from "@/components/v3/Parallax";
import { Rise } from "@/components/v3/Rise";

export type PhotoBandProps = {
  image: { src: string; alt: string };
  eyebrow?: string;
  titleLines: string[];
  body?: string;
  align?: "left" | "right";
  cta?: { label: string; href: string; style: "gold" | "ghost" };
  minH?: string;
  melt?: boolean;
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
                ? "col-span-12 md:col-start-1 md:col-end-8"
                : "col-span-12 md:col-start-7 md:col-end-13"
            }
          >
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            <LineReveal
              as="h2"
              lines={titleLines}
              className="mt-6 max-w-[16ch] text-d2 text-paper"
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
