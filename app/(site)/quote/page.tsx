import type { Metadata } from "next";
import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import QuoteForm from "@/components/forms/QuoteForm";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Request a Quote" };

export default function ConceptQuote() {
  return (
    <>
      <section className="relative flex min-h-[60svh] items-end overflow-hidden">
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
        <Reveal className="relative mx-auto w-full max-w-6xl px-6 pb-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
            Request a Quote
          </p>
          <h1 className="mt-4 max-w-2xl font-omnibus text-[clamp(2.2rem,4.5vw,3.4rem)] leading-tight text-[#F8F8F8]">
            A real quote, the same business day.
          </h1>
          <p className="mt-4 max-w-xl text-graywarm-light">
            No rate bots, no runaround. Tell us the lane and a person who can
            actually commit capacity will answer.
          </p>
        </Reveal>
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
    </>
  );
}
