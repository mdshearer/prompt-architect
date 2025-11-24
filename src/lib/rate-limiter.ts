/**
 * Updated rate limiter with Replit DB persistence
 *
 * MIGRATION: Replaces in-memory Map with database storage
 * ENHANCEMENT: Email users get unlimited access
 */

import type { IRateLimitEntry } from '@/types/lead'
import { dbGet, dbSet } from './db'
import { DB_KEYS, hashEmail } from './db-schema'
import { MAX_FREE_MESSAGES } from './constants'

// Time-based configuration
const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000 // 24 hours

/**
 * Check if client has exceeded rate limit
 *
 * CHANGED: Now checks database instead of Map
 * CHANGED: Email users get unlimited access
 */
export async function checkRateLimit(
  clientId: string,
  userEmail?: string,
  isIntake: boolean = false
): Promise<{
  allowed: boolean
  currentCount: number
  limit: number
  resetsAt: number
  isUnlimited: boolean
}> {
  // Intake flow is exempt
  if (isIntake) {
    return {
      allowed: true,
      currentCount: 0,
      limit: MAX_FREE_MESSAGES,
      resetsAt: Date.now() + RATE_LIMIT_WINDOW_MS,
      isUnlimited: false
    }
  }

  const now = Date.now()
  const key = DB_KEYS.rateLimit(clientId)

  // Get existing rate limit entry
  let entry = await dbGet<IRateLimitEntry>(key)

  // If user has email, they get unlimited access
  if (userEmail) {
    const emailHash = hashEmail(userEmail)

    if (!entry) {
      entry = {
        ip: clientId,
        emailHash,
        count: 0,
        firstRequest: now,
        lastReset: now,
        isUnlimited: true
      }
      await dbSet(key, entry)
    } else if (!entry.isUnlimited) {
      // Upgrade existing entry to unlimited
      entry.emailHash = emailHash
      entry.isUnlimited = true
      await dbSet(key, entry)
    }

    return {
      allowed: true,
      currentCount: entry.count,
      limit: MAX_FREE_MESSAGES,
      resetsAt: now + RATE_LIMIT_WINDOW_MS,
      isUnlimited: true
    }
  }

  // No entry exists - create new one
  if (!entry) {
    entry = {
      ip: clientId,
      count: 0,
      firstRequest: now,
      lastReset: now,
      isUnlimited: false
    }
    await dbSet(key, entry)

    return {
      allowed: true,
      currentCount: 0,
      limit: MAX_FREE_MESSAGES,
      resetsAt: now + RATE_LIMIT_WINDOW_MS,
      isUnlimited: false
    }
  }

  // Check if window has expired - reset counter
  if (now - entry.lastReset > RATE_LIMIT_WINDOW_MS) {
    entry.count = 0
    entry.lastReset = now
    await dbSet(key, entry)
  }

  return {
    allowed: entry.count < MAX_FREE_MESSAGES,
    currentCount: entry.count,
    limit: MAX_FREE_MESSAGES,
    resetsAt: entry.lastReset + RATE_LIMIT_WINDOW_MS,
    isUnlimited: false
  }
}

/**
 * Increment rate limit counter
 *
 * CHANGED: Stores in database instead of Map
 */
export async function incrementRateLimit(
  clientId: string,
  isIntake: boolean = false
): Promise<void> {
  // Intake doesn't count toward limit
  if (isIntake) {
    return
  }

  const key = DB_KEYS.rateLimit(clientId)
  const entry = await dbGet<IRateLimitEntry>(key)

  if (entry) {
    entry.count += 1
    await dbSet(key, entry)
  } else {
    // Shouldn't happen if checkRateLimit was called first
    const now = Date.now()
    await dbSet(key, {
      ip: clientId,
      count: 1,
      firstRequest: now,
      lastReset: now,
      isUnlimited: false
    })
  }
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
