import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { site, stories } from "@/lib/site";
import PageClosing from "@/components/concept/PageClosing";

export const metadata: Metadata = {
  title: "About",
  description:
    "The story behind KUL Enterprises: a Georgia freight carrier built from years on the road, run on integrity, safety, communication, and excellence.",
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

export default function ConceptAbout() {
  return (
    <>
      {/* Full-bleed opener. The cliffs photo carries the Blueprint's mapped
          headline (stories[0]: "Every mile teaches something new.") at the
          bottom of the frame, in the same treatment as the story bands. */}
      <section className="relative flex min-h-[80svh] flex-col justify-between overflow-hidden">
        <Image
          src={stories[0].image}
          alt={stories[0].alt}
          fill
          priority
          quality={82}
          sizes="100vw"
          className="object-cover"
        />
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(22,22,22,0.5),transparent_45%,rgba(22,22,22,0.9))]" />
        <div className="kul-fade-slow relative px-6 pt-[15vh] text-center">
          <h1 className="kul-grad-text font-mont text-[clamp(1.35rem,2.3vw,2.05rem)] font-semibold uppercase tracking-[0.3em] [text-shadow:none]">
            About KUL Enterprises
          </h1>
        </div>
        <Reveal className="relative mx-auto w-full max-w-6xl px-6 pb-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
            {stories[0].eyebrow}
          </p>
          <h2 className="mt-3 max-w-lg font-omnibus text-[clamp(1.6rem,2.6vw,2.2rem)] leading-tight text-[#F8F8F8]">
            {stories[0].title}
          </h2>
        </Reveal>
      </section>

      {/* Founder story */}
      <section className="bg-ink2">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-28">
          <div className="grid gap-12 md:grid-cols-2 md:gap-20">
            <Reveal>
              <h2 className="font-omnibus text-[clamp(1.8rem,3vw,2.3rem)] leading-tight text-[#F8F8F8]">
                Built from miles, not meetings
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="space-y-5 leading-relaxed text-graywarm-light">
                <p>
                  Before KUL Enterprises ran under its own authority, its
                  founder spent years crossing America behind the wheel.
                  Mountain grades, port queues, 2 a.m. dock doors, and the
                  long quiet stretches where a driver learns who he really is.
                </p>
                <p>
                  Those years taught a lesson no office ever could. Freight is
                  a promise with a deadline. At the end of every lane there is
                  a family waiting on a delivery, a business depending on a
                  dock time, a customer trusting a stranger to keep his word.
                </p>
                <p>
                  The lion on our mark stands for the strength and
                  responsibility we bring to every load. The Doctor Bird, the
                  national bird of Jamaica and a nod to our founder&apos;s
                  heritage, stands for precision, speed, and purpose.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section id="values" className="bg-ink2">
        <div className="mx-auto max-w-6xl px-6 pb-24">
          <Reveal>
            <h2 className="kul-grad-text font-omnibus text-[clamp(1.8rem,3vw,2.3rem)] leading-tight">
              Four values, kept the old-fashioned way
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2">
            {values.map((v) => (
              <Reveal key={v.name} className="bg-ink2 p-8">
                <h3 className="font-omnibus text-xl text-cream">{v.name}</h3>
                <p className="mt-3 leading-relaxed text-graywarm-light">{v.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Story photography bands */}
      {stories.slice(1, 4).map((s, i) => (
        <section key={s.slug} className="relative flex min-h-[75svh] items-end overflow-hidden">
          <Image
            src={s.image}
            alt={s.alt}
            fill
            quality={80}
            sizes="100vw"
            className="object-cover"
          />
          <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(22,22,22,0.25),transparent_40%,rgba(22,22,22,0.85))]" />
          <Reveal className={`relative mx-auto w-full max-w-6xl px-6 pb-16 ${i % 2 ? "text-right" : ""}`}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
              {s.eyebrow}
            </p>
            <h2 className={`mt-3 max-w-lg font-omnibus text-[clamp(1.6rem,2.6vw,2.2rem)] leading-tight text-[#F8F8F8] ${i % 2 ? "ml-auto" : ""}`}>
              {s.title}
            </h2>
          </Reveal>
        </section>
      ))}

      {/* Vision close */}
      <section className="bg-ink2">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center md:py-28">
          <Reveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
              Where we&apos;re headed
            </p>
            <p className="mx-auto mt-6 max-w-2xl font-omnibus text-2xl leading-relaxed text-[#F8F8F8]">
              One of the Southeast&apos;s most trusted transportation
              companies. Fifty tractors by the end of 2029, running on the
              same values we started with.
            </p>
            <Link
              href="/v1/quote"
              className="mt-10 inline-flex items-center rounded-full bg-gold px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.25em] text-ink transition-colors hover:bg-gold-soft"
            >
              Ship With Us
            </Link>
            <p className="mt-8 text-xs uppercase tracking-[0.2em] text-graywarm">
              USDOT {site.usdot} · MC {site.mc} · {site.location}
            </p>
          </Reveal>
        </div>
      </section>

      <PageClosing />
    </>
  );
}
