'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, Copy, Zap, Brain, Target, Database, Users, Settings } from 'lucide-react'

interface ProjectGemsData {
  expertise: string
  knowledge_domain: string
  behavioral_guidelines: string
  resources: string
  limitations: string
  integration: string
}

interface ProjectsGemsBuilderProps {
  onComplete: (prompt: string) => void
  onClose: () => void
}

const PROJECT_COMPONENTS = [
  {
    key: 'expertise' as keyof ProjectGemsData,
    icon: Brain,
    title: 'Expert Identity',
    description: 'What kind of specialist should this AI become?',
    placeholder: 'e.g., "You are a senior marketing strategist with 15+ years in B2B SaaS, specializing in demand generation and growth marketing"',
    guidance: 'Define the expert persona, years of experience, and core specialization. Be specific about their expertise level and focus area.',
    examples: [
      'You are a data scientist with expertise in customer analytics, churn prediction, and A/B testing for subscription businesses.',
      'You are a UX researcher specializing in B2B software, with deep knowledge of user interviews, usability testing, and design thinking.',
      'You are a financial analyst focused on SaaS metrics, unit economics, and growth forecasting for venture-backed startups.'
    ]
  },
  {
    key: 'knowledge_domain' as keyof ProjectGemsData,
    icon: Target,
    title: 'Knowledge Domain',
    description: 'What specific knowledge areas should this expert master?',
    placeholder: 'e.g., "Deep knowledge of: email marketing, lead scoring, marketing automation platforms, conversion optimization, and attribution modeling"',
    guidance: 'List the specific domains, methodologies, tools, and concepts this expert should know deeply.',
    examples: [
      'Expertise in: Machine learning algorithms, Python/R, statistical analysis, data visualization, predictive modeling, and customer segmentation.',
      'Knowledge of: User research methods, persona development, journey mapping, usability principles, accessibility standards, and design systems.',
      'Specialization in: Financial modeling, SaaS metrics (MRR, LTV, CAC), fundraising, investor relations, and board reporting.'
    ]
  },
  {
    key: 'behavioral_guidelines' as keyof ProjectGemsData,
    icon: Settings,
    title: 'Behavioral Guidelines',
    description: 'How should this expert think and communicate?',
    placeholder: 'e.g., "Always be data-driven, provide specific metrics, ask clarifying questions, and suggest A/B tests for validation"',
    guidance: 'Define the expert\'s approach to problems, communication style, and decision-making process.',
    examples: [
      'Approach: Always start with hypothesis formation, use statistical rigor, explain methodology clearly, provide confidence intervals for predictions.',
      'Style: Ask probing questions about user needs, reference established UX principles, suggest user testing validation, provide design rationale.',
      'Method: Focus on unit economics first, benchmark against industry standards, show scenario analysis, recommend key metrics to track.'
    ]
  },
  {
    key: 'resources' as keyof ProjectGemsData,
    icon: Database,
    title: 'Resources & Tools',
    description: 'What tools, frameworks, and resources should this expert reference?',
    placeholder: 'e.g., "Reference: HubSpot, Salesforce, Google Analytics, industry benchmarks from SaaStr, and growth frameworks like AARRR"',
    guidance: 'List specific tools, platforms, frameworks, industry resources, and data sources this expert should leverage.',
    examples: [
      'Tools: Jupyter, pandas, scikit-learn, Tableau, SQL. Resources: Kaggle datasets, academic papers, industry benchmarks from companies like Mixpanel.',
      'Tools: Figma, Miro, UserTesting, Hotjar. Resources: Nielsen Norman Group, UX research methodologies, accessibility guidelines (WCAG).',
      'Tools: Excel/Google Sheets, financial modeling templates. Resources: SaaS Capital surveys, Bessemer benchmarks, OpenView data.'
    ]
  },
  {
    key: 'limitations' as keyof ProjectGemsData,
    icon: Users,
    title: 'Scope & Limitations',
    description: 'What should this expert NOT do or advise on?',
    placeholder: 'e.g., "Do not: Provide legal advice, make technology architecture decisions, or recommend specific vendors without context"',
    guidance: 'Define clear boundaries to keep the expert focused and avoid providing advice outside their expertise.',
    examples: [
      'Limitations: Do not provide medical advice, make hiring decisions, or recommend specific trading strategies. Focus only on data analysis and insights.',
      'Boundaries: Do not make final design decisions, provide development estimates, or override business requirements. Focus on user research and UX principles.',
      'Restrictions: Do not give investment advice, make legal recommendations, or provide tax guidance. Focus only on financial analysis and metrics.'
    ]
  },
  {
    key: 'integration' as keyof ProjectGemsData,
    icon: Zap,
    title: 'Integration & Workflow',
    description: 'How does this expert fit into existing workflows?',
    placeholder: 'e.g., "Integrates with: weekly marketing reviews, quarterly planning, campaign post-mortems, and board reporting"',
    guidance: 'Explain how this expert will be used in regular workflows, meetings, and decision-making processes.',
    examples: [
      'Usage: Weekly data reviews, monthly business analysis, quarterly forecasting, ad-hoc deep dives into customer behavior and retention.',
      'Integration: Design reviews, user research planning, usability testing analysis, product requirement validation, accessibility audits.',
      'Application: Monthly board decks, quarterly business reviews, fundraising preparation, scenario planning, and investment decision support.'
    ]
  }
]

