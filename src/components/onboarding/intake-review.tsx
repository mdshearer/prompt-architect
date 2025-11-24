'use client'

/**
 * Intake Review Component
 *
 * Final step before generation - displays summary of all user answers.
 * Allows editing any answer by navigating back to specific questions.
 *
 * @module intake-review
 */

import { useCallback } from 'react'
import { useIntake } from './intake-context'
import { ChevronLeft, Loader2, Send, Pencil } from 'lucide-react'
import { TASK_LABELS, TONE_LABELS, OUTPUT_LABELS, getLastQuestionStep } from '@/lib/intake-questions'
import { getAiToolDisplayName, getPromptTypeLabel } from '@/lib/intake-helpers'

export default function IntakeReview() {
  const {
    aiTool,
    promptType,
    guidedQuestions,
    submitIntake,
    goToStep,
    isLoading,
    error
  } = useIntake()

  const handleSubmit = useCallback(async () => {
    await submitIntake()
  }, [submitIntake])

  const handleEdit = useCallback((step: number) => {
    goToStep(step)
  }, [goToStep])

  const handleBack = useCallback(() => {
    // Go back to last question (varies by prompt type)
    const lastQuestionStep = getLastQuestionStep(promptType)
    goToStep(lastQuestionStep)
  }, [promptType, goToStep])

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-optimi-gray mb-2">
          Review Your Answers
        </h2>
        <p className="text-gray-500">
          Make sure everything looks good before generating your prompt
        </p>
      </div>

      {/* Summary cards */}
      <div className="space-y-4 mb-8">
        {/* AI Tool & Prompt Type */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Setup</h3>
              <p className="text-sm text-gray-600">
                <strong>AI Tool:</strong> {aiTool && getAiToolDisplayName(aiTool)}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Prompt Type:</strong> {promptType && getPromptTypeLabel(promptType, aiTool)}
              </p>
            </div>
            <button
              onClick={() => handleEdit(1)}
              className="text-optimi-primary hover:text-optimi-primary/80 transition-colors"
              aria-label="Edit AI tool and prompt type"
            >
              <Pencil className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Role */}
        {guidedQuestions?.role && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-700 mb-2">Your Role</h3>
                <p className="text-sm text-gray-600">{guidedQuestions.role}</p>
              </div>
              <button
                onClick={() => handleEdit(3)}
                className="text-optimi-primary hover:text-optimi-primary/80 transition-colors ml-4"
                aria-label="Edit role"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Goal */}
        {guidedQuestions?.goal && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-700 mb-2">Your Goal</h3>
                <p className="text-sm text-gray-600">{guidedQuestions.goal}</p>
              </div>
              <button
                onClick={() => handleEdit(4)}
                className="text-optimi-primary hover:text-optimi-primary/80 transition-colors ml-4"
                aria-label="Edit goal"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Tasks */}
        {guidedQuestions?.tasks && guidedQuestions.tasks.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-700 mb-2">Tasks</h3>
                <div className="flex flex-wrap gap-2">
                  {guidedQuestions.tasks.map(task => (
                    <span key={task} className="px-3 py-1 bg-optimi-primary/10 text-optimi-primary rounded-full text-sm font-medium">
                      {TASK_LABELS[task]}
                    </span>
                  ))}
                </div>
                {guidedQuestions.tasksOther && (
                  <p className="text-sm text-gray-600 mt-2"><strong>Other:</strong> {guidedQuestions.tasksOther}</p>
                )}
              </div>
              <button
                onClick={() => handleEdit(5)}
                className="text-optimi-primary hover:text-optimi-primary/80 transition-colors ml-4"
                aria-label="Edit tasks"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Tone */}
        {guidedQuestions?.tone && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-700 mb-2">Tone & Style</h3>
                <p className="text-sm text-gray-600">{TONE_LABELS[guidedQuestions.tone]}</p>
              </div>
              <button
                onClick={() => handleEdit(6)}
                className="text-optimi-primary hover:text-optimi-primary/80 transition-colors ml-4"
                aria-label="Edit tone"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Constraints */}
        {guidedQuestions?.constraints && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-700 mb-2">Constraints</h3>
                <p className="text-sm text-gray-600">{guidedQuestions.constraints}</p>
              </div>
              <button
                onClick={() => handleEdit(7)}
                className="text-optimi-primary hover:text-optimi-primary/80 transition-colors ml-4"
                aria-label="Edit constraints"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Output Detail */}
        {guidedQuestions?.outputDetail && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-700 mb-2">Response Detail</h3>
                <p className="text-sm text-gray-600">{OUTPUT_LABELS[guidedQuestions.outputDetail]}</p>
              </div>
              <button
                onClick={() => handleEdit(8)}
                className="text-optimi-primary hover:text-optimi-primary/80 transition-colors ml-4"
                aria-label="Edit output detail"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={handleBack}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-optimi-primary transition-colors disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className={`
            inline-flex items-center gap-2 px-8 py-4 rounded-xl
            font-bold text-base transition-all duration-200 shadow-lg
            ${isLoading
              ? 'bg-gray-300 cursor-not-allowed text-gray-500'
              : 'bg-gradient-to-r from-[#FFDC00] to-[#00C896] text-[#283791] hover:shadow-xl hover:shadow-[#00C896]/50 hover:scale-105'
            }
            focus:outline-none focus:ring-2 focus:ring-[#FFDC00] focus:ring-offset-2
          `}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Generate My Prompt
            </>
          )}
        </button>
      </div>
    </div>
  )
}
