'use client'

import { RefObject } from 'react'
import MessageBubble from './message-bubble'
import TypingIndicator from './typing-indicator'

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

interface MessageListProps {
  messages: Message[]
  isLoading: boolean
  category: 'custom_instructions' | 'projects_gems' | 'threads'
  messagesEndRef: RefObject<HTMLDivElement | null>
  onPromptGenerated?: (prompt: string) => void
}

export default function MessageList({ messages, isLoading, category, messagesEndRef, onPromptGenerated }: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6 space-y-6">
        {messages.map((message, index) => (
          <MessageBubble
            key={message.id}
            message={message}
            category={category}
            isLatest={index === messages.length - 1}
            onPromptGenerated={onPromptGenerated}
          />
        ))}
        
        {isLoading && (
          <TypingIndicator category={category} />
        )}
        
        <div ref={messagesEndRef} className="h-4" />
      </div>
    </div>
  )
}