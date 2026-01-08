'use client'

import { useState, useEffect, useRef } from 'react'
import { PostCard } from '@/components/posts/post-card'
import { EmptyState } from '@/components/shared/empty-state'
import { Button, Modal } from '@/components/ui'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { useToast } from '@/components/providers/toast-provider'
import { ScheduledPost, PostStatus } from '@/types'
import Link from 'next/link'

export type DateFilter = 'latest' | 'older' | 'all'

interface PostListProps {
  statusFilter?: PostStatus | 'all'
  initialPosts?: ScheduledPost[]
  dateFilter?: DateFilter
  selectedIds?: string[]
  onToggleSelection?: (id: string, selected: boolean) => void
  onPostsLoaded?: (posts: ScheduledPost[]) => void
}

export function PostList({ 
  statusFilter = 'all', 
  initialPosts = [], 
  dateFilter = 'latest',
  selectedIds = [],
  onToggleSelection,
  onPostsLoaded
}: PostListProps) {
  const [posts, setPosts] = useState<ScheduledPost[]>(initialPosts)
  const [isLoading, setIsLoading] = useState(initialPosts.length === 0)
  const isFirstRender = useRef(true)
  
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; post: ScheduledPost | null }>({
    isOpen: false,
    post: null,
  })
  const toast = useToast()

  // Notify parent of loaded posts whenever posts change
  useEffect(() => {
    if (onPostsLoaded) {
      // Filter first? Usually parent wants to know about ALL fetched posts to handle "Select All" correctly
      // But if we only show filtered posts, "Select All" should probably only select visible ones.
      // Let's pass the filtered posts to be safe, or handle logic in parent.
      // For now, let's pass all fetched posts matching statusFilter.
      onPostsLoaded(posts)
    }
  }, [posts, onPostsLoaded])

  useEffect(() => {
    // Skip the first fetch if we already have initial data for the default filter
    if (isFirstRender.current) {
      isFirstRender.current = false
      if (initialPosts.length > 0 && statusFilter === 'all') {
        setIsLoading(false)
        return
      }
    }
    fetchPosts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter])

  const fetchPosts = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') {
        params.append('status', statusFilter)
      }

      const response = await fetch(`/api/posts?${params}`)
      const data = await response.json()

      if (data.success) {
        setPosts(data.data || [])
      } else {
        toast.error('Failed to load posts')
      }
    } catch (error) {
      toast.error('An error occurred while loading posts')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteModal.post) return

    try {
      const response = await fetch(`/api/posts/${deleteModal.post.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Post deleted successfully')
        setPosts(posts.filter((p) => p.id !== deleteModal.post!.id))
        setDeleteModal({ isOpen: false, post: null })
      } else {
        toast.error('Failed to delete post')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  // Client-side date filtering
  const filteredPosts = posts.filter(post => {
    if (dateFilter === 'all') return true
    
    // For pending posts, use scheduled_at. For published/failed, use published_at or created_at
    const dateToCheck = new Date(post.status === 'pending' ? post.scheduled_at : (post.published_at || post.created_at))
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    if (dateFilter === 'latest') {
      return dateToCheck >= thirtyDaysAgo
    } else { // 'older'
      return dateToCheck < thirtyDaysAgo
    }
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (filteredPosts.length === 0) {
    return (
      <EmptyState
        icon="event_note"
        title={
          statusFilter === 'all'
            ? 'No posts found'
            : `No ${statusFilter} posts`
        }
        description={
          posts.length > 0 
            ? `You have posts, but none match the "${dateFilter}" filter.` 
            : "Create your first post to get started with automated social media scheduling."
        }
        action={
          <Link href="/create-post">
            <Button variant="primary" size="md">
              <span className="material-symbols-outlined text-xl">add</span>
              <span>Create Post</span>
            </Button>
          </Link>
        }
      />
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            selected={selectedIds.includes(post.id)}
            onSelect={(checked) => onToggleSelection?.(post.id, checked)}
            onDelete={(post) => setDeleteModal({ isOpen: true, post })}
          />
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, post: null })}
        title="Delete Post"
        description="Are you sure you want to delete this scheduled post? This action cannot be undone."
        size="sm"
      >
        <div className="flex gap-3 justify-end mt-6">
          <Button
            variant="secondary"
            onClick={() => setDeleteModal({ isOpen: false, post: null })}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            <span className="material-symbols-outlined text-xl">delete</span>
            <span>Delete</span>
          </Button>
        </div>
      </Modal>
    </>
  )
}