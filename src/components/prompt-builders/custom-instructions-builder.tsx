'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, Copy, User, Target, Settings, Zap, BookOpen, Shield } from 'lucide-react'
import { logger } from '@/lib/logger'

interface ICustomInstructionsData {
  identity: string
  expertise: string
  communication: string
  decision_framework: string
  constraints: string
  examples: string
}

interface ICustomInstructionsBuilderProps {
  onComplete: (prompt: string) => void
  onClose: () => void
}

const CUSTOM_INSTRUCTION_COMPONENTS = [
  {
    key: 'identity' as keyof ICustomInstructionsData,
    icon: User,
    title: 'Your Identity & Role',
    description: 'Who are you and what do you do?',
    placeholder: 'e.g., "I am a marketing manager at a B2B SaaS company. I manage a team of 5 and focus on demand generation."',
    guidance: 'Be specific about your role, industry, team size, and main responsibilities. This helps the AI understand your perspective.',
    examples: [
      'I am a product manager at a fintech startup. I work closely with engineering and design to build features for small business owners.',
      'I am a content creator who runs a YouTube channel about productivity. I create weekly videos and manage multiple social media accounts.',
      'I am a sales director at a manufacturing company. I lead a team of 12 reps and focus on enterprise accounts in the automotive industry.'
    ]
  },
  {
    key: 'expertise' as keyof ICustomInstructionsData,
    icon: Target,
    title: 'Your Expertise & Knowledge',
    description: 'What do you know well, and what do you need help with?',
    placeholder: 'e.g., "Strong in: strategy, analytics, team leadership. Need help with: technical implementation, creative campaigns"',
    guidance: 'List your strengths and areas where you need AI assistance. This helps the AI calibrate its responses appropriately.',
    examples: [
      'Expertise: Market research, competitive analysis, customer segmentation. Need help with: Creative writing, technical documentation, data visualization.',
      'Strong in: Project planning, stakeholder management, risk assessment. Need help with: Financial modeling, technical architecture decisions.',
      'Experience with: Content strategy, SEO, email marketing. Need assistance with: Paid advertising, conversion optimization, advanced analytics.'
    ]
  },
  {
    key: 'communication' as keyof ICustomInstructionsData,
    icon: BookOpen,
    title: 'Communication Style',
    description: 'How do you prefer to receive information?',
    placeholder: 'e.g., "Prefer: bullet points, concrete examples, action-oriented. Avoid: long paragraphs, theoretical concepts"',
    guidance: 'Define your preferred communication style, format, and level of detail. Include what you want to avoid.',
    examples: [
      'Prefer: Concise bullet points, data-backed recommendations, practical next steps. Avoid: Overly theoretical explanations, long introductions.',
      'Style: Professional but conversational, include relevant examples, provide both high-level and detailed views. Avoid: Jargon without explanation.',
      'Format: Structured responses with clear sections, include pros/cons for decisions, always provide implementation timelines. Avoid: Vague suggestions.'
    ]
  },
  {
    key: 'decision_framework' as keyof ICustomInstructionsData,
    icon: Settings,
    title: 'Decision-Making Framework',
    description: 'How do you make decisions and evaluate options?',
    placeholder: 'e.g., "Always consider: ROI, implementation effort, team impact. Decision criteria: data-driven, scalable, aligns with Q4 goals"',
    guidance: 'Describe your decision-making process, key criteria, and what factors are most important to you.',
    examples: [
      'Decision factors: Customer impact, technical feasibility, resource requirements. Process: Gather data, evaluate options, consider stakeholder input, make decision within 48 hours.',
      'Key criteria: Revenue impact, brand alignment, competitive advantage. Framework: Cost-benefit analysis, risk assessment, timeline considerations.',
      'Evaluation process: User research, A/B testing potential, development complexity. Priority: Customer satisfaction > short-term revenue > internal efficiency.'
    ]
  },
  {
    key: 'constraints' as keyof ICustomInstructionsData,
    icon: Shield,
    title: 'Constraints & Boundaries',
    description: 'What limitations should the AI always consider?',
    placeholder: 'e.g., "Budget: $50K quarterly, Team: 3 people, Compliance: GDPR required, Timeline: quarterly planning cycles"',
    guidance: 'Define budget limits, team size, regulatory requirements, timelines, and other constraints that always apply.',
    examples: [
      'Budget constraints: $25K per quarter for tools/campaigns. Team: 2 full-time, 1 contractor. Compliance: Healthcare regulations (HIPAA). Timeline: Monthly reporting cycles.',
      'Resource limits: 5-person engineering team, 2-week sprints. Technical: Must work with existing React/Node stack. Business: B2B focus only, enterprise customers.',
      'Operational constraints: Remote team across 3 time zones. Budget: Cost-conscious, ROI required within 6 months. Regulatory: Financial services compliance required.'
    ]
  },
  {
    key: 'examples' as keyof ICustomInstructionsData,
    icon: Zap,
    title: 'Success Examples',
    description: 'What are examples of great responses you\'ve received?',
    placeholder: 'e.g., "Best responses include specific metrics, 3-5 actionable recommendations, and implementation steps with owners"',
    guidance: 'Describe what excellent AI responses look like for you. This helps the AI understand your quality standards.',
    examples: [
      'Great responses: Include 3-5 specific recommendations with estimated impact, clear next steps with timelines, relevant industry examples or case studies.',
      'Ideal format: Executive summary, detailed analysis, actionable recommendations with difficulty scores, potential risks and mitigation strategies.',
      'Perfect responses: Answer the question directly, provide supporting data, include implementation considerations, suggest follow-up questions or next steps.'
    ]
  }
]

