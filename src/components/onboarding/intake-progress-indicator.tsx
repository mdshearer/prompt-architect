'use client'

/**
 * Progress Indicator for Intake Flow
 *
 * Displays the current step in the multi-step intake process with a
 * progress bar and step counter.
 *
 * @module intake-progress-indicator
 */

import { useIntake } from './intake-context'
import { getTotalSteps } from '@/lib/intake-questions'

/**
 * Progress indicator showing current position in the intake flow
 *
 * Displays:
 * - Progress bar showing percentage complete
 * - Step counter (Step X of Y)
 *
 * Total steps varies by prompt type (9 for full flow, 6 for general prompt)
 *
 * @example
 * <IntakeProgressIndicator />
 */
export default function IntakeProgressIndicator() {
  const { step, promptType } = useIntake()

  return (
    <div className="w-full mb-8">
      {/* Step counter text */}
      <div className="text-center mb-4">
        <span className="text-sm text-gray-500">
          Step {step} of 3
        </span>
      </div>

      {/* Visual step indicator */}
      <div className="flex items-center justify-center">
        {[1, 2, 3].map((stepNum, index) => (
          <div key={stepNum} className="flex items-center">
            {/* Step circle */}
            <div
              className={`
                flex items-center justify-center w-12 h-12 rounded-full
                text-lg font-bold transition-all duration-200 shadow-md
                ${stepNum < step
                  ? 'bg-[#00C896] text-white'
                  : stepNum === step
                    ? 'bg-[#FFDC00] text-[#283791] scale-110'
                    : 'bg-gray-300 text-gray-600'
                }
              `}
            >
              {stepNum < step ? (
                <Check className="w-6 h-6" />
              ) : (
                stepNum
              )}
            </div>

  // Calculate progress percentage
  const progress = Math.min(100, (step / totalSteps) * 100)

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      {/* Progress bar */}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
        <div
          className="h-full bg-optimi-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step counter */}
      <p className="text-sm text-gray-500 text-center">
        Step {step} of {totalSteps}
      </p>
    </div>
  )
}
