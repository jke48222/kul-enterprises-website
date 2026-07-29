import type { Metadata } from "next";
import { fill } from "@/lib/content";
import { client, tinaPage } from "@/lib/tina";
import pageJson from "@/content/pages/road-ahead.json";
import RoadAheadView from "./road-ahead-view";

/**
 * ROAD AHEAD, THE SERVER HALF.
 *
 * Fetches the content and owns the page metadata; app/road-ahead/road-ahead-view.tsx draws it.
 * The split is what Tina's visual editor needs, because useTina is a hook and
 * so the subscribing component has to be a client component.
 *
 * Every word is in content/pages/road-ahead.json and is edited at /admin. The import
 * below is not a second source of truth: it is the fallback used when Tina
 * cannot be reached, so a CMS outage cannot stop the site building. See the
 * note in lib/tina.ts.
 */

export const metadata: Metadata = {
  title: fill(pageJson.meta.title),
  description: fill(pageJson.meta.description),
};

export default async function RoadAheadPage() {
  const page = await tinaPage(
    "Road Ahead page",
    () => client.queries.roadAheadPage({ relativePath: "road-ahead.json" }),
    // The shape the query would have returned, built from the file on disk.
    { roadAheadPage: pageJson } as never,
  );

  return <RoadAheadView {...page} />;
}
