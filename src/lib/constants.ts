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
