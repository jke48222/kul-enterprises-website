/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // The hero + story artwork are first-party local SVG stand-ins
    // (REPLACEABLE ASSETs) served via next/image. Locked down with a CSP and
    // attachment disposition per Next.js guidance.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    contentDispositionType: "attachment",
  },
};

export default nextConfig;
