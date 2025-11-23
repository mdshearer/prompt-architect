# Technical Specification: Database Implementation & Email Capture System

**Status:** Phase 1 - Planning
**Priority:** P0 (Critical)
**Created:** 2025-11-23
**Architect:** Solution Architect
**Based on PRD:** `/home/user/prompt-architect/docs/prd-database-email-capture.md`

---

## 1. Architecture Overview

### Current State (No Database):
```
┌─────────────────────┐         ┌─────────────────────┐
│   Frontend          │         │   Together.ai API   │
│   (Next.js)         │────────►│   (AI Chat)         │
│   - React 19        │  HTTP   │   - Llama 3.3 70B   │
│   - Tailwind CSS    │◄────────│                     │
│   - localStorage    │         │                     │
└─────────────────────┘         └─────────────────────┘
         │
         │ In-memory Map (resets on restart!)
         ▼
┌─────────────────────┐
│   Rate Limiter      │
│   - Loses data      │
│   - No persistence  │
└─────────────────────┘
```

### New Architecture (With Replit DB):
```
┌─────────────────────┐         ┌─────────────────────┐
│   Frontend          │         │   Together.ai API   │
│   (Next.js)         │────────►│   (AI Chat)         │
│   - React 19        │  HTTP   │   - Llama 3.3 70B   │
│   - Tailwind CSS    │◄────────│                     │
│   - localStorage    │         │                     │
└─────────────────────┘         └─────────────────────┘
         │
         │ API calls
         ▼
┌─────────────────────┐         ┌─────────────────────┐
│   API Routes        │         │   Replit Database   │
│   /api/chat         │────────►│   (Key-Value Store) │
│   /api/leads        │  R/W    │   - Leads           │
│   /api/analytics    │◄────────│   - Rate limits     │
└─────────────────────┘         │   - Analytics       │
                                └─────────────────────┘
```

**Key Changes:**
- Add Replit DB as persistent data layer
- Create new API endpoints for lead capture
- Migrate rate limiter from Map to database
- Add email capture modal components
- Maintain backwards compatibility (localStorage still used for client state)

---

## 2. Component Structure

### New Files to Create:

```
src/
├── lib/
│   ├── db.ts                           # Replit DB client wrapper
│   ├── db-schema.ts                    # Database schema & key helpers
│   ├── lead-manager.ts                 # Lead capture & validation logic
│   ├── email-validator.ts              # Email validation & filtering
│   └── rate-limiter.ts                 # UPDATE: Migrate to Replit DB
│
├── components/
│   └── lead-capture/
│       ├── email-capture-modal.tsx     # Main email capture modal
│       ├── welcome-back-banner.tsx     # Returning user banner
│       └── thank-you-message.tsx       # Post-capture confirmation
│
├── app/
│   └── api/
│       ├── leads/
│       │   ├── route.ts                # POST: Create lead
│       │   └── [leadId]/
│       │       └── route.ts            # GET: Retrieve lead data
│       └── analytics/
│           └── route.ts                # GET: Analytics (admin only)
│
└── types/
    └── lead.ts                         # Lead & analytics type definitions
```

### Files to Modify:

```
src/
├── lib/
│   └── rate-limiter.ts                 # Migrate from Map to Replit DB
│
├── components/
│   └── onboarding/
│       └── output-display.tsx          # Add email capture modal trigger
│
└── app/
    └── api/
        └── chat/
            └── route.ts                # Update rate limiter calls
```

---

## 3. Type Definitions

### `src/types/lead.ts`

