/**
 * Application logging utility
 *
 * Provides environment-aware logging that:
 * - Shows detailed errors in development
 * - Silences logs in production (can be configured for error tracking service)
 * - Prevents exposing sensitive error details to client
 */

const isDevelopment = process.env.NODE_ENV === 'development'

export const logger = {
  /**
   * Log error messages
   * In production, this would integrate with an error tracking service (e.g., Sentry)
   */
  error: (message: string, error?: unknown) => {
    if (isDevelopment) {
      console.error(`[ERROR] ${message}`, error)
    }
    // In production, send to error tracking service
    // Example: Sentry.captureException(error, { tags: { context: message } })
  },

  /**
   * Log warning messages
   */
  warn: (message: string, data?: unknown) => {
    if (isDevelopment) {
      console.warn(`[WARN] ${message}`, data)
    }
  },

  /**
   * Log info messages
   */
  info: (message: string, data?: unknown) => {
    if (isDevelopment) {
      console.log(`[INFO] ${message}`, data)
    }
  },

  /**
   * Log debug messages (development only)
   */
  debug: (message: string, data?: unknown) => {
    if (isDevelopment) {
      console.debug(`[DEBUG] ${message}`, data)
    }
  }
}
