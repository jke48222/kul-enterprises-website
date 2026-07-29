import type { Metadata } from "next";
import { fill } from "@/lib/content";
import { client, tinaPage } from "@/lib/tina";
import homeJson from "@/content/pages/home.json";
import HomeView from "./home-view";

/**
 * Home, the page a visitor lands on first.
 *
 * Designed against the Paper artboard "Home, desktop 1440"
 * (app.paper.design/file/01KYKPT9QPZPS05X9H4PH1FSGT). Paper is the design of
 * record; where the two disagree, the artboard is right.
 *
 * The page alternates registers deliberately: dark hero, daylight statement,
 * blueprint rig, daylight services, dark vision, warm story, charcoal footer.
 * Instrument-black is earned, never the default.
 *
 * A broker gets what KUL hauls and how to reach dispatch inside the first
 * screen. Everyone else is invited into the story, further down, optionally.
 *
 * ------------------------------------------------------------------
 * THIS FILE IS THE SERVER HALF. THE MARKUP IS IN app/home-view.tsx.
 * ------------------------------------------------------------------
 * The split is what Tina's visual editor requires: the content has to be
 * fetched on the server, and the component that subscribes to it has to be a
 * client component because useTina is a hook. So this half fetches and owns
 * the metadata, and the other half draws.
 *
 * Every word is still in content/pages/home.json and is edited at /admin under
 * "Home page". The import below is not a second source of truth: it is the
 * fallback used when Tina cannot be reached, so a CMS outage cannot stop the
 * site building. See the note in lib/tina.ts.
 *
 * THE COMMENTS ABOUT WORDING are in the view file, next to the markup that
 * enforces them. They record why a line is short, why a break falls where it
 * does, and what was tried and removed, which anyone editing the copy in the
 * CMS is editing against whether they know it or not.
 */

export const metadata: Metadata = {
  // absolute, because the layout's title template would otherwise append the
  // company name to a title that already opens with it.
  title: { absolute: fill(homeJson.meta.title) },
  description: fill(homeJson.meta.description),
};

export default async function HomePage() {
  const page = await tinaPage(
    "Home page",
    () => client.queries.homePage({ relativePath: "home.json" }),
    // The shape the query would have returned, built from the file on disk.
    { homePage: homeJson } as never,
  );

  return <HomeView {...page} />;
}
