/**
 * Simple in-memory rate limiter for API routes
 *
 * Uses IP-based tracking to enforce message limits per session.
 * Entries auto-expire after 24 hours to prevent memory leaks.
 *
 * CONSTITUTION compliance: No database needed for MVP, uses in-memory storage
 */

interface RateLimitEntry {
  count: number
  firstRequest: number // Timestamp of first request
  lastReset: number    // Timestamp of last counter reset
}

// In-memory store: IP -> usage data
const rateLimitStore = new Map<string, RateLimitEntry>()

// Configuration constants per CONSTITUTION standards
const MAX_FREE_MESSAGES = 3
const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000 // 24 hours
const CLEANUP_INTERVAL_MS = 60 * 60 * 1000 // Clean up every 1 hour

/**
 * Clean up expired entries to prevent memory leaks
 * Runs periodically to remove entries older than 24 hours
 */
function cleanupExpiredEntries(): void {
  const now = Date.now()
  const expiredKeys: string[] = []

  for (const [key, entry] of rateLimitStore.entries()) {
    if (now - entry.lastReset > RATE_LIMIT_WINDOW_MS) {
      expiredKeys.push(key)
    }
  }

  expiredKeys.forEach(key => rateLimitStore.delete(key))
}

// Run cleanup periodically
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredEntries, CLEANUP_INTERVAL_MS)
}

/**
 * Extract client IP from request headers
 * Checks multiple headers to support various proxy configurations
 */
export function getClientIP(request: Request): string {
  const headers = request.headers

  // Check common proxy headers in order of reliability
  const forwarded = headers.get('x-forwarded-for')
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwarded.split(',')[0].trim()
  }

  const realIP = headers.get('x-real-ip')
  if (realIP) {
    return realIP
  }

  // Fallback to a default identifier for local development
  return 'unknown-client'
}

/**
 * Check if a client has exceeded their rate limit
 *
 * @param clientId - Usually the client's IP address
 * @returns Object with allowed status and current usage count
 */
export function checkRateLimit(clientId: string): {
  allowed: boolean
  currentCount: number
  limit: number
  resetsAt: number
} {
  const now = Date.now()
  const entry = rateLimitStore.get(clientId)

  if (!entry) {
    // First request from this client
    rateLimitStore.set(clientId, {
      count: 0,
      firstRequest: now,
      lastReset: now
    })
    return {
      allowed: true,
      currentCount: 0,
      limit: MAX_FREE_MESSAGES,
      resetsAt: now + RATE_LIMIT_WINDOW_MS
    }
  }

  // Check if we should reset the counter (24 hours passed)
  if (now - entry.lastReset > RATE_LIMIT_WINDOW_MS) {
    entry.count = 0
    entry.lastReset = now
    rateLimitStore.set(clientId, entry)
  }

  return {
    allowed: entry.count < MAX_FREE_MESSAGES,
    currentCount: entry.count,
    limit: MAX_FREE_MESSAGES,
    resetsAt: entry.lastReset + RATE_LIMIT_WINDOW_MS
  }
}

/**
 * Increment the usage counter for a client
 * Call this AFTER successfully processing a request
 *
 * @param clientId - Usually the client's IP address
 */
export function incrementRateLimit(clientId: string): void {
  const entry = rateLimitStore.get(clientId)

  if (entry) {
    entry.count += 1
    rateLimitStore.set(clientId, entry)
  } else {
    // This shouldn't happen if checkRateLimit was called first,
    // but handle it gracefully
    rateLimitStore.set(clientId, {
      count: 1,
      firstRequest: Date.now(),
      lastReset: Date.now()
    })
  }
}

/**
 * Get current statistics (for debugging/monitoring)
 */
export function getRateLimitStats(): {
  totalClients: number
  averageUsage: number
} {
  const clients = Array.from(rateLimitStore.values())
  const totalUsage = clients.reduce((sum, entry) => sum + entry.count, 0)

  return {
    totalClients: clients.length,
    averageUsage: clients.length > 0 ? totalUsage / clients.length : 0
  }
}
