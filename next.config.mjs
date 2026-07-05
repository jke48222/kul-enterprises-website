/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Every quality used by an <Image quality={...}> must be listed here:
    // Next 16 makes unlisted values a hard error (15.5 already warns).
    qualities: [75, 78, 80, 82],
    // The hero + story artwork are first-party local SVG stand-ins
    // (REPLACEABLE ASSETs) served via next/image. Locked down with a CSP and
    // attachment disposition per Next.js guidance.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    contentDispositionType: "attachment",
  },
  // Demo period: the site lives twice — /v1 (original) and /v2 (redesign),
  // with a chooser at /. Old un-prefixed URLs land on the redesign.
  // Temporary (307) on purpose: once a winner is picked these flip to the
  // real routes and must not have been cached as permanent.
  async redirects() {
    const routes = [
      "about",
      "services",
      "services/:slug",
      "drivers",
      "safety",
      "carrier-packet",
      "quote",
      "contact",
      "privacy-policy",
      "terms-conditions",
      "legal-notices",
      "climate-statement",
      "cookies",
    ];
    return routes.map((r) => ({
      source: `/${r}`,
      destination: `/v2/${r}`,
      permanent: false,
    }));
  },
};

export default nextConfig;
