import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import HashScroll from "@/components/concept/HashScroll";
import { services } from "@/lib/services";

export const metadata: Metadata = { title: "Services" };

/**
 * Full service content inline, one anchored block per line, so every
 * service is deep-linkable: /concept/services#reefer etc.
 */
export default function ConceptServices() {
  return (
    <>
      <HashScroll />
      <section className="relative flex min-h-[70svh] items-end overflow-hidden">
        <Image
          src="/images/stock/hero-semi-truck-dusk-mountains.jpg"
          alt="A tractor-trailer crossing a mountain road at dusk"
          fill
          priority
          quality={82}
          sizes="100vw"
          className="object-cover object-[center_60%]"
        />
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(22,22,22,0.5),transparent_45%,rgba(22,22,22,0.92))]" />
        <Reveal className="relative mx-auto w-full max-w-6xl px-6 pb-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
            Services
          </p>
          <h1 className="kul-grad-text mt-4 max-w-2xl font-omnibus text-[clamp(2.2rem,4.5vw,3.4rem)] leading-tight">
            Seven ways to move. One standard.
          </h1>
        </Reveal>
      </section>

      <section className="bg-ink2">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          {/* Anchor index for deep links */}
          <Reveal>
            <nav aria-label="Service index" className="flex flex-wrap gap-x-6 gap-y-3">
              {services.map((s) => (
                <a
                  key={s.slug}
                  href={`#${s.slug}`}
                  className="text-[11px] font-semibold uppercase tracking-[0.25em] text-graywarm transition-colors hover:text-gold"
                >
                  {s.name}
                </a>
              ))}
            </nav>
          </Reveal>

          <div className="mt-12 space-y-16">
            {services.map((s, i) => (
              <Reveal key={s.slug}>
                <article
                  id={s.slug}
                  className="scroll-mt-28 border-t border-white/10 pt-10"
                >
                  <div className="grid gap-8 md:grid-cols-[80px_1fr] md:gap-10">
                    <span className="font-mont text-sm font-semibold tracking-[0.2em] text-gold">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h2 className="kul-grad-text font-omnibus text-[clamp(1.6rem,2.4vw,2.1rem)] leading-tight">
                        {s.name}
                      </h2>
                      <p className="mt-2 font-mont text-[11px] font-semibold uppercase tracking-[0.25em] text-graywarm">
                        {s.tagline}
                      </p>
                      <p className="mt-5 max-w-2xl leading-relaxed text-graywarm-light">
                        {s.description}
                      </p>
                      <div className="mt-8 grid gap-10 md:grid-cols-2">
                        <div>
                          <h3 className="font-mont text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">
                            Best for
                          </h3>
                          <ul className="mt-4 space-y-2.5">
                            {s.bestFor.map((item) => (
                              <li key={item} className="flex gap-3 text-sm leading-relaxed text-graywarm-light">
                                <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rotate-45 bg-gold" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h3 className="font-mont text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">
                            Our commitments
                          </h3>
                          <ul className="mt-4 space-y-2.5">
                            {s.commitments.map((item) => (
                              <li key={item} className="flex gap-3 text-sm leading-relaxed text-graywarm-light">
                                <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rotate-45 bg-gold" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-20 text-center">
            <Link
              href="/concept/quote"
              className="inline-flex items-center rounded-[100px] bg-gold px-8 py-3 text-xs font-semibold uppercase tracking-[3px] text-[#F8F8F8] transition-colors hover:bg-gold-soft hover:text-ink"
            >
              Request a Freight Quote
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
