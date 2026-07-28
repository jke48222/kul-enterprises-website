import type { Metadata } from "next";
import { CtaBand } from "@/components/v2/CtaBand";
import { Eyebrow } from "@/components/v2/Eyebrow";
import { GhostNumeral } from "@/components/v2/GhostNumeral";
import { LineReveal } from "@/components/v2/LineReveal";
import { PageHero } from "@/components/v2/PageHero";
import { ProcessStrip } from "@/components/v2/ProcessStrip";
import { Rise } from "@/components/v2/Rise";
import { StatBlock } from "@/components/v2/StatBlock";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Safety & Compliance",
  description:
    "Licensed and insured under USDOT 7638788 and MC 66389691. Pre-trip discipline, legal hours, protected cargo, and drivers who go home.",
};

const CONTAINER = "mx-auto w-full max-w-[1760px] px-[clamp(20px,5vw,90px)]";

/**
 * §4.5.3 — Pillars ledger. All copy recomposed from services.json
 * commitments + site.json stories; no new claims.
 */
const pillars = [
  {
    index: "01",
    title: "Pre-trip, every trip",
    body: "Inspections before the wheels turn. Clean, DOT-compliant equipment on every dispatch.",
  },
  {
    index: "02",
    title: "Legal hours",
    body: "Hours-of-service discipline. Speed inside the rules — fast, never reckless.",
  },
  {
    index: "03",
    title: "Weather calls made early",
    body: "And on the side of caution.",
  },
  {
    index: "04",
    title: "Sealed & documented",
    body: "Load bars, straps, and seals; trailer condition documented at pickup and delivery.",
  },
];

/** §4.5.4 — Before every mile (ProcessStrip §3.24, shared with drivers). */
const processSteps = [
  {
    label: "Pre-trip",
    line: "Equipment inspected, setpoints confirmed in writing.",
  },
  {
    label: "In transit",
    line: "Milestone updates at pickup, in transit, and delivery.",
  },
  {
    label: "At delivery",
    line: "Signed, documented, closed out.",
  },
];

export default function SafetyPage() {
  return (
    <>
      {/* 1 — Hero. Gold: none (§4.5.1). */}
      <PageHero
        variant="photo"
        height="60"
        image={{
          src: "/images/stock/driver-in-cab-gold-truck.jpg",
          alt: "A driver at the wheel inside the warm-lit cab of a KUL truck",
        }}
        eyebrow="Safety & Compliance"
        titleLines={["No load", "outranks a life."]}
        deck="The most important delivery on any route is the driver coming home."
      />

      {/* 2 — Credentials document: the paperwork moment. Gold: none. */}
      <section data-ground="paper" className="relative bg-paper py-band-sm">
        <div className={CONTAINER}>
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-[clamp(16px,1.4vw,24px)]">
            <div className="lg:col-span-10 lg:col-start-2">
              <LineReveal
                as="h2"
                lines={["On the record."]}
                className="max-w-[14ch] font-omnibus text-h2 text-ink"
              />
              <div className="mt-14">
                <StatBlock
                  ground="paper"
                  columns={4}
                  facts={[
                    { label: "USDOT", value: site.usdot },
                    { label: "MC", value: site.mc },
                    {
                      label: "Licensed & Insured",
                      value: "Auto liability + cargo",
                    },
                    {
                      label: "Dispatch",
                      value: `24/7 · ${site.phone}`,
                      href: site.phoneHref,
                    },
                  ]}
                />
              </div>
              <Rise delay={0.1}>
                <p className="mt-12 max-w-[62ch] text-body text-graywarm-deep">
                  Verify our authority anytime on the FMCSA SAFER system, and
                  request a certificate of insurance with your company listed
                  as holder.
                </p>
              </Rise>
              <Rise delay={0.2}>
                <a
                  href="https://safer.fmcsa.dot.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-hairline mt-8 inline-block text-label uppercase text-ink"
                >
                  Verify on SAFER{" "}
                  <span aria-hidden className="inline-block">
                    ↗
                  </span>
                </a>
              </Rise>
            </div>
          </div>
        </div>
      </section>

      {/* 3 — Pillars ledger. Gold: the eyebrow (the viewport's 2nd gold). */}
      <section data-ground="ink" className="relative bg-ink py-band">
        <div className={CONTAINER}>
          <Eyebrow gold>Not up for negotiation</Eyebrow>
          <div className="mt-14">
            {pillars.map((pillar) => (
              <Rise
                key={pillar.index}
                className="group relative overflow-hidden border-t border-white/[0.12] py-[clamp(28px,4vh,44px)] last:border-b"
              >
                {/* Ghost numeral behind the row start — decoration, never gold. */}
                <GhostNumeral className="left-0 top-1/2 -translate-y-1/2">
                  {pillar.index}
                </GhostNumeral>
                <div className="relative z-10 grid gap-y-3 md:grid-cols-12 md:gap-x-[clamp(16px,1.4vw,24px)] motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-micro motion-safe:group-hover:translate-x-3 motion-safe:group-hover:duration-[450ms]">
                  <p
                    aria-hidden
                    className="text-micro uppercase tabular-nums text-paper/60 md:col-span-1"
                  >
                    {pillar.index}
                  </p>
                  <h3 className="font-omnibus text-h3 text-cream md:col-span-4">
                    {pillar.title}
                  </h3>
                  <p className="max-w-[52ch] text-[15px] leading-relaxed text-paper/70 md:col-span-6 md:col-start-7">
                    {pillar.body}
                  </p>
                </div>
              </Rise>
            ))}
          </div>
        </div>
      </section>

      {/* 4 — Before every mile: process strip on paper. Gold: none. */}
      <section data-ground="paper" className="relative bg-paper py-band-sm">
        <div className={CONTAINER}>
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-[clamp(16px,1.4vw,24px)]">
            <div className="lg:col-span-10 lg:col-start-2">
              <LineReveal
                as="h2"
                lines={["Before every mile."]}
                className="max-w-[14ch] font-omnibus text-h2 text-ink"
              />
              <div className="mt-14">
                <ProcessStrip ground="paper" steps={processSteps} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5 — Ending: verify CTA band → curtain Footer. Gold: none. */}
      <CtaBand variant="verify" />
    </>
  );
}
