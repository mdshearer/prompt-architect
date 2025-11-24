'use client'

import { useState } from 'react'
import { Zap, Target, Brain, MessageSquare } from 'lucide-react'
import OptimiBuilder from '../prompt-builders/optimi-builder'
import CustomInstructionsBuilder from '../prompt-builders/custom-instructions-builder'
import ProjectsGemsBuilder from '../prompt-builders/projects-gems-builder'
import type { PromptCategory } from '@/types/chat'

interface IPromptBuilderTriggerProps {
  category: PromptCategory
  onPromptGenerated: (prompt: string) => void
}

export default function PromptBuilderTrigger({ category, onPromptGenerated }: IPromptBuilderTriggerProps) {
  const [activeBuilder, setActiveBuilder] = useState<string | null>(null)

  const handleBuilderComplete = (prompt: string) => {
    onPromptGenerated(prompt)
    setActiveBuilder(null)
  }

  const handleBuilderClose = () => {
    setActiveBuilder(null)
  }

  const getBuilderInfo = () => {
    switch (category) {
      case 'custom_instructions':
        return {
          title: 'Custom Instructions Builder',
          description: 'Step-by-step wizard to create perfect custom instructions',
          icon: Target,
          color: 'optimi-primary',
          bgColor: 'bg-optimi-primary',
          builderType: 'custom_instructions'
        }
      case 'projects_gems':
        return {
          title: 'Project/Gem Builder',
          description: 'Create specialized AI experts for your domain',
          icon: Brain,
          color: 'optimi-green',
          bgColor: 'bg-optimi-green',
          builderType: 'projects_gems'
        }
      case 'threads':
        return {
          title: 'OPTIMI Framework Builder',
          description: 'Build perfect thread prompts that work everywhere',
          icon: Zap,
          color: 'optimi-blue',
          bgColor: 'bg-optimi-blue',
          builderType: 'optimi'
        }
    }
  }

  const info = getBuilderInfo()

  return (
    <>
      <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 ${info.bgColor} rounded-full flex items-center justify-center`}>
            <info.icon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-optimi-gray">{info.title}</h4>
            <p className="text-sm text-optimi-gray">{info.description}</p>
          </div>
          <button
            onClick={() => setActiveBuilder(info.builderType)}
            className={`px-4 py-2 ${info.bgColor} hover:opacity-90 text-white rounded-lg font-medium transition-colors duration-200`}
          >
            Launch Builder
          </button>
        </div>
        
        <div className="mt-3 flex items-center space-x-4 text-xs text-gray-600">
          <div className="flex items-center space-x-1">
            <MessageSquare className="w-3 h-3" />
            <span>Interactive wizard</span>
          </div>
          <div className="flex items-center space-x-1">
            <Target className="w-3 h-3" />
            <span>Expert guidance</span>
          </div>
          <div className="flex items-center space-x-1">
            <Zap className="w-3 h-3" />
            <span>Copy-ready output</span>
          </div>
        </div>
      </div>

      {/* Render Active Builder */}
      {activeBuilder === 'optimi' && (
        <OptimiBuilder
          onComplete={handleBuilderComplete}
          onClose={handleBuilderClose}
          category={category}
        />
      )}
      
      {activeBuilder === 'custom_instructions' && (
        <CustomInstructionsBuilder
          onComplete={handleBuilderComplete}
          onClose={handleBuilderClose}
        />
      )}
      
      {activeBuilder === 'projects_gems' && (
        <ProjectsGemsBuilder
          onComplete={handleBuilderComplete}
          onClose={handleBuilderClose}
        />
      )}
    </>
  )
}