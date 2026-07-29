import Link from "next/link";
import { site } from "@/lib/site";

/**
 * SITE FOOTER
 *
 * One full-bleed panel, lit from inside. The whole footer is a slowly shifting
 * warm gradient on a near-black ground: a broad flat pool of light across the
 * middle, corners falling away into deeper colour, drifting continuously so it
 * never settles into a picture you stop seeing. Everything else in the footer
 * sits on top of that light.
 *
 * TAKEN FROM waabi.ai, from a screen recording the client sent. Their footer is
 * the shifting gradient, a large display line top left, small print and two
 * underlined links beneath it, a link column to the right, the legal line at
 * the bottom left, and an enormous wordmark running off the right edge of the
 * frame. All of that is here.
 *
 * WHAT WAS CHANGED TO MAKE IT KUL'S RATHER THAN A COPY. Waabi's gradient is
 * pink and red, which would be a strange thing to find under a freight
 * carrier's DOT number. This one is built in the brand's own gold, the lit
 * value (#d6a145) that the design system reserves for dark grounds, mixed with
 * a paler amber and a deeper ember so the drift moves through related hues
 * rather than just getting brighter and dimmer. Waabi carry one link column;
 * KUL has three groups of links and every one of them had to survive, so it
 * has three. Waabi show three circular social buttons; KUL has no social
 * accounts recorded anywhere in content/ or lib/, so rather than invent
 * handles that would 404 there are no social buttons at all. If accounts are
 * opened later they belong beside the two contact links below the headline.
 *
 * WHY THE ENORMOUS MARK IS TYPE AND NOT A PICTURE. There are two candidate
 * assets and neither can do this job. public/images/brand/footer-lockup.webp
 * is a 1942x809 photograph with no alpha channel: laying it across the bottom
 * of the footer would paint an opaque black rectangle over the very gradient
 * it is meant to sit in. lockup-light.webp is a white knockout of the whole
 * lockup but it is only 320px square, so blown up to the width of the frame it
 * would be mush. So the mark is set in Archivo Black, which is the face the
 * design system chose precisely because it matches the drawn wordmark, and it
 * runs off the right edge the way the reference does.
 */

/**
 * The link groups. Every link that was in the footer before is still here and
 * still in the group it was in. The two contact links live under the headline
 * instead, in the reference's own position, which is why the third group holds
 * facts rather than links.
 */
