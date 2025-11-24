'use client'

/**
 * Question Role Component
 *
 * Step 3 of the intake flow - collects user's role or business focus.
 * Textarea input with character validation (50-200 chars).
 *
 * @module question-role
 */

import { useState, useCallback, useEffect } from 'react'
import { useIntake } from '../intake-context'
import QuestionWrapper from './question-wrapper'
import { QUESTION_CONFIGS } from '@/lib/intake-questions'
import { INTAKE_ROLE_MIN_CHARS, INTAKE_ROLE_MAX_CHARS } from '@/lib/constants'

export default function QuestionRole() {
  const { step, guidedQuestions, setGuidedQuestions, goToStep } = useIntake()
  const [value, setValue] = useState(guidedQuestions?.role || '')

  const config = QUESTION_CONFIGS.role
  const charCount = value.length
  const isValid = charCount >= INTAKE_ROLE_MIN_CHARS && charCount <= INTAKE_ROLE_MAX_CHARS

  // Load saved value from context on mount
  useEffect(() => {
    if (guidedQuestions?.role) {
      setValue(guidedQuestions.role)
    }
  }, [guidedQuestions?.role])

  const handleNext = useCallback(() => {
    if (isValid) {
      setGuidedQuestions({ ...guidedQuestions, role: value.trim() })
      goToStep(step + 1)
    }
  }, [isValid, value, step, guidedQuestions, setGuidedQuestions, goToStep])

  const handleBack = useCallback(() => {
    // Save current value before going back
    if (value.trim()) {
      setGuidedQuestions({ ...guidedQuestions, role: value.trim() })
    }
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
      {/* Textarea - Light gray background matching mockup */}
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={config.placeholder}
        rows={4}
        className={`
          w-full p-4 rounded-xl border resize-none
          bg-gray-100 text-[#464650] placeholder:text-gray-400
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-[#00C896] focus:ring-offset-2 focus:bg-white
          ${isValid || charCount === 0
            ? 'border-gray-200'
            : 'border-orange-400'
          }
        `}
      />

      {/* Character counter */}
      <div className="flex justify-between items-center mt-2">
        <span className="text-sm text-gray-400">
          Minimum {INTAKE_ROLE_MIN_CHARS} characters
        </span>
        <span className={`
          text-sm font-medium
          ${charCount > INTAKE_ROLE_MAX_CHARS
            ? 'text-red-500'
            : charCount < INTAKE_ROLE_MIN_CHARS
              ? 'text-orange-500'
              : 'text-optimi-green'
          }
        `}>
          {charCount} / {INTAKE_ROLE_MAX_CHARS}
        </span>
      </div>
    </QuestionWrapper>
  )
}
