import type { Metadata } from "next";
import PageHero from "@/components/v2/PageHero";
import QuoteForm from "@/components/forms/QuoteForm";
import FaqAccordion from "@/components/v2/FaqAccordion";
import Eyebrow from "@/components/v2/Eyebrow";
import LineReveal from "@/components/v2/LineReveal";
import faq from "@/content/faq.json";

/**
 * QUOTE — §4.8. The conversion page: lean, fast, form above the fold on
 * laptop. Compact ink opener → paper form (the gold submit pill inside
 * QuoteForm is the page's only gold beyond chrome; the nav CTA renders
 * ghost on this route — §3.1) → paper FAQ with the load-bearing `id="faq"`
 * anchor (the Footer links to /quote#faq) → straight to the curtain Footer.
 * No CtaBand: the page IS the CTA.
 */

export const metadata: Metadata = {
  title: "Request a Quote",
  description:
    "Send your lane and a person prices it the same business day. Power Only, Dry Van, Reefer, Dedicated, Regional, Expedited, and OTR.",
};

const CONTAINER = "mx-auto w-full max-w-[1760px] px-[clamp(20px,5vw,90px)]";
const GRID = "grid grid-cols-1 gap-x-[clamp(16px,1.4vw,24px)] lg:grid-cols-12";

// faq.json items 1, 3, 8 (1-based): quote speed, licensed/insured, updates.
const FAQ_ITEMS = [faq.items[0], faq.items[2], faq.items[7]];

export default function QuotePage() {
  return (
    <>
      {/* 1 · Opener — compact ink band (§4.8.1). Gold: none. */}
      <PageHero
        variant="compact"
        eyebrow="REQUEST A QUOTE"
        titleLines={["Send your lane."]}
        deck="Priced by a person who can actually commit capacity. Answered the same business day."
      />

      {/* 2 · Form — paper, visible within first scroll (§4.8.2).
          Trust strip + tel fallback live inside QuoteForm above the submit;
          the gold submit pill is this viewport's single gold spend. */}
      <section data-ground="paper" className="bg-paper py-band-sm">
        <div className={CONTAINER}>
          <div className={GRID}>
            <div className="lg:col-start-2 lg:col-end-9">
              <QuoteForm />
            </div>
          </div>
        </div>
      </section>

      {/* 3 · FAQ — paper, id="faq" is load-bearing: the Footer links to
          /quote#faq (§4.8.3). Gold: none. */}
      <section
        id="faq"
        data-ground="paper"
        className="scroll-mt-24 bg-paper py-band-sm"
      >
        <div className={CONTAINER}>
          <div className={GRID}>
            <div className="lg:col-start-2 lg:col-end-11">
              <Eyebrow>STRAIGHT ANSWERS</Eyebrow>
              <LineReveal
                as="h2"
                lines={["Asked often."]}
                className="mt-6 max-w-[14ch] font-omnibus text-h2 text-ink"
              />
              <div className="mt-12">
                <FaqAccordion items={FAQ_ITEMS} ground="paper" jsonLd />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 · Ending — none. Straight to the curtain Footer (§4.8.4). */}
    </>
  );
}
