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
      <main className="min-h-screen bg-gradient-to-b from-[#283791] to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <CompactHeader />

          <div className="max-w-4xl mx-auto">
            {/* Show the output display from intake flow */}
            <IntakeFlow />

            {/* Additional action buttons */}
            <div className="text-center mt-8 pb-8">
              <button
                onClick={() => setShowChat(true)}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-[#FFDC00] to-[#00C896] text-[#283791] font-semibold hover:shadow-lg hover:shadow-[#00C896]/50 transition-all hover:scale-105"
              >
                <Sparkles className="w-5 h-5" />
                Continue to Chat
                <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-sm text-white/70 mt-3">
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
      <main className="min-h-screen bg-gradient-to-b from-[#283791] to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <CompactHeader />

          <div className="max-w-2xl mx-auto">
            <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-8 text-center border border-[#0078FF]/20">
              <div className="w-16 h-16 bg-gradient-to-br from-[#0078FF] to-[#00C896] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>

              <h2 className="text-2xl font-bold text-[#464650] mb-3">
                Welcome Back!
              </h2>
              <p className="text-gray-700 mb-6">
                You have an existing session for{' '}
                <span className="font-semibold text-[#283791]">
                  {getAiToolDisplayName(existingSession.aiTool)}
                </span>
                {' - '}
                <span className="font-semibold text-[#283791]">
                  {getPromptTypeLabel(existingSession.promptType, existingSession.aiTool)}
                </span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    setExistingSession(null)
                    setShowChat(true)
                  }}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#0078FF] to-[#00C896] text-white font-semibold hover:shadow-lg hover:shadow-[#00C896]/50 transition-all hover:scale-105"
                >
                  <ArrowRight className="w-5 h-5" />
                  Continue to Chat
                </button>

                <button
                  onClick={() => {
                    resetIntake()
                    setExistingSession(null)
                  }}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#FFDC00]/20 text-[#283791] font-semibold hover:bg-[#FFDC00]/30 transition-colors border border-[#FFDC00]/50"
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
    <main className="min-h-screen bg-gradient-to-b from-[#283791] via-[#1e2a6e] to-[#161d4d] relative overflow-hidden">
      {/* Background Decorations */}
      <BackgroundDecorations />

      <div className="container mx-auto px-4 py-8 relative z-10">
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

        {/* Main content area with card and character */}
        <div className="flex items-center justify-center gap-4 lg:gap-8">
          {/* White card container */}
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden">
            <IntakeFlow />
          </div>

          {/* Character illustration - hidden on smaller screens */}
          <div className="hidden lg:block flex-shrink-0">
            <CharacterIllustration />
          </div>
        </div>

        {/* Free tier notice */}
        <div className="text-center mt-8 pb-4">
          <div className="inline-flex items-center space-x-2 text-sm text-white/80 bg-white/10 backdrop-blur px-5 py-3 rounded-full shadow-sm border border-white/20 hover:bg-white/15 transition-colors">
            <span className="w-2 h-2 rounded-full bg-[#00C896] animate-pulse" />
            <span>Create 3 prompts for free. No login.</span>
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
 * Clean, simple headline matching the mockup design
 */
function HeroSection() {
  return (
    <header className="text-center mb-10">
      {/* Main Tagline - Bold and Simple */}
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
        Stop Guessing. Start Architecting.
      </h1>
    </header>
  )
}

/**
 * Background decorations component
 * Renders floating stars, circles, and geometric shapes
 */
