'use client'

/**
 * Output Display Component
 *
 * Displays the generated output after intake flow completion.
 * For Prompt Architect, shows dual sections (Setup Instructions + Ready-to-Use Prompt).
 * For other types, shows single section with the generated content.
 *
 * Features:
 * - Collapsible Section 1 (Setup Instructions)
 * - Copy buttons for each section
 * - Start Over button to reset flow
 *
 * @module output-display
 */

import { useState, useCallback } from 'react'
import { useIntake } from './intake-context'
import { getPromptTypeLabel } from '@/lib/intake-helpers'
import {
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sparkles
} from 'lucide-react'

/**
 * Output display shown after intake completion
 *
 * @example
 * <OutputDisplay />
 */
export default function OutputDisplay() {
  const { output, aiTool, promptType, resetIntake } = useIntake()
  const [section1Expanded, setSection1Expanded] = useState(true)
  const [copiedSection, setCopiedSection] = useState<'section1' | 'section2' | null>(null)
  const [showConfirmReset, setShowConfirmReset] = useState(false)

  // Don't render if no output
  if (!output) {
    return null
  }

  const hasSection1 = !!output.section1

  // Handle copy to clipboard
  const handleCopy = useCallback(async (section: 'section1' | 'section2') => {
    const content = section === 'section1' ? output.section1 : output.section2
    if (!content) return

    try {
      await navigator.clipboard.writeText(content)
      setCopiedSection(section)
      setTimeout(() => setCopiedSection(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }, [output])

  // Handle reset with confirmation
  const handleReset = useCallback(() => {
    if (showConfirmReset) {
      resetIntake()
      setShowConfirmReset(false)
    } else {
      setShowConfirmReset(true)
      // Auto-hide confirmation after 3 seconds
      setTimeout(() => setShowConfirmReset(false), 3000)
    }
  }, [showConfirmReset, resetIntake])

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-optimi-green/10 mb-4">
          <Sparkles className="w-8 h-8 text-optimi-green" />
        </div>
        <h2 className="text-2xl font-bold text-optimi-gray mb-2">
          Your Custom {promptType ? getPromptTypeLabel(promptType, aiTool) : 'Prompt'} is Ready!
        </h2>
        <p className="text-gray-500">
          Copy and use the content below in your AI tool
        </p>
      </div>

      {/* Section 1: Setup Instructions (only for Prompt Architect) */}
      {hasSection1 && (
        <div className="mb-6">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Section header - collapsible */}
            <button
              onClick={() => setSection1Expanded(!section1Expanded)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-optimi-primary text-white text-xs font-bold">
                  1
                </span>
                <h3 className="font-semibold text-optimi-gray">
                  Setup Instructions
                </h3>
              </div>
              {section1Expanded ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>

            {/* Section content */}
            {section1Expanded && (
              <div className="p-4 border-t">
                <div className="prose prose-sm max-w-none mb-4">
                  <div className="whitespace-pre-wrap text-sm text-gray-700">
                    {output.section1}
                  </div>
                </div>

                {/* Copy button */}
                <button
                  onClick={() => handleCopy('section1')}
                  className={`
                    inline-flex items-center gap-2 px-4 py-2 rounded-lg
                    text-sm font-medium transition-colors
                    ${copiedSection === 'section1'
                      ? 'bg-optimi-green/10 text-optimi-green'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }
                  `}
                >
                  {copiedSection === 'section1' ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Setup Instructions
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Section 2: Ready-to-Use Prompt (always present) */}
      <div className="mb-8">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Section header */}
          <div className="flex items-center justify-between p-4 bg-optimi-primary/5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-optimi-primary text-white text-xs font-bold">
                {hasSection1 ? '2' : '1'}
              </span>
              <h3 className="font-semibold text-optimi-gray">
                {hasSection1 ? 'Ready-to-Use Prompt' : 'Your Generated Prompt'}
              </h3>
            </div>
          </div>

          {/* Section content */}
          <div className="p-4 border-t">
            <div className="prose prose-sm max-w-none mb-4">
              <div className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
                {output.section2}
              </div>
            </div>

            {/* Copy button */}
            <button
              onClick={() => handleCopy('section2')}
              className={`
                inline-flex items-center gap-2 px-4 py-2 rounded-lg
                text-sm font-medium transition-colors
                ${copiedSection === 'section2'
                  ? 'bg-optimi-green/10 text-optimi-green'
                  : 'bg-optimi-primary text-white hover:bg-optimi-primary/90'
                }
              `}
            >
              {copiedSection === 'section2' ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Prompt
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Start Over button */}
      <div className="text-center">
        <button
          onClick={handleReset}
          className={`
            inline-flex items-center gap-2 px-6 py-3 rounded-xl
            font-medium transition-all duration-200
            ${showConfirmReset
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }
          `}
        >
          <RotateCcw className="w-4 h-4" />
          {showConfirmReset ? 'Click again to confirm' : 'Start Over'}
        </button>
        {showConfirmReset && (
          <p className="text-sm text-gray-500 mt-2">
            This will clear your data and start fresh
          </p>
        )}
      </div>
    </div>
  )
}
