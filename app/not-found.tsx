import type { Metadata } from "next";
import { fill } from "@/lib/content";
import { client, tinaPage } from "@/lib/tina";
import pageJson from "@/content/pages/not-found.json";
import NotFoundView from "./not-found-view";

/**
 * THE 404 PAGE, THE SERVER HALF.
 *
 * Fetches the content and owns the page metadata; app/not-found-view.tsx draws
 * it. The split is what Tina's visual editor needs, because useTina is a hook
 * and so the subscribing component has to be a client component. See the note
 * on the "notFoundPage" collection in tina/config.ts for why this one has no
 * live preview route.
 *
 * Every word is in content/pages/not-found.json and is edited at /admin. The
 * import below is not a second source of truth: it is the fallback used when
 * Tina cannot be reached, so a CMS outage cannot stop the site building.
 *
 * NOINDEX ON PURPOSE. This renders for every broken link on the site, at
 * whatever URL somebody typed, so it is the same document at an unlimited
 * number of addresses. A search engine that indexed it would be indexing a
 * dead end.
 */

export const metadata: Metadata = {
  title: fill(pageJson.meta.title),
  description: fill(pageJson.meta.description),
  robots: { index: false, follow: true },
};

export default async function NotFound() {
  const page = await tinaPage(
    "Page Not Found (404)",
    () => client.queries.notFoundPage({ relativePath: "not-found.json" }),
    // The shape the query would have returned, built from the file on disk.
    { notFoundPage: pageJson } as never,
  );

  return <NotFoundView {...page} />;
}
