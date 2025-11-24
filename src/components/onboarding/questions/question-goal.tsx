'use client'

/**
 * Question Goal Component
 *
 * Step 4 of the intake flow - collects user's primary goal for using AI.
 * Textarea input with character validation (50-200 chars).
 *
 * @module question-goal
 */

import { useState, useCallback, useEffect } from 'react'
import { useIntake } from '../intake-context'
import QuestionWrapper from './question-wrapper'
import { QUESTION_CONFIGS } from '@/lib/intake-questions'
import { INTAKE_GOAL_MIN_CHARS, INTAKE_GOAL_MAX_CHARS } from '@/lib/constants'

export default function QuestionGoal() {
  const { step, guidedQuestions, setGuidedQuestions, goToStep } = useIntake()
  const [value, setValue] = useState(guidedQuestions?.goal || '')

  const config = QUESTION_CONFIGS.goal
  const charCount = value.length
  const isValid = charCount >= INTAKE_GOAL_MIN_CHARS && charCount <= INTAKE_GOAL_MAX_CHARS

  // Load saved value from context on mount
  useEffect(() => {
    if (guidedQuestions?.goal) {
      setValue(guidedQuestions.goal)
    }
  }, [guidedQuestions?.goal])

  const handleNext = useCallback(() => {
    if (isValid) {
      setGuidedQuestions({ ...guidedQuestions, goal: value.trim() })
      goToStep(step + 1)
    }
  }, [isValid, value, step, guidedQuestions, setGuidedQuestions, goToStep])

  const handleBack = useCallback(() => {
    // Save current value before going back
    if (value.trim()) {
      setGuidedQuestions({ ...guidedQuestions, goal: value.trim() })
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
          Minimum {INTAKE_GOAL_MIN_CHARS} characters
        </span>
        <span className={`
          text-sm font-medium
          ${charCount > INTAKE_GOAL_MAX_CHARS
            ? 'text-red-500'
            : charCount < INTAKE_GOAL_MIN_CHARS
              ? 'text-orange-500'
              : 'text-optimi-green'
          }
        `}>
          {charCount} / {INTAKE_GOAL_MAX_CHARS}
        </span>
      </div>
    </QuestionWrapper>
  )
}
