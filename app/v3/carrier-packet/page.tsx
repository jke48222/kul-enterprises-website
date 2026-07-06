import type { Metadata } from "next";
import { CtaBand } from "@/components/v3/CtaBand";
import CopyButton from "@/components/v3/CopyButton";
import Eyebrow from "@/components/v3/Eyebrow";
import LineReveal from "@/components/v3/LineReveal";
import PageHero from "@/components/v3/PageHero";
import { Rise, RiseGroup } from "@/components/v3/Rise";
import { StatBlock, type Fact } from "@/components/v3/StatBlock";
import { site } from "@/lib/site";

/**
 * CARRIER PACKET — the broker onboarding page. The packet is
 * request-based (one email, same business day) rather than fake download
 * links: no document is listed that doesn't exist (honesty doctrine §10).
 * When Mark supplies the PDFs, this page gains direct downloads via the
 * CMS.
 */

export const metadata: Metadata = {
  title: "Carrier Packet",
  description:
    "Broker setup in one email: authority letter, W-9, certificate of insurance with your company as holder, and signed agreements — returned the same business day. USDOT 7638788 · MC 66389691.",
};

const CONTAINER = "mx-auto w-full max-w-[1760px] px-[clamp(20px,5vw,90px)]";
const GRID = "grid grid-cols-12 gap-x-[clamp(16px,1.4vw,24px)]";

const credentials: Fact[] = [
  { label: "USDOT", value: site.usdot, href: "https://safer.fmcsa.dot.gov/" },
  { label: "MC", value: site.mc },
  { label: "W-9 & COI", value: "On request" },
  { label: "Turnaround", value: "Same business day" },
];

const CONTENTS = [
  {
    title: "Operating authority",
    body: "MC authority letter and USDOT registration — cross-check both on FMCSA SAFER before you sign anything.",
  },
  {
    title: "Certificate of insurance",
    body: "Auto liability and cargo coverage, issued with your company listed as certificate holder.",
  },
  {
    title: "W-9 and agreements",
    body: "Completed W-9 and your carrier agreement, signed and returned with the packet.",
  },
] as const;

const STEPS = [
  {
    title: "Send one email",
    body: "Your company name and MC or USDOT number to dispatch — that's all we need to start.",
  },
  {
    title: "Packet returns same day",
    body: "Authority, COI, W-9, and agreements come back the same business day, signed.",
  },
  {
    title: "First load moves",
    body: "Setup confirmed, lane priced, freight rolling — usually inside the same week.",
  },
] as const;

export default function CarrierPacketPage() {
  return (
    <>
      {/* 1 · Opener */}
      <PageHero
        variant="compact"
        eyebrow="For Brokers & Shippers"
        titleLines={["The packet,", "one email away."]}
        deck="Everything your compliance team needs to onboard KUL — returned the same business day, with nothing to chase."
      />

      {/* 2 · The request — the conversion moment. */}
      <section data-ground="paper" className="bg-paper py-band-sm">
        <div className={CONTAINER}>
          <div className={`${GRID} gap-y-12`}>
            <div className="col-span-12 lg:col-start-2 lg:col-end-8">
              <Eyebrow gold>Request It</Eyebrow>
              <LineReveal
                as="h2"
                lines={["Email dispatch.", "It's back today."]}
                className="mt-6 max-w-[18ch] text-d2 text-ink"
              />
              <Rise delay={0.2}>
                <p className="mt-8 max-w-[58ch] text-body-l text-graywarm-deep">
                  Send your company name and MC or USDOT number, and the full
                  packet comes back the same business day. Prefer the phone?
                  Dispatch answers at{" "}
                  <a
                    href={site.phoneHref}
                    className="link-hairline font-medium text-ink"
                  >
                    {site.phone}
                  </a>
                  .
                </p>
              </Rise>
              <Rise delay={0.3}>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <a
                    href={`mailto:${site.email}?subject=${encodeURIComponent(
                      "Carrier packet request — [your company name]",
                    )}`}
                    className="btn-gold"
                  >
                    Request the Packet
                  </a>
                  <span className="inline-flex items-center gap-1 text-[15px] text-graywarm-deep">
                    {site.email}
                    <CopyButton value={site.email} />
                  </span>
                </div>
              </Rise>
            </div>

            {/* Steps card */}
            <div className="col-span-12 lg:col-start-9 lg:col-end-12">
              <RiseGroup className="grid grid-cols-1">
                {STEPS.map((s, i) => (
                  <Rise key={s.title}>
                    <div className="border-t border-ink/15 py-5 last:pb-0">
                      <p className="text-micro uppercase tabular-nums text-ink/40">
                        {String(i + 1).padStart(2, "0")}
                      </p>
                      <h3 className="mt-1 text-[17px] font-semibold text-ink">
                        {s.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-graywarm-deep">
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

      {/* 3 · What's inside */}
      <section data-ground="paper" className="bg-paper py-band-sm">
        <div className={CONTAINER}>
          <div className={GRID}>
            <div className="col-span-12 lg:col-start-2 lg:col-end-12">
              <Eyebrow>Inside the Packet</Eyebrow>
              <LineReveal
                as="h2"
                lines={["What your compliance", "team will find."]}
                className="mt-6 max-w-[22ch] text-d2 text-ink"
              />
              <RiseGroup className="mt-12 grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3">
                {CONTENTS.map((c, i) => (
                  <Rise key={c.title}>
                    <div className="border-t border-ink/15 pt-5">
                      <p className="text-micro uppercase tabular-nums text-ink/40">
                        {String(i + 1).padStart(2, "0")}
                      </p>
                      <h3 className="mt-2 text-t1 text-ink">{c.title}</h3>
                      <p className="mt-3 max-w-[38ch] text-body text-graywarm-deep">
                        {c.body}
                      </p>
                    </div>
                  </Rise>
                ))}
              </RiseGroup>
              <div className="mt-14">
                <StatBlock facts={credentials} ground="paper" columns={4} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 · Ending — the verify invitation. */}
      <CtaBand variant="verify" />
    </>
  );
}
