'use client'

import { useState } from 'react'
import { Download, Copy, FileText, File, CheckCircle, ChevronDown } from 'lucide-react'
import { logger } from '@/lib/logger'

interface IExportManagerProps {
  content: string
  title?: string
  category?: string
  onExportComplete?: (format: string) => void
}

export default function ExportManager({ content, title = 'Generated Prompt', category, onExportComplete }: IExportManagerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null)

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedFormat('clipboard')
      setTimeout(() => setCopiedFormat(null), 2000)
      onExportComplete?.('clipboard')
    } catch (err) {
      logger.error('Failed to copy to clipboard', err)
    }
  }

  const handleDownloadMarkdown = () => {
    const markdownContent = `# ${title}

${category ? `**Category:** ${category}\n` : ''}**Generated:** ${new Date().toLocaleDateString()}

## Prompt Content

${content}

---
*Generated with Prompt Architect by Optimi*
`
    
    const blob = new Blob([markdownContent], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    setCopiedFormat('markdown')
    setTimeout(() => setCopiedFormat(null), 2000)
    onExportComplete?.('markdown')
  }

  const handleDownloadText = () => {
    const textContent = `${title}
${category ? `Category: ${category}` : ''}
Generated: ${new Date().toLocaleDateString()}

${content}

---
Generated with Prompt Architect by Optimi
`
    
    const blob = new Blob([textContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    setCopiedFormat('text')
    setTimeout(() => setCopiedFormat(null), 2000)
    onExportComplete?.('text')
  }

  const handleNotionFormat = async () => {
    const notionContent = `${title}

Category: ${category || 'General'}
Generated: ${new Date().toLocaleDateString()}

${content}`

    try {
      await navigator.clipboard.writeText(notionContent)
      setCopiedFormat('notion')
      setTimeout(() => setCopiedFormat(null), 2000)
      onExportComplete?.('notion')
    } catch (err) {
      logger.error('Failed to copy Notion format', err)
    }
  }

  const exportOptions = [
    {
      id: 'clipboard',
      label: 'Copy to Clipboard',
      description: 'Copy prompt text directly',
      icon: Copy,
      action: handleCopyToClipboard,
      primary: true
    },
    {
      id: 'markdown',
      label: 'Download as Markdown',
      description: 'Formatted .md file',
      icon: FileText,
      action: handleDownloadMarkdown
    },
    {
      id: 'text',
      label: 'Download as Text',
      description: 'Plain .txt file',
      icon: File,
      action: handleDownloadText
    },
    {
      id: 'notion',
      label: 'Copy for Notion',
      description: 'Formatted for Notion paste',
      icon: Copy,
      action: handleNotionFormat
    }
  ]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-optimi-primary text-white rounded-lg hover:bg-optimi-primary/90 transition-colors text-sm font-medium"
      >
        <Download className="w-4 h-4" />
        <span>Export</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <div className="p-2">
              <div className="text-xs font-medium text-gray-500 px-3 py-2">Export Options</div>
              {exportOptions.map((option) => {
                const Icon = option.icon
                const isCompleted = copiedFormat === option.id
                
                return (
                  <button
                    key={option.id}
                    onClick={() => {
                      option.action()
                      if (option.id !== 'markdown' && option.id !== 'text') {
                        setIsOpen(false)
                      }
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-gray-50 transition-colors text-left ${
                      option.primary ? 'border-b border-gray-100' : ''
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Icon className="w-4 h-4 text-gray-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className={`text-sm font-medium ${
                        isCompleted ? 'text-green-600' : 'text-gray-900'
                      }`}>
                        {isCompleted ? 'Exported!' : option.label}
                      </div>
                      <div className="text-xs text-gray-500">
                        {option.description}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
            
            <div className="border-t border-gray-100 p-3">
              <div className="text-xs text-gray-500 text-center">
                Professional prompts ready for any platform
              </div>
            </div>
          </div>
          
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
        </>
      )}
    </div>
  )
}