import Image from "next/image";
import Link from "next/link";
import { services } from "@/lib/services";
import { CHAPTERS, GROUND_CLASS } from "@/lib/journey";
import { site } from "@/lib/site";
import content from "@/content/site.json";

/**
 * WHAT DROPS OUT OF THE BAR, PAGE BY PAGE
 *
 * Every link on the wide bar opens something, and no two open the same thing.
 * A dropdown that is a list of links under every heading is a sitemap with a
 * hover state; these are each built out of what their own page actually holds,
 * so the shape of the panel tells you where you are going before you read it.
 *
 *   Services        Seven photographs in a row you can push sideways.
 *   Drivers         A hiring notice: the status first, then what the seat asks
 *                   for, because the honest status is the news.
 *   Safety          The federal record as a plate, the two numbers set large,
 *                   and the link that lets a broker check them himself.
 *   Carrier Packet  A manifest, with a column saying what is already in the
 *                   packet and what has to be asked for.
 *   About           A calling card. One photograph, one line, three facts.
 *   The Journey     Six sleeves off the shelf, in order.
 *   Contact         Three lanes on one baseline, all of them live links.
 *
 * WHY THE SHAPES DIFFER RATHER THAN MATCH. The client rejected an earlier
 * version of this site as "templatey" because one skeleton was repeated
 * everywhere, and the same failure is available to a menu. A broker who opens
 * Safety and then opens Carrier Packet should be able to tell them apart with
 * the type blurred out.
 *
 * EVERY FIGURE HERE IS REAL and comes from content/site.json, lib/journey.ts or
 * the page it belongs to. Nothing in a menu may be written for the menu: if it
 * is not true on the page, it does not belong in the panel that opens onto it.
 *
 * THE PANELS ARE PLAIN SERVER MARKUP. The bar that opens them is a client
 * component and handles all the state; nothing in this file needs the browser,
 * so none of it is shipped as behaviour.
 */

/** The width the pill gives a panel to work in, matched across all of them. */
const PAD = "px-6 pb-7 pt-3";

/** A small capital label, used as the first line of most panels. */
function PanelLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="block pb-4 font-text text-k-micro uppercase text-k-ink-faint">
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Services                                                            */
/* ------------------------------------------------------------------ */

/**
 * Every service in one row. It scrolls sideways rather than shrinking the
 * cards, because seven cards small enough to fit a 1180px bar are too small to
 * show a photograph, and the photograph is the reason this panel is worth
 * opening rather than going to the page.
 */
export function ServicesPanel() {
  return (
    <div className="flex w-full gap-4 overflow-x-auto px-5 pb-6 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {services.map((service) => (
        <Link
          key={service.slug}
          href={`/services/${service.slug}`}
          className="flex w-[220px] shrink-0 flex-col gap-2.5"
        >
          <Image
            src={service.card}
            alt=""
            width={900}
            height={900}
            className="h-[150px] w-full rounded-2xl object-cover"
          />
          <span className="font-display text-[19px] font-black leading-6 tracking-[-0.02em] text-k-ink">
            {service.name}
          </span>
          <span className="font-text text-[12px] leading-[18px] text-k-ink-soft">
            {service.blurb}
          </span>
        </Link>
      ))}

      <Link
        href="/services"
        className="flex w-[180px] shrink-0 flex-col items-start justify-center gap-3 rounded-2xl border border-k-rule bg-k-paper px-5"
      >
        <span className="font-display text-[19px] font-black leading-6 tracking-[-0.02em] text-k-ink">
          Compare all
        </span>
        <span className="border-b border-k-gold pb-0.5 font-text text-k-label uppercase text-k-gold">
          View services
        </span>
      </Link>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Drivers                                                             */
/* ------------------------------------------------------------------ */

/**
 * The seat, and the fact that it is not open yet.
 *
 * The status goes first and in the largest type in the panel, because it is the
 * only thing a driver needs before deciding whether to read on, and because
 * burying it under a list of requirements would be the dishonest way round.
 * Everything here is lifted from the page it opens onto.
 */
