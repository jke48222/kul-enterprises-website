import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { services } from "@/lib/services";
import ServiceCarousel from "@/components/k/ServiceCarousel";
import Reveal from "@/components/k/Reveal";
import Breadcrumb from "@/components/k/Breadcrumb";

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
 * The page runs in this order: title, the photograph carousel, the seven
 * services compared, how a load moves.
 *
 * ============================================================================
 * ONE CAROUSEL AND ONE LIST. IT USED TO BE TWO CAROUSELS AND TWO LISTS.
 * ============================================================================
 *
 * There were three passes over the same seven services: a photograph carousel
 * you pulled, then a comparison row you also pulled sideways, then three of the
 * seven written out again at length underneath. Two of those are gone.
 *
 * The carousel stays and is the point of the page. It is the only place the
 * seven photographs are shown at a size worth looking at, and it is where
 * somebody who does not yet know what they need goes to browse. Its dragging
 * and its speed are dealt with in components/k/ServiceCarousel.tsx.
 *
 * The comparison row that followed it did not stay. It carried the same seven
 * names a second time and it had to be pulled sideways to be read, which is
 * the one thing a comparison must not be: two services are never on screen
 * together for long enough to compare them. It is a list reading downwards
 * now, and because the facts sit in the same column on every row they can be
 * run down with one eye.
 *
 * The third pass, "In detail", was three of the seven explained again in worse
 * words than their own pages use. See the note at the foot of this file.
 */

export const metadata: Metadata = {
  title: "Freight Services",
  description:
    "Power Only, Dry Van, Reefer, Dedicated, Regional, Expedited and Over the Road freight services from KUL Enterprises. Licensed carrier based in Loganville, Georgia, authorized in 48 states.",
};

