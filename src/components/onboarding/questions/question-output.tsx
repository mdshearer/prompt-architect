'use client'

/**
 * Question Output Detail Component
 *
 * Step 8 of the intake flow - collects preferred output detail level.
 * Radio button selection with descriptions.
 *
 * @module question-output
 */

import { useState, useCallback, useEffect } from 'react'
import { useIntake } from '../intake-context'
import QuestionWrapper from './question-wrapper'
import { QUESTION_CONFIGS, OUTPUT_OPTIONS, OUTPUT_LABELS, OUTPUT_DESCRIPTIONS } from '@/lib/intake-questions'
import type { OutputDetail } from '@/types/intake'

export default function QuestionOutput() {
  const { step, guidedQuestions, setGuidedQuestions, goToStep } = useIntake()
  const [selected, setSelected] = useState<OutputDetail | null>(guidedQuestions?.outputDetail || null)

  const config = QUESTION_CONFIGS.outputDetail
  const isValid = selected !== null

  // Load saved value from context on mount
  useEffect(() => {
    if (guidedQuestions?.outputDetail) {
      setSelected(guidedQuestions.outputDetail)
    }
  }, [guidedQuestions?.outputDetail])

  const handleNext = useCallback(() => {
    if (isValid && selected) {
      setGuidedQuestions({ ...guidedQuestions, outputDetail: selected })
      goToStep(step + 1)
    }
  }, [isValid, selected, step, guidedQuestions, setGuidedQuestions, goToStep])

  const handleBack = useCallback(() => {
    // Save current selection before going back
    if (selected) {
      setGuidedQuestions({ ...guidedQuestions, outputDetail: selected })
    }
    goToStep(step - 1)
  }, [selected, step, guidedQuestions, setGuidedQuestions, goToStep])

  return (
    <QuestionWrapper
      title={config.title}
      description={config.description}
      onBack={handleBack}
      onNext={handleNext}
      canGoNext={isValid}
      required={config.required}
    >
      <div className="space-y-3">
        {OUTPUT_OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setSelected(option)}
            className={`
              w-full flex items-start gap-4 p-4 rounded-xl border-2
              transition-all duration-200 text-left
              ${selected === option
                ? 'border-optimi-primary bg-optimi-primary/5'
                : 'border-gray-200 hover:border-optimi-primary/50'
              }
            `}
          >
            {/* Radio circle */}
            <div className={`
              w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5
              ${selected === option
                ? 'border-optimi-primary'
                : 'border-gray-300'
              }
            `}>
              {selected === option && (
                <div className="w-3 h-3 rounded-full bg-optimi-primary" />
              )}
            </div>

            {/* Label and description */}
            <div className="flex-1">
              <div className="font-semibold text-gray-700 mb-1">
                {OUTPUT_LABELS[option]}
              </div>
              <div className="text-sm text-gray-500">
                {OUTPUT_DESCRIPTIONS[option]}
              </div>
            </div>
          </button>
        ))}
      </div>

      {!isValid && (
        <p className="text-sm text-orange-500 mt-3">Please select your preferred detail level</p>
      )}
    </QuestionWrapper>
  )
}
