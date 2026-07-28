import Image from "next/image";
import Link from "next/link";
import Eyebrow from "@/components/v2/Eyebrow";
import GhostNumeral from "@/components/v2/GhostNumeral";
import LineReveal from "@/components/v2/LineReveal";

/**
 * 404 — design bible §4.11. The root layout supplies the whole chrome
 * (MotionProvider, Grain, Nav, RouteVeil + main#main + the
 * [data-content-end] sentinel, StickyMobileBar, curtain Footer), so this
 * file renders the page body only — never re-mount chrome here.
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
            The freight is fine &mdash; the page isn&apos;t. Let&apos;s get you
            back on the road.
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
    </>
  );
}
