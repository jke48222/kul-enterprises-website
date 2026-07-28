import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { services } from "@/lib/services";
import HeroVideo from "@/components/k/HeroVideo";
import Reveal from "@/components/k/Reveal";

/**
 * Home, the page a visitor lands on first.
 *
 * Designed against the Paper artboard "Home, desktop 1440"
 * (app.paper.design/file/01KYKPT9QPZPS05X9H4PH1FSGT). Paper is the design of
 * record; where the two disagree, the artboard is right.
 *
 * The page alternates registers deliberately: dark hero, daylight statement,
 * blueprint rig, daylight services, dark vision, warm story, charcoal footer.
 * Instrument-black is earned, never the default.
 *
 * A broker gets what KUL hauls and how to reach dispatch inside the first
 * screen. Everyone else is invited into the story, further down, optionally.
 */

/** Equipment tag closing each service row. Keyed to lib/services slugs. */
const EQUIPMENT: Record<string, string> = {
  "power-only": "Tractor only",
  "dry-van": "53 ft van",
  reefer: "Temp controlled",
  dedicated: "Recurring lanes",
  regional: "Southeast",
  expedited: "Time critical",
  otr: "48 states",
};

const CREDENTIALS = [
  `USDOT ${site.usdot}`,
  `MC ${site.mc}`,
  "Licensed & insured",
  "Dispatch answers 24/7",
] as const;

type Spec = {
  value: string;
  unit: string;
  label: string;
  accent?: boolean;
};

const SPECS: readonly Spec[] = [
  { value: "53", unit: " ft", label: "Dry van trailer" },
  { value: "45,000", unit: " lb", label: "Maximum payload" },
  { value: "48", unit: " states", label: "Operating authority" },
  { value: "1", unit: "", label: "Trucks today · 50 by 2029", accent: true },
];

