import { NextResponse } from 'next/server'
import { getAnalytics } from '@/lib/analytics-manager'
import { logger } from '@/lib/logger'

/**
 * GET /api/analytics
 *
 * Get current analytics data (admin only - add auth later)
 */
export async function GET() {
  try {
    const analytics = await getAnalytics()

    return NextResponse.json({
      success: true,
      data: analytics
    })

  } catch (error) {
    logger.error('Analytics API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
