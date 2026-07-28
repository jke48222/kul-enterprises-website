import type { Metadata } from "next";
import { site } from "@/lib/site";
import QuoteForm from "@/components/forms/QuoteForm";
import Reveal, { RuleDraw } from "@/components/k/Reveal";

/**
 * QUOTE PAGE
 *
 * Built from the Paper artboard "Quote, desktop 1440", which follows the
 * capture pattern the design work settled on: a quiet light opening, then one
 * dark panel where the whole request happens, with the reason to fill it in on
 * the left and the questions themselves on the right.
 *
 * The dark panel is doing a job. Everything above it is the page talking, and
 * everything inside it is the visitor working, so the change of ground tells
 * them where the actual task is without a single instruction.
 *
 * TO CHANGE THE QUESTIONS: they live in components/forms/QuoteForm.tsx, not
 * here. If the number of them changes, fix the sentence under the headline
 * that says how many there are.
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
    body: "It goes to the person who drives the truck. There is no shared inbox and no ticketing system in between.",
  },
  {
    n: "02",
    title: "You get a real number",
    body: "Usually the same day. If the lane does not suit our equipment or our hours, we say so and tell you why.",
  },
  {
    n: "03",
    title: "Nothing is automated",
    body: "No automated follow up sequence. If you do not book, you will not hear from us again unless you get in touch.",
  },
] as const;

/** The line of checkable facts that closes the page. */
const CREDENTIALS = [
  `USDOT ${site.usdot}`,
  `MC ${site.mc}`,
  "Licensed and insured",
  "Dispatch answers 24/7",
] as const;

export default function QuotePage() {
  return (
    <>
      {/* The opening. Light, quiet, and short, because the work is below it. */}
      <section className="bg-k-paper px-6 pb-24 pt-36 md:px-12 lg:px-24">
        <div className="mx-auto flex max-w-[1248px] flex-col gap-7">
          <p className="flex items-center gap-2.5">
            <span className="font-text text-k-micro uppercase text-k-ink-faint">
              KUL
            </span>
            <span className="font-text text-k-micro text-k-ink-faint">/</span>
            <span className="font-text text-k-micro uppercase text-k-gold">
              Quote
            </span>
          </p>
          <h1 className="max-w-[700px] font-display text-k-d1 font-black text-k-ink">
            Tell us about the load.
          </h1>
          <p className="max-w-[560px] font-text text-k-lede text-k-ink-soft">
            Six fields is all we need to price it. Everything else can be
            sorted out on the phone.
          </p>
        </div>
      </section>

      {/* The capture. One dark panel: the reason on the left, the questions on
          the right. This is the only place on the page anything is asked. */}
      <section className="bg-k-coal px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto flex max-w-[1248px] flex-col gap-16 lg:flex-row lg:items-start lg:gap-[104px]">
          <div className="flex flex-col gap-6 lg:w-[440px] lg:shrink-0">
            <span className="font-text text-k-micro uppercase text-k-gold-lit">
              The request
            </span>
            <h2 className="font-display text-k-d2 font-black text-k-on-dark">
              Six fields, then a real number.
            </h2>
            <p className="font-text text-k-body text-k-on-dark-soft">
              This goes straight to the person who drives the truck. Nothing
              here is automated and nobody else sees it.
            </p>

            {/* The way out for anyone who would rather just call. */}
            <div className="mt-4 flex flex-col gap-2 border-t border-k-rule-dark pt-8">
              <span className="font-text text-k-micro uppercase text-k-on-dark-faint">
                Or skip the form
              </span>
              <a
                href={site.phoneHref}
                className="w-fit font-display text-k-d3 font-black tabular-nums text-k-gold-lit"
              >
                {site.phone}
              </a>
              <p className="font-text text-k-small text-k-on-dark-soft">
                If the load is moving today, calling is faster than anything on
                this page.
              </p>
            </div>

            {/* What happens after it is sent. This used to be a row of three
                cards in its own section further down the page. It reassures
                far better here, next to the form, at the moment somebody is
                deciding whether to fill it in. */}
            <ol className="flex flex-col pt-4">
              {NEXT_STEPS.map((step, i) => (
                <li key={step.n} className="flex flex-col">
                  <RuleDraw index={i} tone="dark" />
                  <Reveal
                    variant="settle"
                    index={i}
                    className="flex gap-5 py-4"
                  >
                    <span className="shrink-0 font-text text-k-micro uppercase tabular-nums text-k-gold-lit">
                      {step.n}
                    </span>
                    <span className="font-text text-k-small text-k-on-dark-soft">
                      <span className="text-k-on-dark">{step.title}.</span>{" "}
                      {step.body}
                    </span>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>

          <div className="w-full lg:flex-1">
            <QuoteForm />
          </div>
        </div>
      </section>

      {/* The facts a broker checks, closing the page on the same dark ground
          the request was made on. */}
      <section className="bg-k-coal px-6 py-14 md:px-12 lg:px-24">
        <div className="mx-auto flex max-w-[1248px] flex-wrap items-center gap-x-10 gap-y-3">
          {CREDENTIALS.map((item) => (
            <span
              key={item}
              className="font-text text-k-micro uppercase tabular-nums text-k-on-dark-soft"
            >
              {item}
            </span>
          ))}
          <span className="font-text text-k-micro uppercase text-k-gold-lit md:ml-auto">
            {site.location} · {site.serviceArea}
          </span>
        </div>
      </section>
    </>
  );
}