```typescript
/**
 * Lead capture and analytics types
 *
 * CONSTITUTION compliance: Explicit types, no any, strict null checks
 */

// Lead data structure
export interface ILead {
  id: string                    // UUID v4
  email: string                 // User's email (validated)
  emailHash: string             // SHA-256 hash for lookups
  company?: string              // Optional company name
  createdAt: number             // Unix timestamp
  lastActive: number            // Unix timestamp
  source: 'intake' | 'limit' | 'export'  // Where lead was captured

  // Intake flow data (if captured from intake)
  intakeData?: {
    aiTool: 'chatgpt' | 'claude' | 'gemini' | 'copilot'
    promptType: 'prompt-architect' | 'custom-instructions' | 'projects' | 'gems' | 'general-prompt'
    userThoughts: string        // Original input (20-500 chars)
  }

  // Usage tracking
  messagesUsed: number          // Total messages sent
  categoriesUsed: string[]      // Which categories they've used
  promptsCreated: number        // Count of prompts generated
}

// Email capture form data
export interface IEmailCaptureForm {
  email: string
  company?: string
}

// Email validation result
export interface IEmailValidation {
  isValid: boolean
  error?: 'invalid_format' | 'disposable_email' | 'required'
  normalizedEmail?: string      // Lowercased, trimmed
}

// Rate limit entry (Replit DB)
export interface IRateLimitEntry {
  ip: string                    // Client IP address
  emailHash?: string            // If user has provided email
  count: number                 // Messages sent
  firstRequest: number          // Unix timestamp
  lastReset: number             // Unix timestamp
  isUnlimited: boolean          // True if email provided
}

// Analytics data
export interface IAnalytics {
  totalLeads: number
  totalSessions: number
  totalMessages: number

  // Breakdown by AI tool
  aiToolUsage: Record<string, number>

  // Breakdown by prompt type
  promptTypeUsage: Record<string, number>

  // Conversion funnel
  intakeCompletions: number
  emailCaptureRate: number      // Percentage

  // Last updated
  lastUpdated: number           // Unix timestamp
}

// API response types
export interface ICreateLeadResponse {
  success: boolean
  leadId?: string
  error?: string
}

export interface IGetLeadResponse {
  success: boolean
  lead?: ILead
  error?: string
}

export interface IAnalyticsResponse {
  success: boolean
  data?: IAnalytics
  error?: string
}
```

---

## 4. Replit Database Schema

### Database Structure (Key-Value Store)

Replit DB is a simple key-value store. We'll use prefixed keys for organization:

```typescript
// Key patterns:
//
// Leads:        "lead:{leadId}"                    → ILead
// Lead by email: "lead_email:{emailHash}"          → string (leadId)
// Rate limits:  "ratelimit:{ip}"                   → IRateLimitEntry
// Analytics:    "analytics"                        → IAnalytics
```

### Example Data:

```typescript
// Lead entry
"lead:550e8400-e29b-41d4-a716-446655440000" → {
  id: "550e8400-e29b-41d4-a716-446655440000",
  email: "user@company.com",
  emailHash: "a3c5b...",
  company: "Acme Corp",
  createdAt: 1700000000000,
  lastActive: 1700000000000,
  source: "intake",
  intakeData: {
    aiTool: "chatgpt",
    promptType: "prompt-architect",
    userThoughts: "I want to improve my marketing prompts"
  },
  messagesUsed: 3,
  categoriesUsed: ["custom_instructions"],
  promptsCreated: 1
}

// Email lookup (for fast retrieval)
"lead_email:a3c5b..." → "550e8400-e29b-41d4-a716-446655440000"

// Rate limit entry
"ratelimit:192.168.1.1" → {
  ip: "192.168.1.1",
  emailHash: "a3c5b...",
  count: 3,
  firstRequest: 1700000000000,
  lastReset: 1700000000000,
  isUnlimited: true
}

// Analytics
"analytics" → {
  totalLeads: 42,
  totalSessions: 150,
  totalMessages: 450,
  aiToolUsage: {
    "chatgpt": 25,
    "claude": 10,
    "gemini": 5,
    "copilot": 2
  },
  promptTypeUsage: {
    "prompt-architect": 30,
    "custom-instructions": 8,
    "projects": 2,
    "gems": 2
  },
  intakeCompletions: 42,
  emailCaptureRate: 30.5,
  lastUpdated: 1700000000000
}
```

---

## 5. Implementation Details

### 5.1 Replit DB Client (`src/lib/db.ts`)

