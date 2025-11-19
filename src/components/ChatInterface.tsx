'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, User, Bot } from 'lucide-react'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

interface ChatInterfaceProps {
  category: 'custom_instructions' | 'projects_gems' | 'threads'
  onClose: () => void
}

export default function ChatInterface({ category, onClose }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [usageCount, setUsageCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const maxFreeUsage = 3

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Add welcome message based on category
    const welcomeMessages = {
      custom_instructions: "Hi! I'll help you create powerful custom instructions. Share your current prompt and I'll help optimize it for better results.",
      projects_gems: "Hello! Let's build an amazing project or gem together. Tell me about what you're trying to create and I'll guide you through it.",
      threads: "Hey there! I'll help you structure better conversation threads. What kind of conversation flow are you looking to improve?"
    }

    setMessages([{
      id: '1',
      content: welcomeMessages[category],
      role: 'assistant',
      timestamp: new Date()
    }])
  }, [category])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    if (usageCount >= maxFreeUsage) {
      alert('You\'ve reached your free usage limit. Please sign up for more conversations!')
      return
    }

    // Increment counter optimistically to prevent race condition on rapid clicks
    setUsageCount(prev => prev + 1)

    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: input.trim(),
      role: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input.trim(),
          category,
          history: messages
        })
      })

      const data = await response.json()

      if (data.success) {
        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          content: data.response,
          role: 'assistant',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, assistantMessage])
      } else {
        throw new Error(data.error || 'Failed to get response')
      }
    } catch (error) {
      // Decrement counter since API call failed
      setUsageCount(prev => prev - 1)

      const errorMessage: Message = {
        id: crypto.randomUUID(),
        content: 'Sorry, I encountered an error. Please try again.',
        role: 'assistant',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const getCategoryColor = () => {
    switch (category) {
      case 'custom_instructions': return 'optimi-primary'
      case 'projects_gems': return 'optimi-green'  
      case 'threads': return 'optimi-blue'
    }
  }

  const getCategoryTitle = () => {
    switch (category) {
      case 'custom_instructions': return 'Custom Instructions'
      case 'projects_gems': return 'Projects & Gems'
      case 'threads': return 'Thread Conversations'
    }
  }

  const color = getCategoryColor()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className={`${
          color === 'optimi-primary' ? 'bg-optimi-primary' : 
          color === 'optimi-green' ? 'bg-optimi-green' : 
          'bg-optimi-blue'
        } text-white p-4 rounded-t-xl flex justify-between items-center`}>
          <div>
            <h2 className="text-xl font-semibold">{getCategoryTitle()}</h2>
            <p className="text-sm opacity-90">
              {usageCount}/{maxFreeUsage} free conversations used
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-200 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? color === 'optimi-primary' ? 'bg-optimi-primary text-white' :
                      color === 'optimi-green' ? 'bg-optimi-green text-white' :
                      'bg-optimi-blue text-white'
                    : 'bg-gray-100 text-optimi-gray'
                }`}
              >
                <div className="flex items-start space-x-2">
                  {message.role === 'assistant' && (
                    <Bot className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  )}
                  {message.role === 'user' && (
                    <User className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.role === 'user' ? 'text-white/70' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3 max-w-[70%]">
                <div className="flex items-center space-x-2">
                  <Bot className="w-5 h-5" />
                  <div className="flex space-x-1">
                    <div className={`w-2 h-2 ${
                      color === 'optimi-primary' ? 'bg-optimi-primary opacity-60' :
                      color === 'optimi-green' ? 'bg-optimi-green opacity-60' :
                      'bg-optimi-blue opacity-60'
                    } rounded-full animate-bounce`} />
                    <div className={`w-2 h-2 ${
                      color === 'optimi-primary' ? 'bg-optimi-primary opacity-60' :
                      color === 'optimi-green' ? 'bg-optimi-green opacity-60' :
                      'bg-optimi-blue opacity-60'
                    } rounded-full animate-bounce`} style={{ animationDelay: '0.1s' }} />
                    <div className={`w-2 h-2 ${
                      color === 'optimi-primary' ? 'bg-optimi-primary opacity-60' :
                      color === 'optimi-green' ? 'bg-optimi-green opacity-60' :
                      'bg-optimi-blue opacity-60'
                    } rounded-full animate-bounce`} style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                usageCount >= maxFreeUsage 
                  ? "Free limit reached - sign up for more!" 
                  : "Type your message..."
              }
              disabled={usageCount >= maxFreeUsage || isLoading}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-optimi-blue disabled:bg-gray-100"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading || usageCount >= maxFreeUsage}
              className={`${
                color === 'optimi-primary' ? 'bg-optimi-primary hover:bg-optimi-primary/80' :
                color === 'optimi-green' ? 'bg-optimi-green hover:bg-optimi-green/80' :
                'bg-optimi-blue hover:bg-optimi-blue/80'
              } disabled:bg-gray-300 text-white p-2 rounded-lg transition duration-200`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          
          {usageCount >= maxFreeUsage && (
            <div className="mt-2 p-3 bg-yellow-50 border border-optimi-yellow rounded-lg">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-optimi-yellow" />
                <p className="text-sm text-optimi-gray">
                  <strong className="text-optimi-primary">Free limit reached!</strong> Sign up to get 10 more conversations and unlock advanced features.
                </p>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}