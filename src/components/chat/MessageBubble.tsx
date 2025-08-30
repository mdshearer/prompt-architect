'use client'

import { User, Bot, Copy, CheckCircle } from 'lucide-react'
import { useState } from 'react'
import PromptBuilderTrigger from './PromptBuilderTrigger'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  status?: 'sending' | 'sent' | 'error'
  ui_elements?: {
    show_examples?: boolean
    platform_selector?: string[]
    next_action?: string
    educational_content?: {
      concept: string
      level: 'beginner' | 'intermediate' | 'advanced'
    }
  }
}

interface MessageBubbleProps {
  message: Message
  category: 'custom_instructions' | 'projects_gems' | 'threads'
  isLatest: boolean
}

export default function MessageBubble({ message, category, isLatest }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const getCategoryColor = () => {
    switch (category) {
      case 'custom_instructions': return 'optimi-primary'
      case 'projects_gems': return 'optimi-green'
      case 'threads': return 'optimi-blue'
    }
  }

  const formatContent = (content: string) => {
    // Convert markdown-style formatting for display
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .split('\n').map((line, i, arr) => (
        <span key={i}>
          <span dangerouslySetInnerHTML={{ __html: line }} />
          {i < arr.length - 1 && <br />}
        </span>
      ))
  }

  const color = getCategoryColor()

  if (message.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="flex items-end space-x-3 max-w-[80%]">
          <div className={`${
            color === 'optimi-primary' ? 'bg-optimi-primary' :
            color === 'optimi-green' ? 'bg-optimi-green' :
            'bg-optimi-blue'
          } text-white rounded-2xl rounded-br-md px-4 py-3 shadow-lg`}>
            <div className="text-sm leading-relaxed">
              {formatContent(message.content)}
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="text-xs opacity-75">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="flex items-center space-x-1">
                {message.status === 'sending' && (
                  <div className="w-1 h-1 bg-white bg-opacity-60 rounded-full animate-pulse" />
                )}
                {message.status === 'sent' && (
                  <CheckCircle className="w-3 h-3 opacity-75" />
                )}
              </div>
            </div>
          </div>
          <div className="w-8 h-8 bg-optimi-gray rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-start">
      <div className="flex items-start space-x-3 max-w-[85%]">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-white" />
        </div>
        
        <div className="bg-gray-50 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-gray-100">
          <div className="text-sm leading-relaxed text-optimi-gray">
            {formatContent(message.content)}
          </div>
          
          {/* UI Elements for interactive content */}
          {message.ui_elements?.platform_selector && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="text-xs font-medium text-optimi-gray mb-2">Available on:</div>
              <div className="flex space-x-2">
                {message.ui_elements.platform_selector.map(platform => (
                  <span 
                    key={platform}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {platform === 'chatgpt' ? 'ChatGPT' : platform === 'gemini' ? 'Gemini' : platform}
                  </span>
                ))}
              </div>
            </div>
          )}

          {message.ui_elements?.educational_content && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center space-x-2 text-xs">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span className="text-optimi-gray capitalize">
                  {message.ui_elements.educational_content.level} • {message.ui_elements.educational_content.concept.replace('_', ' ')}
                </span>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between mt-3">
            <div className="text-xs text-gray-500">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1 text-xs text-gray-500 hover:text-optimi-blue transition-colors duration-200"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-3 h-3" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}