'use client'

import { Plus, BookOpen, Settings, Users, Zap, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function QuickActions() {
  const quickActions = [
    {
      title: 'Create New Prompt',
      description: 'Start building a new AI prompt',
      icon: Plus,
      href: '/',
      color: 'text-optimi-primary',
      bgColor: 'bg-optimi-primary/10',
      primary: true
    },
    {
      title: 'Browse Library',
      description: 'View your saved prompts',
      icon: BookOpen,
      href: '/library',
      color: 'text-optimi-green',
      bgColor: 'bg-optimi-green/10'
    },
    {
      title: 'Account Settings',
      description: 'Manage your preferences',
      icon: Settings,
      href: '/settings',
      color: 'text-gray-600',
      bgColor: 'bg-gray-100'
    }
  ]

  const resources = [
    {
      title: 'Best Practices Guide',
      description: 'Learn prompt engineering fundamentals',
      icon: Zap,
      href: '/guides/best-practices'
    },
    {
      title: 'Community Templates',
      description: 'Explore prompts from other users',
      icon: Users,
      href: '/community'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
          <p className="text-gray-600 text-sm mt-1">Jump into your workflow</p>
        </div>
        
        <div className="p-6 space-y-4">
          {quickActions.map((action) => {
            const Icon = action.icon
            
            return (
              <Link
                key={action.title}
                href={action.href}
                className={`block p-4 rounded-lg border-2 border-transparent hover:border-gray-200 transition-all group ${
                  action.primary ? 'bg-optimi-primary/5 hover:bg-optimi-primary/10' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-10 h-10 ${action.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${action.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-medium ${action.primary ? 'text-gray-900' : 'text-gray-900'} group-hover:text-optimi-primary transition-colors`}>
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {action.description}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-optimi-primary transition-colors flex-shrink-0 mt-1" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Resources */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Resources</h2>
          <p className="text-gray-600 text-sm mt-1">Improve your prompt skills</p>
        </div>
        
        <div className="p-6 space-y-4">
          {resources.map((resource) => {
            const Icon = resource.icon
            
            return (
              <Link
                key={resource.title}
                href={resource.href}
                className="block p-4 rounded-lg hover:bg-gray-50 transition-colors group border border-transparent hover:border-gray-200"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-gray-600 group-hover:text-optimi-primary transition-colors" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm group-hover:text-optimi-primary transition-colors">
                      {resource.title}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1">
                      {resource.description}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-optimi-primary transition-colors flex-shrink-0" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Usage Stats */}
      <div className="bg-gradient-to-br from-optimi-primary/10 to-optimi-blue/10 rounded-xl p-6">
        <div className="text-center">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Zap className="w-6 h-6 text-optimi-primary" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Upgrade Available</h3>
          <p className="text-sm text-gray-600 mb-4">
            Get unlimited prompts, advanced features, and priority support
          </p>
          <Link
            href="/upgrade"
            className="inline-flex items-center px-4 py-2 bg-optimi-primary text-white text-sm font-medium rounded-lg hover:bg-optimi-primary/90 transition-colors"
          >
            Upgrade Now
          </Link>
        </div>
      </div>
    </div>
  )
}