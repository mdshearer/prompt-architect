'use client'

import { useState, useEffect } from 'react'
import DashboardStats from '@/components/dashboard/dashboard-stats'
import RecentActivity from '@/components/dashboard/recent-activity'
import QuickActions from '@/components/dashboard/quick-actions'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface DashboardData {
  stats: {
    totalPrompts: number
    favoritePrompts: number
    categoriesUsed: number
    successRate: number
  }
  recentActivity: Array<{
    id: string
    title: string
    category: string
    created_at: Date
    success_rating?: number
  }>
}

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mock dashboard data - replace with Supabase integration
    const mockData: DashboardData = {
      stats: {
        totalPrompts: 12,
        favoritePrompts: 5,
        categoriesUsed: 3,
        successRate: 4.6
      },
      recentActivity: [
        {
          id: '1',
          title: 'Business Strategy Assistant',
          category: 'custom_instructions',
          created_at: new Date('2024-01-15'),
          success_rating: 4.8
        },
        {
          id: '2',
          title: 'Code Review Expert',
          category: 'projects_gems',
          created_at: new Date('2024-01-14'),
          success_rating: 4.6
        },
        {
          id: '3',
          title: 'Technical Documentation Writer',
          category: 'threads',
          created_at: new Date('2024-01-13'),
          success_rating: 4.7
        },
        {
          id: '4',
          title: 'Marketing Content Creator',
          category: 'custom_instructions',
          created_at: new Date('2024-01-12'),
          success_rating: 4.5
        },
        {
          id: '5',
          title: 'Data Analysis Expert',
          category: 'projects_gems',
          created_at: new Date('2024-01-11'),
          success_rating: 4.9
        }
      ]
    }

    // Simulate loading
    setTimeout(() => {
      setDashboardData(mockData)
      setIsLoading(false)
    }, 1000)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-optimi-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Failed to load dashboard data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link 
              href="/" 
              className="flex items-center space-x-2 text-gray-600 hover:text-optimi-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to Home</span>
            </Link>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Track your prompt development progress and performance
              </p>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-gray-500">Welcome back</div>
              <div className="text-lg font-semibold text-gray-900">Prompt Architect</div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <DashboardStats stats={dashboardData.stats} />
            <RecentActivity activities={dashboardData.recentActivity} />
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  )
}