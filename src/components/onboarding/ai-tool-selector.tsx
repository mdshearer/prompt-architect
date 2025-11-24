'use client'

/**
 * AI Tool Selector Component
 *
 * Step 1 of the intake flow - allows users to select their preferred AI tool.
 * Displays 4 options: ChatGPT, Claude, Gemini, and Microsoft Copilot.
 *
 * @module ai-tool-selector
 */

import { useIntake } from './intake-context'
import { getAiToolDisplayName, getAiToolDescription } from '@/lib/intake-helpers'
import CheckIcon from '@/components/ui/check-icon'
import type { AiTool } from '@/types/intake'
import { AI_TOOLS } from '@/types/intake'
import { MessageSquare, Bot, Sparkles, Laptop } from 'lucide-react'

/**
 * Icons for each AI tool
 */
const TOOL_ICONS: Record<AiTool, React.ReactNode> = {
  chatgpt: <MessageSquare className="w-6 h-6" />,
  claude: <Bot className="w-6 h-6" />,
  gemini: <Sparkles className="w-6 h-6" />,
  copilot: <Laptop className="w-6 h-6" />
}

/**
 * Brand colors for each tool (for subtle theming)
 */
const TOOL_COLORS: Record<AiTool, string> = {
  chatgpt: 'hover:border-green-500',
  claude: 'hover:border-orange-500',
  gemini: 'hover:border-blue-500',
  copilot: 'hover:border-cyan-500'
}

/**
 * AI Tool selector for step 1 of the intake flow
 *
 * Displays a 2x2 grid of AI tool options with icons and descriptions.
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
                ? 'border-optimi-primary bg-optimi-primary/5'
                : `border-gray-200 bg-white ${TOOL_COLORS[tool]}`
              }
              hover:shadow-md focus:outline-none focus:ring-2 focus:ring-optimi-primary focus:ring-offset-2
            `}
          >
            {/* Icon */}
            <div
              className={`
                flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center
                ${aiTool === tool
                  ? 'bg-optimi-primary text-white'
                  : 'bg-gray-100 text-gray-600'
                }
              `}
            >
              {TOOL_ICONS[tool]}
            </div>

            {/* Content */}
            <div className="flex-1">
              <h3 className={`
                font-semibold text-lg mb-1
                ${aiTool === tool ? 'text-optimi-primary' : 'text-optimi-gray'}
              `}>
                {getAiToolDisplayName(tool)}
              </h3>
              <p className="text-sm text-gray-500">
                {getAiToolDescription(tool)}
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
