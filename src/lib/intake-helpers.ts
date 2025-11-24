/**
 * Intake Helper Functions
 *
 * This module provides utility functions for the onboarding intake flow,
 * including dynamic UI text generation and prompt type filtering based on
 * selected AI tool.
 *
 * @module intake-helpers
 */

import type { AiTool, PromptType, GuidedQuestions } from '@/types/intake'
import { PROMPT_TYPES } from '@/types/intake'
import { INTAKE_PLACEHOLDERS, INTAKE_LABELS } from '@/lib/constants'
import { TASK_LABELS, TONE_LABELS, OUTPUT_LABELS } from './intake-questions'

/**
 * Returns the appropriate placeholder text for the initial thoughts textarea
 *
 * Provides context-aware examples based on the selected prompt type to help
 * users understand what information to provide.
 *
 * @param promptType - The currently selected prompt type
 * @returns Placeholder text string for the textarea
 *
 * @example
 * const placeholder = getPlaceholderText('prompt-architect')
 * // Returns: "Describe your business, role, or the main areas..."
 *
 * @example
 * const placeholder = getPlaceholderText('custom-instructions')
 * // Returns: "Describe what you want your AI to do..."
 */
export function getPlaceholderText(promptType: PromptType | null): string {
  if (promptType === PROMPT_TYPES.PROMPT_ARCHITECT) {
    return INTAKE_PLACEHOLDERS.PROMPT_ARCHITECT
  }
  return INTAKE_PLACEHOLDERS.DEFAULT
}

/**
 * Returns the appropriate label text for the initial thoughts input field
 *
 * Provides context-aware labeling based on the selected prompt type to guide
 * users on what information they should enter.
 *
 * @param promptType - The currently selected prompt type
 * @returns Label text string for the input field
 *
 * @example
 * const label = getLabelText('prompt-architect')
 * // Returns: "Tell us about your business or role"
 *
 * @example
 * const label = getLabelText('general-prompt')
 * // Returns: "What do you want your AI to help you with?"
 */
export function getLabelText(promptType: PromptType | null): string {
  if (promptType === PROMPT_TYPES.PROMPT_ARCHITECT) {
    return INTAKE_LABELS.PROMPT_ARCHITECT
  }
  return INTAKE_LABELS.DEFAULT
}

/**
 * Returns the available prompt types for a given AI tool
 *
 * Different AI tools support different prompt types:
 * - ChatGPT: All 4 main types (prompt-architect, custom-instructions, projects, general-prompt)
 * - Claude: All 4 main types (prompt-architect, custom-instructions, projects, general-prompt)
 * - Gemini: 3 types (prompt-architect, gems, general-prompt) - no custom-instructions
 * - Copilot: 1 type (general-prompt only)
 *
 * @param aiTool - The selected AI tool
 * @returns Array of available prompt type identifiers
 *
 * @example
 * const types = getAvailablePromptTypes('chatgpt')
 * // Returns: ['prompt-architect', 'custom-instructions', 'projects', 'general-prompt']
 *
 * @example
 * const types = getAvailablePromptTypes('gemini')
 * // Returns: ['prompt-architect', 'gems', 'general-prompt']
 */
export function getAvailablePromptTypes(aiTool: AiTool | null): PromptType[] {
  if (!aiTool) {
    return []
  }

  switch (aiTool) {
    case 'chatgpt':
      return [
        PROMPT_TYPES.PROMPT_ARCHITECT,
        PROMPT_TYPES.CUSTOM_INSTRUCTIONS,
        PROMPT_TYPES.PROJECTS,
        PROMPT_TYPES.GENERAL_PROMPT
      ]
    case 'claude':
      return [
        PROMPT_TYPES.PROMPT_ARCHITECT,
        PROMPT_TYPES.CUSTOM_INSTRUCTIONS,
        PROMPT_TYPES.PROJECTS,
        PROMPT_TYPES.GENERAL_PROMPT
      ]
    case 'gemini':
      return [
        PROMPT_TYPES.PROMPT_ARCHITECT,
        PROMPT_TYPES.GEMS,
        PROMPT_TYPES.GENERAL_PROMPT
      ]
    case 'copilot':
      return [
        PROMPT_TYPES.GENERAL_PROMPT
      ]
    default:
      return [PROMPT_TYPES.GENERAL_PROMPT]
  }
}

/**
 * Returns the human-readable label for a prompt type
 *
 * Labels are context-aware - for example, "Prompt Architect Project" for ChatGPT/Claude
 * vs "Prompt Architect Gem" for Gemini.
 *
 * @param promptType - The prompt type identifier
 * @param aiTool - The selected AI tool (for contextual labels)
 * @returns Human-readable label string
 *
 * @example
 * const label = getPromptTypeLabel('prompt-architect', 'chatgpt')
 * // Returns: "Prompt Architect Project"
 *
 * @example
 * const label = getPromptTypeLabel('prompt-architect', 'gemini')
 * // Returns: "Prompt Architect Gem"
 */
