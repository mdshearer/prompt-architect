'use client'

import { useState } from 'react'
import type { IEmailCaptureForm } from '@/types/lead'
import { X } from 'lucide-react'

interface EmailCaptureModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (formData: IEmailCaptureForm) => Promise<void>
  trigger: 'intake' | 'limit' | 'export'
}

export default function EmailCaptureModal({
  isOpen,
  onClose,
  onSubmit,
  trigger
}: EmailCaptureModalProps) {
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await onSubmit({ email, company: company || undefined })
      // Success - parent component will handle closing and showing success
    } catch (err) {
      setError('Failed to save. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Different copy based on trigger point
  const getHeaderText = () => {
    switch (trigger) {
      case 'intake':
        return '✨ Your Custom Prompt is Ready!'
      case 'limit':
        return '🎯 Want Unlimited Access?'
      case 'export':
        return '📧 Email This Prompt to Yourself'
    }
  }

  const getSubheadText = () => {
    switch (trigger) {
      case 'intake':
        return 'Want to save this and create unlimited prompts?'
      case 'limit':
        return "You've used your 3 free messages. Get unlimited access:"
      case 'export':
        return "We'll send this prompt to your email and save it to your library:"
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md mx-4 mb-0 sm:mb-4 shadow-2xl">
        {/* Header accent */}
        <div className="h-2 bg-gradient-to-r from-optimi-blue to-optimi-green rounded-t-2xl" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-optimi-gray hover:text-optimi-primary transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-optimi-primary mb-2">
            {getHeaderText()}
          </h2>
          <p className="text-optimi-gray mb-6">
            {getSubheadText()}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-optimi-gray mb-1">
                Email address *
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                autoFocus
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-optimi-blue focus:border-optimi-blue text-lg"
              />
            </div>

            {/* Company input (optional) */}
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-optimi-gray mb-1">
                Company name (optional)
              </label>
              <input
                type="text"
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Acme Corp"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-optimi-blue focus:border-optimi-blue"
              />
            </div>

            {/* Error message */}
            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}

            {/* Benefits */}
            <div className="bg-optimi-blue/5 rounded-lg p-4 space-y-2">
              <p className="text-sm text-optimi-gray flex items-center gap-2">
                <span className="text-optimi-green">✓</span> Access on any device
              </p>
              <p className="text-sm text-optimi-gray flex items-center gap-2">
                <span className="text-optimi-green">✓</span> Never lose your work
              </p>
              <p className="text-sm text-optimi-gray flex items-center gap-2">
                <span className="text-optimi-green">✓</span> No spam, ever
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-optimi-blue hover:bg-optimi-primary text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : 'Save My Prompts'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="sm:flex-none border border-optimi-gray text-optimi-gray hover:bg-gray-50 font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Maybe Later
              </button>
            </div>

            {/* Privacy note */}
            <p className="text-xs text-center text-gray-500">
              By providing your email, you agree to receive prompt-related updates from Optimi.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
