import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "KUL Enterprises was built from years of real miles across America. The story, the values, and the vision behind our Loganville, GA freight company.",
};

const values = [
  {
    name: "Integrity",
    body: "We quote what we can do and we do what we quoted. If anything changes, you hear it from us first.",
  },
  {
    name: "Safety",
    body: "Pre-trip inspections, legal hours, and weather calls made early and on the side of caution. Every load, no exceptions.",
  },
  {
    name: "Communication",
    body: "A person answers dispatch. Shippers get updates before they ask. Drivers get straight answers. 24/7 means 24/7.",
  },
  {
    name: "Excellence",
    body: "The gold in our logo is a standard, not a decoration. Clean equipment, professional drivers, paperwork done right the first time.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About KUL Enterprises"
        title="Freight isn't just freight."
        lede="Behind every load is a family waiting, a business depending, a customer trusting someone to keep their word. This company was built from that truth."
      />

      <div className="section-light">
        <div className="mx-auto max-w-content px-6 py-20 md:py-28">
          <Reveal>
            <Image
              src="/images/photos/cliffs-over-water.jpg"
              alt="Rocky cliffs rising over deep blue water"
              width={1920}
              height={1440}
              priority
              sizes="(min-width: 1280px) 1280px, 100vw"
              className="h-auto w-full"
            />
            <p className="mt-4 text-sm italic text-graywarm-deep">
              Every mile teaches something new.
            </p>
          </Reveal>

          <Reveal className="mx-auto mt-20 max-w-measure">
            <div className="flex items-center gap-4">
              <span className="gold-rule" />
              <span className="eyebrow text-gold-dim">The Founder&apos;s Road</span>
            </div>
            <h2 className="mt-5 font-display text-display-l font-bold">
              Built from miles, not meetings.
            </h2>
            <div className="mt-8 space-y-6 text-lg leading-relaxed text-graywarm-deep">
              <p>
                Before KUL Enterprises ran under its own authority, its founder
                spent years crossing America behind the wheel. Mountain grades,
                port queues, 2 a.m. dock doors, and the long quiet stretches
                where a driver learns who he really is.
              </p>
              <p>
                Those years taught a lesson no office ever could. Freight is a
                promise with a deadline. At the end of every lane there is a
                family waiting on a delivery, a business depending on a dock
                time, a customer trusting a stranger to keep his word.
              </p>
              <p>
                KUL Enterprises was built from those miles. The lion on our
                mark stands for the strength and responsibility we bring to
                every load. The Doctor Bird, the national bird of Jamaica and
                a nod to our founder&apos;s heritage, stands for precision,
                speed, and purpose. Together they make one promise:{" "}
                <em>{site.tagline}</em>
              </p>
            </div>
          </Reveal>

          <Reveal className="mt-24">
            <div className="flex items-center gap-4">
              <span className="gold-rule" />
              <span className="eyebrow text-gold-dim">
                What we won&apos;t compromise
              </span>
            </div>
            <h2 className="mt-5 max-w-2xl font-display text-h2 font-bold">
              Four values, kept the old-fashioned way. By keeping them.
            </h2>
          </Reveal>
          <RevealGroup className="mt-10 grid gap-px border border-ink/10 bg-ink/10 sm:grid-cols-2">
            {values.map((v) => (
              <RevealItem key={v.name} className="bg-paper p-8">
                <h3 className="font-display text-lg font-bold">{v.name}</h3>
                <p className="mt-3 leading-relaxed text-graywarm-deep">{v.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>

      <section className="bg-ink">
        <div className="mx-auto max-w-content px-6 py-24 text-center md:py-28">
          <Reveal>
            <p className="eyebrow text-gold">Where we&apos;re headed</p>
            <p className="mx-auto mt-6 max-w-3xl font-display text-h2 font-bold text-white">
              One of the Southeast&apos;s most trusted transportation
              companies. Fifty tractors by the end of 2029, running on the
              same values we started with.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/concept/quote" className="btn-gold">
                Ship with us
              </Link>
              <Link href="/concept/careers" className="btn-ghost-dark">
                Grow with us
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