```typescript
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
    const keys = await db.list(prefix)
    return keys
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
```

### 5.2 Database Schema Helpers (`src/lib/db-schema.ts`)

```typescript
/**
 * Database schema and key generation helpers
 *
 * Centralizes all DB key patterns for consistency
 */

import { createHash } from 'crypto'

/**
 * Generate DB keys with consistent prefixes
 */
export const DB_KEYS = {
  // Lead keys
  lead: (leadId: string) => `lead:${leadId}`,
  leadByEmail: (emailHash: string) => `lead_email:${emailHash}`,

  // Rate limiting keys
  rateLimit: (ip: string) => `ratelimit:${ip}`,

  // Analytics key
  analytics: () => 'analytics',
} as const

/**
 * Hash email for privacy and lookups
 * Uses SHA-256 for consistent hashing
 */
export function hashEmail(email: string): string {
  const normalized = email.toLowerCase().trim()
  return createHash('sha256').update(normalized).digest('hex')
}

/**
 * Generate UUID v4 for lead IDs
 */
export function generateLeadId(): string {
  return crypto.randomUUID()
}

/**
 * Key patterns for listing/filtering
 */
export const DB_PREFIXES = {
  leads: 'lead:',
  leadEmails: 'lead_email:',
  rateLimits: 'ratelimit:',
} as const
```

### 5.3 Email Validator (`src/lib/email-validator.ts`)

```typescript
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
  // Add more as needed
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
```

### 5.4 Lead Manager (`src/lib/lead-manager.ts`)

```typescript
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
```

### 5.5 Updated Rate Limiter (`src/lib/rate-limiter.ts`)

**Changes from existing file:**
- Replace `Map` with Replit DB
- Add email-based unlimited access
- Persist across server restarts

```typescript
/**
 * Updated rate limiter with Replit DB persistence
 *
 * MIGRATION: Replaces in-memory Map with database storage
 */

import type { IRateLimitEntry } from '@/types/lead'
import { dbGet, dbSet } from './db'
import { DB_KEYS, hashEmail } from './db-schema'
import { MAX_FREE_MESSAGES } from './constants'

// Time-based configuration
const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000 // 24 hours

/**
 * Check if client has exceeded rate limit
 *
 * CHANGED: Now checks database instead of Map
 * CHANGED: Email users get unlimited access
 */
export async function checkRateLimit(
  clientId: string,
  userEmail?: string,
  isIntake: boolean = false
): Promise<{
  allowed: boolean
  currentCount: number
  limit: number
  resetsAt: number
  isUnlimited: boolean
}> {
  // Intake flow is exempt
  if (isIntake) {
    return {
      allowed: true,
      currentCount: 0,
      limit: MAX_FREE_MESSAGES,
      resetsAt: Date.now() + RATE_LIMIT_WINDOW_MS,
      isUnlimited: false
    }
  }

  const now = Date.now()
  const key = DB_KEYS.rateLimit(clientId)

  // Get existing rate limit entry
  let entry = await dbGet<IRateLimitEntry>(key)

  // If user has email, they get unlimited access
  if (userEmail) {
    const emailHash = hashEmail(userEmail)

    if (!entry) {
      entry = {
        ip: clientId,
        emailHash,
        count: 0,
        firstRequest: now,
        lastReset: now,
        isUnlimited: true
      }
      await dbSet(key, entry)
    } else if (!entry.isUnlimited) {
      // Upgrade existing entry to unlimited
      entry.emailHash = emailHash
      entry.isUnlimited = true
      await dbSet(key, entry)
    }

    return {
      allowed: true,
      currentCount: entry.count,
      limit: MAX_FREE_MESSAGES,
      resetsAt: now + RATE_LIMIT_WINDOW_MS,
      isUnlimited: true
    }
  }

  // No entry exists - create new one
  if (!entry) {
    entry = {
      ip: clientId,
      count: 0,
      firstRequest: now,
      lastReset: now,
      isUnlimited: false
    }
    await dbSet(key, entry)

    return {
      allowed: true,
      currentCount: 0,
      limit: MAX_FREE_MESSAGES,
      resetsAt: now + RATE_LIMIT_WINDOW_MS,
      isUnlimited: false
    }
  }

  // Check if window has expired - reset counter
  if (now - entry.lastReset > RATE_LIMIT_WINDOW_MS) {
    entry.count = 0
    entry.lastReset = now
    await dbSet(key, entry)
  }

  return {
    allowed: entry.count < MAX_FREE_MESSAGES,
    currentCount: entry.count,
    limit: MAX_FREE_MESSAGES,
    resetsAt: entry.lastReset + RATE_LIMIT_WINDOW_MS,
    isUnlimited: false
  }
}

/**
 * Increment rate limit counter
 *
 * CHANGED: Stores in database instead of Map
 */
export async function incrementRateLimit(
  clientId: string,
  isIntake: boolean = false
): Promise<void> {
  // Intake doesn't count toward limit
  if (isIntake) {
    return
  }

  const key = DB_KEYS.rateLimit(clientId)
  const entry = await dbGet<IRateLimitEntry>(key)

  if (entry) {
    entry.count += 1
    await dbSet(key, entry)
  } else {
    // Shouldn't happen if checkRateLimit was called first
    const now = Date.now()
    await dbSet(key, {
      ip: clientId,
      count: 1,
      firstRequest: now,
      lastReset: now,
      isUnlimited: false
    })
  }
}

/**
 * Get client IP (unchanged from original)
 */
export function getClientIP(request: Request): string {
  const headers = request.headers
  const forwarded = headers.get('x-forwarded-for')

  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }

  const realIP = headers.get('x-real-ip')
  if (realIP) {
    return realIP
  }

  return 'unknown-client'
}
```

