import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import ContactForm from "@/components/forms/ContactForm";

/**
 * CONTACT PAGE
 *
 * Built as a routing directory rather than a single form. Most people
 * arriving here already know what they want, so the page sends them to the
 * right place in one step instead of making everyone fill in the same box.
 *
 * The page is deliberately roomy. A contact page does not need to fill the
 * screen, and crowding it makes the phone number harder to find.
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
      {/* The phone first, at a size that makes it unmissable. */}
      <section className="bg-k-paper px-6 pb-20 pt-44 md:px-12 lg:px-24">
        <div className="mx-auto flex max-w-[1248px] flex-col gap-10">
          <p className="flex items-center gap-4">
            <span className="h-px w-12 shrink-0 bg-k-gold" aria-hidden="true" />
            <span className="font-text text-k-label uppercase text-k-gold">
              Contact
            </span>
          </p>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
            <h1 className="max-w-[760px] font-display text-k-d1 font-black text-k-ink">
              Call dispatch. Someone answers.
            </h1>
            <a
              href={site.phoneHref}
              className="font-display text-k-d2 font-black tabular-nums text-k-ink transition-colors duration-200 hover:text-k-gold"
            >
              {site.phone}
            </a>
          </div>
          <p className="max-w-[620px] font-text text-k-lede text-k-ink-soft">
            Around the clock, and the person picking up is the person driving
            the truck. Email reaches the same place if you would rather write.
          </p>
        </div>
      </section>

      {/* Routing directory. One row per destination. */}
      <section className="bg-k-surface px-6 py-20 md:px-12 lg:px-24">
        <div className="mx-auto max-w-[1248px]">
          <ul className="border-t border-k-rule-strong">
            {ROUTES.map((route) => (
              <li key={route.label}>
                <Link
                  href={route.href}
                  className="flex flex-col gap-3 border-b border-k-rule py-8 transition-colors duration-200 hover:bg-k-paper md:flex-row md:items-center md:gap-10"
                >
                  <span className="font-display text-k-d3 font-black text-k-ink md:w-[280px] md:shrink-0">
                    {route.label}
                  </span>
                  <span className="flex-1 font-text text-k-body text-k-ink-soft">
                    {route.body}
                  </span>
                  <span className="w-fit shrink-0 border-b border-k-gold pb-0.5 font-text text-k-label uppercase text-k-ink">
                    {route.action}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Everything else, plus where we actually are. */}
      <section className="bg-k-paper px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto flex max-w-[1248px] flex-col gap-16 lg:flex-row lg:gap-24">
          <div className="flex flex-1 flex-col gap-6">
            <h2 className="font-display text-k-d3 font-black text-k-ink">
              Anything else
            </h2>
            <p className="max-w-[480px] font-text text-k-body text-k-ink-soft">
              For anything that does not fit the rows above, write here and it
              reaches the same inbox as everything else.
            </p>
            <ContactForm />
          </div>

          <div className="flex w-full flex-col gap-8 lg:w-[380px] lg:shrink-0">
            <div className="flex flex-col gap-4 border border-k-rule bg-k-surface p-8">
              <span className="font-text text-k-micro uppercase text-k-ink-faint">
                Where we are
              </span>
              <p className="font-display text-k-d3 font-black text-k-ink">
                {site.location}
              </p>
              <p className="font-text text-k-small text-k-ink-soft">
                {site.serviceArea}
              </p>
              <div className="flex flex-col gap-2 border-t border-k-rule pt-4">
                <a
                  href={site.phoneHref}
                  className="font-text text-k-body text-k-ink transition-colors duration-200 hover:text-k-gold"
                >
                  {site.phone}
                </a>
                <a
                  href={`mailto:${site.email}`}
                  className="font-text text-k-body text-k-ink transition-colors duration-200 hover:text-k-gold"
                >
                  {site.email}
                </a>
              </div>
              <div className="flex flex-col gap-1 border-t border-k-rule pt-4">
                <span className="font-text text-k-micro uppercase tabular-nums text-k-ink-faint">
                  USDOT {site.usdot}
                </span>
                <span className="font-text text-k-micro uppercase tabular-nums text-k-ink-faint">
                  MC {site.mc}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
