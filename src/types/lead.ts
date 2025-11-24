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
