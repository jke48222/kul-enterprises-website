import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { services } from "@/lib/services";

/**
 * Demo period: both versions live under path prefixes and the root is a
 * (noindex) chooser. The sitemap lists the redesign (/v2) as the primary
 * tree; /v1 is a reference copy and stays out of the map.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/about",
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
    url: `${site.url}/v2${path}`,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : path.match(/policy|terms|notices|climate|cookies/) ? 0.3 : 0.8,
  }));
}
