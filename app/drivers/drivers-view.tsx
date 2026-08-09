"use client";

import Link from "next/link";
import DriverForm from "@/components/forms/DriverForm";
import HeroVideo from "@/components/k/HeroVideo";
import Reveal from "@/components/k/Reveal";
import Breadcrumb from "@/components/k/Breadcrumb";
import Copy from "@/components/k/Copy";
import { fill, link } from "@/lib/content";
import { useTina, tinaField } from "tinacms/dist/react";
import type { TinaPage } from "@/lib/tina";

/**
 * DRIVERS, THE HALF THAT DRAWS.
 *
 * app/drivers/page.tsx fetches on the server and hands the result down. This half
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
type Content = typeof import("@/content/pages/drivers.json");

/**
 * THE JOB IS WRITTEN AS A DOCUMENT, AND IT IS IN THE CMS.
 *
 * Each entry under "The seat, when it opens" prints as a paragraph whose first
 * few words are set bold and read straight into the sentence, the way a printed
 * handbook sets a heading it does not want to give a whole line to. That is why
 * the CMS splits each row into a lead and a body: they are one sentence set two
 * ways, not a heading and a paragraph. KEEP THE LEAD SHORT, two or three words,
 * or the paragraph stops reading as a sentence.
 *
 * THERE IS NO "PAY" ROW, and that is deliberate rather than an oversight. It
 * was the fifth entry and it went on 29 Jul 2026 at the client's word. It said
 * the figure was not published because there was no honest one to publish,
 * which is true and is not a thing to lead a driver with in a list of what the
 * seat offers. Pay is discussed on the call, where it can be a conversation
 * instead of a disclaimer.
 */

