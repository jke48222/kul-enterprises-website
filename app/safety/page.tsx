import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import HeroVideo from "@/components/k/HeroVideo";
import Reveal, { RuleDraw } from "@/components/k/Reveal";

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
    note: "Certificate issued by our agent, with your company named as holder",
    href: "/carrier-packet",
  },
  {
    label: "Base",
    value: site.location,
    note: "Southeast based, authorised in 48 states",
    href: null,
  },
] as const;

/**
 * The four small drawings that head each commitment below.
 *
 * These are drawn here as shapes rather than loaded as picture files, so they
 * stay perfectly sharp on any screen and pick up their colour from the page.
 * Every one is drawn on the same 24 by 24 square, which is what keeps them
 * looking like a matched set rather than four unrelated pictures.
 *
 * TO CHANGE A DRAWING: replace the shapes inside the matching entry. To add a
 * fifth commitment, add a drawing here first, then add it to COMMITMENTS below
 * using the same one word name.
 */
const ICONS = {
  // A nut, the kind turned by a spanner. Stands for the truck being worked on.
  maintenance: (
    <>
      <path d="M12 2.6 20.1 7v10L12 21.4 3.9 17V7Z" />
      <circle cx="12" cy="12" r="3.6" />
    </>
  ),
  // A clock face reading ten past ten. Stands for the hours in the day.
  hours: (
    <>
      <circle cx="12" cy="12" r="9.2" />
      <path d="M12 6.6V12l4 2.4" />
    </>
  ),
  // A speech bubble. Stands for the phone being picked up.
  communication: <path d="M3.2 4.6h17.6v11.2h-9.4l-4.6 3.6v-3.6H3.2Z" />,
  // A crate seen from the corner. Stands for the freight itself.
  cargo: (
    <>
      <path d="m12 2.8 8.6 4v10.4l-8.6 4-8.6-4V6.8Z" />
      <path d="m3.4 6.8 8.6 4 8.6-4" />
      <path d="M12 10.8v10.4" />
    </>
  ),
} as const;

/** Written as policy, because a policy is true from day one. */
const COMMITMENTS = [
  {
    icon: "maintenance",
    title: "Maintenance",
    body: "The truck is inspected before every dispatch, not on a schedule that suits the calendar. Anything found is fixed before the load moves, even when that costs us the load.",
  },
  {
    icon: "hours",
    title: "Hours of service",
    body: "Hours are planned before dispatch rather than managed after it. If a lane cannot be run legally inside the clock, we say so when you ask, not when we are late.",
  },
  {
    icon: "communication",
    title: "Communication",
    body: "You hear about a delay from us first. One phone number reaches the person driving the truck, around the clock, and it is answered.",
  },
  {
    icon: "cargo",
    title: "Cargo",
    body: "Freight is secured to FMCSA standards and sealed at origin where a seal applies. The seal number goes on the paperwork so the receiver can check it.",
  },
] as const satisfies readonly { icon: keyof typeof ICONS; title: string; body: string }[];

/** One customer quotation, and who said it. */
type Testimonial = {
  quote: string;
  name: string;
  company: string;
  lane: string;
};

/**
 * CUSTOMER QUOTATIONS
 *
 * Empty on purpose. KUL has not carried enough freight to have earned one
 * honestly, so the section prints a reserved box saying exactly that, and the
 * counter beneath it reads 00 / 00.
 *
 * TO PUBLISH THE FIRST QUOTATION: add it to the list below, like this, and
 * the reserved box is replaced by the words themselves.
 *
 *   { quote: "They called before we had to.", name: "A. Fielding",
 *     company: "Kestrel Foods", lane: "Atlanta to Charlotte" },
 *
 * Never write one nobody said. The point of printing an empty box is that it
 * is verifiable, and an invented quotation is not.
 */
