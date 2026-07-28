import type { Metadata } from "next";
import Image from "next/image";
import { site } from "@/lib/site";
import QuoteForm from "@/components/forms/QuoteForm";

/**
 * QUOTE PAGE
 *
 * The most important page on the site. Everything else exists to get a
 * shipper here.
 *
 * The form is deliberately short: origin, destination, freight type, pickup
 * date and how to reach you. Anything else can be asked on the phone.
 *
 * The phone number is given equal weight to the form, because a broker with
 * a load moving today will call rather than type.
 *
 * WHERE THE SUBMISSIONS GO: dispatch@kulenterprises.com, and a copy of every
 * submission is written to the hosting logs as backup. See .env.example for
 * the two settings this needs before launch.
 */

export const metadata: Metadata = {
  title: "Request a Freight Quote",
  description: `Get a freight quote from KUL Enterprises. Power Only, Dry Van, Reefer, Dedicated, Regional, Expedited and Over the Road. Licensed carrier in ${site.location}, USDOT ${site.usdot}. Dispatch answers 24/7.`,
};

/** What happens after the form is sent. Stated so nobody has to wonder. */
const NEXT_STEPS = [
  {
    n: "01",
    title: "It reaches dispatch",
    body: "Straight to the person who drives the truck, not a shared inbox nobody owns.",
  },
  {
    n: "02",
    title: "You get a real number",
    body: "Usually the same day. If the lane does not suit us we will say so rather than quote high to decline politely.",
  },
  {
    n: "03",
    title: "Nothing is automated",
    body: "No sequence of follow up emails. If you do not book, you will not hear from us again unless you ask.",
  },
] as const;

export default function QuotePage() {
  return (
    <>
      {/* Split layout: the form on one side, a photograph on the other, so
          the page never reads like paperwork. */}
      <section className="bg-k-paper px-6 pb-24 pt-40 md:px-12 lg:px-24">
        <div className="mx-auto flex max-w-[1248px] flex-col gap-16 lg:flex-row lg:gap-24">
          <div className="flex flex-1 flex-col gap-8">
            <div className="flex flex-col gap-5">
              <p className="flex items-center gap-4">
                <span
                  className="h-px w-12 shrink-0 bg-k-gold"
                  aria-hidden="true"
                />
                <span className="font-text text-k-label uppercase text-k-gold">
                  Request a quote
                </span>
              </p>
              <h1 className="font-display text-k-d1 font-black text-k-ink">
                Tell us about the load.
              </h1>
              <p className="max-w-[520px] font-text text-k-lede text-k-ink-soft">
                Five fields is all we need to price it. Everything else can be
                sorted out on the phone.
              </p>
            </div>

            <QuoteForm />
          </div>

          <div className="flex w-full flex-col gap-8 lg:w-[420px] lg:shrink-0">
            {/* The phone sits level with the form, not below it. */}
            <div className="flex flex-col gap-3 border border-k-rule bg-k-surface p-8">
              <span className="font-text text-k-micro uppercase text-k-ink-faint">
                Or skip the form
              </span>
              <a
                href={site.phoneHref}
                className="font-display text-k-d2 font-black tabular-nums text-k-ink"
              >
                {site.phone}
              </a>
              <p className="font-text text-k-small text-k-ink-soft">
                Dispatch answers around the clock. If you have a load moving
                today, calling is faster than anything on this page.
              </p>
            </div>

            <Image
              src="/images/services/otr-wide.jpg"
              alt="A KUL Enterprises tractor and trailer on the highway"
              width={1600}
              height={900}
              className="h-[280px] w-full object-cover"
            />

            <div className="flex flex-col gap-6">
              {NEXT_STEPS.map((step) => (
                <div
                  key={step.n}
                  className="flex gap-5 border-t border-k-rule pt-5"
                >
                  <span className="font-text text-k-micro uppercase tabular-nums text-k-gold">
                    {step.n}
                  </span>
                  <div className="flex flex-col gap-1.5">
                    <h2 className="font-text text-k-body font-semibold text-k-ink">
                      {step.title}
                    </h2>
                    <p className="font-text text-k-small text-k-ink-soft">
                      {step.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-k-coal px-6 py-16 md:px-12 lg:px-24">
        <div className="mx-auto flex max-w-[1248px] flex-wrap items-center gap-x-10 gap-y-3">
          {[
            `USDOT ${site.usdot}`,
            `MC ${site.mc}`,
            "Licensed and insured",
            "Dispatch answers 24/7",
            site.serviceArea,
          ].map((item) => (
            <span
              key={item}
              className="font-text text-k-micro uppercase tabular-nums text-k-on-dark-soft"
            >
              {item}
            </span>
          ))}
        </div>
      </section>
    </>
  );
}
