import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AnchorSubnav } from "@/components/v3/AnchorSubnav";
import { CtaBand } from "@/components/v3/CtaBand";
import { Eyebrow } from "@/components/v3/Eyebrow";
import { LineReveal } from "@/components/v3/LineReveal";
import { PageHero } from "@/components/v3/PageHero";
import { QuoteStrip } from "@/components/v3/QuoteStrip";
import { Rise, RiseGroup } from "@/components/v3/Rise";
import { services } from "@/lib/services";

/**
 * SERVICE DETAIL — the Volvo FH16 model-page IA, tailored to freight
 * (16-reference-teardown §Volvo): cinematic hero → anchored sub-nav
 * (Apple/Rolls-Royce device) → light spec/overview → "best for" →
 * commitments → quote strip → next-service handoff. One template,
 * seven static pages.
 */

const BASE = "/v3";
const CONTAINER = "mx-auto w-full max-w-[1760px] px-[clamp(20px,5vw,90px)]";
const GRID = "grid grid-cols-12 gap-x-[clamp(16px,1.4vw,24px)]";

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return {};
  return {
    title: `${service.name} Freight`,
    description: service.short,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = services.findIndex((s) => s.slug === slug);
  const service = services[index];
  if (!service) notFound();

  const next = services[(index + 1) % services.length];

  return (
    <>
      {/* 1 · Hero — cinematic, indexed like a model page. */}
      <PageHero
        variant="photo"
        height="80"
        eyebrow={`Services · ${service.tagline}`}
        titleLines={[service.name]}
        deck={service.short}
        image={service.image}
        index={`${String(index + 1).padStart(2, "0")} / ${String(
          services.length,
        ).padStart(2, "0")}`}
      />

      {/* 2 · Anchored sub-nav — Apple/Rolls-Royce device. */}
      <AnchorSubnav
        title={service.name}
        items={[
          { id: "overview", label: "Overview" },
          { id: "best-for", label: "Best For" },
          { id: "commitments", label: "Commitments" },
          { id: "quote", label: "Quote" },
        ]}
        quoteHref={`${BASE}/quote`}
      />

      {/* 3 · Overview — description + spec card (Volvo light spec block). */}
      <section
        id="overview"
        data-ground="paper"
        className="scroll-mt-28 bg-paper py-band-sm"
      >
        <div className={CONTAINER}>
          <div className={`${GRID} items-start gap-y-12`}>
            <div className="col-span-12 lg:col-start-2 lg:col-end-8">
              <Eyebrow gold>Overview</Eyebrow>
              <LineReveal
                as="h2"
                lines={[service.tagline]}
                className="mt-6 max-w-[18ch] text-d2 text-ink"
              />
              <Rise delay={0.2}>
                <p className="mt-8 max-w-[62ch] text-body-l text-graywarm-deep">
                  {service.description}
                </p>
              </Rise>
            </div>
            {/* Spec card — real facts only. */}
            <Rise className="col-span-12 lg:col-start-9 lg:col-end-12" delay={0.25}>
              <dl className="border border-ink/15 bg-white p-7">
                {[
                  { dt: "Service", dd: service.name },
                  { dt: "Coverage", dd: "Southeast base · nationwide authority" },
                  { dt: "Dispatch", dd: "24/7, one line" },
                  { dt: "Quote turnaround", dd: "Same business day" },
                ].map((row) => (
                  <div
                    key={row.dt}
                    className="flex items-baseline justify-between gap-4 border-t border-ink/10 py-3 first:border-t-0 first:pt-0 last:pb-0"
                  >
                    <dt className="text-micro uppercase text-ink/50">
                      {row.dt}
                    </dt>
                    <dd className="text-right text-[15px] font-medium text-ink">
                      {row.dd}
                    </dd>
                  </div>
                ))}
              </dl>
            </Rise>
          </div>
        </div>
      </section>

      {/* 4 · Best for — the honest fit list. */}
      <section
        id="best-for"
        data-ground="paper"
        className="scroll-mt-28 bg-paper py-band-sm"
      >
        <div className={CONTAINER}>
          <div className={GRID}>
            <div className="col-span-12 lg:col-start-2 lg:col-end-12">
              <Eyebrow>Best For</Eyebrow>
              <LineReveal
                as="h2"
                lines={["Where this service", "earns its keep."]}
                className="mt-6 max-w-[20ch] text-d2 text-ink"
              />
              <RiseGroup className="mt-12 grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
                {service.bestFor.map((item, i) => (
                  <Rise key={item}>
                    <div className="border-t border-ink/15 pt-5">
                      <p className="text-micro uppercase tabular-nums text-ink/40">
                        {String(i + 1).padStart(2, "0")}
                      </p>
                      <p className="mt-3 max-w-[38ch] text-body-l text-ink">
                        {item}
                      </p>
                    </div>
                  </Rise>
                ))}
              </RiseGroup>
            </div>
          </div>
        </div>
      </section>

      {/* 5 · Commitments — ink proof band; what we sign up for. */}
      <section
        id="commitments"
        data-ground="ink"
        className="scroll-mt-28 bg-ink py-band-sm"
      >
        <div className={CONTAINER}>
          <div className={GRID}>
            <div className="col-span-12 lg:col-start-2 lg:col-end-12">
              <Eyebrow>Our Commitments</Eyebrow>
              <LineReveal
                as="h2"
                lines={["What we put", "in writing."]}
                className="mt-6 max-w-[20ch] text-d2 text-paper"
              />
              <RiseGroup className="mt-12 grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
                {service.commitments.map((item, i) => (
                  <Rise key={item}>
                    <div className="border-t border-white/[0.14] pt-5">
                      <p className="text-micro uppercase tabular-nums text-paper/40">
                        {String(i + 1).padStart(2, "0")}
                      </p>
                      <p className="mt-3 max-w-[38ch] text-body-l text-paper/90">
                        {item}
                      </p>
                    </div>
                  </Rise>
                ))}
              </RiseGroup>
            </div>
          </div>
        </div>
      </section>

      {/* 6 · Quote — conversion on the page, contract-exact strip. */}
      <section
        id="quote"
        data-ground="paper"
        className="scroll-mt-28 bg-paper py-band-sm"
      >
        <div className={CONTAINER}>
          <div className={GRID}>
            <div className="col-span-12 lg:col-start-2 lg:col-end-12">
              <QuoteStrip
                ground="paper"
                heading={`Price a ${service.name} lane.`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 7 · Next service — model-page carousel ending. */}
      <CtaBand
        variant="next"
        next={{
          label: next.name,
          href: `${BASE}/services/${next.slug}`,
          image: next.image,
        }}
      />
    </>
  );
}
