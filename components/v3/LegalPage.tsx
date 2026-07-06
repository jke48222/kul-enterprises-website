"use client";

/**
 * LegalPage — v3 port (v2 §4.10). Shared template for the five legal
 * documents: ink header band (single gold byline rule), 68ch paper
 * document column with numbered sentence-case headings + slugged anchors,
 * lg: sticky scroll-spied mini-TOC when sections ≥ 3, ink index band
 * linking the other documents. Copy is prop data — audited v1/v2 body
 * text rides through unchanged.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Eyebrow } from "@/components/v3/Eyebrow";
import { LineReveal } from "@/components/v3/LineReveal";
import { Rise } from "@/components/v3/Rise";
import { site } from "@/lib/site";

export type LegalPageProps = {
  eyebrow: string;
  title: string;
  updated: string;
  sections: { heading: string; body: React.ReactNode }[];
  pull?: string;
};

const BASE = "/v3";
const CONTAINER = "mx-auto w-full max-w-[1760px] px-[clamp(20px,5vw,90px)]";

const LEGAL_DOCS = [
  { href: `${BASE}/privacy-policy`, label: "Privacy Policy" },
  { href: `${BASE}/terms-conditions`, label: "Terms & Conditions" },
  { href: `${BASE}/cookies`, label: "Cookies" },
  { href: `${BASE}/legal-notices`, label: "Legal Notices" },
  { href: `${BASE}/climate-statement`, label: "Climate Statement" },
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
                className="mt-6 max-w-[18ch] text-d2 text-paper"
              />
              <p className="mt-6 text-micro uppercase text-paper/60">
                Last updated {updated}
              </p>
              {/* The byline rule — the page's single gold element. */}
              <div aria-hidden className="mt-6 h-px w-full bg-gold/70" />
            </div>
          </Rise>
        </div>
      </section>

      {/* 2 — document body */}
      <section data-ground="paper" className="bg-paper py-band-sm">
        <div className={CONTAINER}>
          {pull && (
            <p className="mb-band-sm max-w-[28ch] text-d2 text-ink">{pull}</p>
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
                          className="shrink-0 text-micro tabular-nums text-ink/40"
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <h2 className="text-h3 font-semibold text-ink">
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
