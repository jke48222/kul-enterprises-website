import type { Metadata } from "next";
import { fill } from "@/lib/content";
import { client, tinaPage } from "@/lib/tina";
import pageJson from "@/content/pages/safety.json";
import SafetyView from "./safety-view";

/**
 * SAFETY, THE SERVER HALF.
 *
 * Fetches the content and owns the page metadata; app/safety/safety-view.tsx draws it.
 * The split is what Tina's visual editor needs, because useTina is a hook and
 * so the subscribing component has to be a client component.
 *
 * Every word is in content/pages/safety.json and is edited at /admin. The import
 * below is not a second source of truth: it is the fallback used when Tina
 * cannot be reached, so a CMS outage cannot stop the site building. See the
 * note in lib/tina.ts.
 */

export const metadata: Metadata = {
  // NOT "safety record". The lede on this page says there is no long safety
  // record to point at yet, so sending a broker to FMCSA expecting one is the
  // page contradicting itself in the search result.
  title: fill(pageJson.meta.title),
  description: fill(pageJson.meta.description),
};

export default async function SafetyPage() {
  const page = await tinaPage(
    "Safety page",
    () => client.queries.safetyPage({ relativePath: "safety.json" }),
    // The shape the query would have returned, built from the file on disk.
    { safetyPage: pageJson } as never,
  );

  return <SafetyView {...page} />;
}
