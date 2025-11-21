'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Star, Calendar, Tag, Copy, ChevronDown } from 'lucide-react'
import { logger } from '@/lib/logger'

interface IPrompt {
  id: string
  title: string
  content: string
  category: 'custom_instructions' | 'projects_gems' | 'threads'
  created_at: Date
  ai_platform?: 'chatgpt' | 'gemini' | 'claude' | 'copilot'
  success_rating?: number
  is_favorite: boolean
  user_id?: string
}

interface IPromptLibraryProps {
  isOpen: boolean
  onClose: () => void
}

export default function PromptLibrary({ isOpen, onClose }: IPromptLibraryProps) {
  const [prompts, setPrompts] = useState<IPrompt[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'recent' | 'favorites' | 'custom_instructions' | 'projects_gems' | 'threads'>('all')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Mock data - replace with Supabase integration
  useEffect(() => {
    const mockPrompts: IPrompt[] = [
      {
        id: '1',
        title: 'Business Strategy Assistant',
        content: 'You are an expert business strategist with 20 years of experience...',
        category: 'custom_instructions',
        created_at: new Date('2024-01-15'),
        ai_platform: 'chatgpt',
        success_rating: 4.8,
        is_favorite: true
      },
      {
        id: '2', 
        title: 'Code Review Expert',
        content: 'Act as a senior software engineer focused on code quality...',
        category: 'projects_gems',
        created_at: new Date('2024-01-12'),
        ai_platform: 'claude',
        success_rating: 4.6,
        is_favorite: false
      },
      {
        id: '3',
        title: 'Technical Documentation Writer',
        content: 'You specialize in creating clear, comprehensive technical documentation...',
        category: 'threads',
        created_at: new Date('2024-01-10'),
        ai_platform: 'gemini',
        success_rating: 4.7,
        is_favorite: true
      }
    ]
    setPrompts(mockPrompts)
  }, [])

  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch = prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prompt.content.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = 
      selectedFilter === 'all' ||
      selectedFilter === 'recent' ||
      selectedFilter === 'favorites' && prompt.is_favorite ||
      selectedFilter === prompt.category

    return matchesSearch && matchesFilter
  })

  const sortedPrompts = [...filteredPrompts].sort((a, b) => {
    if (selectedFilter === 'recent') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    }
    if (selectedFilter === 'favorites') {
      return Number(b.is_favorite) - Number(a.is_favorite)
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  const handleCopyPrompt = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      // Add toast notification here
    } catch (err) {
      logger.error('Failed to copy prompt', err)
    }
  }

  const toggleFavorite = (promptId: string) => {
    setPrompts(prev => 
      prev.map(prompt => 
        prompt.id === promptId 
          ? { ...prompt, is_favorite: !prompt.is_favorite }
          : prompt
      )
    )
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'custom_instructions': return 'Custom Instructions'
      case 'projects_gems': return 'Projects & Gems'
      case 'threads': return 'Thread Prompts'
      default: return category
    }
  }

  const getPlatformIcon = (platform?: string) => {
    switch (platform) {
      case 'chatgpt': return '🤖'
      case 'claude': return '🤖'
      case 'gemini': return '💎'
      case 'copilot': return '🛠️'
      default: return '🤖'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex">
      <div className="bg-white w-96 h-full shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Prompt Library</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-light"
            >
              ×
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search prompts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-optimi-primary focus:border-transparent"
            />
          </div>

          {/* Filter */}
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center justify-between w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">
                  {selectedFilter === 'all' ? 'All Prompts' : 
                   selectedFilter === 'recent' ? 'Recent' :
                   selectedFilter === 'favorites' ? 'Favorites' :
                   getCategoryLabel(selectedFilter)}
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>

            {isFilterOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                {['all', 'recent', 'favorites', 'custom_instructions', 'projects_gems', 'threads'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => {
                      setSelectedFilter(filter as any)
                      setIsFilterOpen(false)
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                  >
                    {filter === 'all' ? 'All Prompts' :
                     filter === 'recent' ? 'Recent' :
                     filter === 'favorites' ? 'Favorites' :
                     getCategoryLabel(filter)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Prompt List */}
        <div className="flex-1 overflow-y-auto">
          {sortedPrompts.length === 0 ? (
            <div className="p-6 text-center">
              <div className="text-gray-400 mb-2">📋</div>
              <p className="text-gray-500 text-sm">No prompts found</p>
              <p className="text-gray-400 text-xs mt-1">
                {searchQuery ? 'Try a different search term' : 'Create your first prompt to get started'}
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {sortedPrompts.map((prompt) => (
                <div
                  key={prompt.id}
                  className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-900 text-sm group-hover:text-optimi-primary transition-colors">
                      {prompt.title}
                    </h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(prompt.id)
                      }}
                      className="text-gray-300 hover:text-yellow-500 transition-colors"
                    >
                      <Star
                        className={`w-4 h-4 ${prompt.is_favorite ? 'fill-yellow-500 text-yellow-500' : ''}`}
                      />
                    </button>
                  </div>

                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                    {prompt.content.substring(0, 100)}...
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Tag className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {getCategoryLabel(prompt.category)}
                        </span>
                      </div>
                      {prompt.ai_platform && (
                        <div className="flex items-center space-x-1">
                          <span className="text-xs">{getPlatformIcon(prompt.ai_platform)}</span>
                          <span className="text-xs text-gray-500 capitalize">
                            {prompt.ai_platform}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {prompt.success_rating && (
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          <span className="text-xs text-gray-500">{prompt.success_rating}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {prompt.created_at.toLocaleDateString()}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCopyPrompt(prompt.content)
                        }}
                        className="text-gray-400 hover:text-optimi-primary transition-colors"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4">
          <div className="text-xs text-gray-500 text-center">
            {sortedPrompts.length} {sortedPrompts.length === 1 ? 'prompt' : 'prompts'}
            {selectedFilter !== 'all' && ` in ${selectedFilter}`}
          </div>
        </div>
      </div>
      
      {/* Overlay to close */}
      <div className="flex-1" onClick={onClose} />
    </div>
  )
}