### 5.6 Analytics Manager (`src/lib/analytics-manager.ts`)

```typescript
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
```

---

## 6. React Components

### 6.1 Email Capture Modal (`src/components/lead-capture/email-capture-modal.tsx`)

```typescript
'use client'

import { useState } from 'react'
import type { IEmailCaptureForm } from '@/types/lead'
import { X } from 'lucide-react'

interface EmailCaptureModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (formData: IEmailCaptureForm) => Promise<void>
  trigger: 'intake' | 'limit' | 'export'
}

export default function EmailCaptureModal({
  isOpen,
  onClose,
  onSubmit,
  trigger
}: EmailCaptureModalProps) {
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await onSubmit({ email, company: company || undefined })
      // Success - parent component will handle closing and showing success
    } catch (err) {
      setError('Failed to save. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Different copy based on trigger point
  const getHeaderText = () => {
    switch (trigger) {
      case 'intake':
        return '✨ Your Custom Prompt is Ready!'
      case 'limit':
        return '🎯 Want Unlimited Access?'
      case 'export':
        return '📧 Email This Prompt to Yourself'
    }
  }

  const getSubheadText = () => {
    switch (trigger) {
      case 'intake':
        return 'Want to save this and create unlimited prompts?'
      case 'limit':
        return "You've used your 3 free messages. Get unlimited access:"
      case 'export':
        return "We'll send this prompt to your email and save it to your library:"
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md mx-4 mb-0 sm:mb-4 shadow-2xl">
        {/* Header accent */}
        <div className="h-2 bg-gradient-to-r from-optimi-blue to-optimi-green rounded-t-2xl" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-optimi-gray hover:text-optimi-primary transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-optimi-primary mb-2">
            {getHeaderText()}
          </h2>
          <p className="text-optimi-gray mb-6">
            {getSubheadText()}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-optimi-gray mb-1">
                Email address *
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                autoFocus
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-optimi-blue focus:border-optimi-blue text-lg"
              />
            </div>

            {/* Company input (optional) */}
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-optimi-gray mb-1">
                Company name (optional)
              </label>
              <input
                type="text"
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Acme Corp"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-optimi-blue focus:border-optimi-blue"
              />
            </div>

            {/* Error message */}
            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}

            {/* Benefits */}
            <div className="bg-optimi-blue/5 rounded-lg p-4 space-y-2">
              <p className="text-sm text-optimi-gray flex items-center gap-2">
                <span className="text-optimi-green">✓</span> Access on any device
              </p>
              <p className="text-sm text-optimi-gray flex items-center gap-2">
                <span className="text-optimi-green">✓</span> Never lose your work
              </p>
              <p className="text-sm text-optimi-gray flex items-center gap-2">
                <span className="text-optimi-green">✓</span> No spam, ever
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-optimi-blue hover:bg-optimi-primary text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : 'Save My Prompts'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="sm:flex-none border border-optimi-gray text-optimi-gray hover:bg-gray-50 font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Maybe Later
              </button>
            </div>

            {/* Privacy note */}
            <p className="text-xs text-center text-gray-500">
              By providing your email, you agree to receive prompt-related updates from Optimi.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
```

