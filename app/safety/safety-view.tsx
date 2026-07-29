"use client";

import Image from "next/image";
import Link from "next/link";
import HeroVideo from "@/components/k/HeroVideo";
import Reveal, { RuleDraw } from "@/components/k/Reveal";
import Copy from "@/components/k/Copy";
import { fill, linkHref } from "@/lib/content";
import { useTina, tinaField } from "tinacms/dist/react";
import type { TinaPage } from "@/lib/tina";

/**
 * SAFETY, THE HALF THAT DRAWS.
 *
 * app/safety/page.tsx fetches on the server and hands the result down. This half
 * subscribes with useTina, which is what makes the visual editor work: inside
 * /admin the page redraws as the client types, and any element carrying a
 * data-tina-field can be clicked to jump straight to its field.
 *
 * Outside the editor useTina hands back exactly what it was given, so on the
 * live site this renders once and costs nothing.
 *
 * The markup below was moved here unchanged. Only the data source differs: it
 * is the live document now rather than the JSON file, and lib/tina.ts falls
 * back to that file whenever Tina cannot be reached.
 */

/**
 * The shape of the content, taken from the file itself.
 *
 * Tina's generated types mark every field optional because every field in
 * the CMS can be emptied, which would mean writing `?.` through markup that
 * is otherwise readable. The JSON on disk is the canonical shape and the
 * schema mirrors it, so the live data is read against that. `typeof
 * import(...)` is type-only and adds nothing to the browser bundle.
 *
 * Fields really can come back empty, so fill() and link() tolerate null and
 * every list is guarded before it is mapped.
 */
type Content = typeof import("@/content/pages/safety.json");

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


/**
 * EVERY LINE IN THE CREDENTIALS LIST HAS TO BE CHECKABLE BY A BROKER WITHOUT
 * ASKING US. That is the whole argument of the page, so it is the one rule to
 * hold when editing that list in the CMS.
 *
 * The note on the MC number reads "Operating authority, active" and not "in
 * good standing", because good standing is not a field FMCSA publishes and
 * operating status is. On the one page whose argument is that everything can be
 * checked, a line that cannot be checked undoes the rest.
 *
 * The DOT and MC numbers are written as {usdot} and {mc} tokens, so the list,
 * the description a screen reader reads off the door decal, the search result
 * and the footer can never disagree with content/site.json.
 */

/**
 * REDRAWN 29 JUL 2026, because the first set were clip-art.
 *
 * They were a hex nut, a clock, a speech bubble and a shipping crate: the four
 * shapes any icon set gives you for free, and none of them said anything a
 * carrier would say. A crate for "cargo" is what a stock library thinks
 * freight looks like; KUL hauls a sealed 53 foot van, not a wooden box.
 *
 * These are drawn from the clause each one heads, not from the category:
 *
 *   maintenance    a wheel and hub seen straight on, which is the part that is
 *                  actually checked before every dispatch
 *   hours          a clock, kept, because the clause is literally about the
 *                  hours-of-service clock, but redrawn as a dial with the
 *                  eleven-hour mark ticked rather than a generic round face
 *   communication  a handset, not a chat bubble. The promise is a phone call
 *                  from a person, and a speech bubble is what software does
 *   cargo          a trailer door with the seal hanging on it, which is the
 *                  exact object the clause promises to put a number on
 *
 * ON THE DRAWING ITSELF. One weight, 1.4, round caps and joins, everything on
 * a 24 grid with a 2 unit margin, no fills. That consistency is most of what
 * separates a considered set from four icons that happen to sit together, and
 * it is why a fifth must be drawn to the same rules rather than pasted in.
 *
 * TO ADD ONE: draw it here first, then add it to COMMITMENTS below using the
 * same one word name.
 */
const ICONS = {
  // A wheel: rim, hub and five studs. The pre-trip inspection, drawn.
  maintenance: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 2.9v2.1M20.6 8.2l-2 .7M17.3 19.2l-1.2-1.7M6.7 19.2l1.2-1.7M3.4 8.2l2 .7" />
    </>
  ),
  // The hours clock, with the eleven-hour mark ticked off the dial.
  hours: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 6.9V12l3.4 2" />
      <path d="M12 3v1.4" />
    </>
  ),
  // A handset, because the promise is a call from a person.
  communication: (
    <path d="M7.4 3.6 9.9 8 8.2 10a11.4 11.4 0 0 0 5.8 5.8l2-1.7 4.4 2.5v3a1.4 1.4 0 0 1-1.5 1.4C10.2 20.4 3.6 13.8 3 5.1A1.4 1.4 0 0 1 4.4 3.6Z" />
  ),
  // A trailer door with the seal hanging on it. The number goes on the paper.
  cargo: (
    <>
      <path d="M4 4.4h16v15.2H4Z" />
      <path d="M12 4.4v15.2" />
      <path d="M9.4 11.4h-1M15.6 11.4h-1" />
      <path d="M20 8.6h1.6v3.2a1.6 1.6 0 0 1-3.2 0" />
    </>
  ),
} as const;

