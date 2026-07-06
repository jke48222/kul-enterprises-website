"use client";

/**
 * HOME — v3 (18-v3-build-plan §9), the Blueprint honored literally:
 * hero headline "Reliable Freight Transportation Built on Trust.", the
 * service-list subheading, dual CTAs "Request a Freight Quote" / "Become a
 * Driver", and the six-item trust section IMMEDIATELY below the hero.
 * Light-forward rhythm: ink beats only at hero, roadway, vision, drivers,
 * and the ending.
 *
 * Beats: HeroVideo (ink, scrub 1/2) → TrustBar (paper) → QuoteStrip
 * (paper) → Manifesto (paper) → Roadway "Strength in Motion" (ink, scrub
 * 2/2) → Proof/SAFER (paper) → Services grid (paper, icon micro-
 * interactions) → Southeast map (paper) → Our Vision (ink PhotoBand) →
 * FAQ (paper) → Drivers PhotoBand (ink) → CtaBand quote → curtain Footer.
 *
 * Gold ledger: hero CTA · strip submit circle · manifesto eyebrow ·
 * roadway system · map active state · CtaBand quote underline. Tiles are
 * hover-gold only; everything else zero-gold.
 */

import Link from "next/link";

import { CtaBand } from "@/components/v3/CtaBand";
import { Eyebrow } from "@/components/v3/Eyebrow";
import { FaqAccordion } from "@/components/v3/FaqAccordion";
import { HeroVideo } from "@/components/v3/HeroVideo";
import { LineReveal } from "@/components/v3/LineReveal";
import { PhotoBand } from "@/components/v3/PhotoBand";
import { QuoteStrip } from "@/components/v3/QuoteStrip";
import { Rise } from "@/components/v3/Rise";
import { Roadway, type Beat } from "@/components/v3/Roadway";
import { useVeilState } from "@/components/v3/RouteVeil";
import { ServiceTile } from "@/components/v3/ServiceTile";
import { SoutheastMap } from "@/components/v3/SoutheastMap";
import { StatBlock, type Fact } from "@/components/v3/StatBlock";
import { TrustBar } from "@/components/v3/TrustBar";
import { services } from "@/lib/services";
import { site } from "@/lib/site";
import faq from "@/content/faq.json";

const BASE = "/v3";
const CONTAINER = "mx-auto w-full max-w-[1760px] px-[clamp(20px,5vw,90px)]";
const GRID = "grid grid-cols-12 gap-x-[clamp(16px,1.4vw,24px)]";

/** How your freight moves — the roadway's four beats. */
const ROADWAY_BEATS: Beat[] = [
  {
    title: "Quote confirmed",
    body: "A person prices your lane and confirms the pickup window in writing — same business day.",
  },
  {
    title: "Loaded & rolling",
    body: "Freight secured, sealed where required, and on the road on schedule.",
  },
  {
    title: "In constant contact",
    body: "Proactive updates at every milestone. If anything changes, you hear it from us first.",
  },
  {
    title: "Delivered & documented",
    body: "Clean delivery, proof of delivery the same day, and an invoice that matches the quote.",
  },
];

/** Real facts only — never invent, never animate the digits. */
const proofFacts: Fact[] = [
  { label: "USDOT", value: site.usdot },
  { label: "MC", value: site.mc },
  { label: "Licensed & Insured", value: "Auto liability + cargo" },
  { label: "Home Base", value: site.location },
];

/** faq.json items: quote speed, what we haul, licensed, where we run, updates. */
const FAQ_INDICES = [0, 1, 2, 3, 7];
const faqItems = FAQ_INDICES.flatMap((i) => {
  const item = faq.items[i];
  return item ? [item] : [];
});

