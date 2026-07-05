import Link from "next/link";
import { site } from "@/lib/site";
import { services } from "@/lib/services";
import CopyButton from "./CopyButton";
import FooterReveal, { FooterWordmark, LocalClock } from "./FooterReveal";

/**
 * §3.2 — the curtain footer. Server component; the client islands are
 * FooterReveal / FooterWordmark / LocalClock (./FooterReveal) and CopyButton.
 *
 * The curtain itself is pure CSS and lives across two places: the
 * (site)/layout wraps page content in an explicit opaque `bg-ink z-[1]`
 * wrapper (with the `[data-content-end]` sentinel as its last child), and
 * this footer sits AFTER it in the DOM as `md:sticky md:bottom-0
 * md:h-[92svh]`. Below md it is normal flow (stacked content exceeds 92svh).
 *
 * Zero-gold zone — no gold anywhere in the footer.
 */

const COMPANY_LINKS = [
  { label: "About", href: "/v2/about" },
  { label: "Safety", href: "/v2/safety" },
  { label: "Carrier Packet", href: "/v2/carrier-packet" },
  { label: "Contact", href: "/v2/contact" },
] as const;

const DRIVER_LINKS = [
  { label: "Drive with KUL", href: "/v2/drivers" },
  { label: "Request a Quote", href: "/v2/quote" },
  { label: "FAQ", href: "/v2/quote#faq" },
] as const;

const LEGAL_LINKS = [
  { label: "Privacy", href: "/v2/privacy-policy" },
  { label: "Terms", href: "/v2/terms-conditions" },
  { label: "Cookies", href: "/v2/cookies" },
  { label: "Legal Notices", href: "/v2/legal-notices" },
  { label: "Climate", href: "/v2/climate-statement" },
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
      <p className="font-mont text-micro font-medium uppercase text-paper/60">
        {heading}
      </p>
      <ul className="mt-4 space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="link-hairline font-mont text-[15px] text-paper/80"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

type FooterProps = Record<string, never>;

export default function Footer({}: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer
      data-ground="ink"
      className="bg-ink text-paper md:sticky md:bottom-0 md:h-[92svh] md:overflow-hidden"
    >
      <FooterReveal className="flex h-full flex-col">
        {/* 1 — Dispatch strip */}
        <div className="border-b border-t border-white/[0.12]">
          <div className="mx-auto flex max-w-[1760px] flex-col items-center gap-2 px-[clamp(20px,5vw,90px)] py-[clamp(28px,4vh,48px)] text-center">
            <p className="font-mont text-micro font-medium uppercase text-paper/60">
              Dispatch answers 24/7
            </p>
            <a
              href={site.phoneHref}
              className="font-omnibus text-h3 font-bold tabular-nums"
            >
              {site.phone}
            </a>
            <div className="flex items-center gap-3">
              <a
                href={`mailto:${site.email}`}
                className="link-hairline font-mont text-[15px] text-paper/80"
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
              <p className="font-omnibus text-h3 font-bold">{site.legalName}</p>
              <p className="mt-3 font-mont text-[15px] text-paper/80">
                {site.location}
              </p>
              <p className="mt-1 font-mont text-micro font-medium uppercase text-paper/60">
                {site.serviceArea}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-3 sm:gap-y-0 sm:divide-x sm:divide-white/[0.12] md:col-span-6 md:col-start-7">
              <LinkColumn heading="Company" links={COMPANY_LINKS} />
              <LinkColumn
                heading="Services"
                links={services.map((s) => ({
                  label: s.name,
                  href: `/services/${s.slug}`,
                }))}
              />
              <LinkColumn heading="Drivers" links={DRIVER_LINKS} />
            </div>
          </div>
        </div>

        {/* 3 — Legal row (micro at /60 — the a11y opacity floor) */}
        <div className="border-t border-white/[0.12]">
          <div className="mx-auto flex max-w-[1760px] flex-col gap-2 px-[clamp(20px,5vw,90px)] py-5 font-mont text-micro font-medium uppercase text-paper/60 md:flex-row md:items-center md:justify-between md:gap-6">
            <p>
              © {year} {site.legalName}
            </p>
            {/* USDOT/MC — typographic jewelry: static, tabular, never animated */}
            <p className="tabular-nums">
              USDOT {site.usdot} · MC {site.mc}
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
