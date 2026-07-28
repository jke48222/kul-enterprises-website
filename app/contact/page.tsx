import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import ContactForm from "@/components/forms/ContactForm";
import Reveal, { RuleDraw } from "@/components/k/Reveal";

/**
 * CONTACT PAGE
 *
 * Built from the Paper artboard "Contact — desktop 1440". It is a routing
 * directory rather than one big form. Most people arriving here already know
 * what they want, so the page sends them to the right place in one step
 * instead of making everybody fill in the same box.
 *
 * The page runs in this order: the phone number, two cards side by side for
 * where we are and how to reach dispatch, the three things people write in
 * about, a box for anything that does not fit those three, and one closing
 * line for anyone who came here with a load already loaded.
 *
 * TO CHANGE WHERE ENQUIRIES GO: edit ROUTES below. Each row is one reason
 * somebody writes in, and the link at the bottom of it is where that reason
 * should be sent.
 */

export const metadata: Metadata = {
  title: "Contact Dispatch",
  description: `Contact KUL Enterprises. Dispatch answers 24/7 on ${site.phone}. Freight quotes, carrier packet requests and driver enquiries. Based in ${site.location}.`,
};

/** One row per destination, so nobody has to guess where to write. */
const ROUTES = [
  {
    label: "Freight quotes",
    body: "Origin, destination, freight type and pickup date. Priced the same day where we can.",
    action: "Request a quote",
    href: "/quote",
  },
  {
    label: "Carrier packet",
    body: "W-9, certificate of insurance and operating authority for your onboarding file.",
    action: "Open the packet",
    href: "/carrier-packet",
  },
  {
    label: "Drivers",
    body: "KUL is not hiring yet. Leave your details and you will hear from us when that changes.",
    action: "Join the list",
    href: "/drivers",
  },
] as const;

