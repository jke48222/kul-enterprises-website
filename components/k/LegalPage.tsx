"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Breadcrumb from "@/components/k/Breadcrumb";
import Reveal from "@/components/k/Reveal";
import Copy from "@/components/k/Copy";
import { fill, linkHref } from "@/lib/content";
import nav from "@/content/navigation.json";

/**
 * The wording shared by all five documents. It is one entry in the CMS rather
 * than five, because "Last updated" reading differently on the privacy policy
 * and the cookie page would be a mistake nobody would catch.
 */
const chrome = nav.legalChrome;

/**
 * THE SHARED SHAPE FOR THE FIVE LEGAL DOCUMENTS
 *
 * Privacy, terms, cookies, legal notices and the climate statement all use
 * this one file, so a change to how a legal page looks happens once.
 *
 * IT IS A DOCUMENT, NOT A SECTION OF THE WEBSITE, and it is built to be read
 * like one: a dark title band, then numbered clauses running down a single
 * column at a proper reading width, then a list of the other documents at the
 * foot. Nothing here animates except the title, because a privacy policy that
 * fades in a paragraph at a time is infuriating to anybody actually trying to
 * find a clause.
 *
 * THE READING WIDTH IS DELIBERATE. The column is capped at 68 characters,
 * which is roughly where a line stops being comfortable to read. Legal text
 * is the last thing on a site anybody reads voluntarily, so it gets the
 * kindest measure on the site rather than the widest.
 *
 * THE LIST DOWN THE RIGHT appears only when a document has three or more
 * clauses, and it marks where you are as you scroll. It is hidden on narrow
 * screens, where it would cost more room than it is worth.
 *
 * TO ADD A DOCUMENT: write the page, pass its clauses in, and add it to
 * DOCUMENTS below so the other four link to it.
 */

export type LegalPageProps = {
  eyebrow: string;
  title: string;
  /** Written out per page. There is no default, so it can never go stale silently. */
  updated: string;
  sections: { heading: string; body: React.ReactNode }[];
  /** One sentence set large before the body. Used by the climate statement. */
  pull?: string;
  /**
   * Tina's click-to-edit path for the title, from tinaField(doc, "title").
   *
   * Passed in rather than computed here because this component is shared and
   * knows nothing about which document it is drawing. Absent outside the
   * editor, where the attribute is inert anyway.
   */
  titleField?: string;
  /** The same for each clause heading, in the order the clauses are given. */
  sectionFields?: (string | undefined)[];
};

