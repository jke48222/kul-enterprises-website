"use client";

/**
 * CtaBand — §3.18. Page endings: every page ends differently via variant,
 * then hands off to the curtain Footer directly below.
 *
 *  - quote:  home. 92svh ink, display-xl "Ready / to move?" + oversized
 *            quote link over a gold hairline (the viewport's 2nd gold).
 *  - drive:  ghost CTA → /drivers (available; unused on v2 home).
 *  - packet: services index. Ghost CTA → /carrier-packet. No gold.
 *  - verify: safety. Ghost link → FMCSA SAFER (external). No gold.
 *  - call:   drivers. The phone number IS the design object (display-l
 *            tel: link) with the interior pages' one signature flourish —
 *            an SVG hairline that draws itself left→right (pathLength 0→1,
 *            1.1s EASE.kul, whileInView once). Used nowhere else. No gold.
 *  - next:   about + service details. Full-bleed 70svh image link.
 *
 * All entrances via LineReveal + Rise; reduced motion = visible at rest
 * (the SVG draw renders complete).
 */

import Image from "next/image";
import Link from "next/link";
import { m, useReducedMotion } from "framer-motion";
import { EASE, VIEWPORT } from "@/components/v2/motion";
import { Eyebrow } from "@/components/v2/Eyebrow";
import { LineReveal } from "@/components/v2/LineReveal";
import { Parallax } from "@/components/v2/Parallax";
import { Rise } from "@/components/v2/Rise";
import { site } from "@/lib/site";

export type CtaBandProps = {
  variant: "quote" | "drive" | "packet" | "verify" | "call" | "next";
  next?: { label: string; href: string; image?: { src: string; alt: string } }; // for "next"
};

const CONTAINER = "mx-auto w-full max-w-[1760px] px-[clamp(20px,5vw,90px)]";

/** The drivers phone-number hairline: draws itself once, in view. */
function HairlineDraw() {
  const reduced = useReducedMotion();
  return (
    <svg
      aria-hidden
      className="block h-[2px] w-full text-paper/60"
      viewBox="0 0 100 2"
      preserveAspectRatio="none"
    >
      <m.path
        d="M0 1 L100 1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
        initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: 1.1, ease: [...EASE.kul] }}
      />
    </svg>
  );
}

