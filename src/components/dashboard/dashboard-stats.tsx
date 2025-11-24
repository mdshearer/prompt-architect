'use client'

import { FileText, Heart, Grid, TrendingUp } from 'lucide-react'

interface Stats {
  totalPrompts: number
  favoritePrompts: number
  categoriesUsed: number
  successRate: number
}

interface DashboardStatsProps {
  stats: Stats
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  const statCards = [
    {
      title: 'Total Prompts',
      value: stats.totalPrompts,
      icon: FileText,
      color: 'text-optimi-primary',
      bgColor: 'bg-optimi-primary/10',
      description: 'Prompts created'
    },
    {
      title: 'Favorites',
      value: stats.favoritePrompts,
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      description: 'Starred prompts'
    },
    {
      title: 'Categories',
      value: stats.categoriesUsed,
      icon: Grid,
      color: 'text-optimi-green',
      bgColor: 'bg-optimi-green/10',
      description: 'Types explored'
    },
    {
      title: 'Avg Rating',
      value: stats.successRate.toFixed(1),
      icon: TrendingUp,
      color: 'text-optimi-blue',
      bgColor: 'bg-optimi-blue/10',
      description: 'Success score',
      suffix: '/5.0'
    }
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900">Overview</h2>
        <p className="text-gray-600 text-sm mt-1">Your prompt development metrics</p>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {statCards.map((stat) => {
            const Icon = stat.icon
            
            return (
              <div key={stat.title} className="text-center">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.value}
                    {stat.suffix && (
                      <span className="text-lg font-normal text-gray-500">{stat.suffix}</span>
                    )}
                  </div>
                  <div className="text-sm font-medium text-gray-900">{stat.title}</div>
                  <div className="text-xs text-gray-500">{stat.description}</div>
                </div>
              </div>
            )
          })}
        </div>
        
        {/* Progress Indicators */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">Custom Instructions</span>
                <span className="font-medium text-gray-900">
                  {Math.round((stats.totalPrompts * 0.4))} prompts
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-optimi-primary h-2 rounded-full transition-all duration-500" 
                  style={{ width: '40%' }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">Projects & Gems</span>
                <span className="font-medium text-gray-900">
                  {Math.round((stats.totalPrompts * 0.35))} prompts
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-optimi-green h-2 rounded-full transition-all duration-500" 
                  style={{ width: '35%' }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">Thread Prompts</span>
                <span className="font-medium text-gray-900">
                  {Math.round((stats.totalPrompts * 0.25))} prompts
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-optimi-blue h-2 rounded-full transition-all duration-500" 
                  style={{ width: '25%' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}