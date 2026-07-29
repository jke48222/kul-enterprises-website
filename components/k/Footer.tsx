import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";

/**
 * SITE FOOTER
 *
 * One full-bleed panel, lit from inside, with the brand lockup sitting in the
 * bottom right corner at the size of the frame.
 *
 * BUILT 1:1 ON waabi.ai, from a screen recording the client sent. Their footer
 * is: a slowly shifting gradient behind everything; a display line top left; a
 * short bold sentence under it that runs straight into two underlined links; a
 * single column of page links to the right of centre under a small muted
 * label; badges at the top right; a two line legal stack at the bottom left;
 * and the mark, very large, at the bottom right, ending on the right gutter
 * rather than bleeding off it. Every one of those is here, in that order, at
 * those positions.
 *
 * THE THREE PLACES IT DEPARTS FROM THE REFERENCE, AND WHY.
 *
 * The ground is near-black rather than a coloured wash, and this is the second
 * time it has been rebuilt. Waabi's pink and red would be a strange thing to
 * find under a freight carrier's DOT number, so the first rebuild put the same
 * light in the brand's gold instead. The client rejected that too, and looking
 * at what actually works, they were right: on Legend and on FLORA, both pulled
 * from Mobbin as references for this, the footer is almost entirely black and
 * the photograph in it is the only source of light in the frame. A large
 * coloured gradient is what a page does when it has no image worth lighting;
 * this one has the lockup. So the wash is now barely there, the strongest
 * light in the panel sits directly under the mark, and the corner the mark
 * occupies is the only part that is really lit.
 *
 * Waabi's badge slot holds three circular social buttons. KUL has no social
 * accounts recorded anywhere in content/ or lib/, and inventing handles would
 * put three links that 404 in the most trusted corner of the page. What goes
 * in that slot instead is the thing a broker is actually looking for down
 * here: the operating authority, with the federal lookup that proves it. Same
 * position, same weight, same job of saying who this is to somebody who has
 * not met them. If accounts are opened later they belong beside the two
 * contact links under the headline, not here.
 *
 * The mark is the photographed lockup rather than a wordmark. See the note
 * above THE MARK below for how an opaque image sits on a moving gradient.
 */

/**
 * One column of page links, because the reference has one. Everything a
 * visitor might still want is in it, in the order a stranger reads the
 * company: what it hauls, whether it is safe, what to send a broker, who it
 * is, where it came from, where it is going, who it is hiring, how to talk.
 */
const PAGES = [
  { href: "/services", label: "Services" },
  { href: "/safety", label: "Safety" },
  { href: "/carrier-packet", label: "Carrier Packet" },
  { href: "/about", label: "About" },
  { href: "/journey", label: "The Journey" },
  { href: "/road-ahead", label: "The Road Ahead" },
  { href: "/drivers", label: "Drivers" },
  { href: "/contact", label: "Contact" },
] as const;

const LEGAL = [
  { href: "/privacy-policy", label: "Privacy" },
  { href: "/terms-conditions", label: "Terms" },
  { href: "/cookies", label: "Cookies" },
  { href: "/legal-notices", label: "Legal Notices" },
] as const;

/** The carrier snapshot, keyed to the DOT number in content/site.json. */
const SAFER = `https://safer.fmcsa.dot.gov/query.asp?searchtype=ANY&query_type=queryCarrierSnapshot&query_param=USDOT&query_string=${site.usdot}`;

/* ==================================================================== */
/* THE LIGHT, AND WHERE EVERY COLOUR IN IT CAME FROM                    */
/* ==================================================================== */
/*
 * Nothing below was picked by eye. The whole footer is mixed from the
 * photograph that sits in the corner of it, so that the image has no edge:
 * public/images/brand/footer-lockup.webp was read pixel by pixel and its own
 * palette is what the panel is painted in.
 *
 *   The ground              #050301, the mean of every pixel in the file
 *                           under luminance 14, which is 1,331,893 of them.
 *                           That is the forest the lockup was shot in, so the
 *                           footer and the photograph are now standing on
 *                           literally the same colour and the seam is gone.
 *   The ember ramp          #271606, #472607, #683606, #773804. The four most
 *                           common lit tones in the file, in order, which is
 *                           the sunlight coming through the canopy.
 *   The mean lit colour     #583b1d, used for the broad wash.
 *   The sun                 The file's brightest pixel is pure white, and its
 *                           bloom runs out through #d6a145, which is the
 *                           brand's own lit gold. That is not a coincidence
 *                           worth ignoring, so the highlight is the token.
 *
 * The layers are positioned to continue the photograph rather than to sit
 * beside it. Its sun is up and to the right of its own frame, and the frame is
 * in the bottom right of the footer, so the ember pool is centred at 70% by
 * 66% and the bloom just above it. Light appears to be coming out of the
 * picture and spilling across the panel, instead of the picture being pasted
 * onto a lit rectangle.
 */