export function DriversPanel() {
  return (
    <div className={PAD}>
      <PanelLabel>Driving for KUL</PanelLabel>

      <div className="flex flex-col gap-2 border-b border-k-rule pb-6 md:flex-row md:items-baseline md:justify-between md:gap-8">
        <p className="max-w-[34ch] font-display text-[21px] font-black leading-7 tracking-[-0.02em] text-k-ink">
          Applications are open now. The seat opens when the second truck does.
        </p>
        <Link
          href="/drivers"
          className="shrink-0 whitespace-nowrap border-b border-k-gold pb-0.5 font-text text-k-label uppercase text-k-gold"
        >
          Apply
        </Link>
      </div>

      <dl className="grid gap-x-10 gap-y-5 pt-6 md:grid-cols-3">
        {[
          ["The licence", "CDL-A, with a work history we can verify and a motor vehicle record we can pull."],
          ["The lanes", `Southeast regional out of ${site.location}, with over the road available.`],
          ["The pay", "Not published, because there is no honest number to publish yet."],
        ].map(([term, detail]) => (
          <div key={term}>
            <dt className="font-text text-k-micro uppercase text-k-gold">{term}</dt>
            <dd className="pt-2 font-text text-[13px] leading-5 text-k-ink-soft">{detail}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Safety                                                              */
/* ------------------------------------------------------------------ */

/**
 * The federal record, as a plate.
 *
 * The two numbers are the whole point of the panel and are set large in tabular
 * figures so a broker can read them off the screen into his own system without
 * loading the page. The link goes to the government's own lookup rather than to
 * a claim of ours, because a number anybody can check is worth more than a
 * sentence saying we are compliant.
 */
export function SafetyPanel() {
  return (
    <div className={PAD}>
      <PanelLabel>Operating authority</PanelLabel>

      <div className="flex flex-col gap-6 md:flex-row md:items-end md:gap-14">
        {[
          ["USDOT", content.usdot],
          ["MC", content.mc],
        ].map(([label, value]) => (
          <div key={label}>
            <span className="block font-text text-k-micro uppercase text-k-ink-faint">
              {label}
            </span>
            <span className="block pt-1 font-display text-[34px] font-black leading-none tracking-[-0.02em] tabular-nums text-k-ink">
              {value}
            </span>
          </div>
        ))}

        <p className="max-w-[30ch] font-text text-[13px] leading-5 text-k-ink-soft md:pb-1">
          Active authority, and insurance on file. Both are public, so check
          them rather than take our word for it.
        </p>

        <div className="flex flex-col gap-2.5 md:ml-auto md:items-end md:pb-1">
          <a
            href="https://safer.fmcsa.dot.gov/CompanySnapshot.aspx"
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap border-b border-k-gold pb-0.5 font-text text-k-label uppercase text-k-gold"
          >
            Verify on FMCSA SAFER
          </a>
          <Link
            href="/safety"
            className="whitespace-nowrap font-text text-k-label uppercase text-k-ink-soft"
          >
            How the truck is kept
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Carrier Packet                                                      */
/* ------------------------------------------------------------------ */

/**
 * A manifest, with a column for what is already in the packet.
 *
 * The right column is the useful part: it tells a broker which of the four
 * documents he can have immediately and which one needs a name on it first,
 * which is the question that would otherwise cost an email.
 */
export function CarrierPacketPanel() {
  return (
    <div className={PAD}>
      <PanelLabel>What the packet holds</PanelLabel>

      <ul className="border-t border-k-rule">
        {[
          ["Operating authority", "Public record"],
          ["W-9", "Signed, in the packet"],
          ["Certificate of insurance", "Issued to you by name"],
          ["Carrier or broker agreement", "Yours or ours"],
        ].map(([document, state]) => (
          <li
            key={document}
            className="flex items-baseline justify-between gap-6 border-b border-k-rule py-3"
          >
            <span className="font-text text-[14px] text-k-ink">{document}</span>
            <span className="shrink-0 font-text text-k-micro uppercase text-k-ink-faint">
              {state}
            </span>
          </li>
        ))}
      </ul>

      <Link
        href="/carrier-packet"
        className="mt-5 inline-block border-b border-k-gold pb-0.5 font-text text-k-label uppercase text-k-gold"
      >
        Request the packet
      </Link>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* About                                                               */
/* ------------------------------------------------------------------ */

/**
 * A calling card: one photograph, one line, three facts.
 *
 * The photograph is the oldest thing the company owns, which is the only image
 * on the site that earns a place in a menu.
 */
export function AboutPanel() {
  return (
    <div className={PAD}>
      <PanelLabel>The company</PanelLabel>

      <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-8">
        <Image
          src="/images/journey/s02-jamaica-childhood.webp"
          alt=""
          width={1291}
          height={1920}
          className="h-[104px] w-[104px] shrink-0 rounded-2xl object-cover"
        />

        <p className="max-w-[38ch] font-display text-[20px] font-black leading-7 tracking-[-0.02em] text-k-ink">
          One tractor, one driver, and a phone number that reaches the person
          driving it.
        </p>

        <dl className="flex gap-8 md:ml-auto">
          {[
            ["Based", site.location],
            ["Authority", "48 states"],
            ["Trading since", "2026"],
          ].map(([term, detail]) => (
            <div key={term}>
              <dt className="font-text text-k-micro uppercase text-k-ink-faint">{term}</dt>
              <dd className="whitespace-nowrap pt-1.5 font-text text-[14px] text-k-ink">
                {detail}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The Journey                                                         */
/* ------------------------------------------------------------------ */

/**
 * Six sleeves off the shelf, in order, straight to their chapter.
 *
 * They are read from the same lib/journey.ts the page reads, so a chapter
 * cannot be renamed in one place and go stale in the other. The three with no
 * photograph keep their typographic sleeve here too, at this size a strip of
 * six covers where three are type is the quickest way to see that the story has
 * gaps in it, which is the truth the page is built around.
 */
export function JourneyPanel() {
  return (
    <div className={PAD}>
      <PanelLabel>Six chapters</PanelLabel>

      <ul className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {CHAPTERS.map((chapter) => (
          <li key={chapter.n} className="w-[132px] shrink-0">
            <Link href={`/journey${chapter.href}`} className="group block">
              <span className="relative block aspect-square w-full overflow-hidden rounded-2xl">
                {chapter.cover ? (
                  <Image
                    src={chapter.cover}
                    alt=""
                    fill
                    sizes="132px"
                    className="object-cover"
                  />
                ) : (
                  <span
                    className={`absolute inset-0 flex items-end p-3 ${GROUND_CLASS[chapter.ground]}`}
                  >
                    <span className="font-text text-k-micro uppercase text-k-on-dark-faint">
                      No photograph
                    </span>
                  </span>
                )}
                <span className="absolute left-3 top-2.5 font-text text-k-micro uppercase tabular-nums text-k-on-dark">
                  {chapter.n}
                </span>
              </span>
              <span className="block pt-2.5 font-text text-[12px] leading-[17px] text-k-ink">
                {chapter.title}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Contact                                                             */
/* ------------------------------------------------------------------ */

/**
 * Three lanes on one baseline, every one of them a live link.
 *
 * This is the one panel that can finish the job without the page behind it
 * loading at all, which is the point of putting it in a menu.
 */
export function ContactPanel() {
  return (
    <div className={PAD}>
      <PanelLabel>Reach dispatch</PanelLabel>

      <div className="flex flex-col gap-5 md:flex-row md:items-baseline md:gap-14">
        <a href={site.phoneHref} className="group block">
          <span className="block font-text text-k-micro uppercase text-k-ink-faint">
            Phone
          </span>
          <span className="block pt-1 font-display text-[26px] font-black leading-none tracking-[-0.02em] tabular-nums text-k-ink">
            {content.phone}
          </span>
        </a>

        <a href={`mailto:${content.email}`} className="block">
          <span className="block font-text text-k-micro uppercase text-k-ink-faint">
            Email
          </span>
          <span className="block pt-1.5 font-text text-[15px] text-k-ink underline underline-offset-4">
            {content.email}
          </span>
        </a>

        <div>
          <span className="block font-text text-k-micro uppercase text-k-ink-faint">
            Based
          </span>
          <span className="block pt-1.5 font-text text-[15px] text-k-ink">
            {site.location}
          </span>
        </div>

        <Link
          href="/quote"
          className="whitespace-nowrap border-b border-k-gold pb-0.5 font-text text-k-label uppercase text-k-gold md:ml-auto"
        >
          Send a load
        </Link>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

/** Which panel each link opens. The bar looks a link up here by its key. */
export const NAV_PANELS = {
  services: ServicesPanel,
  drivers: DriversPanel,
  safety: SafetyPanel,
  "carrier-packet": CarrierPacketPanel,
  about: AboutPanel,
  journey: JourneyPanel,
  contact: ContactPanel,
} as const;

export type PanelKey = keyof typeof NAV_PANELS;
