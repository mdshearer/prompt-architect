'use client'

/**
 * Prompt Type Selector Component
 *
 * Step 2 of the intake flow - allows users to select what type of prompt
 * they want to create. Options are dynamically filtered based on selected AI tool.
 *
 * Features:
 * - Dynamic filtering by AI tool
 * - "Recommended" badge on Prompt Architect
 * - "Learn more" external link
 * - "View example" modal trigger
 *
 * @module prompt-type-selector
 */

import { useState } from 'react'
import { useIntake } from './intake-context'
import {
  getAvailablePromptTypes,
  getPromptTypeLabel,
  getPromptTypeDescription,
  isRecommendedType
} from '@/lib/intake-helpers'
import { EXTERNAL_LINKS } from '@/lib/constants'
import ExampleOutputModal from './example-output-modal'
import CheckIcon from '@/components/ui/check-icon'
import type { PromptType } from '@/types/intake'
import {
  Star,
  FileText,
  Settings,
  FolderOpen,
  Gem,
  ChevronLeft,
  ExternalLink,
  Eye
} from 'lucide-react'

/**
 * Icons for each prompt type
 */
const TYPE_ICONS: Record<PromptType, React.ReactNode> = {
  'prompt-architect': <Star className="w-5 h-5" />,
  'custom-instructions': <Settings className="w-5 h-5" />,
  'projects': <FolderOpen className="w-5 h-5" />,
  'gems': <Gem className="w-5 h-5" />,
  'general-prompt': <FileText className="w-5 h-5" />
}

/**
 * Prompt Type selector for step 2 of the intake flow
 *
 * Shows available prompt types filtered by the selected AI tool.
 * Includes back navigation and informational links.
 *
 * @example
 * <PromptTypeSelector />
 */
export default function PromptTypeSelector() {
  const { aiTool, promptType, setPromptType, goToStep } = useIntake()
  const [showModal, setShowModal] = useState(false)

  // Get available types for this AI tool
  const availableTypes = getAvailablePromptTypes(aiTool)

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Heading */}
      <h2 className="text-2xl font-bold text-center mb-2 text-optimi-gray">
        What would you like to create?
      </h2>
      <p className="text-gray-500 text-center mb-8">
        Choose the type of prompt optimization you need
      </p>

      {/* Prompt type options */}
      <div className="space-y-3 mb-6">
        {availableTypes.map((type) => {
          const isRecommended = isRecommendedType(type)
          const isSelected = promptType === type

          return (
            <button
              key={type}
              onClick={() => setPromptType(type)}
              className={`
                w-full p-4 rounded-xl border-2 transition-all duration-200
                text-left flex items-center gap-4
                ${isSelected
                  ? 'border-optimi-primary bg-optimi-primary/5'
                  : 'border-gray-200 bg-white hover:border-optimi-blue/50'
                }
                focus:outline-none focus:ring-2 focus:ring-optimi-primary focus:ring-offset-2
              `}
            >
              {/* Icon */}
              <div
                className={`
                  flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center
                  ${isSelected
                    ? 'bg-optimi-primary text-white'
                    : isRecommended
                      ? 'bg-optimi-yellow/20 text-optimi-yellow'
                      : 'bg-gray-100 text-gray-600'
                  }
                `}
              >
                {TYPE_ICONS[type]}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={`
                    font-semibold
                    ${isSelected ? 'text-optimi-primary' : 'text-optimi-gray'}
                  `}>
                    {getPromptTypeLabel(type, aiTool)}
                  </h3>
                  {isRecommended && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-optimi-yellow text-optimi-gray">
                      <Star className="w-3 h-3" />
                      Recommended
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {getPromptTypeDescription(type, aiTool)}
                </p>
              </div>

              {/* Selected indicator */}
              {isSelected && (
                <CheckIcon className="flex-shrink-0" />
              )}
            </button>
          )
        })}
      </div>

      {/* Info links for Prompt Architect */}
      {availableTypes.includes('prompt-architect') && (
        <div className="flex flex-wrap items-center justify-center gap-4 mb-8 text-sm">
          <a
            href={EXTERNAL_LINKS.PROMPT_ARCHITECT_GUIDE}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-optimi-blue hover:underline"
          >
            <ExternalLink className="w-4 h-4" />
            Learn more about Prompt Architect
          </a>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1 text-optimi-blue hover:underline"
          >
            <Eye className="w-4 h-4" />
            View example output
          </button>
        </div>
      )}

      {/* Back button */}
      <div className="flex justify-center">
        <button
          onClick={() => goToStep(1)}
          className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-optimi-primary transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to AI selection
        </button>
      </div>

      {/* Example output modal */}
      <ExampleOutputModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        aiTool={aiTool}
      />
    </div>
  )
}
