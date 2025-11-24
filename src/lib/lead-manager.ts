/**
 * Lead capture and management logic
 *
 * Handles creating, retrieving, and updating leads in Replit DB
 */

import type { ILead, IEmailCaptureForm, ICreateLeadResponse } from '@/types/lead'
import { dbGet, dbSet } from './db'
import { DB_KEYS, hashEmail, generateLeadId } from './db-schema'
import { validateEmail } from './email-validator'
import { logger } from './logger'
import { updateAnalytics } from './analytics-manager'

/**
 * Create a new lead in the database
 *
 * @param formData - Email and optional company from user
 * @param source - Where the lead was captured from
 * @param intakeData - Optional intake flow data
 * @returns Lead ID if successful, error if not
 */
export async function createLead(
  formData: IEmailCaptureForm,
  source: 'intake' | 'limit' | 'export',
  intakeData?: ILead['intakeData']
): Promise<ICreateLeadResponse> {
  // Validate email
  const validation = validateEmail(formData.email)
  if (!validation.isValid) {
    return {
      success: false,
      error: validation.error
    }
  }

  const normalizedEmail = validation.normalizedEmail!
  const emailHash = hashEmail(normalizedEmail)

  // Check if lead already exists
  const existingLeadId = await dbGet<string>(DB_KEYS.leadByEmail(emailHash))
  if (existingLeadId) {
    // Update existing lead instead of creating duplicate
    await updateLeadActivity(existingLeadId)
    return {
      success: true,
      leadId: existingLeadId
    }
  }

  // Create new lead
  const leadId = generateLeadId()
  const now = Date.now()

  const lead: ILead = {
    id: leadId,
    email: normalizedEmail,
    emailHash,
    company: formData.company?.trim() || undefined,
    createdAt: now,
    lastActive: now,
    source,
    intakeData,
    messagesUsed: 0,
    categoriesUsed: [],
    promptsCreated: source === 'intake' ? 1 : 0
  }

  // Store in database
  const leadStored = await dbSet(DB_KEYS.lead(leadId), lead)
  const emailIndexStored = await dbSet(DB_KEYS.leadByEmail(emailHash), leadId)

  if (!leadStored || !emailIndexStored) {
    logger.error('Failed to store lead in database', { leadId, email: normalizedEmail })
    return {
      success: false,
      error: 'database_error'
    }
  }

  // Update analytics
  await updateAnalytics('lead_created', { source, intakeData })

  logger.info('Lead created successfully', { leadId, source })

  return {
    success: true,
    leadId
  }
}

/**
 * Get lead by ID
 */
export async function getLead(leadId: string): Promise<ILead | null> {
  return await dbGet<ILead>(DB_KEYS.lead(leadId))
}

/**
 * Get lead by email
 */
export async function getLeadByEmail(email: string): Promise<ILead | null> {
  const emailHash = hashEmail(email)
  const leadId = await dbGet<string>(DB_KEYS.leadByEmail(emailHash))

  if (!leadId) {
    return null
  }

  return await getLead(leadId)
}

/**
 * Update lead's last active timestamp
 */
export async function updateLeadActivity(leadId: string): Promise<boolean> {
  const lead = await getLead(leadId)
  if (!lead) {
    return false
  }

  lead.lastActive = Date.now()
  return await dbSet(DB_KEYS.lead(leadId), lead)
}

/**
 * Increment message count for a lead
 */
export async function incrementLeadMessages(
  leadId: string,
  category: string
): Promise<boolean> {
  const lead = await getLead(leadId)
  if (!lead) {
    return false
  }

  lead.messagesUsed += 1
  lead.lastActive = Date.now()

  if (!lead.categoriesUsed.includes(category)) {
    lead.categoriesUsed.push(category)
  }

  return await dbSet(DB_KEYS.lead(leadId), lead)
}
