import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import ServiceIcon from "@/components/ServiceIcon";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { services } from "@/lib/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Power Only, Dry Van, Reefer, Dedicated, Regional, Expedited, and Over-the-Road freight service from KUL Enterprises. Southeast based, nationwide.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="One carrier. Seven ways to move."
        lede="Every service line runs on the same three commitments: safety first, honest communication, and a delivery that lands when we said it would."
        image="/images/stock/hero-semi-truck-dusk-mountains.jpg"
        imagePosition="center 60%"
      />

      <div className="section-light">
        <div className="mx-auto max-w-content px-6 py-20 md:py-28">
          <RevealGroup className="space-y-px border border-ink/10 bg-ink/10">
            {services.map((s) => (
              <RevealItem key={s.slug} className="bg-paper">
                <Link
                  href={`/concept/services/${s.slug}`}
                  className="group grid gap-6 p-8 transition-colors duration-300 hover:bg-white md:grid-cols-[auto_1fr_auto] md:items-center md:gap-10"
                >
                  <ServiceIcon
                    slug={s.slug}
                    className="h-12 w-12 text-ink transition-colors duration-300 group-hover:text-gold-dim"
                  />
                  <span>
                    <span className="block font-display text-xl font-bold">
                      {s.name}
                    </span>
                    <span className="mt-1.5 block max-w-2xl text-graywarm-deep">
                      {s.short}
                    </span>
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-eyebrow text-ink/60 transition-colors group-hover:text-ink">
                    Details{" "}
                    <span
                      aria-hidden
                      className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </span>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal className="mt-16 text-center">
            <p className="text-graywarm-deep">
              Not sure which service fits your freight?
            </p>
            <Link href="/concept/quote" className="btn-ghost-light mt-5">
              Describe the load and we&apos;ll advise
            </Link>
          </Reveal>
        </div>
      </div>
    </>
  );
}
