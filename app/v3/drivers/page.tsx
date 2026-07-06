import type { Metadata } from "next";
import { CtaBand } from "@/components/v3/CtaBand";
import { Eyebrow } from "@/components/v3/Eyebrow";
import { LineReveal } from "@/components/v3/LineReveal";
import { PageHero } from "@/components/v3/PageHero";
import { Rise, RiseGroup } from "@/components/v3/Rise";
import DriverForm from "@/components/forms/DriverForm";
import { site } from "@/lib/site";

/**
 * DRIVER CAREERS — a dedicated CDL landing page, not a form dump
 * (17-v3-research §3): leads with what the Spring-2026 driver survey says
 * actually decides — home time, communication, respect, consistency —
 * then an HONEST pay section (no invented ranges; consistency is the
 * promise), a 30-second mobile-first form, and a speed-to-lead
 * expectation. The most important delivery is the driver coming home.
 */

export const metadata: Metadata = {
  title: "Driver Careers",
  description:
    "Drive CDL-A for KUL Enterprises — Southeast regional and OTR out of Loganville, GA. Home time you can plan on, dispatch that answers, and pay math shown before you commit.",
};

const CONTAINER = "mx-auto w-full max-w-[1760px] px-[clamp(20px,5vw,90px)]";
const GRID = "grid grid-cols-12 gap-x-[clamp(16px,1.4vw,24px)]";

const VALUES = [
  {
    title: "Home time you can plan on",
    body: "Schedules are built backwards from your home day, not the other way around. When we commit to a reset window, it holds.",
  },
  {
    title: "Dispatch that answers",
    body: "One line, a person on it, day or night. No dispatcher roulette, no waiting on a callback that never comes.",
  },
  {
    title: "Respect, as policy",
    body: "You're the professional in the seat. Route input gets heard, weather calls get backed, and nobody pressures the clock.",
  },
  {
    title: "Equipment before miles",
    body: "Maintenance happens on schedule, not on breakdowns. You drive equipment we'd put our own name on — because it's there.",
  },
] as const;

export default function DriversPage() {
  return (
    <>
      {/* 1 · Hero */}
      <PageHero
        variant="photo"
        height="80"
        eyebrow="Driver Careers"
        titleLines={["Drive for a carrier", "that remembers your name."]}
        deck="CDL-A · Southeast regional and OTR out of Loganville, Georgia. A growing fleet where the founder still answers the phone."
        image={{
          src: "/images/stock/driver-in-cab-gold-truck.jpg",
          alt: "A driver at the wheel of his cab in warm evening light",
        }}
      />

      {/* 2 · What decides — the four things drivers actually weigh. */}
      <section data-ground="paper" className="bg-paper py-band-sm">
        <div className={CONTAINER}>
          <div className={GRID}>
            <div className="col-span-12 lg:col-start-2 lg:col-end-12">
              <Eyebrow gold>Why Drive With KUL</Eyebrow>
              <LineReveal
                as="h2"
                lines={["The job, the way it", "should have been."]}
                className="mt-6 max-w-[22ch] text-d2 text-ink"
              />
              <RiseGroup className="mt-12 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2">
                {VALUES.map((v, i) => (
                  <Rise key={v.title}>
                    <div className="border-t border-ink/15 pt-5">
                      <p className="text-micro uppercase tabular-nums text-ink/40">
                        {String(i + 1).padStart(2, "0")}
                      </p>
                      <h3 className="mt-2 text-t1 text-ink">{v.title}</h3>
                      <p className="mt-3 max-w-[44ch] text-body text-graywarm-deep">
                        {v.body}
                      </p>
                    </div>
                  </Rise>
                ))}
              </RiseGroup>
            </div>
          </div>
        </div>
      </section>

      {/* 3 · Pay, plainly — honesty over hype (no invented ranges). */}
      <section data-ground="ink" className="bg-ink py-band-sm">
        <div className={CONTAINER}>
          <div className={GRID}>
            <div className="col-span-12 lg:col-start-2 lg:col-end-10">
              <Eyebrow>Pay, Plainly</Eyebrow>
              <LineReveal
                as="h2"
                lines={["No teaser numbers.", "The real lane math."]}
                className="mt-6 max-w-[20ch] text-d2 text-paper"
              />
              <Rise delay={0.2}>
                <div className="mt-8 max-w-[62ch] space-y-5 text-body-l text-paper/75">
                  <p>
                    Recruiting ads love a big number with an asterisk. We
                    don&apos;t. On the call, we walk through the actual lanes,
                    the actual miles, and the actual settlement math — before
                    you commit to anything.
                  </p>
                  <p>
                    And the number we agree on is the number that shows up.
                    Pay inconsistency is the top reason drivers walk away from
                    carriers; at KUL, a settlement that matches the agreement
                    is a safety policy, not a perk.
                  </p>
                </div>
              </Rise>
            </div>
          </div>
        </div>
      </section>

      {/* 4 · What we run */}
      <section data-ground="paper" className="bg-paper py-band-sm">
        <div className={CONTAINER}>
          <div className={GRID}>
            <div className="col-span-12 lg:col-start-2 lg:col-end-10">
              <Eyebrow>The Work</Eyebrow>
              <LineReveal
                as="h2"
                lines={["Southeast regional", "and OTR."]}
                className="mt-6 max-w-[20ch] text-d2 text-ink"
              />
              <Rise delay={0.2}>
                <p className="mt-8 max-w-[62ch] text-body-l text-graywarm-deep">
                  Full truckload out of the Loganville, Georgia base — regional
                  lanes across Georgia, Alabama, Tennessee, the Carolinas, and
                  Florida, plus OTR when the freight calls for it. CDL-A with
                  a clean MVR, and participation in the FMCSA drug and
                  alcohol program. Experience matters, but the standard we
                  hire for is judgment.
                </p>
              </Rise>
            </div>
          </div>
        </div>
      </section>

      {/* 5 · Apply — 30-second, mobile-first, speed-to-lead promise. */}
      <section
        id="apply"
        data-ground="paper"
        className="scroll-mt-24 bg-paper py-band-sm"
      >
        <div className={CONTAINER}>
          <div className={`${GRID} gap-y-12`}>
            <div className="col-span-12 lg:col-start-2 lg:col-end-7">
              <Eyebrow>Start the Conversation</Eyebrow>
              <LineReveal
                as="h2"
                lines={["Thirty seconds.", "Then we call you."]}
                className="mt-6 max-w-[18ch] text-d2 text-ink"
              />
              <Rise delay={0.15}>
                <p className="mt-8 max-w-[52ch] text-body text-graywarm-deep">
                  Name, contact, experience — that&apos;s the whole form. A
                  person calls you back within one business day to talk lanes,
                  home time, and equipment. Prefer to skip the form? Call{" "}
                  <a
                    href={site.phoneHref}
                    className="link-hairline font-medium text-ink"
                  >
                    {site.phone}
                  </a>{" "}
                  and ask for dispatch.
                </p>
              </Rise>
            </div>
            <div className="col-span-12 lg:col-start-7 lg:col-end-12">
              <DriverForm />
            </div>
          </div>
        </div>
      </section>

      {/* 6 · Ending — the phone number as the design object. */}
      <CtaBand variant="call" />
    </>
  );
}
