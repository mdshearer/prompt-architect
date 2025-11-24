/**
 * Intake Instructions Loader
 *
 * This module handles loading AI-specific instructions from the JSON configuration
 * and building complete system prompts for the Together.ai API calls.
 *
 * Instructions are loaded from data/ai-instructions/instructions.json and cached
 * at module level for performance.
 *
 * @module intake-instructions
 */

import type { AiTool, PromptType } from '@/types/intake'
import { logger } from '@/lib/logger'

/**
 * Structure of an instruction set for a specific AI tool + prompt type combination
 */
export interface InstructionSet {
  systemPrompt: string
  guidelines: string
  capabilities: string[]
  limitations: string[]
}

/**
 * Metadata stored in the instructions JSON
 */
interface InstructionsMetadata {
  version: string
  lastUpdated: string
  description: string
  totalInstructionSets: number
}

/**
 * Type for the complete instructions JSON structure
 */
interface InstructionsData {
  chatgpt?: { [promptType: string]: InstructionSet }
  claude?: { [promptType: string]: InstructionSet }
  gemini?: { [promptType: string]: InstructionSet }
  copilot?: { [promptType: string]: InstructionSet }
  _metadata?: InstructionsMetadata
}

// Module-level cache for loaded instructions
let cachedInstructions: InstructionsData | null = null

/**
 * Loads and caches the instructions JSON file
 *
 * @returns The parsed instructions data
 * @throws Error if instructions file cannot be loaded or parsed
 */
async function loadInstructionsFile(): Promise<InstructionsData> {
  if (cachedInstructions) {
    return cachedInstructions
  }

  try {
    // Dynamic import for the JSON file
    const instructionsModule = await import('@/../data/ai-instructions/instructions.json')
    cachedInstructions = instructionsModule.default as InstructionsData
    logger.info('Instructions loaded successfully')
    return cachedInstructions
  } catch (error) {
    logger.error('Failed to load instructions file', error)
    throw new Error('Failed to load AI instructions configuration')
  }
}

/**
 * Loads the instruction set for a specific AI tool and prompt type combination
 *
 * @param aiTool - The selected AI tool (chatgpt, claude, gemini, copilot)
 * @param promptType - The selected prompt type (prompt-architect, custom-instructions, etc.)
 * @returns The instruction set for the given combination
 * @throws Error if the combination doesn't exist or file cannot be loaded
 *
 * @example
 * const instructions = await loadInstructions('chatgpt', 'prompt-architect')
 * console.log(instructions.systemPrompt)
 */
export async function loadInstructions(
  aiTool: AiTool,
  promptType: PromptType
): Promise<InstructionSet> {
  const instructions = await loadInstructionsFile()

  // Access tool instructions using type-safe accessor
  const toolInstructions = instructions[aiTool as keyof Omit<InstructionsData, '_metadata'>]
  if (!toolInstructions) {
    throw new Error(`No instructions found for AI tool: ${aiTool}`)
  }

  // Check if the prompt type exists for this tool
  const typeInstructions = toolInstructions[promptType]
  if (!typeInstructions) {
    throw new Error(`No instructions found for ${aiTool} + ${promptType} combination`)
  }

  // Validate the structure has required fields
  if (!typeInstructions.systemPrompt || !typeInstructions.guidelines) {
    throw new Error(`Invalid instruction structure for ${aiTool} + ${promptType}`)
  }

  return typeInstructions
}

/**
 * Builds a complete system prompt for the Together.ai API call
 *
 * Combines the base system prompt with guidelines, capabilities/limitations context,
 * and user-specific thoughts to create a comprehensive prompt that will generate
 * high-quality output.
 *
 * @param instructions - The loaded instruction set
 * @param userThoughts - The user's initial thoughts/description (20-500 chars)
 * @param aiTool - The selected AI tool (for context in output)
 * @param promptType - The selected prompt type (for output formatting)
 * @returns The complete system prompt string ready for API call
 *
 * @example
 * const systemPrompt = buildSystemPrompt(
 *   instructions,
 *   "I run a small bakery and need help with marketing",
 *   "chatgpt",
 *   "prompt-architect"
 * )
 */
export function buildSystemPrompt(
  instructions: InstructionSet,
  userThoughts: string,
  aiTool: AiTool,
  promptType: PromptType
): string {
  const { systemPrompt, guidelines, capabilities, limitations } = instructions

  // Build capabilities section if present
  const capabilitiesSection = capabilities.length > 0
    ? `\n\nKey capabilities of ${getToolDisplayName(aiTool)} to leverage:\n${capabilities.map(c => `- ${c}`).join('\n')}`
    : ''

  // Build limitations section if present
  const limitationsSection = limitations.length > 0
    ? `\n\nLimitations to be aware of:\n${limitations.map(l => `- ${l}`).join('\n')}`
    : ''

  // Add P/T/C/F framework guidance for Prompt Architect
  const frameworkGuidance = promptType === 'prompt-architect'
    ? `

OUTPUT STRUCTURE - Use the P/T/C/F Framework:
1. **Persona**: Define who the AI should be (role, expertise, personality traits)
2. **Task**: Specify what the AI should help with (primary responsibilities)
3. **Context**: Provide relevant background (user's situation, preferences, constraints)
4. **Format**: Define how responses should be structured (tone, length, style)

After the P/T/C/F sections, include 3-5 "Golden Rules" - non-negotiable behaviors that define how this AI assistant should always or never act.`
    : ''

  // Construct the complete system prompt
  const fullPrompt = `${systemPrompt}

${guidelines}${capabilitiesSection}${limitationsSection}${frameworkGuidance}

USER CONTEXT:
The user has provided the following information about their needs:
"${userThoughts}"

Based on this context, generate a comprehensive, ready-to-use ${getOutputTypeDescription(promptType)} for ${getToolDisplayName(aiTool)}. Make it specific to the user's stated needs and immediately usable.

IMPORTANT:
- Write in a clear, accessible style for non-technical users
- Be specific and actionable, not generic
- Include concrete examples where helpful
- Focus on practical utility over theoretical completeness`

  return fullPrompt
}

/**
 * Returns a human-readable display name for an AI tool
 *
 * @param aiTool - The AI tool identifier
 * @returns Human-readable tool name
 */
function getToolDisplayName(aiTool: AiTool): string {
  const displayNames: Record<AiTool, string> = {
    chatgpt: 'ChatGPT',
    claude: 'Claude',
    gemini: 'Google Gemini',
    copilot: 'Microsoft Copilot'
  }
  return displayNames[aiTool] || aiTool
}

/**
 * Returns a description of what output type to generate based on prompt type
 *
 * @param promptType - The prompt type identifier
 * @returns Description of the output type
 */
function getOutputTypeDescription(promptType: PromptType): string {
  const descriptions: Record<PromptType, string> = {
    'prompt-architect': 'Prompt Architect custom instruction set',
    'custom-instructions': 'custom instructions configuration',
    'projects': 'project setup with custom instructions',
    'gems': 'Gem configuration with custom persona',
    'general-prompt': 'optimized prompt'
  }
  return descriptions[promptType] || 'prompt'
}

/**
 * Validates that an instruction set exists for a given tool + type combination
 * without loading the full instructions (for quick validation)
 *
 * @param aiTool - The AI tool to check
 * @param promptType - The prompt type to check
 * @returns True if the combination is valid
 */
export async function isValidCombination(
  aiTool: AiTool,
  promptType: PromptType
): Promise<boolean> {
  try {
    await loadInstructions(aiTool, promptType)
    return true
  } catch {
    return false
  }
}
