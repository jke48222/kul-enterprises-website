"use client";

/**
 * HOME — v2 design bible §4.1.
 *
 * Nine beats: HeroVideo (ink, scrub 1 of 2) → QuoteStrip (paper) →
 * manifesto (paper) → TruckChapters (ink, 400vh pin, scrub 2 of 2) →
 * proof (paper) → vision PhotoBand (photo/ink, melt) → FAQ (paper) →
 * drivers PhotoBand (photo/ink) → CtaBand "quote" → curtain Footer (layout).
 *
 * Client component solely so the hero's LineReveal timing can read
 * useVeilState().heroDelay (§3.22 — the hero starts rising ~0.1s before the
 * route veil clears). Like v1, the page exports no local metadata: the root
 * layout owns the site title/description and Organization JSON-LD, and the
 * FAQ section below emits its own FAQPage schema via FaqAccordion.
 *
 * Gold ledger (§4.1, beyond the fixed chrome CTA): hero gold CTA · strip
 * submit circle · manifesto eyebrow · active chapter eyebrow · FAQ eyebrow ·
 * CtaBand quote underline. Nothing else on this page is gold.
 */

import Link from "next/link";

import { CtaBand } from "@/components/v2/CtaBand";
import { Eyebrow } from "@/components/v2/Eyebrow";
import { FaqAccordion } from "@/components/v2/FaqAccordion";
import { HeroFrame } from "@/components/v2/HeroFrame";
import { HeroVideo } from "@/components/v2/HeroVideo";
import { LineReveal } from "@/components/v2/LineReveal";
import { PhotoBand } from "@/components/v2/PhotoBand";
import { QuoteStrip } from "@/components/v2/QuoteStrip";
import { Rise } from "@/components/v2/Rise";
import { useVeilState } from "@/components/v2/RouteVeil";
import { StatBlock, type Fact } from "@/components/v2/StatBlock";
import { TruckChapters, type Chapter } from "@/components/v2/TruckChapters";
import { services } from "@/lib/services";
import { site } from "@/lib/site";
import faq from "@/content/faq.json";

const CONTAINER = "mx-auto w-full max-w-[1760px] px-[clamp(20px,5vw,90px)]";
const GRID = "grid grid-cols-12 gap-x-[clamp(16px,1.4vw,24px)]";

/**
 * §3.21 home chapter data — slugs and photos are fixed by the bible; the
 * eyebrow (tagline), title (name), and body (`short`) come from
 * content/services.json so CMS edits flow through.
 */
const HOME_CHAPTERS: { slug: string; image: { src: string; alt: string } }[] = [
  {
    slug: "dry-van",
    image: {
      src: "/images/stock/hero-semi-truck-dusk-mountains.jpg",
      alt: "A tractor-trailer crossing a mountain road at dusk",
    },
  },
  {
    slug: "reefer",
    image: {
      src: "/images/stock/hero-alt-semi-night-gold-lights.jpg",
      alt: "A semi truck rolling through the night under warm gold lights",
    },
  },
  {
    slug: "dedicated",
    image: {
      src: "/images/stock/driver-in-cab-gold-truck.jpg",
      alt: "A driver at the wheel of his cab in warm evening light",
    },
  },
  {
    slug: "expedited",
    image: {
      src: "/images/stock/road-night-light-trails.jpg",
      alt: "Tail-light trails streaking along a dark highway at night",
    },
  },
];

const chapters: Chapter[] = HOME_CHAPTERS.flatMap(({ slug, image }, i) => {
  const service = services.find((s) => s.slug === slug);
  if (!service) return [];
  return [
    {
      index: `0${i + 1}`,
      slug,
      eyebrow: service.tagline,
      title: service.name,
      body: service.short,
      image,
    },
  ];
});

