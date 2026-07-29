import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import PinnedStatement from "@/components/k/PinnedStatement";
import JourneyShelf from "@/components/k/JourneyShelf";
import JourneyScatter from "@/components/k/JourneyScatter";
import JourneySequence from "@/components/k/JourneySequence";
import HeroVideo from "@/components/k/HeroVideo";
import Reveal, { RuleDraw } from "@/components/k/Reveal";

/**
 * THE JOURNEY
 *
 * How the person driving the truck got here. It is the one page on the site
 * that is not selling anything, and it is deliberately reachable rather than
 * pushed at anybody.
 *
 * THE PAGE IS SIX CHAPTERS, NOT SEVENTEEN SCENES. Mark's screenplay in
 * briefs/the-journey-screenplay.md is written as seventeen scenes for a film
 * with music and narration. A web page that made a reader sit through
 * seventeen held screens would fail his own pacing test, which is that if
 * people want to click ahead the pacing is too slow. The seventeen scenes are
 * grouped into six chapters here, and every line of on-screen copy below is
 * still his, word for word. Copy is sacred on this project. Where a chapter
 * merges two of his scenes, it takes the lines that carry the point and leaves
 * the connective tissue to the film.
 *
 * WHAT IS DELIBERATELY REPEATED. Two shapes recur, which is otherwise against
 * the once-each rule in project-docs/21-archetype-inventory.md. Both are
 * recorded there as sanctioned sequence exceptions:
 *
 *   The held chapter beat, used by chapters 02, 03 and 04. Those three have no
 *   photograph and never will. Giving each a different layout to disguise that
 *   would make the absence look like a mistake being covered up. Giving them
 *   one shape makes it read as a decision.
 *
 *   The road frame, used eleven times inside chapter 05. Eleven photographs in
 *   eleven different treatments is a scrapbook. One treatment repeated is a
 *   sequence, and a sequence is the only thing that can carry a light arc.
 *
 * THE ORDER OF CHAPTER 05 IS THE ORDER OF THE LIGHT. Night, pre-dawn, mist,
 * sunrise, first daylight, full daylight, sun high. That is how the curation
 * in assets-inbox/journey-curated/README.md read the screenplay, and it is the
 * only structure eleven windscreen photographs have. Do not reorder them for
 * visual variety.
 *
 * NOTHING ON THIS PAGE IS INVENTED, AND NOTHING IS STAGED. Every photograph is
 * one Mark took. Three chapters have none because none was ever taken, and the
 * close says so rather than buying a stock frame or generating one. His own
 * note on the gap, kept in the curation README, is that where a picture does
 * not exist the words can carry it alone.
 *
 * ONE LINE OF HIS COPY IS NOT HERE. Scene 2 opens "I was born in Jamaica. On
 * August 8, 1988." The date is left out. A founder's full date of birth beside
 * his full legal name on a public page is a real identity risk, and the
 * chapter does not need it. If Mark wants it back it is his call, not ours.
 */

export const metadata: Metadata = {
  title: "The Journey",
  description: `How KUL Enterprises started. Jamaica, the Air Force, eleven years driving for other carriers, and the first truck of his own. The story behind the carrier in ${site.location}.`,
};

/**
 * The three chapters with no photograph.
 *
 * `ground` walks from the darkest to the least dark so the three do not read as
 * the same screen shown three times. It is the only thing that changes between
 * them, and it is small on purpose.
 */
