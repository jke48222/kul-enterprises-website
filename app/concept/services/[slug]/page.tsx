import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/layout/PageHero";
import ServiceIcon from "@/components/ServiceIcon";
import { Reveal } from "@/components/motion/Reveal";
import { services, getService } from "@/lib/services";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const service = getService((await params).slug);
  if (!service) return {};
  return {
    title: `${service.name} Freight Service`,
    description: `${service.short} ${service.tagline} KUL Enterprises. Southeast based, nationwide service.`,
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const service = getService((await params).slug);
  if (!service) notFound();

  const others = services.filter((s) => s.slug !== service.slug);

  return (
    <>
      <PageHero
        eyebrow={`Services · ${service.name}`}
        title={service.tagline}
        lede={service.short}
      />

      <div className="section-light">
        <div className="mx-auto max-w-content px-6 py-20 md:py-28">
          <div className="grid gap-16 lg:grid-cols-[1fr_380px]">
            <Reveal>
              <ServiceIcon slug={service.slug} className="h-14 w-14 text-gold-dim" />
              <h2 className="mt-6 font-display text-h2 font-bold">
                {service.name} with KUL
              </h2>
              <p className="mt-6 max-w-measure text-lg leading-relaxed text-graywarm-deep">
                {service.description}
              </p>

              <h3 className="mt-12 font-display text-lg font-bold">
                Best fit for
              </h3>
              <ul className="mt-4 space-y-3">
                {service.bestFor.map((item) => (
                  <li key={item} className="flex gap-3 text-graywarm-deep">
                    <span
                      aria-hidden
                      className="mt-2.5 h-1 w-1 shrink-0 rotate-45 bg-gold-dim"
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <h3 className="mt-12 font-display text-lg font-bold">
                What we commit to
              </h3>
              <ul className="mt-4 space-y-3">
                {service.commitments.map((item) => (
                  <li key={item} className="flex gap-3 text-graywarm-deep">
                    <span
                      aria-hidden
                      className="mt-2.5 h-1 w-1 shrink-0 rotate-45 bg-gold-dim"
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-12 flex flex-col gap-4 sm:flex-row">
                <Link href="/concept/quote" className="btn-gold">
                  Quote a {service.name} load
                </Link>
                <Link href="/concept/contact" className="btn-ghost-light">
                  Ask a question first
                </Link>
              </div>
            </Reveal>

            {/* Other services rail */}
            <Reveal>
              <div className="border border-ink/10 bg-white p-7">
                <h3 className="eyebrow text-gold-dim">Other services</h3>
                <ul className="mt-5 space-y-3.5">
                  {others.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/concept/services/${s.slug}`}
                        className="group flex items-center justify-between gap-4 text-sm font-medium text-ink transition-colors hover:text-gold-dim"
                      >
                        {s.name}
                        <span
                          aria-hidden
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        >
                          →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </>
  );
}
