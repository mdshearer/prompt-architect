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

import { useState, useCallback, useEffect, useRef } from 'react'
import { useIntake } from './intake-context'
import { getPromptTypeLabel, getNextSteps, getAiToolUrl, getAiToolDisplayName } from '@/lib/intake-helpers'
import { logger } from '@/lib/logger'
import { hasStoredLead, setStoredLeadId } from '@/lib/lead-storage'
import type { IEmailCaptureForm, ICreateLeadResponse } from '@/types/lead'
import EmailCaptureModal from '@/components/lead-capture/email-capture-modal'
import ThankYouMessage from '@/components/lead-capture/thank-you-message'
import {
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sparkles,
  AlertCircle,
  ExternalLink,
  ArrowRight
} from 'lucide-react'

/**
 * Output display shown after intake completion
 *
 * @example
 * <OutputDisplay />
 */
export default function OutputDisplay() {
  const { output, aiTool, promptType, resetIntake, userThoughts } = useIntake()
  const [section1Expanded, setSection1Expanded] = useState(true)
  const [copiedSection, setCopiedSection] = useState<'section1' | 'section2' | null>(null)
  const [copyError, setCopyError] = useState<string | null>(null)
  const [showConfirmReset, setShowConfirmReset] = useState(false)

  // Email capture state
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [emailCaptured, setEmailCaptured] = useState(false)
  const [capturedEmail, setCapturedEmail] = useState<string>('')

  // Timer refs for cleanup to prevent memory leaks
  const copyTimerRef = useRef<NodeJS.Timeout | null>(null)
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null)
  const errorTimerRef = useRef<NodeJS.Timeout | null>(null)
  const emailModalTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current)
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current)
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current)
      if (emailModalTimerRef.current) clearTimeout(emailModalTimerRef.current)
    }
  }, [])

  // Show email capture modal after 2 seconds (only for new users)
  useEffect(() => {
    // Check if user already has a lead stored
    if (hasStoredLead()) {
      logger.info('User has stored lead, skipping email modal')
      return
    }

    // Show modal after 2 second delay
    emailModalTimerRef.current = setTimeout(() => {
      setShowEmailModal(true)
    }, 2000)

    return () => {
      if (emailModalTimerRef.current) clearTimeout(emailModalTimerRef.current)
    }
  }, []) // Run once on mount

  // Don't render if no output
  if (!output) {
    return null
  }

  const hasSection1 = !!output.section1

  // Handle copy to clipboard
  const handleCopy = useCallback(async (section: 'section1' | 'section2') => {
    const content = section === 'section1' ? output.section1 : output.section2
    if (!content) return

    // Clear any existing timers
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current)
    if (errorTimerRef.current) clearTimeout(errorTimerRef.current)

    try {
      await navigator.clipboard.writeText(content)
      setCopiedSection(section)
      setCopyError(null)
      copyTimerRef.current = setTimeout(() => setCopiedSection(null), 2000)
    } catch (err) {
      logger.error('Failed to copy to clipboard', err)
      // Show user-visible error feedback
      setCopyError('Unable to copy. Try selecting the text manually.')
      errorTimerRef.current = setTimeout(() => setCopyError(null), 4000)
    }
  }, [output])

  // Handle reset with confirmation
  const handleReset = useCallback(() => {
    // Clear any existing reset timer
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current)

    if (showConfirmReset) {
      resetIntake()
      setShowConfirmReset(false)
    } else {
      setShowConfirmReset(true)
      // Auto-hide confirmation after 3 seconds
      resetTimerRef.current = setTimeout(() => setShowConfirmReset(false), 3000)
    }
  }, [showConfirmReset, resetIntake])

  // Handle email submission
  const handleEmailSubmit = useCallback(async (formData: IEmailCaptureForm) => {
    try {
      logger.info('Submitting email capture', { email: formData.email })

      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          company: formData.company,
          source: 'intake',
          intakeData: aiTool && promptType ? {
            aiTool,
            promptType,
            userThoughts: userThoughts || ''
          } : undefined
        })
      })

      const data = await response.json() as ICreateLeadResponse

      if (!data.success || !data.leadId) {
        throw new Error(data.error || 'Failed to save lead')
      }

      // Store leadId in localStorage
      setStoredLeadId(data.leadId, formData.email)

      // Update UI state
      setCapturedEmail(formData.email)
      setEmailCaptured(true)
      setShowEmailModal(false)

      logger.info('Email captured successfully', { leadId: data.leadId })
    } catch (error) {
      logger.error('Email capture failed', error)
      throw error // Re-throw for modal to handle
    }
  }, [aiTool, promptType, userThoughts])

  // Handle continue after thank you message
  const handleThankYouContinue = useCallback(() => {
    setEmailCaptured(false)
  }, [])

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Email Capture Modal */}
      <EmailCaptureModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onSubmit={handleEmailSubmit}
        trigger="intake"
      />

      {/* Thank You Message (shown after successful email capture) */}
      {emailCaptured && (
        <div className="mb-8">
          <ThankYouMessage
            email={capturedEmail}
            onContinue={handleThankYouContinue}
          />
        </div>
      )}

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

      {/* Copy error message */}
      {copyError && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">{copyError}</p>
        </div>
      )}

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

      {/* Next Steps Section */}
      <div className="mb-8">
        <div className="bg-gradient-to-br from-optimi-blue/5 to-optimi-green/5 rounded-xl border border-optimi-blue/20 p-6">
          <h3 className="font-semibold text-optimi-gray mb-4 flex items-center gap-2">
            <ArrowRight className="w-5 h-5 text-optimi-blue" />
            Next Steps
          </h3>

          <ol className="space-y-3">
            {getNextSteps(aiTool, promptType).map((step, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-optimi-blue/10 text-optimi-blue text-sm font-medium flex items-center justify-center">
                  {index + 1}
                </span>
                <span className="text-gray-700 pt-0.5">{step}</span>
              </li>
            ))}
          </ol>

          {/* Quick link to AI tool */}
          {aiTool && (
            <div className="mt-6 pt-4 border-t border-optimi-blue/10">
              <a
                href={getAiToolUrl(aiTool)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-optimi-blue text-white font-medium hover:bg-optimi-blue/90 transition-colors"
              >
                Open {getAiToolDisplayName(aiTool)}
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
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
              : 'bg-optimi-gray text-white hover:bg-optimi-gray/90'
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
