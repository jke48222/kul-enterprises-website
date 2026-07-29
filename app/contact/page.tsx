import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ContactForm from "@/components/forms/ContactForm";
import Reveal, { RuleDraw } from "@/components/k/Reveal";
import Breadcrumb from "@/components/k/Breadcrumb";
import ServiceMap from "@/components/k/ServiceMap";
import Copy from "@/components/k/Copy";
import { fill, link, linkHref } from "@/lib/content";
import page from "@/content/pages/contact.json";

/**
 * CONTACT PAGE
 *
 * Built from the Paper artboard "Contact, desktop 1440". It is a routing
 * directory rather than one big form. Most people arriving here already know
 * what they want, so the page sends them to the right place in one step
 * instead of making everybody fill in the same box.
 *
 * The page runs in this order: the phone number, two cards side by side for
 * where we are and how to reach dispatch, the three things people write in
 * about, a box for anything that does not fit those three, and one closing
 * line for anyone who came here with a load already loaded.
 *
 * TO CHANGE WHERE ENQUIRIES GO: edit "Where to send it" at /admin under
 * "Contact page". Each row is one reason somebody writes in, and the link at
 * the end of it is where that reason should be sent.
 */

export const metadata: Metadata = {
  title: fill(page.meta.title),
  description: fill(page.meta.description),
};

