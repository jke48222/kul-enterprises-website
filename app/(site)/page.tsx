import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import GoldGlass from "@/components/concept/GoldGlass";
import HashScroll from "@/components/concept/HashScroll";
import HeroVideo from "@/components/concept/HeroVideo";
import {
  Pill,
  PathsPanels,
  StrengthStatement,
  ContactBand,
  FaqBand,
} from "@/components/concept/PageClosing";

/**
 * Concept homepage, rebuilt to the measured reference skeleton:
 * 02 hero pt-170 with centered tracked caps title
 * 03 statement band py-240 with a narrow 320px left column over a bg visual
 * 04 full-black 2-up panels, centered stacks, pill buttons
 * 05 proof band: small gray caps heading, six dim marks, 22px quote
 * 06/07 two full-bleed statement bands, left column w-468
 * 08 big centered statement over sky, pivot to light
 * 09 light FAQ: hairline rule, gold caps heading left, boxed accordion
 * 10 full-bleed lifestyle band
 * All copy and imagery are KUL's own. Sections 04/08/08b/09 live in
 * components/concept/PageClosing.tsx, shared with every other page.
 */

/** Quiet line-art marks for the credentials band, one per item. */
function CredIcon({ name, small = false }: { name: string; small?: boolean }) {
  const common = {
    viewBox: "0 0 32 32",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: small ? "h-5 w-5 text-graywarm-light" : "h-8 w-8 text-graywarm-light",
    "aria-hidden": true,
  };
  switch (name) {
    case "dot": // federal badge
      return (
        <svg {...common}>
          <path d="M16 3 L27 7 V15 C27 22 22.5 27 16 29 C9.5 27 5 22 5 15 V7 Z" />
          <path d="M11 16 H21 M16 11 V21" />
        </svg>
      );
    case "mc": // authority document
      return (
        <svg {...common}>
          <rect x="7" y="4" width="18" height="24" rx="1.5" />
          <path d="M11 10 H21 M11 15 H21 M11 20 H17" />
        </svg>
      );
    case "shield": // insured
      return (
        <svg {...common}>
          <path d="M16 3 L27 7 V15 C27 22 22.5 27 16 29 C9.5 27 5 22 5 15 V7 Z" />
          <path d="M11.5 15.5 L14.5 18.5 L21 12" />
        </svg>
      );
    case "clock": // 24/7
      return (
        <svg {...common}>
          <circle cx="16" cy="16" r="12" />
          <path d="M16 9 V16 L21 19" />
        </svg>
      );
    case "pin": // Southeast based
      return (
        <svg {...common}>
          <path d="M16 29 C16 29 25 19.5 25 12.5 C25 7.25 21 4 16 4 C11 4 7 7.25 7 12.5 C7 19.5 16 29 16 29 Z" />
          <circle cx="16" cy="12.5" r="3.5" />
        </svg>
      );
    case "map": // nationwide
      return (
        <svg {...common}>
          <circle cx="16" cy="16" r="12" />
          <path d="M4 16 H28 M16 4 C11 9 11 23 16 28 C21 23 21 9 16 4 Z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function ConceptHome() {
  return (
    <>
      <HashScroll />
      {/* 02 Hero: dark video slot, centered tracked caps title high in frame */}
      <section className="relative h-[100svh] overflow-hidden bg-ink2">
        <div aria-hidden className="absolute inset-0">
          {/* KUL aerial fleet footage, full screen, no overlay */}
          <HeroVideo />
        </div>
        <div className="kul-fade-slow relative px-6 pt-[15vh] text-center">
          <h1 className="kul-grad-text font-mont text-[clamp(1.35rem,2.3vw,2.05rem)] font-semibold uppercase tracking-[0.3em] [text-shadow:none]">
            Strength in Motion
          </h1>
        </div>
      </section>

      {/* 03 Two-up Freight/Drivers panels (shared) */}
      <PathsPanels />

      {/* 04 Statement band A: left column w-468 over full-bleed visual.
          Light scrim only; the body copy carries a soft dark text-shadow
          for readability over the brighter, barely-filtered photo. */}
      <section id="vision" className="relative flex h-[748px] items-center overflow-hidden">
        <Image
          src="/images/photos/ocean-waves-rocks.jpg"
          alt="A wave breaking against a rock cliff at dusk"
          fill
          quality={80}
          sizes="100vw"
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(22,22,22,0.5),rgba(22,22,22,0.2)_55%,transparent)]"
        />
        <Reveal className="relative mx-auto w-full max-w-[1470px] px-6 lg:px-[180px]">
          <div className="max-w-[560px]">
            {/* The Blueprint asks for a section literally titled Our Vision. */}
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold [text-shadow:0_1px_4px_rgba(0,0,0,0.55)]">
              Our Vision
            </p>
            <h2 className="kul-grad-text mt-3 font-omnibus text-[clamp(2.1rem,3.2vw,2.9rem)] leading-[1.15]">
              Building the Southeast&apos;s most trusted carrier
            </h2>
            <GoldGlass className="mt-6 max-w-[520px]">
              <p className="text-[15px] leading-[1.7] text-graywarm-light">
                Fifty tractors by the end of 2029, one kept promise at a time.
                We grow on purpose, load by load, relationship by relationship,
                so the service never falls behind the name on the door.
              </p>
            </GoldGlass>
            <Pill href="/about" className="mt-8">
              Discover Our Vision
            </Pill>
          </div>
        </Reveal>
      </section>

      {/* 05 Statement band B: same structure, safety message. True
          cross-fade: the section overlaps the ocean band above by 14rem and
          its own top edge is mask-feathered, so the desert dissolves
          directly over the water — photo into photo, no dark valley. */}
      <section className="relative -mt-56 flex h-[707px] items-center overflow-hidden [-webkit-mask-image:linear-gradient(180deg,transparent,black_14rem)] [mask-image:linear-gradient(180deg,transparent,black_14rem)]">
        <Image
          src="/images/photos/desert-rock-formation.jpg"
          alt="Sculpted rock formations standing over quiet sand at dusk"
          fill
          quality={80}
          sizes="100vw"
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(270deg,rgba(22,22,22,0.5),rgba(22,22,22,0.2)_55%,transparent)]"
        />
        <Reveal className="relative mx-auto w-full max-w-[1470px] px-6 lg:px-[180px]">
          <div className="ml-auto max-w-[560px] text-right">
            <h2 className="kul-grad-text font-omnibus text-[clamp(2.1rem,3.2vw,2.9rem)] leading-[1.15]">
              A foundation that doesn&apos;t move
            </h2>
            <GoldGlass className="ml-auto mt-6 max-w-[520px]">
              <p className="text-[15px] leading-[1.7] text-graywarm-light">
                Pre-trip inspections. Legal hours. Weather calls made early and
                on the side of caution. The most important delivery on any route
                is the driver coming home.
              </p>
            </GoldGlass>
            <Pill href="/safety" className="mt-8">
              Explore Safety &amp; Compliance
            </Pill>
          </div>
        </Reveal>
      </section>

      {/* 06 Statement band: narrow left column, Mark's cliffs photo (same
          as the About opener). Cross-fades in over the desert band above;
          the tall top padding keeps the copy below the feather. */}
      <section className="relative -mt-40 overflow-hidden bg-ink2 [-webkit-mask-image:linear-gradient(180deg,transparent,black_10rem)] [mask-image:linear-gradient(180deg,transparent,black_10rem)]">
        <div aria-hidden className="absolute inset-0">
          <Image
            src="/images/photos/cliffs-over-water.jpg"
            alt=""
            fill
            quality={82}
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(22,22,22,0.55)_0%,rgba(22,22,22,0.4)_34%,rgba(22,22,22,0.3)_65%,rgba(22,22,22,0.25)_100%)]" />
        </div>
        <div className="relative mx-auto grid min-h-[440px] max-w-[1000px] items-center gap-10 px-6 pb-24 pt-48 md:grid-cols-2 md:pb-28 md:pt-56">
          <Reveal>
            <h2 className="kul-grad-text font-omnibus text-[clamp(2rem,3vw,2.75rem)] leading-[1.15]">
              Trust is in our DNA
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="max-w-[420px]">
              <GoldGlass>
                <p className="text-[15px] leading-[1.6] text-cream">
                  KUL Enterprises is a Georgia freight carrier built by a driver.
                  Every load carries three commitments: safety first, honest
                  communication, and delivery when we said it would.
                </p>
              </GoldGlass>
              <Pill href="/about" className="mt-7">
                About
              </Pill>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 07 Proof band: small gray caps heading, six dim marks, quote.
          Deliberately unblended — hard edges above and below. */}
      <section id="credentials" className="bg-[linear-gradient(90deg,#161616_0%,#3B3B3B_100%)]">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center">
          <Reveal>
            <h2 className="font-mont text-[17px] font-medium uppercase tracking-[0.35em] text-[#B4B4B4]">
              Our Credentials
            </h2>
            <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 opacity-70 lg:flex-nowrap">
              {[
                ["dot", "USDOT 7638788"],
                ["mc", "MC 66389691"],
                ["shield", "Licensed & Insured"],
                ["clock", "24/7 Dispatch"],
                ["pin", "Southeast Based"],
                ["map", "Nationwide"],
              ].map(([icon, label]) => (
                <li key={label} className="flex items-center gap-2.5 whitespace-nowrap font-mont">
                  <CredIcon name={icon} small />
                  <span className="text-sm font-semibold tracking-[0.12em] text-graywarm-light">
                    {label}
                  </span>
                </li>
              ))}
            </ul>
            <blockquote className="mx-auto mt-14 max-w-3xl">
              <p className="font-omnibus text-[22px] leading-relaxed text-[#F8F8F8]">
                &ldquo;Freight isn&apos;t just freight. Behind every load is a
                family waiting, a business depending, a customer trusting
                someone to keep their word.&rdquo;
              </p>
              <footer className="mt-5 font-mont text-[12px] font-semibold uppercase tracking-[0.3em] text-graywarm-light">
                Mark S. Brown, Founder
              </footer>
            </blockquote>
          </Reveal>
        </div>
      </section>

      {/* 08 Tagline statement, 08b contact form, 09 FAQ (shared) */}
      <StrengthStatement />
      <ContactBand />
      <FaqBand />

      {/* 10 Lifestyle band: full-bleed, the human behind the wheel.
          Deliberately unblended: hard edges; a light bottom fade keeps the
          headline readable without burying the photo. */}
      <section className="relative flex h-[629px] items-end overflow-hidden">
        <Image
          src="/images/stock/driver-in-cab-gold-truck.jpg"
          alt="A driver at the wheel of his cab in warm evening light"
          fill
          quality={82}
          sizes="100vw"
          className="object-cover object-[center_30%]"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-56 bg-[linear-gradient(180deg,transparent,rgba(22,22,22,0.8))]"
        />
        <Reveal className="relative mx-auto w-full max-w-6xl px-6 pb-14 text-center">
          <h2 className="kul-grad-text font-omnibus text-[clamp(2.3rem,4vw,3.4rem)] leading-tight">
            Driven by people who keep their word.
          </h2>
        </Reveal>
      </section>
    </>
  );
}
