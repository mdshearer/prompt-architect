/**
 * Cookie Manager for Onboarding Intake Flow
 *
 * This module manages session persistence using a dual-storage strategy:
 * - localStorage: Primary source of truth (faster, more storage)
 * - Cookie: Backup for persistence across sessions
 *
 * Both storage mechanisms are kept in sync on all write operations.
 * Read operations check localStorage first, falling back to cookie.
 *
 * @module cookie-manager
 */

import type { IntakeCookie } from '@/types/intake'
import { COOKIE_CONFIG } from '@/lib/constants'
import { logger } from '@/lib/logger'

// LocalStorage key for intake data
const LOCAL_STORAGE_KEY = 'prompt_architect_intake'

/**
 * Serializes and sets the intake session cookie
 * Also syncs data to localStorage for redundancy
 *
 * @param data - The IntakeCookie object to store
 *
 * @example
 * setCookie({
 *   sessionId: 'abc-123',
 *   aiTool: 'chatgpt',
 *   promptType: 'prompt-architect',
 *   messageCount: 0,
 *   intakeCompleted: false,
 *   timestamp: new Date().toISOString()
 * })
 */
export function setCookie(data: IntakeCookie): void {
  try {
    const serialized = JSON.stringify(data)

    // Build cookie string with configuration
    const cookieValue = [
      `${COOKIE_CONFIG.NAME}=${encodeURIComponent(serialized)}`,
      `max-age=${COOKIE_CONFIG.MAX_AGE}`,
      `path=${COOKIE_CONFIG.PATH}`,
      `samesite=${COOKIE_CONFIG.SAME_SITE}`
    ]

    // Add secure flag in production
    if (COOKIE_CONFIG.SECURE) {
      cookieValue.push('secure')
    }

    document.cookie = cookieValue.join('; ')

    // Sync to localStorage for redundancy
    syncToLocalStorage(data)

    logger.info('Cookie set successfully', { sessionId: data.sessionId })
  } catch (error) {
    logger.error('Failed to set cookie', error)
  }
}

/**
 * Retrieves and parses the intake session data
 * Checks localStorage first (source of truth), falls back to cookie
 *
 * @returns The parsed IntakeCookie object, or null if not found/invalid
 *
 * @example
 * const cookie = getCookie()
 * if (cookie) {
 *   console.log(`User selected: ${cookie.aiTool}`)
 * }
 */
export function getCookie(): IntakeCookie | null {
  // Try localStorage first (source of truth)
  const localData = loadFromLocalStorage()
  if (localData) {
    return localData
  }

  // Fall back to cookie
  try {
    const cookies = document.cookie.split('; ')
    const targetCookie = cookies.find(c => c.startsWith(`${COOKIE_CONFIG.NAME}=`))

    if (!targetCookie) {
      return null
    }

    const value = targetCookie.split('=')[1]
    const decoded = decodeURIComponent(value)
    const parsed = JSON.parse(decoded) as IntakeCookie

    // Validate structure has required fields
    if (!isValidIntakeCookie(parsed)) {
      logger.warn('Cookie has invalid structure, clearing')
      clearCookie()
      return null
    }

    // Re-sync to localStorage if it was missing
    syncToLocalStorage(parsed)

    return parsed
  } catch (error) {
    logger.error('Failed to parse cookie', error)
    return null
  }
}

/**
 * Clears the intake session cookie and localStorage
 * Sets maxAge to -1 to immediately expire the cookie
 *
 * @example
 * // On "Start Over" button click
 * clearCookie()
 */
export function clearCookie(): void {
  try {
    // Expire the cookie immediately
    document.cookie = `${COOKIE_CONFIG.NAME}=; max-age=-1; path=${COOKIE_CONFIG.PATH}`

    // Clear localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(LOCAL_STORAGE_KEY)
    }

    logger.info('Cookie and localStorage cleared')
  } catch (error) {
    logger.error('Failed to clear cookie', error)
  }
}

/**
 * Syncs intake data to localStorage
 * Used as the primary storage mechanism with cookie as backup
 *
 * @param data - The IntakeCookie object to store in localStorage
 *
 * @example
 * syncToLocalStorage(cookieData)
 */
export function syncToLocalStorage(data: IntakeCookie): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data))
    }
  } catch (error) {
    // Handle quota exceeded or localStorage disabled
    logger.warn('Failed to sync to localStorage', error)
  }
}

/**
 * Loads intake data from localStorage
 * Returns null if localStorage is disabled, empty, or contains invalid data
 *
 * @returns The parsed IntakeCookie object, or null if not found/invalid
 *
 * @example
 * const data = loadFromLocalStorage()
 * if (data?.intakeCompleted) {
 *   showContinueButton()
 * }
 */
export function loadFromLocalStorage(): IntakeCookie | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null
    }

    const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (!stored) {
      return null
    }

    const parsed = JSON.parse(stored) as IntakeCookie

    // Validate structure
    if (!isValidIntakeCookie(parsed)) {
      logger.warn('localStorage has invalid structure, clearing')
      localStorage.removeItem(LOCAL_STORAGE_KEY)
      return null
    }

    return parsed
  } catch (error) {
    logger.warn('Failed to load from localStorage', error)
    return null
  }
}

/**
 * Updates specific fields in the existing cookie/localStorage data
 * Preserves existing fields while updating only specified ones
 *
 * @param updates - Partial IntakeCookie with fields to update
 *
 * @example
 * // Update just the message count
 * updateCookie({ messageCount: 2 })
 *
 * // Mark intake as completed
 * updateCookie({ intakeCompleted: true })
 */
export function updateCookie(updates: Partial<IntakeCookie>): void {
  const existing = getCookie()
  if (!existing) {
    logger.warn('Cannot update cookie - no existing cookie found')
    return
  }

  const updated: IntakeCookie = {
    ...existing,
    ...updates
  }

  setCookie(updated)
}

/**
 * Creates a new intake session with default values
 * Generates a unique sessionId and sets initial state
 *
 * @param aiTool - Optional AI tool to pre-select
 * @param promptType - Optional prompt type to pre-select
 * @returns The newly created IntakeCookie
 *
 * @example
 * // Start fresh intake flow
 * const cookie = createIntakeSession()
 *
 * // Start with pre-selected tool
 * const cookie = createIntakeSession('chatgpt')
 */
export function createIntakeSession(
  aiTool?: IntakeCookie['aiTool'],
  promptType?: IntakeCookie['promptType']
): IntakeCookie {
  const session: IntakeCookie = {
    sessionId: crypto.randomUUID(),
    aiTool: aiTool ?? 'chatgpt', // Default to chatgpt
    promptType: promptType ?? 'prompt-architect', // Default to recommended
    messageCount: 0,
    intakeCompleted: false,
    timestamp: new Date().toISOString()
  }

  setCookie(session)
  return session
}

/**
 * Type guard to validate IntakeCookie structure
 * Ensures all required fields are present with correct types
 *
 * @param data - Unknown data to validate
 * @returns True if data matches IntakeCookie structure
 */
function isValidIntakeCookie(data: unknown): data is IntakeCookie {
  if (!data || typeof data !== 'object') {
    return false
  }

  const cookie = data as Record<string, unknown>

  return (
    typeof cookie.sessionId === 'string' &&
    typeof cookie.aiTool === 'string' &&
    typeof cookie.promptType === 'string' &&
    typeof cookie.messageCount === 'number' &&
    typeof cookie.intakeCompleted === 'boolean' &&
    typeof cookie.timestamp === 'string'
  )
}
