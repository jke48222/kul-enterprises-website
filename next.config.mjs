/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Don't advertise the framework: strips the X-Powered-By: Next.js response
  // header that otherwise ships on every request.
  poweredByHeader: false,
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
  // No redirects: the bare routes ARE the site now. The demo-era 307s from
  // /about to /v2/about were removed when v2 was promoted to the root. Left
  // in place they would redirect every page to itself.

  /**
   * Baseline security headers on every response (audit H7).
   *
   * Deliberately NOT included: a Content-Security-Policy. The document
   * renders inline JSON-LD and an inline pre-paint script, so an enforcing
   * CSP needs per-request nonces threaded through the layout; a guessed
   * policy fails silently in production. CSP is deferred to its own change
   * with a Report-Only rollout first. (The `images.contentSecurityPolicy`
   * above is a separate, narrower thing: it applies only to responses from
   * the /_next/image optimizer, not to the HTML document.)
   */
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // 2 years + preload-eligible. Only meaningful over HTTPS; browsers
          // ignore it on plain http, so it is safe in local dev.
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Send the full URL same-origin, origin-only cross-origin, nothing
          // on an HTTPS→HTTP downgrade.
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // Nothing on this site is meant to be framed. Clickjacking guard
          // for browsers predating frame-ancestors.
          { key: "X-Frame-Options", value: "DENY" },
          // The site asks for no device permissions; deny the three that
          // matter most, for this document and every embed within it.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
