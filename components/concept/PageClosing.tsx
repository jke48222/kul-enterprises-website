import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import Faq from "@/components/concept/Faq";
import BirdModel from "@/components/concept/BirdModel";
import ContactForm from "@/components/forms/ContactForm";
import faqContent from "@/content/faq.json";

/**
 * The site's shared closing sequence. The homepage composes these sections
 * into its own flow; every other page renders <PageClosing /> so it ends the
 * same way: Freight/Drivers paths, the tagline statement, the contact form,
 * and the FAQ, straight into the footer.
 */

/** Reference-metric pill button: radius 100px, 12px caps, 3px tracking. */
export function Pill({
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
      // Ink text: white on this gold reads at ~2.6:1, below WCAG AA.
      className={`inline-flex items-center rounded-[100px] bg-gold px-5 py-[9px] font-mont text-xs font-bold uppercase tracking-[3px] text-ink transition-colors hover:bg-gold-soft ${className}`}
    >
      {children}
    </Link>
  );
}

// FAQ copy lives in content/faq.json, editable through the CMS (/admin).
const faqs = faqContent.items;

/** Two-up Freight/Drivers panels on pure black, centered stacks. */
export function PathsPanels() {
  return (
    <section id="paths" className="grid bg-black md:grid-cols-2">
      {[
        {
          name: "Freight",
          line: "Ship with a carrier that answers.",
          href: "/services",
          cta: "Services",
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
            {/* h2, not h3: this is the first section heading after the h1
                on several pages, and heading levels must not skip. */}
            <h2 className="kul-grad-text font-omnibus text-[clamp(2rem,3.2vw,3rem)] uppercase leading-none tracking-[0.5em]">
              {p.name}
            </h2>
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
  );
}

/** Big centered tagline statement over sky with the 3D bird, pivot to light. */
export function StrengthStatement() {
  return (
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
  );
}

/** Contact form on the light ground, lion mark above. */
export function ContactBand() {
  return (
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
  );
}

/** FAQ: light band, hairline rule, gold caps heading left, boxed list. */
export function FaqBand() {
  return (
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
  );
}

export default function PageClosing() {
  return (
    <>
      <PathsPanels />
      <StrengthStatement />
      <ContactBand />
      <FaqBand />
    </>
  );
}
