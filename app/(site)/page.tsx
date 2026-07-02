import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import HashScroll from "@/components/concept/HashScroll";
import Faq from "@/components/concept/Faq";
import HeroVideo from "@/components/concept/HeroVideo";
import BirdModel from "@/components/concept/BirdModel";
import ContactForm from "@/components/forms/ContactForm";
import { site } from "@/lib/site";

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
 * All copy and imagery are KUL's own.
 */

const faqs = [
  {
    q: "How fast do I get a freight quote?",
    a: "The same business day. Send the lane through the quote form or call dispatch, and a person who can actually commit capacity prices it and answers.",
  },
  {
    q: "What freight does KUL haul?",
    a: "Power Only, Dry Van, Reefer, Dedicated, Regional, Expedited, and Over-the-Road full truckloads. If you are not sure which fits, describe the load and we will advise.",
  },
  {
    q: "Are you licensed and insured?",
    a: `Fully. We operate under USDOT ${site.usdot} and MC ${site.mc}, with auto liability and cargo coverage. Verify our authority anytime on the FMCSA SAFER system, and request a certificate of insurance with your company listed as holder.`,
  },
  {
    q: "Where do you run?",
    a: "Home base is Loganville, Georgia. We run the Southeast like a home route and carry nationwide authority for coast-to-coast lanes.",
  },
  {
    q: "How do brokers set KUL up as a carrier?",
    a: "One email. Send your company name and MC or USDOT number to dispatch and the full carrier packet comes back the same business day: authority, COI, W-9, references, and signed agreements.",
  },
  {
    q: "How do I start driving for KUL?",
    a: "A thirty-second form. Tell us your name, contact, and CDL-A experience, and we call you back to talk lanes, home time, and equipment.",
  },
  {
    q: "What happens if something changes in transit?",
    a: "You hear it from us first. Weather, traffic, dock delays: dispatch calls before you have to ask, with a new ETA you can plan around.",
  },
  {
    q: "Can I get updates while my freight moves?",
    a: "Yes. Milestone updates at pickup, in transit, and delivery are standard, and 24/7 dispatch means a person answers whenever you call.",
  },
];

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

