import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

/**
 * Version chooser for the client demo: one door per design iteration.
 * All trees are complete sites — /v1 the original build, /v2 the
 * ground-up redesign, /v3 the Cinematic Trust Experience (Apple × Volvo
 * register). Deliberately dependency-free (no motion imports): this page
 * must never be the reason the demo stalls.
 */
export const metadata: Metadata = {
  title: "Design Preview",
  robots: { index: false },
};

const VERSIONS = [
  {
    href: "/v1",
    label: "Version 1",
    note: "The original build — editorial concept, GoldGlass era",
  },
  {
    href: "/v2",
    label: "Version 2",
    note: "The redesign — cinematic rebuild, quote strip, truck chapters",
  },
  {
    href: "/v3",
    label: "Version 3",
    note: "Cinematic Trust — light-forward Apple × Volvo register, lion-primary, gold roadway, Southeast map",
  },
  {
    href: "/v4",
    label: "Version 4",
    note: "DISPATCH — Mobbin-sourced operations document. Big Shoulders signage type, rationed gold, interactive capability list, stepped quote flow",
  },
] as const;

/**
 * The surviving design exploration, kept alongside the numbered versions.
 * Phase 1 is one signature page per variant; phase 2 is the full chapter set.
 */
const EXPLORATION = [
  { style: "Marquee Editorial", p1: ["s02a", "s02b"], p2: "s02a" },
  { style: "Industrial Ledger", p1: ["s06a", "s06b"], p2: "s06a" },
  { style: "Apple layout family", p1: ["s10"], p2: "s10" },
  { style: "Rivian layout family", p1: ["s12"], p2: "s12" },
] as const;

export default function VersionChooser() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-ink px-6 py-16 text-white">
      <Image
        src="/images/brand/kul-logo-lockup.png"
        alt="KUL Enterprises LLC"
        width={244}
        height={91}
        priority
        className="h-10 w-auto"
      />
      <p className="mt-4 font-mont text-[11px] font-medium uppercase tracking-eyebrow text-white/50">
        Design preview · choose a version
      </p>
      <div className="mt-12 grid w-full max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {VERSIONS.map((v) => (
          <Link
            key={v.href}
            href={v.href}
            className="group border border-white/[0.14] px-8 py-10 transition-colors duration-300 hover:border-gold"
          >
            <span className="block font-omnibus text-3xl text-cream transition-colors duration-300 group-hover:text-gold">
              {v.label}
            </span>
            <span className="mt-3 block font-mont text-sm leading-relaxed text-white/60">
              {v.note}
            </span>
            <span className="mt-6 block font-mont text-[11px] font-semibold uppercase tracking-eyebrow text-white/70 transition-colors duration-300 group-hover:text-gold">
              Enter →
            </span>
          </Link>
        ))}
      </div>
      <div className="mt-16 w-full max-w-5xl border-t border-white/[0.14] pt-8">
        <p className="font-mont text-[11px] font-medium uppercase tracking-eyebrow text-white/50">
          Exploration ·{" "}
          <a href="/intro" className="text-white/70 underline-offset-4 hover:text-gold hover:underline">
            opening film
          </a>
        </p>
        <div className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
          {EXPLORATION.map((e) => (
            <div key={e.style}>
              <span className="block font-mont text-sm text-cream">{e.style}</span>
              <span className="mt-2 flex flex-wrap gap-x-3 gap-y-1 font-mont text-[11px] uppercase tracking-eyebrow text-white/45">
                {e.p1.map((id) => (
                  <a
                    key={id}
                    href={`/explore/p1/${id}`}
                    className="hover:text-gold"
                  >
                    {id}
                  </a>
                ))}
                <a
                  href={`/explore/p2/${e.p2}/a`}
                  className="text-white/70 hover:text-gold"
                >
                  full site →
                </a>
              </span>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-10 font-mont text-[11px] uppercase tracking-eyebrow text-white/35">
        USDOT 7638788 · MC 66389691 · Loganville, GA
      </p>
    </div>
  );
}
