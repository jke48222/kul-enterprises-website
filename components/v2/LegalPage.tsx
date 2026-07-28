"use client";

/**
 * LegalPage — §4.10. The shared template for privacy-policy,
 * terms-conditions, cookies, legal-notices, and climate-statement.
 *
 *  1. Header band (ink): plain Eyebrow, H1 LineReveal in display-l,
 *     "Last updated" micro, and the byline gold rule — the page's SINGLE
 *     gold element (§2.4).
 *  2. Body (paper): 68ch document column; sentence-case section headings
 *     (h2 wearing h3 clothes so heading order never skips — §2.1) with a
 *     tabular micro index beside; slugged anchors; a lg: sticky mini-TOC
 *     rail in the free right gutter when sections ≥ 3, scroll-spied
 *     (active item ink, never gold). Body renders instantly — the single
 *     Rise lives on the header only.
 *  3. Index band (ink): links to the other four legal documents + the
 *     dispatch email. The curtain Footer follows from the layout.
 *
 * `pull` (climate-statement) renders as an Omnibus pull-quote on paper
 * before the body.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Eyebrow } from "@/components/v2/Eyebrow";
import { LineReveal } from "@/components/v2/LineReveal";
import { Rise } from "@/components/v2/Rise";
import { site } from "@/lib/site";

export type LegalPageProps = {
  eyebrow: string;
  title: string;
  updated: string; // REQUIRED per page, no default
  sections: { heading: string; body: React.ReactNode }[];
  pull?: string; // optional pull-quote (climate)
};

const CONTAINER = "mx-auto w-full max-w-[1760px] px-[clamp(20px,5vw,90px)]";

const LEGAL_DOCS = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-conditions", label: "Terms & Conditions" },
  { href: "/cookies", label: "Cookies" },
  { href: "/legal-notices", label: "Legal Notices" },
  { href: "/climate-statement", label: "Climate Statement" },
];

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export function LegalPage({
  eyebrow,
  title,
  updated,
  sections,
  pull,
}: LegalPageProps) {
  const pathname = usePathname();
  const ids = sections.map((s) => slugify(s.heading));
  const [active, setActive] = useState<string>(ids[0] ?? "");
  const showToc = sections.length >= 3;

  // Scroll-spy for the mini-TOC rail: watch each section heading crossing
  // the upper viewport band.
  useEffect(() => {
    if (!showToc || typeof IntersectionObserver === "undefined") return;
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-legal-section]"),
    );
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-15% 0px -70% 0px" },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [showToc]);

  return (
    <>
      {/* 1 — header band */}
      <section data-ground="ink" className="bg-ink pb-band-sm pt-32">
        <div className={CONTAINER}>
          <Rise>
            <div>
              <Eyebrow>{eyebrow}</Eyebrow>
              <LineReveal
                as="h1"
                lines={[title]}
                delay={0.15}
                className="mt-6 max-w-[16ch] font-omnibus text-display-l text-cream"
              />
              <p className="mt-6 text-micro uppercase text-paper/60">
                Last updated {updated}
              </p>
              {/* The byline rule — the page's single gold element (§2.4). */}
              <div aria-hidden className="mt-6 h-px w-full bg-gold/70" />
            </div>
          </Rise>
        </div>
      </section>

      {/* 2 — document body (instant; utility documents don't do per-section reveals) */}
      <section data-ground="paper" className="bg-paper py-band-sm">
        <div className={CONTAINER}>
          {pull && (
            <p className="mb-band-sm max-w-[26ch] font-omnibus text-h2 text-ink">
              {pull}
            </p>
          )}
          <div className="grid grid-cols-1 gap-x-[clamp(16px,1.4vw,24px)] lg:grid-cols-12">
            <div className="lg:col-span-8 xl:col-span-7">
              <div className="max-w-[68ch]">
                {sections.map((s, i) => {
                  const id = ids[i];
                  return (
                    <section
                      key={id}
                      id={id}
                      data-legal-section
                      className="scroll-mt-28 border-t border-ink/15 py-10 first:border-t-0 first:pt-0"
                    >
                      <div className="flex items-baseline gap-4">
                        <span
                          aria-hidden
                          className="shrink-0 text-micro tabular-nums text-ink/60"
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {/* h2 at h3 scale — keeps heading order intact (§2.1). */}
                        <h2 className="font-omnibus text-h3 text-ink">
                          {s.heading}
                        </h2>
                      </div>
                      <div className="mt-5 text-body text-graywarm-deep [&_a]:underline [&_a]:underline-offset-2 [&_dd]:mt-1 [&_dd]:pl-5 [&_dt]:mt-4 [&_dt]:font-semibold [&_dt]:text-ink [&_li]:mt-2 [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_p+p]:mt-4 [&_strong]:text-ink [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5">
                        {s.body}
                      </div>
                    </section>
                  );
                })}
              </div>
            </div>

            {showToc && (
              <nav
                aria-label="On this page"
                className="hidden lg:col-span-3 lg:col-start-10 lg:block"
              >
                <div className="sticky top-28">
                  <p className="text-micro uppercase text-ink/60">
                    On this page
                  </p>
                  <ul className="mt-5 space-y-3">
                    {sections.map((s, i) => {
                      const id = ids[i];
                      const isActive = active === id;
                      return (
                        <li key={id}>
                          <a
                            href={`#${id}`}
                            aria-current={isActive ? "true" : undefined}
                            className={`block text-sm leading-snug transition-colors duration-200 ease-micro ${
                              isActive
                                ? "text-ink"
                                : "text-graywarm-deep/80 hover:text-ink"
                            }`}
                          >
                            {s.heading}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </nav>
            )}
          </div>
        </div>
      </section>

      {/* 3 — index band */}
      <section data-ground="ink" className="bg-ink py-band-sm">
        <div className={CONTAINER}>
          <p className="text-micro uppercase text-paper/60">Other documents</p>
          <ul className="mt-6 flex flex-wrap gap-x-10 gap-y-4">
            {LEGAL_DOCS.filter((doc) => doc.href !== pathname).map((doc) => (
              <li key={doc.href}>
                <Link
                  href={doc.href}
                  className="link-hairline text-[15px] text-paper/80"
                >
                  {doc.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-10 text-sm text-paper/60">
            Questions?{" "}
            <a
              href={`mailto:${site.email}`}
              className="link-hairline text-paper/80"
            >
              {site.email}
            </a>
          </p>
        </div>
      </section>
    </>
  );
}

export default LegalPage;
