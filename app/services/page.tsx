import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { services } from "@/lib/services";
import ServiceCarousel from "@/components/k/ServiceCarousel";
import Reveal from "@/components/k/Reveal";

/**
 * SERVICES PAGE
 *
 * Lists all seven freight services so a shipper can pick the right one
 * quickly. Built from the Paper artboard "Services, desktop 1440".
 *
 * TO CHANGE THE WORDS on any service, edit content/services.json. Nothing on
 * this page is typed in directly; it all comes from that file, so the client
 * can edit it through the CMS without touching code.
 *
 * The page runs in this order: title, photograph carousel, comparison table,
 * how a load moves, three services explained at length, and a closing call
 * to action.
 */

export const metadata: Metadata = {
  title: "Freight Services",
  description:
    "Power Only, Dry Van, Reefer, Dedicated, Regional, Expedited and Over the Road freight services from KUL Enterprises. Licensed carrier based in Loganville, Georgia, authorised in 48 states.",
};

/** The three services explained at length lower down the page. */
const EXPANDED = ["power-only", "reefer", "dedicated"] as const;

/** A longer explanation for each of the three services above. */
const EXPANDED_COPY: Record<string, { heading: string; body: string }> = {
  "power-only": {
    heading: "Power Only keeps your trailers moving",
    body: "If you own trailers and need tractive power, KUL supplies the tractor and a CDL driver on your schedule. Drop and hook keeps dwell time low, and the driver reports in before pickup rather than after.",
  },
  reefer: {
    heading: "Reefer freight with the set point logged",
    body: "Temperature controlled loads run on a recorded set point from pickup to delivery. Produce, chilled food and pharmaceuticals move under a cold chain you can audit after the fact.",
  },
  dedicated: {
    heading: "Dedicated capacity on a lane you run weekly",
    body: "Committed equipment on a fixed schedule, with one driver who learns the route, the dock and the receiver. Dedicated freight is contracted rather than quoted load by load.",
  },
};

const STEPS = [
  {
    n: "01",
    name: "Enquiry",
    body: "Call dispatch, or send origin, destination, freight type and pickup date. Five fields.",
  },
  {
    n: "02",
    name: "Quote",
    body: "A real number, usually the same day. If the lane does not suit us, we say so then.",
  },
  {
    n: "03",
    name: "Dispatch",
    body: "You get the route, the timing and the driver before the wheels turn.",
  },
  {
    n: "04",
    name: "Delivery",
    body: "Updates on the way, proof on arrival, one phone number throughout.",
  },
] as const;

