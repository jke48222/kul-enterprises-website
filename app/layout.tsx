import type { Metadata, Viewport } from "next";
import { Archivo, Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { MotionConfig } from "framer-motion";
import "./globals.css";
import { site } from "@/lib/site";
import MotionProvider from "@/components/motion/MotionProvider";
import RouteTransition from "@/components/k/RouteTransition";
import LoadingOverlay from "@/components/brand/LoadingOverlay";
import Nav from "@/components/k/Nav";
import Footer from "@/components/k/Footer";
import BackToTop from "@/components/k/BackToTop";

/**
 * Design system faces. Archivo Black 900 is the display voice: a squared
 * industrial grotesque that matches the KUL wordmark. Inter carries text and
 * every numeric. Both are variable fonts, so one file covers the range.
 */
/**
 * NO `weight` ARRAY HERE, AND THAT IS THE WHOLE POINT.
 *
 * Asking next/font/google for a list of weights makes it ship four STATIC
 * instances of Archivo. Asking for none ships the real variable font, which is
 * a single file carrying every weight from 100 to 900 continuously, plus the
 * `wdth` axis from 62 to 125 that the static instances throw away entirely.
 *
 * That width axis is not decoration. It is the axis the KUL wordmark itself
 * lives on: the lockup's tagline is the same face condensed, which is why
 * Archivo was chosen over every other grotesque in the first place. The site
 * has been unable to set it since day one.
 *
 * Every existing font-bold and font-black on the site keeps working unchanged,
 * because a variable font honours ordinary font-weight values. This is strictly
 * more capable and, at one file instead of four, usually smaller.
 */
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});