export default function HomePage() {
  return (
    <>
      {/* Hero, the broker's one screen. */}
      <section className="relative flex min-h-[820px] flex-col justify-end overflow-hidden bg-k-void">
        <HeroVideo
          poster="/images/stock/kul-hero-poster.jpg"
          className="absolute inset-0 h-full w-full object-cover opacity-85"
        />
        {/* Directional scrim. Without it the headline collides with the
            trailer's own KUL livery and two wordmarks fight each other. */}
        <div
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.92)_0%,rgba(0,0,0,0.78)_34%,rgba(0,0,0,0.28)_62%,rgba(0,0,0,0.45)_100%)]"
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-64 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.75)_100%)]"
          aria-hidden="true"
        />

        <div className="relative mx-auto w-full max-w-[1440px] px-6 pb-16 pt-40 md:px-12 lg:px-24">
          <div className="flex max-w-[1120px] flex-col gap-8">
            <p className="flex items-center gap-4">
              <span className="h-px w-12 shrink-0 bg-k-gold-lit" aria-hidden="true" />
              <span className="font-text text-k-label uppercase text-k-gold-lit">
                {site.location} · {site.serviceArea}
              </span>
            </p>

            <h1 className="font-display text-k-d1 font-black text-k-on-dark">
              Every mile.
              <br />
              Driven personally.
            </h1>

            <p className="max-w-[620px] font-text text-k-lede text-k-on-dark-soft">
              One truck today. Fifty by 2029. The person who answers dispatch
              has already driven your lane. Eleven years of it, for other people,
              before building this.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/quote"
                className="rounded-full bg-k-on-dark px-8 py-4 font-text text-k-label uppercase text-k-ink transition-opacity duration-200 hover:opacity-85"
              >
                Request a quote
              </Link>
              <a
                href={site.phoneHref}
                className="rounded-full border border-k-on-dark-faint px-8 py-4 font-text text-k-label uppercase text-k-on-dark transition-colors duration-200 hover:border-k-on-dark"
              >
                Call dispatch · {site.phone}
              </a>
            </div>
          </div>
        </div>

        <div className="relative border-t border-white/15">
          <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-10 gap-y-2 px-6 py-5 md:px-12 lg:px-24">
            {CREDENTIALS.map((item) => (
              <span
                key={item}
                className="font-text text-k-micro uppercase tabular-nums text-k-on-dark-soft"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Statement, the trust thesis, stated plainly. */}
      <section className="bg-k-paper px-6 py-32 md:px-12 lg:px-24">
        <Reveal className="mx-auto flex max-w-[1248px] flex-col gap-12 lg:flex-row lg:gap-24">
          <h2 className="flex-1 font-display text-k-d2 font-black text-k-ink">
            A carrier is only as good as the person who answers the phone.
          </h2>
          <div className="flex w-full flex-col gap-5 lg:w-[400px] lg:shrink-0">
            <p className="font-text text-k-body text-k-ink-soft">
              Most carriers this size hand you a dispatcher who has never driven
              the lane. At KUL that person is Mark Brown, and he has driven it
              for eleven years.
            </p>
            <p className="font-text text-k-body text-k-ink-soft">
              One truck today, fifty by 2029. Everything on this site is written
              to where the company actually is, not where it would like to sound.
            </p>
            <Link
              href="/about"
              className="w-fit border-b border-k-gold pb-1 font-text text-k-label uppercase text-k-ink"
            >
              Read the full story
            </Link>
          </div>
        </Reveal>
      </section>

      {/* The rig, instrument register, the truck renders' first appearance. */}
      <section className="overflow-hidden bg-k-blueprint pt-28">
        <div className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-24">
          <p className="flex items-center gap-4 pb-12">
            <span className="h-px w-12 shrink-0 bg-k-gold-lit" aria-hidden="true" />
            <span className="font-text text-k-label uppercase text-k-gold-lit">
              The equipment
            </span>
          </p>
        </div>

        <Reveal className="mx-auto flex max-w-[1248px] justify-center px-6">
          <Image
            src="/images/truck/truck-body.webp"
            alt="KUL Enterprises tractor and 53-foot dry van trailer, side profile"
            width={1975}
            height={577}
            className="h-auto w-full max-w-[1248px]"
          />
        </Reveal>

        <div className="mt-16 grid grid-cols-2 border-t border-k-rule-dark lg:grid-cols-4">
          {SPECS.map((spec, i) => (
            <div
              key={spec.label}
              className={[
                "flex flex-col gap-2 px-6 py-8 md:px-10",
                i < SPECS.length - 1 ? "lg:border-r lg:border-k-rule-dark" : "",
              ].join(" ")}
            >
              <p
                className={`font-display text-k-d3 font-black tabular-nums ${
                  spec.accent ? "text-k-gold-lit" : "text-k-on-dark"
                }`}
              >
                {spec.value}
                {spec.unit ? (
                  <span className="font-text text-k-body font-normal tracking-normal text-k-on-dark-soft">
                    {spec.unit}
                  </span>
                ) : null}
              </p>
              <p className="font-text text-k-micro uppercase text-k-on-dark-faint">
                {spec.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Services, seven hairline rows. Deliberately not a card grid. */}
      <section className="bg-k-paper px-6 py-32 md:px-12 lg:px-24">
        <div className="mx-auto max-w-[1248px]">
          <Reveal className="flex flex-col gap-12 pb-14 lg:flex-row lg:items-end lg:justify-between lg:gap-24">
            <div className="flex flex-1 flex-col gap-5">
              <p className="flex items-center gap-4">
                <span className="h-px w-12 shrink-0 bg-k-gold" aria-hidden="true" />
                <span className="font-text text-k-label uppercase text-k-gold">
                  What we haul
                </span>
              </p>
              <h2 className="font-display text-k-d1 font-black text-k-ink">
                Seven ways to move it.
              </h2>
            </div>
            <p className="font-text text-k-body text-k-ink-soft lg:w-[380px] lg:shrink-0">
              Every service below is one truck and one driver today. If a lane
              needs more than that, we will tell you before you book, not after.
            </p>
          </Reveal>

          <ul className="border-t border-k-rule-strong">
            {services.map((service, i) => (
              <li key={service.slug}>
                <Link
                  href={`/services/${service.slug}`}
                  className="flex flex-col gap-3 border-b border-k-rule py-7 transition-colors duration-200 hover:bg-k-surface md:flex-row md:items-center md:gap-8"
                >
                  <span className="w-9 shrink-0 font-text text-k-micro uppercase tabular-nums text-k-gold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-k-d3 font-black text-k-ink md:w-[300px] md:shrink-0">
                    {service.name}
                  </span>
                  <span className="flex-1 font-text text-k-body text-k-ink-soft">
                    {service.short}
                  </span>
                  <span className="shrink-0 font-text text-k-micro uppercase text-k-ink-faint md:w-[150px] md:text-right">
                    {EQUIPMENT[service.slug]}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* The Road Ahead, the vision, made credible rather than boastful. */}
      <section className="relative flex min-h-[620px] items-center justify-center overflow-hidden bg-k-void px-6 py-28">
        <Image
          src="/images/stock/road-night-light-trails.jpg"
          alt=""
          fill
          className="object-cover opacity-60"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.25)_45%,rgba(0,0,0,0.8)_100%)]"
          aria-hidden="true"
        />
        <Reveal className="relative flex flex-col items-center gap-7 text-center">
          <p className="flex items-center gap-4">
            <span className="h-px w-12 shrink-0 bg-k-gold-lit" aria-hidden="true" />
            <span className="font-text text-k-label uppercase text-k-gold-lit">
              The road ahead
            </span>
          </p>
          <h2 className="max-w-[1040px] font-display text-k-d1 font-black text-k-on-dark">
            One truck, one customer, one promise kept.
          </h2>
          <p className="max-w-[620px] font-text text-k-lede text-k-on-dark-soft">
            Every great fleet begins that way. Fifty trucks by 2029 is the plan,
            and nothing on this page claims we are there yet.
          </p>
          <Link
            href="/road-ahead"
            className="mt-2 rounded-full border border-k-on-dark-faint px-8 py-4 font-text text-k-label uppercase text-k-on-dark transition-colors duration-200 hover:border-k-on-dark"
          >
            See the plan
          </Link>
        </Reveal>
      </section>

      {/* The Journey, an invitation, not a nav item. */}
      <section className="bg-k-warm px-6 py-28 md:px-12 lg:px-24">
        <Reveal className="mx-auto flex max-w-[1248px] flex-col items-center gap-12 lg:flex-row lg:gap-24">
          <Image
            src="/images/journey/jamaica-childhood.jpg"
            alt="Mark Brown and his sister in Jamaica, early 1980s"
            width={1291}
            height={1920}
            className="h-auto w-[280px] shrink-0 object-cover lg:w-[380px]"
          />
          <div className="flex flex-1 flex-col gap-6">
            <p className="flex items-center gap-4">
              <span className="h-px w-12 shrink-0 bg-k-gold" aria-hidden="true" />
              <span className="font-text text-k-label uppercase text-k-gold">
                Seventeen scenes · about twelve minutes
              </span>
            </p>
            <h2 className="font-display text-k-d2 font-black text-k-ink">
              Before the first truck, there was a boy on a plane.
            </h2>
            <p className="max-w-[560px] font-text text-k-body text-k-ink-soft">
              Jamaica. Construction sites every school holiday. The Air Force.
              Eleven years driving for other people. The Journey is the long
              version, told slowly and without embellishment, because the story does
              not need any.
            </p>
            <p className="max-w-[560px] font-text text-k-body text-k-ink-faint">
              You do not need to watch it to book a load. It is here for the
              people who want to know who is driving.
            </p>
            <Link
              href="/journey"
              className="w-fit border-b border-k-gold pb-1 font-text text-k-label uppercase text-k-ink"
            >
              Begin the journey
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
