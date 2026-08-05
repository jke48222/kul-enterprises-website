import type { Metadata } from "next";
import { fill } from "@/lib/content";
import { client, tinaPage } from "@/lib/tina";
import docJson from "@/content/legal/cookies.json";
import ManageCookiesView from "./cookies-view";

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
 *  2. kul-intro-seen is sessionStorage, per tab, since the 2 Aug 2026 client
 *     direction (see components/brand/LoadingOverlay.tsx, SEEN_KEY). It is
 *     cleared when the tab closes, and a new tab replays the film. This claim
 *     has now flipped twice, once in each direction. Whenever the gate
 *     changes, change the "What we store" body in content/legal/cookies.json
 *     in the same commit, or this page lies to visitors.
 */

export const metadata: Metadata = {
  title: fill(docJson.meta.title),
  description: fill(docJson.meta.description),
};

export default async function ManageCookies() {
  const page = await tinaPage(
    "cookies",
    () => client.queries.legal({ relativePath: "cookies.json" }),
    // The shape the query would have returned, built from the file on disk.
    { legal: docJson } as never,
  );

  return <ManageCookiesView {...page} />;
}
