import type { Metadata } from "next";
import Reveal, { RuleDraw } from "@/components/k/Reveal";
import Breadcrumb from "@/components/k/Breadcrumb";
import Copy from "@/components/k/Copy";
import { fill } from "@/lib/content";
import page from "@/content/pages/road-ahead.json";

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
 * TO UPDATE IT AS THE COMPANY GROWS: everything on this page is at /admin
 * under "Road Ahead page". Change the figures under "Where it stands today"
 * the day they are true. When a stage in the plan is done, set its status to
 * "Done" and leave it in place, so the page keeps its own record.
 *
 * THE LEAD FIGURE IS SET APART because it is the real asset: eleven years of
 * driving, against one truck and one driver. Its note is short on purpose. A
 * second sentence there used to point out that this is the only large number
 * on the page, which is a remark about the layout rather than about the
 * carrier, and the word "already" quietly promised growth the rest of the page
 * is careful not to. The column runs shorter than the ruled rows beside it;
 * that is the cost and it is the right trade.
 */

export const metadata: Metadata = {
  title: fill(page.meta.title),
  description: fill(page.meta.description),
};

export default function RoadAheadPage() {
  return (
    <>
      {/* Opening. Headline hard left, the explanation set small and pushed
          right, so the two do not stack into the usual centred block. */}
      <section className="bg-k-paper px-6 pb-28 pt-36 md:px-12 lg:px-24">
        <div className="mx-auto max-w-[1248px]">
          <Breadcrumb
            className="pb-10"
            items={[{ label: "KUL", href: "/" }, { label: "Road Ahead" }]}
          />

          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-24">
            <Reveal variant="wipe" className="lg:max-w-[760px]">
              <h1 className="font-display text-k-d1 font-black text-k-ink">
                {fill(page.opening.heading)}
              </h1>
            </Reveal>
            <Reveal index={2} className="lg:w-[340px] lg:shrink-0 lg:pb-3">
              <Copy
                text={page.opening.body}
                className="font-text text-k-body text-k-ink-soft"
                linkClassName="underline underline-offset-4"
              />
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
              {fill(page.position.eyebrow)}
            </span>
          </Reveal>

          <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-24">
            <Reveal className="lg:w-[520px] lg:shrink-0">
              <div className="flex flex-col gap-4">
                <span className="font-display text-[clamp(5rem,14vw,11rem)] font-black leading-[0.86] tracking-[-0.035em] text-k-gold">
                  {fill(page.position.leadFigure.value)}
                </span>
                <span className="font-text text-k-micro uppercase text-k-ink-faint">
                  {fill(page.position.leadFigure.label)}
                </span>
                <Copy
                  text={page.position.leadFigure.note}
                  className="max-w-[420px] font-text text-k-body text-k-ink-soft"
                  linkClassName="underline underline-offset-4"
                />
              </div>
            </Reveal>

            <div className="flex flex-1 flex-col">
              {page.position.facts.map((fact, i) => (
                <div key={fact.label} className="flex flex-col">
                  <RuleDraw index={i} />
                  <Reveal
                    variant="settle"
                    index={i}
                    className="flex items-baseline gap-8 py-7"
                  >
                    <span className="w-[92px] shrink-0 font-display text-k-d2 font-black tabular-nums text-k-ink">
                      {fill(fact.value)}
                    </span>
                    <span className="flex flex-1 flex-col gap-1.5">
                      <span className="font-text text-k-micro uppercase text-k-ink-faint">
                        {fill(fact.label)}
                      </span>
                      <Copy
                        as="span"
                        text={fact.note}
                        className="font-text text-k-small text-k-ink-soft"
                        linkClassName="underline underline-offset-4"
                      />
                    </span>
                  </Reveal>
                </div>
              ))}
              <RuleDraw index={page.position.facts.length} />
            </div>
          </div>
        </div>
      </section>

      {/* The plan, as a ruled index. The stage name reads left, its status
          reads right, and the explanation sits underneath both. */}
      <section className="bg-k-paper px-6 py-28 md:px-12 lg:px-24">
        <div className="mx-auto flex max-w-[1248px] flex-col gap-12">
          <Reveal variant="wipe">
            {/* "in the order it happens" came off this heading on 29 Jul
                2026. The page's own opening paragraph says the plan is
                written in the order it has to happen, and the stages below
                are numbered 01, 02, 03. */}
            <h2 className="max-w-[820px] font-display text-k-d2 font-black text-k-ink">
              {fill(page.plan.heading)}
            </h2>
          </Reveal>

          <div className="flex flex-col">
            {page.plan.stages.map((stage, i) => (
              <div key={stage.n} className="flex flex-col">
                <RuleDraw index={i} />
                <Reveal index={i} className="flex flex-col gap-4 py-9">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
                    <div className="flex items-baseline gap-6">
                      <span className="font-text text-k-micro uppercase tabular-nums text-k-gold">
                        {fill(stage.n)}
                      </span>
                      <h3 className="font-display text-k-d2 font-black text-k-ink">
                        {fill(stage.title)}
                      </h3>
                    </div>
                    <span className="font-text text-k-micro uppercase text-k-ink-faint">
                      {fill(stage.status)}
                    </span>
                  </div>
                  <Copy
                    text={stage.body}
                    className="max-w-[720px] font-text text-k-body text-k-ink-soft lg:pl-[76px]"
                    linkClassName="underline underline-offset-4"
                  />
                </Reveal>
              </div>
            ))}
            <RuleDraw index={page.plan.stages.length} />
          </div>
        </div>
      </section>

      {/* What does not change. A short list rather than three cards, because
          three cards is what every other section on the site already is. */}
      <section className="bg-k-coal px-6 py-28 md:px-12 lg:px-24">
        <div className="mx-auto flex max-w-[1248px] flex-col gap-12 lg:flex-row lg:gap-24">
          <Reveal variant="wipe" className="lg:w-[480px] lg:shrink-0">
            <h2 className="font-display text-k-d2 font-black text-k-on-dark">
              {fill(page.fixed.heading)}
            </h2>
          </Reveal>

          <ul className="flex flex-1 flex-col">
            {page.fixed.items.map((line, i) => (
              <li key={line} className="flex flex-col">
                <RuleDraw index={i} tone="dark" />
                <Reveal index={i} className="py-7">
                  <Copy
                    text={line}
                    className="font-text text-k-lede text-k-on-dark"
                    linkClassName="underline underline-offset-4"
                  />
                </Reveal>
              </li>
            ))}
            <RuleDraw index={page.fixed.items.length} tone="dark" />
          </ul>
        </div>
      </section>

      {/* The limits of the page, said plainly. */}
      <section className="bg-k-warm px-6 py-24 md:px-12 lg:px-24">
        <Reveal className="mx-auto flex max-w-[820px] flex-col gap-5">
          <h2 className="font-display text-k-d3 font-black text-k-ink">
            {fill(page.limits.heading)}
          </h2>
          {/* This opened "It is a plan, not a record." and closed on a second
              paragraph reading "It is updated when something changes." Both
              are in the page's first paragraph already, which says the stages
              are undated until booked and that the figures change the day they
              do. What is left is the part that appears nowhere else: the two
              things this page refuses to do and the one thing it is not. The
              heading supplies the "not a record" on its own. */}
          <Copy
            text={page.limits.body}
            className="font-text text-k-body text-k-ink-soft"
            linkClassName="underline underline-offset-4"
          />
        </Reveal>
      </section>
    </>
  );
}
