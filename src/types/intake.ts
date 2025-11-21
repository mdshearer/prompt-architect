/**
 * Type definitions and constants for the Onboarding Intake Flow
 *
 * This file contains all TypeScript interfaces, types, and constants used
 * throughout the intake flow system for managing user preferences and session data.
 *
 * @module intake
 */

/**
 * Interface for the intake session cookie/localStorage data
 *
 * This flat structure stores user preferences and session metadata.
 * Data is synced between cookie (for persistence) and localStorage (source of truth).
 *
 * @interface IntakeCookie
 * @property {string} sessionId - Unique session identifier (generated with crypto.randomUUID())
 * @property {string} aiTool - Selected AI tool platform
 * @property {string} promptType - Type of prompt the user wants to create
 * @property {number} messageCount - Number of messages sent in current session
 * @property {boolean} intakeCompleted - Whether user has completed the intake flow
 * @property {string} timestamp - ISO-8601 formatted timestamp of cookie creation
 */
export interface IntakeCookie {
  sessionId: string
  aiTool: 'chatgpt' | 'claude' | 'gemini' | 'copilot'
  promptType: 'prompt-architect' | 'custom-instructions' | 'projects' | 'gems' | 'general-prompt'
  messageCount: number
  intakeCompleted: boolean
  timestamp: string
}

/**
 * Supported AI tool platforms
 *
 * Each tool has different capabilities and available prompt types.
 * Used for filtering prompt type options and loading tool-specific instructions.
 */
export const AI_TOOLS = {
  CHATGPT: 'chatgpt',
  CLAUDE: 'claude',
  GEMINI: 'gemini',
  COPILOT: 'copilot'
} as const

/**
 * Available prompt types across all AI tools
 *
 * Note: Not all prompt types are available for all AI tools.
 * Use getAvailablePromptTypes() helper to filter based on selected tool.
 *
 * - prompt-architect: Recommended option with dual-section output
 * - custom-instructions: Tool-specific custom instructions
 * - projects: ChatGPT/Claude projects feature
 * - gems: Gemini Gems feature
 * - general-prompt: Basic prompt for any use case
 */
export const PROMPT_TYPES = {
  PROMPT_ARCHITECT: 'prompt-architect',
  CUSTOM_INSTRUCTIONS: 'custom-instructions',
  PROJECTS: 'projects',
  GEMS: 'gems',
  GENERAL_PROMPT: 'general-prompt'
} as const

/**
 * Type alias for AI tool values
 * Extracted from AI_TOOLS constant for type safety
 */
export type AiTool = typeof AI_TOOLS[keyof typeof AI_TOOLS]

/**
 * Type alias for prompt type values
 * Extracted from PROMPT_TYPES constant for type safety
 */
export type PromptType = typeof PROMPT_TYPES[keyof typeof PROMPT_TYPES]
