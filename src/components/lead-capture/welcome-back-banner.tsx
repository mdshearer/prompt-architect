'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface WelcomeBackBannerProps {
  email: string
  lastPrompt?: string
  onContinue: () => void
}

export default function WelcomeBackBanner({
  email,
  lastPrompt,
  onContinue
}: WelcomeBackBannerProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  const handleDismiss = () => {
    setIsVisible(false)
  }

  return (
    <div className="bg-gradient-to-r from-optimi-blue/10 to-optimi-green/10 border border-optimi-blue/20 rounded-lg p-4 mb-6 relative">
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 text-optimi-gray hover:text-optimi-primary transition-colors"
        aria-label="Dismiss banner"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="pr-8">
        <h3 className="text-lg font-semibold text-optimi-primary mb-1">
          Welcome back! 👋
        </h3>

        <p className="text-sm text-optimi-gray mb-3">
          Signed in as <strong>{email}</strong>
        </p>

        {lastPrompt && (
          <p className="text-sm text-optimi-gray mb-3">
            Last prompt: <span className="italic">{lastPrompt.slice(0, 60)}...</span>
          </p>
        )}

        <button
          onClick={onContinue}
          className="bg-optimi-blue hover:bg-optimi-primary text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