/** §4.1.7 — faq.json items 1, 2, 3, 4, 8 (1-indexed): quote speed, what we haul, licensed, where we run, updates. */
const FAQ_INDICES = [0, 1, 2, 3, 7];
const faqItems = FAQ_INDICES.flatMap((i) => {
  const item = faq.items[i];
  return item ? [item] : [];
});

/** §3.13 allowed facts only — USDOT/MC render static, never animated. */
const proofFacts: Fact[] = [
  { label: "USDOT", value: site.usdot },
  { label: "MC", value: site.mc },
  { label: "Licensed & Insured", value: "Auto liability + cargo" },
  { label: "Home Base", value: site.location },
];

export default function HomePage() {
  // §3.22 — 0.35 while a veil-out is in flight, 0 on first load / popstate.
  const { heroDelay } = useVeilState();
  const baseDelay = heroDelay + 0.2;

  return (
    <>
      {/* 1 · HERO — §4.1.1. HeroVideo renders its own ink section (130svh,
          sticky svh frame, scroll-out scrub = scrub 1 of 2). Gold: the hero
          CTA (nav chrome is transparent at top state — total 2). */}
      <HeroVideo>
        <div className={`h-full ${CONTAINER}`}>
          <div className={`h-full ${GRID}`}>
            <div className="col-span-12 flex flex-col items-start justify-end pb-[12vh] lg:col-span-8">
              <Eyebrow>KUL Enterprises · Freight Carrier</Eyebrow>
              <LineReveal
                as="h1"
                immediate
                delay={baseDelay}
                lines={["Strength", "in Motion."]}
                className="mt-6 max-w-[14ch] font-omnibus text-display-xl text-cream"
              />
              <Rise delay={baseDelay + 0.25}>
                <p className="mt-6 max-w-[52ch] text-body-l text-paper/80">
                  A Georgia freight carrier built on integrity and driven by
                  safety &mdash; Southeast based, nationwide service.
                </p>
              </Rise>
              <Rise delay={baseDelay + 0.45}>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link href="/v2/quote" className="btn-gold">
                    Request a Quote
                  </Link>
                  <Link href="/v2/drivers" className="btn-ghost-dark">
                    Drive with KUL
                  </Link>
                </div>
              </Rise>
            </div>
          </div>
        </div>
        {/* Furniture at +0.6s (§4.1.1) — a CSS-only opacity fade: HeroFrame
            positions absolutely, so its wrapper must never carry a transform
            (a transformed ancestor would hijack its containing block). */}
        <div
          className="motion-safe:animate-[v2-home-furniture_0.6s_ease-out_both]"
          style={{ animationDelay: `${baseDelay + 0.6}s` }}
        >
          <HeroFrame />
        </div>
        <style>{`@keyframes v2-home-furniture{from{opacity:0}to{opacity:1}}`}</style>
      </HeroVideo>

      {/* 2 · QUOTE STRIP — §4.1.2. Paper. Heading is the page's first h2
          (default headingLevel, h3 visual scale). Gold: the submit circle. */}
      <section data-ground="paper" className="bg-paper py-band-sm">
        <div className={CONTAINER}>
          <QuoteStrip ground="paper" heading="Where is it going?" />
        </div>
      </section>

      {/* 3 · MANIFESTO — §4.1.3. Paper continues. Gold: the eyebrow. */}
      <section data-ground="paper" className="bg-paper py-band">
        <div className={CONTAINER}>
          <div className={GRID}>
            <div className="col-span-12 lg:col-start-2 lg:col-end-10">
              <Eyebrow gold>The Carrier</Eyebrow>
              <LineReveal
                as="h2"
                lines={[
                  "Freight is a promise",
                  "with a deadline.",
                  "We keep both.",
                ]}
                className="mt-6 max-w-[20ch] font-omnibus text-h2 text-ink"
              />
              <Rise delay={0.2}>
                {/* site.json stories[every-mile].body, lightly trimmed (§4.1.3). */}
                <p className="mt-8 max-w-[62ch] text-body-l text-graywarm-deep">
                  KUL started on the road. Years of long hauls taught our
                  founder what freight really is: someone&apos;s livelihood, on
                  a schedule. That experience rides along on every load we
                  move.
                </p>
              </Rise>
            </div>
          </div>
        </div>
      </section>

      {/* 4 · TRUCK CHAPTERS — §4.1.4. Renders its own ink section (400vh
          pin, scrub 2 of 2). Gold: the active chapter eyebrow. */}
      <TruckChapters chapters={chapters} />

      {/* 5 · PROOF — §4.1.5. Paper, the paperwork moment. Zero-gold. */}
      <section data-ground="paper" className="bg-paper py-band-sm">
        <div className={CONTAINER}>
          <div className={GRID}>
            <div className="col-span-12 lg:col-start-2 lg:col-end-12">
              <Eyebrow>Authority &amp; Insurance</Eyebrow>
              <LineReveal
                as="h2"
                lines={["Look us up", "before you call us."]}
                className="mt-6 max-w-[20ch] font-omnibus text-h2 text-ink"
              />
              <Rise delay={0.15}>
                <p className="mt-8 max-w-[62ch] text-body text-graywarm-deep">
                  We operate under full federal authority with auto liability
                  and cargo coverage. Verify us anytime on the FMCSA SAFER
                  system &mdash; we encourage it.
                </p>
              </Rise>
              <div className="mt-14">
                <StatBlock facts={proofFacts} ground="paper" columns={4} />
              </div>
              <Rise delay={0.1}>
                <p className="mt-12">
                  <a
                    href="https://safer.fmcsa.dot.gov/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-hairline inline-block py-2 text-label uppercase text-ink"
                  >
                    Verify on FMCSA SAFER <span aria-hidden>↗</span>
                  </a>
                </p>
              </Rise>
            </div>
          </div>
        </div>
      </section>

      {/* 6 · VISION BAND — §4.1.6. PhotoBand renders its own ink section.
          Nature photo allowed: statement beat. Zero-gold, no CTA. */}
      <PhotoBand
        image={{
          src: "/images/photos/tree-open-landscape.jpg",
          alt: "A wide oak tree standing over open green land with mountains behind",
        }}
        eyebrow="The Vision"
        titleLines={["Rooted deep.", "Built to grow."]}
        body="Fifty tractors by the end of 2029 — one kept promise at a time."
        align="left"
        melt
      />

      {/* 7 · FAQ — §4.1.7. Paper. Gold: the eyebrow. FaqAccordion emits
          FAQPage JSON-LD. */}
      <section data-ground="paper" className="bg-paper py-band-sm">
        <div className={CONTAINER}>
          <div className={GRID}>
            <div className="col-span-12 lg:col-start-2 lg:col-end-12">
              <Eyebrow gold>Straight Answers</Eyebrow>
              <LineReveal
                as="h2"
                lines={["Asked often."]}
                className="mt-6 max-w-[20ch] font-omnibus text-h2 text-ink"
              />
              <div className="mt-12">
                <FaqAccordion items={faqItems} ground="paper" jsonLd />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8 · DRIVERS BAND — §4.1.8. PhotoBand renders its own ink section.
          Ghost CTA — zero-gold. */}
      <PhotoBand
        image={{
          src: "/images/stock/driver-portrait-semi-cab-night.jpg",
          alt: "A driver looking out from the cab of his semi at night",
        }}
        eyebrow="Drive with KUL"
        titleLines={["Driven by people", "who keep their word."]}
        body="CDL-A, Southeast regional and OTR. The most important delivery on any route is the driver coming home."
        align="right"
        cta={{ label: "Drive with KUL", href: "/v2/drivers", style: "ghost" }}
      />

      {/* 9 · ENDING — §4.1.9. CtaBand renders its own ink section (92svh).
          Gold: the underlined quote link. Curtain Footer follows in layout. */}
      <CtaBand variant="quote" />
    </>
  );
}
