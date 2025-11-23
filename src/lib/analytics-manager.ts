/**
 * Analytics tracking and aggregation
 *
 * Tracks user behavior for business intelligence
 */

import type { IAnalytics, ILead } from '@/types/lead'
import { dbGet, dbSet } from './db'
import { DB_KEYS } from './db-schema'
import { logger } from './logger'

/**
 * Initialize analytics if doesn't exist
 */
async function getOrCreateAnalytics(): Promise<IAnalytics> {
  const existing = await dbGet<IAnalytics>(DB_KEYS.analytics())

  if (existing) {
    return existing
  }

  const initial: IAnalytics = {
    totalLeads: 0,
    totalSessions: 0,
    totalMessages: 0,
    aiToolUsage: {},
    promptTypeUsage: {},
    intakeCompletions: 0,
    emailCaptureRate: 0,
    lastUpdated: Date.now()
  }

  await dbSet(DB_KEYS.analytics(), initial)
  return initial
}

/**
 * Update analytics based on event
 */
export async function updateAnalytics(
  event: 'lead_created' | 'session_started' | 'message_sent' | 'intake_completed',
  data?: {
    source?: string
    intakeData?: ILead['intakeData']
  }
): Promise<void> {
  try {
    const analytics = await getOrCreateAnalytics()

    switch (event) {
      case 'lead_created':
        analytics.totalLeads += 1
        break

      case 'session_started':
        analytics.totalSessions += 1
        break

      case 'message_sent':
        analytics.totalMessages += 1
        break

      case 'intake_completed':
        analytics.intakeCompletions += 1

        // Track AI tool usage
        if (data?.intakeData?.aiTool) {
          const tool = data.intakeData.aiTool
          analytics.aiToolUsage[tool] = (analytics.aiToolUsage[tool] || 0) + 1
        }

        // Track prompt type usage
        if (data?.intakeData?.promptType) {
          const type = data.intakeData.promptType
          analytics.promptTypeUsage[type] = (analytics.promptTypeUsage[type] || 0) + 1
        }
        break
    }

    // Calculate email capture rate
    if (analytics.intakeCompletions > 0) {
      analytics.emailCaptureRate = (analytics.totalLeads / analytics.intakeCompletions) * 100
    }

    analytics.lastUpdated = Date.now()
    await dbSet(DB_KEYS.analytics(), analytics)

  } catch (error) {
    logger.error('Failed to update analytics:', error)
  }
}

/**
 * Get current analytics (for admin dashboard)
 */
export async function getAnalytics(): Promise<IAnalytics> {
  return await getOrCreateAnalytics()
}