/**
 * Written as policy, because a policy is true from day one.
 *
 * ONE "X RATHER THAN Y" IN THIS SECTION, AND IT IS SPENT. It is "we say so
 * when you ask, not when we are late", where the contrast carries a real
 * difference in behaviour. There used to be four of them across these clauses
 * and the section rail above, and at that density the shape reads as a house
 * tic rather than as a distinction. If you add another, take that one out.
 */
/**
 * The clauses, written as policy, because a policy is true from day one.
 *
 * ONE "X RATHER THAN Y" IN THIS SECTION, AND IT IS SPENT. It is "we say so
 * when you ask, not when we are late", where the contrast carries a real
 * difference in behaviour. There used to be four of them across these clauses
 * and the section rail above, and at that density the shape reads as a house
 * tic rather than as a distinction. If you add another, take that one out.
 *
 * A clause whose `icon` does not name one of the four drawings above prints
 * without a mark rather than failing, so a fifth clause added in the CMS
 * degrades quietly. Draw it a mark rather than leaving it that way.
 */
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
 * Empty on purpose, and the section does not render at all while it is. KUL
 * has not carried enough freight to have earned one honestly.
 *
 * TO PUBLISH THE FIRST QUOTATION: add it at /admin under "Safety page", and
 * the section appears on its own without anybody having to put it back.
 *
 * NEVER PUBLISH ONE NOBODY SAID. The argument of this entire page is that
 * every line on it can be checked, and an invented quotation cannot.
 *
 * The annotation is load bearing while the list is empty: an empty array in
 * JSON infers as never[], and without it every read below fails to compile.
 */

