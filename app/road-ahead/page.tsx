import type { Metadata } from "next";
import { site } from "@/lib/site";
import Reveal, { RuleDraw } from "@/components/k/Reveal";

/**
 * THE ROAD AHEAD
 *
 * The home page promises fifty trucks by 2029 and sends people here for the
 * plan, so this page has to be the plan rather than a second helping of the
 * promise.
 *
 * ON THE WRITING. Plain sentences, operational nouns, no clever endings. An
 * earlier draft of this page finished every paragraph on a neat reversal
 * ("a date invented now would only be a date invented now") which reads as
 * copywriting rather than as a carrier talking to a broker. If a sentence
 * here could be printed on a poster, it is the wrong sentence.
 *
 * ON THE LAYOUT. Each section below is deliberately a different shape. The
 * opening splits wide and uneven, the figures are one large and three small,
 * the plan is a ruled index, and the commitments are a list rather than
 * columns. Four sections of three equal columns is what made the earlier
 * version of this page feel like a template.
 *
 * TO UPDATE IT AS THE COMPANY GROWS: change the numbers in POSITION the day
 * they are true. When a stage in PLAN is done, set its status to "Done" and
 * leave it in place, so the page keeps its own record.
 */

export const metadata: Metadata = {
  title: "The Road Ahead",
  description: `KUL Enterprises runs one truck today and plans fifty by 2029. The plan in order, what has to happen first, and what does not change on the way. Licensed carrier in ${site.location}, USDOT ${site.usdot}.`,
};

/** The real figures. The lead one is set apart because it is the real asset. */
const LEAD_FIGURE = {
  value: "11",
  label: "Years driving",
  // Short on purpose. The second sentence used to point out that this is the
  // only large number on the page, which is a remark about the layout rather
  // than about the carrier, and "already" quietly promised growth the rest of
  // the page is careful not to. The column now runs shorter than the ruled
  // rows beside it; that is the cost and it is the right trade.
  note: "Eleven years hauling for other carriers before KUL took its first load.",
};

const POSITION = [
  {
    value: "1",
    label: "Trucks in service",
    note: "One tractor, on the road since 2026.",
  },
  {
    value: "1",
    label: "Drivers",
    note: "Mark Brown, who also answers dispatch.",
  },
  {
    value: "48",
    label: "States authorised",
    note: "Operating authority is already nationwide.",
  },
] as const;

/** The plan, in the order it has to happen. Status, never a date. */
const PLAN = [
  {
    n: "01",
    title: "The second truck",
    status: "Next",
    body: "A second tractor goes on the road once there is repeat freight to keep both loaded through a full month. Until that is true the money stays in maintenance and insurance on the first one.",
  },
  {
    n: "02",
    title: "A second driver",
    status: "After that",
    body: "Hired on a verified work history and a clean motor vehicle record, held to the standards written on the safety page. Recruiting starts once the second truck is booked, not before.",
  },
  {
    n: "03",
    title: "Dispatch cover",
    status: "After that",
    body: "A second person on the phone, so calls are answered while the first is driving. The number on this site does not change when that happens.",
  },
] as const;

/** What stays the same at any size. */
const FIXED = [
  "Dispatch stays one phone number, answered by somebody who has driven the lane.",
  "No load is accepted that cannot be run legally inside hours of service.",
  "Delays come from us before they come from your receiver.",
] as const;