const COLUMNS = [
  {
    heading: "Freight",
    links: [
      { href: "/services", label: "Services" },
      { href: "/safety", label: "Safety" },
      { href: "/carrier-packet", label: "Carrier Packet" },
      { href: "/quote", label: "Request a Quote" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/journey", label: "The Journey" },
      { href: "/road-ahead", label: "The Road Ahead" },
      { href: "/drivers", label: "Drivers" },
    ],
  },
] as const;

const LEGAL = [
  { href: "/privacy-policy", label: "Privacy" },
  { href: "/terms-conditions", label: "Terms" },
  { href: "/cookies", label: "Cookies" },
  { href: "/legal-notices", label: "Legal Notices" },
] as const;

/**
 * The ground the light is mixed into. A warm near-black rather than the neutral
 * charcoal the rest of the site uses for dark panels, because a gold glow over
 * a neutral grey goes muddy at the edges where the two meet.
 */
const GROUND = "#0a0806";

/**
 * THE THREE MOVING LAYERS, AND WHY THEIR ALPHAS ARE WHAT THEY ARE.
 *
 * Each of these is one radial gradient on its own element, and each element is
 * animated by transform and opacity alone (see app/globals.css). Nothing here
 * is repainted while it moves; the browser rasterises each gradient once and
 * then slides and fades the finished texture, which is why a permanently
 * animating full-width panel costs nothing.
 *
 * The alphas are not taste. Stacked at their worst case, all three at full
 * strength with their centres on top of one another, they composite to
 * rgb(73,53,26) over the ground above. That is the brightest pixel this footer
 * can ever produce, and it is the number every text colour below was measured
 * against. Raising any of these three alphas moves that number and breaks the
 * contrast of the small print, so if you brighten one, re-measure.
 *
 * The first is wide and flat on purpose. A tall ellipse reads as a spotlight;
 * a wide shallow one with a quick shoulder reads as a lit panel seen head on,
 * which is what the reference looks like.
 */
const GLOW_BOX =
  "radial-gradient(125% 56% at 50% 50%, rgba(214,161,69,0.18) 0%, rgba(214,161,69,0.115) 30%, rgba(176,104,26,0.055) 54%, rgba(120,66,14,0.018) 72%, rgba(10,8,6,0) 86%)";

const GLOW_CORE =
  "radial-gradient(72% 40% at 46% 47%, rgba(255,206,122,0.09) 0%, rgba(255,176,74,0.05) 40%, rgba(255,176,74,0) 76%)";

const GLOW_EMBER =
  "radial-gradient(80% 46% at 62% 56%, rgba(176,74,16,0.07) 0%, rgba(122,48,10,0.035) 45%, rgba(122,48,10,0) 78%)";

/**
 * The falloff into the corners, static. It only ever darkens, so it cannot
 * push the worst case above the figure quoted for the three layers, and it is
 * what turns a pool of light into the inside of a box.
 */
const VIGNETTE =
  "radial-gradient(125% 92% at 50% 48%, rgba(10,8,6,0) 38%, rgba(8,6,4,0.42) 76%, rgba(6,5,3,0.86) 100%)";

export default function Footer() {
  return (
    <footer
      className="relative isolate overflow-hidden"
      style={{ backgroundColor: GROUND }}
    >
      {/* The lit box. Every layer is inset well outside the frame so the drift
          never drags an edge into view, and the footer's own overflow clip
          takes care of the rest. It is decoration, so it is skipped entirely
          by assistive technology. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="kul-footer-box absolute inset-[-25%]"
          style={{ backgroundImage: GLOW_BOX }}
        />
        <div
          className="kul-footer-core absolute inset-[-25%]"
          style={{ backgroundImage: GLOW_CORE }}
        />
        <div
          className="kul-footer-ember absolute inset-[-25%]"
          style={{ backgroundImage: GLOW_EMBER }}
        />
        <div className="absolute inset-0" style={{ backgroundImage: VIGNETTE }} />
      </div>

      <div className="relative px-6 pt-24 md:px-12 md:pt-28 lg:px-24 lg:pt-32">
        <div className="mx-auto flex max-w-[1248px] flex-col gap-16 lg:flex-row lg:justify-between lg:gap-24">
          <div className="max-w-[540px]">
            <h2 className="font-display text-k-d1 font-black text-k-on-dark">
              Ready when you are.
            </h2>
            {/* The reference sets one small line here and then hangs its two
                underlined links off the end of it, so the sentence and the
                links read as one thought. Same here: the sentence ends in
                "directly at" and the address and the number finish it. */}
            <p className="max-w-[420px] pt-6 font-text text-k-body text-k-on-dark-soft">
              Reach the person who drives the truck directly at
            </p>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-4">
              <a
                href={`mailto:${site.email}`}
                className="link-hairline link-hairline-active font-text text-k-body text-k-on-dark transition-colors duration-200 hover:text-k-gold-lit"
              >
                {site.email}
              </a>
              <a
                href={site.phoneHref}
                className="link-hairline link-hairline-active font-text text-k-body tabular-nums text-k-on-dark transition-colors duration-200 hover:text-k-gold-lit"
              >
                {site.phone}
              </a>
            </div>

            <Link
              href="/quote"
              className="mt-10 inline-flex rounded-full bg-k-on-dark px-8 py-4 font-text text-k-label uppercase text-k-ink transition-opacity duration-200 hover:opacity-85"
            >
              Request a quote
            </Link>
          </div>

          {/* The link groups. Two across on a phone so the columns stay wide
              enough to read a label like "Carrier Packet" without it wrapping
              to three lines, three across from tablet up. */}
          <div className="grid grid-cols-2 gap-x-10 gap-y-12 sm:grid-cols-3 lg:gap-x-16">
            {COLUMNS.map((col) => (
              <div key={col.heading} className="flex flex-col gap-4">
                <h3 className="font-text text-k-micro uppercase text-k-on-dark-soft">
                  {col.heading}
                </h3>
                {col.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="font-text text-k-small text-k-on-dark transition-colors duration-200 hover:text-k-gold-lit"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}

            <div className="flex flex-col gap-4">
              <h3 className="font-text text-k-micro uppercase text-k-on-dark-soft">
                Dispatch
              </h3>
              <p className="font-text text-k-small text-k-on-dark">
                {site.location}
              </p>
              <p className="font-text text-k-small text-k-on-dark">
                {site.serviceArea}
              </p>
            </div>
          </div>
        </div>

        {/* The legal line. The authority numbers are the reason this row exists
            at all: a broker checking the carrier reads USDOT and MC here before
            anything else on the page. */}
        <div className="mx-auto mt-20 flex max-w-[1248px] flex-col gap-5 border-t border-k-rule-dark pt-7 md:flex-row md:items-center md:justify-between md:gap-10">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
            <span className="font-text text-k-micro uppercase text-k-on-dark-soft">
              © {new Date().getFullYear()} {site.legalName}
            </span>
            <span className="font-text text-k-micro uppercase tabular-nums text-k-on-dark-soft">
              USDOT {site.usdot}
            </span>
            <span className="font-text text-k-micro uppercase tabular-nums text-k-on-dark-soft">
              MC {site.mc}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-7 gap-y-2">
            {LEGAL.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-text text-k-micro uppercase text-k-on-dark-soft transition-colors duration-200 hover:text-k-on-dark"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* THE MARK, AT THE SIZE OF THE FRAME.
          It starts at the page gutter and runs off the right edge, where the
          footer's overflow clip cuts it. It is deliberately NOT held inside the
          1248px column the rest of the footer uses: on a wide screen the mark
          would then start a long way in from the left and stop short, and the
          whole point of the device is that it is the width of the frame rather
          than the width of the text column.

          HOW MUCH IS CUT IS FIXED, AND THAT TOOK SOME ARITHMETIC. Half a letter
          is the figure that matters. Cut a whole letter and the name reads as
          "KUL ENTERPRISE", which is a spelling mistake rather than a bleed; cut
          almost nothing and it reads as a mark that happens to fit. Sizing this
          in plain vw does not hold that, because the gutter on its left is in
          pixels and steps at each breakpoint while the type scales smoothly.
          Measured, a flat 10.1vw cut 0.09 of a letter at 767px and a whole
          letter at 1024px, which is the entire range from invisible to wrong.

          So the size is derived from the space the mark actually has. Measured
          on the rendered page, "KUL ENTERPRISES" in Archivo Black 900 at
          -0.045em is 9.65em wide and its S is 0.677em. Solving those two for a
          constant six-tenths-of-an-S overhang gives the divisor 9.244 below,
          and the only thing that changes per breakpoint is the gutter being
          subtracted. It now cuts 0.60 of the S at 390, 767, 1024, 1440 and
          1920 alike. Re-measure both em figures if the display face changes;
          they are properties of Archivo Black and of nothing else.

          The white is held slightly off full strength so the mark belongs to
          the lit ground behind it instead of competing with the headline. At
          this size it is large text, which needs 3:1; it measures 8.87:1
          against the brightest the gradient can reach. */}
      <div className="relative select-none pb-7 pl-6 pt-14 md:pb-9 md:pl-12 md:pt-16 lg:pl-24">
        <span
          className="block whitespace-nowrap font-display font-black leading-[0.78] text-[calc((100vw_-_24px)/9.244)] md:text-[calc((100vw_-_48px)/9.244)] lg:text-[calc((100vw_-_96px)/9.244)]"
          style={{ color: "rgba(252,252,252,0.86)", letterSpacing: "-0.045em" }}
        >
          KUL ENTERPRISES
        </span>
      </div>
    </footer>
  );
}
