'use client'

import { useState, useRef, useEffect } from 'react'
import MessageList from './MessageList'
import InputArea from './InputArea'
import ChatHeader from './ChatHeader'

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

interface ChatContainerProps {
  category: 'custom_instructions' | 'projects_gems' | 'threads'
  onClose: () => void
}

export default function ChatContainer({ category, onClose }: ChatContainerProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [usageCount, setUsageCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const maxFreeUsage = 3

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

    const welcomeMessage: Message = {
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
    const promptMessage: Message = {
      id: Date.now().toString(),
      content: `Here's my generated prompt:\n\n${prompt}`,
      role: 'user',
      timestamp: new Date(),
      status: 'sent'
    }
    setMessages(prev => [...prev, promptMessage])

    // Add a congratulatory AI response
    const responseMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: "**Prompt Generated Successfully**\n\nYour professional prompt has been created and is ready for use. Next steps:\n\n- **Copy and implement** this prompt in your preferred AI platform\n- **Test the results** and evaluate performance\n- **Refine as needed** based on your specific requirements\n- **Document** for future reference\n\nWould you like to create another prompt or optimize this implementation?",
      role: 'assistant',
      timestamp: new Date(),
      status: 'sent'
    }
    setMessages(prev => [...prev, responseMessage])
  }

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return

    if (usageCount >= maxFreeUsage) {
      // Show upgrade prompt
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
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
      const response = await fetch('/api/chat/enhanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content.trim(),
          category,
          history: messages.slice(-6), // Last 6 messages for context
          usage_count: usageCount
        })
      })

      const data = await response.json()

      if (data.success) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.message,
          role: 'assistant',
          timestamp: new Date(),
          status: 'sent',
          ui_elements: data.ui_elements
        }
        setMessages(prev => [...prev, assistantMessage])
        setUsageCount(prev => prev + 1)
      } else {
        throw new Error(data.error || 'Failed to get response')
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'A technical error occurred while processing your request. Please try again, and I will assist you in developing your prompt.',
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
          maxUsage={maxFreeUsage}
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
          disabled={isLoading || usageCount >= maxFreeUsage}
          usageCount={usageCount}
          maxUsage={maxFreeUsage}
        />
      </div>
    </div>
  )
}