export default function HomePage() {
  const { heroDelay } = useVeilState();
  const baseDelay = heroDelay + 0.2;

  return (
    <>
      {/* 1 · HERO — Blueprint headline, subheading, and dual CTAs, verbatim.
          Pause/play control renders inside HeroVideo (Volvo device). */}
      <HeroVideo>
        <div className={`h-full ${CONTAINER}`}>
          <div className={`h-full ${GRID}`}>
            <div className="col-span-12 flex flex-col items-start justify-end pb-[12vh] lg:col-span-9">
              <Eyebrow>KUL Enterprises · Freight Carrier</Eyebrow>
              <LineReveal
                as="h1"
                immediate
                delay={baseDelay}
                lines={["Reliable freight transportation.", "Built on trust."]}
                className="mt-6 max-w-[18ch] text-d1 text-paper"
              />
              <Rise delay={baseDelay + 0.25}>
                <p className="mt-6 max-w-[58ch] text-body-l text-paper/80">
                  Professional freight transportation across the United States —
                  Power Only · Dry Van · Reefer · Dedicated · Regional ·
                  Expedited · Nationwide.
                </p>
              </Rise>
              <Rise delay={baseDelay + 0.45}>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link href={`${BASE}/quote`} className="btn-gold">
                    Request a Freight Quote
                  </Link>
                  <Link href={`${BASE}/drivers`} className="btn-ghost-dark">
                    Become a Driver
                  </Link>
                </div>
              </Rise>
            </div>
          </div>
        </div>
      </HeroVideo>

      {/* 2 · TRUST BAR — Blueprint: "Immediately below the hero." */}
      <TrustBar />

      {/* 3 · QUOTE STRIP — paper. Gold: the submit circle. */}
      <section data-ground="paper" className="bg-paper py-band-sm">
        <div className={CONTAINER}>
          <QuoteStrip ground="paper" heading="Where is your freight going?" />
        </div>
      </section>

      {/* 4 · MANIFESTO — paper. Gold: the eyebrow. */}
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
                className="mt-6 max-w-[20ch] text-d2 text-ink"
              />
              <Rise delay={0.2}>
                <p className="mt-8 max-w-[62ch] text-body-l text-graywarm-deep">
                  KUL started on the road. Years of long hauls taught our
                  founder what freight really is: someone&apos;s livelihood, on
                  a schedule. That experience rides along on every load we
                  move.
                </p>
              </Rise>
              <Rise delay={0.3}>
                <p className="mt-8">
                  <Link
                    href={`${BASE}/about`}
                    className="link-hairline inline-block py-2 text-label uppercase text-ink"
                  >
                    Our story →
                  </Link>
                </p>
              </Rise>
            </div>
          </div>
        </div>
      </section>

      {/* 5 · STRENGTH IN MOTION — the roadway (ink, scrub 2 of 2). */}
      <Roadway
        titleLines={["How your freight moves."]}
        beats={ROADWAY_BEATS}
      />

      {/* 6 · PROOF — paper, the paperwork moment. Zero-gold. */}
      <section data-ground="paper" className="bg-paper py-band-sm">
        <div className={CONTAINER}>
          <div className={GRID}>
            <div className="col-span-12 lg:col-start-2 lg:col-end-12">
              <Eyebrow>Authority &amp; Insurance</Eyebrow>
              <LineReveal
                as="h2"
                lines={["Look us up", "before you call us."]}
                className="mt-6 max-w-[20ch] text-d2 text-ink"
              />
              <Rise delay={0.15}>
                <p className="mt-8 max-w-[62ch] text-body text-graywarm-deep">
                  We operate under full federal authority with auto liability
                  and cargo coverage. Verify us anytime on the FMCSA SAFER
                  system — we encourage it.
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

      {/* 7 · SERVICES — paper grid, icon micro-interactions (§8.6). */}
      <section data-ground="paper" className="bg-paper py-band-sm">
        <div className={CONTAINER}>
          <div className={GRID}>
            <div className="col-span-12 lg:col-start-2 lg:col-end-12">
              <Eyebrow>What We Haul</Eyebrow>
              <LineReveal
                as="h2"
                lines={["Seven ways", "to move freight."]}
                className="mt-6 max-w-[20ch] text-d2 text-ink"
              />
              <div className="mt-12 border-b border-ink/15">
                {services.map((service, i) => (
                  <ServiceTile key={service.slug} service={service} index={i} />
                ))}
              </div>
              <Rise delay={0.1}>
                <p className="mt-10">
                  <Link
                    href={`${BASE}/services`}
                    className="link-hairline inline-block py-2 text-label uppercase text-ink"
                  >
                    All services →
                  </Link>
                </p>
              </Rise>
            </div>
          </div>
        </div>
      </section>

      {/* 8 · REGIONAL FOCUS — the interactive Southeast map (§8.4). */}
      <section data-ground="paper" className="bg-paper py-band-sm">
        <div className={CONTAINER}>
          <div className={GRID}>
            <div className="col-span-12 lg:col-start-2 lg:col-end-12">
              <Eyebrow>Regional Focus</Eyebrow>
              <LineReveal
                as="h2"
                lines={["Southeast based.", "Nationwide service."]}
                className="mt-6 max-w-[20ch] text-d2 text-ink"
              />
              <div className="mt-12">
                <SoutheastMap />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9 · OUR VISION — Blueprint section, by name. Zero-gold. */}
      <PhotoBand
        image={{
          src: "/images/photos/tree-open-landscape.jpg",
          alt: "A wide oak tree standing over open green land with mountains behind",
        }}
        eyebrow="Our Vision"
        titleLines={["Rooted deep.", "Built to grow."]}
        body="Our goal: one of the Southeast's most trusted transportation companies — 50 tractors by the end of 2029, with the same commitment to safety, integrity, and dependable service that defines us today."
        align="left"
        melt
      />

      {/* 10 · FAQ — paper. FAQPage JSON-LD. */}
      <section data-ground="paper" className="bg-paper py-band-sm">
        <div className={CONTAINER}>
          <div className={GRID}>
            <div className="col-span-12 lg:col-start-2 lg:col-end-12">
              <Eyebrow>Straight Answers</Eyebrow>
              <LineReveal
                as="h2"
                lines={["Asked often."]}
                className="mt-6 max-w-[20ch] text-d2 text-ink"
              />
              <div className="mt-12">
                <FaqAccordion items={faqItems} ground="paper" jsonLd />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11 · DRIVERS — ink PhotoBand, ghost CTA. */}
      <PhotoBand
        image={{
          src: "/images/stock/driver-portrait-semi-cab-night.jpg",
          alt: "A driver looking out from the cab of his semi at night",
        }}
        eyebrow="Drive with KUL"
        titleLines={["Driven by people", "who keep their word."]}
        body="CDL-A, Southeast regional and OTR. The most important delivery on any route is the driver coming home."
        align="right"
        cta={{ label: "Become a Driver", href: `${BASE}/drivers`, style: "ghost" }}
      />

      {/* 12 · ENDING — CtaBand quote; curtain Footer follows from layout. */}
      <CtaBand variant="quote" />
    </>
  );
}
