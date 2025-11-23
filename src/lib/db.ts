/**
 * Replit Database client wrapper
 *
 * Provides type-safe access to Replit DB with helper methods
 *
 * CONSTITUTION compliance:
 * - Explicit types (no any)
 * - Error handling with proper logging
 * - Server-side only (never expose to client)
 */

import Database from '@replit/database'
import { logger } from './logger'

// Singleton instance
let dbInstance: Database | null = null

/**
 * Get Replit DB instance (singleton pattern)
 */
export function getDB(): Database {
  if (!dbInstance) {
    dbInstance = new Database()
    logger.info('Replit DB initialized')
  }
  return dbInstance
}

/**
 * Generic get with type safety
 */
export async function dbGet<T>(key: string): Promise<T | null> {
  try {
    const db = getDB()
    const value = await db.get(key)
    return value as T | null
  } catch (error) {
    logger.error(`DB get error for key ${key}:`, error)
    return null
  }
}

/**
 * Generic set with type safety
 */
export async function dbSet<T>(key: string, value: T): Promise<boolean> {
  try {
    const db = getDB()
    await db.set(key, value)
    return true
  } catch (error) {
    logger.error(`DB set error for key ${key}:`, error)
    return false
  }
}

/**
 * Delete a key
 */
export async function dbDelete(key: string): Promise<boolean> {
  try {
    const db = getDB()
    await db.delete(key)
    return true
  } catch (error) {
    logger.error(`DB delete error for key ${key}:`, error)
    return false
  }
}

/**
 * List all keys matching a prefix
 * Useful for analytics and debugging
 */
export async function dbListKeys(prefix?: string): Promise<string[]> {
  try {
    const db = getDB()
    const result = await db.list(prefix)

    // Replit DB list() returns a Result type, extract the value
    if (result && typeof result === 'object' && 'ok' in result && result.ok) {
      return result.value as string[]
    }

    // Fallback for direct array response
    if (Array.isArray(result)) {
      return result
    }

    return []
  } catch (error) {
    logger.error(`DB list error for prefix ${prefix}:`, error)
    return []
  }
}

/**
 * Check if DB is accessible (health check)
 */
export async function dbHealthCheck(): Promise<boolean> {
  try {
    const db = getDB()
    await db.set('health_check', Date.now())
    const value = await db.get('health_check')
    return value !== null
  } catch (error) {
    logger.error('DB health check failed:', error)
    return false
  }
}
