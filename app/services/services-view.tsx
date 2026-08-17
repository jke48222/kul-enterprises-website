"use client";

import Image from "next/image";
import Link from "next/link";
import { services } from "@/lib/services";
import { fill, link } from "@/lib/content";
import ServiceCarousel from "@/components/k/ServiceCarousel";
import Reveal from "@/components/k/Reveal";
import Breadcrumb from "@/components/k/Breadcrumb";
import Copy from "@/components/k/Copy";
import { useTina, tinaField } from "tinacms/dist/react";
import type { TinaPage } from "@/lib/tina";

/**
 * SERVICES, THE HALF THAT DRAWS.
 *
 * app/services/page.tsx fetches on the server and hands the result down. This half
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
type Content = typeof import("@/content/pages/services-index.json");

/**
 * THE FOUR MARKS THAT HEAD THE STEPS.
 *
 * ============================================================================
 * THEY ARE DRAWN AS SMALL TECHNICAL ELEVATIONS, NOT AS APP ICONS.
 * ============================================================================
 * The first pass was a handset, a page, a road and a clipboard, which is the
 * set any icon library hands you and which the client rejected twice. The
 * problem was not the line weight. It was that none of the four had anything to
 * do with freight: the same four marks would have suited a dentist.
 *
 * These are specific. A lane drawn as two waypoints and the route between them,
 * a rate sheet with the figure ruled under it, the tractor and trailer in side
 * elevation, and the mark that closes the job. Three of the four could not be
 * lifted into another industry, which is the whole point of drawing them.
 *
 * THEY SPEAK THE SITE'S OWN DRAUGHTING LANGUAGE. This page already carries wire
 * elevations of the truck at public/images/truck/wire, the safety page is set
 * as numbered clauses and the home page has a drafting sheet behind its
 * statement. A technical pen is the house style here, so these are drawn with
 * one: a single 1.5 stroke, round caps and joins, no fill anywhere except the
 * one deliberate solid dot, and every mark laid on the same 32 unit grid with
 * the same 3 unit margin so the four carry identical optical weight in a row.
 *
 * ONE IDEA PER ICON. The dispatch mark was a road plus a map pin, and at this
 * size the verge strokes and the pin read as three unrelated marks instead of
 * one object. If a mark needs two nouns to explain it, it is the wrong mark.
 *
 * They are aria-hidden. The step name beside each is the content, and a screen
 * reader announcing "handset" before "Enquiry" adds a word and no meaning.
 */