const HELD_CHAPTERS = [
  {
    n: "02",
    title: "Construction sites, every school break",
    ground: "bg-k-void",
    lines: [
      "While most kids spent their summers playing, mine were spent on construction sites.",
      "Every school break. Every holiday. Every vacation. I worked alongside my father.",
      "At the time I didn't understand why. I only knew that it was expected.",
    ],
    held: "Work isn't something to avoid. It's something to take pride in.",
  },
  {
    n: "03",
    title: "Leaving home",
    ground: "bg-k-coal",
    lines: [
      "As I grew older I began to notice something. I wasn't satisfied with simply being told how things were.",
      "I wanted to understand why they worked the way they did.",
      "Leaving home wasn't just about finding a place to live. It was about finding out who I was.",
    ],
    held: "Independence isn't the freedom to avoid mistakes. It's accepting responsibility for them.",
  },
  {
    n: "04",
    title: "The Air Force",
    ground: "bg-k-blueprint",
    lines: [
      "Freedom brought a question. What kind of man did I want to become?",
      "I wanted structure. I wanted to be challenged. That's what led me to the United States Air Force.",
      "It demanded consistency. Accountability. Commitment.",
    ],
    held: "Discipline isn't about being controlled. It's about learning to control yourself.",
  },
] as const;

/**
 * Chapter 05, in the order the light runs.
 *
 * `time` is what the light is doing, not a clock reading, because the EXIF
 * timestamps on the older files are wrong. The curation judged these by eye and
 * said so. Printing a false 05:19 under a photograph on a page whose whole
 * argument is that nothing here is faked would be the one lie on it.
 *
 * TWO THINGS WERE FIXED HERE AFTER LOOKING AT THE SEQUENCE AS A CONTACT SHEET,
 * and neither was visible one frame at a time:
 *
 *   s13-first-daylight is named for the scene it serves, not for its light. It
 *   is a grey blue sky under cloud and it is plainly darker than the sunrise
 *   frames, so filed by name it sat sixth and made the arc go backwards. It is
 *   third now, in the blue hour where it belongs.
 *
 *   s10-endless-road was the tenth frame and s17-road-to-horizon is the
 *   eleventh. They are the same stretch of road from almost the same spot, so
 *   back to back they read as the page repeating itself. s08b-rockcut-bend has
 *   the tenth slot now. s10 stays in the repository as an alternate: it is a
 *   good photograph and Mark may prefer it, it just cannot sit next to s17.
 */
const ROAD = [
  {
    src: "/images/journey/s12c-night-highway.webp",
    alt: "An interstate at night, headlights and lane markings drawing forward",
    time: "Night",
    line: "I thought I was learning how to drive a truck.",
  },
  {
    src: "/images/journey/s12-predawn-peaks.webp",
    alt: "Mountain peaks in violet light before sunrise",
    time: "Before first light",
    line: "What I didn't realize was that the road was teaching me something far greater.",
  },
  {
    src: "/images/journey/s13-first-daylight.webp",
    alt: "A grey blue sky lifting over the interstate before sunrise",
    time: "The sky begins to lift",
    line: "Every mile introduced me to a new place.",
  },
  {
    src: "/images/journey/s04-dawn-road-mist.webp",
    alt: "A road running into low mist at dawn",
    time: "Dawn, in mist",
    line: "Every state introduced me to different people.",
  },
  {
    src: "/images/journey/s11-sunrise-band.webp",
    alt: "A band of sunrise colour along the horizon above the highway",
    time: "Sunrise",
    line: "Every delivery reminded me that trust travels farther than freight.",
  },
  {
    src: "/images/journey/s05-sunrise-horizon.webp",
    alt: "The sun breaking the horizon at the end of a straight road",
    time: "The sun clears the horizon",
    line: "I had a plan. But plans have a way of changing.",
  },
  {
    src: "/images/journey/s08-desert-bend.webp",
    alt: "A desert highway bending out of sight",
    time: "Mid morning",
    line: "There were victories. There were setbacks. Both became teachers.",
  },
  {
    src: "/images/journey/s09-interstate-traffic.webp",
    alt: "Traffic across several lanes of interstate in daylight",
    time: "Late morning",
    line: "I wasn't chasing titles. I was learning to become dependable.",
  },
  {
    src: "/images/journey/s06-wide-horizon.webp",
    alt: "A wide horizon opening out on both sides of the road",
    time: "Midday",
    line: "Freight moved every day. But what truly kept the industry moving wasn't trucks. It was people.",
  },
  {
    src: "/images/journey/s08b-rockcut-bend.webp",
    alt: "A highway curving through a rock cut under a bright sky",
    time: "Afternoon",
    line: "Every load represented someone's trust. Every mile represented someone's promise.",
  },
  {
    src: "/images/journey/s17-road-to-horizon.webp",
    alt: "The road running on with the sun high and no destination visible",
    time: "Sun high",
    line: "The farther I traveled, the more I realized every person has a story.",
  },
] as const;

