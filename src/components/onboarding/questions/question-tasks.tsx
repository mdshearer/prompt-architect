'use client'

/**
 * Question Tasks Component
 *
 * Step 5 of the intake flow - collects specific tasks user will use AI for.
 * Multi-select checkboxes with "Other" text input option.
 *
 * @module question-tasks
 */

import { useState, useCallback, useEffect } from 'react'
import { useIntake } from '../intake-context'
import QuestionWrapper from './question-wrapper'
import { QUESTION_CONFIGS, TASK_OPTIONS, TASK_LABELS } from '@/lib/intake-questions'
import type { TaskOption } from '@/types/intake'
import { Check } from 'lucide-react'

export default function QuestionTasks() {
  const { guidedQuestions, setGuidedQuestions, goToStep } = useIntake()
  const [selected, setSelected] = useState<TaskOption[]>(guidedQuestions?.tasks || [])
  const [otherText, setOtherText] = useState(guidedQuestions?.tasksOther || '')

  const config = QUESTION_CONFIGS.tasks
  const isValid = selected.length > 0 && (!selected.includes('other') || otherText.trim().length > 0)

  // Load saved values from context on mount
  useEffect(() => {
    if (guidedQuestions?.tasks) {
      setSelected(guidedQuestions.tasks)
    }
    if (guidedQuestions?.tasksOther) {
      setOtherText(guidedQuestions.tasksOther)
    }
  }, [guidedQuestions?.tasks, guidedQuestions?.tasksOther])

  const toggleTask = useCallback((task: TaskOption) => {
    setSelected(prev =>
      prev.includes(task)
        ? prev.filter(t => t !== task)
        : [...prev, task]
    )
  }, [])

  const handleNext = useCallback(() => {
    if (isValid) {
      setGuidedQuestions({
        ...guidedQuestions,
        tasks: selected,
        tasksOther: selected.includes('other') ? otherText.trim() : undefined
      })
      goToStep(config.step + 1)
    }
  }, [isValid, selected, otherText, guidedQuestions, setGuidedQuestions, goToStep, config.step])

  const handleBack = useCallback(() => {
    // Save current selections before going back
    if (selected.length > 0) {
      setGuidedQuestions({
        ...guidedQuestions,
        tasks: selected,
        tasksOther: selected.includes('other') ? otherText.trim() : undefined
      })
    }
    goToStep(config.step - 1)
  }, [selected, otherText, guidedQuestions, setGuidedQuestions, goToStep, config.step])

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
        {TASK_OPTIONS.map((task) => (
          <button
            key={task}
            type="button"
            onClick={() => toggleTask(task)}
            className={`
              w-full flex items-center gap-3 p-4 rounded-xl border-2
              transition-all duration-200
              ${selected.includes(task)
                ? 'border-optimi-primary bg-optimi-primary/5'
                : 'border-gray-200 hover:border-optimi-primary/50'
              }
            `}
          >
            <div className={`
              w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0
              ${selected.includes(task)
                ? 'border-optimi-primary bg-optimi-primary'
                : 'border-gray-300'
              }
            `}>
              {selected.includes(task) && <Check className="w-4 h-4 text-white" />}
            </div>
            <span className="font-medium text-gray-700 text-left">{TASK_LABELS[task]}</span>
          </button>
        ))}
      </div>

      {/* "Other" text input */}
      {selected.includes('other') && (
        <div className="mt-4">
          <input
            type="text"
            value={otherText}
            onChange={(e) => setOtherText(e.target.value)}
            placeholder="Please describe the other tasks..."
            className={`
              w-full p-3 rounded-lg border-2 transition-colors
              focus:outline-none focus:ring-2 focus:ring-optimi-primary focus:ring-offset-2
              ${otherText.trim().length > 0
                ? 'border-optimi-primary'
                : 'border-orange-400'
              }
            `}
          />
          {otherText.trim().length === 0 && (
            <p className="text-sm text-orange-500 mt-2">Please describe what other tasks you need help with</p>
          )}
        </div>
      )}

      {selected.length === 0 && (
        <p className="text-sm text-orange-500 mt-3">Please select at least one task</p>
      )}
    </QuestionWrapper>
  )
}
