import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import ContactForm from "@/components/forms/ContactForm";
import { Reveal } from "@/components/motion/Reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Reach KUL Enterprises dispatch 24/7 at ${site.phone} or ${site.email}. Based in Loganville, GA, serving the Southeast and the nation.`,
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="A person answers. That's the policy."
        lede="Shipper, broker, driver, or neighbor. Here is how to reach us, day or night."
      />

      <div className="section-light">
        <div className="mx-auto max-w-content px-6 py-20 md:py-28">
          <div className="grid gap-16 lg:grid-cols-[400px_1fr]">
            <Reveal>
              <dl className="space-y-8">
                <div>
                  <dt className="eyebrow text-gold-dim">Dispatch, 24/7</dt>
                  <dd className="mt-2">
                    <a
                      href={site.phoneHref}
                      className="font-display text-2xl font-bold text-ink underline-offset-4 hover:underline"
                    >
                      {site.phone}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow text-gold-dim">Email</dt>
                  <dd className="mt-2">
                    <a
                      href={`mailto:${site.email}`}
                      className="text-lg font-semibold text-ink underline-offset-4 hover:underline"
                    >
                      {site.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow text-gold-dim">Home base</dt>
                  <dd className="mt-2 text-lg text-graywarm-deep">
                    {site.location}
                    <span className="mt-1 block text-sm">
                      {site.serviceArea}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow text-gold-dim">Credentials</dt>
                  <dd className="mt-2 text-sm text-graywarm-deep">
                    USDOT {site.usdot} · MC {site.mc}
                    <span className="mt-1 block">
                      Licensed &amp; Insured ·{" "}
                      <Link
                        href="/safety"
                        className="font-semibold text-ink underline underline-offset-4 hover:text-gold-dim"
                      >
                        Safety &amp; Compliance
                      </Link>
                    </span>
                  </dd>
                </div>
              </dl>
            </Reveal>

            <Reveal>
              <div className="border border-ink/10 bg-white p-8 md:p-10">
                <h2 className="font-display text-xl font-bold">
                  Send a message
                </h2>
                <p className="mb-8 mt-2 text-sm text-graywarm-deep">
                  Freight quotes have a{" "}
                  <Link
                    href="/quote"
                    className="font-semibold text-ink underline underline-offset-4 hover:text-gold-dim"
                  >
                    faster lane here
                  </Link>
                  . For everything else:
                </p>
                <ContactForm />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </>
  );
}