export function getPromptTypeLabel(promptType: PromptType, aiTool: AiTool | null): string {
  // Special handling for Prompt Architect based on tool
  if (promptType === PROMPT_TYPES.PROMPT_ARCHITECT) {
    if (aiTool === 'gemini') {
      return 'Prompt Architect Gem'
    }
    return 'Prompt Architect Project'
  }

  // Standard labels for other types
  const labels: Record<PromptType, string> = {
    'prompt-architect': 'Prompt Architect Project',
    'custom-instructions': 'Custom Instructions',
    'projects': 'Projects',
    'gems': 'Gems',
    'general-prompt': 'General Prompt'
  }

  return labels[promptType] || promptType
}

/**
 * Returns description text for a prompt type
 *
 * Provides helpful context about what each prompt type does to help users
 * make informed selections.
 *
 * @param promptType - The prompt type identifier
 * @param aiTool - The selected AI tool (for contextual descriptions)
 * @returns Description string for the prompt type
 */
export function getPromptTypeDescription(promptType: PromptType, aiTool: AiTool | null): string {
  const descriptions: Record<string, Record<PromptType, string>> = {
    default: {
      'prompt-architect': 'Create a comprehensive AI assistant tailored to your specific needs using our P/T/C/F framework',
      'custom-instructions': 'Set up global instructions that apply to all your conversations',
      'projects': 'Create a focused workspace with custom context and uploaded files',
      'gems': 'Build a custom AI persona with specialized expertise',
      'general-prompt': 'Get help crafting effective one-time prompts'
    },
    gemini: {
      'prompt-architect': 'Create a comprehensive AI Gem tailored to your specific needs using our P/T/C/F framework',
      'custom-instructions': 'Not available for Gemini',
      'projects': 'Not available for Gemini',
      'gems': 'Build a custom AI persona with specialized expertise for repeated use',
      'general-prompt': 'Get help crafting effective prompts that leverage Gemini\'s capabilities'
    },
    copilot: {
      'prompt-architect': 'Not available for Copilot',
      'custom-instructions': 'Not available for Copilot',
      'projects': 'Not available for Copilot',
      'gems': 'Not available for Copilot',
      'general-prompt': 'Get help crafting effective prompts for Microsoft Copilot'
    }
  }

  const toolDescriptions = aiTool && descriptions[aiTool]
    ? descriptions[aiTool]
    : descriptions.default

  return toolDescriptions[promptType] || descriptions.default[promptType]
}

/**
 * Checks if a prompt type is the recommended option
 *
 * Currently, Prompt Architect is always the recommended option
 * for all AI tools that support it.
 *
 * @param promptType - The prompt type to check
 * @returns True if this is the recommended option
 */
export function isRecommendedType(promptType: PromptType): boolean {
  return promptType === PROMPT_TYPES.PROMPT_ARCHITECT
}

/**
 * Returns the display name for an AI tool
 *
 * @param aiTool - The AI tool identifier
 * @returns Human-readable tool name
 *
 * @example
 * getAiToolDisplayName('chatgpt') // Returns: "ChatGPT"
 * getAiToolDisplayName('copilot') // Returns: "Microsoft Copilot"
 */
export function getAiToolDisplayName(aiTool: AiTool): string {
  const names: Record<AiTool, string> = {
    chatgpt: 'ChatGPT',
    claude: 'Claude',
    gemini: 'Google Gemini',
    copilot: 'Microsoft Copilot'
  }
  return names[aiTool] || aiTool
}

/**
 * Returns the description for an AI tool
 *
 * @param aiTool - The AI tool identifier
 * @returns Description string for the tool
 */
export function getAiToolDescription(aiTool: AiTool): string {
  const descriptions: Record<AiTool, string> = {
    chatgpt: 'OpenAI\'s conversational AI with Projects and Custom Instructions',
    claude: 'Anthropic\'s AI assistant with Projects and strong reasoning',
    gemini: 'Google\'s AI with Gems, Workspace integration, and multimodal capabilities',
    copilot: 'Microsoft\'s AI assistant with web search and Office integration'
  }
  return descriptions[aiTool] || ''
}

/**
 * Returns the URL for an AI tool
 *
 * @param aiTool - The AI tool identifier
 * @returns URL string for the tool
 *
 * @example
 * getAiToolUrl('chatgpt') // Returns: "https://chat.openai.com"
 */
export function getAiToolUrl(aiTool: AiTool): string {
  const urls: Record<AiTool, string> = {
    chatgpt: 'https://chat.openai.com',
    claude: 'https://claude.ai',
    gemini: 'https://gemini.google.com',
    copilot: 'https://copilot.microsoft.com'
  }
  return urls[aiTool] || ''
}

/**
 * Returns the "Next Steps" instructions for using the generated prompt
 *
 * Provides tool-specific guidance on how to use the generated output,
 * including where to navigate and what to do.
 *
 * @param aiTool - The selected AI tool
 * @param promptType - The type of prompt generated
 * @returns Array of step strings
 *
 * @example
 * getNextSteps('chatgpt', 'custom-instructions')
 * // Returns: ['Copy the prompt above', 'Open ChatGPT Settings → Personalization', ...]
 */
