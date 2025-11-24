'use client'

/**
 * Question Wrapper Component
 *
 * Reusable wrapper for all question components.
 * Provides consistent layout, navigation buttons, and styling.
 *
 * @module question-wrapper
 */

import type { ReactNode } from 'react'
import { ChevronLeft } from 'lucide-react'

interface QuestionWrapperProps {
  title: string
  description?: string
  children: ReactNode
  onBack: () => void
  onNext: () => void
  canGoNext: boolean
  isLoading?: boolean
  required?: boolean
}

/**
 * Reusable wrapper for all question components
 *
 * Provides consistent layout, navigation, and styling across all questions.
 * Handles back/next navigation and visual feedback for validation state.
 *
 * @param props - Component props
 * @returns Question wrapper with navigation
 *
 * @example
 * <QuestionWrapper
 *   title="What's your role?"
 *   description="Help us understand your context"
 *   onBack={handleBack}
 *   onNext={handleNext}
 *   canGoNext={isValid}
 *   required
 * >
 *   <textarea value={value} onChange={handleChange} />
 * </QuestionWrapper>
 */
export default function QuestionWrapper({
  title,
  description,
  children,
  onBack,
  onNext,
  canGoNext,
  isLoading = false,
  required = true
}: QuestionWrapperProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Question header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-optimi-gray mb-2">
          {title}
          {required && <span className="text-red-500 ml-1">*</span>}
        </h2>
        {description && (
          <p className="text-gray-500">{description}</p>
        )}
      </div>

      {/* Question content (input area) */}
      <div className="mb-8">
        {children}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-optimi-primary transition-colors disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!canGoNext || isLoading}
          className={`
            inline-flex items-center gap-2 px-8 py-3 rounded-xl
            font-semibold transition-all duration-200
            ${!canGoNext || isLoading
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed opacity-60'
              : 'bg-optimi-yellow text-optimi-primary hover:bg-optimi-yellow/90 hover:shadow-lg shadow-md'
            }
            focus:outline-none focus:ring-2 focus:ring-optimi-yellow focus:ring-offset-2
          `}
        >
          Next
        </button>
      </div>
    </div>
  )
}
