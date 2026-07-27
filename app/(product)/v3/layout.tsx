import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { MotionConfig } from "framer-motion";
import Grain from "@/components/v3/Grain";
import Nav from "@/components/v3/Nav";
import Footer from "@/components/v3/Footer";
import StickyMobileBar from "@/components/v3/StickyMobileBar";
import RouteVeil from "@/components/v3/RouteVeil";
import LoadingOverlay from "@/components/brand/LoadingOverlay";

/**
 * v3 site chrome — the Cinematic Trust Experience tree (18-v3-build-plan).
 *
 * Light-forward inversion (§4.1): the content wrapper paints PAPER (v2
 * painted ink) — dark is reserved for cinematic beats that paint their own
 * bg-ink. The curtain footer mechanics are unchanged: opaque wrapper at
 * z-[1], sticky footer after it in the DOM, [data-content-end] sentinel as
 * the wrapper's last child (FooterReveal + StickyMobileBar both track it).
 *
 * One family, Apple-style: Geist (OFL, Google Fonts) via --font-geist;
 * the wrapper class sets font-geist so every v3 node inherits it.
 *
 * robots noindex: v3 is a demo tree until promoted — the sitemap keeps /v2
 * as primary. Flip both at promotion.
 */

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

export const metadata: Metadata = {
  robots: { index: false },
};

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${geist.variable} font-geist`}>
      <MotionConfig reducedMotion="user">
        <LoadingOverlay />
        <Grain />
        <Nav />
        <RouteVeil>
          <div className="relative z-[1] bg-paper text-ink shadow-[0_30px_60px_rgba(0,0,0,0.45)]">
            <main id="main">{children}</main>
            <div data-content-end aria-hidden />
          </div>
        </RouteVeil>
        <StickyMobileBar />
        <Footer />
      </MotionConfig>
    </div>
  );
}
