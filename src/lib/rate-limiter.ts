/**
 * Simple in-memory rate limiter for API routes
 *
 * Uses IP-based tracking to enforce message limits per session.
 * Entries auto-expire after 24 hours to prevent memory leaks.
 *
 * CONSTITUTION compliance: No database needed for MVP, uses in-memory storage
 */

import { MAX_FREE_MESSAGES } from '@/lib/constants'

interface IRateLimitEntry {
  count: number
  firstRequest: number // Timestamp of first request
  lastReset: number    // Timestamp of last counter reset
}

// In-memory store: IP -> usage data
const rateLimitStore = new Map<string, IRateLimitEntry>()

// Time-based configuration constants
const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000 // 24 hours
const CLEANUP_INTERVAL_MS = 60 * 60 * 1000 // Clean up every 1 hour

/**
 * Clean up expired entries to prevent memory leaks
 * Runs periodically to remove entries older than 24 hours
 */
function cleanupExpiredEntries(): void {
  const now = Date.now()
  const expiredKeys: string[] = []

  for (const [key, entry] of Array.from(rateLimitStore.entries())) {
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
 * @param isIntake - If true, this is an intake flow request (exempt from rate limiting)
 * @returns Object with allowed status and current usage count
 *
 * @example
 * // Regular chat message - counts against limit
 * const result = checkRateLimit(clientIP)
 *
 * @example
 * // Intake flow message - always allowed, doesn't count
 * const result = checkRateLimit(clientIP, true)
 */
export function checkRateLimit(clientId: string, isIntake: boolean = false): {
  allowed: boolean
  currentCount: number
  limit: number
  resetsAt: number
} {
  // Intake flow requests are exempt from rate limiting
  // They don't count toward the 3 free messages
  if (isIntake) {
    return {
      allowed: true,
      currentCount: 0,
      limit: MAX_FREE_MESSAGES,
      resetsAt: Date.now() + RATE_LIMIT_WINDOW_MS
    }
  }

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
 * @param isIntake - If true, this is an intake flow request (don't increment counter)
 *
 * @example
 * // Regular chat - increment counter
 * incrementRateLimit(clientIP)
 *
 * @example
 * // Intake flow - don't increment (intake is exempt)
 * incrementRateLimit(clientIP, true)
 */
export function incrementRateLimit(clientId: string, isIntake: boolean = false): void {
  // Intake flow requests don't count toward the free message limit
  if (isIntake) {
    return
  }

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
