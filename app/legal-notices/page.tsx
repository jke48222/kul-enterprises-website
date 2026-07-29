import type { Metadata } from "next";
import LegalPage from "@/components/k/LegalPage";
import { Prose } from "@/components/k/Copy";
import { fill } from "@/lib/content";
import doc from "@/content/legal/legal-notices.json";

/**
 * LEGAL NOTICES
 *
 * Every word of this document is in content/legal/legal-notices.json and is edited at
 * /admin under "Legal documents". The page itself only decides that it is a
 * legal document, which is what LegalPage draws.
 *
 * THE CLAUSES ARE ONE TEXT BOX EACH. Inside a clause, leave a blank line
 * between paragraphs and start a line with "- " for a bullet. A link is
 * written [like this](/where-it-goes). See components/k/Copy.tsx.
 *
 * DRAFT FOR CLIENT AND ATTORNEY REVIEW BEFORE LAUNCH.
 */

export const metadata: Metadata = {
  title: fill(doc.meta.title),
  description: fill(doc.meta.description),
};

export default function LegalNotices() {
  return (
    <LegalPage
      eyebrow={fill(doc.eyebrow)}
      title={fill(doc.title)}
      updated={doc.updated}
      sections={doc.sections
        // A clause marked "only when analytics is on" is dropped from the
        // document unless the site is actually running Google Analytics. It is
        // the same build-time flag that renders the tag in app/layout.tsx, so
        // this page can never describe measurement that is switched off.
        .filter((s) => !s.onlyWithAnalytics || Boolean(process.env.NEXT_PUBLIC_GA_ID))
        .map((s) => ({
          heading: fill(s.heading),
          body: <Prose text={s.body} linkClassName="underline underline-offset-2" />,
        }))}
    />
  );
}
