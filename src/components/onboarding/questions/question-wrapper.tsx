'use client'

/**
 * Question Wrapper Component
 *
 * Reusable wrapper for all question components.
 * Provides consistent layout, navigation buttons, and styling.
 * Matches the mockup design with bold heading, gray input area, and yellow CTA.
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
      {/* Question header - Bold, dark text */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#464650]">
          {title}
          {required && <span className="text-red-500 ml-1">*</span>}
        </h2>
        {description && (
          <p className="text-gray-500 mt-1">{description}</p>
        )}
      </div>

      {/* Question content (input area) */}
      <div className="mb-6">
        {children}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-[#283791] transition-colors disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!canGoNext || isLoading}
          className={`
            inline-flex items-center justify-center px-8 py-3 rounded-full
            font-bold text-base transition-all duration-200
            ${!canGoNext || isLoading
              ? 'bg-gray-300 text-gray-400 cursor-not-allowed'
              : 'bg-[#FFDC00] text-[#464650] hover:bg-[#f0d000] hover:shadow-lg shadow-md'
            }
            focus:outline-none focus:ring-2 focus:ring-[#FFDC00] focus:ring-offset-2
          `}
        >
          Next
        </button>
      </div>
    </div>
  )
}
