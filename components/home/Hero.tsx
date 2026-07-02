"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  m,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { site } from "@/lib/site";
import { services } from "@/lib/services";
import { stagger, staggerItem } from "@/lib/motion";

/**
 * Home hero. Full-bleed night photograph of a black rig wearing amber
 * running lights, licensed from Unsplash until Mark's own fleet is shot.
 * The left half of the frame is nearly pure black, which is where the
 * headline lives. LCP-safe: next/image with priority, never lazy. Headline
 * and CTAs are server-rendered and readable with no scroll and no JS.
 * Scroll parallax animates transform only and turns off for reduced motion.
 */
export default function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-ink"
    >
      <m.div
        aria-hidden
        className="absolute inset-0"
        style={reduce ? undefined : { y, scale }}
      >
        <Image
          // REPLACEABLE ASSET: licensed stock stands in for Mark's fleet photography
          src="/images/stock/hero-alt-semi-night-gold-lights.jpg"
          alt=""
          fill
          priority
          quality={82}
          sizes="100vw"
          className="object-cover object-[68%_center]"
        />
        {/* Legibility scrims */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,11,11,0.88)_0%,rgba(11,11,11,0.45)_45%,rgba(11,11,11,0)_75%)]" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-[linear-gradient(180deg,transparent,rgba(11,11,11,0.92))]" />
        <div className="absolute inset-x-0 top-0 h-32 bg-[linear-gradient(0deg,transparent,rgba(11,11,11,0.55))]" />
      </m.div>

      <m.div
        variants={stagger}
        initial={reduce ? false : "hidden"}
        animate="show"
        className="relative mx-auto w-full max-w-content px-6 pb-24 pt-32"
      >
        <div className="max-w-2xl">
          <m.div variants={staggerItem} className="mb-6 flex items-center gap-4">
            <span className="gold-rule" />
            <span className="eyebrow text-gold">
              USDOT {site.usdot} · MC {site.mc}
            </span>
          </m.div>

          <m.h1
            variants={staggerItem}
            className="font-display text-display-xl font-bold text-white"
          >
            Reliable Freight Transportation Built on Trust
          </m.h1>

          <m.p
            variants={staggerItem}
            className="mt-6 max-w-xl text-base leading-relaxed text-graywarm-light sm:text-lg"
          >
            {services.map((s) => s.name).join("  ·  ")}
          </m.p>

          <m.div
            variants={staggerItem}
            className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <Link href="/quote" className="btn-gold">
              Request a Freight Quote
            </Link>
            <Link href="/careers" className="btn-ghost-dark group">
              Become a Driver
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </m.div>

          <m.p
            variants={staggerItem}
            className="mt-10 max-w-md text-sm italic text-graywarm"
          >
            {site.tagline}
          </m.p>
        </div>
      </m.div>
    </section>
  );
}
