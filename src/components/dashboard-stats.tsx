'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui'
import { LoadingSpinner } from '@/components/loading-spinner'

export function DashboardStats() {
  const [stats, setStats] = useState({
    scheduled: 0,
    publishedToday: 0,
    connections: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // Fetch post stats
      const postsResponse = await fetch('/api/posts?stats=true')
      const postsData = await postsResponse.json()

      // Fetch connections count
      const connectionsResponse = await fetch('/api/connections')
      const connectionsData = await connectionsResponse.json()

      if (postsData.success && connectionsData.success) {
        setStats({
          scheduled: postsData.data.pending || 0,
          publishedToday: postsData.data.published || 0,
          connections: connectionsData.data?.length || 0,
        })
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="h-32 flex items-center justify-center">
            <LoadingSpinner size="sm" />
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Scheduled Posts
          </h3>
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-xl">
              schedule
            </span>
          </div>
        </div>
        <p className="text-3xl font-bold text-slate-900 dark:text-white">
          {stats.scheduled}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Posts in queue
        </p>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Published Today
          </h3>
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-xl">
              check_circle
            </span>
          </div>
        </div>
        <p className="text-3xl font-bold text-slate-900 dark:text-white">
          {stats.publishedToday}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Successfully posted
        </p>
      </Card>

      <Card className="sm:col-span-2 lg:col-span-1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Connected Accounts
          </h3>
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <span className="material-symbols-outlined text-purple-600 dark:text-purple-400 text-xl">
              link
            </span>
          </div>
        </div>
        <p className="text-3xl font-bold text-slate-900 dark:text-white">
          {stats.connections}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Social media accounts
        </p>
      </Card>
    </div>
  )
}
