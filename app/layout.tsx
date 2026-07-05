import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import localFont from "next/font/local";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import "./v1-legacy.css";
import { site } from "@/lib/site";
import MotionProvider from "@/components/motion/MotionProvider";

// Montserrat is the site-wide body font (intro overlay included).
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mont",
  display: "swap",
});

// Omnibus carries the display headings. Loaded here (not the site layout)
// so the variable exists on every route, the 404 page included.
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
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: `${site.name} — ${site.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.jpg"],
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
  image: `${site.url}/og.jpg`,
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      // /v1's pre-paint intro gate sets data-intro on <html> before
      // hydration; suppress React's root attribute mismatch warning for it.
      suppressHydrationWarning
      className={`${montserrat.variable} ${omnibus.variable}`}
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
        {/* First-visit-ever intro film (design bible §3.22): renders nothing
            in the server HTML and mounts itself from a post-first-paint idle
            callback, so the hero poster paints and is measured as LCP before
            the film appears. Crawlers, Lighthouse and no-JS visitors never
            see it. ≤2.5s cap with a visible skip; RouteVeil never replays it. */}
        <MotionProvider>{children}</MotionProvider>
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
