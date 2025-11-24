'use client'

/**
 * Progress Indicator for Intake Flow
 *
 * Displays the current step in the multi-step intake process with a
 * horizontal segmented progress bar matching the mockup design.
 *
 * @module intake-progress-indicator
 */

import { Check } from 'lucide-react'
import { useIntake } from './intake-context'
import { getTotalSteps } from '@/lib/intake-questions'

/**
 * Progress indicator showing current position in the intake flow
 *
 * Displays:
 * - Horizontal segmented progress bar
 * - Checkmark on completed segment
 * - Step counter text on the right
 *
 * @example
 * <IntakeProgressIndicator />
 */
export default function IntakeProgressIndicator() {
  const { step, promptType } = useIntake()

  // Calculate total steps dynamically based on prompt type
  const totalSteps = getTotalSteps(promptType)

  // Calculate progress percentage (using 3 visual segments)
  const visualSteps = 3
  const progressSegment = Math.min(step, visualSteps)

  return (
    <div className="w-full max-w-2xl mx-auto mb-6">
      <div className="flex items-center gap-4">
        {/* Segmented progress bar */}
        <div className="flex-1 flex items-center gap-1">
          {[1, 2, 3].map((segmentNum) => (
            <div
              key={segmentNum}
              className={`
                h-3 flex-1 rounded-full transition-all duration-300 relative
                ${segmentNum <= progressSegment
                  ? 'bg-[#00C896]'
                  : 'bg-gray-200'
                }
                ${segmentNum === 1 ? 'rounded-l-full' : ''}
                ${segmentNum === 3 ? 'rounded-r-full' : ''}
              `}
            >
              {/* Checkmark on the current/completed segment */}
              {segmentNum === progressSegment && step >= segmentNum && (
                <div className="absolute right-1 top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <Check className="w-3 h-3 text-[#00C896]" strokeWidth={3} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Step counter text */}
        <span className="text-sm text-gray-500 whitespace-nowrap font-medium">
          Step {step} of {totalSteps}
        </span>
      </div>
    </div>
  )
}
