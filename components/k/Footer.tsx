import Link from "next/link";
import { site } from "@/lib/site";

const COLUMNS = [
  {
    heading: "Freight",
    links: [
      { href: "/services", label: "Services" },
      { href: "/safety", label: "Safety" },
      { href: "/carrier-packet", label: "Carrier Packet" },
      { href: "/quote", label: "Request a Quote" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/journey", label: "The Journey" },
      { href: "/road-ahead", label: "The Road Ahead" },
      { href: "/drivers", label: "Drivers" },
    ],
  },
] as const;

const LEGAL = [
  { href: "/privacy-policy", label: "Privacy" },
  { href: "/terms-conditions", label: "Terms" },
  { href: "/cookies", label: "Cookies" },
  { href: "/legal-notices", label: "Legal Notices" },
] as const;

export default function Footer() {
  return (
    <footer className="bg-k-coal px-6 pb-10 pt-24 md:px-12 lg:px-24">
      <div className="mx-auto max-w-[1248px]">
        <div className="flex flex-col gap-16 border-b border-k-rule-dark pb-18 lg:flex-row lg:justify-between lg:gap-24">
          <div className="flex flex-col gap-6">
            <h2 className="max-w-[520px] font-display text-k-d2 font-black text-k-on-dark">
              Ready when you are.
            </h2>
            <p className="max-w-[420px] font-text text-k-body text-k-on-dark-soft">
              Dispatch answers around the clock. Call and you will reach the
              person who drives the truck.
            </p>
            <div className="flex flex-wrap items-center gap-6 pt-2">
              <Link
                href="/quote"
                className="rounded-full bg-k-on-dark px-8 py-4 font-text text-k-label uppercase text-k-ink transition-opacity duration-200 hover:opacity-85"
              >
                Request a quote
              </Link>
              <a
                href={site.phoneHref}
                className="font-display text-k-d3 font-black tabular-nums text-k-gold-lit"
              >
                {site.phone}
              </a>
            </div>
          </div>

          <div className="flex flex-wrap gap-12 md:gap-18">
            {COLUMNS.map((col) => (
              <div key={col.heading} className="flex w-[150px] flex-col gap-3.5">
                <h3 className="font-text text-k-micro uppercase text-k-on-dark-faint">
                  {col.heading}
                </h3>
                {col.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="font-text text-k-small text-k-on-dark-soft transition-colors duration-200 hover:text-k-on-dark"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}

            <div className="flex w-[230px] flex-col gap-3.5">
              <h3 className="font-text text-k-micro uppercase text-k-on-dark-faint">
                Dispatch
              </h3>
              <a
                href={`mailto:${site.email}`}
                className="font-text text-k-small text-k-on-dark-soft transition-colors duration-200 hover:text-k-on-dark"
              >
                {site.email}
              </a>
              <p className="font-text text-k-small text-k-on-dark-soft">
                {site.location}
              </p>
              <p className="font-text text-k-small text-k-on-dark-soft">
                {site.serviceArea}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-7 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
            <span className="font-text text-k-micro uppercase text-k-on-dark-faint">
              © {new Date().getFullYear()} {site.legalName}
            </span>
            <span className="font-text text-k-micro uppercase tabular-nums text-k-on-dark-faint">
              USDOT {site.usdot}
            </span>
            <span className="font-text text-k-micro uppercase tabular-nums text-k-on-dark-faint">
              MC {site.mc}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-7 gap-y-2">
            {LEGAL.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-text text-k-micro uppercase text-k-on-dark-faint transition-colors duration-200 hover:text-k-on-dark-soft"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