/** Reference-metric pill button: radius 100px, 12px caps, 3px tracking. */
function Pill({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center rounded-[100px] bg-gold px-5 py-[9px] font-mont text-xs font-semibold uppercase tracking-[3px] text-[#F8F8F8] transition-colors hover:bg-gold-soft hover:text-ink ${className}`}
    >
      {children}
    </Link>
  );
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

      {/* 03 Statement band: narrow left column over right-weighted visual */}
      <section className="relative overflow-hidden bg-ink2">
        <div aria-hidden className="absolute inset-0">
          <Image
            src="/images/stock/hero-semi-truck-dusk-mountains.jpg"
            alt=""
            fill
            quality={82}
            sizes="100vw"
            className="object-cover object-[75%_center]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(22,22,22,0.96)_0%,rgba(22,22,22,0.8)_34%,rgba(22,22,22,0.25)_65%,rgba(22,22,22,0.15)_100%)]" />
        </div>
        <div className="relative mx-auto grid min-h-[440px] max-w-[1000px] items-center gap-10 px-6 py-24 md:grid-cols-2 md:py-28">
          <Reveal>
            <h2 className="kul-grad-text font-omnibus text-[clamp(2rem,3vw,2.75rem)] leading-[1.15]">
              Trust is in our DNA
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="max-w-[380px]">
              <p className="text-[15px] leading-[1.6] text-cream">
                KUL Enterprises is a Georgia freight carrier built by a driver.
                Every load carries three commitments: safety first, honest
                communication, and delivery when we said it would.
              </p>
              <Pill href="/about" className="mt-7">
                About
              </Pill>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 04 Two-up panels on pure black, centered stacks */}
      <section id="paths" className="grid bg-black md:grid-cols-2">
        {[
          {
            name: "Freight",
            line: "Ship with a carrier that answers.",
            href: "/quote",
            cta: "Request a Quote",
            img: "/images/stock/road-night-light-trails.jpg",
            alt: "Highway light trails at night",
            pos: "center 60%",
          },
          {
            name: "Drivers",
            line: "Drive for a company that knows your name.",
            href: "/drivers",
            cta: "Drive With KUL",
            img: "/images/stock/driver-portrait-semi-cab-night.jpg",
            alt: "A professional driver standing at his cab",
            pos: "center 30%",
          },
        ].map((p) => (
          <div
            key={p.name}
            className="relative flex h-[711px] flex-col items-center justify-between overflow-hidden py-16"
          >
            <Image
              src={p.img}
              alt={p.alt}
              fill
              quality={80}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover opacity-70"
              style={{ objectPosition: p.pos }}
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.55),rgba(0,0,0,0.15)_45%,rgba(0,0,0,0.5))]"
            />
            <Reveal className="relative text-center">
              <h3 className="kul-grad-text font-omnibus text-[clamp(2rem,3.2vw,3rem)] uppercase leading-none tracking-[0.5em]">
                {p.name}
              </h3>
            </Reveal>
            <Reveal className="relative flex flex-col items-center text-center">
              <p className="max-w-[220px] text-[13px] leading-snug text-cream">
                {p.line}
              </p>
              <Pill href={p.href} className="mt-5">
                {p.cta}
              </Pill>
            </Reveal>
          </div>
        ))}
      </section>

      {/* 05 Proof band: small gray caps heading, six dim marks, quote */}
      <section id="credentials" className="bg-[linear-gradient(90deg,#161616_0%,#3B3B3B_100%)]">
        <div className="mx-auto max-w-6xl px-6 pb-16 pt-8 text-center">
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
              <footer className="mt-5 font-mont text-[12px] font-semibold uppercase tracking-[0.3em] text-graywarm">
                Mark S. Brown, Founder
              </footer>
            </blockquote>
          </Reveal>
        </div>
      </section>

      {/* 06 Statement band A: left column w-468 over full-bleed visual */}
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
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(22,22,22,0.8),rgba(22,22,22,0.35)_55%,transparent)]"
        />
        <Reveal className="relative mx-auto w-full max-w-[1470px] px-6 lg:px-[180px]">
          <div className="max-w-[560px]">
            <h2 className="kul-grad-text font-omnibus text-[clamp(2.1rem,3.2vw,2.9rem)] leading-[1.15]">
              Building the Southeast&apos;s most trusted carrier
            </h2>
            <p className="mt-6 max-w-[520px] text-[15px] leading-[1.7] text-graywarm-light">
              Fifty tractors by the end of 2029, one kept promise at a time.
              We grow on purpose, load by load, relationship by relationship,
              so the service never falls behind the name on the door.
            </p>
            <Pill href="/about" className="mt-8">
              Discover Our Vision
            </Pill>
          </div>
        </Reveal>
      </section>

      {/* 07 Statement band B: same structure, safety message */}
      <section className="relative flex h-[707px] items-center overflow-hidden">
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
          className="absolute inset-0 bg-[linear-gradient(270deg,rgba(22,22,22,0.8),rgba(22,22,22,0.35)_55%,transparent)]"
        />
        <Reveal className="relative mx-auto w-full max-w-[1470px] px-6 lg:px-[180px]">
          <div className="ml-auto max-w-[560px] text-right">
            <h2 className="kul-grad-text font-omnibus text-[clamp(2.1rem,3.2vw,2.9rem)] leading-[1.15]">
              A foundation that doesn&apos;t move
            </h2>
            <p className="ml-auto mt-6 max-w-[520px] text-[15px] leading-[1.7] text-graywarm-light">
              Pre-trip inspections. Legal hours. Weather calls made early and
              on the side of caution. The most important delivery on any route
              is the driver coming home.
            </p>
            <Pill href="/safety" className="mt-8">
              Explore Safety &amp; Compliance
            </Pill>
          </div>
        </Reveal>
      </section>

      {/* 08 Big centered statement over sky, pivot to light */}
      <section className="relative overflow-hidden">
        <div className="relative flex h-[860px] flex-col items-center justify-start pt-[71px]">
          <Image
            src="/images/photos/cliffs-over-water.jpg"
            alt="Cliffs over blue water under a wide sky"
            fill
            quality={80}
            sizes="100vw"
            className="object-cover object-[center_30%]"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(22,22,22,0.45),rgba(22,22,22,0.1)_35%,rgba(248,248,248,1)_97%)]"
          />
          <Reveal className="relative px-6 text-center">
            <h2 className="kul-grad-text mx-auto max-w-4xl font-omnibus text-[clamp(2rem,3.8vw,55px)] leading-[1.1]">
              Strength in Motion. Built on Integrity. Driven by Safety.
            </h2>
          </Reveal>
          <Reveal className="relative mt-6">
            <div className="text-center">
              <Pill href="/contact">Contact KUL</Pill>
            </div>
          </Reveal>
          <Reveal className="absolute inset-x-0 bottom-[140px] top-[130px] flex items-center justify-center md:bottom-[100px] md:top-[190px]">
            <BirdModel className="h-[440px] w-[640px] md:h-[520px] md:w-[800px]" />
          </Reveal>
        </div>
      </section>

      {/* 08b Contact form: lion mark above, form on the light ground */}
      <section id="contact" className="bg-[#F8F8F8]">
        <div className="mx-auto max-w-3xl px-6 pb-4 pt-20">
          <Reveal className="text-center">
            <Image
              src="/images/brand/lion-head.png"
              alt=""
              aria-hidden
              width={96}
              height={96}
              className="mx-auto h-auto w-24"
            />
            <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-graywarm-deep">
              Tell us about your freight, your lane, or whatever you need.
              Dispatch replies the same business day.
            </p>
          </Reveal>
          <Reveal className="mt-10 rounded-2xl border border-ink/10 bg-white p-8 md:p-10">
            <ContactForm />
          </Reveal>
        </div>
      </section>

      {/* 09 FAQ: light band, hairline rule, gold caps heading left, boxed list */}
      <section className="bg-[#F8F8F8]">
        <div className="mx-auto max-w-[1230px] px-6 py-20 md:py-24">
          <Reveal>
            <div id="faq" className="h-px w-full bg-ink/70" />
            <h2 className="mt-10 font-mont text-[15px] font-semibold uppercase tracking-[0.35em] text-gold-dim">
              Frequently Asked Questions
            </h2>
            <div className="mt-8 border border-ink/80">
              <Faq items={faqs} boxed />
            </div>
          </Reveal>
        </div>
      </section>

      {/* 10 Lifestyle band: full-bleed, the human behind the wheel */}
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
          className="absolute inset-x-0 bottom-0 h-56 bg-[linear-gradient(180deg,transparent,#161616)]"
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
