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
 *   The Journey     Five act sleeves off the shelf, in order.
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
 * THE PANELS ARE MOSTLY PLAIN MARKUP. The bar that opens them is a client
 * component and handles the open state; the one behaviour in this file is the
 * journey sleeve's play-on-hover, which exists so nothing in a menu ever moves
 * without the reader asking it to.
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

      {/* The card at the end of the row. Both lines are centred in it rather
          than set against its left edge: it is the only tile in the row with
          no photograph, so its type is the whole of it, and type ranged left
          in a box this shape leaves the weight in one corner. */}
      <Link
        href="/services"
        className="flex w-[180px] shrink-0 flex-col items-center justify-center gap-3 rounded-2xl border border-k-rule bg-k-paper px-5 text-center"
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
        {/* This line has been cut back twice. It once read "The seat opens
            when the second truck does", then "read by the person you would be
            driving for"; the fleet count and the headcount both came off the
            site at the first walkthrough (project-docs/32).

            AND IT DOES NOT NAME A DATE. There is no start date anywhere in
            content/ or on /road-ahead, so a panel cannot invent one. */}
        <p className="max-w-[34ch] font-display text-[21px] font-black leading-7 tracking-[-0.02em] text-k-ink">
          Applications are open now, ahead of the next seat.
        </p>
        <Link
          href="/drivers"
          className="shrink-0 whitespace-nowrap border-b border-k-gold pb-0.5 font-text text-k-label uppercase text-k-gold"
        >
          Apply
        </Link>
      </div>

      {/* "The pay" was the third entry and went on 29 Jul 2026 with the matching
          one on the Drivers page. It said the figure was not published because
          there was no honest one to publish. True, and not a thing to put in
          front of a driver as one of the three facts about the seat. Pay is
          discussed on the call.

          The equipment took its place rather than the row dropping to two,
          because it is the third thing a driver actually asks after the licence
          and the lanes, and it matches what the Drivers page already says. */}
      <dl className="grid gap-x-10 gap-y-5 pt-6 md:grid-cols-3">
        {[
          ["The licence", "CDL-A, with a work history we can verify and a motor vehicle record we can pull."],
          ["The lanes", `Southeast regional out of ${site.location}, with over the road available.`],
          ["The equipment", "A 53 foot dry van behind a sleeper tractor, inspected before every dispatch."],
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
          // MC joins the plate only once it exists. The field sits empty in
          // site.json until the first tractor is registered.
          ...(content.mc ? [["MC", content.mc]] : []),
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
            <span className="sr-only"> (opens in a new tab)</span>
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
 * A calling card: the mark, one line, three facts.
 *
 * The image is the client's own full-colour lockup, the one file in the
 * supplied kit that is genuinely transparent (all four corners sample
 * rgba 0,0,0,0), so it sits on the panel without a box. Resized only,
 * never trimmed: trim() has cropped into the lion before. The label sits
 * on the RIGHT of this one panel, by client direction (2 Aug 2026).
 */
export function AboutPanel() {
  return (
    <div className={PAD}>
      <span className="block pb-4 text-right font-text text-k-micro uppercase text-k-ink-faint">
        About KUL
      </span>

      <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-8">
        <Image
          src="/images/brand/lockup-colour.webp"
          alt=""
          width={760}
          height={643}
          className="h-auto w-[132px] shrink-0"
        />

        {/* Mark's own subtitle for the About page. The line that lived here
            before it counted heads, and every headcount came off the site at
            his first walkthrough (project-docs/32). */}
        <p className="max-w-[38ch] font-display text-[20px] font-black leading-7 tracking-[-0.02em] text-k-ink">
          Built on Purpose. Guided by Integrity.
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
 * Five sleeves off the shelf, in order, each straight to the scene its act
 * opens on.
 *
 * They are read from lib/journey.ts, which zips the act structure with the
 * titles the CMS holds, so an act cannot be renamed in one place and go stale
 * in the other. The seventeen scenes divide into five acts at the page's own
 * curtains; seventeen menu items would be a table of contents, not a shelf.
 */
export function JourneyPanel() {
  return (
    // THE SLEEVES SHARE THE BAR RATHER THAN SITTING IN A ROW AT ONE END.
    //
    // They were 132px wide and fixed, which is 852px of content in a 1180px
    // pill, so the panel opened with a third of itself empty and white down
    // the right hand side. The client drew a line round it: the panel is
    // supposed to end where the chapters end.
    //
    // A panel narrower than the bar above it is not available here, because
    // both are drawn inside one pill that has to stay the width of the
    // navigation. So the chapters take the width instead. `basis-0 flex-1`
    // makes all five exactly equal and lets them divide whatever is left after
    // the gaps, at any pill width, which also means the covers arrive larger
    // than they were. Nothing scrolls: five is the whole set and always fits.
    <div className="px-6 pb-5 pt-3">
      <PanelLabel>Five acts</PanelLabel>

      <ul className="flex gap-3">
        {CHAPTERS.map((chapter) => (
          <li key={chapter.n} className="min-w-0 flex-1 basis-0">
            <Link
              href={`/journey${chapter.href}`}
              className="group block"
              // The clip runs only while this sleeve is under the pointer or
              // holding focus. Nothing in the menu moves on its own, so the
              // pause-control requirement never arises, and the film costs
              // nothing until somebody shows interest in exactly this act.
              onMouseEnter={(e) => {
                const v = e.currentTarget.querySelector("video");
                if (v) void v.play().catch(() => undefined);
              }}
              onMouseLeave={(e) => {
                e.currentTarget.querySelector("video")?.pause();
              }}
              onFocus={(e) => {
                const v = e.currentTarget.querySelector("video");
                if (v) void v.play().catch(() => undefined);
              }}
              onBlur={(e) => {
                e.currentTarget.querySelector("video")?.pause();
              }}
            >
              <span className="relative block aspect-square w-full overflow-hidden rounded-2xl">
                {/* ONE OF THE FIVE MOVES, AND IT IS THE ONE ABOUT DRIVING.
                    Five still photographs in a row reads as a contact sheet;
                    one of them running turns it into a shelf you want to take
                    something off. Which one is decided in lib/journey.ts and
                    not here, because the footage has to be of the act it
                    is on.

                    Every attribute below is doing a job. `poster` is the same
                    file the still sleeves use, so the tile is never empty
                    while the clip loads. `preload="metadata"` fetches the
                    header and not the video: this panel is behind a hover and
                    most visitors never open it, so pulling two megabytes on
                    every page load to decorate a menu would be indefensible.
                    `playsInline` stops iOS taking the clip fullscreen, `muted`
                    is what makes autoplay legal at all, and `tabIndex={-1}`
                    keeps a decorative element out of the tab order inside a
                    link that is already focusable.

                    ANYONE WHO HAS ASKED FOR REDUCED MOTION GETS THE POSTER.
                    That switch is in CSS, in app/globals.css, rather than in a
                    JavaScript branch here: useReducedMotion() returns false on
                    the server every time, so branching the markup on it would
                    ship the video to those readers and then take it away. */}
                {chapter.cover ? (
                  <>
                    <Image
                      src={chapter.cover}
                      alt=""
                      fill
                      sizes="200px"
                      className="object-cover"
                    />
                    {chapter.clip ? (
                      <video
                        className="kul-sleeve-clip absolute inset-0 h-full w-full object-cover"
                        src={chapter.clip}
                        poster={chapter.cover}
                        muted
                        loop
                        playsInline
                        preload="none"
                        tabIndex={-1}
                        aria-hidden="true"
                      />
                    ) : null}
                  </>
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
