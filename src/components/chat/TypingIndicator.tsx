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
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-white" />
        </div>
        
        <div className="bg-gray-50 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-optimi-gray">Thinking</span>
            <div className="flex space-x-1">
              <div className={`w-2 h-2 ${
                color === 'optimi-primary' ? 'bg-optimi-primary' :
                color === 'optimi-green' ? 'bg-optimi-green' :
                'bg-optimi-blue'
              } opacity-60 rounded-full animate-bounce`} />
              <div 
                className={`w-2 h-2 ${
                  color === 'optimi-primary' ? 'bg-optimi-primary' :
                  color === 'optimi-green' ? 'bg-optimi-green' :
                  'bg-optimi-blue'
                } opacity-60 rounded-full animate-bounce`} 
                style={{ animationDelay: '0.1s' }} 
              />
              <div 
                className={`w-2 h-2 ${
                  color === 'optimi-primary' ? 'bg-optimi-primary' :
                  color === 'optimi-green' ? 'bg-optimi-green' :
                  'bg-optimi-blue'
                } opacity-60 rounded-full animate-bounce`} 
                style={{ animationDelay: '0.2s' }} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}