/**
 * The photographs the sequence has no room for.
 *
 * These are the rest of the twenty-six the curation kept, plus a few of the
 * eleven so the columns are evenly stocked. They stream past as thumbnails and
 * are never the subject, so a frame that is not strong enough to hold a screen
 * on its own is still worth its place here. Alt text is empty on purpose: this
 * is one decorative field, described once by the sentence held over it, not
 * eighteen separate things for a screen reader to be read out.
 */
const SCATTER = [
  { src: "/images/journey/hero-open-road-blue.webp", alt: "" },
  { src: "/images/journey/s09b-elevated-traffic.webp", alt: "" },
  { src: "/images/journey/gal-alpine-lake.webp", alt: "" },
  { src: "/images/journey/s14-confident-highway.webp", alt: "" },
  { src: "/images/journey/hero-sage-plain.webp", alt: "" },
  { src: "/images/journey/s16-valley-from-height.webp", alt: "" },
  { src: "/images/journey/s10-endless-road.webp", alt: "" },
  { src: "/images/journey/gal-river-rocks.webp", alt: "" },
  { src: "/images/journey/s11b-sunrise-cloud.webp", alt: "" },
  { src: "/images/journey/hero-two-lane-centred.webp", alt: "" },
  { src: "/images/journey/s12b-predawn-peaks-alt.webp", alt: "" },
  { src: "/images/journey/s07-pines-road.webp", alt: "" },
  { src: "/images/journey/gal-waterfall-figure.webp", alt: "" },
  { src: "/images/journey/s02b-caribbean-water.webp", alt: "" },
  { src: "/images/journey/s08b-rockcut-bend.webp", alt: "" },
  { src: "/images/journey/s06-wide-horizon.webp", alt: "" },
  { src: "/images/journey/s04-dawn-road-mist.webp", alt: "" },
  { src: "/images/journey/s09-interstate-traffic.webp", alt: "" },
] as const;

