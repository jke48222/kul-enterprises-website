import type { Metadata } from "next";
import Image from "next/image";
import { BirdMark } from "@/components/v2/BirdMark";
import { ClipReveal } from "@/components/v2/ClipReveal";
import { CtaBand } from "@/components/v2/CtaBand";
import { Eyebrow } from "@/components/v2/Eyebrow";
import { GhostNumeral } from "@/components/v2/GhostNumeral";
import { HeroFrame } from "@/components/v2/HeroFrame";
import { LineReveal } from "@/components/v2/LineReveal";
import { PageHero } from "@/components/v2/PageHero";
import { Rise, RiseGroup } from "@/components/v2/Rise";
import { site, stories } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "The story behind KUL Enterprises: a Georgia freight carrier built from years on the road, run on integrity, safety, communication, and excellence.",
};

const CONTAINER = "mx-auto w-full max-w-[1760px] px-[clamp(20px,5vw,90px)]";
const GRID = "grid grid-cols-1 gap-x-[clamp(16px,1.4vw,24px)] lg:grid-cols-12";

/** Pull a story by slug from content/site.json — copy source of truth. */
function story(slug: string) {
  const s = stories.find((s) => s.slug === slug);
  if (!s) throw new Error(`Missing story: ${slug}`);
  return s;
}

/** §4.2.3 — growth ledger columns. Facts only; no invented stats. */
const LEDGER = [
  {
    index: "01",
    head: "Authority",
    body: `Federal operating authority, active. USDOT ${site.usdot} · MC ${site.mc}.`,
  },
  {
    index: "02",
    head: "Home",
    body: "Based in Loganville, Georgia. The Southeast is a home route; the authority is nationwide.",
  },
  {
    index: "03",
    head: "The Mark",
    body: "Fifty tractors by the end of 2029. Growth that never outruns the service.",
  },
] as const;