export default function ContactPage() {
  return (
    <>
      {/* The opening. Short, because the two cards below it do the work. */}
      <section className="bg-k-paper px-6 pb-20 pt-36 md:px-12 lg:px-24">
        <div className="mx-auto flex max-w-[1248px] flex-col gap-7">
          <p className="flex items-center gap-2.5">
            <span className="font-text text-k-micro uppercase text-k-ink-faint">
              KUL
            </span>
            <span className="font-text text-k-micro text-k-ink-faint">/</span>
            <span className="font-text text-k-micro uppercase text-k-gold">
              Contact
            </span>
          </p>
          <h1 className="max-w-[820px] font-display text-k-d1 font-black text-k-ink">
            One number, and it is answered.
          </h1>
          <p className="max-w-[600px] font-text text-k-lede text-k-ink-soft">
            There is no phone tree and no ticket queue. The number below reaches
            the person who drives the truck.
          </p>
        </div>
      </section>

      {/* Two cards, matched in height. Where we are on the left, and the one
          action most people came here for on the right. */}
      <section className="bg-k-paper px-6 pb-28 md:px-12 lg:px-24">
        <div className="mx-auto grid max-w-[1248px] grid-cols-1 gap-6 lg:grid-cols-2">
          <Reveal className="flex flex-col overflow-hidden rounded-md bg-k-surface">
            <Image
              src="/images/services/regional-wide.jpg"
              alt="A KUL Enterprises tractor and trailer on a Southeast highway"
              width={1600}
              height={900}
              className="h-[250px] w-full object-cover"
            />
            <div className="flex flex-1 flex-col gap-6 p-8">
              <h2 className="font-display text-k-d3 font-black text-k-ink">
                {site.location}
              </h2>
              <div className="flex flex-wrap gap-x-14 gap-y-4">
                <div className="flex flex-col gap-1">
                  <span className="font-text text-k-small text-k-ink-soft">
                    {site.city}, Georgia 30052
                  </span>
                  <span className="font-text text-k-small text-k-ink-soft">
                    {site.serviceArea}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-text text-k-small text-k-ink-soft">
                    Dispatch: 24 hours
                  </span>
                  <span className="font-text text-k-small text-k-ink-soft">
                    USDOT {site.usdot} · MC {site.mc}
                  </span>
                </div>
              </div>
              <div className="mt-auto flex flex-wrap items-center gap-x-7 gap-y-4 pt-2">
                <a
                  href={`mailto:${site.email}`}
                  className="rounded-full bg-k-ink px-7 py-3.5 font-text text-k-label uppercase text-k-on-dark transition-opacity duration-200 hover:opacity-85"
                >
                  Email dispatch
                </a>
                <Link
                  href="/services"
                  className="border-b border-k-gold pb-0.5 font-text text-k-small text-k-ink"
                >
                  See the service area
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal
            index={1}
            className="flex flex-col justify-end gap-6 rounded-md bg-k-coal p-11"
          >
            <span className="font-text text-k-micro uppercase text-k-gold-lit">
              Dispatch, around the clock
            </span>
            <h2 className="max-w-[500px] font-display text-k-d2 font-black text-k-on-dark">
              Call the person driving.
            </h2>
            <p className="max-w-[440px] font-text text-k-body text-k-on-dark-soft">
              If a load is moving today, this is faster than any form. Nights
              and weekends included.
            </p>
            <a
              href={site.phoneHref}
              className="w-fit rounded-full bg-k-on-dark px-8 py-4 font-text text-k-label uppercase tabular-nums text-k-ink transition-opacity duration-200 hover:opacity-85"
            >
              Call {site.phone}
            </a>
          </Reveal>
        </div>
      </section>

      {/* The three reasons people write in, and where each one should go. */}
      <section className="bg-k-surface px-6 py-28 md:px-12 lg:px-24">
        <div className="mx-auto flex max-w-[1248px] flex-col gap-12">
          <Reveal className="flex flex-col gap-4">
            <h2 className="font-display text-k-d2 font-black text-k-ink">
              Where to send it
            </h2>
            <p className="max-w-[620px] font-text text-k-body text-k-ink-soft">
              Three reasons people write in. All three reach the same inbox, so
              use whichever fits and say so in the first line.
            </p>
          </Reveal>

          {/* A directory rather than three cards. Each reason sits on one
              baseline: what it is, what to send, and where it goes. The whole
              row is the link, so it is a far bigger target than a text link
              tucked under a paragraph. */}
          <ul className="flex flex-col">
            {ROUTES.map((route, i) => (
              <li key={route.href} className="flex flex-col">
                <RuleDraw index={i} />
                <Reveal index={i}>
                  <Link
                    href={route.href}
                    className="group flex flex-col gap-4 py-8 transition-colors duration-200 md:flex-row md:items-baseline md:gap-12"
                  >
                    <span className="font-display text-k-d3 font-black text-k-ink transition-colors duration-200 group-hover:text-k-gold md:w-[260px] md:shrink-0">
                      {route.label}
                    </span>
                    <span className="font-text text-k-body text-k-ink-soft md:flex-1">
                      {route.body}
                    </span>
                    <span className="flex shrink-0 items-center gap-2.5 font-text text-k-micro uppercase text-k-gold">
                      {route.action}
                      <svg
                        width="16"
                        height="10"
                        viewBox="0 0 18 12"
                        fill="none"
                        aria-hidden="true"
                        className="shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                      >
                        <path
                          d="M1 6h15M11.5 1 16.8 6l-5.3 5"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </Link>
                </Reveal>
              </li>
            ))}
            <RuleDraw index={ROUTES.length} />
          </ul>
        </div>
      </section>

      {/* The catch-all, for anything the three rows above do not cover. */}
      <section className="bg-k-paper px-6 py-28 md:px-12 lg:px-24">
        <div className="mx-auto flex max-w-[1248px] flex-col gap-12 lg:flex-row lg:gap-24">
          <div className="flex flex-col gap-5 lg:w-[420px] lg:shrink-0">
            <h2 className="font-display text-k-d3 font-black text-k-ink">
              Anything else
            </h2>
            <p className="font-text text-k-body text-k-ink-soft">
              For anything that does not fit the rows above, write here and it
              reaches the same inbox as everything else.
            </p>
            <a
              href={`mailto:${site.email}`}
              className="w-fit border-b border-k-gold pb-0.5 font-text text-k-small text-k-ink"
            >
              {site.email}
            </a>
          </div>
          <div className="lg:flex-1">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* One closing line, for anyone who arrived with a load already on. */}
      <section className="border-t border-k-rule bg-k-warm px-6 py-14 md:px-12 lg:px-24">
        <div className="mx-auto flex max-w-[1248px] flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
          <h2 className="font-display text-k-d3 font-black text-k-ink">
            Have a load ready now?
          </h2>
          <Link
            href="/quote"
            className="flex items-center gap-3.5 rounded-full bg-k-ink px-8 py-4 font-text text-k-label uppercase text-k-on-dark transition-opacity duration-200 hover:opacity-85"
          >
            Request a quote
            <svg
              width="16"
              height="10"
              viewBox="0 0 18 12"
              fill="none"
              aria-hidden="true"
              className="shrink-0"
            >
              <path
                d="M1 6h15M11.5 1 16.8 6l-5.3 5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}
