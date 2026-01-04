'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui'
import { PostList } from '@/components/post-list'
import { PostStatus, ScheduledPost } from '@/types'
import { useToast } from '@/components/providers/toast-provider'
import { useRouter } from 'next/navigation'

export function ScheduledPostsClient({ initialPosts = [] }: { initialPosts: ScheduledPost[] }) {
  const [statusFilter, setStatusFilter] = useState<PostStatus | 'all'>('all')
  const [isClearing, setIsClearing] = useState(false)
  const toast = useToast()
  const router = useRouter()

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
        // Refresh the page data
        router.refresh()
        // Reload location to force re-fetch of initialPosts if router.refresh is not sufficient in this context
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

  return (
    <div className="p-4 md:p-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10 flex flex-col sm:flex-row items-center justify-center sm:justify-between text-center sm:text-left gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-black text-gradient pb-1">
              Scheduled Posts
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg">
              Manage and track your scheduled social media posts
            </p>
          </div>
          <Link href="/create-post" className="w-full sm:w-auto">
            <Button variant="primary" size="md" className="w-full sm:w-auto rounded-xl">
              <span className="material-symbols-outlined text-xl">add</span>
              <span>New Post</span>
            </Button>
          </Link>
        </div>

        {/* Filters - Centered and with padding for shadows */}
        <div className="mb-8 flex flex-wrap justify-center items-center gap-3 p-1">
          <Button
            variant={statusFilter === 'all' ? 'secondary' : 'ghost'}
            size="sm"
            className="rounded-full px-5"
            onClick={() => setStatusFilter('all')}
          >
            All Posts
          </Button>
          <Button
            variant={statusFilter === 'pending' ? 'secondary' : 'ghost'}
            size="sm"
            className="rounded-full px-5"
            onClick={() => setStatusFilter('pending')}
          >
            <span className="material-symbols-outlined text-base">schedule</span>
            Pending
          </Button>
          <Button
            variant={statusFilter === 'published' ? 'secondary' : 'ghost'}
            size="sm"
            className="rounded-full px-5"
            onClick={() => setStatusFilter('published')}
          >
            <span className="material-symbols-outlined text-base">check_circle</span>
            Published
          </Button>
          <Button
            variant={statusFilter === 'failed' ? 'secondary' : 'ghost'}
            size="sm"
            className="rounded-full px-5"
            onClick={() => setStatusFilter('failed')}
          >
            <span className="material-symbols-outlined text-base">error</span>
            Failed
          </Button>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2 hidden sm:block" />

          <Button
            variant="ghost"
            size="sm"
            className="rounded-full px-5 text-slate-500 hover:text-red-600 hover:bg-red-50"
            onClick={handleClearHistory}
            disabled={isClearing}
          >
            <span className="material-symbols-outlined text-base">delete_sweep</span>
            {isClearing ? 'Clearing...' : 'Clear History'}
          </Button>
        </div>

        {/* Post List */}
        <PostList statusFilter={statusFilter} initialPosts={initialPosts} />
      </div>
    </div>
  )
}

