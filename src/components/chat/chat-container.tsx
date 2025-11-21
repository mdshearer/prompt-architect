'use client'

import { useState, useRef, useEffect } from 'react'
import MessageList from './message-list'
import InputArea from './input-area'
import ChatHeader from './chat-header'
import { MAX_FREE_MESSAGES, CONVERSATION_CONTEXT_LIMIT_ENHANCED, API_TIMEOUT_MS } from '@/lib/constants'
import type { IMessage, IUIElements, PromptCategory } from '@/types/chat'

interface IChatContainerProps {
  category: PromptCategory
  onClose: () => void
}

export default function ChatContainer({ category, onClose }: IChatContainerProps) {
  const [messages, setMessages] = useState<IMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [usageCount, setUsageCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Add sophisticated welcome message with educational context
    const welcomeMessages = {
      custom_instructions: {
        content: "Hi! I'm your prompt engineering coach. Let's build you a powerful **Custom Instruction** that will transform every ChatGPT conversation you have.\n\nCustom Instructions are like having a personal assistant who remembers exactly how you work, what you need, and how you like things done. They apply to *every* conversation automatically.\n\n**What kind of AI assistance are you looking to improve?**\n- Daily productivity and task management\n- Business analysis and decision-making  \n- Creative work and writing\n- Technical problem-solving",
        ui_elements: {
          show_examples: true,
          educational_content: {
            concept: 'custom_instructions',
            level: 'beginner' as const
          }
        }
      },
      projects_gems: {
        content: "Welcome! I'll help you create a specialized **Project** (ChatGPT) or **Gem** (Gemini) that becomes your domain expert.\n\nThink of Projects/Gems as hiring a specialist consultant - someone with deep knowledge in a specific area who can provide expert guidance whenever you need it.\n\n**What specialized expertise do you need?**\n- Business advisor for strategic decisions\n- Technical expert for your industry\n- Creative partner for content creation\n- Research assistant for your field",
        ui_elements: {
          show_examples: true,
          platform_selector: ['chatgpt', 'gemini'],
          educational_content: {
            concept: 'projects_gems',
            level: 'beginner' as const
          }
        }
      },
      threads: {
        content: "Perfect! Let's build you an amazing **Thread Prompt** using the OPTIMI framework - the most effective method for getting exactly what you want from any AI.\n\nThread prompts work on *every* platform (ChatGPT, Claude, Gemini, Copilot) and are perfect for specific tasks where you need precise, high-quality results.\n\n**What kind of task do you need help with?**\n- Analyzing complex information\n- Creating professional content\n- Solving specific problems\n- Making important decisions",
        ui_elements: {
          show_examples: true,
          educational_content: {
            concept: 'threads',
            level: 'beginner' as const
          }
        }
      }
    }

    const welcomeMessage: IMessage = {
      id: '1',
      content: welcomeMessages[category].content,
      role: 'assistant',
      timestamp: new Date(),
      status: 'sent',
      ui_elements: welcomeMessages[category].ui_elements
    }

    setMessages([welcomeMessage])
  }, [category])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handlePromptGenerated = (prompt: string) => {
    // Add the generated prompt as a user message
    const promptMessage: IMessage = {
      id: crypto.randomUUID(),
      content: `Here's my generated prompt:\n\n${prompt}`,
      role: 'user',
      timestamp: new Date(),
      status: 'sent'
    }
    setMessages(prev => [...prev, promptMessage])

    // Add a congratulatory AI response
    const responseMessage: IMessage = {
      id: crypto.randomUUID(),
      content: "**Prompt Generated Successfully**\n\nYour professional prompt has been created and is ready for use. Next steps:\n\n- **Copy and implement** this prompt in your preferred AI platform\n- **Test the results** and evaluate performance\n- **Refine as needed** based on your specific requirements\n- **Document** for future reference\n\nWould you like to create another prompt or optimize this implementation?",
      role: 'assistant',
      timestamp: new Date(),
      status: 'sent'
    }
    setMessages(prev => [...prev, responseMessage])
  }

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return

    if (usageCount >= MAX_FREE_MESSAGES) {
      // Show upgrade prompt
      return
    }

    // Increment counter optimistically to prevent race condition on rapid clicks
    setUsageCount(prev => prev + 1)

    const userMessage: IMessage = {
      id: crypto.randomUUID(),
      content: content.trim(),
      role: 'user',
      timestamp: new Date(),
      status: 'sending'
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    // Update message status to sent
    setMessages(prev =>
      prev.map(msg =>
        msg.id === userMessage.id
          ? { ...msg, status: 'sent' as const }
          : msg
      )
    )

    try {
      // Create AbortController for request timeout
      const abortController = new AbortController()
      const timeoutId = setTimeout(() => abortController.abort(), API_TIMEOUT_MS)

      const response = await fetch('/api/chat/enhanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content.trim(),
          category,
          history: messages.slice(-CONVERSATION_CONTEXT_LIMIT_ENHANCED), // Last N messages for context
          usage_count: usageCount
        }),
        signal: abortController.signal
      })

      clearTimeout(timeoutId)

      const data = await response.json()

      if (data.success) {
        const assistantMessage: IMessage = {
          id: crypto.randomUUID(),
          content: data.message,
          role: 'assistant',
          timestamp: new Date(),
          status: 'sent',
          ui_elements: data.ui_elements
        }
        setMessages(prev => [...prev, assistantMessage])
      } else {
        throw new Error(data.error || 'Failed to get response')
      }
    } catch (error) {
      // Decrement counter since API call failed
      setUsageCount(prev => prev - 1)

      // Provide specific error message for timeouts
      let errorContent = 'A technical error occurred while processing your request. Please try again, and I will assist you in developing your prompt.'
      if (error instanceof Error && error.name === 'AbortError') {
        errorContent = 'The request timed out. Please check your connection and try again.'
      }

      const errorMessage: IMessage = {
        id: crypto.randomUUID(),
        content: errorContent,
        role: 'assistant',
        timestamp: new Date(),
        status: 'error'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-6xl h-[85vh] flex flex-col shadow-2xl">
        <ChatHeader 
          category={category} 
          usageCount={usageCount}
          maxUsage={MAX_FREE_MESSAGES}
          onClose={onClose}
        />
        
        <MessageList 
          messages={messages}
          isLoading={isLoading}
          category={category}
          messagesEndRef={messagesEndRef}
          onPromptGenerated={handlePromptGenerated}
        />
        
        <InputArea
          onSendMessage={handleSendMessage}
          disabled={isLoading || usageCount >= MAX_FREE_MESSAGES}
          usageCount={usageCount}
          maxUsage={MAX_FREE_MESSAGES}
        />
      </div>
    </div>
  )
}