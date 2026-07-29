"use client";

import Image from "next/image";
import Link from "next/link";
import { useTina, tinaField } from "tinacms/dist/react";
import { site } from "@/lib/site";
import { fill } from "@/lib/content";
import type { TinaPage } from "@/lib/tina";
import indexPage from "@/content/pages/services-index.json";
import Reveal, { RuleDraw } from "@/components/k/Reveal";
import ServiceSpecs from "@/components/k/ServiceSpecs";
import Breadcrumb from "@/components/k/Breadcrumb";
import type { Service } from "@/lib/services";

/**
 * ONE SERVICE PAGE, THE HALF THAT DRAWS.
 *
 * All seven service pages are this component with a different slug. It
 * subscribes to the Services document with useTina, so editing a service in
 * /admin redraws its page live: rename Reefer, add a commitment, correct a
 * trailer measurement, and it lands as you type.
 *
 * THE SEVEN SERVICES ARE ONE DOCUMENT, NOT SEVEN. content/services.json holds
 * them as a list, which is what lets the client drag them into a different
 * order. The cost is that Tina can only point one preview URL at that
 * document, and it points at /services. From there the preview navigates into
 * an individual service perfectly well, and this component keeps it live when
 * it does.
 *
 * The template wording, the labels and buttons shared by all seven, comes from
 * the Services page document instead and is read statically here. It is fully
 * editable under "Services page"; it simply is not the document this preview
 * is bound to, so those particular words settle on save rather than on
 * keystroke.
 */
const t = indexPage.detail;

type Content = typeof import("@/content/services.json");

