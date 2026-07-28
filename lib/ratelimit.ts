/**
 * Small in-memory sliding-window rate limiter for the form endpoints.
 * State is per serverless instance, so this throttles bursts rather than
 * providing a hard global guarantee, which is the right trade for a marketing site
 * with no external dependencies. Swap for Upstash Ratelimit if abuse appears.
 */
const hits = new Map<string, number[]>();

const MAX_KEYS = 5000;

export function rateLimit(
  key: string,
  max = 5,
  windowMs = 10 * 60 * 1000
): { allowed: boolean } {
  const now = Date.now();
  const windowStart = now - windowMs;

  // Bound memory by evicting only STALE keys: clearing the whole map would
  // also erase active windows, letting a capped client reset its own limit
  // by flooding the map with fresh keys.
  if (hits.size > MAX_KEYS) {
    for (const [k, stamps] of hits) {
      if (!stamps.some((t) => t > windowStart)) hits.delete(k);
    }
  }

  const stamps = (hits.get(key) ?? []).filter((t) => t > windowStart);
  if (stamps.length >= max) {
    hits.set(key, stamps);
    return { allowed: false };
  }
  stamps.push(now);
  hits.set(key, stamps);
  return { allowed: true };
}

/** Client IP from proxy headers; Vercel sets x-forwarded-for. */
export function clientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}
