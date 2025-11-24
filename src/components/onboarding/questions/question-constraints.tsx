'use client'

/**
 * Question Constraints Component
 *
 * Step 7 of the intake flow - collects optional constraints or things to avoid.
 * Optional textarea input with character limit (0-150 chars).
 *
 * @module question-constraints
 */

import { useState, useCallback, useEffect } from 'react'
import { useIntake } from '../intake-context'
import QuestionWrapper from './question-wrapper'
import { QUESTION_CONFIGS } from '@/lib/intake-questions'
import { INTAKE_CONSTRAINTS_MAX_CHARS } from '@/lib/constants'

export default function QuestionConstraints() {
  const { step, guidedQuestions, setGuidedQuestions, goToStep } = useIntake()
  const [value, setValue] = useState(guidedQuestions?.constraints || '')

  const config = QUESTION_CONFIGS.constraints
  const charCount = value.length
  // Optional field - always valid, just check max length
  const isValid = charCount <= INTAKE_CONSTRAINTS_MAX_CHARS

  // Load saved value from context on mount
  useEffect(() => {
    if (guidedQuestions?.constraints) {
      setValue(guidedQuestions.constraints)
    }
  }, [guidedQuestions?.constraints])

  const handleNext = useCallback(() => {
    setGuidedQuestions({
      ...guidedQuestions,
      constraints: value.trim() || undefined
    })
    goToStep(step + 1)
  }, [value, step, guidedQuestions, setGuidedQuestions, goToStep])

  const handleBack = useCallback(() => {
    // Save current value before going back
    setGuidedQuestions({
      ...guidedQuestions,
      constraints: value.trim() || undefined
    })
    goToStep(step - 1)
  }, [value, step, guidedQuestions, setGuidedQuestions, goToStep])

  return (
    <QuestionWrapper
      title={config.title}
      description={config.description}
      onBack={handleBack}
      onNext={handleNext}
      canGoNext={isValid}
      required={config.required}
    >
      {/* Textarea */}
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={config.placeholder}
        rows={3}
        className={`
          w-full p-4 rounded-xl border-2 resize-none
          transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-optimi-primary focus:ring-offset-2
          ${charCount > INTAKE_CONSTRAINTS_MAX_CHARS
            ? 'border-red-500 focus:border-red-500'
            : 'border-gray-200 focus:border-optimi-primary'
          }
        `}
      />

      {/* Character counter */}
      <div className="flex justify-between items-center mt-2">
        <span className="text-sm text-gray-400">
          Optional - Skip if you don't have any constraints
        </span>
        <span className={`
          text-sm font-medium
          ${charCount > INTAKE_CONSTRAINTS_MAX_CHARS
            ? 'text-red-500'
            : charCount > 0
              ? 'text-optimi-green'
              : 'text-gray-400'
          }
        `}>
          {charCount} / {INTAKE_CONSTRAINTS_MAX_CHARS}
        </span>
      </div>
    </QuestionWrapper>
  )
}
