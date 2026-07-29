import type { Metadata } from "next";
import Link from "next/link";
import DriverForm from "@/components/forms/DriverForm";
import { site } from "@/lib/site";
import Reveal from "@/components/k/Reveal";
import Breadcrumb from "@/components/k/Breadcrumb";

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
  title: "Drive With KUL",
  description: `KUL Enterprises is taking driver applications now, ahead of the seat opening. CDL-A, Southeast regional out of ${site.location}, with over the road available.`,
};

/**
 * THE JOB, WRITTEN AS A DOCUMENT.
 *
 * Each entry prints as a paragraph whose first few words are set bold and read
 * straight into the sentence, the way a printed handbook sets a heading it does
 * not want to give a whole line to. Keep the lead short, two or three words,
 * or the paragraph stops reading as a sentence.
 *
 * THERE IS NO "PAY" ENTRY, and that is deliberate rather than an oversight.
 * See the note where it used to sit at the foot of this list.
 */
const THE_SEAT = [
  {
    lead: "The licence.",
    body: "CDL-A, with a work history we can verify and a motor vehicle record we can pull. Both are checked before an interview.",
  },
  {
    lead: "The lanes.",
    body: `Southeast regional out of ${site.location}, with over the road available. Most weeks run inside the home region.`,
  },
  {
    lead: "The equipment.",
    body: "A 53 foot dry van behind a sleeper tractor, inspected before every dispatch. Anything found is fixed before the load moves, even when that costs us the load.",
  },
  {
    lead: "The dispatch.",
    body: "You will be talking to Mark, who drives the truck himself. Hours are planned before dispatch.",
  },
  // "The pay" was the fifth entry and it went on 29 Jul 2026 at the client's
  // word. It said the figure was not published because there was no honest one
  // to publish, which is true and is not a thing to lead a driver with in a
  // list of what the seat offers. Pay is discussed on the call, where it can be
  // a conversation instead of a disclaimer.
] as const;

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
              Driving for KUL
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
                Applications are open now. The seat opens with the second
                truck.
              </p>
              <p className="pt-5 font-text text-k-small text-k-ink-soft">
                A second tractor goes on the road once there is repeat freight
                to keep both loaded through a full month, and the
                driver&rsquo;s seat opens at the same time. We take
                applications before that happens so the seat goes to somebody
                already spoken to, rather than whoever answers an advert on the
                day. There is no start date to give you, and everybody who has
                applied is called when there is. The plan is on{" "}
                <Link href="/road-ahead" className="underline underline-offset-4">
                  the road ahead page
                </Link>
                .
              </p>
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
                The seat, when it opens
              </h2>
            </Reveal>
            <div className="flex flex-col gap-4">
              {THE_SEAT.map((row, i) => (
                <Reveal key={row.lead} index={i}>
                  <p className="max-w-[68ch] font-text text-k-body text-k-ink">
                    <strong className="font-semibold">{row.lead} </strong>
                    {row.body}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:w-[400px] lg:shrink-0 lg:pt-3">
            <Reveal variant="settle" className="flex flex-col gap-3 bg-k-warm p-7">
              <span className="font-text text-k-micro uppercase text-k-ink-soft">
                What to send now
              </span>
              {/* FOUR THINGS, BECAUSE THE FORM ASKS FOR FOUR. This used to
                  list three and then tell the driver everything else waits for
                  the call, while the fourth field sat below it headed
                  "Anything else" asking him to write exactly that. If a field
                  is added or removed, fix this rail and the "Four questions"
                  line above the form together. */}
              <p className="font-text text-k-small text-k-ink">
                Your name, a phone number or an email, how long you have held a
                CDL-A, and anything else you want to add. The rest waits for
                the call.
              </p>
            </Reveal>
            <Reveal
              variant="settle"
              index={1}
              className="flex flex-col gap-3 bg-k-warm p-7"
            >
              <span className="font-text text-k-micro uppercase text-k-ink-soft">
                The standards
              </span>
              <p className="font-text text-k-small text-k-ink">
                A second driver is held to what is written on the safety page
                from the first load. Read it before you apply.
              </p>
              <Link
                href="/safety"
                className="font-text text-k-small font-semibold text-k-gold underline underline-offset-4"
              >
                Read the safety page
              </Link>
            </Reveal>
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
              Leave your details
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
            <p className="max-w-[560px] pt-4 font-text text-k-body text-k-ink-soft">
              Four questions. Nobody is called today, because the seat is not
              open today.
            </p>
          </Reveal>

          <Reveal className="pt-11">
            <DriverForm />
          </Reveal>

          <Reveal variant="settle">
            <p className="pt-10 font-text text-k-micro uppercase text-k-ink-soft">
              {site.legalName} is an equal opportunity employer
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
