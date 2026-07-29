import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import Reveal, { RuleDraw } from "@/components/k/Reveal";
import Breadcrumb from "@/components/k/Breadcrumb";

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
 * TO UPDATE IT: the phone number, email, DOT and MC numbers all come from
 * content/site.json, so they are changed in that one file and never typed in
 * here. The wording below is safe to edit directly.
 */

export const metadata: Metadata = {
  title: "About",
  description: `KUL Enterprises is a licensed freight carrier in ${site.location}, founded by a driver with eleven years on the road. USDOT ${site.usdot}, MC ${site.mc}.`,
};

/**
 * THE PARTICULARS, set out at the foot of the page like the imprint printed
 * inside the cover of a magazine.
 *
 * The columns are deliberately different widths and different lengths, so
 * the block ends on a ragged edge rather than lining up into a neat grid.
 * That is the whole point of the shape, so if you add an entry, do not try
 * to even them up. The widths themselves are set on the grid further down
 * the page, in the order the entries appear here.
 *
 * "Not yet" is here on purpose. Saying plainly what KUL does not have yet is
 * worth more to a broker than padding the page with things that sound good.
 */
const PARTICULARS = [
  {
    label: "Founded",
    gold: false,
    body: <>Registered in Georgia as {site.legalName}. The first load was carried in 2026.</>,
  },
  {
    label: "Authority",
    gold: false,
    body: (
      <>
        USDOT {site.usdot}. MC {site.mc}. Federal operating authority, active,
        valid in 48 states. The record is public and the links to check it are
        on the{" "}
        <Link href="/safety" className="underline underline-offset-4">
          safety page
        </Link>
        .
      </>
    ),
  },
  {
    label: "Base",
    gold: false,
    body: <>{site.location}. The Southeast is the home region. Loads run nationwide.</>,
  },
  {
    label: "Freight",
    gold: false,
    body: (
      <>
        Power only, dry van, refrigerated, dedicated, regional, expedited and
        over the road. Full detail on the{" "}
        <Link href="/services" className="underline underline-offset-4">
          services page
        </Link>
        .
      </>
    ),
  },
  {
    label: "Dispatch",
    gold: true,
    body: (
      <>
        <a href={site.phoneHref} className="underline underline-offset-4">
          {site.phone}
        </a>
        <br />
        <a href={`mailto:${site.email}`} className="underline underline-offset-4">
          {site.email}
        </a>
        <br />
        One number, answered by the driver.
      </>
    ),
  },
  // A sixth entry headed "Not yet" listed what KUL does not have: no published
  // safety rating history, no customer references. It came out on 29 Jul 2026
  // at the client's word. It was honest and it was the last thing in an
  // imprint, which is the position a reader remembers, so the block ended on
  // an absence. Nothing that was in it is contradicted anywhere else on the
  // site; the safety page still says in its own first line that there is no
  // long record yet, which is where a broker looking for one will be.
] as const;

