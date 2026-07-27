import type { Metadata } from "next";
import ContactForm from "@/components/forms/ContactForm";
import CopyButton from "@/components/v3/CopyButton";
import Eyebrow from "@/components/v3/Eyebrow";
import LineReveal from "@/components/v3/LineReveal";
import PageHero from "@/components/v3/PageHero";
import Rise from "@/components/v3/Rise";
import { site } from "@/lib/site";

/**
 * CONTACT — a person, not a ticket queue. NAP block matches the site,
 * schema, and FMCSA records exactly (consistency IS the trust signal —
 * 17-v3-research §1). Map embed deferred to the Google Business Profile
 * at launch; the directory card links out to Maps instead of shipping a
 * third-party iframe.
 */

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach KUL Enterprises dispatch 24/7 at 678-972-1148 or dispatch@kulenterprises.com. Based in Loganville, Georgia — Southeast based, nationwide service.",
};

const CONTAINER = "mx-auto w-full max-w-[1760px] px-[clamp(20px,5vw,90px)]";
const GRID = "grid grid-cols-1 gap-x-[clamp(16px,1.4vw,24px)] lg:grid-cols-12";

const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${site.city}, ${site.state}`,
)}`;

export default function ContactPage() {
  return (
    <>
      {/* 1 · Opener — compact ink band. Gold: none (nav CTA goes ghost). */}
      <PageHero
        variant="compact"
        eyebrow="Contact"
        titleLines={["Talk to a person."]}
        deck="Dispatch answers 24/7 on active loads. Everything else gets a reply the same business day."
      />

      {/* 2 · Directory + form */}
      <section data-ground="paper" className="bg-paper py-band-sm">
        <div className={CONTAINER}>
          <div className={`${GRID} gap-y-14`}>
            {/* Directory card */}
            <div className="lg:col-start-2 lg:col-end-6">
              <Rise>
                <dl className="border border-ink/15 bg-white p-7">
                  <div className="border-b border-ink/10 pb-5">
                    <dt className="text-micro uppercase text-ink/50">
                      Dispatch — 24/7
                    </dt>
                    <dd className="mt-2 flex items-center gap-2">
                      <a
                        href={site.phoneHref}
                        className="link-hairline text-h3 font-semibold tabular-nums text-ink"
                      >
                        {site.phone}
                      </a>
                    </dd>
                  </div>
                  <div className="border-b border-ink/10 py-5">
                    <dt className="text-micro uppercase text-ink/50">Email</dt>
                    <dd className="mt-2 flex items-center gap-2">
                      <a
                        href={`mailto:${site.email}`}
                        className="link-hairline break-all text-[15px] font-medium text-ink"
                      >
                        {site.email}
                      </a>
                      <CopyButton value={site.email} />
                    </dd>
                  </div>
                  <div className="py-5">
                    <dt className="text-micro uppercase text-ink/50">
                      Home Base
                    </dt>
                    <dd className="mt-2 text-[15px] font-medium text-ink">
                      {site.location}
                    </dd>
                    <dd className="mt-1 text-sm text-graywarm-deep">
                      {site.serviceArea}
                    </dd>
                    <dd className="mt-3">
                      <a
                        href={mapsHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-hairline text-micro uppercase text-ink/70"
                      >
                        Open in Google Maps ↗
                      </a>
                    </dd>
                  </div>
                  <div className="border-t border-ink/10 pt-5">
                    <dt className="sr-only">Credentials</dt>
                    <dd className="text-micro uppercase tabular-nums text-ink/50">
                      USDOT {site.usdot} · MC {site.mc}
                    </dd>
                    <dd className="mt-2 text-sm text-graywarm-deep">
                      Same name, address, and phone everywhere you check us —
                      here, FMCSA SAFER, and your carrier packet.
                    </dd>
                  </div>
                </dl>
              </Rise>
            </div>

            {/* Form */}
            <div className="lg:col-start-7 lg:col-end-12">
              <Eyebrow>Send a Message</Eyebrow>
              <LineReveal
                as="h2"
                lines={["We read every word."]}
                className="mt-6 max-w-[18ch] text-d2 text-ink"
              />
              <div className="mt-10">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
