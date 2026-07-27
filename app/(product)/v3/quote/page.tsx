import type { Metadata } from "next";
import PageHero from "@/components/v3/PageHero";
import QuoteForm from "@/components/forms/QuoteForm";
import FaqAccordion from "@/components/v3/FaqAccordion";
import Eyebrow from "@/components/v3/Eyebrow";
import LineReveal from "@/components/v3/LineReveal";
import faq from "@/content/faq.json";

/**
 * REQUEST A QUOTE — the conversion page: lean, fast, form above the fold
 * on laptop. Contract-exact QuoteForm (5 required fields + optional
 * details — research: each extra required field costs conversion). The
 * page IS the CTA; no ending band. Footer links target /v3/quote#faq.
 */

export const metadata: Metadata = {
  title: "Request a Quote",
  description:
    "Send your lane and a person prices it the same business day. Power Only, Dry Van, Reefer, Dedicated, Regional, Expedited, and OTR.",
};

const CONTAINER = "mx-auto w-full max-w-[1760px] px-[clamp(20px,5vw,90px)]";
const GRID = "grid grid-cols-1 gap-x-[clamp(16px,1.4vw,24px)] lg:grid-cols-12";

// faq.json items: quote speed, licensed/insured, updates.
const FAQ_ITEMS = [faq.items[0], faq.items[2], faq.items[7]];

export default function QuotePage() {
  return (
    <>
      {/* 1 · Opener — compact ink band. Gold: none (nav CTA goes ghost). */}
      <PageHero
        variant="compact"
        eyebrow="Request a Freight Quote"
        titleLines={["Send your lane."]}
        deck="Priced by a person who can actually commit capacity. Answered the same business day."
      />

      {/* 2 · Form — paper, visible within the first scroll. */}
      <section data-ground="paper" className="bg-paper py-band-sm">
        <div className={CONTAINER}>
          <div className={GRID}>
            <div className="lg:col-start-2 lg:col-end-9">
              <QuoteForm />
            </div>
          </div>
        </div>
      </section>

      {/* 3 · FAQ — id="faq" is load-bearing (Footer links here). */}
      <section
        id="faq"
        data-ground="paper"
        className="scroll-mt-24 bg-paper py-band-sm"
      >
        <div className={CONTAINER}>
          <div className={GRID}>
            <div className="lg:col-start-2 lg:col-end-11">
              <Eyebrow>Straight Answers</Eyebrow>
              <LineReveal
                as="h2"
                lines={["Asked often."]}
                className="mt-6 max-w-[14ch] text-d2 text-ink"
              />
              <div className="mt-12">
                <FaqAccordion items={FAQ_ITEMS} ground="paper" jsonLd />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
