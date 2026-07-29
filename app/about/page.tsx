import type { Metadata } from "next";
import { fill } from "@/lib/content";
import { client, tinaPage } from "@/lib/tina";
import aboutJson from "@/content/pages/about.json";
import AboutView from "./about-view";

/**
 * ABOUT, THE SERVER HALF.
 *
 * Fetches the content and owns the page metadata; app/about/about-view.tsx draws it.
 * The split is what Tina's visual editor needs, because useTina is a hook and
 * so the subscribing component has to be a client component.
 *
 * Every word is in content/pages/about.json and is edited at /admin. The import
 * below is not a second source of truth: it is the fallback used when Tina
 * cannot be reached, so a CMS outage cannot stop the site building. See the
 * note in lib/tina.ts.
 */

export const metadata: Metadata = {
  title: fill(aboutJson.meta.title),
  description: fill(aboutJson.meta.description),
};

export default async function AboutPage() {
  const page = await tinaPage(
    "About page",
    () => client.queries.aboutPage({ relativePath: "about.json" }),
    // The shape the query would have returned, built from the file on disk.
    { aboutPage: aboutJson } as never,
  );

  return <AboutView {...page} />;
}