const PLATFORM_INFO = {
  chatgpt: {
    name: 'ChatGPT Project/GPT',
    capabilities: 'Custom knowledge base, web browsing, DALL-E integration',
    limitations: 'Requires ChatGPT Plus/Pro subscription'
  },
  gemini: {
    name: 'Gemini Gem',
    capabilities: 'Code execution, multimodal inputs, real-time information',
    limitations: 'Currently in limited availability'
  },
  claude: {
    name: 'Claude Project',
    capabilities: 'Large context window, document analysis, coding assistance',
    limitations: 'Requires Claude Pro subscription'
  }
}

export default function ProjectsGemsBuilder({ onComplete, onClose }: ProjectsGemsBuilderProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedPlatform, setSelectedPlatform] = useState<keyof typeof PLATFORM_INFO>('chatgpt')
  const [data, setData] = useState<ProjectGemsData>({
    expertise: '',
    knowledge_domain: '',
    behavioral_guidelines: '',
    resources: '',
    limitations: '',
    integration: ''
  })
  const [generatedProject, setGeneratedProject] = useState('')
  const [copied, setCopied] = useState(false)

  const currentComponent = PROJECT_COMPONENTS[currentStep]

  useEffect(() => {
    if (Object.values(data).some(value => value.trim())) {
      generateProject()
    }
  }, [data, selectedPlatform])

  const generateProject = () => {
    const platformInfo = PLATFORM_INFO[selectedPlatform]
    
    const project = `# ${platformInfo.name} Configuration

## Expert Identity
${data.expertise || '[Define your AI expert\'s identity and specialization]'}

## Knowledge Domain
${data.knowledge_domain || '[Specify areas of deep expertise]'}

## Behavioral Guidelines
${data.behavioral_guidelines || '[How this expert thinks and communicates]'}

## Tools & Resources
${data.resources || '[Tools, frameworks, and resources to reference]'}

## Scope Limitations
${data.limitations || '[What this expert should NOT advise on]'}

## Workflow Integration
${data.integration || '[How this fits into your regular workflows]'}

---

## Platform-Specific Notes:
**${platformInfo.name}**
- Capabilities: ${platformInfo.capabilities}
- Requirements: ${platformInfo.limitations}

**Instructions:**
Act as the expert defined above in all conversations. Always stay within your defined expertise and refer users to appropriate resources when questions fall outside your domain.`

    setGeneratedProject(project)
  }

  const handleInputChange = (value: string) => {
    setData(prev => ({
      ...prev,
      [currentComponent.key]: value
    }))
  }

  const handleNext = () => {
    if (currentStep < PROJECT_COMPONENTS.length - 1) {
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
      await navigator.clipboard.writeText(generatedProject)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy project:', err)
    }
  }

  const handleComplete = () => {
    onComplete(generatedProject)
    onClose()
  }

  const isCurrentStepComplete = data[currentComponent.key].trim().length > 10
  const isAllComplete = Object.values(data).some(value => value.trim().length > 10)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-4xl h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="bg-optimi-green text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Projects & Gems Builder</h2>
              <p className="text-green-100 mt-1">Create specialized AI experts for your domain</p>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90">Step {currentStep + 1} of {PROJECT_COMPONENTS.length}</div>
              <div className="w-32 h-2 bg-green-400 rounded-full mt-2">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / PROJECT_COMPONENTS.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Current Step */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-2xl">
              {/* Platform Selection */}
              {currentStep === 0 && (
                <div className="mb-6">
                  <h4 className="font-medium text-optimi-gray mb-3">Choose your platform:</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {Object.entries(PLATFORM_INFO).map(([key, info]) => (
                      <button
                        key={key}
                        onClick={() => setSelectedPlatform(key as keyof typeof PLATFORM_INFO)}
                        className={`p-3 rounded-lg border text-left transition-colors ${
                          selectedPlatform === key
                            ? 'border-optimi-green bg-green-50 text-optimi-green'
                            : 'border-gray-200 hover:border-optimi-green'
                        }`}
                      >
                        <div className="font-medium text-sm">{info.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-optimi-green rounded-full flex items-center justify-center">
                  <currentComponent.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-optimi-gray">{currentComponent.title}</h3>
                  <p className="text-optimi-gray">{currentComponent.description}</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="bg-green-50 border-l-4 border-optimi-green p-4 rounded-r-lg mb-4">
                  <h4 className="font-medium text-optimi-green mb-2">💡 Pro Tip:</h4>
                  <p className="text-sm text-optimi-gray">{currentComponent.guidance}</p>
                </div>
              </div>

              <textarea
                value={data[currentComponent.key]}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder={currentComponent.placeholder}
                className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-optimi-green focus:border-transparent resize-none text-sm"
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
            
            {/* Selected Platform */}
            <div className="bg-green-50 p-3 rounded-lg mb-4">
              <h4 className="font-medium text-optimi-green mb-2">📱 Platform: {PLATFORM_INFO[selectedPlatform].name}</h4>
              <p className="text-xs text-optimi-gray">{PLATFORM_INFO[selectedPlatform].capabilities}</p>
            </div>

            {/* Component Status */}
            <div className="space-y-2 mb-6">
              {PROJECT_COMPONENTS.map((component, index) => (
                <div key={component.key} className="flex items-center space-x-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                    data[component.key].trim().length > 10 
                      ? 'bg-green-500' 
                      : index === currentStep 
                        ? 'bg-optimi-green' 
                        : 'bg-gray-300'
                  }`}>
                    {data[component.key].trim().length > 10 && (
                      <CheckCircle className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span className={`text-sm ${
                    index === currentStep ? 'font-medium text-optimi-green' : 'text-optimi-gray'
                  }`}>
                    {component.title}
                  </span>
                </div>
              ))}
            </div>

            {/* Generated Project Preview */}
            {generatedProject && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-optimi-gray">Your Project:</h4>
                  <button
                    onClick={handleCopy}
                    className="flex items-center space-x-1 text-xs text-optimi-green hover:text-optimi-primary"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <div className="bg-white p-3 rounded-lg border text-xs text-optimi-gray max-h-60 overflow-y-auto whitespace-pre-wrap">
                  {generatedProject}
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
            className="px-4 py-2 text-optimi-gray hover:text-optimi-green disabled:opacity-50 disabled:cursor-not-allowed"
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
            
            {currentStep === PROJECT_COMPONENTS.length - 1 ? (
              <button
                onClick={handleComplete}
                disabled={!isAllComplete}
                className="px-6 py-2 bg-optimi-green hover:bg-optimi-green/90 disabled:bg-gray-300 text-white rounded-lg font-medium"
              >
                Complete & Copy Project
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!isCurrentStepComplete}
                className="px-6 py-2 bg-optimi-green hover:bg-optimi-green/90 disabled:bg-gray-300 text-white rounded-lg font-medium"
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