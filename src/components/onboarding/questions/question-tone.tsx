'use client'

/**
 * Question Tone Component
 *
 * Step 6 of the intake flow - collects preferred tone/style for AI responses.
 * Radio button selection with descriptions.
 *
 * @module question-tone
 */

import { useState, useCallback, useEffect } from 'react'
import { useIntake } from '../intake-context'
import QuestionWrapper from './question-wrapper'
import { QUESTION_CONFIGS, TONE_OPTIONS, TONE_LABELS, TONE_DESCRIPTIONS } from '@/lib/intake-questions'
import type { ToneOption } from '@/types/intake'

export default function QuestionTone() {
  const { step, guidedQuestions, setGuidedQuestions, goToStep } = useIntake()
  const [selected, setSelected] = useState<ToneOption | null>(guidedQuestions?.tone || null)

  const config = QUESTION_CONFIGS.tone
  const isValid = selected !== null

  // Load saved value from context on mount
  useEffect(() => {
    if (guidedQuestions?.tone) {
      setSelected(guidedQuestions.tone)
    }
  }, [guidedQuestions?.tone])

  const handleNext = useCallback(() => {
    if (isValid && selected) {
      setGuidedQuestions({ ...guidedQuestions, tone: selected })
      goToStep(step + 1)
    }
  }, [isValid, selected, step, guidedQuestions, setGuidedQuestions, goToStep])

  const handleBack = useCallback(() => {
    // Save current selection before going back
    if (selected) {
      setGuidedQuestions({ ...guidedQuestions, tone: selected })
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
        {TONE_OPTIONS.map((tone) => (
          <button
            key={tone}
            type="button"
            onClick={() => setSelected(tone)}
            className={`
              w-full flex items-start gap-4 p-4 rounded-xl border-2
              transition-all duration-200 text-left
              ${selected === tone
                ? 'border-optimi-primary bg-optimi-primary/5'
                : 'border-gray-200 hover:border-optimi-primary/50'
              }
            `}
          >
            {/* Radio circle */}
            <div className={`
              w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5
              ${selected === tone
                ? 'border-optimi-primary'
                : 'border-gray-300'
              }
            `}>
              {selected === tone && (
                <div className="w-3 h-3 rounded-full bg-optimi-primary" />
              )}
            </div>

            {/* Label and description */}
            <div className="flex-1">
              <div className="font-semibold text-gray-700 mb-1">
                {TONE_LABELS[tone]}
              </div>
              <div className="text-sm text-gray-500">
                {TONE_DESCRIPTIONS[tone]}
              </div>
            </div>
          </button>
        ))}
      </div>

      {!isValid && (
        <p className="text-sm text-orange-500 mt-3">Please select a tone/style preference</p>
      )}
    </QuestionWrapper>
  )
}
