import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Safety & Compliance",
  description: `KUL Enterprises operates under USDOT ${site.usdot} and MC ${site.mc}. Fully licensed and insured, with safety practices that treat compliance as the floor, not the ceiling.`,
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

const stats = [
  { label: "USDOT Number", value: site.usdot },
  { label: "MC Number", value: site.mc },
  { label: "Coverage", value: "Licensed & Insured" },
  { label: "Dispatch", value: "24/7 Communication" },
];

export default function SafetyPage() {
  return (
    <>
      <PageHero
        eyebrow="Safety & Compliance"
        title="Compliance is the floor. Safety is the culture."
        lede="Anyone can print a safety slogan. We would rather show you our numbers, our practices, and where to verify both."
      />

      <section className="border-y border-white/10 bg-charcoal">
        <div className="mx-auto max-w-content px-6 py-12">
          <RevealGroup className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((s) => (
              <RevealItem key={s.label} className="text-center">
                <p className="font-display text-2xl font-bold text-white sm:text-3xl">
                  {s.value}
                </p>
                <p className="mt-2 eyebrow text-graywarm">{s.label}</p>
              </RevealItem>
            ))}
          </RevealGroup>
          <Reveal className="mt-10 text-center">
            <p className="text-sm text-graywarm">
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

      <div className="section-light">
        <div className="mx-auto max-w-content px-6 py-20 md:py-28">
          <Reveal>
            <div className="flex items-center gap-4">
              <span className="gold-rule" />
              <span className="eyebrow text-gold-dim">How we operate</span>
            </div>
            <h2 className="mt-5 max-w-2xl font-display text-display-l font-bold">
              Four pillars, practiced daily.
            </h2>
          </Reveal>

          <RevealGroup className="mt-12 grid gap-px border border-ink/10 bg-ink/10 sm:grid-cols-2">
            {pillars.map((p) => (
              <RevealItem key={p.name} className="bg-paper p-8">
                <h3 className="font-display text-lg font-bold">{p.name}</h3>
                <p className="mt-3 leading-relaxed text-graywarm-deep">{p.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal className="mx-auto mt-20 max-w-measure text-center">
            <p className="text-lg leading-relaxed text-graywarm-deep">
              Our tagline ends with <em>&quot;Driven by Safety&quot;</em> on
              purpose. It is the part everything else depends on. Ship with a
              carrier that treats your freight, and its people, like they
              matter.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/quote" className="btn-gold">
                Request a Quote
              </Link>
              <Link href="/carrier-packet" className="btn-ghost-light">
                Get our Carrier Packet
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </>
  );
}
