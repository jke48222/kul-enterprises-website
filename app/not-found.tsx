import Link from "next/link";
import { site } from "@/lib/site";

/**
 * THE 404 PAGE
 *
 * What somebody sees when a link is wrong or a page has moved.
 *
 * It is written to be useful rather than clever. An earlier version said "the
 * freight is fine, the page isn't", which is a joke at the expense of somebody
 * who is already lost. This one says what happened in one sentence and then
 * gives them the four places they were most likely trying to reach.
 *
 * The root layout supplies the navigation and the footer, so this file is the
 * middle of the page only.
 */

/** The places worth offering somebody who has landed in the wrong place. */
const WAYS_BACK = [
  { href: "/services", label: "Services", note: "All seven, side by side" },
  {
    href: "/quote",
    label: "Request a quote",
    note: "Six fields, priced by a person",
  },
  { href: "/safety", label: "Safety", note: "Authority, insurance and policy" },
  { href: "/contact", label: "Contact", note: `Dispatch on ${site.phone}` },
] as const;

export default function NotFound() {
  return (
    <section className="flex min-h-[78svh] items-center bg-k-coal px-6 py-32 md:px-12 lg:px-24">
      <div className="mx-auto flex w-full max-w-[1248px] flex-col gap-12 lg:flex-row lg:items-start lg:gap-24">
        <div className="flex flex-col gap-6 lg:w-[520px] lg:shrink-0">
          <span
            className="font-display text-[clamp(6rem,16vw,13rem)] font-black leading-[0.82] tracking-[-0.035em] text-k-gold-lit"
            aria-hidden="true"
          >
            404
          </span>
          <h1 className="font-display text-k-d2 font-black text-k-on-dark">
            That page does not exist.
          </h1>
          <p className="max-w-[440px] font-text text-k-body text-k-on-dark-soft">
            The link may be out of date, or the page may have moved. Nothing is
            wrong with the freight.
          </p>
        </div>

        {/* The four places somebody was most likely heading for. */}
        <ul className="flex flex-1 flex-col border-t border-k-rule-dark">
          {WAYS_BACK.map((way) => (
            <li key={way.href}>
              <Link
                href={way.href}
                className="group flex items-baseline justify-between gap-8 border-b border-k-rule-dark py-6"
              >
                <span className="font-display text-k-d3 font-black text-k-on-dark transition-colors duration-200 group-hover:text-k-gold-lit">
                  {way.label}
                </span>
                <span className="text-right font-text text-k-small text-k-on-dark-soft">
                  {way.note}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
