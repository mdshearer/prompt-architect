'use client'

import { useState, useRef, KeyboardEvent, useMemo } from 'react'
import { Send, Sparkles, Zap } from 'lucide-react'

interface InputAreaProps {
  onSendMessage: (content: string) => void
  disabled: boolean
  usageCount: number
  maxUsage: number
}

export default function InputArea({ onSendMessage, disabled, usageCount, maxUsage }: InputAreaProps) {
  const [input, setInput] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!input.trim() || disabled) return
    
    onSendMessage(input)
    setInput('')
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  /**
   * Handles textarea input changes and auto-resizing behavior.
   *
   * Auto-resize logic:
   * 1. Reset height to 'auto' to get accurate scrollHeight measurement
   * 2. Calculate new height based on content (scrollHeight)
   * 3. Limit maximum height to 120px to prevent excessive vertical growth
   * 4. This creates a smooth expanding textarea that stops at ~4 lines
   *
   * @param e - React change event from textarea
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)

    // Auto-resize textarea
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
  }

  const isAtLimit = usageCount >= maxUsage

  // Memoize placeholder text to avoid recalculation on every render
  const placeholderText = useMemo(() => {
    if (isAtLimit) return "Free tier limit reached. Sign up for additional sessions."

    const suggestions = [
      "Describe your role and specific prompt requirements...",
      "What type of AI assistance do you need to optimize...",
      "Outline your current workflow challenges...",
      "Specify your target audience and objectives...",
      "Detail your subject matter expertise area..."
    ]

    // Select random suggestion on mount, stable during component lifecycle
    return suggestions[Math.floor(Math.random() * suggestions.length)]
  }, [isAtLimit])

  return (
    <div className="border-t border-gray-200 p-4 bg-gray-50">
      {isAtLimit ? (
        <div className="mb-4 p-4 bg-optimi-yellow/10 border border-optimi-yellow/20 rounded-lg">
          <div className="flex items-center space-x-3">
            <Sparkles className="w-6 h-6 text-optimi-primary" />
            <div>
              <div className="font-semibold text-gray-900">
                Free tier sessions completed
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Sign up to access additional sessions, advanced prompt builders, and expert frameworks
              </div>
            </div>
            <button className="bg-optimi-primary hover:bg-optimi-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 whitespace-nowrap">
              Upgrade Account
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Zap className="w-4 h-4" />
            <span>Include specific details about your role and requirements for optimal results</span>
          </div>
          <div className="text-sm text-gray-500">
            {maxUsage - usageCount} free {maxUsage - usageCount === 1 ? 'message' : 'messages'} remaining
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex space-x-3">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholderText}
            disabled={disabled}
            rows={1}
            className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-optimi-blue focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500 text-sm leading-relaxed"
            style={{ minHeight: '48px' }}
          />
          
          {/* Character count for longer messages */}
          {input.length > 100 && (
            <div className="absolute bottom-2 right-12 text-xs text-gray-400">
              {input.length}/2000
            </div>
          )}
        </div>
        
        <button
          type="submit"
          disabled={!input.trim() || disabled}
          className="bg-optimi-blue hover:bg-optimi-blue/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-colors duration-200 flex items-center justify-center min-w-[48px] h-[48px]"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
      
      <div className="mt-2 text-xs text-gray-500 text-center">
        Press Enter to send, Shift+Enter for new line
      </div>
    </div>
  )
}