export default function JourneyPage() {
  return (
    <>
      {/* THE OPENING IS A SHELF. Six chapters standing like records in a rack,
          taken from the shopify.com/editions hero the client sent through.
          Everything the page says in long form downstairs, it offers here in
          one screen: pick a chapter up, turn it over, read the lines on the
          back, or leave it and scroll.

          The Doctor Bird is not here and must not be added: it appears exactly
          once on the whole site, in the sequence a visitor sees on their first
          ever visit. */}
      <JourneyShelf />

      {/* One statement, held still while it is read. This is the only place on
          the site where the page waits for the reader rather than the other way
          round, and it is here because this is the only page that is not
          selling anything. It answers the question a broker who clicked through
          by accident is entitled to ask. */}
      <PinnedStatement text="None of this is a sales argument. It is here because a carrier is a person, and the person hauling your freight spent eleven years learning the job on somebody else's trucks before he bought his own." />

      {/* CHAPTER 01. The photograph first, because it is the oldest thing the
          company owns and the reason the rest of the page exists. It is a boy
          and a girl, and the line it lands on is about a boy and a girl, which
          is why it is not merely an illustration of this chapter. */}
      <section id="chapter-01" className="scroll-mt-24 bg-k-warm px-6 py-24 md:px-12 lg:px-24 lg:py-32">
        <div className="mx-auto flex max-w-[1248px] flex-col gap-14 lg:flex-row lg:items-end lg:gap-24">
          <Reveal className="lg:shrink-0">
            <Image
              src="/images/journey/s02-jamaica-childhood.webp"
              alt="Mark Brown and his sister in Jamaica, early 1980s"
              width={1291}
              height={1920}
              // Not priority. It is three screens down, and the page's largest
              // contentful paint was measured as the opening paragraph at
              // 140ms, not a picture. Preloading this only takes bandwidth from
              // the font that paragraph needs.
              className="h-auto w-full max-w-[400px] object-cover lg:w-[400px]"
            />
          </Reveal>

          <div className="flex flex-col lg:pb-4">
            <span className="font-text text-k-micro uppercase tabular-nums text-k-gold">
              Chapter 01
            </span>
            <h2 className="pt-4 font-display text-k-d2 font-black text-k-ink">
              Jamaica
            </h2>
            <div className="flex max-w-[52ch] flex-col gap-5 pt-8">
              <p className="font-text text-k-lede text-k-ink-soft">
                I was born in Jamaica.
              </p>
              <p className="font-text text-k-lede text-k-ink-soft">
                My mother brought my sister and me to America. She told us we
                were spending the summer with our father.
              </p>
            </div>
            {/* The heaviest line in the whole story, given its own weight and
                nothing next to it. Mark marks it "long pause, stands alone". */}
            <RuleDraw className="mt-10 max-w-[400px]" />
            <p className="max-w-[24ch] pt-8 font-display text-k-d3 font-black text-k-ink">
              We never went back.
            </p>
          </div>
        </div>
      </section>

      {/* CHAPTERS 02 TO 04. One shape, three times. See the note at the top of
          this file: the repetition is the point, not an oversight. */}
      {HELD_CHAPTERS.map((chapter) => (
        <section
          key={chapter.n}
          id={`chapter-${chapter.n}`}
          className={`scroll-mt-24 flex min-h-[80svh] items-center px-6 py-28 md:px-12 lg:px-24 ${chapter.ground}`}
        >
          <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-10 lg:flex-row lg:gap-24">
            <Reveal variant="settle" className="lg:w-[240px] lg:shrink-0">
              <span className="font-text text-k-micro uppercase tabular-nums text-k-gold-lit">
                Chapter {chapter.n}
              </span>
              <h2 className="pt-4 font-display text-k-d3 font-black text-k-on-dark">
                {chapter.title}
              </h2>
            </Reveal>

            <div className="flex flex-1 flex-col">
              <div className="flex max-w-[54ch] flex-col gap-6">
                {chapter.lines.map((line, i) => (
                  <Reveal key={line} index={i}>
                    <p className="font-text text-k-lede text-k-on-dark-soft">
                      {line}
                    </p>
                  </Reveal>
                ))}
              </div>
              <RuleDraw
                tone="dark"
                index={chapter.lines.length}
                className="mt-12 max-w-[320px]"
              />
              <Reveal index={chapter.lines.length + 1}>
                <p className="max-w-[34ch] pt-8 font-display text-k-d3 font-black text-k-on-dark">
                  {chapter.held}
                </p>
              </Reveal>
            </div>
          </div>
        </section>
      ))}

      {/* CHAPTER 05, THE CENTREPIECE. Eleven photographs he took through a
          windscreen, running in the order the light runs.

          THIS IS THE ONE MOVING PICTURE ON THE PAGE, and it is here rather than
          at the top for a reason. The card says the photographs that follow were
          taken through a windscreen; behind the card is that windscreen,
          moving, at night, from Mark's own dashcam. Then the sequence opens on a
          still of a night highway. The road moves, and then it is remembered.
          Putting this at the top of the page instead would have been the
          obvious choice and the wrong one: it would be a video hero, which is
          every trucking site, and it would spend the effect before the chapter
          that needs it. */}
      <section id="chapter-05" className="scroll-mt-24 bg-k-void">
        {/* THE SHOT, THEN THE TITLE CARD. Type over the film was the first
            attempt and it had to go, on measurement rather than taste. The film
            has headlights and a lit trailer moving through it, and against those
            the gold chapter marker reads 2.44:1 at its worst. Nothing fixes
            that: a gold dark enough to survive a headlight fails against the
            night sky in the same frame, and a scrim heavy enough to crush the
            headlight leaves no film to look at.

            So the film gets its own band and keeps all of its light, and the
            card sits under it on plain black where the marker reads 9.04:1. It
            is also the better cut. Type over a moving windscreen is what every
            trucking site does; a shot that dissolves into a title card is what a
            film does. */}
        <div className="relative h-[54svh] overflow-hidden">
          <HeroVideo
            name="dash-night"
            poster="/videos/dash-night-poster.jpg"
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Dark at the very top so the floating nav has something to sit on,
              clear through the middle where the road is, then all the way to
              solid black at the foot so the band has no edge and the card below
              it begins on true black rather than on a seam. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.42)_0%,rgba(0,0,0,0.04)_26%,rgba(0,0,0,0.04)_58%,rgba(0,0,0,0.72)_84%,rgba(0,0,0,1)_100%)]"
          />
        </div>

        <div className="mx-auto w-full max-w-[1248px] px-6 pb-28 pt-16 md:px-12 lg:px-24">
          <span className="font-text text-k-micro uppercase tabular-nums text-k-gold-lit">
            Chapter 05
          </span>
          <Reveal className="pt-4">
            <h2 className="max-w-[16ch] font-display text-k-d1 font-black text-k-on-dark">
              Eleven years, other people&apos;s trucks
            </h2>
          </Reveal>
          <p className="max-w-[52ch] pt-7 font-text text-k-lede text-k-on-dark-soft">
            Every photograph from here on is one he took through a windscreen.
            They run in the order the light does, because that is the order he
            saw them in.
          </p>
        </div>
      </section>

      {/* THE CONTACT SHEET, STREAMING, AND THE WINDSCREEN IT RESOLVES ONTO.
          Everything the curation kept but the sequence has no room for, going
          past in columns while one sentence holds still, and then the field
          clears onto Mark's daylight dashcam. Stills, then the thing that took
          them, then the eleven in the order the light runs. */}
      <JourneyScatter
        tiles={SCATTER}
        eyebrow="Twenty-six kept, eleven shown"
        statement="He did not photograph the road once. He photographed it for eleven years, and these are the ones that survived the cut."
      />

      {/* One line of plain fact between the film and the sequence, so the
          eleven do not begin over the top of the video's last frame. */}
      <section className="bg-k-void px-6 py-20 md:px-12 lg:px-24">
        <p className="mx-auto max-w-[52ch] text-center font-text text-k-body text-k-on-dark-soft">
          What follows are eleven of them, in the order the light runs.
        </p>
      </section>

      <JourneySequence frames={ROAD} />

      {/* CHAPTER 06. The light has arrived, so the ground does too. This is the
          only chapter set on paper, and it is the last one. */}
      <section id="chapter-06" className="scroll-mt-24 bg-k-paper px-6 py-28 md:px-12 lg:px-24 lg:py-36">
        <div className="mx-auto max-w-[1248px]">
          <div className="flex flex-col gap-10 lg:flex-row lg:gap-24">
            <Reveal variant="settle" className="lg:w-[240px] lg:shrink-0">
              <span className="font-text text-k-micro uppercase tabular-nums text-k-gold">
                Chapter 06
              </span>
              <h2 className="pt-4 font-display text-k-d3 font-black text-k-ink">
                One truck of his own
              </h2>
            </Reveal>

            <div className="flex max-w-[54ch] flex-1 flex-col gap-6">
              <Reveal>
                <p className="font-text text-k-lede text-k-ink-soft">
                  Every company begins with paperwork. But that&apos;s not where
                  KUL began. KUL began with a promise.
                </p>
              </Reveal>
              <Reveal index={1}>
                <p className="font-text text-k-lede text-k-ink-soft">
                  We didn&apos;t build this company to be the biggest. We built
                  it to be trusted.
                </p>
              </Reveal>
              <Reveal index={2}>
                <p className="font-text text-k-body text-k-ink-faint">
                  KUL Enterprises LLC, from 2026. One tractor, one driver, and a
                  phone number that reaches the person driving it.
                </p>
              </Reveal>
            </div>
          </div>

          {/* Two frames, offset. The lower one sits inset from the right so the
              pair reads as two moments rather than a two column grid.

              NEITHER OF THESE IS IN CHAPTER 05, AND THAT WAS NOT FREE. The
              obvious pick here was s14-confident-highway, which is the frame
              Mark's own scene 14 asks for. It is the same stretch of road as
              s17, the last frame of the arc, and putting it two screens later
              made the page look like it had run out of photographs. These two
              are the only ones in the set with a different geography: a road
              closed in by trees, and a valley seen from above. */}
          {/* BOTH FILES ARE 1920 BY 1440, WHICH IS FOUR TO THREE. Declaring
              them as sixteen to nine, which is what a road photograph looks
              like it ought to be, reserves the wrong amount of space and the
              page jumps when they load. The aspect classes below crop them
              instead, to two different shapes so the pair does not read as a
              grid. */}
          <div className="flex flex-col gap-6 pt-20 md:gap-10">
            <Reveal>
              <Image
                src="/images/journey/s07-pines-road.webp"
                alt="A two lane road running on through dense pine forest"
                width={1920}
                height={1440}
                sizes="(min-width: 1280px) 1248px, 100vw"
                className="aspect-[2/1] w-full object-cover"
              />
            </Reveal>
            <Reveal index={1} className="lg:w-[62%] lg:self-end">
              <Image
                src="/images/journey/s16-valley-from-height.webp"
                alt="A road seen from height, running down through a valley"
                width={1920}
                height={1440}
                sizes="(min-width: 1280px) 774px, 100vw"
                className="aspect-[4/3] w-full object-cover"
              />
              <p className="pt-4 font-text text-k-small text-k-ink-faint">
                The last two are his as well. There is no photograph of the KUL
                tractor here yet, because it has not been photographed properly
                yet.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* THE CLOSE. The gaps are stated once, here, plainly. They were annotated
          chapter by chapter in an earlier draft and that read as an apology
          repeated three times. */}
      <section className="bg-k-surface px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto flex max-w-[1248px] flex-col gap-12 lg:flex-row lg:gap-24">
          <Reveal variant="settle" className="lg:w-[240px] lg:shrink-0">
            <h2 className="font-display text-k-d3 font-black text-k-ink">
              About the photographs
            </h2>
          </Reveal>
          <div className="flex max-w-[62ch] flex-1 flex-col gap-6">
            <p className="font-text text-k-body text-k-ink-soft">
              Three of the six chapters have no photograph, because none was
              ever taken. Nothing has been staged, bought or generated to fill
              those gaps, and the words carry them instead. Every image on this
              page is one Mark took himself.
            </p>
            <p className="font-text text-k-body text-k-ink-soft">
              The words are his too. They come from the story he wrote out for
              this page, kept as he wrote it.
            </p>
            <div className="flex flex-wrap gap-8 pt-2">
              <Link
                href="/about"
                className="w-fit border-b border-k-gold pb-0.5 font-text text-k-small text-k-ink"
              >
                More about the company
              </Link>
              <Link
                href="/quote"
                className="w-fit border-b border-k-gold pb-0.5 font-text text-k-small text-k-ink"
              >
                Get a rate
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
