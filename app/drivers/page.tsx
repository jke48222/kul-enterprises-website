import type { Metadata } from "next";
import { fill } from "@/lib/content";
import { client, tinaPage } from "@/lib/tina";
import pageJson from "@/content/pages/drivers.json";
import DriversView from "./drivers-view";

/**
 * DRIVERS, THE SERVER HALF.
 *
 * Fetches the content and owns the page metadata; app/drivers/drivers-view.tsx draws it.
 * The split is what Tina's visual editor needs, because useTina is a hook and
 * so the subscribing component has to be a client component.
 *
 * Every word is in content/pages/drivers.json and is edited at /admin. The import
 * below is not a second source of truth: it is the fallback used when Tina
 * cannot be reached, so a CMS outage cannot stop the site building. See the
 * note in lib/tina.ts.
 */

export const metadata: Metadata = {
  title: fill(pageJson.meta.title),
  description: fill(pageJson.meta.description),
};

export default async function DriversPage() {
  const page = await tinaPage(
    "Drivers page",
    () => client.queries.driversPage({ relativePath: "drivers.json" }),
    // The shape the query would have returned, built from the file on disk.
    { driversPage: pageJson } as never,
  );

  return <DriversView {...page} />;
}
