/**
 * Output Formatter for Onboarding Intake Flow
 *
 * This module handles formatting the AI response into the final output structure.
 * For Prompt Architect type, it combines Section 1 (setup template) with Section 2 (AI-generated text).
 * For other types, it returns the AI response as-is.
 *
 * @module output-formatter
 */

import type { AiTool, PromptType, FormattedOutput } from '@/types/intake'
import { logger } from '@/lib/logger'
import { getSetupTemplate, substituteTemplateVariables } from '@/lib/setup-templates'

/**
 * Extracts potential role and business information from user thoughts
 *
 * Uses simple pattern matching to identify role/business mentions.
 * Returns generic fallbacks if patterns aren't found.
 *
 * @param userThoughts - The user's initial thoughts input
 * @returns Object with extracted or fallback role and business values
 *
 * @example
 * extractUserContext("I run a small bakery and need help with marketing")
 * // Returns: { role: "business owner", business: "small bakery" }
 */
function extractUserContext(userThoughts: string): { role: string; business: string } {
  const text = userThoughts.toLowerCase()

  // Common role patterns
  const rolePatterns = [
    /i(?:'m| am) (?:a |an )?(.+?(?:manager|developer|marketer|analyst|consultant|entrepreneur|owner|director|coordinator|specialist|engineer|designer|writer|editor|assistant))/i,
    /(?:work(?:ing)? as|my (?:job|role|position) (?:is|as)) (?:a |an )?(.+?)(?:\.|,|$)/i,
    /i (?:run|manage|lead|head) (?:a |an )?(.+?)(?:\.|,|$)/i
  ]

  // Common business patterns
  const businessPatterns = [
    /(?:run|manage|own|have) (?:a |an )?(.+?(?:business|company|agency|studio|shop|store|firm|practice|clinic|restaurant|bakery|salon))/i,
    /(?:my |our )(.+?(?:business|company|agency|studio|shop|store|firm|practice|clinic|restaurant|bakery|salon))/i,
    /(?:work(?:ing)? (?:at|for|in)|i'm at) (?:a |an )?(.+?)(?:\.|,|$)/i
  ]

  let role = 'professional'  // Default fallback
  let business = 'your organization' // Default fallback

  // Try to extract role
  for (const pattern of rolePatterns) {
    const match = text.match(pattern)
    if (match?.[1]) {
      role = match[1].trim()
      break
    }
  }

  // Try to extract business
  for (const pattern of businessPatterns) {
    const match = text.match(pattern)
    if (match?.[1]) {
      business = match[1].trim()
      break
    }
  }

  // If we found "run" or "manage" in role, they probably mentioned their business
  if (role.includes('run') || role.includes('manage')) {
    const businessMatch = userThoughts.match(/(?:run|manage) (?:a |an )?(.+?)(?:\.|,| and|$)/i)
    if (businessMatch?.[1]) {
      business = businessMatch[1].trim()
      role = 'business owner'
    }
  }

  return { role, business }
}

/**
 * Formats the AI response into the final output structure
 *
 * For Prompt Architect type:
 * - Section 1: Setup instructions from template (with variable substitution)
 * - Section 2: AI-generated ready-to-use text
 *
 * For other types:
 * - Section 2 only: AI-generated response
 *
 * @param aiResponse - The raw response from Together.ai API
 * @param promptType - The selected prompt type
 * @param aiTool - The selected AI tool
 * @param userThoughts - The user's initial thoughts (for variable substitution)
 * @returns Formatted output with appropriate sections
 *
 * @example
 * const output = await formatOutput(
 *   "Here is your custom prompt...",
 *   "prompt-architect",
 *   "chatgpt",
 *   "I run a small bakery"
 * )
 * // Returns: { section1: "# How to Set Up...", section2: "Here is your...", promptType: "prompt-architect" }
 */
export async function formatOutput(
  aiResponse: string,
  promptType: PromptType,
  aiTool: AiTool,
  userThoughts: string
): Promise<FormattedOutput> {
  // Clean up the AI response
  const cleanedResponse = aiResponse.trim()

  // For Prompt Architect, include both sections
  if (promptType === 'prompt-architect') {
    // Get setup template for this AI tool
    const template = getSetupTemplate(aiTool)

    if (template) {
      // Extract context from user thoughts and substitute variables
      const { role, business } = extractUserContext(userThoughts)
      const section1 = substituteTemplateVariables(template, role, business)

      return {
        section1,
        section2: cleanedResponse,
        promptType
      }
    } else {
      // No template available for this tool
      logger.warn(`No setup template available for ${aiTool}`)
      return {
        section2: cleanedResponse,
        promptType
      }
    }
  }

  // For all other types, return AI response as Section 2 only
  return {
    section2: cleanedResponse,
    promptType
  }
}

/**
 * Validates that the formatted output meets minimum quality standards
 *
 * @param output - The formatted output to validate
 * @returns True if output is valid, false otherwise
 */
export function validateOutput(output: FormattedOutput): boolean {
  // Section 2 is always required and must have content
  if (!output.section2 || output.section2.trim().length < 50) {
    logger.warn('Output validation failed: Section 2 is too short or empty')
    return false
  }

  // For Prompt Architect, Section 1 should be present
  if (output.promptType === 'prompt-architect' && !output.section1) {
    logger.warn('Output validation warning: Prompt Architect missing Section 1')
    // Don't fail validation, just log warning (template might not be available)
  }

  return true
}
