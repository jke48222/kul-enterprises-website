import Image from "next/image";
import Link from "next/link";
import { navItems, site } from "@/lib/site";
import { services } from "@/lib/services";
import BrandMark from "@/components/brand/BrandMark";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-gold/20 bg-ink">
      {/* The Doctor Bird, the quiet signature. Mark's actual artwork. */}
      <Image
        // REPLACEABLE ASSET: bird artwork extracted from the concept board; swap for vector
        src="/images/brand/doctor-bird-display.png"
        alt=""
        aria-hidden
        width={302}
        height={261}
        className="pointer-events-none absolute -right-6 top-10 h-auto w-72 opacity-[0.07] md:w-96"
      />

      <div className="relative mx-auto max-w-content px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <BrandMark large />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-graywarm">
              {site.tagline}
            </p>
          </div>

          <nav aria-label="Footer">
            <h2 className="eyebrow text-graywarm">Company</h2>
            <ul className="mt-4 space-y-2.5">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/80 transition-colors hover:text-gold"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/quote"
                  className="text-sm text-white/80 transition-colors hover:text-gold"
                >
                  Request a Quote
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Services">
            <h2 className="eyebrow text-graywarm">Services</h2>
            <ul className="mt-4 space-y-2.5">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="text-sm text-white/80 transition-colors hover:text-gold"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="eyebrow text-graywarm">Dispatch</h2>
            <ul className="mt-4 space-y-2.5 text-sm text-white/80">
              <li>
                <a href={site.phoneHref} className="transition-colors hover:text-gold">
                  {site.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="transition-colors hover:text-gold"
                >
                  {site.email}
                </a>
              </li>
              <li>{site.location}</li>
              <li className="pt-2 text-graywarm">
                USDOT {site.usdot} · MC {site.mc}
              </li>
              <li className="text-graywarm">Licensed &amp; Insured</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 text-xs text-graywarm sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {site.legalName}. All rights reserved.
          </p>
          <p className="uppercase tracking-eyebrow">{site.serviceArea}</p>
        </div>
      </div>
    </footer>
  );
}
