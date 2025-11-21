'use client'

/**
 * Example Output Modal Component
 *
 * Shows an example of what the Prompt Architect output looks like
 * for the selected AI tool. Helps users understand what they'll receive.
 *
 * Features:
 * - Lazy loads example content on open
 * - Click-outside-to-close
 * - Copy button for example content
 * - Loading and error states
 *
 * @module example-output-modal
 */

import { useState, useEffect, useCallback } from 'react'
import type { AiTool } from '@/types/intake'
import { getAiToolDisplayName } from '@/lib/intake-helpers'
import { getExampleOutput } from '@/lib/example-outputs'
import { X, Copy, Check } from 'lucide-react'

interface ExampleOutputModalProps {
  /** Whether the modal is open */
  isOpen: boolean
  /** Callback to close the modal */
  onClose: () => void
  /** The selected AI tool (determines which example to show) */
  aiTool: AiTool | null
}

/**
 * Modal displaying example Prompt Architect output
 *
 * @example
 * <ExampleOutputModal
 *   isOpen={showModal}
 *   onClose={() => setShowModal(false)}
 *   aiTool="chatgpt"
 * />
 */
export default function ExampleOutputModal({
  isOpen,
  onClose,
  aiTool
}: ExampleOutputModalProps) {
  const [copied, setCopied] = useState(false)

  // Get example content synchronously (no loading needed)
  const content = aiTool ? getExampleOutput(aiTool) : ''

  // Reset copied state when closing
  useEffect(() => {
    if (!isOpen) {
      setCopied(false)
    }
  }, [isOpen])

  // Handle copy to clipboard
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }, [content])

  // Handle click outside to close
  const handleOverlayClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }, [onClose])

  // Handle escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Don't render if not open
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-optimi-gray">
            Example Output for {aiTool ? getAiToolDisplayName(aiTool) : 'AI Tool'}
          </h3>
          <div className="flex items-center gap-2">
            {/* Copy button */}
            <button
              onClick={handleCopy}
              disabled={!content}
              className={`
                inline-flex items-center gap-2 px-3 py-1.5 rounded-lg
                text-sm font-medium transition-colors
                ${copied
                  ? 'bg-optimi-green/10 text-optimi-green'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="prose prose-sm max-w-none">
            {/* Render example content as formatted text */}
            <div className="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-4 rounded-lg">
              {content}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 rounded-b-2xl">
          <p className="text-sm text-gray-500 text-center">
            This is an example of what your personalized output will look like.
            Your actual output will be customized based on your specific needs.
          </p>
        </div>
      </div>
    </div>
  )
}
