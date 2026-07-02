import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/components/motion/FadeIn";
import { site } from "@/lib/site";

const legal = [
  { label: "Manage Cookies", href: "/cookies" },
  { label: "Climate Statement", href: "/climate-statement" },
  { label: "Legal Notices & Disclaimers", href: "/legal-notices" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-conditions" },
];

/** Small stroke icons for the socials row and contact column. */
function Icon({ name }: { name: string }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "h-4 w-4",
    "aria-hidden": true,
  };
  switch (name) {
    case "x":
      return (
        <svg {...common}>
          <path d="M4 4 L20 20 M20 4 L4 20" />
        </svg>
      );
    case "instagram":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="16" rx="4.5" />
          <circle cx="12" cy="12" r="3.5" />
          <circle cx="16.8" cy="7.2" r="0.6" fill="currentColor" stroke="none" />
        </svg>
      );
    case "youtube":
      return (
        <svg {...common}>
          <rect x="3" y="6.5" width="18" height="11" rx="3" />
          <path d="M10.5 9.5 L15 12 L10.5 14.5 Z" fill="currentColor" stroke="none" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="16" rx="2.5" />
          <path d="M8 11 V16.5 M8 8 V8.2 M12 16.5 V13 C12 11.5 15.5 11.2 15.5 13.4 V16.5" />
        </svg>
      );
    case "pin":
      return (
        <svg {...common}>
          <path d="M12 21 C12 21 19 14 19 9.5 C19 5.9 16 3.5 12 3.5 C8 3.5 5 5.9 5 9.5 C5 14 12 21 12 21 Z" />
          <circle cx="12" cy="9.5" r="2.4" />
        </svg>
      );
    case "mail":
      return (
        <svg {...common}>
          <rect x="3" y="5.5" width="18" height="13" rx="1.8" />
          <path d="M3.5 6.5 L12 13 L20.5 6.5" />
        </svg>
      );
    case "phone":
      return (
        <svg {...common}>
          <path d="M5 4.5 H9 L10.5 9 L8.5 10.5 C9.4 12.7 11.3 14.6 13.5 15.5 L15 13.5 L19.5 15 V19 C19.5 19.8 18.8 20.5 18 20.5 C10.5 20 4 13.5 3.5 6 C3.5 5.2 4.2 4.5 5 4.5 Z" />
        </svg>
      );
    default:
      return null;
  }
}

const socials = [
  { name: "x", label: "KUL on X" },
  { name: "instagram", label: "KUL on Instagram" },
  { name: "youtube", label: "KUL on YouTube" },
  { name: "linkedin", label: "KUL on LinkedIn" },
];

export default function ConceptFooter() {
  return (
    <footer className="bg-[linear-gradient(90deg,#161616_0%,#3B3B3B_100%)]">
      {/* Everything fades in slowly on approach, like the hero title. */}
      <FadeIn className="mx-auto max-w-[1360px] px-6 pb-10 pt-16">
        {/* Top row: socials | centered lockup | contact column */}
        <div className="grid items-center gap-12 md:grid-cols-3">
          <div className="flex justify-center gap-3 md:justify-start">
            {/* Social profiles pending; placeholders hold the layout. */}
            {socials.map((s) => (
              <a
                key={s.name}
                href="#"
                aria-label={s.label}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/25 text-white/70 transition-colors hover:border-gold-soft hover:text-gold-soft"
              >
                <Icon name={s.name} />
              </a>
            ))}
          </div>

          <div className="flex justify-center">
            <Link href="/" aria-label="KUL Enterprises concept home">
              <Image
                src="/images/brand/kul-logo-lockup.png"
                alt="KUL Enterprises LLC"
                width={244}
                height={91}
                className="h-12 w-auto"
              />
            </Link>
          </div>

          <ul className="space-y-3 justify-self-center text-sm text-white/85 md:justify-self-end">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 text-gold-soft">
                <Icon name="pin" />
              </span>
              {site.location} · {site.serviceArea}
            </li>
            <li className="flex items-center gap-3">
              <span className="text-gold-soft">
                <Icon name="mail" />
              </span>
              <a href={`mailto:${site.email}`} className="transition-colors hover:text-gold-soft">
                {site.email}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-gold-soft">
                <Icon name="phone" />
              </span>
              <a href={site.phoneHref} className="transition-colors hover:text-gold-soft">
                {site.phone}
              </a>
            </li>
          </ul>
        </div>

        {/* Divider */}
        <div className="mt-12 h-px w-full bg-white/20" />

        {/* Centered credentials note, legal row, copyright */}
        <div className="mt-8 space-y-4 text-center">
          <p className="text-xs text-white/60">
            {site.legalName} operates as a licensed and insured interstate
            motor carrier under USDOT {site.usdot} and MC {site.mc}.
          </p>
          <nav aria-label="Legal">
            <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs text-white/75">
              {legal.map((l, i) => (
                <li key={l.href} className="flex items-center gap-3">
                  {i > 0 && (
                    <span aria-hidden className="text-white/30">
                      |
                    </span>
                  )}
                  <Link href={l.href} className="transition-colors hover:text-gold-soft">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <p className="text-xs text-white/60">
            © Copyright {site.legalName} {new Date().getFullYear()}
            <span aria-hidden className="mx-2 text-white/30">|</span>
            Website designed and built by{" "}
            <a
              href="https://jalenedusei.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-gold-soft"
            >
              Jalen Edusei
            </a>
          </p>
        </div>
      </FadeIn>
    </footer>
  );
}
