import type { Metadata } from "next";
import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { site } from "@/lib/site";
import PageClosing from "@/components/concept/PageClosing";

export const metadata: Metadata = {
  title: "Carrier Packet",
  description:
    "Set KUL Enterprises up as a carrier in one email: authority, COI, W-9, profile, and references back the same business day.",
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

export default function ConceptCarrierPacket() {
  return (
    <>
      <section className="relative min-h-[60svh] overflow-hidden">
        <Image
          src="/images/photos/tree-open-landscape.jpg"
          alt="A wide oak tree standing over open green land"
          fill
          priority
          quality={82}
          sizes="100vw"
          className="object-cover"
        />
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(22,22,22,0.5),transparent_45%,rgba(22,22,22,0.92))]" />
        <div className="kul-fade-slow relative px-6 pt-[15vh] text-center">
          <h1 className="kul-grad-text font-mont text-[clamp(1.35rem,2.3vw,2.05rem)] font-semibold uppercase tracking-[0.3em] [text-shadow:none]">
            Carrier Packet
          </h1>
        </div>
      </section>

      <section className="bg-ink2">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <div className="grid gap-14 lg:grid-cols-[1fr_380px]">
            <div>
              <Reveal>
                <h2 className="kul-grad-text font-omnibus text-[clamp(1.6rem,2.6vw,2.2rem)] leading-tight">
                  Five documents. Zero chasing.
                </h2>
              </Reveal>
              <div className="mt-8 space-y-px overflow-hidden rounded-2xl border border-white/10 bg-white/10">
                {documents.map((d) => (
                  <Reveal key={d.name} className="bg-ink2 p-7">
                    <h3 className="font-omnibus text-lg text-cream">{d.name}</h3>
                    <p className="mt-2 leading-relaxed text-graywarm-light">
                      {d.body}
                    </p>
                  </Reveal>
                ))}
              </div>
            </div>

            <Reveal>
              <div className="sticky top-28 rounded-2xl border border-white/10 bg-white/[0.03] p-8">
                <h3 className="font-omnibus text-xl text-cream">
                  Request the packet
                </h3>
                <p className="mt-3 leading-relaxed text-graywarm-light">
                  Email dispatch with your company name and MC or USDOT number
                  if applicable. The full packet comes back the same business
                  day.
                </p>
                <a
                  href={`mailto:${site.email}?subject=Carrier%20Packet%20Request`}
                  className="mt-6 inline-flex w-full items-center justify-center rounded-[100px] bg-gold px-6 py-3 text-xs font-bold uppercase tracking-[3px] text-ink transition-colors hover:bg-gold-soft"
                >
                  Email Dispatch
                </a>
                <p className="mt-5 text-sm text-graywarm-light">
                  Prefer the phone? Call{" "}
                  <a href={site.phoneHref} className="font-semibold text-cream underline-offset-4 hover:underline">
                    {site.phone}
                  </a>
                  . A person answers.
                </p>
                <p className="mt-6 border-t border-white/10 pt-5 text-[11px] uppercase tracking-[0.25em] text-graywarm">
                  USDOT {site.usdot} · MC {site.mc}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <PageClosing />
    </>
  );
}
