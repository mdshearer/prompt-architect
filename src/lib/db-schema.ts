/**
 * Database schema and key generation helpers
 *
 * Centralizes all DB key patterns for consistency
 */

import { createHash, randomUUID } from 'crypto'

/**
 * Generate DB keys with consistent prefixes
 */
export const DB_KEYS = {
  // Lead keys
  lead: (leadId: string) => `lead:${leadId}`,
  leadByEmail: (emailHash: string) => `lead_email:${emailHash}`,

  // Rate limiting keys
  rateLimit: (ip: string) => `ratelimit:${ip}`,

  // Analytics key
  analytics: () => 'analytics',
} as const

/**
 * Hash email for privacy and lookups
 * Uses SHA-256 for consistent hashing
 */
export function hashEmail(email: string): string {
  const normalized = email.toLowerCase().trim()
  return createHash('sha256').update(normalized).digest('hex')
}

/**
 * Generate UUID v4 for lead IDs
 */
export function generateLeadId(): string {
  return randomUUID()
}

/**
 * Key patterns for listing/filtering
 */
export const DB_PREFIXES = {
  leads: 'lead:',
  leadEmails: 'lead_email:',
  rateLimits: 'ratelimit:',
} as const