export default function ContactPage() {
  return (
    <>
      {/* The opening. Short, because the two cards below it do the work. */}
      <section className="bg-k-paper px-6 pb-20 pt-36 md:px-12 lg:px-24">
        <div className="mx-auto flex max-w-[1248px] flex-col gap-7">
          <Breadcrumb
            className=""
            items={[{ label: "KUL", href: "/" }, { label: "Contact" }]}
          />
          <h1 className="max-w-[820px] font-display text-k-d1 font-black text-k-ink">
            {fill(page.opening.heading)}
          </h1>
          <Copy
            text={page.opening.lede}
            className="max-w-[600px] font-text text-k-lede text-k-ink-soft"
            linkClassName="underline underline-offset-4"
          />
        </div>
      </section>

      {/* Two cards, matched in height. Where we are on the left, and the one
          action most people came here for on the right. */}
      <section className="bg-k-paper px-6 pb-28 md:px-12 lg:px-24">
        <div className="mx-auto grid max-w-[1248px] grid-cols-1 gap-6 lg:grid-cols-2">
          <Reveal className="flex flex-col overflow-hidden rounded-md bg-k-surface">
            {/* The photograph is an open road with no vehicle in it. It used
                to be described as a KUL tractor and trailer on a Southeast
                highway, which is three things it is not, and somebody using a
                screen reader had no way of knowing that. Keep the description
                honest about what is actually in the picture. */}
            <Image
              src={page.locationCard.image}
              alt={fill(page.locationCard.imageAlt)}
              width={1600}
              height={900}
              className="h-[250px] w-full object-cover"
            />
            <div className="flex flex-1 flex-col gap-6 p-8">
              <h2 className="font-display text-k-d3 font-black text-k-ink">
                {fill(page.locationCard.heading)}
              </h2>
              {/* Two stacks of short lines rather than one list, because they
                  sit side by side and wrap independently. Add a line to either
                  in the CMS and it joins that column. */}
              <div className="flex flex-wrap gap-x-14 gap-y-4">
                {[page.locationCard.addressLines, page.locationCard.hoursLines].map(
                  (lines, ci) => (
                    <div key={ci} className="flex flex-col gap-1">
                      {lines.map((line) => (
                        <span
                          key={line}
                          className="font-text text-k-small text-k-ink-soft"
                        >
                          {fill(line)}
                        </span>
                      ))}
                    </div>
                  ),
                )}
              </div>
              <div className="mt-auto flex flex-wrap items-center gap-x-7 gap-y-4 pt-2">
                <a
                  href={link(page.locationCard.emailCta).href}
                  className="rounded-full bg-k-ink px-7 py-3.5 font-text text-k-label uppercase text-k-on-dark transition-opacity duration-200 hover:opacity-85"
                >
                  {link(page.locationCard.emailCta).label}
                </a>
                {/* The second link pointed at /services, which is the list of
                    freight types and says nothing about where a truck goes. It
                    goes to the map further down this page now. */}
                <a
                  href={link(page.locationCard.mapCta).href}
                  className="border-b border-k-gold pb-0.5 font-text text-k-small text-k-ink"
                >
                  {link(page.locationCard.mapCta).label}
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal
            index={1}
            className="flex flex-col justify-end gap-6 rounded-md bg-k-coal p-11"
          >
            <span className="font-text text-k-micro uppercase text-k-gold-lit">
              {fill(page.dispatchCard.eyebrow)}
            </span>
            <h2 className="max-w-[500px] font-display text-k-d2 font-black text-k-on-dark">
              {fill(page.dispatchCard.heading)}
            </h2>
            {/* "Nights and weekends included" was the third statement of the
                same fact inside one screen: the card to the left of this one
                prints "Dispatch: 24 hours", and the label directly above this
                headline reads "Dispatch, around the clock". */}
            <p className="max-w-[440px] font-text text-k-body text-k-on-dark-soft">
              {fill(page.dispatchCard.body)}
            </p>
            <a
              href={link(page.dispatchCard.cta).href}
              className="w-fit rounded-full bg-k-on-dark px-8 py-4 font-text text-k-label uppercase tabular-nums text-k-ink transition-opacity duration-200 hover:opacity-85"
            >
              {link(page.dispatchCard.cta).label}
            </a>
          </Reveal>
        </div>
      </section>

      {/* The three reasons people write in, and where each one should go. */}
      <section className="bg-k-surface px-6 py-28 md:px-12 lg:px-24">
        <div className="mx-auto flex max-w-[1248px] flex-col gap-12">
          <Reveal className="flex flex-col gap-4">
            <h2 className="font-display text-k-d2 font-black text-k-ink">
              {fill(page.routes.heading)}
            </h2>
            <Copy
              text={page.routes.intro}
              className="max-w-[620px] font-text text-k-body text-k-ink-soft"
              linkClassName="underline underline-offset-4"
            />
          </Reveal>

          {/* A directory rather than three cards. Each reason sits on one
              baseline: what it is, what to send, and where it goes. The whole
              row is the link, so it is a far bigger target than a text link
              tucked under a paragraph. */}
          <ul className="flex flex-col">
            {page.routes.items.map((route, i) => (
              <li key={route.href} className="flex flex-col">
                <RuleDraw index={i} />
                <Reveal index={i}>
                  <Link
                    href={linkHref(route.href)}
                    className="group flex flex-col gap-4 py-8 transition-colors duration-200 md:flex-row md:items-baseline md:gap-12"
                  >
                    <span className="font-display text-k-d3 font-black text-k-ink transition-colors duration-200 group-hover:text-k-gold md:w-[260px] md:shrink-0">
                      {fill(route.label)}
                    </span>
                    <span className="font-text text-k-body text-k-ink-soft md:flex-1">
                      {fill(route.body)}
                    </span>
                    <span className="flex shrink-0 items-center gap-2.5 font-text text-k-micro uppercase text-k-gold">
                      {fill(route.action)}
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
            <RuleDraw index={page.routes.items.length} />
          </ul>
        </div>
      </section>

      {/* WHERE KUL RUNS. Mark asked for a map in his brief and this is it; the
          component carries the note on how it stays honest and how it works
          without a pointer. It sits on Contact rather than Home because the
          question it answers, "do you come to me", is the one somebody has in
          their head at the moment they are deciding to get in touch. */}
      <section
        id="service-area"
        className="scroll-mt-28 bg-k-paper px-6 py-28 md:px-12 lg:px-24"
      >
        <div className="mx-auto flex max-w-[1248px] flex-col gap-12">
          <Reveal variant="wipe">
            <h2 className="max-w-[700px] font-display text-k-d2 font-black text-k-ink">
              {fill(page.map.heading)}
            </h2>
          </Reveal>
          <Reveal index={1}>
            <ServiceMap />
          </Reveal>
        </div>
      </section>

      {/* The catch-all, for anything the three rows above do not cover. */}
      <section className="bg-k-paper px-6 py-28 md:px-12 lg:px-24">
        <div className="mx-auto flex max-w-[1248px] flex-col gap-12 lg:flex-row lg:gap-24">
          <div className="flex flex-col gap-5 lg:w-[420px] lg:shrink-0">
            <h2 className="font-display text-k-d3 font-black text-k-ink">
              {fill(page.catchAll.heading)}
            </h2>
            {/* A sentence used to sit here reading "Write here and it reaches
                the same inbox as everything else", which is the line directly
                above the three routing rows said a second time, and the address
                printed underneath it makes the point without a sentence. */}
            <Copy
              text={page.catchAll.emailLabel}
              className="w-fit font-text text-k-small text-k-ink"
              linkClassName="border-b border-k-gold pb-0.5"
            />
          </div>
          <div className="lg:flex-1">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* A CLOSING BAND SAT HERE READING "Have a load ready now?" beside a
          Request a quote button. It went on 29 Jul 2026.

          By the time a reader reached it they had already passed the same
          offer three times on this one page: the first of the three routing
          rows is headed Freight quotes and ends on a Request a quote link, the
          bar at the top of every page carries Get a quote, and the footer
          under this band asks again. A fourth is not emphasis, it is the page
          not believing the reader saw the first three. */}
    </>
  );
}
