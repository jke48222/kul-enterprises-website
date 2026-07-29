import type { Metadata } from "next";
import Link from "next/link";
import DriverForm from "@/components/forms/DriverForm";
import Reveal from "@/components/k/Reveal";
import Breadcrumb from "@/components/k/Breadcrumb";
import Copy from "@/components/k/Copy";
import { fill, link } from "@/lib/content";
import page from "@/content/pages/drivers.json";

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

export const metadata: Metadata = {
  title: fill(page.meta.title),
  description: fill(page.meta.description),
};

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

export default function DriversPage() {
  return (
    <>
      {/* THE NOTICE
          Shape taken from the Lyssna careers page, which states its hiring
          position in plain bold text at reading size rather than dressing it
          up as a headline.

          The two rules run the full width of the page while the words sit in a
          narrow column inside them. That is what makes the empty half look
          like part of the design rather than a gap somebody forgot to fill,
          and it is why the rules are not cropped to the text. */}
      <section className="bg-k-paper px-6 pb-32 pt-36 md:px-12 lg:px-24 lg:pt-44">
        <div className="mx-auto max-w-[1248px]">
          <Breadcrumb
            className="pb-10"
            items={[{ label: "KUL", href: "/" }, { label: "Drivers" }]}
          />

          <Reveal variant="wipe">
            <h1 className="pb-14 font-display text-k-d3 font-black text-k-ink">
              {fill(page.notice.heading)}
            </h1>
          </Reveal>

          <div className="border-y border-k-ink">
            <Reveal className="max-w-[640px] py-8">
              {/* ============================================================
                  THIS IS THE ONE PLACE ON THE SITE THAT STILL SAYS IT PLAINLY,
                  AND IT HAS TO.
                  ============================================================
                  The headcount framing came off the commercial pages on
                  29 Jul 2026 because it read as an apology to a broker. It
                  cannot come off here. A driver is being asked to hand over a
                  licence number and a work history for a seat that does not
                  exist yet, and the reason it does not exist yet is the fleet
                  size. Softening that would be taking applications under a
                  false impression, which is worse than sounding small.

                  What did go is the repetition. It was said four times on this
                  page and twice more in the form; it is said once now, in the
                  first block, where a driver meets it before spending any
                  time. */}
              <p className="font-text text-k-lede font-semibold text-k-ink">
                {fill(page.notice.lead)}
              </p>
              <Copy
                text={page.notice.body}
                className="pt-5 font-text text-k-small text-k-ink-soft"
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
              <h2 className="pb-9 font-display text-k-d2 font-black text-k-ink">
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
                  <Link
                    href={link(card.cta).href}
                    className="font-text text-k-small font-semibold text-k-gold underline underline-offset-4"
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
            <h2 className="font-display text-k-d3 font-black text-k-ink">
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
