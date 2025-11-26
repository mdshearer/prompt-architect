'use client'

/**
 * AI Tool Selector Component
 *
 * Step 1 of the intake flow - allows users to select their preferred AI tool.
 * Displays 4 options: ChatGPT, Claude, Gemini, and Microsoft Copilot.
 *
 * @module ai-tool-selector
 */

import Image from 'next/image'
import { useIntake } from './intake-context'
import CheckIcon from '@/components/ui/check-icon'
import type { AiTool } from '@/types/intake'
import { AI_TOOLS } from '@/types/intake'

/**
 * Logo images for each AI tool
 */
const TOOL_LOGOS: Record<AiTool, string> = {
  chatgpt: '/assets/chatgpt-logo.png',
  claude: '/assets/claude-logo.png',
  gemini: '/assets/gemini-logo.png',
  copilot: '/assets/copilot-logo.jpg'
}

/**
 * Descriptions for each AI tool (per spec)
 */
const TOOL_DESCRIPTIONS: Record<AiTool, string> = {
  chatgpt: "OpenAI's conversational AI with Projects and Custom Instructions",
  claude: "Anthropic's AI assistant with Projects and strong reasoning",
  gemini: "Google's AI with Gems, Workspace Integration, and multimodal capabilities",
  copilot: "Microsoft's AI assistant with search and Office integration"
}

/**
 * Display names for each AI tool
 */
const TOOL_NAMES: Record<AiTool, string> = {
  chatgpt: 'ChatGPT',
  claude: 'Claude',
  gemini: 'Gemini',
  copilot: 'Copilot'
}

/**
 * AI Tool selector for step 1 of the intake flow
 *
 * Displays a 2x2 grid of AI tool options with logos and descriptions.
 * Clicking an option selects it and advances to step 2.
 *
 * @example
 * <AiToolSelector />
 */
export default function AiToolSelector() {
  const { aiTool, setAiTool } = useIntake()

  const tools = Object.values(AI_TOOLS) as AiTool[]

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Heading */}
      <h2 className="text-2xl font-bold text-center mb-2 text-optimi-gray">
        Which AI tool do you use?
      </h2>
      <p className="text-gray-500 text-center mb-8">
        Select the AI assistant you want to optimize
      </p>

      {/* Tool grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tools.map((tool) => (
          <button
            key={tool}
            onClick={() => setAiTool(tool)}
            className={`
              p-6 rounded-xl border-2 transition-all duration-200
              text-left flex items-start gap-4
              ${aiTool === tool
                ? 'border-optimi-blue bg-optimi-blue/5'
                : 'border-gray-200 bg-white hover:border-optimi-blue'
              }
              hover:shadow-md focus:outline-none focus:ring-2 focus:ring-optimi-blue focus:ring-offset-2
            `}
          >
            {/* Logo Image */}
            <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center bg-white">
              <Image
                src={TOOL_LOGOS[tool]}
                alt={`${TOOL_NAMES[tool]} logo`}
                width={48}
                height={48}
                className="object-contain"
              />
            </div>

            {/* Content */}
            <div className="flex-1">
              <h3 className={`
                font-semibold text-lg mb-1
                ${aiTool === tool ? 'text-optimi-blue' : 'text-optimi-gray'}
              `}>
                {TOOL_NAMES[tool]}
              </h3>
              <p className="text-sm text-gray-500">
                {TOOL_DESCRIPTIONS[tool]}
              </p>
            </div>

            {/* Selected indicator */}
            {aiTool === tool && (
              <CheckIcon className="flex-shrink-0" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
