/**
 * Intake Question Configurations
 *
 * This module defines all question configurations, options, and metadata
 * for the guided questions intake flow.
 *
 * @module intake-questions
 */

import type { QuestionConfig, PromptType, TaskOption, ToneOption, OutputDetail } from '@/types/intake'

// =============================================================================
// Task Options & Labels
// =============================================================================

export const TASK_OPTIONS: readonly TaskOption[] = [
  'writing',
  'research',
  'analysis',
  'brainstorming',
  'code',
  'strategy',
  'other'
] as const

export const TASK_LABELS: Record<TaskOption, string> = {
  writing: 'Writing & Content Creation',
  research: 'Research & Information Gathering',
  analysis: 'Analysis & Problem Solving',
  brainstorming: 'Brainstorming & Ideation',
  code: 'Coding & Technical Tasks',
  strategy: 'Strategy & Planning',
  other: 'Other'
}

// =============================================================================
// Tone Options & Labels
// =============================================================================

export const TONE_OPTIONS: readonly ToneOption[] = [
  'professional',
  'casual',
  'conversational',
  'technical',
  'creative'
] as const

export const TONE_LABELS: Record<ToneOption, string> = {
  professional: 'Professional',
  casual: 'Casual',
  conversational: 'Conversational',
  technical: 'Technical',
  creative: 'Creative'
}

export const TONE_DESCRIPTIONS: Record<ToneOption, string> = {
  professional: 'Formal, business-appropriate language',
  casual: 'Relaxed, friendly tone',
  conversational: 'Natural, dialogue-like responses',
  technical: 'Precise, detailed, industry-specific',
  creative: 'Imaginative, expressive language'
}

// =============================================================================
// Output Detail Options & Labels
// =============================================================================

export const OUTPUT_OPTIONS: readonly OutputDetail[] = [
  'concise',
  'balanced',
  'comprehensive'
] as const

export const OUTPUT_LABELS: Record<OutputDetail, string> = {
  concise: 'Concise',
  balanced: 'Balanced',
  comprehensive: 'Comprehensive'
}

export const OUTPUT_DESCRIPTIONS: Record<OutputDetail, string> = {
  concise: 'Brief, to-the-point answers',
  balanced: 'Moderate detail, well-rounded',
  comprehensive: 'In-depth, thorough explanations'
}

// =============================================================================
// Question Configurations
// =============================================================================

export const QUESTION_CONFIGS: Record<string, QuestionConfig> = {
  role: {
    id: 'role',
    step: 3,
    title: "What's your role or business focus?",
    description: 'Help us understand your context',
    required: true,
    minChars: 50,
    maxChars: 200,
    inputType: 'textarea',
    placeholder: 'e.g., "I\'m a digital marketing manager at a SaaS company focused on B2B lead generation"'
  },
  goal: {
    id: 'goal',
    step: 4,
    title: "What's your main goal for using AI?",
    description: 'What do you want to accomplish?',
    required: true,
    minChars: 50,
    maxChars: 200,
    inputType: 'textarea',
    placeholder: 'e.g., "Create marketing content faster and optimize ad copy for better conversion rates"'
  },
  tasks: {
    id: 'tasks',
    step: 5,
    title: 'What specific tasks will you use this for?',
    description: 'Select all that apply',
    required: true,
    inputType: 'multiselect',
    options: TASK_OPTIONS
  },
  tone: {
    id: 'tone',
    step: 6,
    title: 'What tone/style should the AI use?',
    description: 'Choose the communication style that fits your needs',
    required: true,
    inputType: 'radio',
    options: TONE_OPTIONS
  },
  constraints: {
    id: 'constraints',
    step: 7,
    title: 'Any constraints or things the AI should avoid?',
    description: 'Optional - leave blank if none',
    required: false,
    minChars: 0,
    maxChars: 150,
    inputType: 'textarea',
    placeholder: 'e.g., "Avoid jargon, keep responses under 3 paragraphs, focus on B2B audience"'
  },
  outputDetail: {
    id: 'outputDetail',
    step: 8,
    title: 'How detailed should responses be?',
    description: 'Choose your preferred level of detail',
    required: true,
    inputType: 'radio',
    options: OUTPUT_OPTIONS
  }
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Returns the question configurations for a given prompt type
 *
 * Different prompt types require different sets of questions:
 * - Prompt Architect/Projects/Gems: All 6 questions
 * - Custom Instructions: 5 questions (skip tasks)
 * - General Prompt: 3 questions (streamlined)
 *
 * @param promptType - The selected prompt type
 * @returns Array of question configurations
 *
 * @example
 * const questions = getQuestionsForPromptType('prompt-architect')
 * // Returns: [role, goal, tasks, tone, constraints, outputDetail]
 */
export function getQuestionsForPromptType(promptType: PromptType): QuestionConfig[] {
  switch (promptType) {
    case 'prompt-architect':
    case 'projects':
    case 'gems':
      // All 6 questions
      return [
        QUESTION_CONFIGS.role,
        QUESTION_CONFIGS.goal,
        QUESTION_CONFIGS.tasks,
        QUESTION_CONFIGS.tone,
        QUESTION_CONFIGS.constraints,
        QUESTION_CONFIGS.outputDetail
      ]

    case 'custom-instructions':
      // Skip tasks (5 questions)
      return [
        QUESTION_CONFIGS.role,
        QUESTION_CONFIGS.goal,
        QUESTION_CONFIGS.tone,
        QUESTION_CONFIGS.constraints,
        QUESTION_CONFIGS.outputDetail
      ]

    case 'general-prompt':
      // Only first 3 questions (streamlined)
      return [
        QUESTION_CONFIGS.role,
        QUESTION_CONFIGS.goal,
        QUESTION_CONFIGS.tasks
      ]

    default:
      return []
  }
}

/**
 * Returns total number of steps including AI tool, prompt type, questions, and review
 *
 * Steps breakdown:
 * - Step 1: AI Tool selection
 * - Step 2: Prompt Type selection
 * - Steps 3-N: Questions (varies by prompt type)
 * - Final step: Review screen
 *
 * @param promptType - The selected prompt type (null before selection)
 * @returns Total number of steps in the flow
 *
 * @example
 * getTotalSteps('prompt-architect') // Returns: 10 (2 + 6 questions + 1 review)
 * getTotalSteps('general-prompt')   // Returns: 6 (2 + 3 questions + 1 review)
 * getTotalSteps(null)              // Returns: 2 (just tool + type)
 */
export function getTotalSteps(promptType: PromptType | null): number {
  if (!promptType) return 2 // Just AI tool + prompt type

  const questionCount = getQuestionsForPromptType(promptType).length
  return 2 + questionCount + 1 // 2 (tool + type) + questions + 1 (review)
}

/**
 * Returns the current question configuration based on step number
 *
 * @param step - Current step number (1-based)
 * @param promptType - Selected prompt type
 * @returns Question config or null if step is not a question step
 *
 * @example
 * getQuestionForStep(3, 'prompt-architect') // Returns: QUESTION_CONFIGS.role
 * getQuestionForStep(1, 'prompt-architect') // Returns: null (AI tool selection)
 */
export function getQuestionForStep(step: number, promptType: PromptType | null): QuestionConfig | null {
  if (!promptType || step < 3) return null

  const questions = getQuestionsForPromptType(promptType)
  const questionIndex = step - 3 // Steps 1-2 are tool/type selection

  return questions[questionIndex] || null
}