export default function ServicesPage() {
  // Every service appears in the comparison row.
  const compared = services;

  return (
    <>
      {/* Title row. */}
      <section className="bg-k-paper px-6 pt-36 md:px-12 lg:px-24">
        <div className="mx-auto max-w-[1248px]">
          <p className="flex items-center gap-2 pb-5">
            <span className="font-text text-k-micro uppercase text-k-ink-faint">
              KUL
            </span>
            <span className="font-text text-k-micro text-k-ink-faint">/</span>
            <span className="font-text text-k-micro uppercase text-k-gold">
              Services
            </span>
          </p>
          <div className="flex flex-col gap-6 border-b border-k-rule pb-6 lg:flex-row lg:items-end lg:justify-between">
            <h1 className="font-display text-k-d1 font-black text-k-ink">
              Services
            </h1>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-1 pb-2.5">
              <p className="font-text text-k-small text-k-ink-soft">
                Serving{" "}
                <span className="border-b border-k-gold text-k-ink">
                  {site.city}, {site.state} 30052
                </span>{" "}
                and 48 states
              </p>
              <p className="font-text text-k-small text-k-ink-soft">
                {services.length} services
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Photograph carousel. */}
      <section className="bg-k-paper">
        <ServiceCarousel services={services} />
      </section>

      {/* Comparison table. Every service, scrolled sideways. */}
      <section className="bg-k-surface px-6 py-28 md:px-12 lg:px-24">
        <div className="mx-auto flex max-w-[1248px] flex-col gap-10">
          <Reveal className="flex flex-col items-center gap-3.5">
            <h2 className="max-w-[700px] text-center font-display text-k-d2 font-black text-k-ink">
              Find the service that fits your lane
            </h2>
            <p className="max-w-[660px] text-center font-text text-k-small text-k-ink-soft">
              All {services.length} services. Scroll sideways to compare. If
              none of them obviously fits, describe the load and we will tell
              you which one does, including when the answer is that KUL is not
              the right carrier for it.
            </p>
          </Reveal>

          {/* All seven sit in one row that scrolls sideways, so no service
              gets squeezed narrower than it can be read.

              The scroll-pl values below are what keep the first service, Power
              Only, from sitting hard against the left edge of the screen. The
              row snaps each service into place as you drag it, and without
              these the snap would pull that first card past the page margin.
              They must always match the px values on the same line. */}
          <div className="-mx-6 flex snap-x snap-mandatory scroll-pl-6 overflow-x-auto border-t border-k-rule-strong px-6 md:-mx-12 md:scroll-pl-12 md:px-12 lg:-mx-24 lg:scroll-pl-24 lg:px-24 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {compared.map((service, i) => (
              <div
                key={service.slug}
                className={`flex w-[286px] shrink-0 snap-start flex-col pt-7 ${
                  i < compared.length - 1 ? "mr-6 border-r border-k-rule pr-6" : ""
                }`}
              >
                <h3 className="font-display text-k-d3 font-black text-k-ink">
                  {service.name}
                </h3>
                <p className="pt-1.5 font-text text-k-small text-k-ink-soft">
                  {service.leadTime === "By contract"
                    ? "By contract"
                    : `Lead time ${service.leadTime}`}
                </p>

                <div className="flex items-center gap-2 pb-5 pt-4">
                  <Link
                    href="/quote"
                    className="rounded-full bg-k-ink px-4 py-2.5 font-text text-k-micro uppercase text-k-paper transition-opacity duration-200 hover:opacity-85"
                  >
                    Get a quote
                  </Link>
                  <Link
                    href={`/services/${service.slug}`}
                    className="border-b border-k-gold pb-0.5 font-text text-k-micro uppercase text-k-ink"
                  >
                    Details
                  </Link>
                </div>

                <p className="pb-6 font-text text-k-small text-k-ink-soft">
                  {service.short}
                </p>

                {[
                  {
                    label: "Equipment",
                    value: service.equipment,
                    note: service.equipmentNote,
                  },
                  {
                    label: "Typical lane",
                    value: service.lane,
                    note: service.laneNote,
                  },
                  {
                    label: "Best for",
                    value: service.bestForShort,
                    note: null,
                  },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex flex-col gap-1 border-t border-k-rule py-4"
                  >
                    <p className="font-text text-k-micro uppercase text-k-ink-faint">
                      {row.label}
                    </p>
                    <p className="font-text text-k-body font-medium text-k-ink">
                      {row.value}
                    </p>
                    {row.note ? (
                      <p className="font-text text-k-small text-k-ink-soft">
                        {row.note}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How a load moves. */}
      <section
        className="px-6 py-32 md:px-12 lg:px-24"
        style={{ backgroundColor: "#FDC63E17" }}
      >
        <div className="mx-auto flex max-w-[1248px] flex-col gap-16">
          <Reveal className="mx-auto flex max-w-[42ch] flex-col items-center gap-4 text-center">
            <p className="font-text text-k-label uppercase text-k-gold">
              How a load moves
            </p>
            <h2 className="font-display text-k-d2 font-black text-k-ink">
              Four steps, no surprises
            </h2>
            <p className="font-text text-k-lede text-k-ink-soft">
              Five fields in, one phone number throughout.
            </p>
          </Reveal>

          {/*
           * The four steps read as one route rather than four cards: a single
           * unbroken rail with a mark at each step, running across at lg and
           * down the left below it.
           *
           * The grid has NO gap on purpose. The rail has to cross from one
           * step to the next without breaking, so the breathing room is
           * padding inside each step rather than a gap the line would have to
           * jump. Adding gap-x or gap-y here will cut the line into pieces.
           */}
          <div className="grid grid-cols-1 lg:grid-cols-4">
            {STEPS.map((step, i) => {
              const last = i === STEPS.length - 1;
              return (
                <Reveal
                  key={step.n}
                  index={i}
                  className={`relative flex gap-5 lg:flex-col lg:gap-0 ${
                    last ? "" : "pb-10 lg:pb-0"
                  }`}
                >
                  {/*
                   * Below lg the rail runs down the left instead of across.
                   * It is drawn from this mark's centre to the next mark's
                   * centre (12.5px = 8px offset + half the 9px mark), which
                   * is why it overhangs the bottom by the same amount.
                   */}
                  {last ? null : (
                    <span
                      className="absolute -bottom-[12.5px] left-1 top-[12.5px] w-px bg-k-rule-strong lg:hidden"
                      aria-hidden="true"
                    />
                  )}

                  {/*
                   * The mark. At lg it sits on the rail and carries the line
                   * to the next one; the last step draws no line, so the rail
                   * ends on arrival rather than running off the edge.
                   */}
                  <div className="flex shrink-0 items-start pt-2 lg:w-full lg:items-center lg:pt-0">
                    <span
                      className={`block h-[9px] w-[9px] shrink-0 rounded-full ${
                        last ? "bg-k-gold" : "bg-k-ink"
                      }`}
                    />
                    {last ? null : (
                      <span
                        className="hidden h-px flex-1 bg-k-rule-strong lg:block"
                        aria-hidden="true"
                      />
                    )}
                  </div>

                  {/* At lg, a short drop tying the label back to its mark. */}
                  <span
                    className="ml-1 hidden h-7 w-px bg-k-rule lg:block"
                    aria-hidden="true"
                  />

                  <div className="flex flex-col gap-2 lg:pr-10">
                    <div className="flex items-baseline gap-3">
                      <span className="font-text text-k-micro uppercase tabular-nums text-k-ink-faint">
                        {step.n}
                      </span>
                      <h3 className="font-display text-k-d3 font-black text-k-ink">
                        {step.name}
                      </h3>
                    </div>
                    <p className="font-text text-k-small text-k-ink-soft">
                      {step.body}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Three services explained at length. */}
      <section className="bg-k-paper px-6 py-32 md:px-12 lg:px-24">
        <div className="mx-auto flex max-w-[1248px] flex-col gap-10">
          <h2 className="font-display text-k-d3 font-black text-k-ink">
            In detail
          </h2>
          {EXPANDED.map((slug, i) => {
            const service = services.find((s) => s.slug === slug);
            const copy = EXPANDED_COPY[slug];
            if (!service || !copy) return null;
            return (
              <Reveal
                key={slug}
                index={i}
                className="flex flex-col items-start gap-8 lg:flex-row lg:gap-16"
              >
                <Image
                  src={service.wide}
                  alt={service.name}
                  width={1600}
                  height={900}
                  className="h-auto w-full shrink-0 object-cover lg:w-[520px]"
                />
                <div className="flex flex-1 flex-col gap-3 pt-1">
                  <h3 className="font-display text-k-d3 font-black text-k-ink">
                    {copy.heading}
                  </h3>
                  <p className="max-w-[520px] font-text text-k-body text-k-ink-soft">
                    {copy.body}
                  </p>
                  <Link
                    href={`/services/${slug}`}
                    className="mt-1 w-fit border-b border-k-gold pb-1 font-text text-k-label uppercase text-k-ink"
                  >
                    View {service.name}
                  </Link>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* There is deliberately no closing call to action here. The footer on
          every page already carries the same dark band, the same Request a
          quote button and the same phone number, so putting one here as well
          simply printed it twice in a row. The one sentence worth keeping from
          it, about describing a load when none of the services obviously fits,
          now sits above the comparison row where the question is actually
          being asked. */}
    </>
  );
}