export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Reliable Freight Transportation Built on Trust`,
    template: `%s | ${site.name}`,
  },
  description: `${site.legalName} is a licensed and insured freight carrier based in ${site.location}. Power Only, Dry Van, Reefer, Dedicated, Regional, Expedited, and Over-the-Road service. Southeast based, nationwide. USDOT ${site.usdot}${site.mc ? `, MC ${site.mc}` : ""}.`,
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
        // The file lives at public/images/, so a bare "/og-…jpg" 404s.
        // Dimensions verified against the real file: 1200x630.
        //
        // The filename carries the "-primary-logo" suffix on purpose. Every
        // scraper (LinkedIn, iMessage, Slack, Facebook) caches share cards by
        // URL for days, so replacing the artwork at the old /images/og.jpg
        // would have left the old card in circulation. A new path forces a
        // fresh fetch everywhere the site has already been shared.
        url: "/images/og-primary-logo.jpg",
        width: 1200,
        height: 630,
        alt: `${site.name}. ${site.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/og-primary-logo.jpg"],
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
  image: `${site.url}/images/og-primary-logo.jpg`,
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
    // The MC identifier ships only while site.json holds a number, so an
    // empty field can never publish an empty authority claim as structured
    // data.
    ...(site.mc
      ? [{ "@type": "PropertyValue", propertyID: "MC", value: site.mc }]
      : []),
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
 * reducedMotion="user" sits inside it, layer 1 of the three-layer
 * reduced-motion requirement (§2.3).
 *
 * The curtain footer (§3.2): page content lives in a wrapper with an
 * EXPLICIT opaque background (bg-[inherit] would resolve transparent and
 * let the footer bleed through un-painted gaps; paper sections paint their
 * own bg-paper inside), and the sticky footer sits AFTER it in the DOM so
 * content scrolls up and off it, in pure CSS with no JS. The zero-height
 * [data-content-end] sentinel is the wrapper's LAST child: FooterReveal
 * scroll-tracks it (never the sticky footer itself, whose sticky rect
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
      className={`${archivo.variable} ${inter.variable} `}
    >
      <head>
        {/* ================================================================
            THE ONE LINE THAT DECIDES WHETHER ANYTHING IS ALLOWED TO BE
            HIDDEN. IT RUNS BEFORE FIRST PAINT AND IT IS NOT OPTIONAL.
            ================================================================
            Entrances on this site are CSS, and the rule that hides an element
            before its entrance is scoped to `html[data-reveal]`. This sets
            that attribute, and it sets it only when there is a script running,
            when the browser can tell us what has scrolled into view, and when
            the visitor has not asked for less motion.

            So: no JavaScript, an ancient browser, a blocked bundle, or a
            reader who has declined motion, and nothing on the page is ever
            hidden in the first place. See the header of
            components/k/Reveal.tsx for why that matters more than it sounds.

            It is inline and in <head> on purpose. Anything slower than that
            paints the page unhidden and then hides it, which is a flash of
            content going away, and that is worse than no entrance at all. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(window.IntersectionObserver&&!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.setAttribute('data-reveal','')}catch(e){}",
          }}
        />
      </head>
      {/* `dvh` rather than Tailwind's `min-h-screen`, which is 100vh. On a
          phone 100vh is the height with the browser chrome hidden, so it is
          taller than what is actually on screen and a page with almost no
          content still scrolls a little. `dvh` tracks the chrome. */}
      <body className="min-h-dvh bg-k-void font-text text-k-on-dark antialiased">
        {/* FIRST THING IN THE BODY, AND BLOCKING ON PURPOSE.

            The opening mounts after the first paint so the hero, not the
            ceremony, is what the browser measures as the main content. Without
            this the visitor sees the homepage for a few frames and then has it
            snatched away, which reads as a bug rather than as an opening.

            This runs before the browser has painted anything, decides whether
            the film is going to play at all, and if so drops a cover over the
            page until the overlay takes over. It never runs for a returning
            visitor, so nobody who has already seen it pays a black frame.

            The cover is a plain element carrying inline styles rather than a
            class, deliberately. A stylesheet is a second thing that has to
            arrive and compile before it can hide anything, which is exactly
            the race this exists to win. Inline styles are applied the moment
            the node is appended.

            The failsafe matters: if the bundle fails to load or throws, the
            cover would otherwise sit over a working site forever, so it takes
            itself away. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{" +
              // Home only, once per SESSION: a new tab or browser plays the
              // opening again; a broker deep-linked to /quote never sees it.
              "if(location.pathname!=='/')return;" +
              "if(sessionStorage.getItem('kul-intro-seen')==='1')return;" +
              "var d=document.createElement('div');d.id='kul-intro-cover';" +
              "d.setAttribute('aria-hidden','true');" +
              "d.style.cssText='position:fixed;inset:0;z-index:99;background:#050301;pointer-events:none';" +
              "document.body.appendChild(d);" +
              "setTimeout(function(){var n=document.getElementById('kul-intro-cover');" +
              "if(n&&n.parentNode)n.parentNode.removeChild(n)},8000);" +
              "}catch(e){}})()",
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            // Editors are trusted, but a "<" in CMS copy must still never end
            // the script tag early. \u003c renders identically inside JSON.
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[110] focus:bg-k-gold-lit focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-k-void"
        >
          Skip to content
        </a>
        <MotionProvider>
          <MotionConfig reducedMotion="user">
            {/* The opening, shown once in a visitor's life. It renders
                nothing in the server HTML and mounts itself after the first
                paint, so the hero is what the browser measures as the page's
                main content rather than the ceremony in front of it. Search
                engines and anybody without JavaScript never see it at all.

                THE CUT BETWEEN PAGES IS BACK, WITH THE LION ON IT. An
                earlier plain ink wipe was removed here on the grounds that
                half a second of black on every internal link is a poor trade
                for a broker trying to reach Services or Quote. The client has
                asked for it back carrying the mark, so it is a rebuild rather
                than a revert, and the objection is answered rather than
                ignored: it holds for about a third of a second rather than a
                half, it never fires on the back button, and anybody who has
                asked for reduced motion is not intercepted at all and gets
                ordinary instant navigation. See components/k/RouteTransition.tsx
                for why it has to catch the click rather than watch the route. */}
            <RouteTransition />
            <LoadingOverlay />
            <Nav />
            <div className="relative z-[1] bg-k-paper">
              <main id="main">{children}</main>
              <div data-content-end aria-hidden />
            </div>
            <Footer />
            {/* The way back up, in the bottom right on the search circle's
                own vertical line. It keeps itself hidden until the reader is
                a screen down; everything about it is in the component. */}
            <BackToTop />
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
