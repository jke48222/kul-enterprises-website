import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Carrier Packet & Documents",
  description:
    "Everything brokers and shippers need to set up KUL Enterprises as a carrier: operating authority, insurance certificate, W-9, and references, delivered the same business day.",
};

const documents = [
  {
    name: "Operating Authority (MC Certificate)",
    body: `Our FMCSA-issued certificate of authority, MC ${site.mc}, confirming KUL Enterprises LLC is authorized for interstate for-hire transport.`,
  },
  {
    name: "Certificate of Insurance",
    body: "Current COI showing auto liability and cargo coverage, issued directly from our insurer, with your company listed as certificate holder on request.",
  },
  {
    name: "Form W-9",
    body: "Completed and signed IRS W-9 for KUL Enterprises LLC, ready for your accounting setup.",
  },
  {
    name: "Carrier Profile & References",
    body: "Company profile with equipment list, service areas, lane preferences, and broker and shipper references you can actually call.",
  },
  {
    name: "Signed Agreements",
    body: "Your broker-carrier or shipper agreement, reviewed and returned promptly. We read what we sign and we sign what we honor.",
  },
];

export default function CarrierPacketPage() {
  return (
    <>
      <PageHero
        eyebrow="Carrier Packet"
        title="Set us up in one email."
        lede="Brokers and shippers: the complete KUL carrier packet is one request away, delivered the same business day."
      />

      <div className="section-light">
        <div className="mx-auto max-w-content px-6 py-20 md:py-28">
          <div className="grid gap-16 lg:grid-cols-[1fr_400px]">
            <div>
              <Reveal>
                <div className="flex items-center gap-4">
                  <span className="gold-rule" />
                  <span className="eyebrow text-gold-dim">What&apos;s inside</span>
                </div>
                <h2 className="mt-5 font-display text-h2 font-bold">
                  Five documents. Zero chasing.
                </h2>
              </Reveal>
              <RevealGroup className="mt-10 space-y-px border border-ink/10 bg-ink/10">
                {documents.map((d) => (
                  <RevealItem key={d.name} className="bg-paper p-7">
                    <h3 className="font-display text-lg font-bold">{d.name}</h3>
                    <p className="mt-2 leading-relaxed text-graywarm-deep">
                      {d.body}
                    </p>
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>

            <Reveal>
              <div className="sticky top-32 border border-ink/10 bg-white p-8">
                <h3 className="font-display text-xl font-bold">
                  Request the packet
                </h3>
                <p className="mt-3 leading-relaxed text-graywarm-deep">
                  Email dispatch with your company name and MC or USDOT number
                  if applicable. The full packet comes back the same business
                  day.
                </p>
                <a
                  href={`mailto:${site.email}?subject=Carrier%20Packet%20Request`}
                  className="btn-gold mt-6 w-full"
                >
                  Email {site.email}
                </a>
                <p className="mt-5 text-sm text-graywarm-deep">
                  Prefer the phone? Call{" "}
                  <a
                    href={site.phoneHref}
                    className="font-semibold text-ink underline-offset-4 hover:underline"
                  >
                    {site.phone}
                  </a>
                  . A person answers.
                </p>
                <div className="mt-6 border-t border-ink/10 pt-5 text-xs uppercase tracking-eyebrow text-graywarm-deep">
                  USDOT {site.usdot} · MC {site.mc}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </>
  );
}
