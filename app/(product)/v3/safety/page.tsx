import type { Metadata } from "next";
import { CtaBand } from "@/components/v3/CtaBand";
import { Eyebrow } from "@/components/v3/Eyebrow";
import { LineReveal } from "@/components/v3/LineReveal";
import { PageHero } from "@/components/v3/PageHero";
import { Rise, RiseGroup } from "@/components/v3/Rise";
import { StatBlock, type Fact } from "@/components/v3/StatBlock";
import { site } from "@/lib/site";

/**
 * SAFETY & COMPLIANCE — the trust hub, designed as a flagship (plan §9:
 * Volvo treats safety as heritage, not a formality). Verifiable facts,
 * the honest new-authority section (17-v3-research §1 — differentiate
 * from the chameleon-carrier profile by INVITING scrutiny), and the
 * commitments that are actually kept. No invented numbers anywhere.
 */

export const metadata: Metadata = {
  title: "Safety & Compliance",
  description:
    "USDOT 7638788 · MC 66389691. Licensed and insured, verifiable on FMCSA SAFER. Pre-trip inspections, legal hours, maintenance-first equipment, and weather calls made early.",
};

const CONTAINER = "mx-auto w-full max-w-[1760px] px-[clamp(20px,5vw,90px)]";
const GRID = "grid grid-cols-12 gap-x-[clamp(16px,1.4vw,24px)]";

const credentials: Fact[] = [
  {
    label: "USDOT",
    value: site.usdot,
    href: "https://safer.fmcsa.dot.gov/",
  },
  { label: "MC", value: site.mc },
  { label: "Auto Liability", value: "Covered" },
  { label: "Cargo Insurance", value: "Covered" },
];

const COMMITMENTS = [
  {
    title: "Pre-trip, every trip",
    body: "Full inspection before every dispatch — brakes, tires, lights, load securement. No exceptions for schedule pressure.",
  },
  {
    title: "Legal hours, period",
    body: "Hours-of-service compliance is non-negotiable. A late load is recoverable; a tired driver is not.",
  },
  {
    title: "Maintenance before miles",
    body: "Equipment is maintained on schedule, not on symptoms. Problems get fixed before they ride along.",
  },
  {
    title: "Weather calls made early",
    body: "When conditions turn, we decide early and on the side of caution — and you hear about it immediately.",
  },
  {
    title: "Secured and sealed",
    body: "Load bars, straps, and seals on every load that needs them, documented at pickup and delivery.",
  },
  {
    title: "A person answers",
    body: "24/7 dispatch means a human on the line — during the load, not just before it.",
  },
] as const;

export default function SafetyPage() {
  return (
    <>
      {/* 1 · Hero — the desert photo: strength, foundation, stability
             (Blueprint image-5 mapping). */}
      <PageHero
        variant="photo"
        height="80"
        eyebrow="Safety & Compliance"
        titleLines={["Driven by safety.", "Verifiable by anyone."]}
        deck="Safety isn't a page on this website. It's the operating discipline behind every mile — and every claim on this page can be checked."
        image={{
          src: "/images/photos/desert-rock-formation.jpg",
          alt: "Sculpted rock formations standing over quiet sand at dusk",
        }}
      />

      {/* 2 · Credentials — the paperwork, front and center. */}
      <section data-ground="paper" className="bg-paper py-band-sm">
        <div className={CONTAINER}>
          <div className={GRID}>
            <div className="col-span-12 lg:col-start-2 lg:col-end-12">
              <Eyebrow gold>Authority &amp; Insurance</Eyebrow>
              <LineReveal
                as="h2"
                lines={["The paperwork,", "in plain sight."]}
                className="mt-6 max-w-[20ch] text-d2 text-ink"
              />
              <Rise delay={0.15}>
                <p className="mt-8 max-w-[62ch] text-body text-graywarm-deep">
                  Full federal operating authority, auto liability, and cargo
                  coverage. Brokers: request a certificate of insurance with
                  your company listed as holder — it comes back the same
                  business day with the carrier packet.
                </p>
              </Rise>
              <div className="mt-14">
                <StatBlock facts={credentials} ground="paper" columns={4} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 · New authority, open book — the honest differentiator. */}
      <section data-ground="paper" className="bg-paper py-band-sm">
        <div className={CONTAINER}>
          <div className={GRID}>
            <div className="col-span-12 lg:col-start-2 lg:col-end-10">
              <Eyebrow>Open Book</Eyebrow>
              <LineReveal
                as="h2"
                lines={["New authority.", "Nothing to hide."]}
                className="mt-6 max-w-[20ch] text-d2 text-ink"
              />
              <Rise delay={0.2}>
                <div className="mt-8 max-w-[62ch] space-y-5 text-body-l text-graywarm-deep">
                  <p>
                    KUL runs under recent operating authority, and we&apos;d
                    rather you verify that than take our word for it. Look up
                    USDOT {site.usdot} on the FMCSA SAFER system, check the
                    insurance on file, and call the number listed there — it
                    rings the same dispatch line as this website.
                  </p>
                  <p>
                    Same name, same address, same phone, everywhere you check.
                    That consistency is the point: trust you can confirm in
                    five minutes, not trust we ask you to assume.
                  </p>
                </div>
              </Rise>
              <Rise delay={0.3}>
                <p className="mt-10">
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

      {/* 4 · The commitments — what the discipline looks like. */}
      <section data-ground="ink" className="bg-ink py-band">
        <div className={CONTAINER}>
          <div className={GRID}>
            <div className="col-span-12 lg:col-start-2 lg:col-end-12">
              <Eyebrow>The Discipline</Eyebrow>
              <LineReveal
                as="h2"
                lines={["Not up for", "negotiation."]}
                className="mt-6 max-w-[18ch] text-d2 text-paper"
              />
              <RiseGroup className="mt-12 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                {COMMITMENTS.map((c, i) => (
                  <Rise key={c.title}>
                    <div className="border-t border-white/[0.14] pt-5">
                      <p className="text-micro uppercase tabular-nums text-paper/40">
                        {String(i + 1).padStart(2, "0")}
                      </p>
                      <h3 className="mt-2 text-t1 text-paper">{c.title}</h3>
                      <p className="mt-3 max-w-[38ch] text-body text-paper/70">
                        {c.body}
                      </p>
                    </div>
                  </Rise>
                ))}
              </RiseGroup>
            </div>
          </div>
        </div>
      </section>

      {/* 5 · The driver standard — paper, human. */}
      <section data-ground="paper" className="bg-paper py-band-sm">
        <div className={CONTAINER}>
          <div className={GRID}>
            <div className="col-span-12 lg:col-start-2 lg:col-end-10">
              <Eyebrow>The Standard Behind the Wheel</Eyebrow>
              <LineReveal
                as="h2"
                lines={["The most important delivery", "is the driver, home."]}
                className="mt-6 max-w-[24ch] text-d2 text-ink"
              />
              <Rise delay={0.2}>
                <p className="mt-8 max-w-[62ch] text-body-l text-graywarm-deep">
                  Every KUL driver holds a CDL-A, clears a full motor-vehicle
                  record review, and participates in the FMCSA drug and
                  alcohol program. Schedules are built so the legal hours and
                  the promised delivery agree with each other — that&apos;s
                  the dispatcher&apos;s job, not the driver&apos;s burden.
                </p>
              </Rise>
            </div>
          </div>
        </div>
      </section>

      {/* 6 · Ending — the verify invitation. */}
      <CtaBand variant="verify" />
    </>
  );
}
