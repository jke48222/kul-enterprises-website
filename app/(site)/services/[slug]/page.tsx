import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/motion/Reveal";
import { services, serviceImages } from "@/lib/services";
import { site } from "@/lib/site";
import PageClosing from "@/components/concept/PageClosing";

/**
 * One dedicated page per freight type (07-design-research: each service is
 * its own search landing page). Prerendered for all seven slugs.
 */

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
  const image = serviceImages[service.slug];
  const prev = services[(idx + services.length - 1) % services.length];
  const next = services[(idx + 1) % services.length];

  return (
    <>
      <section className="relative min-h-[70svh] overflow-hidden">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority
          quality={82}
          sizes="100vw"
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(22,22,22,0.5),transparent_45%,rgba(22,22,22,0.92))]"
        />
        <div className="kul-fade-slow relative px-6 pt-[15vh] text-center">
          <h1 className="kul-grad-text font-mont text-[clamp(1.35rem,2.3vw,2.05rem)] font-semibold uppercase tracking-[0.3em] [text-shadow:none]">
            {service.name}
          </h1>
          <p className="mt-4 font-mont text-[11px] font-semibold uppercase tracking-[0.3em] text-cream">
            {service.tagline}
          </p>
        </div>
      </section>

      <section className="bg-ink2">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <Reveal>
            <div className="grid gap-8 md:grid-cols-[80px_1fr] md:gap-10">
              <span className="font-mont text-sm font-semibold tracking-[0.2em] text-gold">
                {String(idx + 1).padStart(2, "0")} / {String(services.length).padStart(2, "0")}
              </span>
              <div>
                <p className="max-w-2xl text-lg leading-relaxed text-graywarm-light">
                  {service.description}
                </p>
                <div className="mt-10 grid gap-10 md:grid-cols-2">
                  <div>
                    <h2 className="font-mont text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">
                      Best for
                    </h2>
                    <ul className="mt-4 space-y-2.5">
                      {service.bestFor.map((item) => (
                        <li
                          key={item}
                          className="flex gap-3 text-sm leading-relaxed text-graywarm-light"
                        >
                          <span
                            aria-hidden
                            className="mt-2 h-1 w-1 shrink-0 rotate-45 bg-gold"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h2 className="font-mont text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">
                      Our commitments
                    </h2>
                    <ul className="mt-4 space-y-2.5">
                      {service.commitments.map((item) => (
                        <li
                          key={item}
                          className="flex gap-3 text-sm leading-relaxed text-graywarm-light"
                        >
                          <span
                            aria-hidden
                            className="mt-2 h-1 w-1 shrink-0 rotate-45 bg-gold"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-12 flex flex-wrap items-center gap-6">
                  <Link
                    href="/quote"
                    className="inline-flex items-center rounded-[100px] bg-gold px-8 py-3 text-xs font-bold uppercase tracking-[3px] text-ink transition-colors hover:bg-gold-soft"
                  >
                    Request a Freight Quote
                  </Link>
                  <p className="text-sm text-graywarm-light">
                    Time-critical?{" "}
                    <a
                      href={site.phoneHref}
                      className="font-semibold text-cream underline-offset-4 hover:underline"
                    >
                      Call {site.phone}
                    </a>
                    . Dispatch answers 24/7.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Neighboring services keep the visitor exploring. */}
          <Reveal className="mt-16 border-t border-white/10 pt-8">
            <nav
              aria-label="More services"
              className="flex flex-wrap items-center justify-between gap-4 text-sm"
            >
              <Link
                href={`/services/${prev.slug}`}
                className="text-graywarm-light transition-colors hover:text-gold-soft"
              >
                ← {prev.name}
              </Link>
              <Link
                href="/services"
                className="font-semibold uppercase tracking-[0.2em] text-cream transition-colors hover:text-gold-soft"
              >
                All Services
              </Link>
              <Link
                href={`/services/${next.slug}`}
                className="text-graywarm-light transition-colors hover:text-gold-soft"
              >
                {next.name} →
              </Link>
            </nav>
          </Reveal>
        </div>
      </section>

      <PageClosing />
    </>
  );
}
