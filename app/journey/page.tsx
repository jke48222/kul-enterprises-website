import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import PinnedStatement from "@/components/k/PinnedStatement";
import Reveal, { RuleDraw } from "@/components/k/Reveal";

/**
 * THE JOURNEY
 *
 * How the person driving the truck got here. It is the one page on the site
 * that is not selling anything, and it is deliberately reachable rather than
 * pushed at anybody.
 *
 * WHAT IS HERE AND WHAT IS NOT. The chapters below are the true outline, told
 * in plain prose. The long form version, scene by scene with the photographs,
 * is still being put together. Rather than promise it here, the page says so
 * at the bottom, and the home page has been changed to stop advertising a
 * running time that does not exist yet.
 *
 * NOTHING ON THIS PAGE IS INVENTED. Every line is something the family has
 * confirmed. If a detail is not known, it is left out rather than filled in.
 *
 * TO EXTEND IT: add chapters to CHAPTERS below. When the photographs are
 * ready, each chapter takes one, and this becomes the scene by scene version.
 */

export const metadata: Metadata = {
  title: "The Journey",
  description: `How KUL Enterprises started. Jamaica, the Air Force, eleven years driving for other carriers, and the first truck of his own. The story behind the carrier in ${site.location}.`,
};

/** The outline, in order. Only what is known. */
const CHAPTERS = [
  {
    n: "01",
    title: "Jamaica",
    body: "Where it starts. A childhood spent outdoors, and the photograph at the top of this page, which is the oldest picture in the company's possession.",
  },
  {
    n: "02",
    title: "Construction sites, every school holiday",
    body: "Not a summer job so much as an education. Work that is finished when it is finished, done properly because somebody will stand on it afterwards.",
  },
  {
    n: "03",
    title: "The plane",
    body: "Leaving one country for another, which is the part of the story that gives the site its name and the lion its meaning.",
  },
  {
    n: "04",
    title: "The Air Force",
    body: "Service, and the habit of checking equipment before it is trusted rather than after. The maintenance policy on the safety page comes directly from here.",
  },
  {
    n: "05",
    title: "Eleven years, other people's trucks",
    body: "Learning the lanes, the docks and the receivers while somebody else carried the risk. Eleven years is long enough to know which carriers are worth working for and why.",
  },
  {
    n: "06",
    title: "One truck of his own",
    body: "KUL Enterprises, from 2026. One tractor, one driver, and a phone number that reaches the person driving it.",
  },
] as const;

export default function JourneyPage() {
  return (
    <>
      {/* Photograph first. It is the oldest thing the company owns and the
          reason the rest of the page exists. */}
      <section className="bg-k-warm px-6 pb-24 pt-36 md:px-12 lg:px-24">
        <div className="mx-auto flex max-w-[1248px] flex-col gap-14 lg:flex-row lg:items-end lg:gap-24">
          <Reveal className="lg:shrink-0">
            <Image
              src="/images/journey/s02-jamaica-childhood.webp"
              alt="Mark Brown and his sister in Jamaica, early 1980s"
              width={1291}
              height={1920}
              priority
              className="h-auto w-full max-w-[360px] object-cover lg:w-[360px]"
            />
          </Reveal>

          <div className="flex flex-col gap-7 lg:pb-4">
            <p className="flex items-center gap-2.5">
              <span className="font-text text-k-micro uppercase text-k-ink-faint">
                KUL
              </span>
              <span className="font-text text-k-micro text-k-ink-faint">/</span>
              <span className="font-text text-k-micro uppercase text-k-gold">
                The Journey
              </span>
            </p>
            <Reveal variant="wipe">
              <h1 className="max-w-[760px] font-display text-k-d1 font-black text-k-ink">
                Before the first truck, there was a boy on a plane.
              </h1>
            </Reveal>
            <p className="max-w-[560px] font-text text-k-lede text-k-ink-soft">
              You do not need to read this to book a load. It is here for the
              people who want to know who is driving.
            </p>
          </div>
        </div>
      </section>

      {/* One statement, held still while it is read.
          This is the only place on the site where the page waits for the
          reader rather than the other way round, and it is here because this
          is the only page that is not selling anything. It says why the story
          is on the site at all, which is the question a broker who clicked
          through by accident is entitled to ask. */}
      <PinnedStatement text="None of this is a sales argument. It is here because a carrier is a person, and the person hauling your freight spent eleven years learning the job on somebody else's trucks before he bought his own." />

      {/* The outline. Each chapter is one thing that is known to be true. */}
      <section className="bg-k-paper px-6 py-28 md:px-12 lg:px-24">
        <div className="mx-auto flex max-w-[1248px] flex-col gap-12 lg:flex-row lg:gap-24">
          <Reveal variant="settle" className="lg:w-[300px] lg:shrink-0">
            <h2 className="font-display text-k-d3 font-black text-k-ink">
              Six chapters
            </h2>
            <p className="pt-4 font-text text-k-small text-k-ink-soft">
              Told in order, without embellishment. Where a detail is not
              known, it is left out rather than filled in.
            </p>
          </Reveal>

          <ol className="flex flex-1 flex-col">
            {CHAPTERS.map((chapter, i) => (
              <li key={chapter.n} className="flex flex-col">
                <RuleDraw index={i} />
                <Reveal index={i} className="flex gap-6 py-8 md:gap-10">
                  <span className="w-8 shrink-0 pt-1.5 font-text text-k-micro uppercase tabular-nums text-k-gold">
                    {chapter.n}
                  </span>
                  <div className="flex flex-col gap-2.5">
                    <h3 className="font-display text-k-d3 font-black text-k-ink">
                      {chapter.title}
                    </h3>
                    <p className="max-w-[62ch] font-text text-k-body text-k-ink-soft">
                      {chapter.body}
                    </p>
                  </div>

                  {/* THE DOCTOR BIRD, ONCE, HERE, AND NOWHERE ELSE.
                      It is Jamaica's national bird, and this is the chapter
                      about leaving Jamaica. It used to fly across the screen
                      on every internal link, which made it wallpaper; spent
                      on the one paragraph it actually belongs to, it means
                      something again.

                      A silhouette rather than the gold rendering, because
                      the gold bird next to a gold chapter number would put
                      two gold things in one row, and because a shape reads
                      at this size where feather detail would not. */}
                  {chapter.n === "03" ? (
                    <Image
                      src="/images/brand/bird-silhouette.webp"
                      alt=""
                      width={420}
                      height={420}
                      className="ml-auto hidden h-auto w-[84px] shrink-0 self-center opacity-70 sm:block"
                    />
                  ) : null}
                </Reveal>
              </li>
            ))}
            <RuleDraw index={CHAPTERS.length} />
          </ol>
        </div>
      </section>

      {/* Said plainly, so the page does not promise a film that is not made. */}
      <section className="bg-k-surface px-6 py-24 md:px-12 lg:px-24">
        <Reveal className="mx-auto flex max-w-[820px] flex-col gap-5">
          <h2 className="font-display text-k-d3 font-black text-k-ink">
            The long version is still being made
          </h2>
          <p className="font-text text-k-body text-k-ink-soft">
            The photographs have been chosen and the scenes written, but the
            scene by scene version is not finished. Rather than put a running
            time on something nobody can watch yet, this outline is what the
            page holds until it is ready.
          </p>
          <Link
            href="/about"
            className="mt-1 w-fit border-b border-k-gold pb-0.5 font-text text-k-small text-k-ink"
          >
            More about the company
          </Link>
        </Reveal>
      </section>
    </>
  );
}
