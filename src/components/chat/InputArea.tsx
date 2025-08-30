'use client'

import { useState, useRef, KeyboardEvent } from 'react'
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

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    
    // Auto-resize textarea
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
  }

  const isAtLimit = usageCount >= maxUsage

  const getPlaceholderText = () => {
    if (isAtLimit) return "You've reached the free limit. Sign up for more conversations!"
    
    const suggestions = [
      "I help my team make better decisions...",
      "I need to analyze complex data and reports...", 
      "I write content for our marketing team...",
      "I solve technical problems daily...",
      "Tell me about your work..."
    ]
    
    return suggestions[Math.floor(Math.random() * suggestions.length)]
  }

  return (
    <div className="border-t border-gray-200 p-4 bg-gray-50">
      {isAtLimit ? (
        <div className="mb-4 p-4 bg-gradient-to-r from-optimi-yellow to-yellow-400 rounded-lg">
          <div className="flex items-center space-x-3">
            <Sparkles className="w-6 h-6 text-optimi-gray" />
            <div>
              <div className="font-semibold text-optimi-gray">
                🎉 Free conversations complete!
              </div>
              <div className="text-sm text-optimi-gray mt-1">
                Sign up to get 10 more conversations + advanced prompt builders + expert frameworks
              </div>
            </div>
            <button className="bg-optimi-primary hover:bg-optimi-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 whitespace-nowrap">
              Upgrade Now
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-optimi-gray">
            <Zap className="w-4 h-4" />
            <span>Pro tip: Be specific about your role and what you need help with</span>
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
            placeholder={getPlaceholderText()}
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