const STEPS = [
  {
    n: "01",
    name: "Enquiry",
    body: "Call dispatch, or send the lane. Six fields: origin, destination, freight type, pickup date, how to reach you, and anything else we should know.",
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
  return (
    <>
      {/* Title row. */}
      <section className="bg-k-paper px-6 pt-36 md:px-12 lg:px-24">
        <div className="mx-auto max-w-[1248px]">
          <Breadcrumb
            className="pb-5"
            items={[{ label: "KUL", href: "/" }, { label: "Services" }]}
          />
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

      {/* The photograph carousel. */}
      <section className="bg-k-paper">
        {/* The carousel has no heading on screen, by design: the seven
            photographs and their names are the heading. But each card names
            its service in an h3, and with nothing above them the page jumped
            from its h1 straight to an h3, which is a hole in the outline
            somebody navigating by headings falls through.

            So the heading exists and is read aloud, without being drawn. It
            also does a second job: somebody listening to the page arrives at
            seven service names with no idea what the group is. */}
        <h2 className="sr-only">All {services.length} services</h2>
        <ServiceCarousel services={services} />
      </section>

      {/* THE SEVEN SERVICES, READ DOWNWARDS.
          One row each. The photograph and the name are on the left where the
          eye lands, the sentence and the two actions are in the middle, and
          the three facts a shipper is comparing are pinned to the right in a
          fixed-width column so they line up on every row from the top of the
          list to the bottom. That alignment is the whole point: it is what
          lets somebody run their eye down "Equipment" for all seven without
          reading any of the prose. */}
      <section className="bg-k-surface px-6 py-28 md:px-12 lg:px-24">
        <div className="mx-auto flex max-w-[1248px] flex-col gap-10">
          <Reveal variant="settle" className="flex flex-col items-center gap-3.5">
            <h2 className="max-w-[700px] text-center font-display text-k-d2 font-black text-k-ink">
              Find the service that fits your lane
            </h2>
            <p className="max-w-[660px] text-center font-text text-k-small text-k-ink-soft">
              If none of them obviously fits, describe the load and we will
              tell you which one does, including when the answer is that KUL is
              not the right carrier for it.
            </p>
          </Reveal>

          <ul className="flex flex-col">
            {services.map((service, i) => (
              <li key={service.slug}>
                {/* THE ROW KEEPS ITS SHAPE ON A PHONE. It used to collapse to
                    one column, which turned a 232px thumbnail into a 342px
                    square photograph and pushed the service name most of a
                    screen below its own row: seven services became seven full
                    screens of road. The picture is 96px on a phone and 128px
                    from sm, so the name and the sentence stay beside it exactly
                    as they do on a desktop.

                    The facts drop under both columns rather than beside them,
                    because three columns do not fit in 390px and the labels
                    would wrap to two lines each. That is the one part of the
                    desktop arrangement that cannot survive, and it is the part
                    a reader consults rather than reads. */}
                <Reveal
                  index={i}
                  className="grid grid-cols-[96px_minmax(0,1fr)] gap-x-5 gap-y-6 border-t border-k-rule-strong py-9 sm:grid-cols-[128px_minmax(0,1fr)] sm:gap-x-7 lg:grid-cols-[232px_minmax(0,1fr)_296px] lg:items-start lg:gap-12"
                >
                  {/* The photograph is a link to the same place the name goes,
                      because a picture of a reefer is the thing a shipper
                      reaches for first and it should not be the one part of
                      the row that does nothing when clicked. It is decorative
                      beside a heading that already names the service, so it
                      carries an empty alt rather than saying "Reefer" twice
                      in a row to a screen reader. */}
                  <Link
                    href={`/services/${service.slug}`}
                    tabIndex={-1}
                    aria-hidden="true"
                    className="block overflow-hidden rounded-sm"
                  >
                    <Image
                      src={service.card}
                      alt=""
                      width={900}
                      height={900}
                      sizes="(min-width: 1024px) 232px, (min-width: 640px) 128px, 96px"
                      priority={i < 2}
                      className="h-auto w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.04]"
                    />
                  </Link>

                  <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                      <h3 className="font-display text-k-d3 font-black text-k-ink">
                        {service.name}
                      </h3>
                      <span className="font-text text-k-micro uppercase tabular-nums text-k-ink-faint">
                        {service.leadTime === "By contract"
                          ? "By contract"
                          : `Lead time ${service.leadTime}`}
                      </span>
                    </div>
                    <p className="max-w-[52ch] font-text text-k-body text-k-ink-soft">
                      {service.short}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-2">
                      {/* Carries the slug, same as the service page's own
                          button, so the form opens on the right freight type
                          from either route in. */}
                      <Link
                        href={`/quote?service=${service.slug}`}
                        className="rounded-full bg-k-ink px-5 py-2.5 font-text text-k-micro uppercase text-k-paper transition-opacity duration-200 hover:opacity-85"
                      >
                        Get a quote
                      </Link>
                      <Link
                        href={`/services/${service.slug}`}
                        className="border-b border-k-gold pb-0.5 font-text text-k-micro uppercase text-k-ink transition-colors duration-200 hover:text-k-gold"
                      >
                        {service.name} in detail
                      </Link>
                    </div>
                  </div>

                  {/* The comparison facts. A description list, because that is
                      what this is: three labels and their values. */}
                  <dl className="col-span-2 flex flex-col gap-3.5 border-t border-k-rule pt-5 lg:col-span-1 lg:border-t-0 lg:pt-1">
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
                      <div key={row.label} className="flex flex-col gap-0.5">
                        <dt className="font-text text-k-micro uppercase text-k-ink-faint">
                          {row.label}
                        </dt>
                        <dd className="font-text text-k-small font-medium text-k-ink">
                          {row.value}
                          {row.note ? (
                            <span className="font-normal text-k-ink-soft">
                              {" "}
                              · {row.note}
                            </span>
                          ) : null}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How a load moves. */}
      <section
        className="px-6 py-32 md:px-12 lg:px-24"
        style={{ backgroundColor: "#FDC63E17" }}
      >
        <div className="mx-auto flex max-w-[1248px] flex-col gap-16">
          <Reveal variant="wipe" className="mx-auto flex max-w-[42ch] flex-col items-center gap-4 text-center">
            <p className="font-text text-k-label uppercase text-k-gold">
              How a load moves
            </p>
            <h2 className="font-display text-k-d2 font-black text-k-ink">
              Four steps, no surprises
            </h2>
            {/* A lede sat here reading "Six fields in, one phone number
                throughout." Step 01 below it already names the six fields and
                lists them, and step 04 already ends on "one phone number
                throughout", so the summary was made entirely of the two lines
                directly underneath it. */}
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

      {/* THREE OF THE SEVEN USED TO BE WRITTEN OUT AGAIN HERE, under the
          heading "In detail": Power Only, Reefer and Dedicated, each with a
          wide photograph and two sentences. It went on 29 Jul 2026 and should
          not come back.

          Every word of it was a shorter version of the service's own page,
          which is one click away from the row above and carries the full
          description, what it is best for, what KUL commits to, the
          measurements and the drawings. Saying a worse version of that first
          made the page longer without making it more useful, and it quietly
          told a reader that four of the seven services were less important
          than the other three, which is not true and is not something KUL
          would say out loud.

          There is deliberately no closing call to action either. The footer on
          every page already carries the same dark band, the same quote link
          and the same phone number. */}
    </>
  );
}
