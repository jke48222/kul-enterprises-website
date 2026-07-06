import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { services } from "@/lib/services";
import CopyButton from "./CopyButton";
import FooterReveal, { FooterWordmark, LocalClock } from "./FooterReveal";

/**
 * v3 curtain footer — v2 §3.2 mechanics (sticky md:bottom-0 md:h-[92svh]
 * behind the opaque content wrapper; FooterReveal scrubs on the
 * [data-content-end] sentinel), re-composed for v3: lion crest over the
 * dispatch strip (lion = primary mark, plan §5), the tagline in the brand
 * column (Mark: the tagline is the company heartbeat), and the SAFER
 * verify link beside the credentials (trust doctrine §10).
 * Zero-gold zone.
 */

const BASE = "/v3";

const COMPANY_LINKS = [
  { label: "About", href: `${BASE}/about` },
  { label: "Safety", href: `${BASE}/safety` },
  { label: "Carrier Packet", href: `${BASE}/carrier-packet` },
  { label: "Contact", href: `${BASE}/contact` },
] as const;

const DRIVER_LINKS = [
  { label: "Drive with KUL", href: `${BASE}/drivers` },
  { label: "Request a Quote", href: `${BASE}/quote` },
  { label: "FAQ", href: `${BASE}/quote#faq` },
] as const;

const LEGAL_LINKS = [
  { label: "Privacy", href: `${BASE}/privacy-policy` },
  { label: "Terms", href: `${BASE}/terms-conditions` },
  { label: "Cookies", href: `${BASE}/cookies` },
  { label: "Legal Notices", href: `${BASE}/legal-notices` },
  { label: "Climate", href: `${BASE}/climate-statement` },
] as const;

function LinkColumn({
  heading,
  links,
}: {
  heading: string;
  links: readonly { label: string; href: string }[];
}) {
  return (
    <div className="sm:px-6 sm:first:pl-0 sm:last:pr-0">
      <p className="text-micro font-medium uppercase text-paper/60">
        {heading}
      </p>
      <ul className="mt-4 space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="link-hairline text-[15px] text-paper/80"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      data-ground="ink"
      className="bg-ink text-paper md:sticky md:bottom-0 md:h-[92svh] md:overflow-hidden"
    >
      <FooterReveal className="flex h-full flex-col">
        {/* 1 — Dispatch strip, crested by the lion */}
        <div className="border-b border-t border-white/[0.12]">
          <div className="mx-auto flex max-w-[1760px] flex-col items-center gap-2 px-[clamp(20px,5vw,90px)] py-[clamp(28px,4vh,48px)] text-center">
            <Image
              src="/images/brand/lion-head.png"
              alt=""
              aria-hidden
              width={500}
              height={500}
              className="mb-1 h-10 w-10 object-contain opacity-90"
            />
            <p className="text-micro font-medium uppercase text-paper/60">
              Dispatch answers 24/7
            </p>
            <a
              href={site.phoneHref}
              className="text-h3 font-semibold tabular-nums"
            >
              {site.phone}
            </a>
            <div className="flex items-center gap-3">
              <a
                href={`mailto:${site.email}`}
                className="link-hairline text-[15px] text-paper/80"
              >
                {site.email}
              </a>
              <CopyButton value={site.email} />
            </div>
          </div>
        </div>

        {/* 2 — Sitemap grid */}
        <div className="mx-auto w-full max-w-[1760px] flex-1 px-[clamp(20px,5vw,90px)] py-[clamp(36px,5vh,64px)]">
          <div className="grid gap-y-12 md:grid-cols-12 md:gap-x-[clamp(16px,1.4vw,24px)]">
            <div className="md:col-span-4">
              <p className="text-h3 font-semibold">{site.legalName}</p>
              <p className="mt-3 text-[15px] text-paper/80">{site.location}</p>
              <p className="mt-1 text-micro font-medium uppercase text-paper/60">
                {site.serviceArea}
              </p>
              {/* The heartbeat line. */}
              <p className="mt-6 max-w-[34ch] text-micro font-medium uppercase leading-relaxed text-paper/50">
                {site.tagline}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-3 sm:gap-y-0 sm:divide-x sm:divide-white/[0.12] md:col-span-6 md:col-start-7">
              <LinkColumn heading="Company" links={COMPANY_LINKS} />
              <LinkColumn
                heading="Services"
                links={services.map((s) => ({
                  label: s.name,
                  href: `${BASE}/services/${s.slug}`,
                }))}
              />
              <LinkColumn heading="Drivers" links={DRIVER_LINKS} />
            </div>
          </div>
        </div>

        {/* 3 — Legal row */}
        <div className="border-t border-white/[0.12]">
          <div className="mx-auto flex max-w-[1760px] flex-col gap-2 px-[clamp(20px,5vw,90px)] py-5 text-micro font-medium uppercase text-paper/60 md:flex-row md:items-center md:justify-between md:gap-6">
            <p>
              © {year} {site.legalName}
            </p>
            {/* USDOT/MC — static, tabular, never animated; SAFER invite beside it. */}
            <p className="tabular-nums">
              USDOT {site.usdot} · MC {site.mc} ·{" "}
              <a
                href="https://safer.fmcsa.dot.gov/"
                target="_blank"
                rel="noopener noreferrer"
                className="link-hairline"
              >
                Verify on SAFER ↗
              </a>
            </p>
            <ul className="flex flex-wrap gap-x-4 gap-y-1">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="link-hairline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="tabular-nums">
              {site.city.toUpperCase()}, {site.state} — <LocalClock /> ET
            </p>
          </div>
        </div>

        {/* 4 — Baseline-cropped wordmark */}
        <div className="mt-auto">
          <span className="sr-only">KUL Enterprises</span>
          <FooterWordmark />
        </div>
      </FooterReveal>
    </footer>
  );
}
