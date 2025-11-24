/**
 * Lead Storage Helper
 *
 * Manages localStorage persistence for lead capture data.
 * Stores leadId and email after successful email capture to:
 * - Skip showing email modal for returning users
 * - Enable unlimited access based on email
 * - Personalize welcome messages
 *
 * @module lead-storage
 */

import { logger } from './logger'

// Storage key for lead data
const LEAD_STORAGE_KEY = 'optimi_lead_data'

// Lead data stored in localStorage
export interface IStoredLeadData {
  leadId: string        // UUID from database
  email: string         // User's email
  capturedAt: number    // Unix timestamp when captured
}

/**
 * Get stored lead ID from localStorage
 *
 * @returns Lead ID if exists, null otherwise
 */
export function getStoredLeadId(): string | null {
  try {
    if (typeof window === 'undefined') return null

    const data = localStorage.getItem(LEAD_STORAGE_KEY)
    if (!data) return null

    const parsed = JSON.parse(data) as IStoredLeadData
    return parsed.leadId || null
  } catch (error) {
    logger.error('Failed to read stored lead ID', error)
    return null
  }
}

/**
 * Get stored email from localStorage
 *
 * @returns Email if exists, null otherwise
 */
export function getStoredEmail(): string | null {
  try {
    if (typeof window === 'undefined') return null

    const data = localStorage.getItem(LEAD_STORAGE_KEY)
    if (!data) return null

    const parsed = JSON.parse(data) as IStoredLeadData
    return parsed.email || null
  } catch (error) {
    logger.error('Failed to read stored email', error)
    return null
  }
}

/**
 * Get full stored lead data from localStorage
 *
 * @returns Lead data if exists, null otherwise
 */
export function getStoredLeadData(): IStoredLeadData | null {
  try {
    if (typeof window === 'undefined') return null

    const data = localStorage.getItem(LEAD_STORAGE_KEY)
    if (!data) return null

    return JSON.parse(data) as IStoredLeadData
  } catch (error) {
    logger.error('Failed to read stored lead data', error)
    return null
  }
}

/**
 * Store lead ID and email in localStorage
 *
 * @param leadId - UUID from database
 * @param email - User's email
 */
export function setStoredLeadId(leadId: string, email: string): void {
  try {
    if (typeof window === 'undefined') return

    const data: IStoredLeadData = {
      leadId,
      email,
      capturedAt: Date.now()
    }

    localStorage.setItem(LEAD_STORAGE_KEY, JSON.stringify(data))
    logger.info('Lead data stored successfully', { leadId })
  } catch (error) {
    logger.error('Failed to store lead data', error)
  }
}

/**
 * Clear stored lead data from localStorage
 * Useful for testing or if user wants to reset
 */
export function clearStoredLeadData(): void {
  try {
    if (typeof window === 'undefined') return

    localStorage.removeItem(LEAD_STORAGE_KEY)
    logger.info('Lead data cleared')
  } catch (error) {
    logger.error('Failed to clear lead data', error)
  }
}

/**
 * Check if user has stored lead data (is a returning user)
 *
 * @returns true if lead data exists, false otherwise
 */
export function hasStoredLead(): boolean {
  return getStoredLeadId() !== null
}
