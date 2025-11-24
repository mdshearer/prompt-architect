'use client'

/**
 * Initial Thoughts Input Component
 *
 * Step 3 of the intake flow - allows users to enter their initial thoughts
 * about their business/role and what they need AI help with.
 *
 * Features:
 * - Dynamic placeholder and label based on prompt type
 * - Real-time character counter with validation feedback
 * - Submit button with loading state
 * - Back navigation
 *
 * @module initial-thoughts-input
 */

import { useMemo, useCallback } from 'react'
import { useIntake } from './intake-context'
import { getPlaceholderText, getLabelText, validateCharacterCount } from '@/lib/intake-helpers'
import { MIN_INTAKE_THOUGHTS_LENGTH, MAX_INTAKE_THOUGHTS_LENGTH } from '@/lib/constants'
import { ChevronLeft, Loader2, Send } from 'lucide-react'

/**
 * Initial thoughts input for step 3 of the intake flow
 *
 * Provides a textarea for users to describe their needs with real-time
 * validation and character counting.
 *
 * @example
 * <InitialThoughtsInput />
 */
export default function InitialThoughtsInput() {
  const {
    promptType,
    userThoughts,
    setUserThoughts,
    submitIntake,
    goToStep,
    isLoading,
    error
  } = useIntake()

  // Memoize placeholder text for performance
  const placeholderText = useMemo(
    () => getPlaceholderText(promptType),
    [promptType]
  )

  // Memoize label text for performance
  const labelText = useMemo(
    () => getLabelText(promptType),
    [promptType]
  )

  // Character count and validation
  const charCount = userThoughts.length
  const validation = useMemo(
    () => validateCharacterCount(charCount, MIN_INTAKE_THOUGHTS_LENGTH, MAX_INTAKE_THOUGHTS_LENGTH),
    [charCount]
  )

  // Determine if submit should be disabled
  const isSubmitDisabled = !validation.valid || isLoading || charCount === 0

  // Handle textarea change
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserThoughts(e.target.value)
  }, [setUserThoughts])

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isSubmitDisabled) {
      await submitIntake()
    }
  }, [isSubmitDisabled, submitIntake])

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Heading */}
      <h2 className="text-2xl font-bold text-center mb-2 text-optimi-gray">
        {labelText}
      </h2>
      <p className="text-gray-500 text-center mb-8">
        The more specific you are, the better your results will be
      </p>

      <form onSubmit={handleSubmit}>
        {/* Textarea */}
        <div className="relative mb-2">
          <textarea
            value={userThoughts}
            onChange={handleChange}
            placeholder={placeholderText}
            disabled={isLoading}
            rows={6}
            className={`
              w-full p-4 rounded-xl border-2 resize-none
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-optimi-primary focus:ring-offset-2
              disabled:bg-gray-50 disabled:cursor-not-allowed
              ${error
                ? 'border-red-500 focus:border-red-500'
                : !validation.valid && charCount > 0
                  ? 'border-orange-400'
                  : 'border-gray-200 focus:border-optimi-primary'
              }
            `}
          />
        </div>

        {/* Character counter */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm">
            {error ? (
              <span className="text-red-500">{error}</span>
            ) : !validation.valid && charCount > 0 ? (
              <span className="text-orange-500">{validation.error}</span>
            ) : (
              <span className="text-gray-400">
                Minimum {MIN_INTAKE_THOUGHTS_LENGTH} characters
              </span>
            )}
          </div>
          <div
            className={`
              text-sm font-medium
              ${charCount > MAX_INTAKE_THOUGHTS_LENGTH
                ? 'text-red-500'
                : charCount < MIN_INTAKE_THOUGHTS_LENGTH
                  ? 'text-orange-500'
                  : 'text-optimi-green'
              }
            `}
          >
            {charCount} / {MAX_INTAKE_THOUGHTS_LENGTH}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
          {/* Back button */}
          <button
            type="button"
            onClick={() => goToStep(2)}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-optimi-primary transition-colors disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className={`
              inline-flex items-center gap-2 px-8 py-4 rounded-xl
              font-bold text-base transition-all duration-200 shadow-lg
              ${isSubmitDisabled
                ? 'bg-gray-300 cursor-not-allowed'
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
      </form>

      {/* Helper text */}
      <p className="text-center text-sm text-gray-400 mt-6">
        Your response helps us create personalized instructions tailored to your specific needs.
      </p>
    </div>
  )
}
