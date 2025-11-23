'use client'

import { CheckCircle } from 'lucide-react'

interface ThankYouMessageProps {
  email: string
  onContinue: () => void
}

export default function ThankYouMessage({ email, onContinue }: ThankYouMessageProps) {
  return (
    <div className="text-center space-y-4 p-6">
      <div className="flex justify-center">
        <CheckCircle className="w-16 h-16 text-optimi-green" />
      </div>

      <h3 className="text-2xl font-bold text-optimi-primary">
        All Set! 🎉
      </h3>

      <p className="text-optimi-gray">
        Your prompts are now saved to <strong>{email}</strong>
      </p>

      <p className="text-sm text-optimi-gray">
        You now have unlimited access to all features.
      </p>

      <button
        onClick={onContinue}
        className="bg-optimi-blue hover:bg-optimi-primary text-white font-semibold py-3 px-8 rounded-lg transition-colors"
      >
        Continue Creating Prompts
      </button>
    </div>
  )
}
