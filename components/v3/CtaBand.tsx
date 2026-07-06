"use client";

/**
 * CtaBand — v3 port (v2 §3.18). Page endings by variant, handing off to
 * the curtain Footer below:
 *  - quote:  92svh ink, d1 "Ready to move?" + oversized quote link over a
 *            gold hairline (the viewport's 2nd gold).
 *  - drive / packet / verify: ghost endings, no gold.
 *  - call:   the phone number IS the design object, with the interior
 *            pages' one signature flourish (self-drawing hairline).
 *  - next:   full-bleed 70svh image link.
 */

import Image from "next/image";
import Link from "next/link";
import { m, useReducedMotion } from "framer-motion";
import { EASE, VIEWPORT } from "@/components/v3/motion";
import { Eyebrow } from "@/components/v3/Eyebrow";
import { LineReveal } from "@/components/v3/LineReveal";
import { Parallax } from "@/components/v3/Parallax";
import { Rise } from "@/components/v3/Rise";
import { site } from "@/lib/site";

const BASE = "/v3";

export type CtaBandProps = {
  variant: "quote" | "drive" | "packet" | "verify" | "call" | "next";
  next?: { label: string; href: string; image?: { src: string; alt: string } };
};

const CONTAINER = "mx-auto w-full max-w-[1760px] px-[clamp(20px,5vw,90px)]";

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
            className="text-d1 text-paper"
          />
          <Rise delay={0.3}>
            <Link
              href={`${BASE}/quote`}
              className="group relative mt-12 inline-block pb-3 text-d2 text-paper"
            >
              Request a quote{" "}
              <span aria-hidden className="inline-block">
                →
              </span>
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
            className="max-w-[16ch] text-d2 text-paper"
          />
          <Rise delay={0.3}>
            <div className="mt-10">
              <Link href={`${BASE}/drivers`} className="btn-ghost-dark">
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
            className="max-w-[20ch] text-d2 text-paper"
          />
          <Rise delay={0.3}>
            <div className="mt-10">
              <Link href={`${BASE}/carrier-packet`} className="btn-ghost-dark">
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
            className="max-w-[16ch] text-d2 text-paper"
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
                href={`${BASE}/quote`}
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
            className="max-w-[20ch] text-d2 text-paper"
          />
          <Rise delay={0.25}>
            <a
              href={site.phoneHref}
              className="mt-12 inline-block text-d1 tabular-nums text-paper transition-colors duration-200 ease-micro hover:text-gold-soft"
            >
              {site.phone}
            </a>
          </Rise>
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

  // next — full-bleed image link ending.
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
        <div
          aria-hidden
          className="absolute inset-0 bg-ink/55 transition-colors duration-700 group-hover:bg-ink/35 motion-reduce:transition-none"
        />
        <div className={`relative z-10 ${CONTAINER} pb-[9vh]`}>
          <Eyebrow>Next</Eyebrow>
          <LineReveal
            as="h2"
            lines={[next.label]}
            className="mt-6 text-d1 text-paper"
          />
        </div>
      </Link>
    </section>
  );
}

export default CtaBand;
