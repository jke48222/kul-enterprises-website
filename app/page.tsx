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
      <div className="mt-12 grid w-full max-w-4xl gap-4 sm:grid-cols-3">
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
      <p className="mt-10 font-mont text-[11px] uppercase tracking-eyebrow text-white/35">
        USDOT 7638788 · MC 66389691 · Loganville, GA
      </p>
    </div>
  );
}
