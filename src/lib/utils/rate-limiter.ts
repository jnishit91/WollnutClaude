// src/lib/utils/rate-limiter.ts
// In-memory sliding window rate limiter for API routes
// For production at scale, swap to Redis-backed implementation

interface RateLimitEntry {
  tokens: number;
  lastRefill: number;
}

interface RateLimiterConfig {
  maxRequests: number; // max requests per window
  windowMs: number;    // window size in milliseconds
}

const DEFAULT_CONFIG: RateLimiterConfig = {
  maxRequests: 60,
  windowMs: 60_000, // 1 minute
};

class RateLimiter {
  private store = new Map<string, RateLimitEntry>();
  private config: RateLimiterConfig;
  private cleanupInterval: ReturnType<typeof setInterval> | null = null;

  constructor(config: Partial<RateLimiterConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };

    // Periodic cleanup of expired entries (every 5 minutes)
    if (typeof setInterval !== "undefined") {
      this.cleanupInterval = setInterval(() => {
        this.cleanup();
      }, 300_000);
    }
  }

  /**
   * Check if a request is allowed for the given key.
   * Returns { allowed, remaining, resetMs }
   */
  check(key: string): {
    allowed: boolean;
    remaining: number;
    resetMs: number;
    retryAfterMs: number;
  } {
    const now = Date.now();
    const entry = this.store.get(key);

    if (!entry) {
      // First request — initialize with full tokens minus 1
      this.store.set(key, {
        tokens: this.config.maxRequests - 1,
        lastRefill: now,
      });
      return {
        allowed: true,
        remaining: this.config.maxRequests - 1,
        resetMs: this.config.windowMs,
        retryAfterMs: 0,
      };
    }

    // Calculate tokens to refill based on elapsed time
    const elapsed = now - entry.lastRefill;
    const refillRate = this.config.maxRequests / this.config.windowMs;
    const tokensToAdd = elapsed * refillRate;
    const newTokens = Math.min(
      this.config.maxRequests,
      entry.tokens + tokensToAdd
    );

    if (newTokens < 1) {
      // Rate limited
      const waitMs = Math.ceil((1 - newTokens) / refillRate);
      return {
        allowed: false,
        remaining: 0,
        resetMs: waitMs,
        retryAfterMs: waitMs,
      };
    }

    // Allow request, consume a token
    entry.tokens = newTokens - 1;
    entry.lastRefill = now;

    return {
      allowed: true,
      remaining: Math.floor(entry.tokens),
      resetMs: Math.ceil((this.config.maxRequests - entry.tokens) / refillRate),
      retryAfterMs: 0,
    };
  }

  /**
   * Clean up entries that have fully refilled (no longer rate-limited).
   */
  private cleanup(): void {
    const now = Date.now();
    Array.from(this.store.entries()).forEach(([key, entry]) => {
      const elapsed = now - entry.lastRefill;
      if (elapsed > this.config.windowMs * 2) {
        this.store.delete(key);
      }
    });
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.store.clear();
  }
}

// ── Pre-configured limiters ────────────────

/** General API rate limiter: 60 req/min per key */
export const apiLimiter = new RateLimiter({
  maxRequests: 60,
  windowMs: 60_000,
});

/** Auth endpoints: 10 req/min per IP */
export const authLimiter = new RateLimiter({
  maxRequests: 10,
  windowMs: 60_000,
});

/** Instance creation: 5 req/min per user */
export const instanceCreateLimiter = new RateLimiter({
  maxRequests: 5,
  windowMs: 60_000,
});

/** Billing/payment endpoints: 10 req/min per user */
export const billingLimiter = new RateLimiter({
  maxRequests: 10,
  windowMs: 60_000,
});

/**
 * Extract a rate-limit key from the request.
 * Uses user ID if authenticated, falls back to IP.
 */
export function getRateLimitKey(
  req: Request,
  userId?: string | null
): string {
  if (userId) return `user:${userId}`;

  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";
  return `ip:${ip}`;
}

export { RateLimiter };
