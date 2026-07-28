import type { Metadata } from "next";
import Link from "next/link";
import { CopyButton } from "@/components/v2/CopyButton";
import { LineReveal } from "@/components/v2/LineReveal";
import { PageHero } from "@/components/v2/PageHero";
import { Rise, RiseGroup } from "@/components/v2/Rise";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Carrier Packet",
  description:
    "Set KUL Enterprises up as a carrier in one email: authority, COI, W-9, references, and signed agreements back the same business day.",
};

const CONTAINER = "mx-auto w-full max-w-[1760px] px-[clamp(20px,5vw,90px)]";

/**
 * The packet, itemized (§4.7.2). Five documents, one micro line each —
 * micro copy carried over from the v1 packet page; no new claims.
 */
const DOCUMENTS = [
  {
    index: "01",
    name: "Operating authority",
    line: `MC ${site.mc}, USDOT ${site.usdot}`,
  },
  {
    index: "02",
    name: "Certificate of insurance",
    line: "Your company listed as holder on request",
  },
  {
    index: "03",
    name: "W-9",
    line: "Completed and signed for KUL Enterprises LLC",
  },
  {
    index: "04",
    name: "References",
    line: "Broker and shipper references you can call",
  },
  {
    index: "05",
    name: "Signed carrier agreements",
    line: "Reviewed, signed, and returned promptly",
  },
];

export default function CarrierPacketPage() {
  return (
    <>
      {/* 1 — Hero (§4.7.1). Compact ink band; zero gold. */}
      <PageHero
        variant="compact"
        eyebrow="FOR BROKERS"
        titleLines={["The full packet.", "Same business day."]}
        deck="One email. Authority, COI, W-9, references, and signed agreements come back the same business day."
      />

      {/* 2 — Document ledger + request (§4.7.2). Paper; gold = the mailto CTA only. */}
      <section data-ground="paper" className="bg-paper py-band text-ink">
        <div className={CONTAINER}>
          {/* sr-only h2 so the h3 rows below never precede the page's first h2 (§2.1). */}
          <h2 className="sr-only">The packet, itemized</h2>

          <div className="grid grid-cols-1 gap-x-[clamp(16px,1.4vw,24px)] gap-y-16 lg:grid-cols-12">
            {/* Request card — above the ledger on mobile, sticky right rail on lg. */}
            <div className="lg:col-span-5 lg:col-start-8 lg:row-start-1">
              <div className="lg:sticky lg:top-28">
                <Rise>
                  <div className="border-t border-ink/15 pt-8">
                    <h3 className="font-omnibus text-h3 text-ink">
                      Request the packet.
                    </h3>
                    <p className="mt-4 max-w-[44ch] text-body text-graywarm-deep">
                      Send your company name and MC or USDOT number.
                    </p>
                    <a
                      href={`mailto:${site.email}?subject=Carrier%20packet%20request`}
                      className="btn-gold mt-8"
                    >
                      Email Dispatch
                    </a>
                    <div className="mt-5 flex flex-wrap items-center gap-x-2 text-ink">
                      <span className="text-sm text-graywarm-deep">
                        {site.email}
                      </span>
                      <CopyButton value={site.email} />
                    </div>
                    <p className="mt-4 text-micro uppercase text-graywarm-deep">
                      Or call{" "}
                      <a
                        href={site.phoneHref}
                        className="link-hairline inline-flex min-h-11 items-center tabular-nums text-ink"
                      >
                        {site.phone}
                      </a>
                    </p>
                  </div>
                </Rise>
              </div>
            </div>

            {/* Document ledger — five hairline rows. */}
            <div className="lg:col-span-7 lg:col-start-1 lg:row-start-1">
              <RiseGroup className="border-b border-ink/15">
                {DOCUMENTS.map((doc) => (
                  <Rise
                    key={doc.index}
                    className="grid grid-cols-[3.5rem_1fr] items-baseline gap-x-4 border-t border-ink/15 py-[clamp(20px,3.5vh,36px)]"
                  >
                    <span
                      aria-hidden
                      className="text-micro uppercase tabular-nums text-ink/60"
                    >
                      {doc.index}
                    </span>
                    <div>
                      <h3 className="font-omnibus text-h3 text-ink">
                        {doc.name}
                      </h3>
                      <p className="mt-2 text-micro uppercase tabular-nums text-graywarm-deep">
                        {doc.line}
                      </p>
                    </div>
                  </Rise>
                ))}
              </RiseGroup>
            </div>
          </div>
        </div>
      </section>

      {/* 3 — Lean ending (§4.7.3). Ink; zero gold; no CtaBand needed. */}
      <section data-ground="ink" className="bg-ink py-band text-paper">
        <div className={CONTAINER}>
          <LineReveal
            as="h2"
            lines={["Already set up?"]}
            className="font-omnibus text-h2 text-cream"
          />
          <Rise delay={0.15}>
            <Link
              href="/quote"
              className="link-hairline mt-8 inline-flex min-h-11 items-center gap-3 text-label uppercase text-paper"
            >
              Send the first lane <span aria-hidden>&rarr;</span>
            </Link>
          </Rise>
        </div>
      </section>
    </>
  );
}
