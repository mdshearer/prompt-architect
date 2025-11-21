'use client'

import type { RefObject } from 'react'
import MessageBubble from './message-bubble'
import TypingIndicator from './typing-indicator'
import type { IMessage, PromptCategory } from '@/types/chat'

interface IMessageListProps {
  messages: IMessage[]
  isLoading: boolean
  category: PromptCategory
  messagesEndRef: RefObject<HTMLDivElement | null>
  onPromptGenerated?: (prompt: string) => void
}

export default function MessageList({ messages, isLoading, category, messagesEndRef, onPromptGenerated }: IMessageListProps) {
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