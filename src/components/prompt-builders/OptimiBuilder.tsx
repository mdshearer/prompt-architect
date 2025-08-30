'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, Copy, Download, Zap, Target, User, List, Database, TrendingUp, Puzzle } from 'lucide-react'

interface OptimiData {
  objective: string
  persona: string
  task: string
  input: string
  measurement: string
  integration: string
}

interface OptimiBuilderProps {
  onComplete: (prompt: string) => void
  onClose: () => void
  category: string
}

const OPTIMI_COMPONENTS = [
  {
    key: 'objective' as keyof OptimiData,
    icon: Target,
    title: 'Objective',
    description: 'What specific outcome do you want to achieve?',
    placeholder: 'e.g., "Create a comprehensive content strategy that increases engagement by 25% over the next quarter"',
    guidance: 'Be specific, measurable, and time-bound. Avoid vague goals like "help with marketing."',
    examples: [
      'Analyze Q3 sales data to identify the top 3 growth opportunities for Q4',
      'Write a 1,500-word blog post that converts readers into email subscribers',
      'Create a project timeline that delivers our MVP 2 weeks ahead of schedule'
    ]
  },
  {
    key: 'persona' as keyof OptimiData,
    icon: User,
    title: 'Persona',
    description: 'Who should the AI become to help you best?',
    placeholder: 'e.g., "Act as a senior marketing strategist with 10+ years of B2B SaaS experience"',
    guidance: 'Define expertise level, industry knowledge, and communication style. Be specific about the type of expert you need.',
    examples: [
      'Act as a data analyst with expertise in retail analytics and customer behavior',
      'Be a creative director who specializes in brand storytelling for tech startups',
      'Function as a project manager experienced in agile software development'
    ]
  },
  {
    key: 'task' as keyof OptimiData,
    icon: List,
    title: 'Task',
    description: 'What specific steps should the AI take?',
    placeholder: 'e.g., "1. Analyze the data for trends 2. Identify key insights 3. Recommend 3 actionable strategies"',
    guidance: 'Break down the work into clear, sequential steps. Number them for clarity.',
    examples: [
      '1. Review the campaign performance data\n2. Compare against industry benchmarks\n3. Identify top 3 underperforming areas\n4. Suggest specific optimization tactics',
      '1. Analyze the user feedback themes\n2. Prioritize issues by frequency and impact\n3. Create a roadmap for addressing top 5 issues',
      '1. Research competitor positioning\n2. Identify gaps in their messaging\n3. Develop unique value propositions for each gap'
    ]
  },
  {
    key: 'input' as keyof OptimiData,
    icon: Database,
    title: 'Input',
    description: 'What context, data, or constraints should the AI consider?',
    placeholder: 'e.g., "Budget: $50K, Timeline: 8 weeks, Target audience: B2B decision makers, Brand guidelines attached"',
    guidance: 'Include all relevant context: budget, timeline, audience, constraints, resources, and any data you\'ll provide.',
    examples: [
      'Budget: $25K, Timeline: 6 weeks, Audience: SMB owners aged 35-55, Competitors: [list], Current conversion rate: 2.1%',
      'Team size: 5 developers, Tech stack: React/Node.js, Deadline: Q1 launch, Performance requirements: <3s load time',
      'Industry: Healthcare, Compliance: HIPAA required, Audience: Medical professionals, Tone: Professional but approachable'
    ]
  },
  {
    key: 'measurement' as keyof OptimiData,
    icon: TrendingUp,
    title: 'Measurement',
    description: 'How will you know this is successful?',
    placeholder: 'e.g., "Success = Clear actionable recommendations + ROI projections + implementation timeline"',
    guidance: 'Define specific success criteria, quality standards, and deliverable requirements.',
    examples: [
      'Success = 3-5 specific recommendations with estimated impact, implementation difficulty scores, and resource requirements',
      'Quality = Professional tone, data-backed insights, actionable next steps, formatted for executive presentation',
      'Deliverable = Detailed project plan with milestones, risk assessments, and resource allocation recommendations'
    ]
  },
  {
    key: 'integration' as keyof OptimiData,
    icon: Puzzle,
    title: 'Integration',
    description: 'How does this fit into your broader workflow?',
    placeholder: 'e.g., "This analysis will inform our Q4 board presentation and budget planning process"',
    guidance: 'Explain how this output will be used, who will see it, and what decisions it will inform.',
    examples: [
      'Output will be presented to the executive team next Friday to secure budget approval for Q1 initiatives',
      'Results will guide our content calendar for the next 6 months and inform our social media strategy',
      'This framework will be used to train our sales team and update our customer onboarding process'
    ]
  }
]

