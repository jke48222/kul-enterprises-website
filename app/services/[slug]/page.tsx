import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { site } from "@/lib/site";
import { services } from "@/lib/services";
import Reveal from "@/components/k/Reveal";

/**
 * ONE PAGE PER FREIGHT SERVICE
 *
 * This single file produces all seven service pages: Power Only, Dry Van,
 * Reefer, Dedicated, Regional, Expedited and Over the Road. Next.js builds
 * one page per entry in content/services.json.
 *
 * TO CHANGE THE WORDS on any service page, edit content/services.json. To add
 * an eighth service, add an entry to that file and its page appears by itself.
 *
 * The page runs in this order: name and description over a full width
 * photograph, what the service suits, what KUL commits to, the measured
 * drawing of the truck, and links to the service before and after this one.
 */

type PageProps = {
  params: Promise<{ slug: string }>;
};

/** Tells Next.js which seven addresses to build. */
export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return {};

  return {
    title: `${service.name} Freight Service`,
    description: `${service.short} ${service.name} freight from KUL Enterprises, a licensed carrier based in ${site.location}. USDOT ${site.usdot}.`,
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const index = services.findIndex((s) => s.slug === slug);
  const service = services[index];

  // An address that does not match a service shows the not found page.
  if (!service) notFound();

  const previous = services[(index - 1 + services.length) % services.length];
  const next = services[(index + 1) % services.length];

  // The drawing prints the letters A to F beside the truck. The table below
  // repeats them in two columns, so A sits beside B, C beside D, and so on.
  const leftColumn = service.dimensions.filter((_, i) => i % 2 === 0);
  const rightColumn = service.dimensions.filter((_, i) => i % 2 === 1);

  return (
    <>
      {/* Name and description, set over a full width photograph. */}
      <section className="bg-k-paper px-6 pb-16 pt-32 md:px-12 lg:px-24">
        <div className="relative mx-auto max-w-[1248px] overflow-hidden rounded-3xl">
          <Image
            src={service.wide}
            alt={`${service.name} freight, KUL Enterprises`}
            width={1600}
            height={900}
            className="h-[640px] w-full object-cover"
            priority
          />
          {/* Darkens the photograph from the left so the words stay legible
              whichever picture sits behind them. */}
          <div
            className="absolute inset-0 bg-[linear-gradient(100deg,rgba(0,0,0,0.86)_0%,rgba(0,0,0,0.66)_38%,rgba(0,0,0,0.18)_72%,rgba(0,0,0,0.38)_100%)]"
            aria-hidden="true"
          />
          {/* Three groups spaced evenly down the picture: the breadcrumb, the
              name and description, then the two buttons. */}
          <div className="absolute inset-0 flex flex-col justify-evenly p-10 md:p-14">
            <div className="flex flex-col gap-5">
              <p className="flex items-center gap-2">
                <Link
                  href="/services"
                  className="font-text text-k-micro uppercase text-k-on-dark-soft"
                >
                  Services
                </Link>
                <span className="font-text text-k-micro text-k-on-dark-faint">
                  /
                </span>
                <span className="font-text text-k-micro uppercase text-k-gold-lit">
                  {service.name}
                </span>
              </p>
              <h1 className="font-display text-k-d1 font-black text-k-on-dark">
                {service.name}
              </h1>
              <p className="max-w-[520px] font-text text-k-lede text-k-on-dark-soft">
                {service.description}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/quote"
                className="rounded-full bg-k-on-dark px-8 py-4 font-text text-k-label uppercase text-k-ink transition-opacity duration-200 hover:opacity-85"
              >
                Quote this service
              </Link>
              <a
                href={site.phoneHref}
                className="rounded-full border border-k-on-dark-faint px-8 py-4 font-text text-k-label uppercase text-k-on-dark transition-colors duration-200 hover:border-k-on-dark"
              >
                Call dispatch
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* What it suits, and what we promise. */}
      <section className="bg-k-paper px-6 py-28 md:px-12 lg:px-24">
        <div className="mx-auto flex max-w-[1248px] flex-col gap-16 lg:flex-row lg:gap-24">
          {[
            { label: "Best for", items: service.bestFor },
            { label: "What we commit to", items: service.commitments },
          ].map((block) => (
            <Reveal key={block.label} className="flex flex-1 flex-col gap-6">
              <p className="flex items-center gap-4">
                <span
                  className="h-px w-12 shrink-0 bg-k-gold"
                  aria-hidden="true"
                />
                <span className="font-text text-k-label uppercase text-k-gold">
                  {block.label}
                </span>
              </p>
              <ul className="flex flex-col border-t border-k-rule-strong">
                {block.items.map((item) => (
                  <li
                    key={item}
                    className="border-b border-k-rule py-4 font-text text-k-body text-k-ink last:border-b-0"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>

      {/* The measured drawing. */}
      <section className="bg-k-blueprint px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto flex max-w-[1248px] flex-col">
          <h2 className="pb-14 text-center font-display text-k-d3 font-black text-k-on-dark">
            Size it up
          </h2>

          <div className="flex flex-col items-center justify-center gap-10 pb-16 lg:flex-row lg:gap-14">
            <div className="relative flex w-[238px] shrink-0 items-center justify-center">
              <Image
                src="/images/truck/wire/front.webp"
                alt="Front elevation of the tractor and trailer"
                width={1182}
                height={1548}
                className="h-auto w-full opacity-90"
              />
              <span className="absolute left-0 top-1/2 font-text text-k-micro uppercase text-k-on-dark-soft">
                A
              </span>
              <span className="absolute left-1/2 top-0 font-text text-k-micro uppercase text-k-on-dark-soft">
                B
              </span>
            </div>

            <div className="relative flex flex-1 items-center justify-center">
              <Image
                src="/images/truck/wire/side.webp"
                alt="Side elevation of the tractor and trailer"
                width={1600}
                height={456}
                className="h-auto w-full opacity-90"
              />
              <span className="absolute left-1/2 top-2 font-text text-k-micro uppercase text-k-on-dark-soft">
                D
              </span>
              <span className="absolute bottom-2 left-1/2 font-text text-k-micro uppercase text-k-on-dark-soft">
                C
              </span>
              <span className="absolute bottom-8 left-[12%] font-text text-k-micro uppercase text-k-on-dark-soft">
                E
              </span>
              <span className="absolute bottom-8 right-2 font-text text-k-micro uppercase text-k-on-dark-soft">
                F
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-0 border-t border-k-rule-dark pt-2 lg:flex-row lg:gap-16">
            {[leftColumn, rightColumn].map((column, ci) => (
              <div key={ci} className="flex flex-1 flex-col">
                {column.map((dim) => (
                  <div
                    key={dim.ref}
                    className="flex items-center justify-between border-b border-k-rule-dark py-3.5 last:border-b-0"
                  >
                    <span className="font-text text-k-small text-k-on-dark-soft">
                      {dim.ref}. {dim.label}
                    </span>
                    <span className="font-text text-k-small font-medium tabular-nums text-k-on-dark">
                      {dim.value}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <p className="pt-6 font-text text-k-micro uppercase text-k-on-dark-faint">
            Dimensions are nominal for a standard 53 foot van. Confirm at
            booking.
          </p>
        </div>
      </section>

      {/* Links to the service before and after this one. */}
      <nav
        aria-label="Other services"
        className="flex flex-col border-t border-k-rule bg-k-surface sm:flex-row"
      >
        <Link
          href={`/services/${previous.slug}`}
          className="flex flex-1 flex-col gap-2 border-b border-k-rule px-6 py-10 transition-colors duration-200 hover:bg-k-paper sm:border-b-0 sm:border-r md:px-12 lg:px-24"
        >
          <span className="font-text text-k-micro uppercase text-k-ink-faint">
            Previous
          </span>
          <span className="font-display text-k-d3 font-black text-k-ink">
            {previous.name}
          </span>
        </Link>
        <Link
          href={`/services/${next.slug}`}
          className="flex flex-1 flex-col items-end gap-2 px-6 py-10 transition-colors duration-200 hover:bg-k-paper md:px-12 lg:px-24"
        >
          <span className="font-text text-k-micro uppercase text-k-ink-faint">
            Next
          </span>
          <span className="font-display text-k-d3 font-black text-k-ink">
            {next.name}
          </span>
        </Link>
      </nav>
    </>
  );
}
