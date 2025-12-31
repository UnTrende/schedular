'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ClientNavbar } from '@/components/client-navbar'
import { Button } from '@/components/ui'
import { PostList } from '@/components/post-list'
import { PostStatus } from '@/types'

export default function ScheduledPostsPage() {
  const [statusFilter, setStatusFilter] = useState<PostStatus | 'all'>('all')

  return (
    <>
      <ClientNavbar />
      <main className="min-h-screen p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2">
                Scheduled Posts
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg">
                Manage and track your scheduled social media posts
              </p>
            </div>
            <Link href="/create-post">
              <Button variant="primary" size="md">
                <span className="material-symbols-outlined text-xl">add</span>
                <span>New Post</span>
              </Button>
            </Link>
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-wrap gap-2">
            <Button
              variant={statusFilter === 'all' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setStatusFilter('all')}
            >
              All Posts
            </Button>
            <Button
              variant={statusFilter === 'pending' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setStatusFilter('pending')}
            >
              <span className="material-symbols-outlined text-base">schedule</span>
              Pending
            </Button>
            <Button
              variant={statusFilter === 'published' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setStatusFilter('published')}
            >
              <span className="material-symbols-outlined text-base">check_circle</span>
              Published
            </Button>
            <Button
              variant={statusFilter === 'failed' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setStatusFilter('failed')}
            >
              <span className="material-symbols-outlined text-base">error</span>
              Failed
            </Button>
          </div>

          {/* Post List */}
          <PostList statusFilter={statusFilter} />
        </div>
      </main>
    </>
  )
}
