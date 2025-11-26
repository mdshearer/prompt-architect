'use client'

/**
 * Progress Indicator for Intake Flow
 *
 * Displays the current progress as a percentage instead of steps,
 * since different prompt types have different numbers of steps.
 *
 * @module intake-progress-indicator
 */

import { useIntake } from './intake-context'
import { getTotalSteps } from '@/lib/intake-questions'

/**
 * Progress indicator showing completion percentage in the intake flow
 *
 * Displays:
 * - Percentage complete (0-100%)
 * - Avoids showing step counts which vary by prompt type
 *
 * @example
 * <IntakeProgressIndicator />
 */
export default function IntakeProgressIndicator() {
  const { step, promptType } = useIntake()

  // Calculate total steps dynamically based on prompt type
  // If we're on step 2 (prompt type selection) but don't have a type yet,
  // assume the most common case (prompt-architect = 9 steps) to avoid the jarring jump
  const totalSteps = getTotalSteps(promptType) || (step === 2 ? 9 : 2)

  // Calculate percentage complete
  const percentComplete = Math.round((step / totalSteps) * 100)

  return (
    <div className="w-full max-w-2xl mx-auto mb-6">
      <div className="text-right">
        <span className="text-sm text-gray-500 font-medium">
          {percentComplete}% complete
        </span>
      </div>
    </div>
  )
}
