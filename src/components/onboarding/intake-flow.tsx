'use client'

/**
 * Intake Flow Container Component
 *
 * Main container component that orchestrates the multi-step intake flow.
 * Conditionally renders the appropriate step component based on current state.
 *
 * Flow:
 * 1. AI Tool Selection (AiToolSelector)
 * 2. Prompt Type Selection (PromptTypeSelector)
 * 3-8. Guided Questions (QuestionRole, QuestionGoal, etc.)
 * 9. Review Screen (IntakeReview)
 * -> Output Display (OutputDisplay) after completion
 *
 * @module intake-flow
 */

import { useIntake } from './intake-context'
import IntakeProgressIndicator from './intake-progress-indicator'
import AiToolSelector from './ai-tool-selector'
import PromptTypeSelector from './prompt-type-selector'
import QuestionRole from './questions/question-role'
import QuestionGoal from './questions/question-goal'
import QuestionTasks from './questions/question-tasks'
import QuestionTone from './questions/question-tone'
import QuestionConstraints from './questions/question-constraints'
import QuestionOutput from './questions/question-output'
import IntakeReview from './intake-review'
import OutputDisplay from './output-display'
import { getQuestionForStep, getReviewStep } from '@/lib/intake-questions'

/**
 * Main intake flow container
 *
 * Renders the appropriate step component based on current intake state.
 * Shows the output display once intake is completed.
 *
 * @example
 * <IntakeProvider>
 *   <IntakeFlow />
 * </IntakeProvider>
 */
export default function IntakeFlow() {
  const { step, promptType, intakeCompleted, output } = useIntake()

  // If intake is completed and we have output, show the output display
  if (intakeCompleted && output) {
    return (
      <div className="w-full py-8 px-4">
        <OutputDisplay />
      </div>
    )
  }

  // Get current question config (if step is a question step)
  const currentQuestion = getQuestionForStep(step, promptType)
  const reviewStep = getReviewStep(promptType)

  // Render the current step
  return (
    <div className="w-full py-8 px-4">
      {/* Progress indicator */}
      <IntakeProgressIndicator />

      {/* Step content */}
      <div className="mt-8">
        {/* Steps 1-2: AI tool and prompt type selection */}
        {step === 1 && <AiToolSelector />}
        {step === 2 && <PromptTypeSelector />}

        {/* Steps 3+: Dynamic questions based on prompt type */}
        {currentQuestion && currentQuestion.id === 'role' && <QuestionRole />}
        {currentQuestion && currentQuestion.id === 'goal' && <QuestionGoal />}
        {currentQuestion && currentQuestion.id === 'tasks' && <QuestionTasks />}
        {currentQuestion && currentQuestion.id === 'tone' && <QuestionTone />}
        {currentQuestion && currentQuestion.id === 'constraints' && <QuestionConstraints />}
        {currentQuestion && currentQuestion.id === 'outputDetail' && <QuestionOutput />}

        {/* Review step (dynamic based on prompt type) */}
        {step === reviewStep && <IntakeReview />}
      </div>
    </div>
  )
}

/**
 * Standalone intake flow with built-in provider
 *
 * Use this when you need the complete intake flow without
 * needing to wrap it in a provider yourself.
 *
 * @example
 * <IntakeFlowWithProvider />
 */
export function IntakeFlowWithProvider() {
  // Import provider dynamically to avoid circular dependency
  const { IntakeProvider } = require('./intake-context')

  return (
    <IntakeProvider>
      <IntakeFlow />
    </IntakeProvider>
  )
}