/** The photograph's own shadow colour. Change this and the seam comes back. */
const GROUND = "#050301";

/**
 * THE FOUR MOVING LAYERS, AND WHY THEIR ALPHAS ARE WHAT THEY ARE.
 *
 * Each is one radial gradient on its own element, animated by transform and
 * opacity alone (see app/globals.css). Nothing is repainted while it moves;
 * the browser rasterises each gradient once and then slides and fades the
 * finished texture, which is why a permanently animating full-width panel
 * costs nothing.
 *
 * THE ALPHAS ARE NOT TASTE, AND THEY ARE NOT FREE EITHER. Stacked at their
 * worst case, all four at full strength with their centres on top of one
 * another, they composite to rgb(69,48,25), luminance 0.0345. That is the
 * brightest pixel this footer can produce and it is the number every colour in
 * it was measured against. The centres are not actually on top of one another
 * and the drift is only five per cent, so this is a bound rather than a
 * reading, which is the right way round.
 *
 * THE PREVIOUS VERSION WAS TOO BRIGHT FOR THE SITE'S OWN TOKENS, and this one
 * is not, which is worth recording because it is the strongest argument for
 * the restraint. At rgb(100,65,28) the panel put --color-on-dark-soft at
 * 3.82:1 and --color-gold-lit at 3.91:1, both under the 4.5:1 that small text
 * needs, and both had to be replaced with brighter one-off values that existed
 * nowhere else in the design system. At rgb(69,48,25) they measure 5.23:1 and
 * 5.35:1, so the one-offs are gone and the footer is back on the same colours
 * as every other dark panel on the site. --color-on-dark-faint is 3.70:1 and
 * is only ever a border here, which needs 3:1.
 *
 * If any alpha below is raised, re-measure on-dark-soft first: it is the
 * closest to the floor and it is the one that broke last time.
 *
 * The first layer is wide and flat on purpose. A tall ellipse reads as a
 * spotlight; a wide shallow one with a quick shoulder reads as a lit panel
 * seen head on, which is what the reference looks like.
 */
const GLOW_BOX =
  "radial-gradient(120% 58% at 46% 56%, rgba(70,58,44,0.20) 0%, rgba(48,38,26,0.12) 38%, rgba(24,18,12,0.05) 64%, rgba(5,3,1,0) 84%)";

/** The pool the lockup stands in, anchored on the picture's own corner. */
const GLOW_EMBER =
  "radial-gradient(58% 46% at 74% 72%, rgba(119,56,4,0.30) 0%, rgba(88,44,8,0.15) 40%, rgba(40,20,4,0.05) 68%, rgba(5,3,1,0) 86%)";

/** The bloom, carrying the photograph's sun out into the panel. */
const GLOW_SUN =
  "radial-gradient(34% 26% at 72% 66%, rgba(214,161,69,0.17) 0%, rgba(180,116,36,0.07) 44%, rgba(150,88,20,0) 76%)";

/** A cooler counterweight, so the warmth has something to be warm against. */
const GLOW_DEEP =
  "radial-gradient(58% 40% at 20% 34%, rgba(40,44,52,0.20) 0%, rgba(22,24,30,0.09) 48%, rgba(5,3,1,0) 80%)";

/**
 * The falloff into the corners, static. It only ever darkens, so it cannot
 * push the worst case above the figure quoted for the four layers, and it is
 * what turns a pool of light into the inside of a box.
 */
const VIGNETTE =
  "radial-gradient(128% 96% at 54% 52%, rgba(5,3,1,0) 34%, rgba(5,3,1,0.40) 72%, rgba(4,2,1,0.88) 100%)";

