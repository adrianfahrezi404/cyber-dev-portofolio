// ===========================================
// CYBER.DEV Portfolio — Rate Limiter
// In-memory sliding window rate limiter
// ===========================================

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up expired entries periodically
const CLEANUP_INTERVAL = 60 * 1000; // 1 minute
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;

  lastCleanup = now;
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}

interface RateLimitConfig {
  /** Maximum number of requests allowed in the window */
  maxRequests: number;
  /** Window duration in seconds */
  windowSeconds: number;
}

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
}

/**
 * Check rate limit for a given identifier (e.g., IP address)
 */
export function rateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  cleanup();

  const now = Date.now();
  const key = `${config.maxRequests}:${config.windowSeconds}:${identifier}`;
  const entry = rateLimitStore.get(key);

  // No existing entry or window expired — create new
  if (!entry || now > entry.resetAt) {
    const resetAt = now + config.windowSeconds * 1000;
    rateLimitStore.set(key, { count: 1, resetAt });
    return {
      success: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - 1,
      resetAt,
    };
  }

  // Within window — check if limit reached
  if (entry.count >= config.maxRequests) {
    return {
      success: false,
      limit: config.maxRequests,
      remaining: 0,
      resetAt: entry.resetAt,
    };
  }

  // Increment count
  entry.count++;
  return {
    success: true,
    limit: config.maxRequests,
    remaining: config.maxRequests - entry.count,
    resetAt: entry.resetAt,
  };
}

// Pre-configured rate limiters
export const contactRateLimit = (ip: string) =>
  rateLimit(ip, { maxRequests: 3, windowSeconds: 15 * 60 }); // 3 per 15 min

export const authRateLimit = (ip: string) =>
  rateLimit(ip, { maxRequests: 5, windowSeconds: 15 * 60 }); // 5 per 15 min

export const apiRateLimit = (ip: string) =>
  rateLimit(ip, { maxRequests: 60, windowSeconds: 60 }); // 60 per minute