### 6.2 Thank You Message (`src/components/lead-capture/thank-you-message.tsx`)

```typescript
'use client'

import { CheckCircle } from 'lucide-react'

interface ThankYouMessageProps {
  email: string
  onContinue: () => void
}

export default function ThankYouMessage({ email, onContinue }: ThankYouMessageProps) {
  return (
    <div className="text-center space-y-4 p-6">
      <div className="flex justify-center">
        <CheckCircle className="w-16 h-16 text-optimi-green" />
      </div>

      <h3 className="text-2xl font-bold text-optimi-primary">
        All Set! 🎉
      </h3>

      <p className="text-optimi-gray">
        Your prompts are now saved to <strong>{email}</strong>
      </p>

      <p className="text-sm text-optimi-gray">
        You now have unlimited access to all features.
      </p>

      <button
        onClick={onContinue}
        className="bg-optimi-blue hover:bg-optimi-primary text-white font-semibold py-3 px-8 rounded-lg transition-colors"
      >
        Continue Creating Prompts
      </button>
    </div>
  )
}
```

---

## 7. API Routes

### 7.1 Create Lead Endpoint (`src/app/api/leads/route.ts`)

```typescript
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
```

### 7.2 Analytics Endpoint (`src/app/api/analytics/route.ts`)

```typescript
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
```

---

## 8. Integration Points

### 8.1 Update Intake Output Display

**File:** `src/components/onboarding/output-display.tsx`

**Changes:**
1. Import `EmailCaptureModal` and `ThankYouMessage`
2. Add state for showing modal
3. Show modal after output is displayed
4. Handle email submission
5. Store leadId in localStorage for future use

**Integration code:**
```typescript
// Add to existing output-display.tsx

import EmailCaptureModal from '@/components/lead-capture/email-capture-modal'
import ThankYouMessage from '@/components/lead-capture/thank-you-message'

// Add state
const [showEmailModal, setShowEmailModal] = useState(false)
const [leadId, setLeadId] = useState<string | null>(null)
const [showThankYou, setShowThankYou] = useState(false)

// Show modal after output is displayed (add to useEffect)
useEffect(() => {
  if (output) {
    // Check if user already provided email
    const existingLeadId = localStorage.getItem('prompt-architect-lead-id')
    if (!existingLeadId) {
      // Show email capture modal after 2 seconds
      setTimeout(() => setShowEmailModal(true), 2000)
    }
  }
}, [output])

// Handle email submission
const handleEmailSubmit = async (formData: IEmailCaptureForm) => {
  const response = await fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: formData.email,
      company: formData.company,
      source: 'intake',
      intakeData: {
        aiTool,
        promptType,
        userThoughts
      }
    })
  })

  const result = await response.json()

  if (result.success) {
    // Store lead ID for future use
    localStorage.setItem('prompt-architect-lead-id', result.leadId)
    setLeadId(result.leadId)

    // Show thank you message
    setShowEmailModal(false)
    setShowThankYou(true)
  }
}

// Add to JSX
{showEmailModal && (
  <EmailCaptureModal
    isOpen={showEmailModal}
    onClose={() => setShowEmailModal(false)}
    onSubmit={handleEmailSubmit}
    trigger="intake"
  />
)}

{showThankYou && (
  <div className="mt-6">
    <ThankYouMessage
      email={/* stored email */}
      onContinue={() => setShowThankYou(false)}
    />
  </div>
)}
```

