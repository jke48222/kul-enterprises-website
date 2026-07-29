import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { services } from "@/lib/services";
import HeroVideo from "@/components/k/HeroVideo";
import Reveal from "@/components/k/Reveal";
import ShapeGrid from "@/components/k/ShapeGrid";
import Faq from "@/components/k/Faq";
import { faqJsonLd } from "@/lib/faq";

/**
 * Home, the page a visitor lands on first.
 *
 * Designed against the Paper artboard "Home, desktop 1440"
 * (app.paper.design/file/01KYKPT9QPZPS05X9H4PH1FSGT). Paper is the design of
 * record; where the two disagree, the artboard is right.
 *
 * The page alternates registers deliberately: dark hero, daylight statement,
 * blueprint rig, daylight services, dark vision, warm story, charcoal footer.
 * Instrument-black is earned, never the default.
 *
 * A broker gets what KUL hauls and how to reach dispatch inside the first
 * screen. Everyone else is invited into the story, further down, optionally.
 */

/** Equipment tag closing each service row. Keyed to lib/services slugs. */
const EQUIPMENT: Record<string, string> = {
  "power-only": "Tractor only",
  "dry-van": "53 ft van",
  reefer: "Temp controlled",
  dedicated: "Recurring lanes",
  regional: "Southeast",
  expedited: "Time critical",
  otr: "48 states",
};

/* A CREDENTIALS list lived here and is gone with the hero strip that read it.
   It held the two authority numbers plus "Licensed & insured" and "Owner
   answers dispatch". The numbers are written into the strip directly now, and
   the two claims are made properly on /safety and /about instead of asserted
   in six words over a video. The same list still exists on the quote page,
   where it closes a page rather than opening one. */

type Spec = {
  value: string;
  unit: string;
  label: string;
  accent?: boolean;
};

/**
 * The four elevations shown under the specification row.
 *
 * The side view is not in this list: it is the large render above, so
 * repeating it here would show the same drawing twice on one screen.
 */
const ELEVATIONS = [
  {
    file: "truck-front",
    label: "Front",
    alt: "The tractor and trailer seen head on",
  },
  {
    file: "truck-rear",
    label: "Rear",
    alt: "The trailer doors seen from behind, closed",
  },
  {
    file: "truck-right",
    label: "Right side",
    alt: "The tractor and trailer seen from the right",
  },
  {
    file: "truck-top",
    label: "From above",
    alt: "The tractor and trailer seen from directly above",
  },
] as const;

const SPECS: readonly Spec[] = [
  { value: "53", unit: " ft", label: "Dry van trailer" },
  { value: "45,000", unit: " lb", label: "Maximum payload" },
  { value: "48", unit: " states", label: "Operating authority" },
  // THE FOURTH FIGURE IS NO LONGER THE FLEET COUNT. It read "1 / Trucks today
  // · 50 by 2029", then "1 / Tractor on the road", and it went on 29 Jul 2026
  // with the rest of the headcount talk: a row headed "The equipment", set in
  // the largest numerals on the page, is the worst possible place to print the
  // smallest number the company owns. The other three figures are all about
  // what the equipment can carry, and this one now is too.
  { value: "2026", unit: "", label: "Under our own authority", accent: true },
];

