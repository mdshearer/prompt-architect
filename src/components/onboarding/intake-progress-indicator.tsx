'use client'

/**
 * Progress Indicator for Intake Flow
 *
 * Displays the current step in the multi-step intake process with a
 * visual step indicator showing completed, current, and upcoming steps.
 *
 * @module intake-progress-indicator
 */

import { Check } from 'lucide-react'
import { useIntake } from './intake-context'

/**
 * Progress indicator showing current position in the intake flow
 *
 * Displays:
 * - Visual step circles (completed, current, upcoming)
 * - Connector lines between steps
 * - Step counter (Step X of 3)
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

            {/* Connector line (not after last step) */}
            {index < 2 && (
              <div
                className={`
                  w-16 h-1 mx-2 rounded transition-all duration-200
                  ${stepNum < step ? 'bg-[#00C896]' : 'bg-gray-300'}
                `}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
