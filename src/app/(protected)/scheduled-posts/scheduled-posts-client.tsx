'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui'
import { PostList } from '@/components/post-list'
import { PostStatus, ScheduledPost } from '@/types'

export function ScheduledPostsClient({ initialPosts = [] }: { initialPosts: ScheduledPost[] }) {
  const [statusFilter, setStatusFilter] = useState<PostStatus | 'all'>('all')

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
        <div className="mb-8 flex flex-wrap justify-center gap-3 p-1">
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
        </div>

        {/* Post List */}
        <PostList statusFilter={statusFilter} initialPosts={initialPosts} />
      </div>
    </div>
  )
}

