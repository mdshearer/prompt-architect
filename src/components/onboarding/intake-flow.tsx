'use client'

/**
 * Intake Flow Container Component
 *
 * Main container component that orchestrates the 3-step intake flow.
 * Conditionally renders the appropriate step component based on current state.
 *
 * Flow:
 * 1. AI Tool Selection (AiToolSelector)
 * 2. Prompt Type Selection (PromptTypeSelector)
 * 3. Initial Thoughts Input (InitialThoughtsInput)
 * -> Output Display (OutputDisplay) after completion
 *
 * @module intake-flow
 */

import { useIntake } from './intake-context'
import IntakeProgressIndicator from './intake-progress-indicator'
import AiToolSelector from './ai-tool-selector'
import PromptTypeSelector from './prompt-type-selector'
import InitialThoughtsInput from './initial-thoughts-input'
import OutputDisplay from './output-display'

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
  const { step, intakeCompleted, output } = useIntake()

  // If intake is completed and we have output, show the output display
  if (intakeCompleted && output) {
    return (
      <div className="w-full py-8 px-4">
        <OutputDisplay />
      </div>
    )
  }

  // Render the current step
  return (
    <div className="w-full py-8 px-4">
      {/* Progress indicator */}
      <IntakeProgressIndicator />

      {/* Step content */}
      <div className="mt-8">
        {step === 1 && <AiToolSelector />}
        {step === 2 && <PromptTypeSelector />}
        {step === 3 && <InitialThoughtsInput />}
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
