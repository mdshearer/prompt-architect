'use client'

/**
 * Homepage with Onboarding Intake Flow
 *
 * The main entry point for Prompt Architect. Shows the intake flow for new users
 * and a "Continue" option for returning users who have completed intake.
 *
 * Flow:
 * - New users: 3-step intake flow -> Generated output
 * - Returning users: Option to continue previous session or start over
 *
 * @module page
 */

import { useState, useEffect } from 'react'
import { IntakeProvider, useIntake } from '@/components/onboarding/intake-context'
import IntakeFlow from '@/components/onboarding/intake-flow'
import ChatContainer from '@/components/chat/chat-container'
import WelcomeBackBanner from '@/components/lead-capture/welcome-back-banner'
import { getCookie } from '@/lib/cookie-manager'
import { getStoredLeadData } from '@/lib/lead-storage'
import { getAiToolDisplayName, getPromptTypeLabel } from '@/lib/intake-helpers'
import type { IntakeCookie } from '@/types/intake'
import type { PromptCategory } from '@/types/chat'
import { ArrowRight, RotateCcw, Sparkles, MessageSquare, Bot, Gem, Laptop } from 'lucide-react'

/**
 * Inner content component that uses the intake context
 */
function HomeContent() {
  const { intakeCompleted, output, resetIntake, aiTool, promptType } = useIntake()
  const [showChat, setShowChat] = useState(false)
  const [existingSession, setExistingSession] = useState<IntakeCookie | null>(null)
  const [returningUserEmail, setReturningUserEmail] = useState<string | null>(null)

  // Check for existing session and lead data on mount
  useEffect(() => {
    const cookie = getCookie()
    if (cookie && cookie.intakeCompleted) {
      setExistingSession(cookie)
    }

    // Check if user has captured email (returning user)
    const leadData = getStoredLeadData()
    if (leadData) {
      setReturningUserEmail(leadData.email)
    }
  }, [])

  // Map prompt types to chat categories
  const getChatCategory = (): PromptCategory => {
    if (!promptType) return 'custom_instructions'

    switch (promptType) {
      case 'custom-instructions':
        return 'custom_instructions'
      case 'projects':
      case 'gems':
      case 'prompt-architect':
        return 'projects_gems'
      default:
        return 'threads'
    }
  }

  // If showing chat (returning user continuing or after intake completion)
  if (showChat) {
    return (
      <ChatContainer
        category={getChatCategory()}
        onClose={() => setShowChat(false)}
      />
    )
  }

  // If intake is completed and we have output, show success state with options
  if (intakeCompleted && output) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <CompactHeader />

          <div className="max-w-4xl mx-auto">
            {/* Show the output display from intake flow */}
            <IntakeFlow />

            {/* Additional action buttons */}
            <div className="text-center mt-8 pb-8">
              <button
                onClick={() => setShowChat(true)}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-optimi-blue text-white font-semibold hover:bg-optimi-blue/90 transition-colors"
              >
                <Sparkles className="w-5 h-5" />
                Continue to Chat
                <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-sm text-gray-500 mt-3">
                Get additional help refining your prompt
              </p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  // If returning user with existing completed session (output not stored, so go to chat)
  if (existingSession) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <CompactHeader />

          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-optimi-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-optimi-primary" />
              </div>

              <h2 className="text-2xl font-bold text-optimi-gray mb-3">
                Welcome Back!
              </h2>
              <p className="text-gray-600 mb-6">
                You have an existing session for{' '}
                <span className="font-semibold">
                  {getAiToolDisplayName(existingSession.aiTool)}
                </span>
                {' - '}
                <span className="font-semibold">
                  {getPromptTypeLabel(existingSession.promptType, existingSession.aiTool)}
                </span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    setExistingSession(null)
                    setShowChat(true)
                  }}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-optimi-primary text-white font-semibold hover:bg-optimi-primary/90 transition-colors"
                >
                  <ArrowRight className="w-5 h-5" />
                  Continue to Chat
                </button>

                <button
                  onClick={() => {
                    resetIntake()
                    setExistingSession(null)
                  }}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                  Start Fresh
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  // Default: Show the intake flow with hero section
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <HeroSection />

        {/* Welcome back banner for returning users */}
        {returningUserEmail && (
          <div className="max-w-4xl mx-auto mb-6">
            <WelcomeBackBanner
              email={returningUserEmail}
              onContinue={() => setShowChat(true)}
            />
          </div>
        )}

        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <IntakeFlow />
        </div>

        {/* Free tier notice */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center space-x-3 text-sm text-gray-500 bg-white px-5 py-3 rounded-full shadow-sm border border-gray-100">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-optimi-green" />
              Intake is free
            </span>
            <span className="text-gray-300">•</span>
            <span>3 follow-up chats included</span>
          </div>
        </div>
      </div>
    </main>
  )
}

/**
 * AI tool icons for the supported tools section
 */
const SUPPORTED_TOOLS = [
  { name: 'ChatGPT', icon: MessageSquare, color: 'text-green-600' },
  { name: 'Claude', icon: Bot, color: 'text-orange-500' },
  { name: 'Gemini', icon: Gem, color: 'text-blue-500' },
  { name: 'Copilot', icon: Laptop, color: 'text-cyan-600' }
]

/**
 * Hero section component for the landing page
 * Features the main tagline, value prop, and supported tools
 */
function HeroSection({ showCta = false, onCtaClick }: { showCta?: boolean; onCtaClick?: () => void }) {
  return (
    <header className="text-center mb-12">
      {/* Logo/Brand */}
      <div className="mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-optimi-primary to-optimi-blue mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <p className="text-sm font-medium text-optimi-primary tracking-wider uppercase">
          Prompt Architect
        </p>
      </div>

      {/* Main Tagline */}
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
        Stop Guessing.{' '}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-optimi-primary to-optimi-blue">
          Start Architecting.
        </span>
      </h1>

      {/* Value Proposition */}
      <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
        Build structured, high-performance prompts for any AI model
        by answering simple questions.
      </p>

      {/* CTA Button (optional) */}
      {showCta && onCtaClick && (
        <button
          onClick={onCtaClick}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-optimi-primary text-white font-semibold text-lg hover:bg-optimi-primary/90 transition-all hover:scale-105 shadow-lg shadow-optimi-primary/25"
        >
          Start Building Your First Prompt
          <ArrowRight className="w-5 h-5" />
        </button>
      )}

      {/* Supported Tools */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <p className="text-sm text-gray-500 mb-4">Supported AI Tools</p>
        <div className="flex items-center justify-center gap-8 flex-wrap">
          {SUPPORTED_TOOLS.map((tool) => (
            <div key={tool.name} className="flex items-center gap-2 text-gray-600">
              <tool.icon className={`w-5 h-5 ${tool.color}`} />
              <span className="font-medium">{tool.name}</span>
            </div>
          ))}
        </div>
      </div>
    </header>
  )
}

/**
 * Compact header for pages after initial landing
 */
function CompactHeader() {
  return (
    <header className="text-center mb-8">
      <div className="inline-flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-optimi-primary to-optimi-blue flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Prompt Architect</h1>
      </div>
    </header>
  )
}

/**
 * Main homepage component with IntakeProvider wrapper
 */
export default function Home() {
  return (
    <IntakeProvider>
      <HomeContent />
    </IntakeProvider>
  )
}