function BackgroundDecorations() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Yellow 4-point stars */}
      <svg className="absolute top-[10%] left-[8%] w-8 h-8 text-[#FFDC00]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
      </svg>
      <svg className="absolute top-[15%] left-[25%] w-12 h-12 text-[#FFDC00]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
      </svg>
      <svg className="absolute top-[8%] right-[30%] w-14 h-14 text-[#FFDC00]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
      </svg>
      <svg className="absolute top-[12%] right-[12%] w-16 h-16 text-[#FFDC00]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
      </svg>
      <svg className="absolute top-[45%] left-[5%] w-20 h-20 text-[#FFDC00]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
      </svg>
      <svg className="absolute bottom-[20%] left-[15%] w-10 h-10 text-[#FFDC00]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
      </svg>
      <svg className="absolute top-[35%] right-[8%] w-10 h-10 text-[#FFDC00]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
      </svg>
      <svg className="absolute bottom-[15%] right-[20%] w-14 h-14 text-[#FFDC00]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
      </svg>
      <svg className="absolute bottom-[30%] left-[40%] w-6 h-6 text-[#FFDC00]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
      </svg>

      {/* Green circles (outlines) */}
      <div className="absolute top-[28%] left-[18%] w-10 h-10 rounded-full border-2 border-[#00C896]" />
      <div className="absolute top-[30%] left-[35%] w-14 h-14 rounded-full border-2 border-[#00C896]" />
      <div className="absolute top-[38%] right-[25%] w-12 h-12 rounded-full border-2 border-[#00C896]" />
      <div className="absolute bottom-[25%] right-[35%] w-16 h-16 rounded-full border-2 border-[#00C896]" />
      <div className="absolute top-[55%] right-[15%] w-10 h-10 rounded-full border-2 border-[#00C896]" />

      {/* Green triangles (outlines) */}
      <svg className="absolute top-[35%] left-[8%] w-8 h-8 text-[#00C896]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L22 20H2L12 2Z" />
      </svg>
      <svg className="absolute top-[18%] right-[40%] w-10 h-10 text-[#00C896]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 19L12 5L19 19H5Z" />
      </svg>
      <svg className="absolute bottom-[18%] right-[12%] w-12 h-12 text-[#00C896]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L22 20H2L12 2Z" />
      </svg>

      {/* White corner accents */}
      <div className="absolute top-[5%] left-[5%] w-16 h-16">
        <div className="absolute top-0 left-0 w-8 h-0.5 bg-white/40" />
        <div className="absolute top-0 left-0 w-0.5 h-8 bg-white/40" />
      </div>
      <div className="absolute top-[5%] right-[5%] w-16 h-16">
        <div className="absolute top-0 right-0 w-8 h-0.5 bg-white/40" />
        <div className="absolute top-0 right-0 w-0.5 h-8 bg-white/40" />
      </div>
      <div className="absolute bottom-[5%] left-[5%] w-16 h-16">
        <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-white/40" />
        <div className="absolute bottom-0 left-0 w-0.5 h-8 bg-white/40" />
      </div>
      <div className="absolute bottom-[5%] right-[5%] w-16 h-16">
        <div className="absolute bottom-0 right-0 w-8 h-0.5 bg-white/40" />
        <div className="absolute bottom-0 right-0 w-0.5 h-8 bg-white/40" />
      </div>

      {/* Additional small stars scattered */}
      <svg className="absolute bottom-[40%] left-[25%] w-5 h-5 text-[#FFDC00]/70" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
      </svg>
      <svg className="absolute top-[50%] right-[5%] w-6 h-6 text-[#FFDC00]/60" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
      </svg>
    </div>
  )
}

/**
 * Character illustration component
 * Shows the architect character with blueprints
 */
function CharacterIllustration() {
  return (
    <div className="relative w-[200px] h-[350px]">
      {/* Small sparkles around the character */}
      <svg className="absolute top-4 right-4 w-6 h-6 text-[#FFDC00]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
      </svg>
      <svg className="absolute top-12 left-2 w-4 h-4 text-[#FFDC00]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
      </svg>
      <svg className="absolute bottom-20 right-8 w-5 h-5 text-[#FFDC00]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
      </svg>

      {/* Green circle accent */}
      <div className="absolute bottom-32 left-0 w-8 h-8 rounded-full border-2 border-[#00C896]" />

      {/* Character SVG - Stylized architect figure */}
      <svg className="w-full h-full" viewBox="0 0 200 350" fill="none">
        {/* Body/Torso - Green shirt */}
        <ellipse cx="100" cy="180" rx="55" ry="65" fill="#22C55E" />

        {/* Head */}
        <circle cx="100" cy="80" r="45" fill="#F5D0B0" />

        {/* Hair */}
        <path d="M60 65 Q65 30, 100 25 Q135 30, 140 65 Q140 50, 130 45 Q120 40, 100 38 Q80 40, 70 45 Q60 50, 60 65" fill="#1F2937" />

        {/* Face features */}
        <ellipse cx="85" cy="75" rx="3" ry="4" fill="#1F2937" />
        <ellipse cx="115" cy="75" rx="3" ry="4" fill="#1F2937" />
        <path d="M90 95 Q100 102, 110 95" stroke="#C4A484" strokeWidth="2" fill="none" strokeLinecap="round" />

        {/* Neck */}
        <rect x="85" y="115" width="30" height="20" fill="#F5D0B0" />

        {/* Left arm (gesturing) */}
        <path d="M45 160 Q20 140, 25 110" stroke="#F5D0B0" strokeWidth="18" fill="none" strokeLinecap="round" />
        <circle cx="25" cy="105" r="12" fill="#F5D0B0" />

        {/* Right arm (holding blueprints) */}
        <path d="M155 160 Q175 180, 170 220" stroke="#F5D0B0" strokeWidth="18" fill="none" strokeLinecap="round" />

        {/* Blueprint roll */}
        <rect x="130" y="180" width="60" height="20" rx="10" fill="#3B82F6" transform="rotate(-30 130 180)" />
        <rect x="125" y="175" width="15" height="25" rx="7" fill="#60A5FA" transform="rotate(-30 125 175)" />
        <ellipse cx="175" cy="210" rx="8" ry="10" fill="#93C5FD" transform="rotate(-30 175 210)" />

        {/* Pants */}
        <path d="M60 230 L50 340 L80 340 L100 260 L120 340 L150 340 L140 230" fill="#374151" />

        {/* Shoes */}
        <ellipse cx="65" cy="345" rx="18" ry="8" fill="#1F2937" />
        <ellipse cx="135" cy="345" rx="18" ry="8" fill="#1F2937" />
      </svg>
    </div>
  )
}

/**
 * Compact header for pages after initial landing
 */
function CompactHeader() {
  return (
    <header className="text-center mb-8">
      <div className="inline-flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0078FF] to-[#00C896] flex items-center justify-center shadow-lg shadow-[#0078FF]/50">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white">Prompt Architect</h1>
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