export function CtaBand({ variant, next }: CtaBandProps) {
  if (variant === "quote") {
    return (
      <section
        data-ground="ink"
        className="relative flex min-h-[92svh] items-center bg-ink"
      >
        <div className={CONTAINER}>
          <LineReveal
            as="h2"
            lines={["Ready", "to move?"]}
            className="font-omnibus text-display-xl text-cream"
          />
          <Rise delay={0.3}>
            <Link
              href="/v2/quote"
              className="group relative mt-12 inline-block pb-3 font-omnibus text-h2 text-cream"
            >
              Request a quote{" "}
              <span aria-hidden className="inline-block">
                →
              </span>
              {/* Gold hairline underline wipe — the viewport's 2nd gold. */}
              <span
                aria-hidden
                className="absolute bottom-0 left-0 block h-px w-full overflow-hidden bg-gold/70"
              >
                <span className="absolute inset-0 origin-left scale-x-0 bg-gold-soft transition-transform duration-500 ease-inout group-hover:scale-x-100 motion-reduce:transition-none" />
              </span>
            </Link>
          </Rise>
          <Rise delay={0.4}>
            <p className="mt-10 text-micro uppercase text-paper/60">
              Same business day · Dispatch{" "}
              <a
                href={site.phoneHref}
                className="link-hairline tabular-nums text-paper/80"
              >
                {site.phone}
              </a>
            </p>
          </Rise>
        </div>
      </section>
    );
  }

  if (variant === "drive") {
    return (
      <section data-ground="ink" className="relative bg-ink py-band-lg">
        <div className={CONTAINER}>
          <LineReveal
            as="h2"
            lines={["Drive something", "worth driving."]}
            className="max-w-[14ch] font-omnibus text-display-l text-cream"
          />
          <Rise delay={0.3}>
            <div className="mt-10">
              <Link href="/v2/drivers" className="btn-ghost-dark">
                Drive with KUL
              </Link>
            </div>
          </Rise>
        </div>
      </section>
    );
  }

  if (variant === "packet") {
    return (
      <section data-ground="ink" className="relative bg-ink py-band-lg">
        <div className={CONTAINER}>
          <LineReveal
            as="h2"
            lines={["Brokers: the full packet,", "same business day."]}
            className="max-w-[18ch] font-omnibus text-display-l text-cream"
          />
          <Rise delay={0.3}>
            <div className="mt-10">
              <Link href="/v2/carrier-packet" className="btn-ghost-dark">
                Request the packet
              </Link>
            </div>
          </Rise>
          <Rise delay={0.4}>
            <p className="mt-8 text-micro uppercase tabular-nums text-paper/60">
              One email. USDOT {site.usdot} · MC {site.mc}.
            </p>
          </Rise>
        </div>
      </section>
    );
  }

  if (variant === "verify") {
    return (
      <section data-ground="ink" className="relative bg-ink py-band-lg">
        <div className={CONTAINER}>
          <LineReveal
            as="h2"
            lines={["Look us up.", "We encourage it."]}
            className="max-w-[14ch] font-omnibus text-display-l text-cream"
          />
          <Rise delay={0.3}>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <a
                href="https://safer.fmcsa.dot.gov/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost-dark"
              >
                Verify on FMCSA SAFER{" "}
                <span aria-hidden className="inline-block">
                  ↗
                </span>
              </a>
              <Link
                href="/v2/quote"
                className="link-hairline text-label uppercase text-paper/80"
              >
                Or send a lane →
              </Link>
            </div>
          </Rise>
        </div>
      </section>
    );
  }

  if (variant === "call") {
    return (
      <section data-ground="ink" className="relative bg-ink py-band-lg">
        <div className={CONTAINER}>
          <LineReveal
            as="h2"
            lines={["Talk lanes, home time,", "equipment."]}
            className="max-w-[18ch] font-omnibus text-display-l text-cream"
          />
          <Rise delay={0.25}>
            <a
              href={site.phoneHref}
              className="mt-12 inline-block font-omnibus text-display-l tabular-nums text-cream transition-colors duration-200 ease-micro hover:text-paper"
            >
              {site.phone}
            </a>
          </Rise>
          {/* The number's hairline draws itself — interior signature, used nowhere else. */}
          <div className="mt-5">
            <HairlineDraw />
          </div>
          <Rise delay={0.35}>
            <p className="mt-8 text-micro uppercase text-paper/60">
              A person calls back. Usually the owner.
            </p>
          </Rise>
        </div>
      </section>
    );
  }

  // next — full-bleed image link ending (about, services/[slug]).
  if (!next) return null;
  return (
    <section data-ground="ink" className="relative bg-ink">
      <Link
        href={next.href}
        className="group relative flex h-[70svh] flex-col justify-end overflow-hidden"
      >
        {next.image && (
          <Parallax range={6} className="absolute inset-0">
            <Image
              src={next.image.src}
              alt={next.image.alt}
              fill
              sizes="100vw"
              className="img-grade object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none"
            />
          </Parallax>
        )}
        {/* Dim layer: /55 at rest, /35 on hover. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-ink/55 transition-colors duration-700 group-hover:bg-ink/35 motion-reduce:transition-none"
        />
        <div className={`relative z-10 ${CONTAINER} pb-[9vh]`}>
          <Eyebrow>Next</Eyebrow>
          <LineReveal
            as="h2"
            lines={[next.label]}
            className="mt-6 font-omnibus text-display-xl text-cream"
          />
        </div>
      </Link>
    </section>
  );
}

export default CtaBand;