export default function ServiceDetailView({
  slug,
  ...props
}: TinaPage<{ services: unknown }> & { slug: string }) {
  const { data } = useTina({
    query: props.query ?? "",
    variables: props.variables ?? {},
    data: props.data,
  });

  const services = ((data.services as unknown as Content)?.services ??
    []) as Service[];
  const index = services.findIndex((s) => s.slug === slug);

  // The server already refused an unknown slug, so this only guards the
  // moment a service is renamed in the editor while its page is open.
  if (index < 0) return null;

  const service = services[index];
  const previous = services[(index - 1 + services.length) % services.length];
  const next = services[(index + 1) % services.length];



  /**
   * The measurements, dealt into two columns for Size it up.
   *
   * Alternating rather than splitting the list in half keeps A B C down the
   * left and D E F down the right, which is the order the letters appear on the
   * drawings above them. Cutting the list in the middle instead would put A B C
   * on the left and D E F on the right only for as long as there are exactly
   * six, and it would silently stop matching the moment a seventh is added.
   */
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
              <Breadcrumb
                tone="dark"
                items={[
                  { label: "KUL", href: "/" },
                  { label: "Services", href: "/services" },
                  { label: service.name },
                ]}
              />
              <h1
                data-tina-field={tinaField(service, "name")}
                className="font-display text-k-d1 font-black text-k-on-dark"
              >
                {service.name}
              </h1>
              <p
                data-tina-field={tinaField(service, "description")}
                className="max-w-[520px] font-text text-k-lede text-k-on-dark-soft"
              >
                {service.description}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              {/* The slug travels with the click, so the quote form opens with
                  this service already chosen. See the note on the freight type
                  in components/forms/QuoteForm.tsx: the value is looked up in
                  the real service list at the other end and dropped if it does
                  not match, so a hand-edited URL cannot put anything into the
                  form that is not a service KUL runs. */}
              <Link
                href={`/quote?service=${service.slug}`}
                className="rounded-full bg-k-on-dark px-8 py-4 font-text text-k-label uppercase text-k-ink transition-opacity duration-200 hover:opacity-85"
              >
                {fill(t.quoteCta)}
              </Link>
              <a
                href={site.phoneHref}
                className="rounded-full border border-k-on-dark-faint px-8 py-4 font-text text-k-label uppercase text-k-on-dark transition-colors duration-200 hover:border-k-on-dark"
              >
                {fill(t.callCta)}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* What it suits, and what we promise. */}
      <section className="bg-k-paper px-6 py-28 md:px-12 lg:px-24">
        <div className="mx-auto flex max-w-[1248px] flex-col gap-16 lg:flex-row lg:gap-24">
          {[
            { label: fill(t.bestForLabel), items: service.bestFor },
            { label: fill(t.commitmentsLabel), items: service.commitments },
          ].map((block, i) => (
            <Reveal key={block.label} variant="settle" index={i} className="flex flex-1 flex-col gap-6">
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

      {/* The commercial facts, on Rivian's specs shape. The whole section lives
          in components/k/ServiceSpecs.tsx, including the note on how its scrim
          was measured. */}
      <ServiceSpecs service={service} />

      {/* SIZE IT UP. The measured drawing, on the dark ground it has always
          had.

          IT CAME BACK, AND THE SPLIT WITH THE SECTION ABOVE IS THE POINT. For a
          while the trailer measurements were tiles in "In detail" alongside the
          lane and the lead time, and the two drawings were dropped because
          white lines cannot be seen on a white ground. That merged two
          different questions. What equipment turns up and how soon is a
          booking question and belongs on the light section; how tall the box is
          and how wide the rear door opens is a loading question, asked later,
          and it is worth nothing without the drawing that shows where each
          figure is taken from. The letters A to F only mean anything next to
          the elevations, which is the other half of the argument for keeping
          them together.

          The drawings are white lines on transparency, so this section stays on
          the blueprint ground. Do not move it onto paper without inverting them
          first, or it will look empty. */}
      <section className="overflow-hidden bg-k-blueprint px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto flex max-w-[1248px] flex-col">
          <Reveal>
            <h2 className="pb-14 text-center font-display text-k-d3 font-black text-k-on-dark">
              {fill(t.sizeHeading)}
            </h2>
          </Reveal>

          <div className="flex flex-col items-center justify-center gap-10 pb-16 lg:flex-row lg:gap-14">
            {/* The two elevations arrive first and their keys follow, which
                reads as a drawing being annotated rather than as a picture
                appearing. That is why the letters carry a later index than the
                drawing they sit on rather than being part of it. */}
            <Reveal variant="settle" className="relative flex w-[238px] shrink-0 items-center justify-center">
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
            </Reveal>

            <Reveal variant="settle" index={2} className="relative flex flex-1 items-center justify-center">
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
            </Reveal>
          </div>

          <RuleDraw tone="dark" />
          <div className="flex flex-col gap-0 pt-2 lg:flex-row lg:gap-16">
            {[leftColumn, rightColumn].map((column, ci) => (
              <div key={ci} className="flex flex-1 flex-col">
                {column.map((dim, ri) => (
                  <Reveal
                    key={dim.ref}
                    variant="settle"
                    index={ri}
                    className="flex items-center justify-between border-b border-k-rule-dark py-3.5 last:border-b-0"
                  >
                    <span className="font-text text-k-small text-k-on-dark-soft">
                      {dim.ref}. {dim.label}
                    </span>
                    <span className="font-text text-k-small font-medium tabular-nums text-k-on-dark">
                      {dim.value}
                    </span>
                  </Reveal>
                ))}
              </div>
            ))}
          </div>

          {/* THIS SENTENCE IS LOAD BEARING AND TRAVELS WITH THE MEASUREMENTS.
              The figures in content/services.json are the book figures for a
              standard 53 foot van. Nobody has put a tape over the client's own
              trailer. A broker reading a rear door opening off this page could
              quote against it, so the page has to say what the number is and is
              not. Do not delete it, and if the measurements are ever taken off
              the real trailer, change the words rather than dropping them. */}
          {service.dimensions.length > 0 ? (
            <p className="pt-6 font-text text-k-micro uppercase text-k-on-dark-faint">
              {fill(t.dimensionsCaveat)}
            </p>
          ) : null}
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
            {fill(t.previousLabel)}
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
            {fill(t.nextLabel)}
          </span>
          <span className="font-display text-k-d3 font-black text-k-ink">
            {next.name}
          </span>
        </Link>
      </nav>
    </>
  );
}
