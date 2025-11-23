/**
 * Email validation and disposable email filtering
 *
 * SECURITY: Prevents spam and invalid emails from being stored
 */

import type { IEmailValidation } from '@/types/lead'

// Common disposable email domains to block
const DISPOSABLE_DOMAINS = [
  'tempmail.com',
  'guerrillamail.com',
  'mailinator.com',
  '10minutemail.com',
  'throwaway.email',
  'temp-mail.org',
  'fakeinbox.com',
  'trashmail.com',
  'discard.email',
  'getnada.com',
  'tempinbox.com',
  'sharklasers.com'
]

/**
 * Validate email format using RFC 5322 compliant regex
 */
function isValidEmailFormat(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Check if email is from disposable domain
 */
function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase()
  return DISPOSABLE_DOMAINS.includes(domain)
}

/**
 * Normalize email (lowercase, trim)
 */
function normalizeEmail(email: string): string {
  return email.toLowerCase().trim()
}

/**
 * Validate email and return result
 */
export function validateEmail(email: string): IEmailValidation {
  // Check if empty
  if (!email || email.trim().length === 0) {
    return {
      isValid: false,
      error: 'required'
    }
  }

  const normalized = normalizeEmail(email)

  // Check format
  if (!isValidEmailFormat(normalized)) {
    return {
      isValid: false,
      error: 'invalid_format'
    }
  }

  // Check for disposable email
  if (isDisposableEmail(normalized)) {
    return {
      isValid: false,
      error: 'disposable_email'
    }
  }

  return {
    isValid: true,
    normalizedEmail: normalized
  }
}
