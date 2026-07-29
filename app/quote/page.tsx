import type { Metadata } from "next";
import { site } from "@/lib/site";
import QuoteForm from "@/components/forms/QuoteForm";
import Reveal from "@/components/k/Reveal";
import Breadcrumb from "@/components/k/Breadcrumb";
import Copy from "@/components/k/Copy";
import { fill } from "@/lib/content";
import page from "@/content/pages/quote.json";

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
 * THE QUESTIONS THEMSELVES are in components/forms/QuoteForm.tsx and their
 * labels are at /admin under "Forms". Everything this page says around them is
 * under "Quote page".
 *
 * WHAT HAPPENS AFTER IT IS SENT is the three labelled pairs beside the form.
 * THE NUMBERS ARE GONE from those: they were 01, 02, 03 down a ruled column
 * with the title set bold and the body running on from it inside the same
 * sentence, and the client rejected the format. The run of bold into grey
 * inside one line is what made it look cramped, and the numbering was the
 * fourth numbered list on a site that already has three. They are laid out as
 * labelled pairs now, taken from Fiasco's contact page on Mobbin, where each
 * item is a small caps label with its detail underneath and two sit to a row.
 * It reads wider and shorter, which is what this column needed: it is beside a
 * form, not competing with one.
 *
 * THE CLOSING ROW OF FACTS matches the strip on the home page. See the note
 * there on "Owner answers dispatch": one man who drives cannot also be a desk
 * answering 24/7, and /road-ahead says dispatch cover is a stage still to come.
 */

export const metadata: Metadata = {
  title: fill(page.meta.title),
  description: fill(page.meta.description),
};

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
            {fill(page.opening.heading)}
          </h1>
          {/* The count came out of this line on 29 Jul 2026: the panel below
              counted the fields too, so the page counted them twice. That
              panel's headline has since been rewritten as well. */}
          <Copy
            text={page.opening.lede}
            className="max-w-[560px] font-text text-k-lede text-k-ink-soft"
            linkClassName="underline underline-offset-4"
          />
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
              {fill(page.request.eyebrow)}
            </span>
            {/* "Six fields, then a real number." was rejected on 29 Jul 2026
                for sounding like a slogan rather than a heading. This one
                describes the thing underneath it. */}
            <h2 className="font-display text-k-d2 font-black text-k-on-dark">
              {fill(page.request.heading)}
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
                {fill(page.request.skipLabel)}
              </span>
              <a
                href={site.phoneHref}
                className="w-fit font-display text-k-d3 font-black tabular-nums text-k-gold-lit"
              >
                {site.phone}
              </a>
              <p className="font-text text-k-small text-k-on-dark-soft">
                {fill(page.request.skipNote)}
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
              {page.request.nextSteps.map((step, i) => (
                <li key={step.title}>
                  <Reveal variant="settle" index={i} className="flex flex-col gap-2">
                    <h2 className="font-text text-k-micro uppercase text-k-gold-lit">
                      {fill(step.title)}
                    </h2>
                    <Copy
                      text={step.body}
                      className="font-text text-k-small text-k-on-dark-soft"
                      linkClassName="underline underline-offset-4"
                    />
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
          {page.credentials.items.map((item) => (
            <span
              key={item}
              className="font-text text-k-micro uppercase tabular-nums text-k-on-dark-soft"
            >
              {fill(item)}
            </span>
          ))}
          <span className="font-text text-k-micro uppercase text-k-gold-lit md:ml-auto">
            {fill(page.credentials.locationLine)}
          </span>
        </div>
      </section>
    </>
  );
}
