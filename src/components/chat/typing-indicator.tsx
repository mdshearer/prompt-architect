'use client'

import { Bot } from 'lucide-react'

interface TypingIndicatorProps {
  category: 'custom_instructions' | 'projects_gems' | 'threads'
}

export default function TypingIndicator({ category }: TypingIndicatorProps) {
  const getCategoryColor = () => {
    switch (category) {
      case 'custom_instructions': return 'optimi-primary'
      case 'projects_gems': return 'optimi-green'
      case 'threads': return 'optimi-blue'
    }
  }

  const color = getCategoryColor()

  return (
    <div className="flex justify-start">
      <div className="flex items-start space-x-3 max-w-[85%]">
        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-gray-600" />
        </div>
        
        <div className="bg-white rounded-xl rounded-bl-md px-4 py-3 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600">Processing</span>
            <div className="flex space-x-1">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse" />
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}