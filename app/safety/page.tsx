import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import Reveal from "@/components/k/Reveal";

/**
 * SAFETY PAGE
 *
 * The hardest page on the site to write honestly. KUL has one truck, no
 * years of safety record, no awards and no customer testimonials yet. This
 * page has to feel serious without inventing proof it does not have.
 *
 * Everything here is either a fact a broker can verify for themselves, or a
 * commitment written as policy rather than as an achievement. The testimonial
 * section is deliberately left out until there is a real one to publish.
 *
 * TO CHANGE THE DOT OR MC NUMBERS: edit content/site.json. They appear here
 * and in the footer from that one place.
 */

export const metadata: Metadata = {
  title: "Safety and Compliance",
  description: `KUL Enterprises is a licensed and insured freight carrier, USDOT ${site.usdot}, MC ${site.mc}. Verify our authority and safety record directly with the FMCSA.`,
};

/** Each of these can be checked by a broker without asking us. */
const CREDENTIALS = [
  {
    label: "USDOT number",
    value: site.usdot,
    note: "Look this up on the FMCSA SAFER system",
    href: `https://safer.fmcsa.dot.gov/query.asp?searchtype=ANY&query_type=queryCarrierSnapshot&query_param=USDOT&query_string=${site.usdot}`,
  },
  {
    label: "MC number",
    value: site.mc,
    note: "Operating authority, active and in good standing",
    href: null,
  },
  {
    label: "Insurance",
    value: "Licensed and insured",
    note: "Certificate available on request, or in the carrier packet",
    href: "/carrier-packet",
  },
  {
    label: "Base",
    value: site.location,
    note: "Southeast based, authorised in 48 states",
    href: null,
  },
] as const;

/** Written as policy, because a policy is true from day one. */
const COMMITMENTS = [
  {
    title: "Maintenance",
    body: "The truck is inspected before every dispatch, not on a schedule that suits the calendar. Anything found is fixed before the load moves, even when that costs us the load.",
  },
  {
    title: "Hours of service",
    body: "Hours are planned before dispatch rather than managed after it. If a lane cannot be run legally inside the clock, we say so when you ask, not when we are late.",
  },
  {
    title: "Communication",
    body: "You hear about a delay from us first. One phone number reaches the person driving the truck, around the clock, and it is answered.",
  },
  {
    title: "Cargo",
    body: "Freight is secured to FMCSA standards and sealed at origin where a seal applies. The seal number goes on the paperwork so the receiver can check it.",
  },
] as const;

export default function SafetyPage() {
  return (
    <>
      {/* A near empty opening. No photograph, because confidence here is
          shown by restraint rather than by a picture of a truck. */}
      <section className="bg-k-paper px-6 pb-24 pt-44 md:px-12 lg:px-24">
        <div className="mx-auto flex max-w-[900px] flex-col items-center gap-8 text-center">
          <p className="flex items-center gap-4">
            <span className="h-px w-12 shrink-0 bg-k-gold" aria-hidden="true" />
            <span className="font-text text-k-label uppercase text-k-gold">
              The responsibility
            </span>
          </p>
          <h1 className="font-display text-k-d1 font-black text-k-ink">
            Everything here can be checked.
          </h1>
          <p className="max-w-[620px] font-text text-k-lede text-k-ink-soft">
            KUL Enterprises has been running one truck since 2026. There is no
            long safety record to point at yet, so this page gives you the
            things you can verify today and the standards we hold ourselves to
            while that record is built.
          </p>
        </div>
      </section>

      {/* Verifiable credentials, each linked to the record where possible. */}
      <section className="bg-k-surface px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-[1248px]">
          <Reveal>
            <h2 className="pb-10 font-display text-k-d3 font-black text-k-ink">
              Authority and insurance
            </h2>
          </Reveal>
          <ul className="border-t border-k-rule-strong">
            {CREDENTIALS.map((item, i) => (
              <Reveal key={item.label} index={i}>
                <li className="flex flex-col gap-2 border-b border-k-rule py-6 md:flex-row md:items-baseline md:gap-8">
                  <span className="font-text text-k-micro uppercase text-k-ink-faint md:w-[180px] md:shrink-0">
                    {item.label}
                  </span>
                  <span className="font-display text-k-d3 font-black tabular-nums text-k-ink md:w-[300px] md:shrink-0">
                    {item.value}
                  </span>
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="w-fit border-b border-k-gold pb-0.5 font-text text-k-small text-k-ink-soft"
                    >
                      {item.note}
                    </Link>
                  ) : (
                    <span className="font-text text-k-small text-k-ink-soft">
                      {item.note}
                    </span>
                  )}
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* One documentary photograph. A real rig in real traffic, unstyled. */}
      <section className="relative flex min-h-[460px] items-end overflow-hidden bg-k-void">
        <Image
          src="/images/services/power-only-wide.jpg"
          alt="A tractor and trailer running in traffic"
          fill
          className="object-cover opacity-70"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.35)_0%,rgba(0,0,0,0.15)_45%,rgba(0,0,0,0.85)_100%)]"
          aria-hidden="true"
        />
        <div className="relative mx-auto w-full max-w-[1248px] px-6 pb-14 md:px-12 lg:px-24">
          <p className="max-w-[620px] font-text text-k-lede text-k-on-dark">
            Eleven years driving for other carriers, before a single mile was
            driven for this one.
          </p>
        </div>
      </section>

      {/* Commitments, written as policy rather than as achievement. */}
      <section className="bg-k-paper px-6 py-28 md:px-12 lg:px-24">
        <div className="mx-auto max-w-[1248px]">
          <Reveal>
            <h2 className="pb-12 font-display text-k-d2 font-black text-k-ink">
              What we hold ourselves to
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 gap-x-16 gap-y-10 md:grid-cols-2">
            {COMMITMENTS.map((item, i) => (
              <Reveal
                key={item.title}
                index={i}
                className="flex flex-col gap-3 border-t border-k-rule-strong pt-6"
              >
                <h3 className="font-display text-k-d3 font-black text-k-ink">
                  {item.title}
                </h3>
                <p className="font-text text-k-body text-k-ink-soft">
                  {item.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Said plainly rather than hidden, because saying it is the point. */}
      <section className="bg-k-warm px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto flex max-w-[820px] flex-col gap-5">
          <h2 className="font-display text-k-d3 font-black text-k-ink">
            What we do not have yet
          </h2>
          <p className="font-text text-k-body text-k-ink-soft">
            No customer testimonials, because KUL has not carried enough
            freight to have earned them honestly. No safety awards, because
            those take years of recorded miles. No fleet, because there is one
            truck. When any of that changes it will appear here, and not
            before.
          </p>
          <p className="font-text text-k-body text-k-ink-soft">
            A carrier that tells you what it is missing is easier to check than
            one that does not.
          </p>
        </div>
      </section>

      <section className="bg-k-coal px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto flex max-w-[1248px] flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="max-w-[520px] font-display text-k-d2 font-black text-k-on-dark">
            Ask us anything before you book.
          </h2>
          <div className="flex flex-wrap items-center gap-6">
            <Link
              href="/quote"
              className="rounded-full bg-k-on-dark px-8 py-4 font-text text-k-label uppercase text-k-ink transition-opacity duration-200 hover:opacity-85"
            >
              Request a quote
            </Link>
            <a
              href={site.phoneHref}
              className="font-display text-k-d3 font-black tabular-nums text-k-gold-lit"
            >
              {site.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
