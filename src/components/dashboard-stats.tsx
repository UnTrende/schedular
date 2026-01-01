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
      {/* Scheduled Posts - Premium Indigo */}
      <div className="group relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] shadow-[0_2px_10px_rgba(0,0,0,0.03)] ring-1 ring-slate-200 dark:ring-slate-800">
        <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
             <span className="material-symbols-outlined text-2xl">schedule</span>
          </div>
        </div>
        
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div>
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Scheduled Posts</h3>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {stats.scheduled}
              </span>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                +4 this week
              </span>
            </div>
          </div>
          <div className="mt-4 w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
             <div className="bg-indigo-500 h-full rounded-full w-[60%]"></div>
          </div>
        </div>
      </div>

      {/* Published Today - Premium Emerald */}
      <div className="group relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] shadow-[0_2px_10px_rgba(0,0,0,0.03)] ring-1 ring-slate-200 dark:ring-slate-800">
        <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
             <span className="material-symbols-outlined text-2xl">check_circle</span>
          </div>
        </div>
        
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div>
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Published Today</h3>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {stats.publishedToday}
              </span>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                100% success
              </span>
            </div>
          </div>
          <div className="mt-4 w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
             <div className="bg-emerald-500 h-full rounded-full w-full"></div>
          </div>
        </div>
      </div>

      {/* Connected Accounts - Premium Violet */}
      <div className="group relative overflow-hidden bg-white dark:bg-slate-900 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] shadow-[0_2px_10px_rgba(0,0,0,0.03)] ring-1 ring-slate-200 dark:ring-slate-800 sm:col-span-2 lg:col-span-1">
        <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 rounded-xl bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center text-violet-600 dark:text-violet-400">
             <span className="material-symbols-outlined text-2xl">link</span>
          </div>
        </div>
        
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div>
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Connections</h3>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                {stats.connections}
              </span>
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                Stable
              </span>
            </div>
          </div>
          <div className="mt-4 flex -space-x-2">
            {[1,2,3].map(i => (
              <div key={i} className="w-6 h-6 rounded-full bg-slate-200 ring-2 ring-white dark:ring-slate-900 flex items-center justify-center text-[8px] text-slate-500">
                 <span className="material-symbols-outlined text-[10px]">person</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
