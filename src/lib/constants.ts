/**
 * Application-wide constants
 *
 * This file contains all magic numbers and configuration values used throughout the application.
 * Using constants improves maintainability and makes configuration changes easier.
 */

// Free tier limits
export const MAX_FREE_MESSAGES = 3

// AI Configuration - Standard Chat
export const AI_MAX_TOKENS_STANDARD = 500
export const AI_TEMPERATURE_STANDARD = 0.7
export const AI_TOP_P_STANDARD = 0.9
export const CONVERSATION_CONTEXT_LIMIT_STANDARD = 6

// AI Configuration - Enhanced Chat
export const AI_MAX_TOKENS_ENHANCED = 600
export const AI_TEMPERATURE_ENHANCED = 0.8
export const AI_TOP_P_ENHANCED = 0.9
export const CONVERSATION_CONTEXT_LIMIT_ENHANCED = 8

// Network Configuration
export const API_TIMEOUT_MS = 30000 // 30 seconds

// Input Validation
export const MAX_MESSAGE_LENGTH = 2000

// =============================================================================
// Onboarding Intake Flow Constants
// =============================================================================

// Intake Input Validation
export const MAX_INTAKE_THOUGHTS_LENGTH = 500
export const MIN_INTAKE_THOUGHTS_LENGTH = 20

/**
 * Placeholder text for the initial thoughts textarea
 * Changes based on selected prompt type to provide contextually relevant examples
 */
export const INTAKE_PLACEHOLDERS = {
  PROMPT_ARCHITECT: "Describe your business, role, or the main areas where you need AI help. Example: 'I run a small bakery and need help with marketing copy, customer emails, and social media posts...'",
  DEFAULT: "Describe what you want your AI to do. Be as specific as you can in 2-3 sentences."
} as const

/**
 * Label text for the initial thoughts input field
 * Changes based on selected prompt type to guide user input appropriately
 */
export const INTAKE_LABELS = {
  PROMPT_ARCHITECT: "Tell us about your business or role",
  DEFAULT: "What do you want your AI to help you with?"
} as const

/**
 * Cookie configuration for intake session persistence
 * Cookie is used as backup; localStorage is the source of truth
 */
export const COOKIE_CONFIG = {
  NAME: 'prompt_architect_session',
  MAX_AGE: 30 * 24 * 60 * 60, // 30 days in seconds
  PATH: '/',
  SAME_SITE: 'lax' as const,
  SECURE: process.env.NODE_ENV === 'production'
} as const

/**
 * External links used throughout the application
 * Centralized here for easy updates and maintenance
 */
export const EXTERNAL_LINKS = {
  PROMPT_ARCHITECT_GUIDE: 'https://docs.google.com/document/d/13NviH4b6r4i3i2h8BOZVt0EhsOPP0hcD4I4KGFPZlTY/edit?tab=t.0'
} as const