export default function AboutPage() {
  const everyMile = story("every-mile");
  // §4.2.4 — the three framed value rows, in spec order.
  const values = [
    { story: story("integrity"), imageLeft: true },
    { story: story("strength-in-motion"), imageLeft: false },
    { story: story("driven-by-safety"), imageLeft: true },
  ];

  return (
    <>
      {/* 1 — HERO (§4.2.1). Photo variant, cliffs opener. Gold: none. */}
      <div className="relative">
        <PageHero
          variant="photo"
          height="80"
          eyebrow="Our Story"
          titleLines={["Trust is in", "our DNA."]}
          deck="Built from miles, not meetings."
          image={{ src: "/images/photos/cliffs-over-water.jpg", alt: everyMile.alt }}
        />
        <HeroFrame />
      </div>

      {/* 2 — FOUNDER MANIFESTO (§4.2.2). Paper. Gold: the eyebrow. */}
      <section data-ground="paper" className="bg-paper py-band-lg">
        <div className={`${CONTAINER} ${GRID}`}>
          <div className="lg:col-start-3 lg:col-end-11">
            <Eyebrow gold>{everyMile.eyebrow}</Eyebrow>
            <LineReveal
              as="h2"
              lines={["Every mile teaches", "something new."]}
              className="mt-6 max-w-[14ch] font-omnibus text-h2 text-ink"
            />
            <Rise delay={0.2}>
              <p className="mt-10 max-w-[62ch] text-body-l text-graywarm-deep">
                {everyMile.body}
              </p>
            </Rise>
            <Rise delay={0.3}>
              <div className="mt-12">
                <div aria-hidden className="h-px w-6 bg-ink/[0.15]" />
                <p className="mt-4 text-micro uppercase text-graywarm-deep">
                  Founder · KUL Enterprises · Loganville, GA
                </p>
              </div>
            </Rise>
          </div>
        </div>
      </section>

      {/* 3 — GROWTH LEDGER (§4.2.3). Ink. Gold: none. */}
      <section
        data-ground="ink"
        className="relative overflow-hidden bg-ink py-band"
      >
        <div className={`relative z-10 ${CONTAINER}`}>
          <Eyebrow>On Purpose</Eyebrow>
          <LineReveal
            as="h2"
            lines={["We grow load by load."]}
            className="mt-6 max-w-[14ch] font-omnibus text-h2 text-cream"
          />
          <RiseGroup className="mt-16 grid grid-cols-1 gap-x-[clamp(16px,1.4vw,24px)] gap-y-12 md:grid-cols-3">
            {LEDGER.map((col) => (
              <Rise key={col.index} className="relative border-t border-white/[0.12] pt-6">
                {/* GhostNumeral 2029 behind column 3 — decoration, never gold. */}
                {col.index === "03" && (
                  <GhostNumeral className="-top-10 right-0">2029</GhostNumeral>
                )}
                <p className="relative text-label uppercase text-paper/80">
                  <span aria-hidden className="mr-3 tabular-nums text-paper/40">
                    {"{"}
                    {col.index}
                    {"}"}
                  </span>
                  {col.head}
                </p>
                <p className="relative mt-4 max-w-[38ch] text-body tabular-nums text-paper/70">
                  {col.body}
                </p>
              </Rise>
            ))}
          </RiseGroup>
        </div>
      </section>

      {/* 4 — VALUES, FRAMED (§4.2.4). Paper; B-state framed images, text beside,
          never on the photo. Gold: none. */}
      <section data-ground="paper" className="bg-paper py-band">
        <div className={`${CONTAINER} space-y-[clamp(4rem,3rem+6vw,8rem)]`}>
          {values.map(({ story: s, imageLeft }) => (
            <div key={s.slug} className={`${GRID} items-center gap-y-8`}>
              <div
                className={
                  imageLeft
                    ? "lg:col-span-6 lg:col-start-1"
                    : "order-1 lg:order-2 lg:col-span-6 lg:col-start-7"
                }
              >
                <ClipReveal direction="left" className="aspect-[16/9]">
                  <Image
                    src={s.image}
                    alt={s.alt}
                    fill
                    sizes="(min-width:768px) 50vw, 100vw"
                    className="img-grade object-cover"
                  />
                </ClipReveal>
              </div>
              <div
                className={
                  imageLeft
                    ? "lg:col-span-4 lg:col-start-8"
                    : "order-2 lg:order-1 lg:col-span-4 lg:col-start-2"
                }
              >
                <Eyebrow>{s.eyebrow}</Eyebrow>
                <Rise delay={0.15}>
                  <h3 className="mt-5 max-w-[14ch] font-omnibus text-h3 text-ink">
                    {s.title}
                  </h3>
                </Rise>
                <Rise delay={0.25}>
                  <p className="mt-5 max-w-[48ch] text-body text-graywarm-deep">
                    {s.body}
                  </p>
                </Rise>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5 — BIRDMARK → 2029 CLOSE (§4.2.5). Ink. Gold: the BirdMark —
          this page's single gold rule and the viewport's 2nd gold. */}
      <section
        data-ground="ink"
        className="relative overflow-hidden bg-ink py-band-lg"
      >
        <div className={CONTAINER}>
          <BirdMark ground="ink" />
        </div>
        <div className={`relative mt-[clamp(4rem,3rem+5vw,7rem)] ${CONTAINER} ${GRID}`}>
          <div className="relative text-center lg:col-start-3 lg:col-end-11">
            <GhostNumeral className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              2029
            </GhostNumeral>
            <LineReveal
              as="h2"
              lines={["Fifty tractors.", "One kept promise", "at a time."]}
              className="relative z-10 font-omnibus text-display-l text-cream"
            />
            <Rise delay={0.4}>
              <p className="relative z-10 mt-10 text-micro uppercase text-paper/60">
                The service never falls behind the name on the door
              </p>
            </Rise>
          </div>
        </div>
      </section>

      {/* 6 — ENDING (§4.2.6): next → Services, then the curtain Footer. */}
      <CtaBand
        variant="next"
        next={{
          label: "Services",
          href: "/services",
          image: {
            src: "/images/stock/hero-semi-truck-dusk-mountains.jpg",
            alt: "A tractor-trailer crossing a mountain road at dusk",
          },
        }}
      />
    </>
  );
}
