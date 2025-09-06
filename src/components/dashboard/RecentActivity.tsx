'use client'

import { Star, Calendar, Tag, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface Activity {
  id: string
  title: string
  category: string
  created_at: Date
  success_rating?: number
}

interface RecentActivityProps {
  activities: Activity[]
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'custom_instructions': return 'Custom Instructions'
      case 'projects_gems': return 'Projects & Gems'
      case 'threads': return 'Thread Prompts'
      default: return category
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'custom_instructions': return 'text-optimi-primary bg-optimi-primary/10'
      case 'projects_gems': return 'text-optimi-green bg-optimi-green/10'
      case 'threads': return 'text-optimi-blue bg-optimi-blue/10'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return 'Yesterday'
    return date.toLocaleDateString()
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            <p className="text-gray-600 text-sm mt-1">Your latest prompt creations</p>
          </div>
          <Link 
            href="/library" 
            className="flex items-center space-x-1 text-sm text-optimi-primary hover:text-optimi-primary/80 font-medium"
          >
            <span>View all</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
      
      <div className="divide-y divide-gray-100">
        {activities.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tag className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">No recent activity</h3>
            <p className="text-xs text-gray-500 mb-4">Create your first prompt to see activity here</p>
            <Link 
              href="/" 
              className="inline-flex items-center px-4 py-2 bg-optimi-primary text-white text-sm font-medium rounded-lg hover:bg-optimi-primary/90 transition-colors"
            >
              Start Building
            </Link>
          </div>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-medium text-gray-900 hover:text-optimi-primary cursor-pointer transition-colors">
                      {activity.title}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(activity.category)}`}>
                      {getCategoryLabel(activity.category)}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(activity.created_at)}</span>
                    </div>
                    
                    {activity.success_rating && (
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span>{activity.success_rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <button className="flex items-center space-x-1 text-sm text-gray-400 hover:text-optimi-primary transition-colors px-2 py-1 rounded-lg hover:bg-optimi-primary/10">
                  <span>View</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      
      {activities.length > 0 && (
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              Showing {Math.min(5, activities.length)} of {activities.length} recent activities
            </div>
            <Link 
              href="/library" 
              className="text-xs text-optimi-primary hover:text-optimi-primary/80 font-medium"
            >
              View complete history
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}