/**
 * Best-effort sliding-window rate limit, kept in memory.
 *
 * On Vercel each function instance has its own memory, and instances come and
 * go. So this only slows down a burst that lands on one warm instance. That's
 * enough for a contact form; it is not a security boundary.
 *
 * RATE-LIMIT HOOK: to make the limit global, swap `memoryLimiter` for a shared
 * store (e.g. @upstash/ratelimit + Upstash Redis, or Vercel KV) behind the same
 * `RateLimiter` interface. Don't add the dependency until it's needed.
 */

export type RateLimiter = {
  /** Records a hit for `key`. Returns false when the key is over its limit. */
  hit(key: string): boolean | Promise<boolean>;
};

export function memoryLimiter({ limit, windowMs }: { limit: number; windowMs: number }): RateLimiter & { reset(): void } {
  const hits = new Map<string, number[]>();
  return {
    hit(key) {
      const now = Date.now();
      const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
      if (recent.length >= limit) {
        hits.set(key, recent);
        return false;
      }
      recent.push(now);
      hits.set(key, recent);
      // Keep the map from growing without bound on a long-lived instance.
      if (hits.size > 5000) {
        for (const [k, ts] of hits) if (ts.every((t) => now - t >= windowMs)) hits.delete(k);
      }
      return true;
    },
    reset() {
      hits.clear();
    },
  };
}

/**
 * Client IP for rate limiting. Vercel sets `x-real-ip` and rewrites
 * `x-forwarded-for` itself, so both carry the real client address there. Only
 * the first `x-forwarded-for` entry is used; the rest of the chain is never
 * trusted. Behind a different proxy, re-check which header that proxy sets.
 */
export function clientIp(headers: Headers) {
  const real = headers.get("x-real-ip")?.trim();
  if (real) return real;
  const first = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return first || "unknown";
}

/** The inquiry endpoint's limiter: 5 submissions per IP per 10 minutes, per instance. */
export const inquiryLimiter = memoryLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });
