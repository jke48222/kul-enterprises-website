import Image from "next/image";
import Link from "next/link";
import Eyebrow from "@/components/v2/Eyebrow";
import Footer from "@/components/v2/Footer";
import GhostNumeral from "@/components/v2/GhostNumeral";
import Grain from "@/components/v2/Grain";
import LineReveal from "@/components/v2/LineReveal";
import Nav from "@/components/v2/Nav";

/**
 * 404 — design bible §4.11. Lives outside (site), so the chrome (Nav,
 * Grain, curtain Footer) is mounted manually here; MotionProvider already
 * wraps the whole tree from the root layout — never re-wrap it. The
 * [data-content-end] sentinel sits as the content wrapper's last child so
 * FooterReveal's scroll tracking works exactly as it does in (site)/layout.
 *
 * Single ink viewport. Gold ledger: nav CTA is gold #1; the BACK HOME pill
 * is the page's one additional gold element.
 */
export default function NotFound() {
  return (
    <>
      {/* Bird float: CSS-only so the page stays a server component; wrapped
          in no-preference so reduced motion gets a static bird (§2.3). */}
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          @keyframes nf-bird-float {
            0%, 100% { transform: translateY(-6px); }
            50% { transform: translateY(6px); }
          }
          .nf-bird-float { animation: nf-bird-float 6s ease-in-out infinite; }
        }
      `}</style>
      <Grain />
      <Nav />
      <div className="relative z-[1] bg-ink shadow-[0_30px_60px_rgba(0,0,0,0.45)]">
        {/* main#main: the root layout's skip link needs its target here too. */}
        <main id="main">
          <section
            data-ground="ink"
            className="relative flex min-h-svh items-center overflow-hidden bg-ink"
          >
            <GhostNumeral className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 !text-[clamp(12rem,30vw,26rem)]">
              404
            </GhostNumeral>
            <div className="relative z-[1] mx-auto w-full max-w-[1760px] px-[clamp(20px,5vw,90px)] pb-band-sm pt-32">
              <Image
                src="/images/brand/doctor-bird-flight.png"
                alt=""
                width={96}
                height={64}
                className="nf-bird-float h-auto w-24"
              />
              <Eyebrow className="mt-10">Off the route</Eyebrow>
              <LineReveal
                as="h1"
                lines={["This lane", "doesn’t exist."]}
                immediate
                className="mt-6 max-w-[14ch] font-omnibus text-display-l text-cream"
              />
              <p className="mt-6 max-w-[52ch] text-body-l text-paper/70">
                The freight is fine &mdash; the page isn&apos;t. Let&apos;s
                get you back on the road.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link href="/" className="btn-gold">
                  Back home
                </Link>
                <Link href="/quote" className="btn-ghost-dark">
                  Request a quote
                </Link>
              </div>
            </div>
          </section>
        </main>
        <div data-content-end aria-hidden />
      </div>
      <Footer />
    </>
  );
}
