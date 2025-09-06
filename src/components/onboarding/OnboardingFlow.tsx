'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'
import StepIndicator from './StepIndicator'

interface OnboardingData {
  role: string
  experience: string
  goal: string
}

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void
  onSkip: () => void
}

export default function OnboardingFlow({ onComplete, onSkip }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [data, setData] = useState<OnboardingData>({
    role: '',
    experience: '',
    goal: ''
  })

  const roles = [
    { id: 'manager', label: 'Manager/Executive', description: 'Leading teams and making strategic decisions' },
    { id: 'developer', label: 'Developer/Engineer', description: 'Building software and technical solutions' },
    { id: 'marketer', label: 'Marketer/Content Creator', description: 'Creating content and marketing campaigns' },
    { id: 'analyst', label: 'Analyst/Researcher', description: 'Analyzing data and conducting research' },
    { id: 'consultant', label: 'Consultant/Advisor', description: 'Providing expertise and guidance' },
    { id: 'entrepreneur', label: 'Entrepreneur/Founder', description: 'Building and growing businesses' },
    { id: 'other', label: 'Other', description: 'Different role or multiple roles' }
  ]

  const experiences = [
    { id: 'beginner', label: 'Beginner', description: 'New to AI tools and prompting' },
    { id: 'intermediate', label: 'Intermediate', description: 'Some experience with AI tools' },
    { id: 'advanced', label: 'Advanced', description: 'Experienced with AI and prompt engineering' }
  ]

  const goals = [
    { id: 'save-time', label: 'Save Time', description: 'Automate repetitive tasks and workflows' },
    { id: 'better-outputs', label: 'Better Outputs', description: 'Improve quality and consistency of AI responses' },
    { id: 'learn-ai', label: 'Learn AI', description: 'Master AI tools and prompt engineering' },
    { id: 'team-productivity', label: 'Team Productivity', description: 'Enable better AI adoption across my team' },
    { id: 'competitive-advantage', label: 'Competitive Edge', description: 'Stay ahead with AI-powered solutions' }
  ]

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete(data)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1: return data.role !== ''
      case 2: return data.experience !== ''
      case 3: return data.goal !== ''
      default: return false
    }
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">What's your role?</h2>
        <p className="text-gray-600">
          This helps us personalize your prompt recommendations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => setData({ ...data, role: role.id })}
            className={`p-4 text-left rounded-lg border-2 transition-all ${
              data.role === role.id
                ? 'border-optimi-primary bg-optimi-primary/5'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className={`font-medium ${
                  data.role === role.id ? 'text-optimi-primary' : 'text-gray-900'
                }`}>
                  {role.label}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{role.description}</p>
              </div>
              {data.role === role.id && (
                <Check className="w-5 h-5 text-optimi-primary flex-shrink-0 mt-0.5" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">What's your AI experience?</h2>
        <p className="text-gray-600">
          We'll match the complexity of recommendations to your expertise
        </p>
      </div>

      <div className="space-y-4">
        {experiences.map((experience) => (
          <button
            key={experience.id}
            onClick={() => setData({ ...data, experience: experience.id })}
            className={`w-full p-6 text-left rounded-lg border-2 transition-all ${
              data.experience === experience.id
                ? 'border-optimi-primary bg-optimi-primary/5'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-lg font-medium ${
                  data.experience === experience.id ? 'text-optimi-primary' : 'text-gray-900'
                }`}>
                  {experience.label}
                </h3>
                <p className="text-gray-600 mt-1">{experience.description}</p>
              </div>
              {data.experience === experience.id && (
                <Check className="w-6 h-6 text-optimi-primary flex-shrink-0" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">What's your primary goal?</h2>
        <p className="text-gray-600">
          Understanding your objectives helps us recommend the best prompt types
        </p>
      </div>

      <div className="space-y-4">
        {goals.map((goal) => (
          <button
            key={goal.id}
            onClick={() => setData({ ...data, goal: goal.id })}
            className={`w-full p-5 text-left rounded-lg border-2 transition-all ${
              data.goal === goal.id
                ? 'border-optimi-primary bg-optimi-primary/5'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`font-medium ${
                  data.goal === goal.id ? 'text-optimi-primary' : 'text-gray-900'
                }`}>
                  {goal.label}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
              </div>
              {data.goal === goal.id && (
                <Check className="w-5 h-5 text-optimi-primary flex-shrink-0" />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-900">Welcome to Prompt Architect</h1>
            <button
              onClick={onSkip}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Skip setup
            </button>
          </div>
          <StepIndicator currentStep={currentStep} totalSteps={3} />
        </div>

        {/* Content */}
        <div className="p-6 min-h-[400px]">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                currentStep === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <div className="text-sm text-gray-500">
              Step {currentStep} of 3
            </div>

            <button
              onClick={handleNext}
              disabled={!isStepValid()}
              className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                isStepValid()
                  ? 'bg-optimi-primary text-white hover:bg-optimi-primary/90'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <span>{currentStep === 3 ? 'Complete Setup' : 'Continue'}</span>
              {currentStep < 3 && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}