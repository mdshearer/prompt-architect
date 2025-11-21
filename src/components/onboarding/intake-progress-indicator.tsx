'use client'

/**
 * Progress Indicator for Intake Flow
 *
 * Displays the current step in the 3-step intake process with visual
 * indicators for completed, current, and upcoming steps.
 *
 * @module intake-progress-indicator
 */

import { useIntake } from './intake-context'
import { Check } from 'lucide-react'

/**
 * Step labels for the progress indicator
 */
const STEP_LABELS = ['Select AI Tool', 'Choose Type', 'Your Thoughts']

/**
 * Progress indicator showing current position in the intake flow
 *
 * Displays 3 steps with:
 * - Completed steps shown with checkmark and green background
 * - Current step highlighted with primary blue
 * - Upcoming steps shown in gray
 *
 * @example
 * <IntakeProgressIndicator />
 */
export default function IntakeProgressIndicator() {
  const { step } = useIntake()

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
                flex items-center justify-center w-10 h-10 rounded-full
                text-sm font-medium transition-all duration-200
                ${stepNum < step
                  ? 'bg-optimi-green text-white'
                  : stepNum === step
                    ? 'bg-optimi-primary text-white'
                    : 'bg-gray-200 text-gray-500'
                }
              `}
            >
              {stepNum < step ? (
                <Check className="w-5 h-5" />
              ) : (
                stepNum
              )}
            </div>

            {/* Step label */}
            <span
              className={`
                ml-2 text-sm hidden sm:inline
                ${stepNum === step
                  ? 'text-optimi-primary font-medium'
                  : stepNum < step
                    ? 'text-optimi-green'
                    : 'text-gray-400'
                }
              `}
            >
              {STEP_LABELS[index]}
            </span>

            {/* Connector line between steps */}
            {index < 2 && (
              <div
                className={`
                  w-8 sm:w-16 h-0.5 mx-2 sm:mx-4
                  ${stepNum < step ? 'bg-optimi-green' : 'bg-gray-200'}
                `}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
