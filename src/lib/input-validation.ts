/**
 * Input validation and sanitization utilities for user messages
 *
 * Protects against:
 * - Prompt injection attacks
 * - Excessive message length (token overflow)
 * - XSS attempts (though React handles this, defense in depth)
 * - Malicious special characters
 *
 * CONSTITUTION compliance: Security standards (lines 136-154)
 */

// Configuration constants per CONSTITUTION standards
const MAX_MESSAGE_LENGTH = 2000
const MIN_MESSAGE_LENGTH = 1

export interface ValidationResult {
  isValid: boolean
  sanitizedMessage?: string
  error?: string
  errorCode?: 'TOO_LONG' | 'TOO_SHORT' | 'INVALID_CHARS' | 'EMPTY'
}

/**
 * Sanitize user input to prevent prompt injection and other attacks
 *
 * Removes/neutralizes:
 * - Control characters that could manipulate AI behavior
 * - Excessive whitespace
 * - Potentially malicious patterns
 *
 * @param message - Raw user input
 * @returns Sanitized message safe for AI processing
 */
export function sanitizeMessage(message: string): string {
  if (!message) return ''

  let sanitized = message

  // Remove null bytes and other control characters except newlines and tabs
  sanitized = sanitized.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '')

  // Normalize whitespace: replace multiple spaces with single space
  sanitized = sanitized.replace(/[ ]+/g, ' ')

  // Normalize newlines: max 2 consecutive newlines
  sanitized = sanitized.replace(/\n{3,}/g, '\n\n')

  // Trim leading/trailing whitespace
  sanitized = sanitized.trim()

  // Remove common prompt injection patterns
  // Look for attempts to manipulate system behavior
  const suspiciousPatterns = [
    /ignore\s+previous\s+instructions/gi,
    /ignore\s+all\s+previous/gi,
    /disregard\s+previous/gi,
    /new\s+instructions:/gi,
    /system\s+prompt:/gi,
    /you\s+are\s+now/gi
  ]

  // Flag suspicious patterns but don't remove them entirely
  // (users might legitimately discuss prompt engineering)
  // Instead, escape them to neutralize potential attacks
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(sanitized)) {
      // Add a zero-width space to break the pattern
      sanitized = sanitized.replace(pattern, (match) => {
        return match.split('').join('\u200B')
      })
    }
  }

  return sanitized
}

/**
 * Validate message length and content
 *
 * @param message - User message to validate
 * @returns Validation result with sanitized message or error
 */
export function validateMessage(message: string): ValidationResult {
  // Check for empty/null
  if (!message || typeof message !== 'string') {
    return {
      isValid: false,
      error: 'Message cannot be empty',
      errorCode: 'EMPTY'
    }
  }

  // Trim and check minimum length
  const trimmed = message.trim()
  if (trimmed.length < MIN_MESSAGE_LENGTH) {
    return {
      isValid: false,
      error: 'Message is too short',
      errorCode: 'TOO_SHORT'
    }
  }

  // Check maximum length BEFORE sanitization
  // (prevents attackers from using sanitization to bypass length check)
  if (message.length > MAX_MESSAGE_LENGTH) {
    return {
      isValid: false,
      error: `Message exceeds maximum length of ${MAX_MESSAGE_LENGTH} characters`,
      errorCode: 'TOO_LONG'
    }
  }

  // Sanitize the message
  const sanitized = sanitizeMessage(message)

  // Verify sanitized message isn't empty
  if (!sanitized || sanitized.length === 0) {
    return {
      isValid: false,
      error: 'Message contains only invalid characters',
      errorCode: 'INVALID_CHARS'
    }
  }

  return {
    isValid: true,
    sanitizedMessage: sanitized
  }
}

/**
 * Validate conversation history array
 * Ensures history doesn't contain malicious or oversized data
 *
 * @param history - Array of previous messages
 * @returns Validation result
 */
export function validateHistory(history: unknown): {
  isValid: boolean
  error?: string
} {
  // Check if history is an array
  if (!Array.isArray(history)) {
    return {
      isValid: false,
      error: 'History must be an array'
    }
  }

  // Check history size (prevent memory attacks)
  if (history.length > 100) {
    return {
      isValid: false,
      error: 'History is too long (max 100 messages)'
    }
  }

  // Validate each message in history
  for (const msg of history) {
    if (!msg || typeof msg !== 'object') {
      return {
        isValid: false,
        error: 'Invalid message in history'
      }
    }

    const message = msg as Record<string, unknown>

    // Check required fields
    if (!message.content || typeof message.content !== 'string') {
      return {
        isValid: false,
        error: 'Message content must be a string'
      }
    }

    if (!message.role || (message.role !== 'user' && message.role !== 'assistant')) {
      return {
        isValid: false,
        error: 'Message role must be "user" or "assistant"'
      }
    }

    // Validate message content length
    if (message.content.length > MAX_MESSAGE_LENGTH * 2) {
      return {
        isValid: false,
        error: 'Message in history exceeds maximum length'
      }
    }
  }

  return { isValid: true }
}

/**
 * Get validation constants (for frontend use)
 */
export function getValidationLimits() {
  return {
    maxLength: MAX_MESSAGE_LENGTH,
    minLength: MIN_MESSAGE_LENGTH
  }
}
