import type { Metadata } from "next";
import LegalPage from "@/components/k/LegalPage";
import { Prose } from "@/components/k/Copy";
import { fill } from "@/lib/content";
import doc from "@/content/legal/cookies.json";

/**
 * MANAGE COOKIES
 *
 * Every word of this document is in content/legal/cookies.json and is edited at
 * /admin under "Legal documents". The page itself only decides that it is a
 * legal document, which is what LegalPage draws.
 *
 * THE CLAUSES ARE ONE TEXT BOX EACH. Inside a clause, leave a blank line
 * between paragraphs and start a line with "- " for a bullet. A link is
 * written [like this](/where-it-goes). See components/k/Copy.tsx.
 *
 * DRAFT FOR CLIENT AND ATTORNEY REVIEW BEFORE LAUNCH.
 *
 * ACCURACY CONTRACT FOR THIS PAGE, DO NOT REGRESS:
 *
 *  1. Every unconditional sentence must stay true whether or not
 *     NEXT_PUBLIC_GA_ID is set. Absolute negatives like "no third-party
 *     profiling of any kind" are what broke this page before. The layout
 *     renders <GoogleAnalytics> off that same flag, so the claim inverted the
 *     moment analytics shipped. Promises here are scoped to what KUL chooses
 *     to do (no ad targeting, no cross-site following, no selling), which
 *     holds in both builds; the mechanics of GA live in the clause marked
 *     "only when analytics is on" instead.
 *  2. kul-intro-seen is localStorage, NOT a session cookie. See
 *     components/brand/LoadingOverlay.tsx (SEEN_KEY, "first visit EVER"). It
 *     does not expire and it survives closing the tab. The old copy claimed
 *     both the opposite things.
 */

export const metadata: Metadata = {
  title: fill(doc.meta.title),
  description: fill(doc.meta.description),
};

export default function ManageCookies() {
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
