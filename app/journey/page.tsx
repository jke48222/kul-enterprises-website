import type { Metadata } from "next";
import { fill } from "@/lib/content";
import { client, tinaPage } from "@/lib/tina";
import journeyJson from "@/content/pages/journey.json";
import JourneyView from "./journey-view";

/**
 * JOURNEY, THE SERVER HALF.
 *
 * Fetches the content and owns the page metadata; app/journey/journey-view.tsx draws it.
 * The split is what Tina's visual editor needs, because useTina is a hook and
 * so the subscribing component has to be a client component.
 *
 * Every word is in content/pages/journey.json and is edited at /admin. The import
 * below is not a second source of truth: it is the fallback used when Tina
 * cannot be reached, so a CMS outage cannot stop the site building. See the
 * note in lib/tina.ts.
 */

export const metadata: Metadata = {
  title: fill(journeyJson.meta.title),
  description: fill(journeyJson.meta.description),
};

export default async function JourneyPage() {
  const page = await tinaPage(
    "Journey page",
    () => client.queries.journeyPage({ relativePath: "journey.json" }),
    // The shape the query would have returned, built from the file on disk.
    { journeyPage: journeyJson } as never,
  );

  return <JourneyView {...page} />;
}
