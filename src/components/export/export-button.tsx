'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'
import ExportManager from './export-manager'

interface ExportButtonProps {
  content: string
  title?: string
  category?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'ghost'
}

export default function ExportButton({ 
  content, 
  title, 
  category, 
  size = 'md', 
  variant = 'secondary' 
}: ExportButtonProps) {
  const [showManager, setShowManager] = useState(false)

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  }

  const variantClasses = {
    primary: 'bg-optimi-primary text-white hover:bg-optimi-primary/90',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    ghost: 'text-gray-500 hover:text-optimi-primary hover:bg-gray-50'
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowManager(!showManager)}
        className={`inline-flex items-center space-x-2 rounded-lg font-medium transition-colors ${sizeClasses[size]} ${variantClasses[variant]}`}
      >
        <Download className="w-4 h-4" />
        <span>Export</span>
      </button>

      {showManager && (
        <div className="absolute top-full left-0 mt-1 z-50">
          <ExportManager
            content={content}
            title={title}
            category={category}
            onExportComplete={() => setShowManager(false)}
          />
        </div>
      )}

      {showManager && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowManager(false)}
        />
      )}
    </div>
  )
}