import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  // The /concept tree (legacy build) is noindexed and excluded.
  return [
    "",
    "/about",
    "/services",
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
    url: `${site.url}${path}`,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : path.match(/policy|terms|notices|climate|cookies/) ? 0.3 : 0.8,
  }));
}
