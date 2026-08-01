type Bucket = {
  count: number
  resetAt: number
}

const buckets = new Map<string, Bucket>()

const WINDOW_MS = 15 * 60 * 1000
const MAX_REQUESTS = 8

function prune(now: number) {
  if (buckets.size < 500) return
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key)
  }
}

/** Simple in-memory rate limit. Best-effort on serverless (resets per instance). */
export function rateLimit(
  key: string,
  limit = MAX_REQUESTS,
  windowMs = WINDOW_MS
): { ok: true } | { ok: false; retryAfterSec: number } {
  const now = Date.now()
  prune(now)

  const existing = buckets.get(key)
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true }
  }

  if (existing.count >= limit) {
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    }
  }

  existing.count += 1
  return { ok: true }
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim()
    if (first) return first
  }

  const realIp = request.headers.get('x-real-ip')?.trim()
  if (realIp) return realIp

  return 'unknown'
}
