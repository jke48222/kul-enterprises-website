import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import QuoteForm from "@/components/forms/QuoteForm";
import { Reveal } from "@/components/motion/Reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Request a Freight Quote",
  description:
    "Tell KUL Enterprises your lane: origin, destination, freight type, and pickup date. A real quote comes back the same business day. Southeast based, nationwide service.",
};

const steps = [
  {
    step: "1",
    title: "Tell us the lane",
    body: "Five fields. Origin, destination, freight type, pickup date, and how to reach you.",
  },
  {
    step: "2",
    title: "Get a real answer",
    body: "A quote from dispatch the same business day. A number we stand behind, not a teaser rate.",
  },
  {
    step: "3",
    title: "Wheels turn",
    body: "Confirm the details and your freight is on the schedule, with updates until it's signed for.",
  },
];

export default function QuotePage() {
  return (
    <>
      <PageHero
        eyebrow="Request a Quote"
        title="A real quote, the same business day."
        lede="No rate bots, no runaround. Tell us the lane and a person who can actually commit capacity will answer."
        image="/images/stock/road-night-light-trails.jpg"
        imagePosition="center 70%"
      />

      <div className="section-light">
        <div className="mx-auto max-w-content px-6 py-20 md:py-28">
          <div className="grid gap-16 lg:grid-cols-[400px_1fr]">
            <Reveal>
              <ol className="space-y-8">
                {steps.map((s) => (
                  <li key={s.step} className="flex gap-5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-gold-dim/50 font-display font-bold text-gold-dim">
                      {s.step}
                    </span>
                    <div>
                      <h2 className="font-display text-lg font-bold">
                        {s.title}
                      </h2>
                      <p className="mt-1.5 leading-relaxed text-graywarm-deep">
                        {s.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-10 border-t border-ink/10 pt-6 text-sm text-graywarm-deep">
                <p>
                  Time-critical?{" "}
                  <a
                    href={site.phoneHref}
                    className="font-semibold text-ink underline-offset-4 hover:underline"
                  >
                    Call {site.phone}
                  </a>
                  . Dispatch answers 24/7.
                </p>
                <p className="mt-3 text-xs uppercase tracking-eyebrow">
                  USDOT {site.usdot} · MC {site.mc} · Licensed &amp; Insured
                </p>
              </div>
            </Reveal>

            <Reveal>
              <div className="border border-ink/10 bg-white p-8 md:p-10">
                <h2 className="font-display text-xl font-bold">
                  Your lane, our answer
                </h2>
                <p className="mb-8 mt-2 text-sm text-graywarm-deep">
                  Five required fields. Extra detail is welcome but optional.
                </p>
                <QuoteForm />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </>
  );
}
