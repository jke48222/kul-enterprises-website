"use client";

import Image from "next/image";
import HeroVideo from "@/components/k/HeroVideo";
import Reveal, { RuleDraw } from "@/components/k/Reveal";
import Breadcrumb from "@/components/k/Breadcrumb";
import Copy from "@/components/k/Copy";
import { fill } from "@/lib/content";
import { useTina, tinaField } from "tinacms/dist/react";
import type { TinaPage } from "@/lib/tina";

/**
 * ABOUT, THE HALF THAT DRAWS.
 *
 * app/about/page.tsx fetches on the server and hands the result down. This half
 * subscribes with useTina, which is what makes the visual editor work: inside
 * /admin the page redraws as the client types, and any element carrying a
 * data-tina-field can be clicked to jump straight to its field.
 */

/**
 * The shape of the content, taken from the file itself.
 *
 * Tina's generated types mark every field optional because every field in
 * the CMS can be emptied, which would mean writing `?.` through markup that
 * is otherwise readable. The JSON on disk is the canonical shape and the
 * schema mirrors it, so the live data is read against that. `typeof
 * import(...)` is type-only and adds nothing to the browser bundle.
 */
type Content = typeof import("@/content/pages/about.json");

export default function AboutView(props: TinaPage<{ aboutPage: unknown }>) {
  // Outside the editor this hands straight back what the server fetched.
  const { data } = useTina({
    query: props.query ?? "",
    variables: props.variables ?? {},
    data: props.data,
  });
  const about = data.aboutPage as unknown as Content;

  /**
   * ABOUT, REBUILT WHOLE AT THE FIRST WALKTHROUGH (project-docs/32).
   *
   * THE WORDS ARE THE CLIENT'S OWN STATEMENT, received 5 August 2026 and set
   * here in full, in his order, verbatim. Three small corrections were made
   * in the setting and must survive every future pass: "were not built"
   * became "was not built", "Continuously improving" became "Improve
   * continuously" so the six commitments all give an instruction the same
   * way, and one sentence was restructured to lose an em dash, which this
   * site does not use.
   *
   * THE SHAPE IS A DOCUMENT WITH A CONTENTS PAGE, and it was built from
   * three references, each contributing one move:
   *
   *   Maersk /about        the purpose line is the hero: the page opens on
   *                        the statement's own words on a dark cover, with
   *                        nothing else on the fold competing, and closes on
   *                        a plate of plain facts.
   *   37signals.com        the manifesto reads as a numbered index. Their
   *                        whole site opens as "00. Start here" down a
   *                        numbered list of beliefs; this cover does the
   *                        same with Mark's five section titles, each an
   *                        anchor down into its chapter.
   *   Mobbin (web, about)  the numbered values grid: short imperatives
   *                        counted out under small numerals, which is how
   *                        the six commitments are set.
   *
   * THE CONTENTS LIST IS DERIVED FROM THE CHAPTER FIELDS, not written twice:
   * each entry reads the same CMS field its chapter heading reads, so a
   * renamed section renames itself in the index and the two can never
   * drift apart.
   *
   * WHAT EACH PAGE ON THE SITE OWNS, so none of them repeat each other:
   *   Safety      what KUL holds itself to, written as policy
   *   Road Ahead  the growth plan and the figures as they stand
   *   About       the statement of purpose, and the licence particulars
   *
   * "Looking Forward" speaks of growth in the client's words and names no
   * figures. The figures stay on the Road Ahead page; do not copy them in
   * here, or the two pages drift apart the first time one is updated.
   *
   * MARK'S PORTRAIT AND SIGNATURE left with the founder's note in the
   * August rebuild. This page is the company speaking; the one photograph
   * on it is his own dashcam film, beside the words about the miles it
   * records, and the page ends on the imprint, signed with the mark.
   */

  /**
   * The five chapters, in the email's order. Each entry couples the CMS
   * group that owns the title to the anchor its cover line jumps to. The
   * ids are structural and stay out of the CMS on purpose: an anchor that
   * can be retyped in a sidebar is a broken contents page waiting to
   * happen.
   */
  const chapters = [
    { id: "c1", group: about.founding, n: "01" },
    { id: "c2", group: about.experience, n: "02" },
    { id: "c3", group: about.standards, n: "03" },
    { id: "c4", group: about.forward, n: "04" },
    { id: "c5", group: about.commitment, n: "05" },
  ];

  return (
    <>
      {/* ================================================================
          THE COVER. Coal, and nothing on it but the document itself: the
          title, the purpose line, its two paragraphs, and the contents.
          The Maersk move (purpose as hero) opens it and the 37signals move
          (the numbered index) closes it, so the fold reads as the front
          page of a statement rather than as a website's hero.
          ================================================================ */}
      <section className="bg-k-coal px-6 pb-24 pt-36 md:px-12 lg:px-24 lg:pt-44">
        <div className="mx-auto max-w-[1248px]">
          <Breadcrumb
            tone="dark"
            className="pb-10"
            items={[{ label: "KUL", href: "/" }, { label: "About" }]}
          />

          <Reveal variant="settle">
            <span
              data-tina-field={tinaField(about.opening, "eyebrow")}
              className="font-text text-k-micro uppercase text-k-gold-lit"
            >
              {fill(about.opening.eyebrow)}
            </span>
          </Reveal>
          <Reveal variant="wipe" className="mt-6">
            <h1
              data-tina-field={tinaField(about.opening, "heading")}
              className="max-w-[1060px] font-display text-k-d1 font-black text-k-on-dark"
            >
              {fill(about.opening.heading)}
            </h1>
          </Reveal>

          {/* The purpose line, and the two paragraphs that explain it. The
              same sentence closes the page in chapter 05; that repeat is
              the statement's own bookend and both ends read one CMS file. */}
          <Reveal className="mt-16">
            <p
              data-tina-field={tinaField(about.community, "statement")}
              className="max-w-[880px] font-text text-k-d3 leading-[1.33] tracking-[-0.01em] text-k-on-dark"
            >
              {fill(about.community.statement)}
            </p>
          </Reveal>
          <div className="mt-10 flex max-w-[720px] flex-col gap-6">
            {about.community.paragraphs.map((paragraph, i) => (
              <Reveal key={paragraph.slice(0, 40)} index={i}>
                <Copy
                  text={paragraph}
                  className="font-text text-k-lede text-k-on-dark-soft"
                  linkClassName="underline underline-offset-4"
                />
              </Reveal>
            ))}
          </div>

          {/* THE CONTENTS. Five titles, five anchors, every one read from
              the field its chapter heading reads. Muted by default and lit
              on hover, the way 37signals dims the beliefs below the fold. */}
          <Reveal variant="settle" className="mt-20">
            <ol className="flex flex-col border-t border-white/15">
              {chapters.map((chapter) => (
                <li key={chapter.id} className="border-b border-white/15">
                  <a
                    href={`#${chapter.id}`}
                    className="group flex items-baseline gap-6 py-5 transition-colors duration-200"
                  >
                    <span className="font-text text-k-micro uppercase tabular-nums text-k-gold-lit">
                      {chapter.n}
                    </span>
                    <span className="font-display text-k-d3 font-black text-k-on-dark-soft transition-colors duration-200 group-hover:text-k-on-dark">
                      {fill(chapter.group.eyebrow)}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* ================================================================
          01 · MORE THAN TRANSPORTATION. The founding belief set large on
          the left, what follows from it on the right, under the first
          numbered chapter head.
          ================================================================ */}
      <section id="c1" className="scroll-mt-24 bg-k-paper px-6 py-32 md:px-12 lg:px-24 lg:py-36">
        <div className="mx-auto max-w-[1248px]">
          <Reveal variant="wipe">
            <h2 className="flex items-baseline gap-6">
              <span className="font-text text-k-micro uppercase tabular-nums text-k-gold">
                01
              </span>
              <span
                data-tina-field={tinaField(about.founding, "eyebrow")}
                className="font-display text-k-d2 font-black text-k-ink"
              >
                {fill(about.founding.eyebrow)}
              </span>
            </h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-24">
            {/* The default rise, not the wipe: the wipe is for headlines
                that hold one or two lines, and this lead runs to seven, so
                a wipe shows a sliver of every line at once mid-move. */}
            <Reveal>
              <p
                data-tina-field={tinaField(about.founding, "lead")}
                className="font-text text-k-d3 leading-[1.33] tracking-[-0.01em] text-k-ink"
              >
                {fill(about.founding.lead)}
              </p>
            </Reveal>
            <div className="flex flex-col gap-6 lg:pt-2">
              {about.founding.paragraphs.map((paragraph, i) => (
                <Reveal key={paragraph.slice(0, 40)} index={i}>
                  <Copy
                    text={paragraph}
                    className="font-text text-k-body text-k-ink"
                    linkClassName="underline underline-offset-4"
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          02 · BUILT THROUGH EXPERIENCE. A narrow column of small dense
          type beside the dashcam film. The column speaks of thousands of
          miles and the picture is a recording of them, which is why this
          chapter keeps the page's one photograph.
          ================================================================ */}
      <section id="c2" className="scroll-mt-24 bg-k-surface">
        <div className="flex flex-col lg:flex-row lg:items-stretch lg:justify-between">
          {/* 396px is the 96px left margin plus a 300px column of text. The
              two are added together because the padding sits inside the
              width, and a 300px box here would leave only 204px to read. */}
          <div className="px-6 py-24 md:px-12 lg:w-[396px] lg:shrink-0 lg:py-32 lg:pl-24 lg:pr-0">
            <Reveal variant="wipe">
              {/* A step smaller than the other chapter heads because the
                  column is 300px wide and a d2 line would wrap to four. */}
              <h2 className="flex items-baseline gap-4">
                <span className="font-text text-k-micro uppercase tabular-nums text-k-gold">
                  02
                </span>
                <span
                  data-tina-field={tinaField(about.experience, "eyebrow")}
                  className="font-display text-k-d3 font-black text-k-ink"
                >
                  {fill(about.experience.eyebrow)}
                </span>
              </h2>
            </Reveal>
            {/* Four short paragraphs fit the column. If one grows long,
                split it or cut it: at 300px wide a long paragraph reads as
                a wall. */}
            <Reveal className="mt-6 flex flex-col gap-4">
              {about.experience.paragraphs.map((paragraph) => (
                <Copy
                  key={paragraph.slice(0, 40)}
                  text={paragraph}
                  className="font-text text-k-small text-k-ink"
                  linkClassName="underline underline-offset-4"
                />
              ))}
            </Reveal>
          </div>

          {/* The still behind the film is the poster, so the column is never
              an empty half-screen while the video loads and anyone who has
              asked for reduced motion keeps a picture rather than a blank. */}
          <div className="relative min-h-[420px] w-full lg:min-h-[640px] lg:w-1/2">
            <Image
              src={about.experience.posterImage}
              alt={fill(about.experience.posterImageAlt)}
              fill
              sizes="(min-width:1024px) 50vw, 100vw"
              className="object-cover"
            />
            {/* Through HeroVideo for the pause control and the honest
                reduced-motion path; the Image behind it is the poster
                fallback either way. The name is derived from the CMS path
                so the field keeps its one job: naming the file. */}
            <HeroVideo
              name={about.experience.video.replace(/^\/videos\//, "").replace(/(-720)?\.mp4$/, "")}
              poster={about.experience.posterImage}
              label="the road film"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ================================================================
          03 · THE WAY WE DO BUSINESS. Two paragraphs and a lead-in, then
          the six commitments counted out on the dark ground, where six
          short instructions read as standards rather than as a list.

          KEEP EACH COMMITMENT TO A FEW WORDS. They are set at display
          size, and one that wraps to three lines stops reading as a
          standard and starts reading as a paragraph that lost its way.
          ================================================================ */}
      <section id="c3" className="scroll-mt-24 bg-k-coal px-6 py-32 md:px-12 lg:px-24 lg:py-36">
        <div className="mx-auto max-w-[1248px]">
          <Reveal variant="wipe">
            <h2 className="flex items-baseline gap-6">
              <span className="font-text text-k-micro uppercase tabular-nums text-k-gold-lit">
                03
              </span>
              <span
                data-tina-field={tinaField(about.standards, "eyebrow")}
                className="font-display text-k-d2 font-black text-k-on-dark"
              >
                {fill(about.standards.eyebrow)}
              </span>
            </h2>
          </Reveal>
          <div className="mt-12 flex max-w-[720px] flex-col gap-6">
            {about.standards.paragraphs.map((paragraph, i) => (
              <Reveal key={paragraph.slice(0, 40)} index={i}>
                <Copy
                  text={paragraph}
                  className={`font-text text-k-lede ${
                    i === 0 ? "text-k-on-dark" : "text-k-on-dark-soft"
                  }`}
                  linkClassName="underline underline-offset-4"
                />
              </Reveal>
            ))}
          </div>

          <div className="mt-14 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {about.standards.commitments.map((commitment, i) => (
              <Reveal
                key={commitment}
                variant="settle"
                index={i}
                className="flex flex-col gap-4 border-t border-white/15 pt-5"
              >
                <span className="font-text text-k-micro uppercase tabular-nums text-k-gold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-k-d3 font-bold text-k-on-dark">
                  {fill(commitment)}
                </span>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-12">
            <Copy
              text={about.standards.closing}
              className="max-w-[560px] font-text text-k-small text-k-on-dark-soft"
              linkClassName="underline underline-offset-4"
            />
          </Reveal>
        </div>
      </section>

      {/* ================================================================
          04 · LOOKING FORWARD. The three modes his vision names, set as a
          row where he names them, then the paragraphs. His words made
          visible, not a claim of services: the paragraphs say plainly this
          is a goal, and no figure or date is attached to any of them.
          ================================================================ */}
      <section id="c4" className="scroll-mt-24 bg-k-paper px-6 py-32 md:px-12 lg:px-24 lg:py-36">
        <div className="mx-auto max-w-[1248px]">
          <Reveal variant="wipe">
            <h2 className="flex items-baseline gap-6">
              <span className="font-text text-k-micro uppercase tabular-nums text-k-gold">
                04
              </span>
              <span
                data-tina-field={tinaField(about.forward, "eyebrow")}
                className="font-display text-k-d2 font-black text-k-ink"
              >
                {fill(about.forward.eyebrow)}
              </span>
            </h2>
          </Reveal>

          <Reveal variant="settle" className="mt-12">
            <ol className="flex max-w-[640px] flex-col gap-x-6 gap-y-4 sm:flex-row">
              {(about.forward.modes ?? []).map((mode, i) => (
                <li
                  key={mode}
                  className="flex flex-1 items-baseline gap-3 border-t border-k-ink/15 pt-4"
                >
                  <span className="font-text text-k-micro uppercase tabular-nums text-k-gold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-text text-k-body font-semibold uppercase tracking-[0.08em] text-k-ink">
                    {fill(mode)}
                  </span>
                </li>
              ))}
            </ol>
          </Reveal>

          <div className="mt-12 flex max-w-[760px] flex-col gap-6">
            {about.forward.paragraphs.map((paragraph, i) => (
              <Reveal key={paragraph.slice(0, 40)} index={i}>
                <Copy
                  text={paragraph}
                  className={`font-text text-k-lede ${
                    i === 0 ? "text-k-ink" : "text-k-ink-soft"
                  }`}
                  linkClassName="underline underline-offset-4"
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          05 · OUR COMMITMENT. The quiet paragraphs first, then the line
          the whole statement has been walking towards, which is the same
          sentence the cover opened on. The cover and this close are the
          document's two dark ends; the repeat is the point, and both read
          one CMS file.
          ================================================================ */}
      <section id="c5" className="scroll-mt-24 bg-k-surface px-6 py-32 md:px-12 lg:px-24 lg:py-36">
        <div className="mx-auto max-w-[1248px]">
          <Reveal variant="wipe">
            <h2 className="flex items-baseline gap-6">
              <span className="font-text text-k-micro uppercase tabular-nums text-k-gold">
                05
              </span>
              <span
                data-tina-field={tinaField(about.commitment, "eyebrow")}
                className="font-display text-k-d2 font-black text-k-ink"
              >
                {fill(about.commitment.eyebrow)}
              </span>
            </h2>
          </Reveal>
          <div className="mt-12 flex max-w-[720px] flex-col gap-6">
            {about.commitment.paragraphs.map((paragraph, i) => (
              <Reveal key={paragraph.slice(0, 40)} index={i}>
                <Copy
                  text={paragraph}
                  className="font-text text-k-lede text-k-ink-soft"
                  linkClassName="underline underline-offset-4"
                />
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-12">
            <p
              data-tina-field={tinaField(about.commitment, "closing")}
              className="max-w-[900px] font-text text-k-d3 leading-[1.33] tracking-[-0.01em] text-k-ink"
            >
              {fill(about.commitment.closing)}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ================================================================
          THE PARTICULARS. One wide line of capitals, a rule, then narrow
          columns of small print: the imprint at the foot of the document,
          signed with the mark. Maersk closes its about page on a plate of
          plain facts for the same reason.

          There is no closing call to action, because a band saying "get a
          quote" under an imprint would undo the register the whole page is
          written in. The footer carries the rest.
          ================================================================ */}
      <section className="bg-k-paper px-6 py-32 md:px-12 lg:px-24 lg:py-36">
        {/* The mark sits opposite the sentence, so the row reads as a
            signature at the end of a document, which is what an imprint is.
            Below lg it goes after the sentence rather than before, because
            stacked, a logo above a line of type reads as a header, and this
            is a foot.

            The file is logo-lockup.webp, the full colour lion with the
            wordmark and the tagline, genuinely cut out and checked over a
            magenta ground: it carries no white matte. It carries an empty
            alt because the sentence beside it is the tagline the lockup
            itself prints, so a screen reader would otherwise hear the same
            words twice in a row. */}
        <div className="mx-auto flex max-w-[1248px] flex-col">
          <Reveal
            variant="wipe"
            className="flex flex-col-reverse items-start gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-16"
          >
            <h2
              data-tina-field={tinaField(about.imprint, "statement")}
              className="max-w-[840px] font-display text-k-d3 font-black uppercase tracking-[0.01em] text-k-ink"
            >
              {fill(about.imprint.statement)}
            </h2>
            <Image
              src={about.imprint.logo}
              alt=""
              width={1024}
              height={867}
              sizes="132px"
              className="h-auto w-[104px] shrink-0 lg:w-[132px]"
            />
          </Reveal>

          <RuleDraw className="mt-14" />

          {/* THE COLUMN WIDTHS ARE UNEVEN ON PURPOSE, so the block ends on a
              ragged edge rather than lining up into a neat grid. That is the
              whole point of the shape: do not try to even them up.

              The template names six tracks and the CMS currently holds five
              entries, which leaves the last track empty and is what gives the
              row its open right-hand end. Adding a seventh entry in the CMS
              wraps it to a second row rather than breaking anything, but the
              widths are a design decision and live here, not in the CMS. */}
          <div className="mt-10 grid grid-cols-1 items-start gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-[160fr_230fr_160fr_190fr_228fr_160fr]">
            {about.imprint.particulars.map((item, i) => (
              <Reveal
                key={item.label}
                variant="settle"
                index={i}
                className="flex flex-col gap-3"
              >
                <span
                  className={`font-text text-k-micro uppercase ${
                    item.gold ? "text-k-gold" : "text-k-ink-soft"
                  }`}
                >
                  {fill(item.label)}
                </span>
                <Copy
                  text={item.body}
                  className="font-text text-k-small text-k-ink"
                  linkClassName="underline underline-offset-4"
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