export default function CustomInstructionsBuilder({ onComplete, onClose }: ICustomInstructionsBuilderProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [data, setData] = useState<ICustomInstructionsData>({
    identity: '',
    expertise: '',
    communication: '',
    decision_framework: '',
    constraints: '',
    examples: ''
  })
  const [generatedInstructions, setGeneratedInstructions] = useState('')
  const [copied, setCopied] = useState(false)

  const currentComponent = CUSTOM_INSTRUCTION_COMPONENTS[currentStep]

  useEffect(() => {
    if (Object.values(data).some(value => value.trim())) {
      generateInstructions()
    }
  }, [data])

  const generateInstructions = () => {
    const instructions = `# Your AI Assistant Custom Instructions

## About Me:
${data.identity || '[Your identity and role]'}

## My Expertise & Knowledge:
${data.expertise || '[Your strengths and areas needing help]'}

## Communication Preferences:
${data.communication || '[How you prefer to receive information]'}

## Decision-Making Framework:
${data.decision_framework || '[How you evaluate options and make decisions]'}

## Constraints & Context:
${data.constraints || '[Budget, team, regulatory, and other limitations]'}

## Examples of Great Responses:
${data.examples || '[What excellent responses look like]'}

---

**Instructions for AI:**
Always consider the above context in your responses. Tailor your communication style, recommendations, and level of detail to match my preferences and constraints. When making suggestions, align them with my decision-making framework and respect my stated limitations.`

    setGeneratedInstructions(instructions)
  }

  const handleInputChange = (value: string) => {
    setData(prev => ({
      ...prev,
      [currentComponent.key]: value
    }))
  }

  const handleNext = () => {
    if (currentStep < CUSTOM_INSTRUCTION_COMPONENTS.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedInstructions)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      logger.error('Failed to copy instructions', err)
    }
  }

  const handleComplete = () => {
    onComplete(generatedInstructions)
    onClose()
  }

  const isCurrentStepComplete = data[currentComponent.key].trim().length > 10
  const isAllComplete = Object.values(data).some(value => value.trim().length > 10)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-4xl h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="bg-optimi-primary text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Custom Instructions Builder</h2>
              <p className="text-blue-100 mt-1">Create persistent AI behavior for ChatGPT & Claude</p>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90">Step {currentStep + 1} of {CUSTOM_INSTRUCTION_COMPONENTS.length}</div>
              <div className="w-32 h-2 bg-blue-400 rounded-full mt-2">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / CUSTOM_INSTRUCTION_COMPONENTS.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Current Step */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-2xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-optimi-primary rounded-full flex items-center justify-center">
                  <currentComponent.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-optimi-gray">{currentComponent.title}</h3>
                  <p className="text-optimi-gray">{currentComponent.description}</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="bg-blue-50 border-l-4 border-optimi-primary p-4 rounded-r-lg mb-4">
                  <h4 className="font-medium text-optimi-primary mb-2">💡 Pro Tip:</h4>
                  <p className="text-sm text-optimi-gray">{currentComponent.guidance}</p>
                </div>
              </div>

              <textarea
                value={data[currentComponent.key]}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={currentComponent.placeholder}
                className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-optimi-primary focus:border-transparent resize-none text-sm"
              />

              {/* Examples */}
              <div className="mt-6">
                <h4 className="font-medium text-optimi-gray mb-3">✨ Examples:</h4>
                <div className="space-y-2">
                  {currentComponent.examples.map((example, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-3 rounded-lg text-sm text-optimi-gray cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleInputChange(example)}
                    >
                      {example}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Live Preview */}
          <div className="w-80 bg-gray-50 border-l border-gray-200 p-6 overflow-y-auto">
            <h3 className="font-semibold text-optimi-gray mb-4">Live Preview</h3>
            
            {/* Component Status */}
            <div className="space-y-2 mb-6">
              {CUSTOM_INSTRUCTION_COMPONENTS.map((component, index) => (
                <div key={component.key} className="flex items-center space-x-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                    data[component.key].trim().length > 10 
                      ? 'bg-green-500' 
                      : index === currentStep 
                        ? 'bg-optimi-primary' 
                        : 'bg-gray-300'
                  }`}>
                    {data[component.key].trim().length > 10 && (
                      <CheckCircle className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span className={`text-sm ${
                    index === currentStep ? 'font-medium text-optimi-primary' : 'text-optimi-gray'
                  }`}>
                    {component.title}
                  </span>
                </div>
              ))}
            </div>

            {/* Platform Compatibility */}
            <div className="bg-green-50 p-3 rounded-lg mb-4">
              <h4 className="font-medium text-green-800 mb-2">✅ Works on:</h4>
              <div className="space-y-1 text-sm text-green-700">
                <div>• ChatGPT (Pro required)</div>
                <div>• Claude (Pro required)</div>
                <div>• Custom GPTs</div>
              </div>
            </div>

            {/* Generated Instructions Preview */}
            {generatedInstructions && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-optimi-gray">Your Instructions:</h4>
                  <button
                    onClick={handleCopy}
                    className="flex items-center space-x-1 text-xs text-optimi-primary hover:text-optimi-blue"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <div className="bg-white p-3 rounded-lg border text-xs text-optimi-gray max-h-60 overflow-y-auto whitespace-pre-wrap">
                  {generatedInstructions}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="px-4 py-2 text-optimi-gray hover:text-optimi-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 text-optimi-gray hover:text-optimi-primary"
            >
              Cancel
            </button>
            
            {currentStep === CUSTOM_INSTRUCTION_COMPONENTS.length - 1 ? (
              <button
                onClick={handleComplete}
                disabled={!isAllComplete}
                className="px-6 py-2 bg-optimi-primary hover:bg-optimi-primary/90 disabled:bg-gray-300 text-white rounded-lg font-medium"
              >
                Complete & Copy Instructions
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!isCurrentStepComplete}
                className="px-6 py-2 bg-optimi-primary hover:bg-optimi-primary/90 disabled:bg-gray-300 text-white rounded-lg font-medium"
              >
                Next Step
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}