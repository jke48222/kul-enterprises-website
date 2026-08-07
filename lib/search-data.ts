import { fill } from "@/lib/content";
import type { SearchRecord } from "@/lib/search";

import home from "@/content/pages/home.json";
import about from "@/content/pages/about.json";
import servicesIndex from "@/content/pages/services-index.json";
import drivers from "@/content/pages/drivers.json";
import safety from "@/content/pages/safety.json";
import roadAhead from "@/content/pages/road-ahead.json";
import carrierPacket from "@/content/pages/carrier-packet.json";
import contact from "@/content/pages/contact.json";
import quote from "@/content/pages/quote.json";
import journey from "@/content/pages/journey.json";
import services from "@/content/services.json";
import faq from "@/content/faq.json";
import privacyPolicy from "@/content/legal/privacy-policy.json";
import termsConditions from "@/content/legal/terms-conditions.json";
import cookies from "@/content/legal/cookies.json";
import legalNotices from "@/content/legal/legal-notices.json";
import climateStatement from "@/content/legal/climate-statement.json";

/**
 * EVERY WORD ON THE SITE, FLATTENED FOR THE SEARCH.
 *
 * This file reads the same JSON the pages read and turns it into the flat
 * list lib/search.ts scores. Because it reads the CMS files themselves, a
 * word changed at /admin is in the search results on the next build with
 * nothing to maintain: there is no separate list of "searchable content" to
 * forget to update.
 *
 * It is loaded the first time somebody opens the search, not before, so the
 * words the search needs are never part of what a page has to load to draw
 * itself.
 *
 * WHAT IS LEFT OUT, on purpose:
 *
 *   FILE PATHS AND PICTURES   nobody searches for "/images/journey".
 *   PICTURE DESCRIPTIONS      they describe photographs for screen readers,
 *                             and a search result should quote the page,
 *                             not the captions under its pictures.
 *   THE SEARCH ENGINE LINES   what Google shows is not on the page itself.
 *   FORM FIELD LABELS         "First name" appearing as a search result
 *                             helps nobody find anything.
 *   THE MENU AND FOOTER       their words are the page names, and every
 *                             page is already here under its own name.
 *   THE 404 PAGE              a page that exists to say "this is not a
 *                             page" is not a destination.
 */

/**
 * Keys whose values are files, addresses, or wiring rather than words.
 * Anything ending in Alt or Href is skipped by the test below as well.
 */
const SKIP_KEYS = new Set([
  "meta",
  "image",
  "video",
  "poster",
  "posterImage",
  "logo",
  "icon",
  "href",
  "slug",
  "cover",
  "clip",
  "card",
  "wide",
  "file",
  "src",
  "panel",
  "skip",
]);

/** Keys whose value names the thing it sits in: these become headings. */
const HEADING_KEYS = new Set([
  "heading",
  "title",
  "eyebrow",
  "question",
  "name",
  "label",
  "statement",
]);

const skippable = (key: string) =>
  SKIP_KEYS.has(key) || key.endsWith("Alt") || key.endsWith("Href");

/**
 * The copy stores links as [words](/page) and bold as **words**; the reader
 * never sees the brackets, so the search must not either. Newlines and the
 * "term :: meaning" marker from the legal documents flatten to plain text
 * the same way.
 */
const plain = (text: string) =>
  fill(text)
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\*\*/g, "")
    .replace(/\s*::\s*/g, ": ")
    .replace(/\s+/g, " ")
    .trim();

/** A value that is a path or an address is wiring, not words. */
const looksLikeWiring = (text: string) =>
  text.startsWith("/") || text.startsWith("http") || text.startsWith("#");

/**
 * Walk one page's JSON and pour its words into `out`.
 *
 * The section carried down is the nearest heading above the text, exactly as
 * a reader would name where they found it. An object's own heading is read
 * first, so the paragraphs beside it land under it rather than under the
 * heading of the section before.
 */
function walk(
  value: unknown,
  route: string,
  page: string,
  section: string,
  out: SearchRecord[],
): void {
  if (typeof value === "string") {
    const text = plain(value);
    if (text.length < 2 || looksLikeWiring(text)) return;
    out.push({ route, page, section, text, kind: "prose" });
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) walk(item, route, page, section, out);
    return;
  }
  if (typeof value !== "object" || value === null) return;

  const entries = Object.entries(value as Record<string, unknown>);

  // The object's own name, if it has one, heads everything inside it.
  let own = section;
  for (const [key, item] of entries) {
    if (!HEADING_KEYS.has(key) || typeof item !== "string") continue;
    const text = plain(item);
    if (text.length < 2 || looksLikeWiring(text)) continue;
    out.push({ route, page, section: own, text, kind: "heading" });
    own = text;
    break;
  }

  for (const [key, item] of entries) {
    if (skippable(key)) continue;
    if (HEADING_KEYS.has(key) && typeof item === "string") continue;
    walk(item, route, page, own, out);
  }
}

/** One page: its name as a record of its own, then everything in it. */
function page(
  out: SearchRecord[],
  route: string,
  name: string,
  content: unknown,
  /**
   * The line printed under the page's name in the results. Left unset, it
   * is taken from the page's own search engine description, which is the
   * sentence already written for exactly this job.
   */
  blurb?: string,
): void {
  const meta = (content as { meta?: { description?: string } })?.meta;
  const line = plain(blurb ?? meta?.description ?? "");
  out.push({ route, page: name, section: "", text: name, kind: "title", blurb: line });
  walk(content, route, name, "", out);
}

/**
 * Build the whole index. Called once, behind the panel's first opening.
 * The page names here are what the results print over each group, so they
 * are the short names a visitor knows the pages by, not the longer lines
 * written for the search engines.
 */
export function buildIndex(): SearchRecord[] {
  const out: SearchRecord[] = [];

  page(out, "/", "Home", home);
  page(out, "/about", "About", about);
  page(out, "/services", "Services", servicesIndex);
  for (const service of services.services) {
    // A service's own one-liner beats a search engine line it does not have.
    page(out, `/services/${service.slug}`, fill(service.name), service, service.blurb);
  }
  page(out, "/drivers", "Drivers", drivers);
  page(out, "/safety", "Safety", safety);
  page(out, "/road-ahead", "The Road Ahead", roadAhead);
  page(out, "/carrier-packet", "Carrier Packet", carrierPacket);
  page(out, "/contact", "Contact", contact);
  page(out, "/quote", "Get a Quote", quote);
  page(out, "/journey", "The Journey", journey);

  // The questions live on the home page, so that is where they link.
  walk(faq, "/", "Home", "Questions", out);

  page(out, "/privacy-policy", plain(privacyPolicy.title), privacyPolicy);
  page(out, "/terms-conditions", plain(termsConditions.title), termsConditions);
  page(out, "/cookies", plain(cookies.title), cookies);
  page(out, "/legal-notices", plain(legalNotices.title), legalNotices);
  page(out, "/climate-statement", plain(climateStatement.title), climateStatement);

  return out;
}