const DOCUMENTS = chrome.documents;

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
  titleField,
  sectionFields,
}: LegalPageProps) {
  const pathname = usePathname();
  const ids = sections.map((s) => slugify(s.heading));
  const [active, setActive] = useState<string>(ids[0] ?? "");
  const showIndex = sections.length >= 3;

  // Marks which clause is currently in the reading band, for the list on the
  // right. The band is deliberately narrow and high on the screen, so the
  // marker moves when a heading reaches the top rather than the middle.
  useEffect(() => {
    if (!showIndex || typeof IntersectionObserver === "undefined") return;
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
  }, [showIndex]);

  return (
    <>
      {/* The title band. */}
      <section className="bg-k-coal px-6 pb-20 pt-36 md:px-12 lg:px-24 lg:pt-44">
        <div className="mx-auto max-w-[1248px]">
          {/* THIS WAS THREE DEAD SPANS UNTIL 29 JUL 2026. It drew the same
              "KUL / Climate Statement" trail as every other page and none of it
              went anywhere, which meant all five legal documents were left with
              an unclickable breadcrumb after the rest of the site got real
              links. It is the shared component now, on its dark colourway. */}
          <Breadcrumb
            className="pb-10"
            tone="dark"
            items={[{ label: eyebrow }]}
          />

          <Reveal variant="wipe">
            <h1
              data-tina-field={titleField}
              className="max-w-[20ch] font-display text-k-d1 font-black text-k-on-dark"
            >
              {title}
            </h1>
          </Reveal>

          <Reveal variant="settle">
            <p className="pt-8 font-text text-k-micro uppercase tabular-nums text-k-on-dark-soft">
              {fill(chrome.updatedPrefix)} {fill(updated)}
            </p>
          </Reveal>

          {/* The one gold thing on the page, and the only rule that is not a
              hairline. It closes the title band rather than decorating it. */}
          <div aria-hidden="true" className="mt-8 h-px w-full bg-k-gold" />
        </div>
      </section>

      {/* The document itself. No entrances: somebody looking for a clause
          should never have to wait for it to arrive. */}
      <section className="bg-k-paper px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-[1248px]">
          {pull ? (
            <p className="mb-16 max-w-[24ch] font-display text-k-d2 font-black text-k-ink">
              {pull}
            </p>
          ) : null}

          <div className="flex flex-col gap-16 lg:flex-row lg:gap-24">
            <div className="max-w-[68ch] flex-1">
              {sections.map((s, i) => {
                const id = ids[i];
                return (
                  <section
                    key={id}
                    id={id}
                    data-legal-section
                    className="scroll-mt-28 border-t border-k-rule py-9 first:border-t-0 first:pt-0"
                  >
                    <div className="flex items-baseline gap-4">
                      <span
                        aria-hidden="true"
                        className="shrink-0 font-text text-k-micro tabular-nums text-k-ink-soft"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {/* Set at reading size rather than display size. Twelve
                          headings at 36px turns a policy into a shouting
                          match; at 20px it reads as a document. */}
                      <h2
                        data-tina-field={sectionFields?.[i]}
                        className="font-display text-k-lede font-black text-k-ink"
                      >
                        {s.heading}
                      </h2>
                    </div>
                    <div className="mt-4 font-text text-k-body text-k-ink-soft [&_a]:underline [&_a]:underline-offset-2 [&_dd]:mt-1 [&_dd]:pl-5 [&_dt]:mt-4 [&_dt]:font-semibold [&_dt]:text-k-ink [&_li]:mt-2 [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_p+p]:mt-4 [&_strong]:text-k-ink [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5">
                      {s.body}
                    </div>
                  </section>
                );
              })}
            </div>

            {showIndex ? (
              <nav
                // The same words the sighted reader gets five lines down, from
                // the same field, so renaming the index at /admin renames it
                // for a screen reader too.
                aria-label={fill(chrome.indexLabel)}
                className="hidden lg:block lg:w-[240px] lg:shrink-0"
              >
                <div className="sticky top-28">
                  <p className="font-text text-k-micro uppercase text-k-ink-soft">
                    {fill(chrome.indexLabel)}
                  </p>
                  <ul className="mt-5 flex flex-col gap-3">
                    {sections.map((s, i) => {
                      const id = ids[i];
                      const isActive = active === id;
                      return (
                        <li key={id}>
                          <a
                            href={`#${id}`}
                            aria-current={isActive ? "true" : undefined}
                            className={`block font-text text-k-small leading-snug transition-colors duration-200 ${
                              isActive
                                ? "text-k-ink"
                                : "text-k-ink-soft hover:text-k-ink"
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
            ) : null}
          </div>
        </div>
      </section>

      {/* The other documents, and where to write with a question. */}
      <section className="bg-k-coal px-6 py-20 md:px-12 lg:px-24">
        <div className="mx-auto max-w-[1248px]">
          <p className="font-text text-k-micro uppercase text-k-on-dark-soft">
            {fill(chrome.otherDocumentsLabel)}
          </p>
          <ul className="mt-6 flex flex-wrap gap-x-10 gap-y-4">
            {DOCUMENTS.filter((doc) => doc.href !== pathname).map((doc) => (
              <li key={doc.href}>
                <Link
                  href={linkHref(doc.href)}
                  className="font-text text-k-small text-k-on-dark underline underline-offset-4 transition-colors duration-200 hover:text-k-gold-lit"
                >
                  {fill(doc.label)}
                </Link>
              </li>
            ))}
          </ul>
          <Copy
            text={chrome.questionLine}
            className="mt-10 font-text text-k-small text-k-on-dark-soft"
            linkClassName="text-k-on-dark underline underline-offset-4"
          />
        </div>
      </section>
    </>
  );
}

export default LegalPage;
