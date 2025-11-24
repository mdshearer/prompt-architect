import { NextRequest, NextResponse } from 'next/server'
import type { IEmailCaptureForm, ILead } from '@/types/lead'
import { createLead } from '@/lib/lead-manager'
import { logger } from '@/lib/logger'

/**
 * POST /api/leads
 *
 * Create a new lead from email capture
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, company, source, intakeData } = body as {
      email: string
      company?: string
      source: 'intake' | 'limit' | 'export'
      intakeData?: ILead['intakeData']
    }

    // Validate required fields
    if (!email || !source) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create lead
    const result = await createLead(
      { email, company },
      source,
      intakeData
    )

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }

    logger.info('Lead created via API', { leadId: result.leadId, source })

    return NextResponse.json({
      success: true,
      leadId: result.leadId
    })

  } catch (error) {
    logger.error('Lead creation API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