export default function AboutPage() {
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
            <h1 className="max-w-[1060px] font-display text-k-d1 font-black text-k-ink">
              Eleven years for other carriers. Now under our own authority.
            </h1>
          </Reveal>

          <div className="pt-[clamp(3.5rem,2rem+6vw,7.5rem)] lg:pl-[100px]">
            <Reveal variant="settle">
              {/* This line describes the company, not the photograph. Do not
                  turn it into a caption claiming where the picture was taken. */}
              <span className="font-text text-k-micro uppercase text-k-ink-soft">
                {site.serviceArea}
              </span>
            </Reveal>
            <Reveal className="mt-3.5">
              <div className="relative aspect-[16/9] w-full">
                {/* Mark's own photograph. Everything on this site is now a
                    picture he took, which is the point: a carrier that runs
                    one truck should not illustrate itself with somebody
                    else's fleet. */}
                <Image
                  src="/images/journey/s14-confident-highway.webp"
                  alt="An open highway running ahead under clear sky"
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
                The founder
              </span>
            </Reveal>
            <Reveal className="mt-5 flex flex-col gap-4">
              <p className="font-text text-k-small text-k-ink">
                Mark Brown drove for other carriers for eleven years before KUL
                Enterprises carried its first load. Mountain passes, port
                towns, long runs through the middle of the country, and the
                kind of dock where a driver waits four hours and nobody comes
                out to say why.
              </p>
              <p className="font-text text-k-small text-k-ink">
                Eleven years is long enough to learn what a shipper is actually
                paying for. It is whether the person on the phone knows where
                the truck is, and whether the answer still comes when the news
                is bad.
              </p>
              {/* The tail of this used to spell out "one tractor, one driver,
                  and the person who answers dispatch is the person behind the
                  wheel", which is the whole of the "How it runs today" section
                  a few inches below, written out in advance. The founder note
                  ends on the principle and lets that section carry the
                  arrangement. */}
              <p className="font-text text-k-small text-k-ink">
                KUL was set up to run that way from the first load.
              </p>
            </Reveal>
            <Reveal variant="settle" className="mt-7 flex flex-col gap-1">
              <span className="font-text text-k-small font-semibold text-k-ink">
                Mark Brown
              </span>
              <span className="font-text text-k-micro uppercase text-k-ink-soft">
                Founder, {site.name}
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
              src="/images/journey/s07-pines-road.webp"
              alt="A road running between ordered pines before dawn"
              fill
              sizes="(min-width:1024px) 50vw, 100vw"
              className="object-cover"
            />
            <video
              className="kul-sleeve-clip absolute inset-0 h-full w-full object-cover"
              src="/videos/dash-daylight-720.mp4"
              poster="/images/journey/s07-pines-road.webp"
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
              How it runs today
            </span>
          </Reveal>
          <div className="flex flex-1 flex-col gap-9">
            <Reveal>
              {/* THE HEADCOUNT CAME OFF THE FRONT OF BOTH OF THESE and the
                  substance of both is untouched. What KUL can and cannot
                  commit to is a real limit and a broker is entitled to it
                  before they book, so the second paragraph still says it. It
                  says it as a scheduling fact, which is what a broker acts on,
                  rather than as a headcount, which is only ever an apology.
                  See the note in app/page.tsx. */}
              <p className="font-text text-k-d3 leading-[1.33] tracking-[-0.01em] text-k-on-dark">
                Mark drives the truck, takes the booking, runs the lane and
                signs at the receiver. That is why there is one phone number on
                this site and not a switchboard.
              </p>
            </Reveal>
            <Reveal index={1}>
              <p className="font-text text-k-d3 leading-[1.33] tracking-[-0.01em] text-k-on-dark-soft">
                It also means capacity is committed rather than pooled. KUL
                cannot cover a lane on a day it is already booked, and it holds
                nothing back for a surge. When a load does not fit the schedule
                we say so on the call rather than take it and work it out
                later.
              </p>
            </Reveal>
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
            <h2 className="max-w-[840px] font-display text-k-d3 font-black uppercase tracking-[0.01em] text-k-ink">
              {site.legalName} is a licensed motor carrier based in{" "}
              {site.location}.
            </h2>
            <Image
              src="/images/brand/logo-lockup.webp"
              alt=""
              width={1024}
              height={867}
              sizes="132px"
              className="h-auto w-[104px] shrink-0 lg:w-[132px]"
            />
          </Reveal>

          <RuleDraw className="mt-14" />

          {/* The six column widths, in the order the entries are written
              above. They are uneven on purpose. */}
          <div className="mt-10 grid grid-cols-1 items-start gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-[160fr_230fr_160fr_190fr_228fr_160fr]">
            {PARTICULARS.map((item, i) => (
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
                  {item.label}
                </span>
                <p className="font-text text-k-small text-k-ink">{item.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
