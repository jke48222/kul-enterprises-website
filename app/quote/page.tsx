import type { Metadata } from "next";
import { site } from "@/lib/site";
import QuoteForm from "@/components/forms/QuoteForm";
import Reveal from "@/components/k/Reveal";
import Breadcrumb from "@/components/k/Breadcrumb";

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
  description: `Get a freight quote from KUL Enterprises. Power Only, Dry Van, Reefer, Dedicated, Regional, Expedited and Over the Road. Licensed carrier in ${site.location}, USDOT ${site.usdot}. The owner answers dispatch.`,
};

/**
 * What happens after the form is sent. Stated so nobody has to wonder.
 *
 * THE NUMBERS ARE GONE. These were 01, 02, 03 down a ruled column with the
 * title set bold and the body running on from it inside the same sentence, and
 * the client rejected the format. The run of bold into grey inside one line is
 * what made it look cramped, and the numbering was the fourth numbered list on
 * a site that already has three.
 *
 * They are laid out as labelled pairs now, taken from Fiasco's contact page on
 * Mobbin, where each item is a small caps label with its detail underneath and
 * two sit to a row. It reads wider and shorter, which is what this column
 * needed: it is beside a form, not competing with one.
 */
const NEXT_STEPS = [
  {
    title: "It reaches dispatch",
    // The paragraph at the top of this column already says it goes to the
    // person who drives the truck. This item carries the one fact that
    // paragraph does not.
    body: "There is no shared inbox and no ticketing system in between.",
  },
  {
    title: "You get a real number",
    body: "Usually the same day. If the lane does not suit our equipment or our hours, we say so and tell you why.",
  },
  {
    title: "Nothing is automated",
    body: "If you do not book, you will not hear from us again unless you get in touch.",
  },
] as const;

/** The line of checkable facts that closes the page. Matches the Home strip. */
const CREDENTIALS = [
  `USDOT ${site.usdot}`,
  `MC ${site.mc}`,
  "Licensed and insured",
  // See the note on the same row in app/page.tsx. One man who drives cannot
  // also be a desk answering 24/7, and /road-ahead says dispatch cover is a
  // stage still to come.
  "Owner answers dispatch",
] as const;

export default function QuotePage() {
  return (
    <>
      {/* The opening. Light, quiet, and short, because the work is below it. */}
      <section className="bg-k-paper px-6 pb-24 pt-36 md:px-12 lg:px-24">
        <div className="mx-auto flex max-w-[1248px] flex-col gap-7">
          <Breadcrumb
            className=""
            items={[{ label: "KUL", href: "/" }, { label: "Quote" }]}
          />
          <h1 className="max-w-[700px] font-display text-k-d1 font-black text-k-ink">
            Tell us about the load.
          </h1>
          {/* The count came out of this line on 29 Jul 2026: the panel below
              counted the fields too, so the page counted them twice. That
              panel's headline has since been rewritten as well. */}
          <p className="max-w-[560px] font-text text-k-lede text-k-ink-soft">
            Everything we need to price it is below. The rest can be sorted out
            on the phone.
          </p>
        </div>
      </section>

      {/* The capture. The reason on the left, the questions on the right, which
          is the only place on the page anything is asked.

          THE GROUND DROPPED FROM COAL TO BLACK so the form can sit on it as a
          panel. Fiasco's contact page, which this is taken from, works by
          having three steps of dark rather than two: a near black page, the
          form held on a lighter card, and the fields lighter again inside it.
          With the page at coal there was nowhere for the card to go, because
          the fields were already the only lift available.

          Contrast improves rather than suffers. The faint tone measures 6.25:1
          on black against 5.07:1 on charcoal, and it is the weakest thing in
          this column. */}
      <section className="bg-k-void px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto flex max-w-[1248px] flex-col gap-16 lg:flex-row lg:items-start lg:gap-[104px]">
          <div className="flex flex-col gap-6 lg:w-[440px] lg:shrink-0">
            <span className="font-text text-k-micro uppercase text-k-gold-lit">
              The request
            </span>
            {/* "Six fields, then a real number." was rejected on 29 Jul 2026
                for sounding like a slogan rather than a heading. This one
                describes the thing underneath it. */}
            <h2 className="font-display text-k-d2 font-black text-k-on-dark">
              Send us the lane.
            </h2>
            {/* A paragraph sat here reading "This goes straight to the person
                who drives the truck. Nothing here is automated and nobody
                else sees it." It was a summary of the three numbered points
                further down this same panel, which say it reaches dispatch
                with no shared inbox in between, that nothing is automated, and
                what does and does not happen afterwards. Saying it first in
                shorter words spent the three points before they were read. */}

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
                deciding whether to fill it in.

                ONE RULE ABOVE THE BLOCK, NONE INSIDE IT. The previous version
                drew a hairline between every item, which cut a short column
                into three shorter ones. The gap does that job here, and the
                single rule is what separates this from the phone number above
                rather than what separates the items from each other. */}
            <ul className="grid grid-cols-1 gap-x-10 gap-y-8 border-t border-k-rule-dark pt-8 sm:grid-cols-2">
              {NEXT_STEPS.map((step, i) => (
                <li key={step.title}>
                  <Reveal variant="settle" index={i} className="flex flex-col gap-2">
                    <h2 className="font-text text-k-micro uppercase text-k-gold-lit">
                      {step.title}
                    </h2>
                    <p className="font-text text-k-small text-k-on-dark-soft">
                      {step.body}
                    </p>
                  </Reveal>
                </li>
              ))}
            </ul>
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
