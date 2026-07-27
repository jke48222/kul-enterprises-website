import type { Metadata } from "next";
import { CtaBand } from "@/components/v3/CtaBand";
import { Eyebrow } from "@/components/v3/Eyebrow";
import { LineReveal } from "@/components/v3/LineReveal";
import { PageHero } from "@/components/v3/PageHero";
import { Rise, RiseGroup } from "@/components/v3/Rise";
import { ServiceTile } from "@/components/v3/ServiceTile";
import { services } from "@/lib/services";

/**
 * SERVICES INDEX — the seven freight types, each linking to its dedicated
 * detail page (SEO: one page per type). Paper-dominant; the icon
 * micro-interactions live on the tiles.
 */

export const metadata: Metadata = {
  title: "Services",
  description:
    "Power Only, Dry Van, Reefer, Dedicated, Regional, Expedited, and Over-the-Road freight. Southeast based, nationwide authority. USDOT 7638788 · MC 66389691.",
};

const CONTAINER = "mx-auto w-full max-w-[1760px] px-[clamp(20px,5vw,90px)]";
const GRID = "grid grid-cols-12 gap-x-[clamp(16px,1.4vw,24px)]";

const STANDARDS = [
  {
    title: "Communication first",
    body: "One dispatch line, answered 24/7. Updates arrive before you have to ask for them.",
  },
  {
    title: "On time, in writing",
    body: "Pickup and delivery windows confirmed in writing, then kept. If anything changes, you hear it from us first.",
  },
  {
    title: "Equipment held to the name",
    body: "Clean, DOT-compliant equipment on every dispatch — inspected before the wheels turn.",
  },
] as const;

export default function ServicesPage() {
  return (
    <>
      <PageHero
        variant="photo"
        height="60"
        eyebrow="Services"
        titleLines={["Seven ways", "to move freight."]}
        deck="Every service runs on the same three promises: honest communication, on-time performance, and equipment we'd put our name on. Because it is."
        image={{
          src: "/images/stock/hero-semi-truck-dusk-mountains.jpg",
          alt: "A tractor-trailer crossing a mountain road at dusk",
        }}
      />

      {/* The seven — tile list with icon micro-interactions. */}
      <section data-ground="paper" className="bg-paper py-band-sm">
        <div className={CONTAINER}>
          <div className={GRID}>
            <div className="col-span-12 lg:col-start-2 lg:col-end-12">
              <div className="border-b border-ink/15">
                {services.map((service, i) => (
                  <ServiceTile key={service.slug} service={service} index={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* One standard, every trailer. */}
      <section data-ground="paper" className="bg-paper py-band-sm">
        <div className={CONTAINER}>
          <div className={GRID}>
            <div className="col-span-12 lg:col-start-2 lg:col-end-12">
              <Eyebrow gold>The Standard</Eyebrow>
              <LineReveal
                as="h2"
                lines={["One standard,", "every trailer."]}
                className="mt-6 max-w-[20ch] text-d2 text-ink"
              />
              <RiseGroup className="mt-12 grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3">
                {STANDARDS.map((s, i) => (
                  <Rise key={s.title}>
                    <div className="border-t border-ink/15 pt-5">
                      <p className="text-micro uppercase tabular-nums text-ink/40">
                        {String(i + 1).padStart(2, "0")}
                      </p>
                      <h3 className="mt-2 text-t1 text-ink">{s.title}</h3>
                      <p className="mt-3 max-w-[38ch] text-body text-graywarm-deep">
                        {s.body}
                      </p>
                    </div>
                  </Rise>
                ))}
              </RiseGroup>
            </div>
          </div>
        </div>
      </section>

      <CtaBand variant="packet" />
    </>
  );
}
