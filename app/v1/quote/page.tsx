import type { Metadata } from "next";
import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import QuoteForm from "@/components/concept/forms/QuoteForm";
import { site } from "@/lib/site";
import PageClosing from "@/components/concept/PageClosing";

export const metadata: Metadata = {
  title: "Request a Quote",
  description:
    "Send your lane and a person prices it the same business day. Power Only, Dry Van, Reefer, Dedicated, Regional, Expedited, and OTR.",
};

export default function ConceptQuote() {
  return (
    <>
      <section className="relative min-h-[60svh] overflow-hidden">
        <Image
          src="/images/stock/road-night-light-trails.jpg"
          alt="Highway light trails at night"
          fill
          priority
          quality={82}
          sizes="100vw"
          className="object-cover object-[center_65%]"
        />
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(22,22,22,0.5),transparent_45%,rgba(22,22,22,0.92))]" />
        <div className="kul-fade-slow relative px-6 pt-[15vh] text-center">
          <h1 className="kul-grad-text font-mont text-[clamp(1.35rem,2.3vw,2.05rem)] font-semibold uppercase tracking-[0.3em] [text-shadow:none]">
            Request a Quote
          </h1>
        </div>
      </section>

      <section className="bg-[#F8F8F8]">
        <div className="mx-auto max-w-3xl px-6 py-20 md:py-24">
          <Reveal className="rounded-2xl border border-ink/10 bg-white p-8 md:p-10">
            <QuoteForm />
          </Reveal>
          <Reveal className="mt-8 text-center text-sm text-graywarm-deep">
            <p>
              Time-critical?{" "}
              <a href={site.phoneHref} className="font-semibold text-ink underline-offset-4 hover:underline">
                Call {site.phone}
              </a>
              . Dispatch answers 24/7.
            </p>
            <p className="mt-3 text-xs uppercase tracking-[0.2em]">
              USDOT {site.usdot} · MC {site.mc} · Licensed &amp; Insured
            </p>
          </Reveal>
        </div>
      </section>

      <PageClosing />
    </>
  );
}
