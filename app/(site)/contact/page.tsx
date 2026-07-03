import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import ContactForm from "@/components/forms/ContactForm";
import { site } from "@/lib/site";
import PageClosing from "@/components/concept/PageClosing";

export const metadata: Metadata = { title: "Contact" };

export default function ConceptContact() {
  return (
    <>
      <section className="relative min-h-[60svh] overflow-hidden">
        <Image
          src="/images/photos/river-through-forest.jpg"
          alt="A calm turquoise river winding through dense green forest"
          fill
          priority
          quality={82}
          sizes="100vw"
          className="object-cover"
        />
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(22,22,22,0.5),transparent_45%,rgba(22,22,22,0.92))]" />
        <div className="kul-fade-slow relative px-6 pt-[15vh] text-center">
          <h1 className="kul-grad-text font-mont text-[clamp(1.35rem,2.3vw,2.05rem)] font-semibold uppercase tracking-[0.3em] [text-shadow:none]">
            Contact
          </h1>
        </div>
      </section>

      <section className="bg-[#F8F8F8]">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <div className="grid gap-16 lg:grid-cols-[380px_1fr]">
            <Reveal>
              <dl className="space-y-8">
                <div>
                  <dt className="font-mont text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-dim">
                    Dispatch, 24/7
                  </dt>
                  <dd className="mt-2">
                    <a href={site.phoneHref} className="font-omnibus text-2xl text-ink underline-offset-4 hover:underline">
                      {site.phone}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-mont text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-dim">
                    Email
                  </dt>
                  <dd className="mt-2">
                    <a href={`mailto:${site.email}`} className="text-lg font-semibold text-ink underline-offset-4 hover:underline">
                      {site.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-mont text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-dim">
                    Home base
                  </dt>
                  <dd className="mt-2 text-lg text-graywarm-deep">
                    {site.location}
                    <span className="mt-1 block text-sm">{site.serviceArea}</span>
                  </dd>
                </div>
                <div>
                  <dt className="font-mont text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-dim">
                    Credentials
                  </dt>
                  <dd className="mt-2 text-sm text-graywarm-deep">
                    USDOT {site.usdot} · MC {site.mc}
                    <span className="mt-1 block">
                      Licensed &amp; Insured ·{" "}
                      <Link href="/safety" className="font-semibold text-ink underline underline-offset-4 hover:text-gold-dim">
                        Safety &amp; Compliance
                      </Link>
                    </span>
                  </dd>
                </div>
              </dl>
            </Reveal>

            <Reveal>
              <div className="rounded-2xl border border-ink/10 bg-white p-8 md:p-10">
                <h2 className="font-omnibus text-xl text-ink">Send a message</h2>
                <p className="mb-8 mt-2 text-sm text-graywarm-deep">
                  Freight quotes have a{" "}
                  <Link href="/quote" className="font-semibold text-ink underline underline-offset-4 hover:text-gold-dim">
                    faster lane here
                  </Link>
                  . For everything else:
                </p>
                <ContactForm />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <PageClosing />
    </>
  );
}