const TESTIMONIALS: Testimonial[] = [];

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

          {/* THE SAME NUMBERS, ON THE DOOR.
              Federal rules require a carrier to letter its USDOT number on
              the tractor, so this decal is the physical object the list below
              is a copy of. It is here as evidence rather than as decoration,
              which is why it sits above the list and is captioned as a thing
              rather than styled as a badge.

              The numbers on it have to match content/site.json. If the DOT or
              MC number ever changes, the artwork is reprinted for the truck
              anyway, and the new file replaces this one. A decal on the site
              that disagrees with the door is worse than no decal. */}
          <Reveal variant="settle" className="flex flex-col gap-3 pb-12">
            <Image
              src="/images/brand/door-decal.webp"
              alt={`The decal on the tractor door, reading KUL Enterprises LLC, USDOT ${site.usdot}, MC ${site.mc}, ${site.location}`}
              width={900}
              height={599}
              className="h-auto w-full max-w-[380px] rounded-md"
            />
            <span className="font-text text-k-micro uppercase text-k-ink-soft">
              The decal on the tractor door
            </span>
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

      {/* TWELVE SECONDS OF THE REAL THING
          Not a photograph and not a stock clip: this is Mark's own dashcam,
          multi-lane in heavy rain, trucks running lights, uncut and silent.

          It is here rather than anywhere else on the site because this is the
          page that admits KUL has no safety rating history yet and asks to be
          judged on written policy instead. Showing the conditions is the one
          place the argument can put evidence where a claim would otherwise
          go. Anyone who has asked their computer to reduce motion gets the
          still frame, which reads perfectly well on its own. */}
      <section className="relative flex min-h-[460px] items-end overflow-hidden bg-k-void">
        <HeroVideo
          name="dash-rain"
          poster="/videos/dash-rain-poster.jpg"
          className="absolute inset-0 h-full w-full object-cover opacity-70"
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
        {/* These are set as a policy document rather than as four cards: the
            section title held out to the left, then numbered clauses running
            down a single reading column.

            The register is deliberate. This page asks to be checked, and a
            numbered clause at a proper reading measure reads like something
            written to be held to, where a two by two grid of cards reads like
            marketing. It is also the reason the clause titles are set small
            and tracked rather than in the big display face. */}
        <div className="mx-auto flex max-w-[1248px] flex-col gap-12 lg:flex-row lg:gap-24">
          <Reveal variant="settle" className="lg:w-[300px] lg:shrink-0">
            <h2 className="font-display text-k-d3 font-black text-k-ink">
              What we hold ourselves to
            </h2>
            <p className="pt-4 font-text text-k-small text-k-ink-soft">
              Written as standing policy. Every clause applies from the first
              load rather than once a record has been built.
            </p>
          </Reveal>

          <ol className="flex flex-1 flex-col">
            {COMMITMENTS.map((item, i) => (
              <li key={item.title} className="flex flex-col">
                <RuleDraw index={i} />
                <Reveal index={i} className="flex gap-6 py-8 md:gap-10">
                  <span className="w-8 shrink-0 pt-1 font-text text-k-micro uppercase tabular-nums text-k-gold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex flex-col gap-3">
                    {/* The drawing is decoration, so it is hidden from screen
                        readers and the clause title carries the meaning. */}
                    <div className="flex items-center gap-3">
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                        className="shrink-0 text-k-gold"
                      >
                        {ICONS[item.icon]}
                      </svg>
                      <h3 className="font-text text-k-small font-semibold uppercase tracking-[0.1em] text-k-ink">
                        {item.title}
                      </h3>
                    </div>
                    <p className="max-w-[62ch] font-text text-k-body text-k-ink-soft">
                      {item.body}
                    </p>
                  </div>
                </Reveal>
              </li>
            ))}
            <RuleDraw index={COMMITMENTS.length} />
          </ol>
        </div>
      </section>

      {/* THE QUOTATION SLOT, HELD OPEN

          Drawn on the Paper artboard "Safety — desktop 1440". The section is
          finished and deliberately left empty. A dashed reserved box says why
          in plain words, and the counter beneath reads 00 / 00 because there
          is nothing yet to page through.

          The section is printed empty rather than left out, so a broker can
          see the structure exists and that nothing has been put in it. */}
      <section className="bg-k-surface px-6 py-28 md:px-12 lg:px-24">
        <div className="mx-auto max-w-[1248px]">
          <div className="flex max-w-[744px] flex-col gap-7">
            <Reveal>
              <h2 className="font-display text-k-d2 font-black text-k-ink">
                What customers say
              </h2>
            </Reveal>

            {TESTIMONIALS.length === 0 ? (
              <Reveal className="flex flex-col gap-4 border border-dashed border-k-rule-strong p-8">
                <span className="font-text text-k-micro uppercase text-k-ink-faint">
                  Reserved, not yet filled
                </span>
                <p className="max-w-[520px] font-text text-k-body text-k-ink-soft">
                  This is where customer quotations will sit. It is empty
                  because KUL has not carried enough freight to have earned one
                  honestly. The structure is built and waiting; nothing
                  invented goes here.
                </p>
              </Reveal>
            ) : (
              <Reveal className="flex flex-col gap-5 border border-k-rule bg-k-paper p-8">
                <blockquote className="max-w-[560px] font-text text-k-lede text-k-ink">
                  “{TESTIMONIALS[0].quote}”
                </blockquote>
                <p className="font-text text-k-small text-k-ink-soft">
                  {TESTIMONIALS[0].name} · {TESTIMONIALS[0].company} ·{" "}
                  {TESTIMONIALS[0].lane}
                </p>
              </Reveal>
            )}

            {/* Paging controls. They sit here so the section is complete, and
                stay inert until there is more than one quotation to page. */}
            <div className="flex items-center gap-3">
              <span
                className="h-9 w-9 shrink-0 rounded-full border border-k-rule-strong"
                aria-hidden="true"
              />
              <span
                className="h-9 w-9 shrink-0 rounded-full border border-k-rule-strong"
                aria-hidden="true"
              />
              <span className="pl-2 font-text text-k-micro uppercase tabular-nums text-k-ink-faint">
                {String(Math.min(TESTIMONIALS.length, 1)).padStart(2, "0")} /{" "}
                {String(TESTIMONIALS.length).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* There is deliberately no closing call to action here. The footer on
          every page already carries the same dark band, the same Request a
          quote button and the same phone number, so putting one here as well
          simply printed it twice in a row. */}
    </>
  );
}
