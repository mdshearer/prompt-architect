'use client'

import { useMemo } from 'react'
import { X, Sparkles } from 'lucide-react'

interface ChatHeaderProps {
  category: 'custom_instructions' | 'projects_gems' | 'threads'
  usageCount: number
  maxUsage: number
  onClose: () => void
}

export default function ChatHeader({ category, usageCount, maxUsage, onClose }: ChatHeaderProps) {
  // Memoize category info to prevent recalculation on every render
  const info = useMemo(() => {
    switch (category) {
      case 'custom_instructions':
        return {
          title: 'Custom Instructions Builder',
          subtitle: 'Build persistent AI behavior that works across all conversations',
          color: 'optimi-primary',
          bgColor: 'bg-optimi-primary'
        }
      case 'projects_gems':
        return {
          title: 'Projects & Gems Builder',
          subtitle: 'Create specialized AI experts for your domain',
          color: 'optimi-green',
          bgColor: 'bg-optimi-green'
        }
      case 'threads':
        return {
          title: 'Thread Prompts Builder',
          subtitle: 'Utilize the OPTIMI framework for optimal results',
          color: 'optimi-blue',
          bgColor: 'bg-optimi-blue'
        }
    }
  }, [category])

  return (
    <div className={`${info.bgColor} text-white p-6 rounded-t-xl`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{info.title}</h2>
              <p className="text-sm opacity-90 mt-1">{info.subtitle}</p>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm opacity-90">
              <span>Progress: {usageCount}/{maxUsage} free conversations</span>
              <div className="flex space-x-1">
                {Array.from({ length: maxUsage }, (_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i < usageCount ? 'bg-white' : 'bg-white bg-opacity-30'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            {usageCount >= maxUsage && (
              <div className="text-xs bg-optimi-yellow/20 text-gray-800 px-3 py-1 rounded-full font-medium">
                Upgrade for additional sessions + advanced features
              </div>
            )}
          </div>
        </div>
        
        <button 
          onClick={onClose}
          className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition duration-200 ml-4"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}