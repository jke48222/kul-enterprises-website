"use client";

import Image from "next/image";
import Link from "next/link";
import { useTina, tinaField } from "tinacms/dist/react";
import { services } from "@/lib/services";
import { site } from "@/lib/site";
import HeroVideo from "@/components/k/HeroVideo";
import Reveal from "@/components/k/Reveal";
import ShapeGrid from "@/components/k/ShapeGrid";
import Faq from "@/components/k/Faq";
import Copy from "@/components/k/Copy";
import { faqJsonLd } from "@/lib/faq";
import { fill, link } from "@/lib/content";
import type { TinaPage } from "@/lib/tina";

/**
 * The shape of the content, taken from the file itself.
 *
 * Tina's generated types mark every field optional, because every field in the
 * CMS can be emptied, which would mean writing `?.` and `??` several hundred
 * times through markup that is otherwise readable. The JSON on disk is the
 * canonical shape and the schema in tina/config.ts mirrors it exactly, so the
 * live data is read against that instead.
 *
 * `typeof import(...)` is a type-only construct: it is erased at compile time
 * and puts nothing in the browser bundle.
 *
 * The cast is a statement about shape, not about emptiness. Fields really can
 * come back empty, so fill() and link() in lib/content.ts tolerate null and
 * every list below is guarded before it is mapped.
 */
type HomeContent = typeof import("@/content/pages/home.json");

/**
 * HOME, THE HALF THAT DRAWS.
 *
 * app/page.tsx fetches on the server and hands the result down. This half
 * subscribes to it with useTina, which is what makes the visual editor work:
 * inside /admin the page redraws as the client types in the sidebar, and every
 * element carrying a data-tina-field can be clicked to jump to its field.
 *
 * Outside the editor useTina simply returns what it was given, so on the live
 * site this renders once and costs nothing.
 *
 * WHY THE MARKUP LIVES HERE RATHER THAN IN page.tsx. useTina is a hook, so the
 * subscribing component has to be a client component, and the layout has to be
 * inside it or the parts that move would not move. The server half keeps the
 * things that must stay on the server: the metadata and the structured data.
 *
 * THE data-tina-field ATTRIBUTES ARE THE CLICK TARGETS. tinaField(object,
 * "fieldName") returns the path the editor uses to find that field. They are
 * inert on the live site, where nothing reads them.
 */
/**
 * The props are typed against the JSON rather than against Tina's generated
 * types on purpose. tina/__generated__ is not committed, so importing a type
 * from it makes `next build` depend on the Tina build having run first, and
 * the whole point of lib/tina.ts is that the site builds whether Tina is
 * reachable or not.
 */
