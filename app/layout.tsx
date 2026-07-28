import type { Metadata, Viewport } from "next";
import { Montserrat, Archivo, Inter } from "next/font/google";
import localFont from "next/font/local";
import { GoogleAnalytics } from "@next/third-parties/google";
import { MotionConfig } from "framer-motion";
import "./globals.css";
import { site } from "@/lib/site";
import MotionProvider from "@/components/motion/MotionProvider";
import LoadingOverlay from "@/components/brand/LoadingOverlay";
import Nav from "@/components/k/Nav";
import Footer from "@/components/k/Footer";
import StickyMobileBar from "@/components/v2/StickyMobileBar";
import RouteVeil from "@/components/v2/RouteVeil";

// Montserrat is the site-wide body font (intro overlay included).
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mont",
  display: "swap",
});

/**
 * Design system faces. Archivo Black 900 is the display voice — a squared
 * industrial grotesque that matches the KUL wordmark. Inter carries text and
 * every numeric. Both are variable fonts, so one file covers the range.
 */
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "900"],
  variable: "--font-archivo",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

// Omnibus and Montserrat are the v2 faces, retained only until the pages
// still using them are rebuilt. Remove both once nothing references
// font-omnibus / font-mont.
const omnibus = localFont({
  src: "./fonts/Omnibus-Bold.ttf",
  weight: "700",
  variable: "--font-omnibus",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Reliable Freight Transportation Built on Trust`,
    template: `%s | ${site.name}`,
  },
  description: `${site.legalName} is a licensed and insured freight carrier based in ${site.location}. Power Only, Dry Van, Reefer, Dedicated, Regional, Expedited, and Over-the-Road service. Southeast based, nationwide. USDOT ${site.usdot}, MC ${site.mc}.`,
  // Relative canonical: resolves per route against metadataBase, so every
  // page self-canonicalizes without repeating the URL in 13 files.
  alternates: { canonical: "./" },
  // og/twitter title + description are deliberately NOT set here: Next
  // falls back to each page's resolved title/description, so shares of
  // /services/reefer carry reefer copy instead of homepage copy. url "./"
  // resolves per route exactly like the canonical.
  openGraph: {
    type: "website",
    siteName: site.name,
    url: "./",
    images: [
      {
        // The file lives at public/images/og.jpg — "/og.jpg" 404s.
        // Dimensions verified against the real file (sips): 1200x630.
        url: "/images/og.jpg",
        width: 1200,
        height: 630,
        alt: `${site.name}. ${site.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/og.jpg"],
  },
  // Search Console ownership: set NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION in
  // the hosting env at launch and the tag renders on every page.
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? {
        verification: {
          google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
        },
      }
    : {}),
};

export const viewport: Viewport = {
  themeColor: "#0B0B0B",
};

/** schema.org LocalBusiness markup for trust and local SEO. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: site.name,
  legalName: site.legalName,
  slogan: site.tagline,
  url: site.url,
  email: site.email,
  telephone: site.phoneHref.replace("tel:", ""),
  image: `${site.url}/images/og.jpg`,
  logo: `${site.url}/images/brand/kul-logo-lockup.png`,
  // streetAddress intentionally omitted until the client confirms the
  // publishable business address (locality-level NAP is valid schema).
  address: {
    "@type": "PostalAddress",
    addressLocality: site.city,
    addressRegion: site.state,
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: site.geo.latitude,
    longitude: site.geo.longitude,
  },
  areaServed: "United States",
  identifier: [
    { "@type": "PropertyValue", propertyID: "USDOT", value: site.usdot },
    { "@type": "PropertyValue", propertyID: "MC", value: site.mc },
  ],
  knowsAbout: [
    "Power Only",
    "Dry Van",
    "Refrigerated Freight",
    "Dedicated Lanes",
    "Regional Trucking",
    "Expedited Freight",
    "Over-the-Road Trucking",
  ],
};

/**
 * The one and only layout: document shell + site chrome (design bible §5.1.3).
 *
 * MotionProvider (LazyMotion strict) wraps the tree, and MotionConfig
 * reducedMotion="user" sits inside it — layer 1 of the three-layer
 * reduced-motion requirement (§2.3).
 *
 * The curtain footer (§3.2): page content lives in a wrapper with an
 * EXPLICIT opaque background (bg-[inherit] would resolve transparent and
 * let the footer bleed through un-painted gaps; paper sections paint their
 * own bg-paper inside), and the sticky footer sits AFTER it in the DOM so
 * content scrolls up and off it — pure CSS, no JS. The zero-height
 * [data-content-end] sentinel is the wrapper's LAST child: FooterReveal
 * scroll-tracks it (never the sticky footer itself — sticky rect
 * measurement gives degenerate progress) and StickyMobileBar's unmount
 * IntersectionObserver watches it.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      // Third-party extensions routinely stamp attributes on <html> before
      // hydration; suppress React's root attribute mismatch warning for them.
      suppressHydrationWarning
      className={`${archivo.variable} ${inter.variable} ${montserrat.variable} ${omnibus.variable}`}
    >
      <body className="min-h-screen bg-ink font-mont text-white antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[110] focus:bg-gold focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink"
        >
          Skip to content
        </a>
        <MotionProvider>
          <MotionConfig reducedMotion="user">
            {/* First-visit-ever intro film (design bible §3.22): renders
                nothing in the server HTML and mounts itself from a
                post-first-paint idle callback, so the hero poster paints and
                is measured as LCP before the film appears. Crawlers,
                Lighthouse and no-JS visitors never see it. ≤2.5s cap with a
                visible skip; RouteVeil never replays it. */}
            <LoadingOverlay />
            <Nav />
            <RouteVeil>
              <div className="relative z-[1] bg-k-paper">
                <main id="main">{children}</main>
                <div data-content-end aria-hidden />
              </div>
            </RouteVeil>
            <StickyMobileBar />
            <Footer />
          </MotionConfig>
        </MotionProvider>
        {/* GA4: renders only when the property id is configured (set
            NEXT_PUBLIC_GA_ID in the hosting env after creating the
            property under the client's Google account). */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
