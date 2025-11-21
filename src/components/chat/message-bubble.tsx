'use client'

import { User, Bot, Copy, CheckCircle } from 'lucide-react'
import { useState } from 'react'
import PromptBuilderTrigger from './prompt-builder-trigger'
import { logger } from '@/lib/logger'
import type { IMessage, IUIElements } from '@/types/chat'

interface IMessageBubbleProps {
  message: IMessage
  category: 'custom_instructions' | 'projects_gems' | 'threads'
  /** Reserved for future use - indicates if this is the most recent message */
  isLatest: boolean
  onPromptGenerated?: (prompt: string) => void
}

/**
 * Escapes HTML entities to prevent XSS attacks.
 * Must be called BEFORE any markdown-to-HTML conversion.
 *
 * @param text - Raw text that may contain HTML
 * @returns Escaped text safe for HTML rendering
 */
function escapeHtml(text: string): string {
  const htmlEscapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  return text.replace(/[&<>"']/g, (char) => htmlEscapeMap[char])
}

export default function MessageBubble({ message, category, isLatest, onPromptGenerated }: IMessageBubbleProps) {
  // isLatest is intentionally unused - reserved for future animation/scroll features
  void isLatest

  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      logger.error('Failed to copy text', err)
    }
  }

  /**
   * Formats message content with safe markdown rendering.
   * HTML is escaped first to prevent XSS, then markdown syntax is converted.
   *
   * @param content - Raw message content
   * @returns Array of React elements with formatted content
   */
  const formatContent = (content: string) => {
    // SECURITY: Escape HTML entities FIRST to prevent XSS attacks
    const escaped = escapeHtml(content)

    // Then convert markdown-style formatting to safe HTML
    const formatted = escaped
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')

    return formatted.split('\n').map((line, i, arr) => (
      <span key={i}>
        <span dangerouslySetInnerHTML={{ __html: line }} />
        {i < arr.length - 1 && <br />}
      </span>
    ))
  }

  if (message.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="flex items-end space-x-3 max-w-[80%]">
          <div className="bg-optimi-primary text-white rounded-xl rounded-br-md px-4 py-3 shadow-sm">
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
          <div className="w-8 h-8 bg-optimi-primary rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-start">
      <div className="flex items-start space-x-3 max-w-[85%]">
        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-gray-600" />
        </div>
        
        <div className="bg-white rounded-xl rounded-bl-md px-4 py-3 shadow-sm border border-gray-200">
          <div className="text-sm leading-relaxed text-gray-700">
            {formatContent(message.content)}
          </div>
          
          {/* UI Elements for interactive content */}
          {message.ui_elements?.platform_selector && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="text-xs font-medium text-gray-600 mb-2">Available on:</div>
              <div className="flex space-x-2">
                {message.ui_elements.platform_selector.map(platform => (
                  <span 
                    key={platform}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md font-medium"
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
                <span className="w-2 h-2 bg-optimi-primary rounded-full"></span>
                <span className="text-gray-600 capitalize font-medium">
                  {message.ui_elements.educational_content.level} • {message.ui_elements.educational_content.concept.replace('_', ' ')}
                </span>
              </div>
            </div>
          )}

          {/* Show Builder Trigger for next action */}
          {message.ui_elements?.next_action && onPromptGenerated && (
            <PromptBuilderTrigger
              category={category}
              onPromptGenerated={onPromptGenerated}
            />
          )}
          
          <div className="flex items-center justify-between mt-4">
            <div className="text-xs text-gray-400">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1 text-xs text-gray-400 hover:text-optimi-primary transition-colors duration-200"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-3 h-3" />
                  <span>Copied</span>
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