export default function DriversView(props: TinaPage<{ driversPage: unknown }>) {
  // Outside the editor this hands straight back what the server fetched.
  const { data } = useTina({
    query: props.query ?? "",
    variables: props.variables ?? {},
    data: props.data,
  });
  const page = data.driversPage as unknown as Content;

  // Derived from the content, so it has to be built per render now that
  // the content arrives at runtime rather than from a static import.
  /**
   * DRIVERS
   *
   * KUL is taking applications now for a seat that opens later. That is the one
   * fact the whole page is built around, and it is said in the first block
   * rather than buried under a recruiting pitch.
   *
   * WHY IT IS WRITTEN THIS WAY. The road ahead page states that a second driver
   * is recruited once the second truck is booked, not before. An earlier version
   * of this page promised "a real call back" to talk lanes and home time, which
   * contradicted it. A driver told to expect a call this week who then hears
   * nothing for months is worse off than one told the truth on the first read,
   * and a carrier that does that once does not get a second application.
   *
   * WHAT IS DELIBERATELY NOT HERE: pay figures, home time guarantees, and a
   * start date. KUL has none of them yet. The page says so where each would
   * normally go rather than leaving the reader to assume.
   *
   * ON THE LAYOUT. Three sections, each a different shape, each taken from a
   * real site and named in the comment above it. The page opens at small size
   * on purpose: the one display moment is "The seat, when it opens" further
   * down, because that is the part a driver came to read.
   *
   * TO UPDATE IT WHEN THE SECOND TRUCK IS BOOKED: change the notice at the top
   * and the line above the form. Both are written so that only the timing has to
   * change, not the whole page.
   */

  return (
    <>
      {/* THE NOTICE, OVER THE FILM.
          The shape is still the Lyssna careers notice: the hiring position in
          plain bold text at reading size rather than dressed up as a
          headline, with the two rules running the full width while the words
          sit in a narrow column inside them. What changed at the first
          walkthrough (project-docs/32) is the ground: Mark asked for a film
          behind this page the way the 404 has one, with two conditions, that
          it is not the 404's clip and that it is not black and white.
          dash-rain belongs to the 404 and dash-night to Safety, so the
          daylight dashcam runs here, in colour, which is also the right
          register for a recruiting page.

          THE WORDS COME FIRST. His one hard rule for the film is that the
          words stay readable, and it was measured rather than eyeballed:
          sampling the 98th-percentile brightness of the poster frame under
          each text block and applying the gradient's value at the top of
          that block, white type holds 3.36:1 on the h1 (display size needs
          3:1), 5.38:1 on the lede and 6.95:1 on the body. The soft grey this
          site usually gives a sub-line fell to 2.52:1 against the pale road,
          the same failure the 404 measured against its bright sky, so every
          line here is full k-on-dark. Re-measure if the film, the stops or
          the text positions change: the three of them together decide this,
          not any one alone. */}
      <section className="relative isolate flex min-h-[560px] flex-col justify-end overflow-hidden bg-k-void px-6 pb-16 pt-40 md:px-12 lg:min-h-[660px] lg:px-24">
        <HeroVideo
          name={page.film.video ?? "dash-daylight"}
          poster={page.film.poster ?? "/videos/dash-daylight-poster.jpg"}
          label="the drivers film"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(0,0,0,0.42)_0%,rgba(0,0,0,0.55)_35%,rgba(0,0,0,0.74)_55%,rgba(0,0,0,0.9)_100%)]"
        />

        <div className="mx-auto w-full max-w-[1248px]">
          <Breadcrumb
            tone="dark"
            className="pb-10"
            items={[{ label: "KUL", href: "/" }, { label: "Drivers" }]}
          />

          <Reveal variant="wipe">
            <h1
              data-tina-field={tinaField(page.notice, "heading")}
              className="pb-12 font-display text-k-d3 font-black text-k-on-dark"
            >
              {fill(page.notice.heading)}
            </h1>
          </Reveal>

          <div className="border-y border-white/30">
            <Reveal className="max-w-[640px] py-8">
              {/* ============================================================
                  THIS BLOCK STAYS PLAIN WITH APPLICANTS, AND IT HAS TO.
                  ============================================================
                  The fleet count itself came off the whole site at the first
                  walkthrough (project-docs/32), this page included. What
                  cannot come off is the plain truth underneath it: there is
                  no seat today and no start date to give, and a driver is
                  being asked for a licence number and a work history all the
                  same. The body says exactly that. Softening it would be
                  taking applications under a false impression, which is
                  worse than sounding small. */}
              <p className="font-text text-k-lede font-semibold text-k-on-dark">
                {fill(page.notice.lead)}
              </p>
              {/* Full k-on-dark, not the usual soft grey: measured at 2.52:1
                  against the pale road through the scrim, which is under the
                  4.5:1 this size needs. See the section comment. */}
              <Copy
                text={page.notice.body}
                className="pt-5 font-text text-k-small text-k-on-dark"
                linkClassName="underline underline-offset-4"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* THE SEAT
          Shape taken from the Wise job description: one wide reading column
          carrying the substance as running paragraphs, and a narrow rail
          beside it holding the two or three practical notes a reader wants
          within reach but does not want interrupting the prose.

          The rail is not a summary of the column. Repeating the column in
          shorter words beside itself is the usual mistake with this shape. */}
      <section className="bg-k-surface px-6 py-32 md:px-12 lg:px-24">
        <div className="mx-auto flex max-w-[1248px] flex-col gap-12 lg:flex-row lg:items-start lg:gap-[88px]">
          <div className="lg:w-[760px] lg:shrink-0">
            <Reveal variant="wipe">
              <h2
              data-tina-field={tinaField(page.seat, "heading")}
              className="pb-9 font-display text-k-d2 font-black text-k-ink"
            >
              {fill(page.seat.heading)}
            </h2>
            </Reveal>
            <div className="flex flex-col gap-4">
              {page.seat.rows.map((row, i) => (
                <Reveal key={row.lead} index={i}>
                  <p className="max-w-[68ch] font-text text-k-body text-k-ink">
                    <strong className="font-semibold">{fill(row.lead)} </strong>
                    <Copy
                      as="span"
                      text={row.body}
                      linkClassName="underline underline-offset-4"
                    />
                  </p>
                </Reveal>
              ))}
            </div>
          </div>

          {/* THE RAIL IS NOT A SUMMARY OF THE COLUMN. Repeating the column in
              shorter words beside itself is the usual mistake with this shape.

              THE FIRST CARD LISTS FOUR THINGS BECAUSE THE FORM ASKS FOR FOUR.
              It used to list three and then tell the driver everything else
              waits for the call, while the fourth field sat below it headed
              "Anything else" asking him to write exactly that. If a field is
              added or removed, fix this card and the "Four questions" line
              above the form together. Both are in the CMS.

              A card with no link label simply prints without a link, which is
              how the first one renders today. */}
          <div className="flex flex-col gap-4 lg:w-[400px] lg:shrink-0 lg:pt-3">
            {page.seat.rail.map((card, i) => (
              <Reveal
                key={card.label}
                variant="settle"
                index={i}
                className="flex flex-col gap-3 bg-k-warm p-7"
              >
                <span className="font-text text-k-micro uppercase text-k-ink-soft">
                  {fill(card.label)}
                </span>
                <Copy
                  text={card.body}
                  className="font-text text-k-small text-k-ink"
                  linkClassName="underline underline-offset-4"
                />
                {card.cta?.label ? (
                  /* A standalone call to action on its own line, not a link
                     inside a sentence, so the 24px of WCAG 2.5.8 applies and a
                     22px line box was two short. Bought with a pseudo-element
                     so the card's rhythm does not change. */
                  <Link
                    href={link(card.cta).href}
                    className="relative font-text text-k-small font-semibold text-k-gold underline underline-offset-4 before:absolute before:-inset-y-0.5 before:inset-x-0 before:content-['']"
                  >
                    {link(card.cta).label}
                  </Link>
                ) : null}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* THE FORM
          The warm panel, so the form reads as a different act from the two
          sections above rather than more of the same page. The fields wear the
          light colourway of the shared panel field.

          There is no closing call to action after this. The form is the end of
          the page, and the footer carries everything else. */}
      <section
        id="apply"
        className="scroll-mt-24 bg-k-warm px-6 py-32 md:px-12 lg:px-24"
      >
        <div className="mx-auto max-w-[1248px]">
          <Reveal variant="wipe">
            <h2
              data-tina-field={tinaField(page.form, "heading")}
              className="font-display text-k-d3 font-black text-k-ink"
            >
              {fill(page.form.heading)}
            </h2>
          </Reveal>
          <Reveal variant="settle">
            {/* "When the second truck is booked, everybody on this list is
                called" closed this paragraph until 29 Jul 2026. The notice at
                the top of the page says it, and the paragraph beneath that
                notice says it again, so by the time a driver reached the form
                it was the third time. What is left is the part only this
                position can say, which is what happens if you fill the form in
                this afternoon. */}
            <Copy
              text={page.form.intro}
              className="max-w-[560px] pt-4 font-text text-k-body text-k-ink-soft"
              linkClassName="underline underline-offset-4"
            />
          </Reveal>

          <Reveal className="pt-11">
            <DriverForm />
          </Reveal>

          <Reveal variant="settle">
            <p className="pt-10 font-text text-k-micro uppercase text-k-ink-soft">
              {fill(page.form.equalOpportunityLine)}
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
