import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";

/**
 * SITE FOOTER
 *
 * The bottom of every page. Behind it sits one wide photograph, built from the
 * KUL logo with the forest extended outwards, so the lion and the company name
 * fill the right-hand side while the left stays dark and empty.
 *
 * That empty left side is doing a job. On a wide screen every word in the
 * footer is kept inside the left half, over the dark forest, so nothing is
 * ever printed on top of the lion or the company name. On phones and tablets
 * there is no room to hold that split, so the photograph is not shown at all
 * and the footer falls back to plain dark grey.
 *
 * TO CHANGE THE PICTURE: replace the file at the path used below. A
 * replacement has to keep the same very wide shape and the same dark, empty
 * left half, or the words will stop being readable over it.
 */

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

/**
 * The black the photograph itself is built on. It is a warm near black rather
 * than the neutral grey used for dark panels elsewhere on the site, and the
 * footer is painted in it on wide screens so the picture has nothing to sit
 * against. If the picture is ever replaced, sample the darkest corner of the
 * new one and put that value here.
 */
const PHOTO_BLACK = "#0B0907";

/**
 * How the top edge of the picture is dissolved into the background above it.
 * The picture is fully hidden at its own top edge and fully solid a fifth of
 * the way down, so nothing starts on a hard line.
 */
const TOP_DISSOLVE =
  "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 9%, rgba(0,0,0,1) 22%)";

const LEGAL = [
  { href: "/privacy-policy", label: "Privacy" },
  { href: "/terms-conditions", label: "Terms" },
  { href: "/cookies", label: "Cookies" },
  { href: "/legal-notices", label: "Legal Notices" },
] as const;

export default function Footer() {
  return (
    <footer className="relative isolate overflow-hidden bg-k-coal px-6 pb-10 pt-24 md:px-12 md:pb-14 md:pt-28 lg:px-24 lg:pb-20 lg:pt-32">
      {/* The photograph. It is decoration rather than information, so it is
          given an empty description and skipped by screen readers.

          It is pinned to the bottom edge and stretched across the full width,
          which is what keeps the lion in the same place on the right whatever
          size the screen is.

          Getting the join right takes two things. The forest in the picture is
          very nearly black, far darker than the grey the rest of the site uses
          for dark panels, so laying the picture straight onto that grey leaves
          an obvious line across the footer. Instead the whole footer is
          repainted in the picture's own black on wide screens, with only a
          short strip at the very top fading back up to the site grey so it
          still meets the panel above it cleanly. The top edge of the picture
          is then dissolved rather than cut, so the leaves come up out of the
          background instead of starting at a line. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20 hidden lg:block"
        style={{ backgroundColor: PHOTO_BLACK }}
      >
        <div
          className="absolute inset-x-0 top-0 h-40"
          style={{
            backgroundImage: `linear-gradient(180deg, #1C1C1C 0%, ${PHOTO_BLACK} 100%)`,
          }}
        />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 hidden lg:block"
      >
        <Image
          src="/images/brand/footer-lockup.webp"
          alt=""
          width={1942}
          height={809}
          sizes="100vw"
          className="h-auto w-full"
          style={{
            maskImage: TOP_DISSOLVE,
            WebkitMaskImage: TOP_DISSOLVE,
          }}
        />
        {/* A soft wash over the left of the picture only. The forest there is
            almost black already, but it still carries enough stray highlights
            to sit under the small print, so this settles it down. It is mixed
            in the picture's own black rather than a neutral grey, so it does
            not pull the warmth out of the leaves. It stops at just over half
            way, before the company name begins, and never touches the lion. */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(8,7,6,0.62) 0%, rgba(8,7,6,0.62) 44%, rgba(8,7,6,0.30) 51%, rgba(8,7,6,0) 55%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-[1248px]">
        {/* On a wide screen this whole block is held to the left half of the
            footer, clear of the lion and the company name behind it. */}
        <div className="flex flex-col gap-16 md:flex-row md:justify-between md:gap-12 lg:max-w-[50%] lg:flex-col lg:gap-14">
          <div className="flex flex-col gap-6">
            {/* THE MARK, ON NARROW SCREENS ONLY.
                The big lockup behind this footer is the only place the company
                name is set out in full anywhere on the site, and it is hidden
                below 1024px along with the photograph it sits on. That left a
                phone with no wordmark at all, on any page.

                So this one is a real element in the reading order rather than
                a picture behind the text, and it is switched off at lg where
                the large one takes over. Two of them at once would be the same
                name twice on one screen. */}
            <Image
              src="/images/brand/lockup-light.webp"
              alt="KUL Enterprises LLC"
              width={320}
              height={320}
              className="h-auto w-[136px] lg:hidden"
            />
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

          <div className="flex flex-wrap gap-12 md:gap-18 lg:gap-x-10 lg:gap-y-10 lg:border-t lg:border-k-rule-dark lg:pt-12">
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

        {/* The legal line. It is held to the same left half as everything
            above it, so on a wide screen it wraps onto two lines rather than
            running out across the lion. */}
        <div className="mt-16 flex flex-col gap-4 border-t border-k-rule-dark pt-7 md:flex-row md:items-center md:justify-between lg:max-w-[50%] lg:flex-wrap lg:justify-start lg:gap-x-8">
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
