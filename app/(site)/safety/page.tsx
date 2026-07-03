import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { site } from "@/lib/site";
import PageClosing from "@/components/concept/PageClosing";

export const metadata: Metadata = {
  title: "Safety & Compliance",
  description:
    "Licensed and insured under USDOT 7638788 and MC 66389691. Pre-trip discipline, legal hours, protected cargo, and drivers who go home.",
};

const pillars = [
  {
    name: "Compliance, verified",
    body: "Full operating authority, active insurance, and clean paperwork, maintained continuously instead of scrambled together for audits. Our USDOT and MC numbers are public because we want you to check them.",
  },
  {
    name: "Equipment that's ready",
    body: "Pre-trip and post-trip inspections on every dispatch and preventive maintenance on schedule. No load moves on equipment we wouldn't put our own name behind, and our name is on all of it.",
  },
  {
    name: "Drivers who go home",
    body: "Hours-of-service compliance without games, honest transit times quoted up front, and a standing rule: when weather or fatigue says stop, we stop. No load outranks a life.",
  },
  {
    name: "Cargo, protected",
    body: "Proper securement, seal protocols, and temperature discipline on refrigerated freight. Your cargo is a promise we signed, and we treat it that way.",
  },
];

export default function ConceptSafety() {
  return (
    <>
      <section className="relative min-h-[70svh] overflow-hidden">
        <Image
          src="/images/photos/desert-rock-formation.jpg"
          alt="Sculpted rock formations standing over quiet sand at dusk"
          fill
          priority
          quality={82}
          sizes="100vw"
          className="object-cover"
        />
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(22,22,22,0.5),transparent_45%,rgba(22,22,22,0.92))]" />
        <div className="kul-fade-slow relative px-6 pt-[15vh] text-center">
          <h1 className="kul-grad-text font-mont text-[clamp(1.35rem,2.3vw,2.05rem)] font-semibold uppercase tracking-[0.3em] [text-shadow:none]">
            Safety &amp; Compliance
          </h1>
        </div>
      </section>

      <section className="bg-[linear-gradient(90deg,#161616_0%,#2E2E2E_100%)]">
        <div className="mx-auto max-w-6xl px-6 py-12 text-center">
          <Reveal>
            <ul className="grid grid-cols-2 gap-8 lg:grid-cols-4">
              {[
                ["USDOT Number", site.usdot],
                ["MC Number", site.mc],
                ["Coverage", "Licensed & Insured"],
                ["Dispatch", "24/7 Communication"],
              ].map(([label, value]) => (
                <li key={label}>
                  <p className="font-omnibus text-xl text-cream sm:text-2xl">{value}</p>
                  <p className="mt-2 font-mont text-[11px] font-semibold uppercase tracking-[0.25em] text-graywarm-light">
                    {label}
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-10 text-sm text-graywarm-light">
              Verify our authority anytime on the FMCSA&apos;s public SAFER
              system at{" "}
              <a
                href="https://safer.fmcsa.dot.gov/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-graywarm-light underline underline-offset-4 transition-colors hover:text-gold"
              >
                safer.fmcsa.dot.gov
              </a>
              . We encourage it.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-ink2">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <Reveal>
            <h2 className="kul-grad-text font-omnibus text-[clamp(1.8rem,3vw,2.3rem)] leading-tight">
              Four pillars, practiced daily
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2">
            {pillars.map((p) => (
              <Reveal key={p.name} className="bg-ink2 p-8">
                <h3 className="font-omnibus text-xl text-cream">{p.name}</h3>
                <p className="mt-3 leading-relaxed text-graywarm-light">{p.body}</p>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-14 text-center">
            <Link
              href="/carrier-packet"
              className="inline-flex items-center rounded-[100px] border border-gold/60 px-8 py-3 text-xs font-semibold uppercase tracking-[3px] text-gold transition-colors hover:bg-gold hover:text-ink"
            >
              Get Our Carrier Packet
            </Link>
          </Reveal>
        </div>
      </section>

      <PageClosing />
    </>
  );
}
