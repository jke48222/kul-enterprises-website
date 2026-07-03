import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import HashScroll from "@/components/concept/HashScroll";
import { services } from "@/lib/services";
import PageClosing from "@/components/concept/PageClosing";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Power Only, Dry Van, Reefer, Dedicated, Regional, Expedited, and Over-the-Road freight. Southeast based with nationwide authority. USDOT 7638788.",
};

/** Placeholder tile imagery, one per service; swap for KUL fleet shots. */
const tileImages: Record<string, { src: string; alt: string }> = {
  "power-only": {
    src: "/images/stock/road-night-light-trails.jpg",
    alt: "Highway light trails at night",
  },
  "dry-van": {
    src: "/images/stock/hero-semi-truck-dusk-mountains.jpg",
    alt: "A tractor-trailer crossing a mountain road at dusk",
  },
  reefer: {
    src: "/images/stock/hero-alt-semi-night-gold-lights.jpg",
    alt: "A semi truck under warm lights at night",
  },
  dedicated: {
    src: "/images/stock/driver-in-cab-gold-truck.jpg",
    alt: "A driver at the wheel of his cab in warm evening light",
  },
  regional: {
    src: "/images/stock/kul-hero-poster.jpg",
    alt: "An aerial view of trucks running a highway",
  },
  expedited: {
    src: "/images/stock/driver-portrait-semi-cab-night.jpg",
    alt: "A professional driver standing at his cab at night",
  },
  otr: {
    src: "/images/photos/desert-rock-formation.jpg",
    alt: "Desert rock formations on a cross-country route",
  },
};

/**
 * Full service content inline, one anchored block per line, so every
 * service is deep-linkable: /services#reefer etc.
 */
export default function ConceptServices() {
  return (
    <>
      <HashScroll />
      <section className="relative min-h-[70svh] overflow-hidden">
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
        <div className="kul-fade-slow relative px-6 pt-[15vh] text-center">
          <h1 className="kul-grad-text font-mont text-[clamp(1.35rem,2.3vw,2.05rem)] font-semibold uppercase tracking-[0.3em] [text-shadow:none]">
            Services
          </h1>
        </div>
      </section>

      <section className="bg-ink2">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          {/* Anchor index: image tiles, two rows of four. Clicking a tile
              scrolls to that service's section below; the eighth tile is
              the quote CTA in the nav button's metallic gold. */}
          <Reveal>
            <nav
              aria-label="Service index"
              className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6"
            >
              {services.map((s) => (
                <a
                  key={s.slug}
                  href={`#${s.slug}`}
                  className="group relative block aspect-square overflow-hidden rounded-2xl"
                >
                  <Image
                    src={tileImages[s.slug].src}
                    alt={tileImages[s.slug].alt}
                    fill
                    quality={78}
                    sizes="(min-width: 768px) 25vw, 50vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.45),rgba(0,0,0,0.3)_50%,rgba(0,0,0,0.55))]"
                  />
                  {/* Same treatment as the section title this tile jumps to */}
                  <span className="kul-grad-text absolute inset-0 flex items-center justify-center px-4 text-center font-omnibus text-[clamp(1.4rem,2vw,1.9rem)] uppercase leading-tight">
                    {s.name}
                  </span>
                </a>
              ))}
              <a
                href="/quote"
                className="kul-gold-metal group flex aspect-square flex-col items-center justify-center gap-3 rounded-2xl p-6 text-center transition-[filter] duration-300 hover:brightness-110"
              >
                <span className="font-omnibus text-[clamp(1.1rem,1.5vw,1.45rem)] uppercase leading-tight text-[#F8F8F8] [text-shadow:0_1px_2px_rgba(0,0,0,0.35)]">
                  Request a<br />
                  Freight Quote
                </span>
                <span
                  aria-hidden
                  className="text-lg text-[#F8F8F8] transition-transform duration-300 [text-shadow:0_1px_2px_rgba(0,0,0,0.35)] group-hover:translate-x-1"
                >
                  →
                </span>
              </a>
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
              href="/quote"
              className="inline-flex items-center rounded-[100px] bg-gold px-8 py-3 text-xs font-semibold uppercase tracking-[3px] text-[#F8F8F8] transition-colors hover:bg-gold-soft hover:text-ink"
            >
              Request a Freight Quote
            </Link>
          </Reveal>
        </div>
      </section>

      <PageClosing />
    </>
  );
}
