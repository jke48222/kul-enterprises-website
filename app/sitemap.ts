import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { services } from "@/lib/services";

/**
 * One tree, at the root. Every public page is listed here; the demo-era
 * version prefixes and exploration routes are gone, so nothing is withheld.
 *
 * THE STATIC ROUTES ARE A DELIBERATE HAND-KEPT LIST, not an oversight of the
 * everything-in-the-CMS rule. Each entry mirrors a folder under app/, which
 * is code, and the client cannot add or remove pages at /admin, only edit
 * them. Deriving this list from the menus was considered and rejected: it
 * would mean removing a footer link quietly unpublishes a page from search.
 * The one list that does grow in the CMS, the services, is derived below.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/about",
    "/journey",
    "/road-ahead",
    "/services",
    ...services.map((s) => `/services/${s.slug}`),
    "/drivers",
    "/safety",
    "/carrier-packet",
    "/quote",
    "/contact",
    "/privacy-policy",
    "/terms-conditions",
    "/legal-notices",
    "/climate-statement",
    "/cookies",
  ].map((path) => ({
    // site.url carries no trailing slash, so the homepage needs an explicit
    // "/" because a <loc> must be a full URL with a path. (Next's own canonical for
    // "/" resolves to the bare origin, no trailing slash; search engines
    // normalise the two to the same resource, so they do not conflict.)
    url: `${site.url}${path || "/"}`,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : path.match(/policy|terms|notices|climate|cookies/) ? 0.3 : 0.8,
  }));
}
