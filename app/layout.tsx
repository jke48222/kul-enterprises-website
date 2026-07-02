import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import MotionProvider from "@/components/motion/MotionProvider";
import LoadingOverlay from "@/components/brand/LoadingOverlay";

// Montserrat is the site-wide body font (intro overlay included). The
// legacy /concept tree loads its own Sora/Inter in app/concept/layout.tsx,
// keeping those bytes off main-site visits.
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mont",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Reliable Freight Transportation Built on Trust`,
    template: `%s | ${site.name}`,
  },
  description: `${site.legalName} is a licensed and insured freight carrier based in ${site.location}. Power Only, Dry Van, Reefer, Dedicated, Regional, Expedited, and Over-the-Road service. Southeast based, nationwide. USDOT ${site.usdot}, MC ${site.mc}.`,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} | Reliable Freight Transportation Built on Trust`,
    description: site.tagline,
    url: site.url,
  },
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
  telephone: "+1-678-972-1148",
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
      // The pre-paint intro gate script sets data-intro on <html> before
      // hydration; suppress React's root attribute mismatch warning for it.
      suppressHydrationWarning
      className={montserrat.variable}
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
        {/* Runs synchronously before anything paints: decides whether the
            intro cover (already in the server HTML) is visible this visit. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(sessionStorage.getItem('kul-intro-seen')!=='1')document.documentElement.setAttribute('data-intro','1')}catch(e){}",
          }}
        />
        <LoadingOverlay />
        {/* First visits only: attach the intro film's src pre-paint so it
            buffers at parse time. Repeat visits leave it src-less, so the
            hidden overlay fetches and decodes nothing. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(document.documentElement.getAttribute('data-intro')==='1'){var v=document.querySelector('.kul-intro-root video');if(v){v.muted=true;v.src=v.getAttribute('data-src');}}}catch(e){}",
          }}
        />
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