export default function HomePage() {
  return (
    <>
      {/* Hero, the broker's one screen. */}
      <section className="relative flex min-h-[820px] flex-col justify-end overflow-hidden bg-k-void">
        <HeroVideo
          poster="/videos/kul-hero-poster.jpg"
          label="the hero film"
          controlSlotId="hero-film-control"
          className="absolute inset-0 h-full w-full object-cover opacity-85"
        />
        {/* Directional scrim. Without it the headline collides with the
            trailer's own KUL livery and two wordmarks fight each other. */}
        <div
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.92)_0%,rgba(0,0,0,0.78)_34%,rgba(0,0,0,0.28)_62%,rgba(0,0,0,0.45)_100%)]"
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-64 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.75)_100%)]"
          aria-hidden="true"
        />

        <div className="relative mx-auto w-full max-w-[1440px] px-6 pb-16 pt-40 md:px-12 lg:px-24">
          <div className="flex max-w-[1120px] flex-col gap-8">
            {/* MEASURE LINE TWO BEFORE CHANGING IT. The break is hard, so the
                second line has to fit its own line at 375px or the hero
                becomes three lines on a phone. At the 36px floor the column is
                327px wide: "Owner driven." is 236px, "Driven personally."
                (the previous wording) was 331px and already wrapped, and
                "Driven by the owner." is 370px and wraps up to about 460px,
                which covers most phones in use. */}
            <h1 className="font-display text-k-d1 font-black text-k-on-dark">
              Every mile.
              <br />
              Owner driven.
            </h1>

            {/* ============================================================
                THE FLEET COUNT IS NOT IN THE FIRST LINE OF THIS SITE ANY MORE.
                ============================================================
                It read "One truck today. Fifty by 2029." and it went on
                29 Jul 2026 at the client's word, along with the same framing
                on eight other pages.

                It was honest and it was the wrong thing to lead with. A broker
                arrives asking whether this carrier can move their freight, and
                the first sentence answered a question they had not asked with
                the smallest number the company owns. Nothing is hidden by
                taking it out: the equipment on the road is still set out in
                figures further down this page, the growth plan still has a
                page of its own, and the About page still lists what KUL does
                not have yet. It is simply not the opening line.

                THE ELEVEN YEARS ALSO CAME OUT, separately. The very next
                section is nothing but that fact, set as a display headline, so
                saying it here first spent it before the reader arrived. */}
            <p className="max-w-[620px] font-text text-k-lede text-k-on-dark-soft">
              Freight services out of {site.location}, authorized in 48
              states, dispatched by the person driving.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/quote"
                className="rounded-full bg-k-on-dark px-8 py-4 font-text text-k-label uppercase text-k-ink transition-opacity duration-200 hover:opacity-85"
              >
                Request a quote
              </Link>
              <a
                href={site.phoneHref}
                className="rounded-full border border-k-on-dark-faint px-8 py-4 font-text text-k-label uppercase text-k-on-dark transition-colors duration-200 hover:border-k-on-dark"
              >
                Call dispatch · {site.phone}
              </a>
            </div>
          </div>
        </div>

        {/* THE STRIP ALONG THE BOTTOM OF THE OPENING SCREEN, HALVED.
            It carried five things: USDOT, MC, "Licensed & insured", "Owner
            answers dispatch", and the base plus service area in gold. On a
            phone that wrapped to three lines of small capitals under a
            headline, a paragraph and two buttons, and the client called it too
            much text for the first view. It was.

            Two things are left, and they are the two a broker checks before
            anything else: the authority numbers, which they copy into their
            own system, and where the truck is based. Everything cut from here
            is still on the page or one click away. "Licensed & insured" and
            "Owner answers dispatch" are both said properly on the safety and
            about pages rather than asserted in six words on a hero, and the
            service area is in the footer of every page.

            The numbers stay together on one line at every width, which is why
            they are one span with a separator rather than two items in a wrap
            container: a DOT number broken across two lines is a DOT number
            somebody mistypes. */}
        <div className="relative border-t border-white/15">
          <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-10 gap-y-2 px-6 py-5 md:px-12 lg:px-24">
            <span className="whitespace-nowrap font-text text-k-micro uppercase tabular-nums text-k-on-dark-soft">
              USDOT {site.usdot} · MC {site.mc}
            </span>

            <span className="flex items-center gap-4 md:ml-auto">
              <span
                className="hidden h-px w-12 shrink-0 bg-k-gold-lit md:block"
                aria-hidden="true"
              />
              <span className="font-text text-k-micro uppercase text-k-gold-lit">
                {site.location}
              </span>
            </span>

            {/* WHERE THE FILM'S PAUSE CONTROL LANDS.
                It used to float over the bottom right of the hero, which put it
                on top of this strip at every width and, from 768px up, directly
                over the location beside it: measured at 900px, the button's box
                started at 832 and the location text ran to 852.

                It is a member of this row now rather than something laid over
                it. The row is items-center, so the control shares a centre line
                with the DOT number and the location instead of being nudged
                towards one, and it is set in the same micro caps they are.

                The slot is empty markup on purpose. HeroVideo owns the button,
                because the button's state has to come from the video element's
                own play and pause events, so it is portalled in here rather
                than rebuilt. An id rather than a ref because this page is a
                server component and cannot make one. */}
            <span id="hero-film-control" className="flex items-center" />
          </div>
        </div>
      </section>

      {/* ==================================================================
          STATEMENT, THE TRUST THESIS, ON A DRAFTED GROUND.
          ==================================================================
          It was a flat sheet of #f0f0f0 and the client asked for something
          behind it, not a photograph and not something simple.

          WHAT IT IS: a drafting sheet. Two grids at different intervals, the
          fine one every 26px and the major one every six of those, exactly the
          way a plan sheet divides minor and major. That is not decoration
          picked at random: the service pages already carry measured wireframe
          elevations on a blueprint ground, so the one section on the home page
          that makes a promise now sits on the same paper the promises are
          drawn on. Over it, a warm bloom lifts the middle so the type has
          somewhere to sit, and a vignette in the ground's own colour dissolves
          the grid before it reaches any edge. A grid that runs into the edge
          of a section reads as a table; one that fades reads as a sheet.

          REFERENCE: Reducto, pulled from Mobbin, does the same thing on a warm
          light ground with a faint engineering grid and a soft centre.

THE ALPHAS ARE SET BY A CONTRAST SUM, NOT BY EYE, AND THE FIRST
          ATTEMPT FAILED IT. Every layer here only darkens, and the darkest
          pixel is where a fine line, a major line and the peak of the bloom
          all cross. At the alphas this shipped with first, 0.045 / 0.075 /
          0.05, that pixel was rgb(214,211,207), and --color-ink-soft measured
          4.35:1 on it, which is under the 4.5:1 the paragraph in this section
          needs. Text can and does sit on a grid intersection, so that is a
          real failure and not a theoretical one.

          At the values shipped now, an outline at 0.055 plus a hover fill at
          0.05 plus the peak of the bloom, that pixel is rgb(223,218,211): ink
          is 10.05:1, ink-soft is 4.66:1, and gold is 3.75:1, which is fine
          because gold is only ever the border under the link here and a border
          needs 3:1. ink-soft is the one with the least room, at 0.16 above the
          floor. Re-run that sum before raising anything.

          THE GRID IS A CANVAS AND THE REST IS CSS. Both stop for anyone who
          has asked for less motion: the bloom through a keyframe in
          globals.css, the grid by checking the same query itself. */}
      <section className="relative isolate overflow-hidden bg-k-paper px-6 py-32 md:px-12 lg:px-24">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          {/* THE SHEET ITSELF, in components/k/ShapeGrid.tsx. A drifting field
              of squares that lights up under the pointer with a short fading
              wake behind it. It replaced two static repeating-gradients at the
              client's request, with these settings.

              Diagonal at a tenth of a cell per second is one cell every ten
              seconds: slow enough that a reader registers the page is alive
              without ever catching it moving. The trail is four, so the
              pointer draws a wake rather than lighting one lonely square.

              THESE ARE THE COLOURS THE SUM BELOW WAS DONE ON. Ink at 0.055 for
              the outline, brand gold at 0.05 for the fill. Both only darken,
              which is what makes that sum a bound rather than a guess. */}
          <ShapeGrid
            squareSize={40}
            speed={0.1}
            direction="diagonal"
            shape="square"
            borderColor="rgba(44,44,44,0.055)"
            hoverFillColor="rgba(160,92,8,0.05)"
            hoverTrailAmount={4}
          />
          {/* The warmth under the headline, drifting very slowly. */}
          <div
            className="kul-sheet-bloom absolute inset-[-20%]"
            style={{
              backgroundImage:
                "radial-gradient(58% 46% at 34% 46%, rgba(160,92,8,0.035) 0%, rgba(160,92,8,0.016) 46%, rgba(160,92,8,0) 78%)",
            }}
          />
          {/* The dissolve, in the ground's own colour, so the grid never
              reaches an edge and the section has no visible box. */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(112% 88% at 42% 48%, rgba(240,240,240,0) 34%, rgba(240,240,240,0.72) 74%, var(--color-paper) 100%)",
            }}
          />
        </div>

        <div className="relative mx-auto flex max-w-[1248px] flex-col gap-12 lg:flex-row lg:gap-24">
          {/* The headline uncovers on its own. Wrapping the whole row in that
              entrance would uncover the paragraph column left to right with
              it, and the wipe is built for a single block of display type. */}
          <Reveal variant="wipe" className="flex-1">
            <h2 className="font-display text-k-d2 font-black text-k-ink">
              You will always be talking to the driver.
            </h2>
          </Reveal>
          {/* One paragraph, not two. The second one restated the hero above it
              and the SPECS row below it, which made four statements of the
              same claim on one page, and it praised our own restraint rather
              than telling a broker anything. This column is shorter than the
              headline beside it now, which is fine: nothing is boxed. */}
          <Reveal index={1} className="flex w-full flex-col gap-5 lg:w-[400px] lg:shrink-0">
            {/* The third clause, "and he still drives every load himself",
                went with the same pass: it is the headline beside it said
                again in smaller type. */}
            <p className="font-text text-k-body text-k-ink-soft">
              Dispatch at KUL is Mark Brown. He drove for other carriers for
              eleven years before starting it.
            </p>
            <Link
              href="/about"
              className="w-fit border-b border-k-gold pb-1 font-text text-k-label uppercase text-k-ink"
            >
              Read the full story
            </Link>
          </Reveal>
        </div>
      </section>

      {/* The rig, instrument register, the truck renders' first appearance. */}
      <section className="overflow-hidden bg-k-blueprint pt-28">
        <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-24">
          <p className="flex items-center gap-4 pb-12">
            <span className="h-px w-12 shrink-0 bg-k-gold-lit" aria-hidden="true" />
            <span className="font-text text-k-label uppercase text-k-gold-lit">
              The equipment
            </span>
          </p>
        </div>

        {/* THERE IS NO GHOSTED WORDMARK BEHIND THE RIG, AND THAT IS DELIBERATE.
            One was built here, set very large so the trailer cut through it,
            the way a car maker sets a model name behind the car. It worked and
            it was still wrong: the trailer wrap already prints KUL ENTERPRISES
            LLC at size, so the effect put a second, fainter copy of the same
            word directly behind the real one, and two wordmarks in one view
            make the real livery look like a repeat of itself. The rig is the
            brand moment on this page and it does not need the help. */}
        {/* The rig arrives rather than appears. It is drawn facing left, so
            it comes in from the right, which is the side it would be driving
            away from. The section already clips its overflow, which is what
            keeps the travel from adding a sideways scrollbar. */}
        <Reveal variant="roll" className="mx-auto flex max-w-[1248px] justify-center px-6">
          <Image
            src="/images/truck/truck-body.webp"
            alt="KUL Enterprises tractor and 53-foot dry van trailer, side profile"
            width={1975}
            height={577}
            className="h-auto w-full max-w-[1248px]"
          />
        </Reveal>

        <div className="mt-16 grid grid-cols-2 border-t border-k-rule-dark lg:grid-cols-4">
          {SPECS.map((spec, i) => (
            <div
              key={spec.label}
              className={[
                "flex flex-col gap-2 px-6 py-8 md:px-10",
                i < SPECS.length - 1 ? "lg:border-r lg:border-k-rule-dark" : "",
              ].join(" ")}
            >
              <p
                className={`font-display text-k-d3 font-black tabular-nums ${
                  spec.accent ? "text-k-gold-lit" : "text-k-on-dark"
                }`}
              >
                {spec.value}
                {spec.unit ? (
                  <span className="font-text text-k-body font-normal tracking-normal text-k-on-dark-soft">
                    {spec.unit}
                  </span>
                ) : null}
              </p>
              <p className="font-text text-k-micro uppercase text-k-on-dark-faint">
                {spec.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* THE SAME RIG FROM EVERY OTHER SIDE.
          Four elevations to go with the side view above. They exist because a
          broker asking about a dock, a door opening or an overhead clearance
          is asking about a shape, and one profile does not answer that.

          THEY ARE ON A LIGHT GROUND, and that is not a style choice. They are
          studio renders with a soft floor shadow under each vehicle, made for
          a white backdrop. Cutting that shadow out to place them on the dark
          band above speckles the base of every one of them, so instead each
          is flattened onto this section's own colour and the shadow reads as
          a shadow. Do not move them onto a dark ground without re-rendering.

          They are computer generated, which the legal notices page says in as
          many words. They show the configuration KUL runs, not a photograph
          of the truck in the yard, and the photography document asks Mark for
          the real thing. */}
      <section className="bg-k-surface px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-[1248px]">
          {/* THE HEADING AND THE CAVEAT ARE BOTH GONE, at the client's word,
              and the row says what it is without them. Four views of the same
              rig on one baseline, each captioned with the side it is, is not a
              thing anybody needs a label above. The nominal-dimensions caveat
              still exists where the numbers are actually printed, on Size it
              up on every service page; it was never needed here, because no
              measurement appears on this row at all. */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4">
            {ELEVATIONS.map((view, i) => (
              <Reveal
                key={view.file}
                index={i}
                className="flex flex-col items-center gap-4"
              >
                <div className="flex h-[150px] w-full items-center justify-center">
                  {/* ================================================== */}
                  {/* THE WHITE BOX BEHIND EACH RENDER IS GONE, AND IT IS */}
                  {/* NOT CUT OUT. IT IS MULTIPLIED OUT.                  */}
                  {/* ================================================== */}
                  {/*
                      These four files have no alpha channel: they are renders
                      standing on white, and against this section's #fcfcfc
                      they each drew a faint white rectangle you could see the
                      corners of.

                      CUTTING THEM WAS TRIED FIRST AND CANNOT WORK. Measured
                      pixel by pixel: the trailer roof on the top view sits 13
                      away from white, and the soft drop shadow beside the
                      wheels sits 20 away. The background is darker than the
                      subject, so there is no threshold anywhere that separates
                      them, and a border flood fill run at any tolerance either
                      leaves the shadow behind or eats its way through the
                      panel seams and hollows out the roof. It did exactly that
                      on the first attempt.

                      Multiply has no such problem, because it does not have to
                      decide what is background. Every channel is multiplied by
                      the ground: white is 255 and leaves the ground exactly as
                      it was, so the box disappears completely, while the
                      shadow stays a shadow and darkens the ground the way a
                      shadow should. Nothing is thrown away and no edge is cut,
                      which is also why the wheels keep their contact shadows.

                      IT ONLY WORKS ON A LIGHT GROUND. Multiplying onto a dark
                      one turns the whole render black. If this row is ever
                      moved onto a dark panel, the files have to be re-rendered
                      on transparency instead; there is no CSS that saves it.
                  */}
                  <Image
                    src={`/images/truck/${view.file}-plate.webp`}
                    alt={view.alt}
                    width={1100}
                    height={836}
                    className="h-auto max-h-[150px] w-auto max-w-full"
                    style={{ mixBlendMode: "multiply" }}
                  />
                </div>
                <span className="font-text text-k-micro uppercase text-k-ink-soft">
                  {view.label}
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Services, seven hairline rows. Deliberately not a card grid. */}
      <section className="bg-k-paper px-6 py-32 md:px-12 lg:px-24">
        <div className="mx-auto max-w-[1248px]">
          <Reveal variant="settle" className="flex flex-col gap-12 pb-14 lg:flex-row lg:items-end lg:justify-between lg:gap-24">
            <div className="flex flex-1 flex-col gap-5">
              <p className="flex items-center gap-4">
                <span className="h-px w-12 shrink-0 bg-k-gold" aria-hidden="true" />
                <span className="font-text text-k-label uppercase text-k-gold">
                  What we haul
                </span>
              </p>
              <h2 className="font-display text-k-d1 font-black text-k-ink">
                Seven ways to move it.
              </h2>
            </div>
            {/* This opened "Every service below is one truck and one driver
                today". The promise in the second half is the part worth
                keeping and it stands without the headcount in front of it. */}
            <p className="font-text text-k-body text-k-ink-soft lg:w-[380px] lg:shrink-0">
              If a lane needs more capacity than we can commit to, we will tell
              you before you book rather than after.
            </p>
          </Reveal>

          <ul className="border-t border-k-rule-strong">
            {services.map((service, i) => (
              <li key={service.slug}>
                <Link
                  href={`/services/${service.slug}`}
                  className="flex flex-col gap-3 border-b border-k-rule py-7 transition-colors duration-200 hover:bg-k-surface md:flex-row md:items-center md:gap-8"
                >
                  <span className="w-9 shrink-0 font-text text-k-micro uppercase tabular-nums text-k-gold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-k-d3 font-black text-k-ink md:w-[300px] md:shrink-0">
                    {service.name}
                  </span>
                  <span className="flex-1 font-text text-k-body text-k-ink-soft">
                    {service.short}
                  </span>
                  <span className="shrink-0 font-text text-k-micro uppercase text-k-ink-faint md:w-[150px] md:text-right">
                    {EQUIPMENT[service.slug]}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* The Road Ahead, the vision, made credible rather than boastful. */}
      <section className="relative flex min-h-[620px] items-center justify-center overflow-hidden bg-k-void px-6 py-28">
        <Image
          src="/images/journey/s12c-night-highway.webp"
          alt=""
          fill
          className="object-cover opacity-60"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.25)_45%,rgba(0,0,0,0.8)_100%)]"
          aria-hidden="true"
        />
        <Reveal variant="settle" className="relative flex flex-col items-center gap-7 text-center">
          <p className="flex items-center gap-4">
            <span className="h-px w-12 shrink-0 bg-k-gold-lit" aria-hidden="true" />
            <span className="font-text text-k-label uppercase text-k-gold-lit">
              The road ahead
            </span>
          </p>
          {/* The headline carries a fact off the page it links to rather than
              a slogan. It used to be "The second truck comes before the second
              driver", which is true, is the order of the plan, and put the
              fleet count in display type on the home page. What is left is the
              principle underneath it, which is the part that would still be
              true at fifty trucks. */}
          <h2 className="max-w-[1040px] font-display text-k-d1 font-black text-k-on-dark">
            We grow the fleet before we sell the capacity.
          </h2>
          {/* "One truck on the road today, fifty by 2029" opened this
              paragraph until 29 Jul 2026, which made it the third time that
              same sentence appeared on this page: once in the hero, once in
              the equipment figures, and again here. It is the hero's line.
              What is left is the part only this section says. */}
          <p className="max-w-[620px] font-text text-k-lede text-k-on-dark-soft">
            Written in the order it has to happen, with a date against
            nothing until it is booked.
          </p>
          <Link
            href="/road-ahead"
            className="mt-2 rounded-full border border-k-on-dark-faint px-8 py-4 font-text text-k-label uppercase text-k-on-dark transition-colors duration-200 hover:border-k-on-dark"
          >
            See the plan
          </Link>
        </Reveal>
      </section>

      {/* THE QUESTIONS.
          Mark's plan put an FAQ here, between the plan and the story, and the
          eight answers have been sitting written in content/faq.json since the
          early build with nothing importing them. This renders them, and emits
          the FAQPage data he specced alongside.

          It sits at this point in the page on purpose. Everything above it is
          KUL talking; this is the first thing on the page that answers a
          question the reader actually arrived with, and it is the last thing
          before the page stops selling and offers the story instead.

          The section and the structured data read the same file, so an answer
          cannot say one thing here and another in a search result. */}
      <section className="bg-k-surface px-6 py-32 md:px-12 lg:px-24">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()) }}
        />
        <div className="mx-auto flex max-w-[1248px] flex-col gap-12 lg:flex-row lg:gap-24">
          <Reveal variant="wipe" className="lg:w-[380px] lg:shrink-0">
            <h2 className="font-display text-k-d2 font-black text-k-ink">
              Questions we get asked.
            </h2>
            <p className="max-w-[34ch] pt-6 font-text text-k-body text-k-ink-soft">
              If yours is not here, call dispatch on{" "}
              <a
                href={site.phoneHref}
                className="tabular-nums text-k-ink underline underline-offset-4"
              >
                {site.phone}
              </a>
              .
            </p>
          </Reveal>
          <Reveal index={1} className="flex-1">
            <Faq />
          </Reveal>
        </div>
      </section>

      {/* The Journey, an invitation, not a nav item. */}
      <section className="bg-k-warm px-6 py-28 md:px-12 lg:px-24">
        <Reveal className="mx-auto flex max-w-[1248px] flex-col items-center gap-12 lg:flex-row lg:gap-24">
          <Image
            src="/images/journey/s02-jamaica-childhood.webp"
            alt="Mark Brown and his sister in Jamaica, early 1980s"
            width={1291}
            height={1920}
            className="h-auto w-[280px] shrink-0 object-cover lg:w-[380px]"
          />
          <div className="flex flex-1 flex-col gap-6">
            <p className="flex items-center gap-4">
              <span className="h-px w-12 shrink-0 bg-k-gold" aria-hidden="true" />
              {/* This used to advertise seventeen scenes and a twelve minute
                  running time. Neither exists yet, so it now says what the
                  Journey page actually holds today. */}
              <span className="font-text text-k-label uppercase text-k-gold">
                Six chapters · the story so far
              </span>
            </p>
            <h2 className="font-display text-k-d2 font-black text-k-ink">
              Before the first truck, there was a boy on a plane.
            </h2>
            <p className="max-w-[560px] font-text text-k-body text-k-ink-soft">
              Jamaica. Construction sites every school holiday. The Air Force.
              Eleven years driving for other people. The Journey is the long
              version, in Mark&rsquo;s own words.
            </p>
            {/* A second paragraph sat here saying "You do not need to read it
                to book a load. It is here for the people who want to know who
                is driving." It went on 29 Jul 2026. Both halves say the same
                thing, once negatively and once positively, which is a shape
                that reads as writing rather than as information, and the
                paragraph above already ends by saying what the Journey is. A
                section that has to reassure you it is optional is a section
                that does not trust its own first line. */}
            <Link
              href="/journey"
              className="w-fit border-b border-k-gold pb-1 font-text text-k-label uppercase text-k-ink"
            >
              Begin the journey
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
