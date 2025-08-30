'use client'

import { useState } from 'react'
import ChatContainer from '@/components/chat/ChatContainer'

type PromptCategory = 'custom_instructions' | 'projects_gems' | 'threads'

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<PromptCategory | null>(null)

  const handleCategorySelect = (category: PromptCategory) => {
    setSelectedCategory(category)
  }

  const handleCloseChat = () => {
    setSelectedCategory(null)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-optimi-primary mb-4">
            Prompt Architect
          </h1>
          <p className="text-xl text-optimi-gray max-w-2xl mx-auto">
            Build better AI prompts with expert guidance. Optimize your custom instructions, 
            projects, and conversation threads with AI-powered assistance from <span className="font-semibold text-optimi-blue">Optimi</span>.
          </p>
        </header>

        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <button
                onClick={() => handleCategorySelect('custom_instructions')}
                className="text-center p-6 bg-blue-50 hover:bg-blue-100 rounded-lg transition duration-200 border-2 border-transparent hover:border-optimi-blue"
              >
                <div className="w-12 h-12 bg-optimi-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">CI</span>
                </div>
                <h3 className="font-semibold text-optimi-gray mb-2">Custom Instructions</h3>
                <p className="text-sm text-optimi-gray">Optimize your system prompts and custom instructions</p>
              </button>
              
              <button
                onClick={() => handleCategorySelect('projects_gems')}
                className="text-center p-6 bg-green-50 hover:bg-green-100 rounded-lg transition duration-200 border-2 border-transparent hover:border-optimi-green"
              >
                <div className="w-12 h-12 bg-optimi-green rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">PG</span>
                </div>
                <h3 className="font-semibold text-optimi-gray mb-2">Projects & Gems</h3>
                <p className="text-sm text-optimi-gray">Develop powerful project templates and gems</p>
              </button>
              
              <button
                onClick={() => handleCategorySelect('threads')}
                className="text-center p-6 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition duration-200 border-2 border-transparent hover:border-optimi-yellow"
              >
                <div className="w-12 h-12 bg-optimi-blue rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">TC</span>
                </div>
                <h3 className="font-semibold text-optimi-gray mb-2">Thread Conversations</h3>
                <p className="text-sm text-optimi-gray">Structure better conversation flows and threads</p>
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-optimi-gray mb-4">
                Choose a category above to start building your prompt
              </p>
              <p className="text-sm text-gray-500">
                Free tier: 3 conversations per category • Login for 10 more
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Chat Interface */}
      {selectedCategory && (
        <ChatContainer
          category={selectedCategory}
          onClose={handleCloseChat}
        />
      )}
    </main>
  )
}