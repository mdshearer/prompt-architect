/**
 * Centralized type definitions for chat functionality
 *
 * This file contains all shared TypeScript interfaces used throughout
 * the chat system to ensure consistency and reduce duplication.
 *
 * @module chat
 */

/**
 * UI elements that can be attached to assistant messages
 * for interactive content display
 */
export interface IUIElements {
  show_examples?: boolean
  platform_selector?: string[]
  next_action?: 'optimi_builder' | 'custom_instructions_builder' | 'project_builder'
  educational_content?: {
    concept: string
    level: 'beginner' | 'intermediate' | 'advanced'
  }
}

/**
 * Represents a single message in a chat conversation
 */
export interface IMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  status?: 'sending' | 'sent' | 'error'
  ui_elements?: IUIElements
}

/**
 * Valid prompt categories for chat conversations
 */
export type PromptCategory = 'custom_instructions' | 'projects_gems' | 'threads'

/**
 * Request body for the standard chat API endpoint
 * POST /api/chat
 */
export interface IChatRequest {
  message: string
  category: PromptCategory
  history: IMessage[]
}

/**
 * Request body for the enhanced chat API endpoint
 * POST /api/chat/enhanced
 */
export interface IEnhancedChatRequest extends IChatRequest {
  usage_count: number
}

/**
 * Response from chat API endpoints
 */
export interface IChatResponse {
  success: boolean
  response?: string
  message?: string
  error?: string
  errorCode?: string
  ui_elements?: IUIElements
  conversation_stage?: 'discovery' | 'building'
  rateLimitInfo?: {
    currentCount: number
    limit: number
    resetsAt: number
  }
}