const STEP_ICON_PROPS = {
  width: 32,
  height: 32,
  viewBox: "0 0 32 32",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

export default function ServicesView(props: TinaPage<{ servicesPage: unknown }>) {
  // Outside the editor this hands straight back what the server fetched.
  const { data } = useTina({
    query: props.query ?? "",
    variables: props.variables ?? {},
    data: props.data,
  });
  const page = data.servicesPage as unknown as Content;

  // Derived from the content, so it has to be built per render now that
  // the content arrives at runtime rather than from a static import.
  /**
   * SERVICES PAGE
   *
   * Lists all seven freight services so a shipper can pick the right one
   * quickly. Built from the Paper artboard "Services, desktop 1440".
   *
   * TO CHANGE THE WORDS on any service, edit content/services.json. Nothing on
   * this page is typed in directly; it all comes from that file, so the client
   * can edit it through the CMS without touching code.
   *
   * The page runs in this order: title, the photograph carousel, the seven
   * services compared, how a load moves.
   *
   * ============================================================================
   * ONE CAROUSEL AND ONE LIST. IT USED TO BE TWO CAROUSELS AND TWO LISTS.
   * ============================================================================
   *
   * There were three passes over the same seven services: a photograph carousel
   * you pulled, then a comparison row you also pulled sideways, then three of the
   * seven written out again at length underneath. Two of those are gone.
   *
   * The carousel stays and is the point of the page. It is the only place the
   * seven photographs are shown at a size worth looking at, and it is where
   * somebody who does not yet know what they need goes to browse. Its dragging
   * and its speed are dealt with in components/k/ServiceCarousel.tsx.
   *
   * The comparison row that followed it did not stay. It carried the same seven
   * names a second time and it had to be pulled sideways to be read, which is
   * the one thing a comparison must not be: two services are never on screen
   * together for long enough to compare them. It is a list reading downwards
   * now, and because the facts sit in the same column on every row they can be
   * run down with one eye.
   *
   * The third pass, "In detail", was three of the seven explained again in worse
   * words than their own pages use. See the note at the foot of this file.
   */
  /**
   * THE MARKS THEMSELVES, KEYED TO THE STEP NUMBER IN THE CMS.
   *
   * The words beside each mark are editable at /admin and these drawings are
   * not, which is the right split: a client renaming "Enquiry" to "Your lane"
   * should not be able to leave the rate sheet pointing at the wrong step, and
   * nobody is drawing a new technical elevation in a text field.
   *
   * A step whose number has no mark here simply renders without one rather than
   * throwing, so adding a fifth step in the CMS degrades to a column of type
   * instead of a broken page. If a fifth step is ever real, draw it a mark.
   */
  const STEP_ICONS: Record<string, React.ReactNode> = {
    "01": (
        <svg {...STEP_ICON_PROPS}>
          {/* THE LANE. An origin left open as a ring, a destination closed as a
              solid dot, and the route running between them. It is the only mark
              in the set carrying a filled shape, and that is doing work: open
              means not yet, closed means arrived, so the direction of travel is
              legible without an arrowhead. */}
          <circle cx="7.5" cy="24" r="3" />
          <path d="M10 21.5C15 17.5 12.5 12 20.5 9.5" />
          <circle cx="24.5" cy="8" r="3" fill="currentColor" stroke="none" />
        </svg>
    ),
    "02": (
        <svg {...STEP_ICON_PROPS}>
          {/* THE RATE SHEET. Two ruled lines of description, then the figure set
              apart under its own rule at the foot, which is how a rate actually
              sits on a quote and what makes this a quote rather than a generic
              page. The corner is turned because a folded corner is the fastest
              way to say paper in four strokes. */}
          <path d="M7 3.5h12l6 6v19H7Z" />
          <path d="M19 3.5v6h6" />
          <path d="M11.5 14.5h9M11.5 18.5h6" />
          <path d="M11.5 23.5h5.5" />
        </svg>
    ),
    "03": (
        <svg {...STEP_ICON_PROPS}>
          {/* THE TRACTOR AND TRAILER IN SIDE ELEVATION, which is the one mark on
              this page that could not belong to any other trade. It is drawn the
              way the wire elevations at public/images/truck/wire are drawn:
              chassis line, box, sloped cab, wheels on the line.

              The wheels sit with their centres below the chassis and their tops
              just above it, which is what a side elevation actually looks like
              and what stops the rig reading as a box on two circles. */}
          <path d="M14.5 21V7.5h14.5V21" />
          <path d="M14.5 21v-8.5H7L3.5 17V21" />
          <path d="M3.5 21H29" />
          <circle cx="9" cy="23.6" r="2.7" />
          <circle cx="24" cy="23.6" r="2.7" />
        </svg>
    ),
    "04": (
        <svg {...STEP_ICON_PROPS}>
          {/* THE MARK THAT CLOSES THE JOB. A ring and a check, and nothing else.

              It is the only round silhouette in the row, which is deliberate: the
              other three are a diagonal, an upright rectangle and a long
              horizontal one, so a circle at the end gives the four marks four
              distinct shapes at a glance and stops the row reading as one texture
              repeated. The ring is set at the same radius as the frame the other
              three fill, so it carries the same optical weight rather than
              looking smaller for being round. */}
          <circle cx="16" cy="16" r="12.5" />
          <path d="m10 16.5 4 4 8-8.5" />
        </svg>
    ),
  };

  return (
    <>
      {/* Title row. */}
      <section className="bg-k-paper px-6 pt-36 md:px-12 lg:px-24">
        <div className="mx-auto max-w-[1248px]">
          <Breadcrumb
            className="pb-5"
            items={[{ label: "KUL", href: "/" }, { label: "Services" }]}
          />
          <div className="flex flex-col gap-6 border-b border-k-rule pb-6 lg:flex-row lg:items-end lg:justify-between">
            <h1
              data-tina-field={tinaField(page.title, "heading")}
              className="font-display text-k-d1 font-black text-k-ink"
            >
              {fill(page.title.heading)}
            </h1>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-1 pb-2.5">
              {/* Three fields rather than one sentence, because the middle of
                  this line carries a gold rule under it and the two halves
                  around it do not. Storing it whole would mean either losing
                  the underline or asking the client to mark it up. */}
              <p className="font-text text-k-small text-k-ink-soft">
                {fill(page.title.serviceAreaBefore)}{" "}
                <span className="border-b border-k-gold text-k-ink">
                  {fill(page.title.serviceAreaHighlight)}
                </span>{" "}
                {fill(page.title.serviceAreaAfter)}
              </p>
              {/* The count is the real number of services, never typed in, so
                  it cannot disagree with the list underneath it. */}
              <p className="font-text text-k-small text-k-ink-soft">
                {services.length} {fill(page.title.countSuffix)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The photograph carousel. */}
      <section className="bg-k-paper">
        {/* The carousel has no heading on screen, by design: the seven
            photographs and their names are the heading. But each card names
            its service in an h3, and with nothing above them the page jumped
            from its h1 straight to an h3, which is a hole in the outline
            somebody navigating by headings falls through.

            So the heading exists and is read aloud, without being drawn. It
            also does a second job: somebody listening to the page arrives at
            seven service names with no idea what the group is. */}
        <h2 className="sr-only">All {services.length} services</h2>
        <ServiceCarousel services={services} />
      </section>

      {/* THE SEVEN SERVICES, READ DOWNWARDS.
          One row each. The photograph and the name are on the left where the
          eye lands, the sentence and the two actions are in the middle, and
          the three facts a shipper is comparing are pinned to the right in a
          fixed-width column so they line up on every row from the top of the
          list to the bottom. That alignment is the whole point: it is what
          lets somebody run their eye down "Equipment" for all seven without
          reading any of the prose. */}
      <section className="bg-k-surface px-6 py-28 md:px-12 lg:px-24">
        <div className="mx-auto flex max-w-[1248px] flex-col gap-10">
          <Reveal variant="settle" className="flex flex-col items-center gap-3.5">
            <h2
              data-tina-field={tinaField(page.compare, "heading")}
              className="max-w-[700px] text-center font-display text-k-d2 font-black text-k-ink"
            >
              {fill(page.compare.heading)}
            </h2>
            <Copy
              text={page.compare.body}
              className="max-w-[660px] text-center font-text text-k-small text-k-ink-soft"
              linkClassName="underline underline-offset-4"
            />
          </Reveal>

          <ul className="flex flex-col">
            {services.map((service, i) => (
              <li key={service.slug}>
                {/* THE ROW KEEPS ITS SHAPE ON A PHONE. It used to collapse to
                    one column, which turned a 232px thumbnail into a 342px
                    square photograph and pushed the service name most of a
                    screen below its own row: seven services became seven full
                    screens of road. The picture is 96px on a phone and 128px
                    from sm, so the name and the sentence stay beside it exactly
                    as they do on a desktop.

                    The facts drop under both columns rather than beside them,
                    because three columns do not fit in 390px and the labels
                    would wrap to two lines each. That is the one part of the
                    desktop arrangement that cannot survive, and it is the part
                    a reader consults rather than reads. */}
                <Reveal
                  index={i}
                  className="grid grid-cols-[96px_minmax(0,1fr)] gap-x-5 gap-y-6 border-t border-k-rule-strong py-9 sm:grid-cols-[128px_minmax(0,1fr)] sm:gap-x-7 lg:grid-cols-[232px_minmax(0,1fr)_296px] lg:items-start lg:gap-12"
                >
                  {/* The photograph is a link to the same place the name goes,
                      because a picture of a reefer is the thing a shipper
                      reaches for first and it should not be the one part of
                      the row that does nothing when clicked. It is decorative
                      beside a heading that already names the service, so it
                      carries an empty alt rather than saying "Reefer" twice
                      in a row to a screen reader. */}
                  <Link
                    href={`/services/${service.slug}`}
                    tabIndex={-1}
                    aria-hidden="true"
                    className="block overflow-hidden rounded-sm"
                  >
                    <Image
                      src={service.card}
                      alt=""
                      width={900}
                      height={900}
                      sizes="(min-width: 1024px) 232px, (min-width: 640px) 128px, 96px"
                      priority={i < 2}
                      className="h-auto w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.04]"
                    />
                  </Link>

                  <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                      <h3 className="font-display text-k-d3 font-black text-k-ink">
                        {service.name}
                      </h3>
                      <span className="font-text text-k-micro uppercase tabular-nums text-k-ink-faint">
                        {/* Some entries are not a time ("By contract") and
                            carry a flag in the CMS that prints them as they
                            stand rather than prefixed into "Lead time By
                            contract". The flag, never the text: the text is
                            editable and a comparison against it would break
                            the day the client rewords it. */}
                        {service.leadTimeNoPrefix
                          ? service.leadTime
                          : `${fill(page.compare.leadTimePrefix)} ${service.leadTime}`}
                      </span>
                    </div>
                    <p className="max-w-[52ch] font-text text-k-body text-k-ink-soft">
                      {service.short}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-2">
                      {/* Carries the slug, same as the service page's own
                          button, so the form opens on the right freight type
                          from either route in. */}
                      <Link
                        href={`/quote?service=${service.slug}`}
                        className="rounded-full bg-k-ink px-5 py-2.5 font-text text-k-micro uppercase text-k-paper transition-opacity duration-200 hover:opacity-85"
                      >
                        {fill(page.compare.quoteLabel)}
                      </Link>
                      {/* 11px of caps over a 2px gap and a hairline measures 19px
                          tall. It sits in a row beside a proper button rather
                          than inside a sentence, so it is a control and owes the
                          24px of WCAG 2.5.8 that an inline link does not. The
                          target is taken to 27px with a pseudo-element, which
                          the 12px row gap absorbs without the two rows ever
                          touching. */}
                      <Link
                        href={`/services/${service.slug}`}
                        className="relative border-b border-k-gold pb-0.5 font-text text-k-micro uppercase text-k-ink transition-colors duration-200 before:absolute before:-inset-y-1 before:inset-x-0 before:content-[''] hover:text-k-gold"
                      >
                        {service.name} {fill(page.compare.detailLabel)}
                      </Link>
                    </div>
                  </div>

                  {/* The comparison facts. A description list, because that is
                      what this is: three labels and their values. */}
                  <dl className="col-span-2 flex flex-col gap-3.5 border-t border-k-rule pt-5 lg:col-span-1 lg:border-t-0 lg:pt-1">
                    {[
                      {
                        label: fill(page.compare.labels.equipment),
                        value: service.equipment,
                        note: service.equipmentNote,
                      },
                      {
                        label: fill(page.compare.labels.lane),
                        value: service.lane,
                        note: service.laneNote,
                      },
                      {
                        label: fill(page.compare.labels.bestFor),
                        value: service.bestForShort,
                        note: null,
                      },
                    ].map((row) => (
                      <div key={row.label} className="flex flex-col gap-0.5">
                        <dt className="font-text text-k-micro uppercase text-k-ink-faint">
                          {row.label}
                        </dt>
                        <dd className="font-text text-k-small font-medium text-k-ink">
                          {row.value}
                          {row.note ? (
                            <span className="font-normal text-k-ink-soft">
                              {" "}
                              · {row.note}
                            </span>
                          ) : null}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ==================================================================
          HOW A LOAD MOVES.
          ==================================================================
          Shape taken 1:1 from the Hims "How it works" section, pulled from
          Mobbin at the client's choosing: the title along the left with a
          single filled pill hard right on the same line, then four equal
          columns each led by a line drawn mark, a bold name and one short
          paragraph. No rules, no numerals, no cards, and a great deal of air.

          IT WAS A HORIZONTAL RAIL WITH FOUR DOTS. That worked and it read as a
          diagram: four small labels strung along a line, none of them large
          enough to be the thing you looked at, and a printed 01 beside each
          name saying what four columns in a row already say. The rail and the
          numerals both went with it.

          WHAT THIS BUYS. The old arrangement had two devices doing the
          sequencing, the line and the numbers, and nothing at all doing the
          looking. Now the marks carry the eye across, the names are the only
          bold thing in the section, and the pill gives the reader somewhere to
          go at the exact moment the page has finished explaining the process.

          THE GROUND WAS A HARDCODED #FDC63E17, which is the metal highlight
          from the logo gradient laid on at 9% and reads as pale yellow. The
          client's standing instruction is gold and not yellow, and this is the
          warm panel token every other warm ground on the site uses. */}
      <section className="bg-k-warm px-6 py-32 md:px-12 lg:px-24">
        <div className="mx-auto max-w-[1248px]">
          {/* THE HEADING ROW, WITH THE ACTION ON THE SAME LINE. The reference
              runs its title along the left and puts a single filled pill hard
              right on the same baseline, which is the one piece of weight in an
              otherwise weightless section. It is worth having here for a reason
              beyond the borrowing: this section explains how to start, and
              until now it explained it and then offered no way to. */}
          <Reveal
            variant="wipe"
            // THE PILL DROPS UNDER THE HEADING BELOW lg, NOT BELOW sm. Sharing
            // the line from 640px up left 24px between the two at 700px, which
            // is not a gap, it is a near miss. The heading needs the full
            // measure until there is genuinely room beside it.
            className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12"
          >
            <div className="flex flex-col gap-4">
              <p className="font-text text-k-label uppercase text-k-gold">
                {fill(page.howItMoves.eyebrow)}
              </p>
              {/* "Four steps, no surprises" was here and went on 29 Jul 2026 at
                  the client's word. Two things were wrong with it. It counted
                  the steps, which the four columns underneath already do by
                  being four columns, and "no surprises" is a promise about how
                  the job will go rather than a statement of what happens, which
                  is the register this whole site avoids.

                  This names the four things the reader actually receives, in
                  the order they arrive, and every one of those nouns is already
                  in the step it belongs to: "Call dispatch", "A real number",
                  "You get the route", "proof on arrival". */}
              <h2
              data-tina-field={tinaField(page.howItMoves, "heading")}
              className="font-display text-k-d2 font-black text-k-ink"
            >
              {fill(page.howItMoves.heading)}
            </h2>
              {/* A lede sat here reading "Six fields in, one phone number
                  throughout." Step 01 below it already names the six fields and
                  lists them, and step 04 already closes on dispatch being
                  reachable throughout, so the summary was made entirely of the
                  two lines directly underneath it. */}
            </div>
            <Link
              href={link(page.howItMoves.cta).href}
              className="w-fit shrink-0 whitespace-nowrap rounded-full bg-k-ink px-8 py-4 font-text text-k-label uppercase text-k-on-dark transition-opacity duration-200 hover:opacity-85"
            >
              {link(page.howItMoves.cta).label}
            </Link>
          </Reveal>

          {/*
           * THE FOUR STEPS, FOUR ACROSS AND UNRULED.
           *
           * This was a single rail with a dot at each step, running across at
           * lg and down the left below it. The rail is gone and so are the
           * numerals, which is the reference's argument and it holds: four
           * columns read left to right in order without being told, so a
           * drawn line and a printed 01 were both spending ink to say what
           * the arrangement already said.
           *
           * WHAT CARRIES THE STEP NOW IS ITS MARK, then its name, then the
           * sentence. Nothing is boxed and there is no rule between columns.
           * The separation is the gap, which is why the gap is large and must
           * stay large: at anything under about 40px the four columns start to
           * read as one paragraph in four pieces.
           *
           * It is an ordered list because the order is the meaning. The marker
           * is suppressed by the flex container rather than by list-none, so
           * the semantics survive.
           */}
          <ol className="mt-20 grid grid-cols-1 gap-x-12 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {page.howItMoves.steps.map((step, i) => (
              <li key={step.n} className="flex">
                <Reveal index={i} className="flex flex-col gap-5">
                  <span className="text-k-gold">{STEP_ICONS[step.n]}</span>
                  <div className="flex flex-col gap-2.5">
                    <h3
              data-tina-field={tinaField(step, "name")}
              className="font-display text-k-lede font-black text-k-ink"
            >
              {fill(step.name)}
            </h3>
                    <Copy
                      text={step.body}
                      className="max-w-[34ch] font-text text-k-small text-k-ink-soft"
                      linkClassName="underline underline-offset-4"
                    />
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* THREE OF THE SEVEN USED TO BE WRITTEN OUT AGAIN HERE, under the
          heading "In detail": Power Only, Reefer and Dedicated, each with a
          wide photograph and two sentences. It went on 29 Jul 2026 and should
          not come back.

          Every word of it was a shorter version of the service's own page,
          which is one click away from the row above and carries the full
          description, what it is best for, what KUL commits to, the
          measurements and the drawings. Saying a worse version of that first
          made the page longer without making it more useful, and it quietly
          told a reader that four of the seven services were less important
          than the other three, which is not true and is not something KUL
          would say out loud.

          There is deliberately no closing call to action either. The footer on
          every page already carries the same dark band, the same quote link
          and the same phone number. */}
    </>
  );
}