export default function HomeView(props: TinaPage<{ homePage: unknown }>) {
  // Outside the editor this hands straight back what the server fetched.
  const { data } = useTina({
    query: props.query ?? "",
    variables: props.variables ?? {},
    data: props.data,
  });
  const home = data.homePage as unknown as HomeContent;

  /**
   * The tag closing each service row, looked up by slug.
   *
   * It is a list in the CMS so the client sees seven labelled rows, and is
   * turned back into a lookup here. A service with no tag closes its row with
   * nothing, which is why this reads with a fallback rather than asserting.
   */
  const TAGS: Record<string, string> = Object.fromEntries(
    (home.services?.tags ?? []).map((t) => [t.slug, t.tag]),
  );

  return (
    <>
      {/* Hero, the broker's one screen. */}
      {/* THE HEIGHT IS A VIEWPORT ON PHONES AND A FIXED BLOCK EVERYWHERE ELSE.
          820px was measured against a laptop and is taller than an entire small
          phone: on a 320x568 viewport the hero ran 820px, so the quote button
          and the authority numbers both sat below the fold and the opening
          screen of the site ended before its call to action. `svh` rather than
          `dvh` deliberately, matching what the journey page already uses: it is
          the height with the browser chrome shown, so it is the smallest the
          viewport ever gets and the content is laid out to fit the worst case
          instead of reflowing when the chrome slides away. */}
      <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-k-void md:min-h-[820px]">
        <HeroVideo
          poster={home.hero.poster}
          label="the hero film"
          controlSlotId="hero-film-control"
          /* THE CROP IS MOVED OFF CENTRE ON PHONES, AND THE REASON IS THE
             WORDMARK. The film is 16:9 and the fold is portrait, so `cover`
             keeps the full height and shows about 494 source pixels of width.
             Centred, that window lands on source x 713 to 1207, which cuts the
             trailer's own KUL ENTERPRISES lettering clean down the middle and
             put a half wordmark reading "K... ENTER..." directly behind the
             headline. 38% moves the window to roughly 542 to 1036: the road
             curve, the tractor, and the head of the lion, with the lettering
             cropped out entirely. That is the same argument the scrim below
             makes, solved by framing instead of by darkness, and it is the
             reason not to simply pan further right onto the full wordmark. */
          className="absolute inset-0 h-full w-full object-cover object-[38%_50%] opacity-85 md:object-center"
        />
        {/* Directional scrim. Without it the headline collides with the
            trailer's own KUL livery and two wordmarks fight each other.

            IT TURNS THROUGH NINETY DEGREES ON PHONES. The 90deg ramp protects a
            headline sitting in the left third of a wide frame, which is where
            it sits on a laptop. On a phone the headline is the full width of
            the column, so a left-to-right ramp leaves its right-hand end over
            open picture: measured at 375px with the pre-walkthrough headline,
            the last third of its second line sat on scrim of 0.28 while the
            first third had 0.92. Vertical puts
            the dark where the type actually is at this width, and keeps the top
            of the frame clear so the truck still reads. */}
        <div
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.34)_0%,rgba(0,0,0,0.30)_30%,rgba(0,0,0,0.76)_64%,rgba(0,0,0,0.92)_100%)] md:bg-[linear-gradient(90deg,rgba(0,0,0,0.92)_0%,rgba(0,0,0,0.78)_34%,rgba(0,0,0,0.28)_62%,rgba(0,0,0,0.45)_100%)]"
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-64 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.75)_100%)]"
          aria-hidden="true"
        />

        {/* The 160px of head room is a laptop measurement too. On a phone it is
            most of the gap between the nav and the headline, and it is what
            pushed the buttons off the bottom of a small screen once the hero
            was allowed to be exactly one viewport tall. */}
        <div className="relative mx-auto w-full max-w-[1440px] px-6 pb-16 pt-28 md:px-12 md:pt-40 lg:px-24">
          <div className="flex max-w-[1120px] flex-col gap-8">
            {/* MEASURE LINE TWO BEFORE CHANGING IT. The break is hard, so the
                second line has to fit its own line at 375px or the hero
                becomes three lines on a phone. At the 36px floor the column is
                327px wide: "On schedule." measures 241px and "Every mile."
                204px, both measured in-browser after the first-walkthrough
                rewording. The old "Owner driven." was 236px, and "Driven
                personally." at 331px already wrapped, which is how tight this
                line runs. */}
            {/* One line per entry in the CMS, with a hard break between them.
                Adding a third line is allowed and will simply stack; read the
                measurement note above before doing it on a headline this
                size. */}
            <h1
              data-tina-field={tinaField(home.hero, "headlineLines")}
              className="font-display text-k-d1 font-black text-k-on-dark"
            >
              {(home.hero.headlineLines ?? []).map((lineText, i) => (
                <span key={lineText}>
                  {i > 0 ? <br /> : null}
                  {fill(lineText)}
                </span>
              ))}
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
            <p
              data-tina-field={tinaField(home.hero, "lede")}
              className="max-w-[620px] font-text text-k-lede text-k-on-dark-soft"
            >
              {fill(home.hero.lede)}
            </p>

            {/* Two buttons, both editable, both able to point anywhere. The
                second one's target is stored as {phone}, which lib/content
                turns into a click-to-call link, so the client can change the
                wording without knowing what tel: means. */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href={link(home.hero.primaryCta).href}
                className="rounded-full bg-k-on-dark px-8 py-4 font-text text-k-label uppercase text-k-ink transition-opacity duration-200 hover:opacity-85"
              >
                {link(home.hero.primaryCta).label}
              </Link>
              <a
                href={link(home.hero.secondaryCta).href}
                className="rounded-full border border-k-on-dark-faint px-8 py-4 font-text text-k-label uppercase text-k-on-dark transition-colors duration-200 hover:border-k-on-dark"
              >
                {link(home.hero.secondaryCta).label}
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
            is still on the page or one click away. "Licensed & insured" is
            said properly on the safety page rather than asserted in six words
            on a hero, the owner-answers line left the site altogether at the
            first walkthrough (project-docs/32), and the service area is in
            the footer of every page.

            The numbers stay together on one line at every width, which is why
            they are one span with a separator rather than two items in a wrap
            container: a DOT number broken across two lines is a DOT number
            somebody mistypes. */}
        <div className="relative border-t border-white/15">
          <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-10 gap-y-2 px-6 py-5 md:px-12 lg:px-24">
            <span className="whitespace-nowrap font-text text-k-micro uppercase tabular-nums text-k-on-dark-soft">
              {fill(home.hero.credentials)}
            </span>

            <span className="flex items-center gap-4 md:ml-auto">
              <span
                className="hidden h-px w-12 shrink-0 bg-k-gold-lit md:block"
                aria-hidden="true"
              />
              <span className="font-text text-k-micro uppercase text-k-gold-lit">
                {fill(home.hero.locationLine)}
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
            <h2
              data-tina-field={tinaField(home.statement, "heading")}
              className="font-display text-k-d2 font-black text-k-ink"
            >
              {fill(home.statement.heading)}
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
            <Copy
              text={home.statement.body}
              className="font-text text-k-body text-k-ink-soft"
              linkClassName="text-k-ink underline underline-offset-4"
            />
            <Link
              href={link(home.statement.cta).href}
              className="w-fit border-b border-k-gold pb-1 font-text text-k-label uppercase text-k-ink"
            >
              {link(home.statement.cta).label}
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
              {fill(home.equipment.eyebrow)}
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
            src={home.equipment.image}
            alt={fill(home.equipment.imageAlt)}
            width={1975}
            height={577}
            className="h-auto w-full max-w-[1248px]"
          />
        </Reveal>

        {/* Four figures, or however many the CMS holds. The row is a two-up
            on a phone and a four-up from large up, so a fifth figure would
            leave a gap on the wide arrangement and a sixth would fill it.
            Keep it at four unless you are prepared to look at both. */}
        <div className="mt-16 grid grid-cols-2 border-t border-k-rule-dark lg:grid-cols-4">
          {(home.equipment.specs ?? []).map((spec, i) => (
            <div
              key={spec.label}
              className={[
                "flex flex-col gap-2 px-6 py-8 md:px-10",
                i < (home.equipment.specs ?? []).length - 1
                  ? "lg:border-r lg:border-k-rule-dark"
                  : "",
              ].join(" ")}
            >
              <p
                className={`font-display text-k-d3 font-black tabular-nums ${
                  spec.accent ? "text-k-gold-lit" : "text-k-on-dark"
                }`}
              >
                {fill(spec.value)}
                {spec.unit ? (
                  <span className="font-text text-k-body font-normal tracking-normal text-k-on-dark-soft">
                    {spec.unit}
                  </span>
                ) : null}
              </p>
              <p className="font-text text-k-micro uppercase text-k-on-dark-faint">
                {fill(spec.label)}
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
          {/* THE SIDE VIEW IS NOT IN THIS LIST. It is the large render in the
              section above, so adding it here would show the same drawing
              twice on one screen. The four in the CMS are the four the side
              view does not already answer. */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4">
            {(home.equipment.elevations ?? []).map((view, i) => (
              <Reveal
                key={view.image}
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
                    src={view.image}
                    alt={fill(view.alt)}
                    width={1100}
                    height={836}
                    className="h-auto max-h-[150px] w-auto max-w-full"
                    style={{ mixBlendMode: "multiply" }}
                  />
                </div>
                <span className="font-text text-k-micro uppercase text-k-ink-soft">
                  {fill(view.label)}
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
                  {fill(home.services.eyebrow)}
                </span>
              </p>
              <h2
                data-tina-field={tinaField(home.services, "heading")}
                className="font-display text-k-d1 font-black text-k-ink"
              >
                {fill(home.services.heading)}
              </h2>
            </div>
            {/* This opened "Every service below is one truck and one driver
                today". The promise in the second half is the part worth
                keeping and it stands without the headcount in front of it. */}
            <Copy
              text={home.services.note}
              className="font-text text-k-body text-k-ink-soft lg:w-[380px] lg:shrink-0"
              linkClassName="text-k-ink underline underline-offset-4"
            />
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
                    {TAGS[service.slug] ?? ""}
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
          src={home.vision.image}
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
              {fill(home.vision.eyebrow)}
            </span>
          </p>
          {/* The headline carries a fact off the page it links to rather than
              a slogan. It used to be "The second truck comes before the second
              driver", which is true, is the order of the plan, and put the
              fleet count in display type on the home page. What is left is the
              principle underneath it, which is the part that would still be
              true at fifty trucks. */}
          <h2
            data-tina-field={tinaField(home.vision, "heading")}
            className="max-w-[1040px] font-display text-k-d1 font-black text-k-on-dark"
          >
            {fill(home.vision.heading)}
          </h2>
          {/* "One truck on the road today, fifty by 2029" opened this
              paragraph until 29 Jul 2026, which made it the third time that
              same sentence appeared on this page: once in the hero, once in
              the equipment figures, and again here. It is the hero's line.
              What is left is the part only this section says. */}
          <Copy
            text={home.vision.body}
            className="max-w-[620px] font-text text-k-lede text-k-on-dark-soft"
            linkClassName="text-k-on-dark underline underline-offset-4"
          />
          <Link
            href={link(home.vision.cta).href}
            className="mt-2 rounded-full border border-k-on-dark-faint px-8 py-4 font-text text-k-label uppercase text-k-on-dark transition-colors duration-200 hover:border-k-on-dark"
          >
            {link(home.vision.cta).label}
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
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqJsonLd()).replace(/</g, "\\u003c"),
          }}
        />
        <div className="mx-auto flex max-w-[1248px] flex-col gap-12 lg:flex-row lg:gap-24">
          <Reveal variant="wipe" className="lg:w-[380px] lg:shrink-0">
            <h2
              data-tina-field={tinaField(home.faq, "heading")}
              className="font-display text-k-d2 font-black text-k-ink"
            >
              {fill(home.faq.heading)}
            </h2>
            {/* The number inside this sentence links itself. Write the
                sentence however you like and put {phone} where the number
                should fall; see components/k/Copy.tsx. */}
            <Copy
              text={home.faq.intro}
              className="max-w-[34ch] pt-6 font-text text-k-body text-k-ink-soft"
              linkClassName="text-k-ink underline underline-offset-4"
            />
          </Reveal>
          <Reveal index={1} className="flex-1">
            <Faq />
          </Reveal>
        </div>
      </section>

      {/* THE CLOSE: THE LION, THE WORDS, AND JAMAICA.
          This slot held the Journey invitation, with the photograph of Mark
          and his sister and three lines about the story. It was replaced at
          the first walkthrough (project-docs/32): the Journey is
          self-contained now, the childhood photograph lives only inside it,
          and the home page closes on the brand instead. The lion is the door.
          It is the "journey icon" Mark described, so the whole figure links
          to /journey.

          The mark sits on a white plate rather than a transparent one (the
          supplied kit is opaque; see the brand-assets note in project-docs),
          so it is blended onto the warm ground with multiply, the same
          treatment the equipment elevations use above. Do not move this
          section onto a dark ground without replacing the asset: multiply on
          ink turns the plate black. */}
      <section className="bg-k-warm px-6 py-32 md:px-12 lg:px-24">
        <div className="mx-auto flex max-w-[1248px] flex-col items-center gap-12 text-center">
          <Reveal variant="settle" className="flex flex-col items-center gap-10">
            <Link href="/journey" className="group flex flex-col items-center gap-6">
              <Image
                src={home.closing.mark}
                alt={fill(home.closing.markAlt)}
                width={512}
                height={512}
                sizes="164px"
                className="h-auto w-[132px] md:w-[164px]"
                style={{ mixBlendMode: "multiply" }}
              />
              <span
                data-tina-field={tinaField(home.closing, "journeyLabel")}
                className="border-b border-k-gold pb-1 font-text text-k-label uppercase text-k-ink transition-colors duration-200 group-hover:text-k-gold"
              >
                {fill(home.closing.journeyLabel)}
              </span>
            </Link>

            {/* The slogan is read from Business Facts rather than retyped
                here, so the trademark line on the terms page, this close, and
                anywhere else it appears can never drift apart. */}
            <p className="font-display text-k-d2 font-black text-k-ink">
              {site.taglineLines.map((lineText) => (
                <span key={lineText} className="block">
                  {lineText}
                </span>
              ))}
            </p>
          </Reveal>

          <Reveal index={1} className="w-full">
            <div className="grid gap-4 md:grid-cols-2 md:gap-6">
              {(home.closing.photos ?? []).map((photo) => (
                <Image
                  key={photo.image}
                  src={photo.image}
                  alt={fill(photo.alt)}
                  width={1920}
                  height={1280}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="aspect-[3/2] w-full object-cover"
                />
              ))}
            </div>
            <p
              data-tina-field={tinaField(home.closing, "photosCaption")}
              className="pt-5 font-text text-k-micro uppercase text-k-ink-faint"
            >
              {fill(home.closing.photosCaption)}
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
