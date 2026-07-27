import { MotionConfig } from "framer-motion";
import Grain from "@/components/v2/Grain";
import Nav from "@/components/v2/Nav";
import Footer from "@/components/v2/Footer";
import StickyMobileBar from "@/components/v2/StickyMobileBar";
import RouteVeil from "@/components/v2/RouteVeil";
import LoadingOverlay from "@/components/brand/LoadingOverlay";

/**
 * v2 site chrome (design bible §5.1.3).
 *
 * MotionProvider (LazyMotion strict) already wraps this tree from the root
 * layout; here we add MotionConfig reducedMotion="user" — layer 1 of the
 * three-layer reduced-motion requirement (§2.3).
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
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MotionConfig reducedMotion="user">
      <LoadingOverlay />
      <Grain />
      <Nav />
      <RouteVeil>
        <div className="relative z-[1] bg-ink shadow-[0_30px_60px_rgba(0,0,0,0.45)]">
          <main id="main">{children}</main>
          <div data-content-end aria-hidden />
        </div>
      </RouteVeil>
      <StickyMobileBar />
      <Footer />
    </MotionConfig>
  );
}
