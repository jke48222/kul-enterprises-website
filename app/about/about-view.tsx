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
 *
 * Outside the editor useTina hands back exactly what it was given, so on the
 * live site this renders once and costs nothing.
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
   * ABOUT
   *
   * THE WORDS ARE THE CLIENT'S OWN STATEMENT, received 5 August 2026 and set
   * here in full. It replaced the founder's note and the "how it runs today"
   * section that used to make up this page. Three small corrections were made
   * in the setting, none of them a rewrite: "were not built" became "was not
   * built", "Continuously improving" became "Improve continuously" so the six
   * commitments all give an instruction the same way, and one sentence was
   * restructured to lose an em dash, which this site does not use.
   *
   * WHAT EACH PAGE ON THE SITE OWNS, so none of them repeat each other:
   *   Safety      what KUL holds itself to, written as policy
   *   Road Ahead  the growth plan and the figures as they stand
   *   About       the statement of purpose, and the licence particulars
   *
   * "Looking Forward" below speaks of growth in the client's words and names
   * no figures. The figures stay on the Road Ahead page; do not copy them in
   * here, or the two pages will drift apart the first time one is updated.
   *
   * ON THE LAYOUT. Every section is a different shape on purpose, because the
   * version of this site the client rejected used one shape eleven times over.
   * The shapes that carried the old page were kept and the new words were laid
   * into them; each one is named in the comment above it.
   *
   * TO UPDATE IT: every word is in content/pages/about.json and is edited at
   * /admin under "About page". The phone number, email, DOT and MC numbers and
   * the tagline are not written there either: the copy carries {phone},
   * {usdot} and {tagline} tokens that fill from Business Facts, so each fact
   * exists in exactly one place on the site.
   *
   * MARK'S PORTRAIT AND SIGNATURE left with the founder's note. His face is
   * on the Journey page, which is the page about him; this page is now the
   * company speaking, and it ends on the imprint, signed with the mark.
   */

  return (
    <>
      {/* THE OPENING
          Shape taken from the Face Formula about page: the headline set very
          large and hard against the left margin, then a single photograph
          held in below it with a wide margin on one side, and a small line of
          tracked capitals keyed to the picture's top corner.

          The headline is the statement's own subtitle. The picture is
          indented from the left and runs out to the right margin, so it
          leans the opposite way to the headline above it. */}
      <section className="bg-k-paper px-6 pb-32 pt-36 md:px-12 lg:px-24 lg:pt-44">
        <div className="mx-auto max-w-[1248px]">
          <Breadcrumb
            className="pb-10"
            items={[{ label: "KUL", href: "/" }, { label: "About" }]}
          />

          <Reveal variant="wipe">
            <h1
              data-tina-field={tinaField(about.opening, "heading")}
              className="max-w-[1060px] font-display text-k-d1 font-black text-k-ink"
            >
              {fill(about.opening.heading)}
            </h1>
          </Reveal>

          <div className="pt-[clamp(3.5rem,2rem+6vw,7.5rem)] lg:pl-[100px]">
            <Reveal variant="settle">
              {/* This line describes the company, not the photograph. Do not
                  turn it into a caption claiming where the picture was taken. */}
              <span className="font-text text-k-micro uppercase text-k-ink-soft">
                {fill(about.opening.caption)}
              </span>
            </Reveal>
            <Reveal className="mt-3.5">
              <div className="relative aspect-[16/9] w-full">
                {/* Mark's own photograph. Everything on this site is a picture
                    he took, which is the point: a carrier should not
                    illustrate itself with somebody else's fleet. */}
                <Image
                  src={about.opening.image}
                  alt={fill(about.opening.imageAlt)}
                  fill
                  sizes="(min-width:1024px) 1148px, 100vw"
                  className="object-cover"
                  priority
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* THE BELIEF
          Shape taken from the mymind principles page: a small label out in
          the left margin, then one line set much larger than everything
          around it, with the supporting paragraphs a step smaller and softer
          beneath. The size is doing the work of a headline, which is why
          there is no headline.

          The large line returns in the closing section at the foot of the
          page. That repeat is deliberate, the statement opens and closes on
          the same sentence, so if the words change here they must change
          there too. Both live in the same file in the CMS. */}
      <section className="bg-k-coal px-6 py-32 md:px-12 lg:px-24 lg:py-36">
        <div className="mx-auto flex max-w-[1248px] flex-col gap-10 lg:flex-row lg:gap-24">
          <Reveal variant="settle" className="lg:w-[192px] lg:shrink-0 lg:pt-3">
            <span className="font-text text-k-micro uppercase text-k-on-dark-soft">
              {fill(about.community.eyebrow)}
            </span>
          </Reveal>
          <div className="flex flex-1 flex-col">
            <Reveal>
              <p
                data-tina-field={tinaField(about.community, "statement")}
                className="max-w-[900px] font-text text-k-d3 leading-[1.33] tracking-[-0.01em] text-k-on-dark"
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
          </div>
        </div>
      </section>

      {/* MORE THAN TRANSPORTATION
          A split lead: the founding belief set large on the left, and what
          follows from it in ordinary type on the right, the two halves of one
          thought sitting level with each other. The lead is one sentence
          pair; if it grows past that it stops being a lead and should move
          into the right-hand column with the rest. */}
      <section className="bg-k-paper px-6 py-32 md:px-12 lg:px-24 lg:py-36">
        <div className="mx-auto max-w-[1248px]">
          <Reveal variant="settle">
            <span className="font-text text-k-micro uppercase text-k-gold">
              {fill(about.founding.eyebrow)}
            </span>
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-24">
            <Reveal variant="wipe">
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

      {/* BUILT THROUGH EXPERIENCE
          Shape taken from the KÖPPEN founders' note: a narrow column of small
          dense type on one side, a very large picture filling the other and
          running off the edge of the screen, and a wide empty gutter left
          between the two.

          The contrast in size is the whole idea. The type stays small even
          though there is room to enlarge it, because a quiet column beside a
          big picture reads as something written, and the same words set large
          would read as a slogan.

          The film is Mark's own dashcam, filmed forward from the cab. The
          column speaks of thousands of miles and the picture is a recording
          of them, which is why this section kept the film when the founder's
          note it belonged to came off the page. */}
      <section className="bg-k-surface">
        <div className="flex flex-col lg:flex-row lg:items-stretch lg:justify-between">
          {/* 396px is the 96px left margin plus a 300px column of text. The
              two are added together because the padding sits inside the
              width, and a 300px box here would leave only 204px to read. */}
          <div className="px-6 py-24 md:px-12 lg:w-[396px] lg:shrink-0 lg:py-32 lg:pl-24 lg:pr-0">
            <Reveal variant="settle">
              <span className="font-text text-k-micro uppercase text-k-gold">
                {fill(about.experience.eyebrow)}
              </span>
            </Reveal>
            {/* Four short paragraphs fit the column now that no signature
                sits under them. If one grows long, split it or cut it: at
                300px wide a long paragraph reads as a wall. */}
            <Reveal className="mt-5 flex flex-col gap-4">
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
              asked for reduced motion keeps a picture rather than a blank.
              That switch is in CSS in app/globals.css, not in a JavaScript
              branch here, for the reason set out in components/k/Reveal.tsx. */}
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

      {/* THE WAY WE DO BUSINESS
          Two paragraphs and a lead-in line, then the six commitments counted
          out on a ruled grid, each under a small gold number. The grid is the
          reason this section sits on the dark ground: six short instructions
          in a row read as a list anywhere else, and here they read as the
          standards the section says they are.

          KEEP EACH COMMITMENT TO A FEW WORDS. They are set at display size,
          and a commitment that wraps to three lines stops reading as a
          standard and starts reading as a paragraph that lost its way. */}
      <section className="bg-k-coal px-6 py-32 md:px-12 lg:px-24 lg:py-36">
        <div className="mx-auto max-w-[1248px]">
          <Reveal variant="settle">
            <span className="font-text text-k-micro uppercase text-k-on-dark-soft">
              {fill(about.standards.eyebrow)}
            </span>
          </Reveal>
          <div className="mt-8 flex max-w-[720px] flex-col gap-6">
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

      {/* LOOKING FORWARD
          A single indented column, pushed off the left margin the same
          distance the opening photograph is, so the two ends of the page
          lean the same way. Five short paragraphs, the first at full
          strength and the rest a step softer.

          This section speaks of growth and names no figures. The numbers
          live on the Road Ahead page; keep them there. */}
      <section className="bg-k-paper px-6 py-32 md:px-12 lg:px-24 lg:py-36">
        <div className="mx-auto max-w-[1248px]">
          <div className="lg:pl-[100px]">
            <Reveal variant="settle">
              <span className="font-text text-k-micro uppercase text-k-gold">
                {fill(about.forward.eyebrow)}
              </span>
            </Reveal>
            <div className="mt-8 flex max-w-[760px] flex-col gap-6">
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
        </div>
      </section>

      {/* OUR COMMITMENT
          The belief section turned the other way up: the quiet paragraphs
          come first and the large line lands last, because it is the line
          the whole statement has been walking towards, and it is the same
          sentence the page opened on. That repeat is the point. If the
          sentence changes in the belief section it must change here too. */}
      <section className="bg-k-surface px-6 py-32 md:px-12 lg:px-24 lg:py-36">
        <div className="mx-auto max-w-[1248px]">
          <Reveal variant="settle">
            <span className="font-text text-k-micro uppercase text-k-gold">
              {fill(about.commitment.eyebrow)}
            </span>
          </Reveal>
          <div className="mt-8 flex max-w-[720px] flex-col gap-6">
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

      {/* THE PARTICULARS
          Shape taken from the colophon on Runway's Telescope site: one wide
          line of capitals across the top, a rule under it, then a row of
          narrow columns of small print, each headed by a tiny label.

          The sentence beside the mark is the tagline, filled from Business
          Facts by the {tagline} token, so the statement closes on the same
          three lines the lockup carries and the words exist in one place.

          This is where the page ends. There is no closing call to action
          because the dispatch column below is one, and because a band saying
          "get a quote" under an imprint would undo the register the whole
          page is written in. The footer carries the rest. */}
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