export function getNextSteps(aiTool: AiTool | null, promptType: PromptType | null): string[] {
  if (!aiTool) {
    return [
      'Copy the prompt above',
      'Paste it into your AI tool',
      'Start creating!'
    ]
  }

  const toolName = getAiToolDisplayName(aiTool)

  // Tool-specific instructions based on prompt type
  if (promptType === 'custom-instructions') {
    switch (aiTool) {
      case 'chatgpt':
        return [
          'Copy the prompt above',
          'Open ChatGPT → Settings → Personalization → Custom Instructions',
          'Paste into the "How would you like ChatGPT to respond?" field',
          'Save and start a new conversation'
        ]
      case 'claude':
        return [
          'Copy the prompt above',
          'Open Claude → Your Profile → Custom Style',
          'Paste and enable "Use custom style"',
          'Start a new conversation'
        ]
      default:
        return [
          'Copy the prompt above',
          `Open ${toolName} settings`,
          'Paste into the custom instructions area',
          'Start a new conversation'
        ]
    }
  }

  if (promptType === 'projects' || promptType === 'prompt-architect') {
    switch (aiTool) {
      case 'chatgpt':
        return [
          'Copy the prompt above',
          'Open ChatGPT → Projects → Create New Project',
          'Paste into the project instructions',
          'Add any relevant files and start chatting'
        ]
      case 'claude':
        return [
          'Copy the prompt above',
          'Open Claude → Projects → Create Project',
          'Paste into the project custom instructions',
          'Add context files and begin your conversation'
        ]
      default:
        return [
          'Copy the prompt above',
          `Create a new project in ${toolName}`,
          'Paste into the project instructions',
          'Start working!'
        ]
    }
  }

  if (promptType === 'gems') {
    return [
      'Copy the prompt above',
      'Open Gemini → Gem Manager → Create New Gem',
      'Paste into the Gem instructions',
      'Save and start using your custom Gem'
    ]
  }

  // Default for general prompts
  return [
    'Copy the prompt above',
    `Open ${toolName}`,
    'Paste into a new conversation',
    'Hit enter and see the magic!'
  ]
}

/**
 * Validates that a character count is within acceptable range
 *
 * @param count - The current character count
 * @param min - Minimum allowed characters (default: 20)
 * @param max - Maximum allowed characters (default: 500)
 * @returns Object with valid boolean and optional error message
 */
export function validateCharacterCount(
  count: number,
  min: number = 20,
  max: number = 500
): { valid: boolean; error?: string } {
  if (count < min) {
    return {
      valid: false,
      error: `Please enter at least ${min} characters (${count}/${min})`
    }
  }
  if (count > max) {
    return {
      valid: false,
      error: `Please keep your response under ${max} characters (${count}/${max})`
    }
  }
  return { valid: true }
}

/**
 * Builds a natural language context string from guided questions
 *
 * Converts the structured GuidedQuestions data into a formatted string
 * that can be used as context for the AI API.
 *
 * @param questions - The guided questions responses
 * @returns Formatted context string for AI consumption
 *
 * @example
 * const context = buildUserContext({
 *   role: 'Digital marketing manager at SaaS company',
 *   goal: 'Create better ad copy',
 *   tasks: ['writing', 'analysis'],
 *   tone: 'professional',
 *   outputDetail: 'balanced'
 * })
 * // Returns:
 * // ROLE/CONTEXT: Digital marketing manager at SaaS company
 * //
 * // PRIMARY GOAL: Create better ad copy
 * //
 * // SPECIFIC TASKS: Writing & Content Creation, Analysis & Problem Solving
 * //
 * // PREFERRED TONE: Professional
 * //
 * // RESPONSE DETAIL LEVEL: Balanced
 */
export function buildUserContext(questions: GuidedQuestions): string {
  const parts: string[] = []

  // Role
  if (questions.role) {
    parts.push(`ROLE/CONTEXT: ${questions.role}`)
  }

  // Goal
  if (questions.goal) {
    parts.push(`PRIMARY GOAL: ${questions.goal}`)
  }

  // Tasks
  if (questions.tasks && questions.tasks.length > 0) {
    const taskLabels = questions.tasks.map(t => TASK_LABELS[t]).join(', ')
    parts.push(`SPECIFIC TASKS: ${taskLabels}`)
    if (questions.tasksOther) {
      parts.push(`OTHER TASKS: ${questions.tasksOther}`)
    }
  }

  // Tone
  if (questions.tone) {
    parts.push(`PREFERRED TONE: ${TONE_LABELS[questions.tone]}`)
  }

  // Constraints
  if (questions.constraints) {
    parts.push(`CONSTRAINTS/AVOID: ${questions.constraints}`)
  }

  // Output detail
  if (questions.outputDetail) {
    parts.push(`RESPONSE DETAIL LEVEL: ${OUTPUT_LABELS[questions.outputDetail]}`)
  }

  return parts.join('\n\n')
}
