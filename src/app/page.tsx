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
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            Prompt Architect
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Build better AI prompts with expert guidance. Optimize your custom instructions, 
            projects, and conversation threads with AI-powered assistance from <span className="font-semibold text-optimi-primary">Optimi</span>.
          </p>
        </header>

        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <button
                onClick={() => handleCategorySelect('custom_instructions')}
                className="text-center p-8 bg-white hover:bg-gray-50 rounded-xl transition-all duration-200 border border-gray-200 hover:border-optimi-primary hover:shadow-md group"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-optimi-primary group-hover:text-white transition-colors">
                  <span className="text-gray-600 font-semibold text-lg group-hover:text-white">CI</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Custom Instructions</h3>
                <p className="text-gray-600 leading-relaxed">Optimize your system prompts and custom instructions for better AI interactions</p>
              </button>
              
              <button
                onClick={() => handleCategorySelect('projects_gems')}
                className="text-center p-8 bg-white hover:bg-gray-50 rounded-xl transition-all duration-200 border border-gray-200 hover:border-optimi-primary hover:shadow-md group"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-optimi-primary group-hover:text-white transition-colors">
                  <span className="text-gray-600 font-semibold text-lg group-hover:text-white">PG</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Projects & Gems</h3>
                <p className="text-gray-600 leading-relaxed">Develop powerful project templates and specialized AI tools</p>
              </button>
              
              <button
                onClick={() => handleCategorySelect('threads')}
                className="text-center p-8 bg-white hover:bg-gray-50 rounded-xl transition-all duration-200 border border-gray-200 hover:border-optimi-primary hover:shadow-md group"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-optimi-primary group-hover:text-white transition-colors">
                  <span className="text-gray-600 font-semibold text-lg group-hover:text-white">TC</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Thread Conversations</h3>
                <p className="text-gray-600 leading-relaxed">Structure better conversation flows and optimize thread management</p>
              </button>
            </div>

            <div className="text-center">
              <p className="text-gray-600 mb-6">
                Select a category above to begin optimizing your prompts
              </p>
              <div className="inline-flex items-center space-x-2 text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-lg">
                <span>Free tier: 3 conversations per category</span>
                <span className="text-gray-300">•</span>
                <span>Login for additional sessions</span>
              </div>
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