export default function SafetyView(props: TinaPage<{ safetyPage: unknown }>) {
  // Outside the editor this hands straight back what the server fetched.
  const { data } = useTina({
    query: props.query ?? "",
    variables: props.variables ?? {},
    data: props.data,
  });
  const page = data.safetyPage as unknown as Content;

  // Derived from the content, so it has to be built per render now that
  // the content arrives at runtime rather than from a static import.
  const COMMITMENTS = page.commitments.items;
  const TESTIMONIALS: Testimonial[] = page.testimonials.items;

  return (
    <>
      {/* A near empty opening. No photograph, because confidence here is
          shown by restraint rather than by a picture of a truck. */}
      <section className="bg-k-paper px-6 pb-24 pt-44 md:px-12 lg:px-24">
        <div className="mx-auto flex max-w-[900px] flex-col items-center gap-8 text-center">
          <p className="flex items-center gap-4">
            <span className="h-px w-12 shrink-0 bg-k-gold" aria-hidden="true" />
            <span className="font-text text-k-label uppercase text-k-gold">
              {fill(page.opening.eyebrow)}
            </span>
          </p>
          <h1
              data-tina-field={tinaField(page.opening, "heading")}
              className="font-display text-k-d1 font-black text-k-ink"
            >
              {fill(page.opening.heading)}
            </h1>
          {/* The tail used to run "so this page gives you the things you can
              verify today and the standards we hold ourselves to while that
              record is built", which is the page describing its own table of
              contents to a reader who is about to see it. The two section
              headings underneath say the same thing and are impossible to
              miss. */}
          <Copy
            text={page.opening.lede}
            className="max-w-[620px] font-text text-k-lede text-k-ink-soft"
            linkClassName="underline underline-offset-4"
          />
        </div>
      </section>

      {/* Verifiable credentials, each linked to the record where possible. */}
      <section className="bg-k-surface px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-[1248px]">
          <Reveal>
            <h2
              data-tina-field={tinaField(page.credentials, "heading")}
              className="pb-10 font-display text-k-d3 font-black text-k-ink"
            >
              {fill(page.credentials.heading)}
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
          {/* THE CAPTION IS GONE AND THE PICTURE STAYS. "The decal on the
              tractor door" was struck out on 29 Jul 2026. It labelled a
              photograph of a decal as a photograph of a decal, which the
              picture manages on its own, and it sat directly above a list that
              prints the same two numbers at four times the size. The
              description a screen reader gets is unchanged, because that one
              is doing real work: it reads the numbers out. */}
          <Reveal variant="settle" className="pb-12">
            <Image
              src={page.credentials.decal}
              alt={fill(page.credentials.decalAlt)}
              width={900}
              height={599}
              className="h-auto w-full max-w-[380px] rounded-md"
            />
          </Reveal>
          <ul className="border-t border-k-rule-strong">
            {page.credentials.items.map((item, i) => (
              <Reveal key={item.label} index={i}>
                <li className="flex flex-col gap-2 border-b border-k-rule py-6 md:flex-row md:items-baseline md:gap-8">
                  <span className="font-text text-k-micro uppercase text-k-ink-faint md:w-[180px] md:shrink-0">
                    {fill(item.label)}
                  </span>
                  <span className="font-display text-k-d3 font-black tabular-nums text-k-ink md:w-[300px] md:shrink-0">
                    {fill(item.value)}
                  </span>
                  {/* A row with no link set prints its note as plain text.
                      That is how the MC number and the base read today: there
                      is no public page to send a broker to for either. */}
                  {item.href ? (
                    <Link
                      href={linkHref(item.href)}
                      className="w-fit border-b border-k-gold pb-0.5 font-text text-k-small text-k-ink-soft"
                    >
                      {fill(item.note)}
                    </Link>
                  ) : (
                    <span className="font-text text-k-small text-k-ink-soft">
                      {fill(item.note)}
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
          an interstate at night, uncut and silent.

          It is here rather than anywhere else on the site because this is the
          page that admits KUL has no safety rating history yet and asks to be
          judged on written policy instead. Showing the conditions is the one
          place the argument can put evidence where a claim would otherwise
          go. Anyone who has asked their computer to reduce motion gets the
          still frame, which reads perfectly well on its own. */}
      <section className="relative flex min-h-[460px] items-end overflow-hidden bg-k-void">
        <HeroVideo
          name={page.dashcam.video}
          poster={page.dashcam.poster}
          label="the dashcam footage"
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.35)_0%,rgba(0,0,0,0.15)_45%,rgba(0,0,0,0.85)_100%)]"
          aria-hidden="true"
        />
        <div className="relative mx-auto w-full max-w-[1248px] px-6 pb-14 md:px-12 lg:px-24">
          <Copy
            text={page.dashcam.caption}
            className="max-w-[620px] font-text text-k-lede text-k-on-dark"
            linkClassName="underline underline-offset-4"
          />
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
            <h2
              data-tina-field={tinaField(page.commitments, "heading")}
              className="font-display text-k-d3 font-black text-k-ink"
            >
              {fill(page.commitments.heading)}
            </h2>
            <p className="pt-4 font-text text-k-small text-k-ink-soft">
              {fill(page.commitments.note)}
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
                        {ICONS[item.icon as keyof typeof ICONS]}
                      </svg>
                      <h3
              data-tina-field={tinaField(item, "title")}
              className="font-text text-k-small font-semibold uppercase tracking-[0.1em] text-k-ink"
            >
              {fill(item.title)}
            </h3>
                    </div>
                    <Copy
                      text={item.body}
                      className="max-w-[62ch] font-text text-k-body text-k-ink-soft"
                      linkClassName="underline underline-offset-4"
                    />
                  </div>
                </Reveal>
              </li>
            ))}
            <RuleDraw index={COMMITMENTS.length} />
          </ol>
        </div>
      </section>

      {/* THE QUOTATION SLOT, WHICH NO LONGER PRINTS ITSELF EMPTY.

          It used to render whether or not there was anything in it: a heading
          reading "What customers say", a dashed box underneath saying the
          section was reserved and not yet filled, a sentence explaining that
          KUL had not carried enough freight to have earned a quotation
          honestly, and a counter reading 00 / 00. All of that was true and
          none of it was worth a broker's scroll. It told them nothing they
          could act on, and the About page already carries the same admission
          in one line, in its "Not yet" block, where it belongs beside the
          other two things KUL does not have yet.

          So the section is now conditional on there being a quotation. The
          filled state below is untouched and appears on its own the day the
          first one is added to TESTIMONIALS, without anybody having to
          remember to put the section back. */}
      {TESTIMONIALS.length > 0 ? (
        <section className="bg-k-surface px-6 py-28 md:px-12 lg:px-24">
          <div className="mx-auto max-w-[1248px]">
            <div className="flex max-w-[744px] flex-col gap-7">
              <Reveal>
                <h2
              data-tina-field={tinaField(page.testimonials, "heading")}
              className="font-display text-k-d2 font-black text-k-ink"
            >
              {fill(page.testimonials.heading)}
            </h2>
              </Reveal>

              <Reveal className="flex flex-col gap-5 border border-k-rule bg-k-paper p-8">
                <blockquote className="max-w-[560px] font-text text-k-lede text-k-ink">
                  “{TESTIMONIALS[0].quote}”
                </blockquote>
                <p className="font-text text-k-small text-k-ink-soft">
                  {TESTIMONIALS[0].name} · {TESTIMONIALS[0].company} ·{" "}
                  {TESTIMONIALS[0].lane}
                </p>
              </Reveal>

              {/* Paging controls. They stay inert until there is more than one
                  quotation to page between. */}
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
                  01 / {String(TESTIMONIALS.length).padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* There is deliberately no closing call to action here. The footer on
          every page already carries the same dark band, the same Request a
          quote button and the same phone number, so putting one here as well
          simply printed it twice in a row. */}
    </>
  );
}
