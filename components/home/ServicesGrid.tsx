import Link from "next/link";
import { services } from "@/lib/services";
import ServiceIcon from "@/components/ServiceIcon";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

/**
 * 7 services on light editorial ground, the first breath of white after the
 * cinematic hero.
 */
export default function ServicesGrid() {
  return (
    <section className="section-light">
      <div className="mx-auto max-w-content px-6 py-24 md:py-32">
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="gold-rule" />
            <span className="eyebrow text-gold-dim">What we move</span>
          </div>
          <h2 className="mt-5 max-w-2xl font-display text-display-l font-bold">
            Seven services. One standard.
          </h2>
          <p className="mt-4 max-w-xl text-graywarm-deep">
            Your trailer on our power, cold chain protected, dedicated lanes,
            coast to coast. Whatever you move, it moves with the same care.
          </p>
        </Reveal>

        <RevealGroup className="mt-14 grid grid-cols-1 gap-px border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <RevealItem key={s.slug} className="bg-paper">
              <Link
                href={`/concept/services/${s.slug}`}
                className="group flex h-full flex-col p-7 transition-colors duration-300 hover:bg-white"
              >
                <ServiceIcon
                  slug={s.slug}
                  className="h-10 w-10 text-ink transition-colors duration-300 group-hover:text-gold-dim"
                />
                <h3 className="mt-5 font-display text-lg font-bold">
                  {s.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-graywarm-deep">
                  {s.short}
                </p>
                <span className="mt-auto pt-5 text-xs font-semibold uppercase tracking-eyebrow text-ink/60 transition-colors duration-300 group-hover:text-ink">
                  Learn more{" "}
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
          {/* 8th cell: quote CTA completes the grid */}
          <RevealItem className="bg-ink">
            <Link
              href="/concept/quote"
              className="group flex h-full flex-col justify-between p-7"
            >
              <div>
                <h3 className="font-display text-lg font-bold text-white">
                  Have freight ready?
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-graywarm">
                  Tell us the lane. You get a number and a plan the same
                  business day.
                </p>
              </div>
              <span className="pt-5 text-xs font-semibold uppercase tracking-eyebrow text-gold">
                Request a Quote{" "}
                <span
                  aria-hidden
                  className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </span>
            </Link>
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  );
}