/* THREE ONE-OFF COLOURS USED TO LIVE HERE and they are gone as of the second
   rebuild. #c8c4bd, #e8bc72 and #a8a29a existed only because the previous,
   much brighter ground pushed --color-on-dark-soft, --color-gold-lit and
   --color-on-dark-faint under their contrast minimums, and a panel that has to
   invent its own greys is a panel that is fighting the design system. Turning
   the light down fixed the cause instead of the symptom. Do not reintroduce
   them without re-reading the measurement note above. */

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
          className="kul-footer-ember absolute inset-[-25%]"
          style={{ backgroundImage: GLOW_EMBER }}
        />
        <div
          className="kul-footer-core absolute inset-[-25%]"
          style={{ backgroundImage: GLOW_SUN }}
        />
        <div
          className="kul-footer-deep absolute inset-[-25%]"
          style={{ backgroundImage: GLOW_DEEP }}
        />
        <div className="absolute inset-0" style={{ backgroundImage: VIGNETTE }} />
      </div>

      <div className="relative px-6 pb-10 pt-24 md:px-12 md:pt-28 lg:px-24 lg:pt-32">
        <div className="mx-auto max-w-[1248px]">
          {/* THE TOP ROW. Three cells across, exactly as the reference: the
              headline block, the page column, the badge. Below lg they stack
              in that same order, which is also the order of usefulness. */}
          <div className="flex flex-col gap-14 lg:flex-row lg:justify-between lg:gap-16">
            <div className="max-w-[460px]">
              <h2 className="font-display text-k-d2 font-black text-k-on-dark">
                Ready when you are.
              </h2>

              {/* The reference sets one short bold line here and hangs its two
                  underlined links off the end of it, so the sentence and the
                  links read as one thought rather than a label above a list.
                  Same here: the sentence ends on "directly at" and the address
                  and the number finish it. */}
              <p className="pt-7 font-text text-k-small font-semibold text-k-on-dark">
                Reach dispatch directly at
              </p>
              <p className="flex flex-wrap items-center gap-x-3 gap-y-2 pt-2">
                <a
                  href={`mailto:${site.email}`}
                  className="font-text text-k-small text-k-on-dark-soft underline underline-offset-4 transition-colors duration-200 hover:text-k-gold-lit"
                >
                  {site.email}
                </a>
                <span
                  aria-hidden="true"
                  className="font-text text-k-small text-k-on-dark-soft"
                >
                  |
                </span>
                <a
                  href={site.phoneHref}
                  className="font-text text-k-small tabular-nums text-k-on-dark-soft underline underline-offset-4 transition-colors duration-200 hover:text-k-gold-lit"
                >
                  {site.phone}
                </a>
              </p>
            </div>

            {/* The page column. One column, one small muted label above it,
                links at reading size rather than the small caps the rest of
                the site uses for navigation: in the reference these are the
                largest text in the footer after the headline, and that is what
                makes the footer usable rather than decorative. */}
            <nav aria-label="Footer" className="lg:pt-1">
              <h3 className="font-text text-k-micro uppercase text-k-on-dark-soft">
                Company
              </h3>
              <ul className="flex flex-col gap-1.5 pt-5">
                {PAGES.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-text text-k-lede text-k-on-dark transition-colors duration-200 hover:text-k-gold-lit"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* THE AUTHORITY, IN THE SLOT THE REFERENCE GIVES ITS BADGES.
                Two numbers and the government page that carries them. The
                numbers are set large enough to be read off the screen and
                copied into a broker's own system, which is the only thing
                anybody does with them, and they are tabular so the digits line
                up under each other. */}
            <div className="lg:pt-1">
              <h3 className="font-text text-k-micro uppercase text-k-on-dark-soft">
                Operating authority
              </h3>
              <dl className="flex gap-8 pt-5 lg:flex-col lg:gap-3">
                <div>
                  <dt className="font-text text-k-micro uppercase text-k-on-dark-soft">
                    USDOT
                  </dt>
                  <dd className="font-display text-k-d3 font-black tabular-nums text-k-on-dark">
                    {site.usdot}
                  </dd>
                </div>
                <div>
                  <dt className="font-text text-k-micro uppercase text-k-on-dark-soft">
                    MC
                  </dt>
                  <dd className="font-display text-k-d3 font-black tabular-nums text-k-on-dark">
                    {site.mc}
                  </dd>
                </div>
              </dl>
              <a
                href={SAFER}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-full border border-k-on-dark-faint px-5 py-2.5 font-text text-k-micro uppercase text-k-on-dark transition-colors duration-200 hover:border-k-gold-lit hover:text-k-gold-lit"
              >
                Verify on FMCSA
                <span aria-hidden="true">&#8599;</span>
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>
          </div>

          {/* THE BOTTOM ROW. Legal on the left in two lines, the mark on the
              right, their baselines close to level, which is the arrangement
              that makes the corner read as signed rather than as leftovers. */}
          <div className="flex flex-col gap-10 pt-20 lg:flex-row lg:items-end lg:justify-between lg:gap-16 lg:pt-4">
            <div className="flex flex-col gap-2.5 lg:pb-2">
              <p className="font-text text-k-micro uppercase text-k-on-dark-soft">
                © {new Date().getFullYear()} {site.legalName} · {site.location}
              </p>
              <p className="flex flex-wrap items-center gap-x-6 gap-y-2">
                {LEGAL.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="font-text text-k-micro uppercase text-k-on-dark-soft transition-colors duration-200 hover:text-k-on-dark"
                  >
                    {link.label}
                  </Link>
                ))}
              </p>
            </div>

            {/* THE MARK.
                The reference ends its wordmark on the right gutter rather than
                running it off the edge, so this does too.

                HOW AN OPAQUE PHOTOGRAPH SITS ON A MOVING GRADIENT. This file
                has no alpha channel, so dropped in normally it paints a black
                rectangle over the very light it is supposed to be lit by. It
                is composited in screen instead, which is the blend that treats
                black as nothing: measured, 82.7% of this image is under
                luminance 12 and all four corners are exactly rgb(0,0,0), so
                the forest it was shot in disappears completely and only the
                lockup, the lion and the sunbeams come through, glowing out of
                the footer's own gold. Nothing is masked and no edge is cut.

                The footer carries `isolate` so the blend reaches the gradient
                and the ground beneath it and stops there, rather than reaching
                through to the page behind the footer.

                THE MASK IS NOT BELT AND BRACES. Screen disposes of the pure
                black, but the forest canopy either side of the lockup sits
                around luminance 20 to 40, which is not nothing: it lifts the
                ground just enough that the image reads as a faint lit
                rectangle sitting on the footer, and a rectangle is exactly
                what this device must not look like. So the edges are faded
                out. The percentages are chosen against the content, which
                measured column by column starts at 56% across, so the left
                fade finishes well before the lockup begins and never touches
                the lion.

                THE RIGHT EDGE WAS LEFT UNMASKED AT FIRST AND THAT WAS WRONG.
                The reasoning was that it is already black so it cannot show a
                seam, and the client drew a box round the seam it shows. The
                image ends on the page gutter rather than running off the
                screen, so unlike the bottom it has a visible edge, and the
                canopy behind the lion runs right up to it: a straight vertical
                cut, faint but perfectly straight, is the one shape the eye
                finds in a field of noise. Nine per cent is enough to lose it
                and stops well short of the lion's mane. The bottom is still
                unmasked, correctly, because it is the edge the mark stands on.

                It is decoration and the company name is already set in the
                legal line directly beside it, so it is given an empty alt
                rather than a description nobody needs read twice. */}
            <div
              className="pointer-events-none w-full shrink-0 select-none lg:w-[min(700px,54vw)]"
              style={{
                mixBlendMode: "screen",
                maskImage:
                  "linear-gradient(to right, transparent 6%, #000 50%), linear-gradient(to bottom, transparent 0%, #000 38%), linear-gradient(to left, transparent 0%, #000 9%)",
                maskComposite: "intersect",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent 6%, #000 50%), linear-gradient(to bottom, transparent 0%, #000 38%), linear-gradient(to left, transparent 0%, #000 9%)",
                WebkitMaskComposite: "source-in",
              }}
              aria-hidden="true"
            >
              <Image
                src="/images/brand/footer-lockup.webp"
                alt=""
                width={1942}
                height={809}
                sizes="(min-width: 1024px) 620px, 100vw"
                className="h-auto w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
