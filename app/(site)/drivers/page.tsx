import type { Metadata } from "next";
import DriverForm from "@/components/forms/DriverForm";
import { CtaBand } from "@/components/v2/CtaBand";
import { Eyebrow } from "@/components/v2/Eyebrow";
import { GhostNumeral } from "@/components/v2/GhostNumeral";
import { HeroFrame } from "@/components/v2/HeroFrame";
import { LineReveal } from "@/components/v2/LineReveal";
import { PageHero } from "@/components/v2/PageHero";
import { PhotoBand } from "@/components/v2/PhotoBand";
import { ProcessStrip } from "@/components/v2/ProcessStrip";
import { Rise, RiseGroup } from "@/components/v2/Rise";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Drive With KUL",
  description:
    "Drive for a Georgia carrier that knows your name: honest dispatch, home time that holds, safe equipment, and room to grow. CDL-A.",
};

const CONTAINER = "mx-auto w-full max-w-[1760px] px-[clamp(20px,5vw,90px)]";
const GRID = "grid grid-cols-12 gap-x-[clamp(16px,1.4vw,24px)]";

/**
 * §4.6.2 — The deal ledger. Qualitative facts only: recomposed from the
 * v1 driver props + the public 2029 vision. NO pay figures — we have none
 * and invent nothing.
 */
const DEAL = [
  {
    index: "01",
    title: "A name, not a number",
    body: "You are a professional. Dispatch treats you like one — one line, straight answers.",
  },
  {
    index: "02",
    title: "Home time that holds",
    body: "Southeast regional lanes built around getting you home, and OTR when you want the miles.",
  },
  {
    index: "03",
    title: "Equipment that's ready",
    body: "Clean, DOT-compliant, maintained before it's ever your problem.",
  },
  {
    index: "04",
    title: "Room to grow",
    body: "Fifty tractors by the end of 2029. Early drivers grow with the fleet.",
  },
];

/** §4.6.4 — hiring steps (faq item 6 recompose), rendered by the shared ProcessStrip. */
const HIRING_STEPS = [
  { label: "The form", line: "Thirty seconds. Name, contact, CDL-A experience." },
  { label: "The call back", line: "A person, not a portal." },
  { label: "The talk", line: "Lanes, home time, equipment." },
];

export default function DriversPage() {
  return (
    <>
      {/* 1 — Recruiting hero. Gold: the hero CTA (nav CTA hidden <md; at top state on desktop). */}
      <div className="relative">
        <PageHero
          variant="photo"
          height="80"
          image={{
            src: "/images/stock/driver-portrait-semi-cab-night.jpg",
            alt: "A professional driver standing at his semi cab at night",
          }}
          eyebrow="Drive with KUL"
          titleLines={["Drive something", "worth driving."]}
          deck="CDL-A · Southeast regional & OTR · A thirty-second form, then a real call back."
        >
          <a href="#apply" className="btn-gold">
            Start the Conversation
          </a>
          <a
            href={site.phoneHref}
            className="link-hairline text-micro uppercase tabular-nums text-paper/80"
          >
            Or call {site.phone}
          </a>
        </PageHero>
        <HeroFrame />
      </div>

      {/* 2 — The deal ledger. Ink; zero gold. Eyebrow doubles as the page's
          first h2 so the h3 rows never skip a level (§2.1 heading law). */}
      <section
        data-ground="ink"
        className="relative overflow-hidden bg-ink py-band"
      >
        <div className={CONTAINER}>
          <div className={GRID}>
            <div className="col-span-12 lg:col-start-2 lg:col-end-12">
              <Eyebrow as="h2">What you get</Eyebrow>
              <RiseGroup className="mt-14">
                <ul>
                  {DEAL.map((row) => (
                    <Rise
                      as="li"
                      key={row.index}
                      className="relative border-t border-white/[0.12] py-[clamp(28px,5vh,52px)] last:border-b last:border-white/[0.12]"
                    >
                      <GhostNumeral className="left-0 top-1/2 -translate-y-1/2">
                        {row.index}
                      </GhostNumeral>
                      <div className="relative z-10 grid gap-y-3 md:grid-cols-12 md:gap-x-[clamp(16px,1.4vw,24px)]">
                        <p
                          aria-hidden
                          className="text-micro uppercase tabular-nums text-paper/40 md:col-span-1"
                        >
                          {row.index}
                        </p>
                        <h3 className="font-omnibus text-h3 text-cream md:col-span-5">
                          {row.title}
                        </h3>
                        <p className="max-w-[52ch] text-body text-paper/70 md:col-span-6">
                          {row.body}
                        </p>
                      </div>
                    </Rise>
                  ))}
                </ul>
              </RiseGroup>
            </div>
          </div>
        </div>
      </section>

      {/* 3 — Home base band. Photo/ink, melts into the paper zone below. Zero gold. */}
      <PhotoBand
        image={{
          src: "/images/stock/road-night-light-trails.jpg",
          alt: "Light trails from trucks running a highway at night",
        }}
        eyebrow="Home base"
        titleLines={["Loganville, Georgia."]}
        body="The Southeast is a home route. Nationwide when you want it."
        align="left"
        melt
      />

      {/* 4 — How it works. Paper; the shared ProcessStrip (§3.24). Zero gold. */}
      <section data-ground="paper" className="bg-paper py-band-sm">
        <div className={CONTAINER}>
          <div className={GRID}>
            <div className="col-span-12 lg:col-start-2 lg:col-end-12">
              <LineReveal
                as="h2"
                lines={["Four fields.", "Then a phone call."]}
                className="max-w-[14ch] font-omnibus text-h2 text-ink"
              />
              <div className="mt-14">
                <ProcessStrip steps={HIRING_STEPS} ground="paper" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5 — Apply. Paper; the form's gold submit pill is this viewport's
          whole gold spend (§3.20 — focus underlines are never gold). */}
      <section
        id="apply"
        data-ground="paper"
        className="scroll-mt-20 bg-paper py-band"
      >
        <div className={CONTAINER}>
          <div className={GRID}>
            <div className="col-span-12 lg:col-start-2 lg:col-end-9">
              <Eyebrow>Start the conversation</Eyebrow>
              <div className="mt-12">
                <DriverForm />
              </div>
              <p className="mt-10 text-micro uppercase text-ink/60">
                KUL Enterprises LLC is an equal opportunity employer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6 — Ending: the call band with the phone hairline draw. Zero gold. */}
      <CtaBand variant="call" />
    </>
  );
}
