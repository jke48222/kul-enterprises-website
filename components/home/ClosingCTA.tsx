import Link from "next/link";
import { site } from "@/lib/site";
import { Reveal } from "@/components/motion/Reveal";

/** Closing dual CTA. The last thought should be "I trust them." */
export default function ClosingCTA() {
  return (
    <section className="bg-ink">
      <div className="mx-auto max-w-content px-6 py-28 md:py-36">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow text-graywarm">Ready when you are</p>
          <h2 className="mt-5 font-display text-display-l font-bold text-white">
            Put your freight behind a name that keeps its word.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-graywarm-light">
            One call reaches dispatch, day or night. One short form starts
            the lane.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/concept/quote" className="btn-gold">
              Request a Freight Quote
            </Link>
            <Link href="/concept/careers" className="btn-ghost-dark">
              Drive for KUL
            </Link>
          </div>
          <p className="mt-8 text-sm text-graywarm">
            Or call dispatch directly:{" "}
            <a
              href={site.phoneHref}
              className="font-semibold text-white underline-offset-4 hover:underline"
            >
              {site.phone}
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