---

## 9. Security Considerations

### 9.1 API Key Protection
- ✅ Replit DB is server-side only (never exposed to client)
- ✅ No database credentials in client bundle
- ✅ Together.ai API key remains server-side

### 9.2 Input Validation
- ✅ Email validation on client AND server
- ✅ Disposable email filtering
- ✅ SQL injection not possible (key-value store, not SQL)
- ✅ Rate limiting prevents spam submissions

### 9.3 Data Privacy
- ✅ Email hashed for lookups (SHA-256)
- ✅ Plain email stored for contact (necessary for lead magnet)
- ✅ No sensitive PII required (just email + optional company)
- ✅ Clear privacy policy on modal

### 9.4 Access Control
- ✅ Analytics endpoint should add authentication (Phase 2)
- ✅ Lead data not exposed to client (only leadId returned)
- ✅ No way to enumerate all leads from client

---

## 10. Performance Considerations

### 10.1 Bundle Size Impact
- **Replit DB:** Server-side only, 0 bytes added to client bundle
- **Email validator:** ~1KB (simple regex + array)
- **Email modal component:** ~3KB (React component)
- **Total impact:** < 5KB (negligible)

### 10.2 API Response Times
- **Replit DB read:** ~10-50ms (key-value lookups are fast)
- **Replit DB write:** ~20-100ms (acceptable for non-blocking operations)
- **Email capture flow:** < 200ms total (user won't notice)

### 10.3 Database Quota
- **Replit DB free tier:** 50MB
- **Average lead size:** ~500 bytes
- **Capacity:** ~100,000 leads (way more than needed for MVP)
- **Cost:** $0/month (within free tier)

### 10.4 Optimization Strategies
- ✅ Use async/await properly (non-blocking DB calls)
- ✅ Lazy load EmailCaptureModal (only when needed)
- ✅ Cache analytics (update every 5 minutes, not every request)
- ✅ Batch analytics updates (aggregate, then write once)

---

## 11. Testing Strategy

### 11.1 Unit Tests (Manual for MVP)
- [ ] Email validation (valid, invalid, disposable)
- [ ] Email hashing (consistent results)
- [ ] Lead creation (new vs existing)
- [ ] Rate limiter (with email vs without)

### 11.2 Integration Tests
- [ ] POST /api/leads with valid data → 200
- [ ] POST /api/leads with invalid email → 400
- [ ] POST /api/leads with disposable email → 400
- [ ] GET /api/analytics → returns valid data

### 11.3 E2E Tests (Manual)
- [ ] Complete intake flow → email modal appears
- [ ] Submit email → thank you message shows
- [ ] Refresh page → no email modal (already captured)
- [ ] Hit 3-message limit → email modal appears
- [ ] Provide email → unlimited access granted

### 11.4 Browser Testing
- [ ] Chrome desktop
- [ ] Safari desktop
- [ ] iOS Safari (modal bottom sheet)
- [ ] Android Chrome
- [ ] Firefox

---

## 12. Migration Plan

### Phase 1: Add Database (No Breaking Changes)
1. Install `@replit/database` package
2. Create new lib files (db.ts, db-schema.ts, etc.)
3. Create new components (email-capture-modal.tsx, etc.)
4. Create new API routes (/api/leads, /api/analytics)
5. **Do NOT change existing rate-limiter yet** (test DB first)

### Phase 2: Migrate Rate Limiter
6. Update rate-limiter.ts to use Replit DB
7. Test thoroughly (rate limiting is critical)
8. Deploy and monitor

### Phase 3: Integrate Email Capture
9. Add email modal to intake flow
10. Add email modal to 3-message limit
11. Test conversion funnel
12. Monitor analytics

### Rollback Plan
- If Replit DB fails: Code falls back to in-memory Map
- If email capture breaks intake: Remove modal temporarily
- Database is additive (doesn't break existing features)

---

## 13. Success Criteria

### Technical Success:
- ✅ Replit DB operational (health check passes)
- ✅ Leads stored successfully (no data loss)
- ✅ Rate limiting persists across restarts
- ✅ Email validation blocks invalid/disposable emails
- ✅ No performance regression (< 200ms API response)
- ✅ Zero TypeScript errors (`npm run type-check`)
- ✅ Zero ESLint errors (`npm run lint`)
- ✅ Production build succeeds (`npm run build`)

### Business Success:
- ✅ 30%+ email capture rate from intake completions
- ✅ 50%+ of emails are valid company emails
- ✅ Analytics tracking works (data populates)
- ✅ Zero user complaints about modal UX
- ✅ Database costs stay within free tier ($0/month)

---

## 14. Implementation Steps (Task Breakdown for Developer)

### Week 1 - Days 1-2: Database Foundation
1. Install `@replit/database` package
2. Create `src/lib/db.ts` (DB client wrapper)
3. Create `src/lib/db-schema.ts` (key helpers)
4. Create `src/types/lead.ts` (type definitions)
5. Test DB connection (health check)

### Week 1 - Days 3-4: Lead Management
6. Create `src/lib/email-validator.ts`
7. Create `src/lib/lead-manager.ts`
8. Create `src/lib/analytics-manager.ts`
9. Create `src/app/api/leads/route.ts`
10. Create `src/app/api/analytics/route.ts`
11. Test API endpoints

### Week 1 - Days 5-6: React Components
12. Create `src/components/lead-capture/email-capture-modal.tsx`
13. Create `src/components/lead-capture/thank-you-message.tsx`
14. Test components in isolation
15. Integrate modal into `output-display.tsx`

### Week 1 - Day 7: Rate Limiter Migration
16. Update `src/lib/rate-limiter.ts` to use Replit DB
17. Update `src/app/api/chat/route.ts` to pass email
18. Test rate limiting (with email vs without)
19. Verify unlimited access works

### Testing & Deployment:
20. Run type-check, lint, build
21. Test email capture flow end-to-end
22. Test on mobile devices
23. Monitor analytics endpoint
24. Deploy to production

---

## 15. Open Questions (To Resolve During Implementation)

1. **Analytics Access Control:** Should `/api/analytics` require authentication? (For now, no - add later)
2. **Email Delivery:** Phase 2 feature - which service? (SendGrid vs Resend)
3. **Lead Export:** How should sales team access leads? (CSV download from admin panel?)
4. **Data Retention:** How long to keep inactive leads? (Recommend: 1 year, then archive)
5. **GDPR Compliance:** Need data export/deletion endpoints? (Recommend: Yes, Phase 2)

---

## 16. Dependencies

### New Package Required:
```json
{
  "dependencies": {
    "@replit/database": "^2.1.3"
  }
}
```

**Installation:**
```bash
npm install @replit/database
```

**No other dependencies needed** - Everything else uses built-in Node.js crypto, React, and Next.js.

---

## 17. CONSTITUTION Compliance Checklist

- ✅ TypeScript strict mode (all types explicit)
- ✅ No `any` types used
- ✅ Kebab-case file names (`email-capture-modal.tsx`)
- ✅ PascalCase component names (`EmailCaptureModal`)
- ✅ Functional components with hooks (no class components)
- ✅ Client components marked with `'use client'`
- ✅ Server-side only code in `/lib` and `/app/api`
- ✅ Tailwind CSS for styling (no custom CSS files)
- ✅ Optimi brand colors used
- ✅ Mobile-first responsive design
- ✅ Reusable components (modal, thank you message)
- ✅ Error handling with logger
- ✅ Input validation on client AND server
- ✅ Security best practices (API keys server-side, email hashing)

---

**Next Phase:** Developer implements tasks from section 14, following this spec exactly.

**Approval Required:** Product Owner and Tech Lead sign-off before proceeding to Phase 2 (Implementation).
