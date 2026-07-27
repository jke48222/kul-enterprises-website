import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/v3/CtaBand";
import { Eyebrow } from "@/components/v3/Eyebrow";
import { GhostNumeral } from "@/components/v3/GhostNumeral";
import { LineReveal } from "@/components/v3/LineReveal";
import { PageHero } from "@/components/v3/PageHero";
import { PhotoBand } from "@/components/v3/PhotoBand";
import { Rise } from "@/components/v3/Rise";
import { site, stories } from "@/lib/site";

/**
 * ABOUT — the journey page (plan §8.5/§9): leads with PURPOSE, not trucks
 * (Blueprint law), then Mark's five real photographs become the scrolled
 * journey across the country — the one thing no competitor can copy.
 * Photo mapping per the Blueprint: cliffs = the About opener ("Every mile
 * teaches something new."), river = Integrity, tree = Story/roots,
 * ocean = Strength in Motion, desert = Safety/foundation.
 */

export const metadata: Metadata = {
  title: "About",
  description:
    "KUL Enterprises was built from years on the road, not inside an office. The founder's story, the values behind the company, and the vision: 50 tractors by 2029.",
};

const BASE = "/v3";
const CONTAINER = "mx-auto w-full max-w-[1760px] px-[clamp(20px,5vw,90px)]";
const GRID = "grid grid-cols-12 gap-x-[clamp(16px,1.4vw,24px)]";

/** Blueprint mapping: stories[0] (cliffs) is the hero; 1–4 are the journey. */
const opener = stories[0];
const journey = stories.slice(1);

/** Paper sliver between journey chapters — the route thread. */
function MileMarker({ index }: { index: number }) {
  return (
    <div
      data-ground="paper"
      aria-hidden
      className="flex flex-col items-center gap-3 bg-paper py-10"
    >
      <span className="h-12 w-px bg-ink/20" />
      <span className="text-micro uppercase tabular-nums text-ink/40">
        Mile {String(index + 1).padStart(2, "0")}
      </span>
    </div>
  );
}

export default function AboutPage() {
  return (
    <>
      {/* 1 · Opener — the cliffs photo + the Blueprint's exact headline. */}
      <PageHero
        variant="photo"
        height="80"
        eyebrow="About KUL Enterprises"
        titleLines={["Every mile teaches", "something new."]}
        deck="Long before KUL ran under its own authority, its founder spent years crossing America. This company was built from those miles."
        image={{ src: opener.image, alt: opener.alt }}
      />

      {/* 2 · Purpose — paper. Gold: the eyebrow. */}
      <section data-ground="paper" className="bg-paper py-band">
        <div className={CONTAINER}>
          <div className={GRID}>
            <div className="col-span-12 lg:col-start-2 lg:col-end-10">
              <Eyebrow gold>Why We Exist</Eyebrow>
              <LineReveal
                as="h2"
                lines={["It started with purpose,", "not trucks."]}
                className="mt-6 max-w-[20ch] text-d2 text-ink"
              />
              <Rise delay={0.2}>
                <div className="mt-8 max-w-[62ch] space-y-5 text-body-l text-graywarm-deep">
                  <p>
                    Years of driving thousands of miles — deserts, mountains,
                    forests, coastlines, cities, and small towns — kept
                    teaching the same lesson: freight isn&apos;t just freight.
                    Behind every shipment is a family waiting, a business
                    depending on a delivery, a customer trusting someone to
                    keep their word.
                  </p>
                  <p>
                    KUL Enterprises was built from those miles. Not inside an
                    office — from experience gained on the road itself. That
                    experience became the foundation for a company built on
                    trust.
                  </p>
                </div>
              </Rise>
            </div>
          </div>
        </div>
      </section>

      {/* 3 · The journey — Mark's real photographs, one theme per chapter.
             Parallax gates itself under reduced motion (vestibular law). */}
      {journey.map((story, i) => (
        <div key={story.slug}>
          <MileMarker index={i} />
          <PhotoBand
            image={{ src: story.image, alt: story.alt }}
            eyebrow={story.eyebrow}
            titleLines={[story.title]}
            body={story.body}
            align={i % 2 === 0 ? "left" : "right"}
            minH="min-h-[86svh]"
          />
        </div>
      ))}

      {/* 4 · Founder voice — a named human (trust doctrine §10). His own
             written words, from the KUL Website Blueprint. */}
      <section data-ground="paper" className="bg-paper py-band">
        <div className={CONTAINER}>
          <div className={GRID}>
            <div className="col-span-12 lg:col-start-2 lg:col-end-11">
              <Eyebrow>The Founder</Eyebrow>
              <Rise delay={0.15}>
                <blockquote className="mt-8">
                  <p className="max-w-[26ch] text-d2 text-ink">
                    “Behind every shipment is a family waiting, a business
                    depending on a delivery, a customer trusting someone to
                    keep their word.”
                  </p>
                  <footer className="mt-8 text-micro uppercase text-ink/60">
                    Mark S. Brown — Founder, {site.legalName}
                  </footer>
                </blockquote>
              </Rise>
            </div>
          </div>
        </div>
      </section>

      {/* 5 · Our Vision — ink, the 50-by-2029 goal stated as ambition. */}
      <section data-ground="ink" className="relative overflow-hidden bg-ink py-band">
        <GhostNumeral className="-right-6 top-6">50</GhostNumeral>
        <div className={`relative z-10 ${CONTAINER}`}>
          <div className={GRID}>
            <div className="col-span-12 lg:col-start-2 lg:col-end-11">
              <Eyebrow>Our Vision</Eyebrow>
              <LineReveal
                as="h2"
                lines={["Fifty tractors", "by the end of 2029."]}
                className="mt-6 max-w-[18ch] text-d2 text-paper"
              />
              <Rise delay={0.2}>
                <p className="mt-8 max-w-[62ch] text-body-l text-paper/75">
                  Our goal is to build one of the Southeast&apos;s most trusted
                  transportation companies — expanding the fleet with
                  intention while keeping the same commitment to safety,
                  integrity, and dependable service that defines us today.
                  Growth is the plan. Trust is the constant.
                </p>
              </Rise>
              <Rise delay={0.3}>
                <p className="mt-10">
                  <Link
                    href={`${BASE}/safety`}
                    className="link-hairline inline-block py-2 text-label uppercase text-paper/80"
                  >
                    How we keep it safe →
                  </Link>
                </p>
              </Rise>
            </div>
          </div>
        </div>
      </section>

      {/* 6 · Next — full-bleed handoff to Services. */}
      <CtaBand
        variant="next"
        next={{
          label: "What we haul",
          href: `${BASE}/services`,
          image: {
            src: "/images/stock/hero-semi-truck-dusk-mountains.jpg",
            alt: "A tractor-trailer crossing a mountain road at dusk",
          },
        }}
      />
    </>
  );
}
