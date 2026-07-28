import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/forms/ContactForm";
import { CopyButton } from "@/components/v2/CopyButton";
import { LineReveal } from "@/components/v2/LineReveal";
import { PageHero } from "@/components/v2/PageHero";
import { Rise, RiseGroup } from "@/components/v2/Rise";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach KUL Enterprises dispatch 24/7: 678-972-1148 or dispatch@kulenterprises.com. Home base Loganville, GA; nationwide service.",
};

const CONTAINER = "mx-auto w-full max-w-[1760px] px-[clamp(20px,5vw,90px)]";

/**
 * CONTACT — §4.9. Ink opener → ink directory (humans before forms) →
 * paper form. No ending band; straight to the curtain Footer.
 * Gold ledger: the ContactForm submit pill is the page's only gold
 * (nav CTA renders ghost on this route — §3.1).
 */
export default function ContactPage() {
  return (
    <>
      {/* 1 — Opener. PageHero's deck prop is string-only, so the deck
          sentence renders via children to carry its inline /quote link. */}
      <PageHero variant="compact" eyebrow="CONTACT" titleLines={["Talk to", "a person."]}>
        <p className="max-w-[52ch] text-body-l text-paper/80">
          Dispatch answers around the clock. Freight quotes have a faster
          lane —{" "}
          <Link href="/quote" className="link-hairline text-paper">
            send the lane here &rarr;
          </Link>
        </p>
      </PageHero>

      {/* 2 — Directory (Aman pattern: humans before forms). The visible h2
          at h3 scale is the page's first h2 — without it the column
          headings below would skip levels (§2.1). */}
      <section data-ground="ink" className="bg-ink py-band-sm">
        <div className={CONTAINER}>
          <LineReveal
            as="h2"
            lines={["Reach dispatch."]}
            className="max-w-[14ch] font-omnibus text-h3 text-cream"
          />

          <RiseGroup className="mt-12 grid grid-cols-1 divide-y divide-white/[0.12] border-y border-white/[0.12] md:grid-cols-3 md:divide-x md:divide-y-0">
            <Rise className="py-8 md:py-10 md:pr-[clamp(24px,3vw,48px)]">
              <p className="text-micro uppercase text-paper/60">
                Dispatch &mdash; 24/7
              </p>
              <a
                href={site.phoneHref}
                className="link-hairline mt-4 inline-block font-omnibus text-h3 tabular-nums text-cream"
              >
                {site.phone}
              </a>
            </Rise>

            <Rise className="py-8 md:px-[clamp(24px,3vw,48px)] md:py-10">
              <p className="text-micro uppercase text-paper/60">Email</p>
              <div className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-paper/80">
                <a
                  href={`mailto:${site.email}`}
                  className="link-hairline break-all text-body-l"
                >
                  {site.email}
                </a>
                <CopyButton value={site.email} />
              </div>
            </Rise>

            <Rise className="py-8 md:py-10 md:pl-[clamp(24px,3vw,48px)]">
              <p className="text-micro uppercase text-paper/60">Home base</p>
              <p className="mt-4 text-body-l text-paper/80">{site.location}</p>
              <p className="mt-3 text-micro uppercase text-paper/60">
                {site.serviceArea}
              </p>
              <p className="mt-1 text-micro uppercase tabular-nums text-paper/60">
                USDOT {site.usdot} &middot; MC {site.mc}
              </p>
            </Rise>
          </RiseGroup>
        </div>
      </section>

      {/* 3 — Form on paper. h2 at h3 scale; the gold submit pill inside
          ContactForm is this viewport's single gold spend. */}
      <section data-ground="paper" className="bg-paper py-band-sm">
        <div
          className={`${CONTAINER} grid grid-cols-1 gap-x-[clamp(16px,1.4vw,24px)] lg:grid-cols-12`}
        >
          <div className="lg:col-span-7 lg:col-start-2">
            <LineReveal
              as="h2"
              lines={["Or write it down."]}
              className="max-w-[14ch] font-omnibus text-h3 text-ink"
            />
            <Rise delay={0.15} className="mt-12">
              <ContactForm />
            </Rise>
          </div>
        </div>
      </section>

      {/* 4 — No ending band (§4.9): straight to the curtain Footer. */}
    </>
  );
}
