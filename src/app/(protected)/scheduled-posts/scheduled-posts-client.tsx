'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui'
import { PostList, DateFilter } from '@/components/posts/post-list'
import { PostStatus, ScheduledPost } from '@/types'
import { useToast } from '@/components/providers/toast-provider'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

export function ScheduledPostsClient({ initialPosts = [] }: { initialPosts: ScheduledPost[] }) {
  const [statusFilter, setStatusFilter] = useState<PostStatus | 'all'>('all')
  const [dateFilter, setDateFilter] = useState<DateFilter>('latest')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [currentPosts, setCurrentPosts] = useState<ScheduledPost[]>(initialPosts) // Posts currently loaded in list
  const [isClearing, setIsClearing] = useState(false)
  const [isDeletingBatch, setIsDeletingBatch] = useState(false)
  
  const toast = useToast()
  const router = useRouter()

  // Calculate visible posts based on local filters (to know what 'Select All' applies to)
  const visiblePosts = useMemo(() => {
    return currentPosts.filter(post => {
      // Date filter logic mirrors PostList
      if (dateFilter === 'all') return true
      const dateToCheck = new Date(post.status === 'pending' ? post.scheduled_at : (post.published_at || post.created_at))
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      return dateFilter === 'latest' ? dateToCheck >= thirtyDaysAgo : dateToCheck < thirtyDaysAgo
    })
  }, [currentPosts, dateFilter])

  const handleClearHistory = async () => {
    if (!window.confirm('Are you sure you want to delete all published and failed posts? This action cannot be undone.')) {
      return
    }

    setIsClearing(true)
    try {
      const response = await fetch('/api/posts/cleanup', {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('History cleared successfully')
        router.refresh()
        window.location.reload()
      } else {
        toast.error('Failed to clear history')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setIsClearing(false)
    }
  }

  const handleBatchDelete = async () => {
    if (selectedIds.length === 0) return
    if (!window.confirm(`Delete ${selectedIds.length} selected posts?`)) return

    setIsDeletingBatch(true)
    try {
      const response = await fetch('/api/posts/batch', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postIds: selectedIds }),
      })

      if (response.ok) {
        toast.success(`Deleted ${selectedIds.length} posts`)
        setSelectedIds([])
        router.refresh()
        // We also need to remove them from local state ideally, but page reload/refresh might handle it.
        // For smoother UX, let's refresh page.
        window.location.reload()
      } else {
        toast.error('Failed to delete posts')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setIsDeletingBatch(false)
    }
  }

  const toggleSelection = (id: string, selected: boolean) => {
    setSelectedIds(prev => 
      selected ? [...prev, id] : prev.filter(pId => pId !== id)
    )
  }

  const handleSelectAll = () => {
    if (selectedIds.length === visiblePosts.length && visiblePosts.length > 0) {
      // Deselect all
      setSelectedIds([])
    } else {
      // Select all visible
      setSelectedIds(visiblePosts.map(p => p.id))
    }
  }

  const FilterTab = ({ label, value, icon }: { label: string, value: PostStatus | 'all', icon?: string }) => (
    <button
      onClick={() => {
        setStatusFilter(value)
        setSelectedIds([]) // Clear selection on filter change
      }}
      className={cn(
        "relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2",
        statusFilter === value
          ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md"
          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
      )}
    >
      {icon && <span className="material-symbols-outlined text-[18px]">{icon}</span>}
      {label}
    </button>
  )

  const isAllSelected = visiblePosts.length > 0 && selectedIds.length === visiblePosts.length

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50 p-6 md:p-12 pb-32">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Scheduled Posts
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
              Overview of your upcoming content calendar and publishing history.
            </p>
          </div>
          
          <Link href="/create-post">
            <Button variant="primary" size="lg" className="rounded-full px-8 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
              <span className="material-symbols-outlined mr-2">add</span>
              Create Post
            </Button>
          </Link>
        </div>

        {/* Controls Toolbar */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white dark:bg-slate-900/50 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          
          {/* Status Filters */}
          <div className="flex items-center gap-1 p-1 overflow-x-auto w-full xl:w-auto no-scrollbar">
            <FilterTab label="All" value="all" />
            <FilterTab label="Pending" value="pending" icon="schedule" />
            <FilterTab label="Published" value="published" icon="check_circle" />
            <FilterTab label="Failed" value="failed" icon="error" />
          </div>

          <div className="h-px w-full xl:w-px xl:h-8 bg-slate-200 dark:bg-slate-700 mx-2" />

          {/* Date & Bulk Controls */}
          <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto justify-between xl:justify-end px-2">
             
             {/* Time Range Toggle */}
             <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                <button
                  onClick={() => setDateFilter('latest')}
                  className={cn(
                    "px-3 py-1.5 text-xs font-semibold rounded-md transition-all",
                    dateFilter === 'latest' 
                      ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white" 
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
                  )}
                >
                  Latest (30d)
                </button>
                <button
                  onClick={() => setDateFilter('older')}
                  className={cn(
                    "px-3 py-1.5 text-xs font-semibold rounded-md transition-all",
                    dateFilter === 'older' 
                      ? "bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white" 
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
                  )}
                >
                  Older
                </button>
             </div>

             {/* Select All Checkbox */}
             <div className="flex items-center gap-2">
               <input 
                 type="checkbox" 
                 id="selectAll"
                 checked={isAllSelected}
                 onChange={handleSelectAll}
                 className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
               />
               <label htmlFor="selectAll" className="text-sm font-medium text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                 Select All
               </label>
             </div>

             {/* Clear History (Global) */}
             <button
              onClick={handleClearHistory}
              disabled={isClearing}
              className="ml-auto xl:ml-2 text-xs font-medium text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
              {isClearing ? 'Clearing...' : 'Clear History'}
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <PostList 
          statusFilter={statusFilter} 
          initialPosts={initialPosts} 
          dateFilter={dateFilter}
          selectedIds={selectedIds}
          onToggleSelection={toggleSelection}
          onPostsLoaded={setCurrentPosts}
        />
      </div>

      {/* Bulk Action Floating Bar */}
      <div className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-slate-800 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-6 transition-all duration-300 z-50 border border-slate-700",
        selectedIds.length > 0 ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0 pointer-events-none"
      )}>
         <span className="font-semibold">{selectedIds.length} selected</span>
         <div className="h-4 w-px bg-slate-700" />
         <button 
           onClick={() => setSelectedIds([])}
           className="text-sm text-slate-400 hover:text-white transition-colors"
         >
           Cancel
         </button>
         <Button 
           variant="danger" 
           size="sm" 
           onClick={handleBatchDelete} 
           isLoading={isDeletingBatch}
           className="rounded-full px-6"
         >
           Delete Selection
         </Button>
      </div>

    </div>
  )
}