export default function OptimiBuilder({ onComplete, onClose, category }: OptimiBuilderProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [data, setData] = useState<OptimiData>({
    objective: '',
    persona: '',
    task: '',
    input: '',
    measurement: '',
    integration: ''
  })
  const [generatedPrompt, setGeneratedPrompt] = useState('')
  const [copied, setCopied] = useState(false)

  const currentComponent = OPTIMI_COMPONENTS[currentStep]

  useEffect(() => {
    if (Object.values(data).every(value => value.trim())) {
      generatePrompt()
    }
  }, [data])

  const generatePrompt = () => {
    const prompt = `**OBJECTIVE:** ${data.objective}

**PERSONA:** ${data.persona}

**TASK:**
${data.task}

**INPUT & CONTEXT:**
${data.input}

**SUCCESS MEASUREMENT:**
${data.measurement}

**INTEGRATION:**
${data.integration}

Please provide your response following this structure and meeting all specified criteria.`

    setGeneratedPrompt(prompt)
  }

  const handleInputChange = (value: string) => {
    setData(prev => ({
      ...prev,
      [currentComponent.key]: value
    }))
  }

  const handleNext = () => {
    if (currentStep < OPTIMI_COMPONENTS.length - 1) {
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
      await navigator.clipboard.writeText(generatedPrompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy prompt:', err)
    }
  }

  const handleComplete = () => {
    onComplete(generatedPrompt)
    onClose()
  }

  const isCurrentStepComplete = data[currentComponent.key].trim().length > 10
  const isAllComplete = Object.values(data).every(value => value.trim().length > 10)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-4xl h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="bg-optimi-blue text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">OPTIMI Framework Builder</h2>
              <p className="text-blue-100 mt-1">Build the perfect thread prompt that works on any AI platform</p>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90">Step {currentStep + 1} of {OPTIMI_COMPONENTS.length}</div>
              <div className="w-32 h-2 bg-blue-400 rounded-full mt-2">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / OPTIMI_COMPONENTS.length) * 100}%` }}
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
                <div className="w-12 h-12 bg-optimi-blue rounded-full flex items-center justify-center">
                  <currentComponent.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-optimi-gray">{currentComponent.title}</h3>
                  <p className="text-optimi-gray">{currentComponent.description}</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="bg-blue-50 border-l-4 border-optimi-blue p-4 rounded-r-lg mb-4">
                  <h4 className="font-medium text-optimi-blue mb-2">💡 Pro Tip:</h4>
                  <p className="text-sm text-optimi-gray">{currentComponent.guidance}</p>
                </div>
              </div>

              <textarea
                value={data[currentComponent.key]}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={currentComponent.placeholder}
                className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-optimi-blue focus:border-transparent resize-none text-sm"
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
              {OPTIMI_COMPONENTS.map((component, index) => (
                <div key={component.key} className="flex items-center space-x-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                    data[component.key].trim().length > 10 
                      ? 'bg-green-500' 
                      : index === currentStep 
                        ? 'bg-optimi-blue' 
                        : 'bg-gray-300'
                  }`}>
                    {data[component.key].trim().length > 10 && (
                      <CheckCircle className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span className={`text-sm ${
                    index === currentStep ? 'font-medium text-optimi-blue' : 'text-optimi-gray'
                  }`}>
                    {component.title}
                  </span>
                </div>
              ))}
            </div>

            {/* Generated Prompt Preview */}
            {generatedPrompt && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-optimi-gray">Your Prompt:</h4>
                  <button
                    onClick={handleCopy}
                    className="flex items-center space-x-1 text-xs text-optimi-blue hover:text-optimi-primary"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <div className="bg-white p-3 rounded-lg border text-xs text-optimi-gray max-h-60 overflow-y-auto whitespace-pre-wrap">
                  {generatedPrompt}
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
            className="px-4 py-2 text-optimi-gray hover:text-optimi-blue disabled:opacity-50 disabled:cursor-not-allowed"
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
            
            {currentStep === OPTIMI_COMPONENTS.length - 1 ? (
              <button
                onClick={handleComplete}
                disabled={!isAllComplete}
                className="px-6 py-2 bg-optimi-blue hover:bg-optimi-blue/90 disabled:bg-gray-300 text-white rounded-lg font-medium"
              >
                Complete & Use Prompt
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!isCurrentStepComplete}
                className="px-6 py-2 bg-optimi-blue hover:bg-optimi-blue/90 disabled:bg-gray-300 text-white rounded-lg font-medium"
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