export default function RoadAheadPage() {
  return (
    <>
      {/* Opening. Headline hard left, the explanation set small and pushed
          right, so the two do not stack into the usual centred block. */}
      <section className="bg-k-paper px-6 pb-28 pt-36 md:px-12 lg:px-24">
        <div className="mx-auto max-w-[1248px]">
          <p className="flex items-center gap-2.5 pb-10">
            <span className="font-text text-k-micro uppercase text-k-ink-faint">
              KUL
            </span>
            <span className="font-text text-k-micro text-k-ink-faint">/</span>
            <span className="font-text text-k-micro uppercase text-k-gold">
              Road Ahead
            </span>
          </p>

          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-24">
            <Reveal variant="wipe" className="lg:max-w-[760px]">
              <h1 className="font-display text-k-d1 font-black text-k-ink">
                One truck today. Fifty by 2029.
              </h1>
            </Reveal>
            <Reveal index={2} className="lg:w-[340px] lg:shrink-0 lg:pb-3">
              <p className="font-text text-k-body text-k-ink-soft">
                The plan below is written in the order it has to happen. None of
                it has happened yet. The figures are updated the day they
                change.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* The position today. One figure carries the section and the other
          three sit under it at a quarter of the weight. */}
      <section className="bg-k-surface px-6 py-28 md:px-12 lg:px-24">
        <div className="mx-auto flex max-w-[1248px] flex-col gap-12">
          <Reveal variant="settle">
            <span className="font-text text-k-micro uppercase text-k-ink-faint">
              Where it stands today
            </span>
          </Reveal>

          <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-24">
            <Reveal className="lg:w-[520px] lg:shrink-0">
              <div className="flex flex-col gap-4">
                <span className="font-display text-[clamp(5rem,14vw,11rem)] font-black leading-[0.86] tracking-[-0.035em] text-k-gold">
                  {LEAD_FIGURE.value}
                </span>
                <span className="font-text text-k-micro uppercase text-k-ink-faint">
                  {LEAD_FIGURE.label}
                </span>
                <p className="max-w-[420px] font-text text-k-body text-k-ink-soft">
                  {LEAD_FIGURE.note}
                </p>
              </div>
            </Reveal>

            <div className="flex flex-1 flex-col">
              {POSITION.map((fact, i) => (
                <div key={fact.label} className="flex flex-col">
                  <RuleDraw index={i} />
                  <Reveal
                    variant="settle"
                    index={i}
                    className="flex items-baseline gap-8 py-7"
                  >
                    <span className="w-[92px] shrink-0 font-display text-k-d2 font-black tabular-nums text-k-ink">
                      {fact.value}
                    </span>
                    <span className="flex flex-1 flex-col gap-1.5">
                      <span className="font-text text-k-micro uppercase text-k-ink-faint">
                        {fact.label}
                      </span>
                      <span className="font-text text-k-small text-k-ink-soft">
                        {fact.note}
                      </span>
                    </span>
                  </Reveal>
                </div>
              ))}
              <RuleDraw index={POSITION.length} />
            </div>
          </div>
        </div>
      </section>

      {/* The plan, as a ruled index. The stage name reads left, its status
          reads right, and the explanation sits underneath both. */}
      <section className="bg-k-paper px-6 py-28 md:px-12 lg:px-24">
        <div className="mx-auto flex max-w-[1248px] flex-col gap-12">
          <Reveal variant="wipe">
            <h2 className="max-w-[820px] font-display text-k-d2 font-black text-k-ink">
              The plan, in the order it happens
            </h2>
          </Reveal>

          <div className="flex flex-col">
            {PLAN.map((stage, i) => (
              <div key={stage.n} className="flex flex-col">
                <RuleDraw index={i} />
                <Reveal index={i} className="flex flex-col gap-4 py-9">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
                    <div className="flex items-baseline gap-6">
                      <span className="font-text text-k-micro uppercase tabular-nums text-k-gold">
                        {stage.n}
                      </span>
                      <h3 className="font-display text-k-d2 font-black text-k-ink">
                        {stage.title}
                      </h3>
                    </div>
                    <span className="font-text text-k-micro uppercase text-k-ink-faint">
                      {stage.status}
                    </span>
                  </div>
                  <p className="max-w-[720px] font-text text-k-body text-k-ink-soft lg:pl-[76px]">
                    {stage.body}
                  </p>
                </Reveal>
              </div>
            ))}
            <RuleDraw index={PLAN.length} />
          </div>
        </div>
      </section>

      {/* What does not change. A short list rather than three cards, because
          three cards is what every other section on the site already is. */}
      <section className="bg-k-coal px-6 py-28 md:px-12 lg:px-24">
        <div className="mx-auto flex max-w-[1248px] flex-col gap-12 lg:flex-row lg:gap-24">
          <Reveal variant="wipe" className="lg:w-[480px] lg:shrink-0">
            <h2 className="font-display text-k-d2 font-black text-k-on-dark">
              What does not change at any size
            </h2>
          </Reveal>

          <ul className="flex flex-1 flex-col">
            {FIXED.map((line, i) => (
              <li key={line} className="flex flex-col">
                <RuleDraw index={i} tone="dark" />
                <Reveal index={i} className="py-7">
                  <p className="font-text text-k-lede text-k-on-dark">{line}</p>
                </Reveal>
              </li>
            ))}
            <RuleDraw index={FIXED.length} tone="dark" />
          </ul>
        </div>
      </section>

      {/* The limits of the page, said plainly. */}
      <section className="bg-k-warm px-6 py-24 md:px-12 lg:px-24">
        <Reveal className="mx-auto flex max-w-[820px] flex-col gap-5">
          <h2 className="font-display text-k-d3 font-black text-k-ink">
            What this page is not
          </h2>
          <p className="font-text text-k-body text-k-ink-soft">
            It is a plan, not a record. There is no funding announcement here
            and no photographs of equipment KUL does not own. Nothing on it is a
            commitment to a customer.
          </p>
          <p className="font-text text-k-body text-k-ink-soft">
            It is updated when something changes.
          </p>
        </Reveal>
      </section>
    </>
  );
}
