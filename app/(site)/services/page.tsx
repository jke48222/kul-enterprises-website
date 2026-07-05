import type { Metadata } from "next";
import { CtaBand } from "@/components/v2/CtaBand";
import { Eyebrow } from "@/components/v2/Eyebrow";
import { LineReveal } from "@/components/v2/LineReveal";
import { PageHero } from "@/components/v2/PageHero";
import { QuoteStrip } from "@/components/v2/QuoteStrip";
import { Rise, RiseGroup } from "@/components/v2/Rise";
import { SectionRule } from "@/components/v2/SectionRule";
import { ServiceIndex } from "@/components/v2/ServiceIndex";
import { services } from "@/lib/services";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Power Only, Dry Van, Reefer, Dedicated, Regional, Expedited, and Over-the-Road freight. Southeast based with nationwide authority. USDOT 7638788.",
};

const CONTAINER = "mx-auto w-full max-w-[1760px] px-[clamp(20px,5vw,90px)]";

/**
 * The standard columns — §4.3.3. Recomposed from services.json commitments
 * + faq voice; no new claims. Heads render as h3 (page order: h1 hero →
 * h2 "Different freight." → these h3s — no level skips, §2.1).
 */
const STANDARD = [
  {
    head: "Confirmed in writing",
    body: "Rates, appointments, and trailer condition — documented, not assumed.",
  },
  {
    head: "One dispatch line",
    body: "One call gets an answer, 24/7.",
    phone: true,
  },
  {
    head: "Proactive ETAs",
    body: "If anything changes in transit, you hear it from us first.",
  },
] as const;

export default function ServicesPage() {
  return (
    <>
      {/* 1 · Hero — split editorial on ink (§4.3.1). PageHero renders its own section. */}
      <PageHero
        variant="split"
        eyebrow="Services"
        titleLines={["SEVEN WAYS", "TO MOVE", "FREIGHT."]}
        deck="Seven ways to move full truckloads, one standard behind all of them: straight answers, clean equipment, deadlines that hold."
        image={{
          src: "/images/stock/hero-semi-truck-dusk-mountains.jpg",
          alt: "A tractor-trailer crossing a mountain road at dusk",
        }}
        chip={{
          src: "/images/stock/road-night-light-trails.jpg",
          alt: "Highway light trails at night",
        }}
      />

      {/* 2 · Service index — ServiceIndex renders its OWN paper section (§3.14). */}
      <ServiceIndex services={services} />

      {/* 3 · The standard — ink (§4.3.3). Gold: the eyebrow. */}
      <section data-ground="ink" className="relative bg-ink py-band">
        <div className={CONTAINER}>
          <Eyebrow gold>Every load</Eyebrow>
          <LineReveal
            as="h2"
            lines={["Different freight.", "Same discipline."]}
            className="mt-6 max-w-[14ch] font-omnibus text-h2 text-cream"
          />
          <RiseGroup className="mt-16 grid grid-cols-1 gap-x-[clamp(16px,1.4vw,24px)] gap-y-10 md:grid-cols-3">
            {STANDARD.map((col) => (
              <Rise key={col.head} className="border-t border-white/[0.12] pt-6">
                <h3 className="text-label uppercase text-paper">{col.head}</h3>
                <p className="mt-4 max-w-[36ch] text-[15px] leading-relaxed text-paper/70">
                  {col.body}
                  {"phone" in col && col.phone && (
                    <>
                      {" "}
                      <a
                        href={site.phoneHref}
                        className="link-hairline tabular-nums text-paper/80"
                      >
                        {site.phone}
                      </a>
                      .
                    </>
                  )}
                </p>
              </Rise>
            ))}
          </RiseGroup>
        </div>
      </section>

      {/* 4 · Quote strip — paper (§4.3.4). Plain SectionRule above, NOT a
          BirdMark (it would collide with the strip's gold submit in one
          viewport). Gold: the strip's circular submit. */}
      <section data-ground="paper" className="relative bg-paper py-band-sm">
        <div className={CONTAINER}>
          <SectionRule ground="paper" />
          <div className="mt-[clamp(2.5rem,2rem+2vw,4rem)]">
            <QuoteStrip
              ground="paper"
              heading="Send the lane. Same business day."
            />
          </div>
        </div>
      </section>

      {/* 5 · Ending — broker packet (§4.3.5). Ghost CTA, no gold. */}
      <CtaBand variant="packet" />
    </>
  );
}
