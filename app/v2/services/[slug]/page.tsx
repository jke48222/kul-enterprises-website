import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/v2/CtaBand";
import { Eyebrow } from "@/components/v2/Eyebrow";
import { GhostNumeral } from "@/components/v2/GhostNumeral";
import { PageHero } from "@/components/v2/PageHero";
import { Rise, RiseGroup } from "@/components/v2/Rise";
import { StatBlock } from "@/components/v2/StatBlock";
import { services } from "@/lib/services";
import { site } from "@/lib/site";

/**
 * Service detail — §4.4. One dedicated page per freight type (each service
 * is its own search landing page). Prerendered for all seven slugs; the
 * what/how/proof structure comes straight from services.json. Near-zero-gold
 * page: the overview eyebrow is the single gold spend beyond the chrome CTA.
 */

const CONTAINER = "mx-auto w-full max-w-[1760px] px-[clamp(20px,5vw,90px)]";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

// Unknown slugs get the fully prerendered 404 page at the routing layer
// (a runtime notFound() here streams an empty shell to no-JS visitors).
export const dynamicParams = false;

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
    description: `${service.short} ${site.serviceArea}. USDOT ${site.usdot}.`,
  };
}

export default async function ServiceDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const idx = services.findIndex((s) => s.slug === slug);
  if (idx === -1) notFound();
  const service = services[idx];
  const prev = services[(idx + services.length - 1) % services.length];
  const next = services[(idx + 1) % services.length];
  const num = String(idx + 1).padStart(2, "0");

  return (
    <>
      {/* 1 — Hero. PageHero declares its own data-ground="ink". Gold: none. */}
      <PageHero
        variant="photo"
        height="60"
        image={service.image}
        eyebrow={`Service ${idx + 1} of 7`}
        index={`${num} / 07`}
        titleLines={[service.name]}
        deck={service.tagline}
      />

      {/* 2 — Overview deck. Gold: the eyebrow (this viewport's 2nd gold). */}
      <section data-ground="paper" className="bg-paper py-band">
        <div
          className={`${CONTAINER} grid grid-cols-1 gap-x-[clamp(16px,1.4vw,24px)] lg:grid-cols-12`}
        >
          <div className="lg:col-start-2 lg:col-end-10">
            <Eyebrow gold>{service.tagline}</Eyebrow>
            <Rise delay={0.15}>
              <p className="mt-8 max-w-[62ch] font-mont text-[clamp(1.25rem,1.05rem+1vw,1.75rem)] font-normal leading-relaxed text-graywarm-deep">
                {service.description}
              </p>
            </Rise>
          </div>
        </div>
      </section>

      {/* 3 — Fit & commitments ledger. Ink. Gold: none. */}
      <section
        data-ground="ink"
        className="relative overflow-hidden bg-ink py-band"
      >
        <GhostNumeral className="left-[clamp(20px,5vw,90px)] top-8">
          {num}
        </GhostNumeral>
        <div
          className={`relative z-10 ${CONTAINER} grid grid-cols-1 gap-x-[clamp(16px,1.4vw,24px)] gap-y-16 md:grid-cols-2`}
        >
          <div>
            <h2 className="text-micro uppercase text-paper/60">Best for</h2>
            <RiseGroup className="mt-8">
              {service.bestFor.map((item) => (
                <Rise
                  key={item}
                  as="p"
                  className="border-t border-white/[0.12] py-5 font-mont text-[15px] leading-relaxed text-paper/70"
                >
                  {item}
                </Rise>
              ))}
            </RiseGroup>
          </div>
          <div>
            <h2 className="text-micro uppercase text-paper/60">
              Our commitments
            </h2>
            <RiseGroup className="mt-8">
              {service.commitments.map((item) => (
                <Rise
                  key={item}
                  as="p"
                  className="border-t border-white/[0.12] py-5 font-mont text-[15px] leading-relaxed text-paper/70"
                >
                  {item}
                </Rise>
              ))}
            </RiseGroup>
          </div>
        </div>
      </section>

      {/* 4 — Proof strip: the paperwork moment. Gold: none. */}
      <section data-ground="paper" className="bg-paper py-band-sm">
        <div className={CONTAINER}>
          <StatBlock
            ground="paper"
            columns={3}
            facts={[
              { label: "USDOT", value: site.usdot },
              { label: "MC", value: site.mc },
              { label: "Quotes", value: "Same business day" },
            ]}
          />
          <Rise delay={0.15}>
            <p className="mt-12 text-micro uppercase text-graywarm-deep">
              Time-critical? Call dispatch 24/7 —{" "}
              <a
                href={site.phoneHref}
                className="link-hairline tabular-nums text-ink/80"
              >
                {site.phone}
              </a>
            </p>
          </Rise>
          {/* Slim previous-service link, above the circular "next" ending. */}
          <Rise delay={0.2}>
            <p className="mt-12 flex justify-end text-micro uppercase">
              <Link
                href={`/v2/services/${prev.slug}`}
                className="link-hairline text-ink/60"
              >
                Previous: {prev.name}
              </Link>
            </p>
          </Rise>
        </div>
      </section>

      {/* 5 — Ending: circular next-service band. Gold: none. */}
      <CtaBand
        variant="next"
        next={{
          label: next.name,
          href: `/services/${next.slug}`,
          image: next.image,
        }}
      />
    </>
  );
}
