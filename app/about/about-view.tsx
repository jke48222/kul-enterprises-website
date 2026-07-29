"use client";

import Image from "next/image";
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
type Content = typeof import("@/content/pages/about.json");



export default function AboutView(props: TinaPage<{ aboutPage: unknown }>) {
  // Outside the editor this hands straight back what the server fetched.
  const { data } = useTina({
    query: props.query ?? "",
    variables: props.variables ?? {},
    data: props.data,
  });
  const about = data.aboutPage as unknown as Content;

  // Derived from the content, so it has to be built per render now that
  // the content arrives at runtime rather than from a static import.
  /**
   * ABOUT
   *
   * This page answers one question a broker actually asks: who is behind the
   * authority. It is not a company history and it is not a second helping of
   * the safety page.
   *
   * WHAT EACH PAGE ON THE SITE OWNS, so none of them repeat each other:
   *   Safety      what KUL holds itself to, written as policy
   *   Road Ahead  the growth plan and the figures as they stand
   *   About       the person, the licence, and how a one truck carrier runs
   *
   * ON THE LAYOUT. Every section here is a different shape on purpose, because
   * the version of this site the client rejected used one shape eleven times
   * over. Each shape below was taken from a real site, named in the comment
   * above it, so nothing here is a house template.
   *
   * ON THE WRITING. Short plain sentences and operational nouns. An earlier
   * draft of this page said things like "trust is in our DNA" and "every mile
   * teaches something new", which is the sort of line that reads as an advert
   * rather than as a carrier talking to a customer. If a sentence could be
   * printed on a poster, it is the wrong sentence.
   *
   * TO UPDATE IT: every word is in content/pages/about.json and is edited at
   * /admin under "About page". The phone number, email, DOT and MC numbers are
   * not written there either: the copy carries {phone} and {usdot} tokens that
   * fill from Business Facts, so those exist in exactly one place on the site.
   *
   * A SIXTH PARTICULAR headed "Not yet" listed what KUL does not have: no
   * published safety rating history, no customer references. It came out on
   * 29 Jul 2026 at the client's word. It was honest and it was the last thing
   * in an imprint, which is the position a reader remembers, so the block ended
   * on an absence. Nothing that was in it is contradicted anywhere else on the
   * site; the safety page still says in its own first line that there is no long
   * record yet, which is where a broker looking for one will be.
   */

  return (
    <>
      {/* THE OPENING
          Shape taken from the Face Formula about page: the headline set very
          large and hard against the left margin, then a single photograph
          held in below it with a wide margin on one side, and a small line of
          tracked capitals keyed to the picture's top corner.

          The picture is indented from the left and runs out to the right
          margin, so it leans the opposite way to the headline above it. */}
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
                {/* Mark's own photograph. Everything on this site is now a
                    picture he took, which is the point: a carrier that runs
                    one truck should not illustrate itself with somebody
                    else's fleet. */}
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

      {/* THE FOUNDER'S NOTE
          Shape taken from the KÖPPEN founders' note: a narrow column of small
          dense type on one side, a very large picture filling the other and
          running off the edge of the screen, and a wide empty gutter left
          between the two.

          The contrast in size is the whole idea. The type stays small even
          though there is room to enlarge it, because a quiet column beside a
          big picture reads as a note somebody wrote, and the same words set
          large would read as a slogan. */}
      <section className="bg-k-surface">
        <div className="flex flex-col lg:flex-row lg:items-stretch lg:justify-between">
          {/* 396px is the 96px left margin plus a 300px column of text. The
              two are added together because the padding sits inside the
              width, and a 300px box here would leave only 204px to read. */}
          <div className="px-6 py-24 md:px-12 lg:w-[396px] lg:shrink-0 lg:py-32 lg:pl-24 lg:pr-0">
            <Reveal variant="settle">
              <span className="font-text text-k-micro uppercase text-k-gold">
                {fill(about.founder.eyebrow)}
              </span>
            </Reveal>
            {/* The tail of the last paragraph used to spell out "one tractor,
                one driver, and the person who answers dispatch is the person
                behind the wheel", which is the whole of the "How it runs
                today" section a few inches below, written out in advance. The
                founder note ends on the principle and lets that section carry
                the arrangement. Keep it to three paragraphs: the column is
                300px wide and a fourth pushes the signature off the picture
                beside it. */}
            <Reveal className="mt-5 flex flex-col gap-4">
              {about.founder.paragraphs.map((paragraph) => (
                <Copy
                  key={paragraph.slice(0, 40)}
                  text={paragraph}
                  className="font-text text-k-small text-k-ink"
                  linkClassName="underline underline-offset-4"
                />
              ))}
            </Reveal>
            <Reveal variant="settle" className="mt-7 flex flex-col gap-1">
              <span className="font-text text-k-small font-semibold text-k-ink">
                {fill(about.founder.signatureName)}
              </span>
              <span className="font-text text-k-micro uppercase text-k-ink-soft">
                {fill(about.founder.signatureRole)}
              </span>
            </Reveal>
          </div>

          {/* The picture has no person in it on purpose. A stock photograph of
              a stranger sitting beside a note signed by Mark would read as a
              picture of Mark, and it is not one. */}
          {/* IT IS FOOTAGE NOW, NOT A STILL, at the client's word. It was a
              photograph of a road between pines; this is Mark's own dashcam,
              filmed forward from the cab, which is a better answer to the note
              beside it: the column is about what he does all day and now the
              picture is a recording of him doing it.

              The still it replaced is the poster, so the column is never an
              empty half-screen while the video loads and anyone who has asked
              for reduced motion keeps a picture rather than a blank. That
              switch is in CSS in app/globals.css, not in a JavaScript branch
              here, for the reason set out in components/k/Reveal.tsx.

              `preload="metadata"` rather than auto: this sits well down the
              page and most readers never reach it, so it fetches the header
              and waits. Muted is what makes autoplay legal, playsInline stops
              iOS taking it fullscreen, and it is decoration beside a signed
              note, so it is hidden from assistive technology entirely. */}
          <div className="relative min-h-[420px] w-full lg:min-h-[760px] lg:w-1/2">
            <Image
              src={about.founder.posterImage}
              alt={fill(about.founder.posterImageAlt)}
              fill
              sizes="(min-width:1024px) 50vw, 100vw"
              className="object-cover"
            />
            <video
              className="kul-sleeve-clip absolute inset-0 h-full w-full object-cover"
              src={about.founder.video}
              poster={about.founder.posterImage}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              tabIndex={-1}
              aria-hidden="true"
            />
          </div>
        </div>
      </section>

      {/* HOW IT RUNS TODAY
          Shape taken from the mymind principles page: no columns, no rules
          and no list, just a short passage of running text set much larger
          than ordinary body copy, with a small label out in the left margin.

          The size is doing the work of a headline, which is why there is no
          headline. Keep this to two paragraphs. At this scale a third one
          stops reading as a statement and starts reading as an essay. */}
      <section className="bg-k-coal px-6 py-32 md:px-12 lg:px-24 lg:py-36">
        <div className="mx-auto flex max-w-[1248px] flex-col gap-10 lg:flex-row lg:gap-24">
          <Reveal variant="settle" className="lg:w-[192px] lg:shrink-0 lg:pt-3">
            <span className="font-text text-k-micro uppercase text-k-on-dark-soft">
              {fill(about.today.eyebrow)}
            </span>
          </Reveal>
          {/* KEEP THIS TO TWO PARAGRAPHS. At this size the type is doing the
              work of a headline, which is why the section has no headline, and
              a third paragraph stops reading as a statement and starts reading
              as an essay. The first is set in full strength, everything after
              it a step softer, so the eye is told which one to read.

              THE HEADCOUNT CAME OFF THE FRONT OF BOTH OF THESE and the
              substance of both is untouched. What KUL can and cannot commit to
              is a real limit and a broker is entitled to it before they book,
              so the second paragraph still says it. It says it as a scheduling
              fact, which is what a broker acts on, rather than as a headcount,
              which is only ever an apology. See the note in app/page.tsx. */}
          <div className="flex flex-1 flex-col gap-9">
            {about.today.paragraphs.map((paragraph, i) => (
              <Reveal key={paragraph.slice(0, 40)} index={i}>
                <Copy
                  text={paragraph}
                  className={`font-text text-k-d3 leading-[1.33] tracking-[-0.01em] ${
                    i === 0 ? "text-k-on-dark" : "text-k-on-dark-soft"
                  }`}
                  linkClassName="underline underline-offset-4"
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* THE PARTICULARS
          Shape taken from the colophon on Runway's Telescope site: one wide
          line of capitals across the top, a rule under it, then a row of
          narrow columns of small print, each headed by a tiny label.

          This is where the page ends. There is no closing call to action
          because the dispatch column below is one, and because a band saying
          "get a quote" under an imprint would undo the register the whole
          page is written in. The footer carries the rest. */}
      <section className="bg-k-paper px-6 py-32 md:px-12 lg:px-24 lg:py-36">
        {/* THE MARK MOVED RATHER THAN LEAVING, AND IT IS A DIFFERENT FILE.
            It used to sit alone above the sentence at 112px, which left the
            imprint opening on a small floating image with nothing beside it.
            It was struck out, then asked back with two corrections: move it,
            and use the right logo.

            WHERE: opposite the sentence rather than above it, so the row reads
            as a signature at the end of a document, which is what an imprint
            is. Below lg it goes after the sentence rather than before, because
            stacked, a logo above a line of type is the arrangement that was
            wrong in the first place.

            WHICH FILE: logo-lockup.webp, the full colour lion with the wordmark
            and the tagline. The one that was here was lockup-dark.webp, a flat
            monochrome trace, which put the brand on the page in a completely
            different language from the gold lion in the bar a few hundred
            pixels above it. Both files are genuinely cut out, checked over a
            magenta ground rather than assumed: neither carries a white matte.
            This one is also 1024x867 rather than 320 square, so it survives
            being printed at any size worth printing it at.

            It carries an empty alt. The sentence beside it is the company's
            legal name, so a screen reader that read the mark as well would
            hear the name twice in a row. */}
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
